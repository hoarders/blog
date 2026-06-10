import { NextResponse } from 'next/server';

export function middleware() {
  const response = NextResponse.next();
  response.headers.set('CDN-Cache-Control', 'no-store, must-revalidate');
  return response;
}

export const config = {
  matcher: '/articles/:slug/preview',
};
