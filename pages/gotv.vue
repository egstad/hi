<template>
  <ul class="posters">
    <li v-for="(poster, index) in posters" class="poster" :key="index">
      <img :src="poster.url" alt="" />
      <p>{{ poster.creator }}</p>
      <p>{{ poster.download }}</p>
    </li>
  </ul>
</template>

<style lang="scss">
h1 {
  font-size: 20vw;
}

.posters {
  display: grid;
  grid-gap: 20px;
  width: 100%;
  grid-template-columns: 1fr;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.poster {
  img {
    display: block;
    width: 100%;
    height: auto;
  }
}
</style>

<script>
export default {
  layout: 'gotv-layout',
  data() {
    return {
      posters: [
        {
          creator: 'will',
          url: '//placehold.it/400',
          download: 'download',
        },
        {
          creator: 'will',
          url: '//placehold.it/400',
          download: 'download',
        },
        {
          creator: 'will',
          url: '//placehold.it/400',
          download: 'download',
        },
        {
          creator: 'will',
          url: '//placehold.it/400x200',
          download: 'download',
        },
        {
          creator: 'will',
          url: '//placehold.it/400x100',
          download: 'download',
        },
        {
          creator: 'will',
          url: '//placehold.it/400x400',
          download: 'download',
        },
        {
          creator: 'will',
          url: '//placehold.it/400x500',
          download: 'download',
        },
        {
          creator: 'will',
          url: '//placehold.it/400x600',
          download: 'download',
        },
        {
          creator: 'will',
          url: '//placehold.it/400',
          download: 'download',
        },
      ],
    }
  },
}
</script>
