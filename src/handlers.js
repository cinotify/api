import { mail } from './mail';
import { params } from './params';

const postApiNotify = async ({ env, request }) => {
  const { errors = [], ...rest } = await params(request);
  try {
    await mail({
      env,
      ...rest,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 400,
    });
  }

  const response = {
    ...rest,
    ...(errors.length && { errors }),
  };
  return new Response(JSON.stringify(response), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: errors.length ? 400 : 200,
  });
};

const notFound = () =>
  new Response(
    JSON.stringify(
      {
        message: 'Not Found',
        documentation_url: 'https://www.cinotify.cc/docs',
      },
      null,
      2,
    ),
    {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 404,
    },
  );

export const handler = async ({ env, request }) => {
  const { pathname } = new URL(request.url);
  const userAgent = request.headers.get('user-agent');
  let response;
  if (request.method === 'POST' && pathname === '/api/notify') {
    response = await postApiNotify({ env, request });
  }
  response = response ?? notFound();
  // eslint-disable-next-line no-console
  console.log(`${request.method} ${pathname} ${response.status} ${userAgent}`);
  return response;
};
