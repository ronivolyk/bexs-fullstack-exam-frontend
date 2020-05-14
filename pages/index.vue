<template>
  <section class="section">
    <div class="buttons">
      <b-field horizontal>
        <b-input
          v-model="searchFor"
          v-on:keyup.native.enter="search"
          placeholder="Search..."
          style="width: 500px;"
        />

        <b-button @click="search" class="is-success">Search</b-button>
        <b-button @click="cleanSearch" class="is-success">Clean</b-button>
      </b-field>
      <b-field horizontal>
        <b-checkbox v-on:input="search" v-model="hideAnswered">
          Show only unanswered questions
        </b-checkbox>
      </b-field>
    </div>

    <h3 class="subtitle has-text-grey">
      Select a question below to view the answers:
    </h3>

    <b-table
      :data="questions"
      v-on:click="viewQuestion"
      striped
      hoverable
      default-sort="creationDate"
      style="cursor: pointer;"
    >
      <template slot-scope="props">
        <b-table-column field="question" label="Question" sortable>
          {{ props.row.question }}
        </b-table-column>
        <b-table-column field="user" label="Asked by" sortable>
          {{ props.row.user }}
        </b-table-column>
        <b-table-column field="creationDate" label="Asked at" sortable>
          {{ props.row.creationDate | datetime }}
        </b-table-column>
        <b-table-column
          field="numberOfAnswers"
          label="Answers"
          sortable
          numeric
        >
          {{ props.row.numberOfAnswers }}
        </b-table-column>
        <b-table-column field="likes" label="Likes" sortable numeric>
          <b-icon icon="thumb-up-outline" /> {{ props.row.likes }}
        </b-table-column>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-centered">
            <p class="subtitle has-text-grey">No questions found</p>
          </div>
        </section>
      </template>
    </b-table>
  </section>
</template>

<script>
import * as moment from 'moment'

export default {
  middleware: 'checkAuthentication',

  filters: {
    datetime: (dateString) =>
      moment(new Date(dateString)).format('DD/MM/YYYY HH:mm:ss')
  },

  computed: {
    searchFor: {
      get() {
        return this.$store.getters.searchFor
      },
      set(value) {
        this.$store.commit('searchFor', value)
      }
    },
    hideAnswered: {
      get() {
        return this.$store.getters.hideAnswered
      },
      set(value) {
        this.$store.commit('hideAnswered', value)
      }
    },
    questions() {
      return this.$store.getters.questions
    }
  },

  async asyncData(context) {
    await context.store.dispatch('loadQuestions')
  },

  methods: {
    viewQuestion(question) {
      this.$router.push({
        name: `questions-id`,
        params: { id: question._id }
      })
    },

    async search() {
      await this.$store.dispatch('loadQuestions')
    },

    async cleanSearch() {
      this.searchFor = ''
      await this.$store.dispatch('loadQuestions')
    }
  }
}
</script>
