<template>
  <div>
    <input
      ref="fileInput"
      type="file"
      value="upload"
      accept=".jpg, .jpeg, .png, .gif, .webp"
      required
    />
    <progress ref="progress" value="0" max="100">0%</progress>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/storage'

export default {
  data() {
    return {
      file: null,
      metadata: null,
      error: null,
      fileMax: 1000000, // megabyte
      fileTypes: ['image/gif', 'image/jpeg', 'image/png', 'image/webp'],
      errorMessage: {
        fileTooBig: "try uploading an image that's smaller than 1mb",
        wrongFormat: "sorry, that image format isn't supported",
        noFile: 'try selecting an image next time, babe',
      },
    }
  },
  methods: {
    validateAndUpload(event) {
      this.error = null
      if (this.$refs.fileInput.value === '') {
        this.error = this.errorMessage.noFile
        return
      }

      // get file
      this.file = this.$refs.fileInput.files[0]
      this.metadata = { contentType: this.file.type }

      // is the file less than fileMax?
      if (!this.fileIsSmallEnough()) {
        this.error = this.errorMessage.fileTooBig
      }
      // is the image format supported?
      else if (!this.fileIsRightFormat()) {
        this.error = this.errorMessage.wrongFormat
      }
      // are we good on both fronts?
      else if (this.fileIsSmallEnough() && this.fileIsRightFormat()) {
        this.uploadFile()
      }
    },
    // make sure the file isn't too big
    fileIsSmallEnough() {
      return this.file.size < this.fileMax
    },
    // for security reasons, let's double check the file format
    fileIsRightFormat() {
      return this.fileTypes.includes(this.file.type)
    },
    uploadFile() {
      // Upload file and metadata to the object 'images/mountains.jpg'
      // order: post_id/name
      const uploadTask = firebase
        .storage()
        .ref(
          `images/${this.$store.state.user.uid}/${new Date().getTime()}-${
            this.file.name
          }`
        )
        .put(this.file, this.metadata)

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        'state_changed',
        snapshot => {
          // Set progress percentage
          this.$refs.progress.value =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100

          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
          }
        },
        error => {
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              this.error = {
                code: error.code,
                message: `sorry babe, you can't upload that! error: ${error.code}`,
              }
              break

            case 'storage/canceled':
              // User canceled the upload
              this.error = {
                code: error.code,
                message: `plz try again! error: ${error.code}`,
              }
              break

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              this.error = {
                code: error.code,
                message: `not sure what happened. plz try again! error: ${error.code}`,
              }
              break
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(imageUrl => {
            this.$app.$emit('imageUploaded', imageUrl)
          })
        }
      )
    },
    reset() {
      this.file = null
      this.metadata = null
      this.error = null
      this.$refs.progress.value = 0
    },
  },
}
</script>
