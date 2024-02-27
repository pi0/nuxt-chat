export default defineEventHandler(async () => {
  const messages = await getMessages(25);
  return {
    messages
  }
})
