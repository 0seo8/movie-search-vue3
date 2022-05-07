<template>
  <div class="about">
    <div class="photo">
      <img
        :src="image"
        :alt="name" />
    </div>
    <div class="name">
      {{ name }}
    </div>
    <div>{{ email }}</div>
    <div>{{ blog }}</div>
    <div>{{ phone }}</div>
  </div>
</template>

<script>
export default {
  computed: {
    image() {
      return this.$store.state.about.image
    }
  },
  name() {
      return this.$store.state.about.name
  },
  email() {
      return this.$store.state.about.email
  },
  blog() {
      return this.$store.state.about.blog
  },
  phone() {
      return this.$store.state.about.phone
  }
}
</script>

<style lang="scss" scoped>
@import "~/scss/main";
  .about {
    text-align: center;
    .photo {
      width: 25px;
      height: 250px;
      margin: 40px auto 20px;
      padding: 30px;
      border: 10px solid $gray-300;
      border-radius: 50%;
      box-sizing: border-box;
      background-color: $gray-200;
      img {
        width: 100%;
      }
    }
    .name {
      font-size: 40px;
      font-family: "Oswald", snas-serif;
      margin-bottom: 20px;
    }
  }
</style>