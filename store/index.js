import { ToastProgrammatic as Toast } from 'buefy'

export const state = () => ({
  isLogged: false,
  user: '',
  questions: [],
  searchFor: '',
  hideAnswered: false,
  question: {}
})

export const mutations = {
  login: (state, user) => {
    state.isLogged = true
    state.user = user
  },

  logout: (state) => {
    state.isLogged = false
    state.user = ''
  },

  questions: (state, questions) => {
    state.questions = questions
  },

  searchFor: (state, searchFor) => {
    state.searchFor = searchFor
  },

  hideAnswered: (state, hideAnswered) => {
    state.hideAnswered = hideAnswered
  },

  question: (state, question) => {
    state.question = question
  }
}

export const getters = {
  isLogged: (state) => state.isLogged,
  user: (state) => state.user,
  questions: (state) => state.questions,
  searchFor: (state) => state.searchFor,
  hideAnswered: (state) => state.hideAnswered,
  question: (state) => state.question
}

export const actions = {
  init(context) {
    const user = localStorage.getItem('user')

    if (user) {
      context.commit('login', user)
    }
  },

  login(context, user) {
    if (!user || !user.trim()) {
      return { logged: false, error: 'Username must not be empty' }
    }

    user = user.trim()

    context.commit('login', user)
    localStorage.setItem('user', user)

    return { logged: true }
  },

  logout(context) {
    context.commit('logout')
    localStorage.removeItem('user')
  },

  async loadQuestions(context) {
    try {
      const questions = (
        await this.$axios.get(
          `http://localhost:8080/questions?search=${context.getters.searchFor}&hideAnswered=${context.getters.hideAnswered}`
        )
      ).data

      context.commit('questions', questions)
    } catch (err) {
      context.dispatch(
        'handleError',
        err.response ? err.response.data : err.message
      )
    }
  },

  searchFor(context, searchFor) {
    context.commit('searchFor', searchFor)
    context.dispatch('loadQuestions')
  },

  hideAnswered(context, hideAnswered) {
    context.commit('hideAnswered', hideAnswered)
    context.dispatch('loadQuestions')
  },

  async loadQuestion(context, questionId) {
    try {
      const question = (
        await this.$axios.get(`http://localhost:8080/questions/${questionId}`)
      ).data

      context.commit('question', question)
    } catch (err) {
      context.dispatch(
        'handleError',
        err.response ? err.response.data : err.message
      )
    }
  },

  async askQuestion(context, newQuestion) {
    try {
      if (!newQuestion || !newQuestion.trim()) {
        context.dispatch('handleError', 'Question text must not be empty')
        return
      }

      newQuestion = newQuestion.trim()

      const question = {
        question: newQuestion,
        user: context.getters.user
      }

      await this.$axios.post('http://localhost:8080/questions', question)

      context.dispatch('loadQuestions')
      this.$router.push('/')
    } catch (err) {
      context.dispatch(
        'handleError',
        err.response ? err.response.data : err.message
      )
    }
  },

  async likeQuestion(context) {
    try {
      await this.$axios.post(
        `http://localhost:8080/questions/${context.getters.question._id}/like`
      )

      context.dispatch('loadQuestion', context.getters.question._id)
    } catch (err) {
      context.dispatch(
        'handleError',
        err.response ? err.response.data : err.message
      )
    }
  },

  async likeAnswer(context, answerPosition) {
    try {
      await this.$axios.post(
        `http://localhost:8080/questions/${context.getters.question._id}/answers/${answerPosition}/like`
      )

      context.dispatch('loadQuestion', context.getters.question._id)
    } catch (err) {
      context.dispatch(
        'handleError',
        err.response ? err.response.data : err.message
      )
    }
  },

  async postAnswer(context, newAnswer) {
    try {
      if (!newAnswer || !newAnswer.trim()) {
        context.dispatch('handleError', 'Answer text must not be empty')
        return
      }

      newAnswer = newAnswer.trim()

      const answer = {
        answer: newAnswer,
        user: context.getters.user
      }

      await this.$axios.post(
        `http://localhost:8080/questions/${context.getters.question._id}/answers`,
        answer
      )

      context.dispatch('loadQuestion', context.getters.question._id)
    } catch (err) {
      context.dispatch(
        'handleError',
        err.response ? err.response.data : err.message
      )
    }
  },

  handleError(context, message) {
    Toast.open({ message, type: 'is-danger' })
  }
}
