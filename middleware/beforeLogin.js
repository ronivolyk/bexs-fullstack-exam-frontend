export default function(context) {
  const isLogged = context.store.getters.isLogged

  if (isLogged) {
    return context.redirect('/')
  }
}
