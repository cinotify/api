export const input = {
  attachments: [
    {
      content: 'aGVsbG8sIHdvcmxkIQ==',
      type: 'text/plain',
      filename: 'hello.txt',
    },
  ],
  body: 'this is the body',
  subject: 'hello',
  to: 'ex@mple.com',
};

export const inputUrlEncoded = `to=${input.to}&subject=${input.subject}&body=${input.body}&attachments[][type]=text/plain&attachments[][content]=aGVsbG8sIHdvcmxkIQ==&attachments[][filename]=hello.txt`;
