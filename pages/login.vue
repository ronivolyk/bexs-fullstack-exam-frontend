<template>
  <div
    style="width: 20%; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);"
  >
    <b-field label="Enter your username">
      <b-input
        v-model="username"
        v-on:keyup.native.enter="login"
        placeholder="Username"
      />
    </b-field>
    <b-button @click="login" class="is-success">Log In</b-button>
  </div>
</template>

<script>
export default {
  middleware: 'beforeLogin',

  data() {
    return {
      username: ''
    }
  },

  methods: {
    async login() {
      const resultLogin = await this.$store.dispatch('login', this.username)

      if (resultLogin.logged) {
        this.$router.push('/')
      } else {
        const message = resultLogin.error
        this.$buefy.toast.open({ message, type: 'is-danger' })
      }
    }
  }
}
</script>
