import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAAKtCvHpebAXJj17NOdX7ci7e2mxJ-u1Q',
  authDomain: 'hi-it-me.firebaseapp.com',
  databaseURL: 'https://hi-it-me.firebaseio.com',
  projectId: 'hi-it-me',
  storageBucket: 'hi-it-me.appspot.com',
  messagingSenderId: '1075343001583',
  appId: '1:1075343001583:web:f77294aed61a0d8c85181a',
  measurementId: 'G-97QJEM3MHL',
}

// Initialize Firebase
const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : null

export const auth = firebase.auth()
export const DB = firebase.database()
export const StoreDB = firebase.firestore()

// export default firebase
export default (context, inject) => {
  // Inject our firebase app's instance into Nuxt
  // Accessible via `this.$firebase` or `$firebase`
  inject('firebase', app)
  context.$firebase = app
}
