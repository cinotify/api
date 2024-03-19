const payload = ({ subject, to }) => ({
  // https://docs.sendgrid.com/api-reference/mail-send/mail-send#body
  content: [
    {
      type: 'text/plain',
      value: ' ',
    },
  ],
  from: {
    email: 'app@cinotify.cc',
  },
  personalizations: [
    {
      subject,
      to: [{ email: to }],
    },
  ],
});

export const mail = async ({ subject, to, env = {} }) => {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(payload({ subject, to })),
  });
  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = {};
  }
  return data;
};
