export const log = async ({ env, user_id, tags }) => {
  const response = await fetch('https://api.logsnag.com/v1/log', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.LOGSNAG_API_TOKEN}`,
    },
    body: JSON.stringify({
      project: 'cinotify',
      channel: 'api',
      event: 'mail',
      icon: '📬',
      user_id,
      tags,
    }),
    method: 'POST',
  });
  const data = await response.json();
  // eslint-disable-next-line no-console
  console.log(data);
};
