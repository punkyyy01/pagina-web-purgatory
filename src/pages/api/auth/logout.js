import { SESSION_COOKIE } from '../../../lib/session.js';

export const prerender = false;

export async function POST({ cookies, redirect }) {
  cookies.delete(SESSION_COOKIE, { path: '/' });
  return redirect('/');
}
