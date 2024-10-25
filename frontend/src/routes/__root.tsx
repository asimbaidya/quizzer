import * as React from 'react';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className='p-2 flex gap-2 text-lg'>
        <Link
          to='/'
          activeProps={{
            style: {
              fontWeight: 'bold',
            },
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{' '}
        <Link
          to='/about'
          activeProps={{
            style: {
              fontWeight: 'bold',
            },
          }}
        >
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position='bottom-left' />
    </>
  );
}
