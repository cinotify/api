export const payload = ({ subject, to, type, body, attachments }) => ({
  // https://docs.sendgrid.com/api-reference/mail-send/mail-send#body
  attachments,
  content: [
    {
      type: type ?? 'text/plain',
      value: body ?? ' ',
    },
  ],
  from: {
    email: 'app@cinotify.cc',
  },
  personalizations: [
    {
      subject,
      to: to?.split(',').map((recipient) => ({ email: recipient })),
    },
  ],
});

/**
 * send an email using the sendgrid api
 * @returns Promise<void>
 */
export const mail = async ({ env = {}, ...rest }) => {
  await fetch('https://api.sendgrid.com/v3/mail/send', {
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(payload({ ...rest })),
  });
};
