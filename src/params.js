export const params = async (request) => {
  const contentType = request.headers.get('content-type');
  const required = ['subject', 'to'];
  let data = {};
  try {
    if (contentType === 'application/json') {
      data = (await request.json()) ?? {};
    }

    if (contentType === 'application/x-www-form-urlencoded') {
      data = Object.fromEntries(
        new URLSearchParams((await request.text()) ?? ''),
      );
    }
  } catch (e) {
    data = {};
  }

  data.errors = required.reduce(
    (acc, el) =>
      data?.[el] ? acc : [...acc, `missing required parameter '${el}'`],
    [],
  );

  return data;
};
