export default defineNitroPlugin(() => {
  runTask('db:migrate')
})
