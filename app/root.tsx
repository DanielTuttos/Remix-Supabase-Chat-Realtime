import { json, LinksFunction, LoaderArgs, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import styles from './styles/global.css';
import { Database } from './types/database';
import { supabase } from './utils/supabase.server';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Chat Realtime',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const loader = async ({}: LoaderArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  };
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return json({ env, session });
};

export default function App() {
  const { env, session } = useLoaderData<typeof loader>();
  console.log('sesion del servidor: ', session);
  const [supabase] = useState(() =>
    createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('sesion del cliente: ', session);
    });
  }, []);

  return (
    <html lang="es">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet context={{ supabase }} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
