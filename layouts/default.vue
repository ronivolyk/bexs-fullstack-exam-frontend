<template>
  <div>
    <div>
      <section class="main-content">
        <b-navbar shadow fixed-top>
          <template slot="brand">
            <b-navbar-item :to="{ path: '/' }" tag="router-link">
              <h2 class="title has-text-grey">Ask your question!</h2>
            </b-navbar-item>
          </template>

          <template slot="start">
            <b-navbar-item v-show="isLogged" tag="div">
              <div class="buttons">
                <b-field horizontal>
                  <b-input
                    v-model="newQuestion"
                    placeholder="Type your question here..."
                    style="width: 500px;"
                  />

                  <p class="control">
                    <b-button @click="ask" class="is-success">Ask!</b-button>
                  </p>
                </b-field>
              </div>
            </b-navbar-item>
          </template>

          <template slot="end">
            <b-navbar-item v-show="isLogged" tag="div">
              <div class="buttons">
                <p>Hello, {{ user }}</p>

                <b-field horizontal>
                  <p class="control">
                    <b-button @click="logout" class="is-success">
                      Log Out
                    </b-button>
                  </p>
                </b-field>
              </div>
            </b-navbar-item>
          </template>
        </b-navbar>
        <div>
          <nuxt />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newQuestion: ''
    }
  },

  computed: {
    isLogged() {
      return this.$store.getters.isLogged
    },
    user() {
      return this.$store.getters.user
    }
  },

  methods: {
    async ask() {
      const question = {
        question: this.newQuestion,
        user: this.user
      }

      await this.$axios.post('http://localhost:8080/questions', question)

      this.newQuestion = ''
      location.reload()
    },
    logout() {
      this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  }
}
</script>
