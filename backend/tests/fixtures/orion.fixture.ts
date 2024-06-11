export let mockOrionResponse = {
  statusCode: 200,
  result: {
    summary: {
      action: "Pass",
      message: "Message"
    },
    data: {
      matches: {
        internal: [
          {
            transactionId: "test@test.com",
          }
        ]
      }
    }
  }
}
