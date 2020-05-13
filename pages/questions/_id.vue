<template>
  <section class="section">
    <p>
      <span class="subtitle is-3 has-text-grey">{{ question.question }}</span>
    </p>
    <p>
      <span class="subtitle is-6 has-text-grey">
        Asked by {{ question.user }} at {{ question.creationDate | datetime }}
      </span>
    </p>
    <section class="section">
      <b-table
        :data="question.answers"
        striped
        hoverable
        style="cursor: pointer;"
      >
        <template slot-scope="props">
          <b-table-column field="answer" label="Answer">
            {{ props.row.answer }}
          </b-table-column>
          <b-table-column field="user" label="Answered by">
            {{ props.row.user }}
          </b-table-column>
          <b-table-column field="creationDate" label="Answered at">
            {{ props.row.creationDate | datetime }}
          </b-table-column>
        </template>

        <template slot="empty">
          <section class="section">
            <div class="content has-text-centered">
              <p class="subtitle has-text-grey">No answers found</p>
            </div>
          </section>
        </template>
      </b-table>
    </section>

    <section class="section">
      <div class="buttons">
        <p>
          <span class="subtitle is-4 has-text-grey">Answer the question:</span>
        </p>
        <b-field horizontal>
          <b-input
            v-model="newAnswer"
            placeholder="Type your answer here..."
            style="width: 500px;"
          />

          <p class="control">
            <b-button @click="answer" class="is-success">Answer</b-button>
          </p>
        </b-field>
      </div>
      <b-icon icon="arrow-left" size="is-small" />
      <router-link :to="{ path: '/' }">Back to questions list</router-link>
    </section>
  </section>
</template>

<script>
import * as moment from 'moment'

export default {
  data() {
    return {
      newAnswer: ''
    }
  },

  async asyncData(context) {
    const questionId = context.route.params.id

    const question = (
      await context.$axios.get(`http://localhost:8080/questions/${questionId}`)
    ).data

    return { question }
  },

  methods: {
    async answer() {
      const answer = {
        answer: this.newAnswer,
        user: this.user
      }

      await this.$axios.post(
        `http://localhost:8080/questions/${this.question._id}/answers`,
        answer
      )

      this.newAnswer = ''
      location.reload()
    }
  },

  computed: {
    user() {
      return this.$store.getters.user
    }
  },

  filters: {
    datetime: (dateString) =>
      moment(new Date(dateString)).format('DD/MM/YYYY HH:mm:ss')
  }
}
</script>
