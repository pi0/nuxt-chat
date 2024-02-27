export default defineEventHandler(async (event) => {
  const messages = await getMessages(25);
  return {
    messages
  }
})
