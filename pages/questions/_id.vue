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
    <p>
      <span
        @click="likeQuestion"
        class="subtitle is-6 has-text-grey"
        style="cursor: pointer;"
      >
        <b-icon icon="thumb-up-outline" /> {{ question.likes }}
      </span>
    </p>
    <section class="section">
      <b-table
        :data="question.answers"
        striped
        hoverable
        default-sort="creationDate"
        style="cursor: pointer;"
      >
        <template slot-scope="props">
          <b-table-column field="answer" label="Answer" sortable>
            {{ props.row.answer }}
          </b-table-column>
          <b-table-column field="user" label="Answered by" sortable>
            {{ props.row.user }}
          </b-table-column>
          <b-table-column field="creationDate" label="Answered at" sortable>
            {{ props.row.creationDate | datetime }}
          </b-table-column>
          <b-table-column field="likes" label="Likes" sortable numeric>
            <span @click="likeAnswer(props.row)">
              <b-icon icon="thumb-up-outline" />
              {{ props.row.likes }}
            </span>
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
            v-on:keyup.native.enter="answer"
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
  filters: {
    datetime: (dateString) =>
      moment(new Date(dateString)).format('DD/MM/YYYY HH:mm:ss')
  },

  data() {
    return {
      newAnswer: ''
    }
  },

  computed: {
    user() {
      return this.$store.getters.user
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
    },

    async likeQuestion() {
      await this.$axios.post(
        `http://localhost:8080/questions/${this.question._id}/like`
      )
      location.reload()
    },

    async likeAnswer(answer) {
      await this.$axios.post(
        `http://localhost:8080/questions/${this.question._id}/answers/${answer.position}/like`
      )
      location.reload()
    }
  }
}
</script>
