export const input = {
  attachments: [
    {
      content: 'aGVsbG8sIHdvcmxkIQ==',
      type: 'text/plain',
      filename: 'hello.txt',
    },
  ],
  body: '<h1>an html body</h1>',
  subject: 'hello',
  to: 'ex@mple.com',
  type: 'text/html'
};

export const inputUrlEncoded = `to=${input.to}&subject=${input.subject}&body=${input.body}&attachments[][type]=text/plain&attachments[][content]=aGVsbG8sIHdvcmxkIQ==&attachments[][filename]=hello.txt&type=text/html`;
