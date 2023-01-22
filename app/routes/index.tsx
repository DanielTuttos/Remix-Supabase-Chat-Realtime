import { LoaderArgs, ActionArgs, json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { Login } from '~/components/Login';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { RealtimeMessages } from '../components/RealtimeMessages';

// se ejecuta en el server
export const loader = async ({ request }: LoaderArgs) => {
  // se ejecuta para recuperar datos
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const { data } = await supabase.from('messages').select();
  return { messages: data ?? [] };
};

// action, funcion que se ejecuta cuando se hace un submit en el formulario del componente
export const action = async ({ request }: ActionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  // formData de la request
  const formData = await request.formData();
  const { message } = Object.fromEntries(formData);
  // guardar en supabase
  await supabase.from('messages').insert({ content: message.toString() });
  return json({ message: 'ok' }, { headers: response.headers });
};

export default function Index() {
  const { messages } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>chat realtime</h1>
      <Login />

      <Form method="post">
        <input
          type={'text'}
          name={'message'}
        />
        <button type="submit">Enviar mensaje</button>
      </Form>
      <RealtimeMessages serverMessages={messages} />
    </main>
  );
}
