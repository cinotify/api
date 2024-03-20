import { handler } from './handlers';

export default {
  async fetch(request, env, ctx) {
    return handler({ ctx, env, request });
  },
};
