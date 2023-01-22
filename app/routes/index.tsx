import { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Login } from '~/components/Login';
import { supabase } from '~/utils/supabase.server';

// se ejecuta en el server
export const loader = async ({}: LoaderArgs) => {
  // se ejecuta para recuperar datos
  const { data } = await supabase.from('messages').select();
  return { messages: data ?? [] };
};

export default function Index() {
  const { messages } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>chat realtime</h1>
      <Login />
      <pre>{JSON.stringify(messages, null, 4)}</pre>
    </main>
  );
}
