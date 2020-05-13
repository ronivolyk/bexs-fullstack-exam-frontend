<template>
  <section class="section">
    <h3 class="subtitle has-text-grey">
      Select a question below to view the answers:
    </h3>

    <b-table
      :data="questions"
      v-on:click="viewQuestion"
      striped
      hoverable
      style="cursor: pointer;"
    >
      <template slot-scope="props">
        <b-table-column field="question" label="Question">
          {{ props.row.question }}
        </b-table-column>
        <b-table-column field="user" label="User">
          {{ props.row.user }}
        </b-table-column>
        <b-table-column field="creationDate" label="Creation Date">
          {{ props.row.creationDate | datetime }}
        </b-table-column>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-centered">
            <p>No questions found</p>
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

  async asyncData({ $axios }) {
    const questions = (await $axios.get('http://localhost:8080/questions')).data
    return { questions }
  },

  filters: {
    datetime: (dateString) =>
      moment(new Date(dateString)).format('DD/MM/YYYY HH:mm:ss')
  }
}
</script>
