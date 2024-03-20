import { mail } from './mail';
import { params } from './params';

const postApiNotify = async ({ env, request }) => {
  const { errors = [], ...rest } = await params(request);
  await mail({
    env,
    ...rest,
  });
  const response = {
    ...rest,
    ...(errors.length && { errors }),
  };
  return new Response(JSON.stringify(response), {
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
    { status: 404 },
  );

export const handler = async ({ env, request }) => {
  const { pathname } = new URL(request.url);
  if (request.method === 'POST' && pathname === '/api/notify') {
    return await postApiNotify({ env, request });
  }
  return notFound();
};
