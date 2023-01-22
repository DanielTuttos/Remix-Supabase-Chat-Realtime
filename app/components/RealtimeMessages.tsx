import { useEffect, useState } from 'react';
import { useSupabase } from '~/hooks/useSupabase';
import type { Database } from '~/types/database';

type Message = Database['public']['Tables']['messages']['Row'];

export const RealtimeMessages = ({
  serverMessages,
}: {
  serverMessages: Message[];
}) => {
  const [messages, setMessages] = useState<Message[]>(serverMessages);
  const supabase = useSupabase();
  useEffect(() => {
    const channel = supabase.channel('*').on(
      'postgres_changes',
      {
        event: 'INSERT',
        scheme: 'public',
        table: 'messages',
      },
      (payload) => {
        const newMessage = payload.new as Message;
        // if (!messages.some((message) => message.id === newMessage.id)) {
        //   setMessages((messages) => [...messages, newMessage]);
        // }
        setMessages((messages) => [...messages, newMessage]);
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
  

  return <pre>{JSON.stringify(messages, null, 4)}</pre>;
};
