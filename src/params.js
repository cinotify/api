export const parseUrlEncoded = (string) => {
  const data = Object.fromEntries(new URLSearchParams(string));

  // with array[][key]=value query params
  for (let key in data) {
    if (key.match(/\[/)) {
      const [_, object, property] = key.match(/([\w]+)\[\]\[([\w]+)/);
      data[object] = data[object] || [{}];
      data[object][0] = { ...data[object][0], [property]: data[key] };
      delete data[key];
    }
  }
  return data;
};

/**
 * Parse a payload from a json string or a urlencoded string
 * @param {Request} request
 * @returns Record<string, unknown>
 */
export const params = async (request) => {
  const contentType = request.headers.get('content-type');
  const required = ['subject', 'to'];
  let data = {};
  try {
    if (contentType === 'application/json') {
      data = (await request.json()) ?? {};
    }

    if (contentType === 'application/x-www-form-urlencoded') {
      data = parseUrlEncoded(await request.text());
    }
  } catch (e) {
    // pass
  }

  data.errors = required.reduce(
    (acc, el) =>
      data?.[el] ? acc : [...acc, `missing required parameter '${el}'`],
    [],
  );

  return data;
};
