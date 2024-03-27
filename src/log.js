export const log = async ({ env, user_id, tags }) => {
  await fetch('https://api.logsnag.com/v1/log', {
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
};
