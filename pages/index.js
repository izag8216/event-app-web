// pages/index.js

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Auth from '../components/Auth';
import EventForm from '../components/EventForm';
import Header from '../components/Header';

export default function Home() {
  const [session, setSession] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // 初期セッションの取得
    const getInitialSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(session);
      }
    };

    getInitialSession();

    // セッションの変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      fetchEvents();
    } else {
      setEvents([]);
    }
  }, [session]);

  // イベントを取得する関数
  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select('*');

    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents(data);
    }
  };

  // イベントが作成された後に一覧を更新する関数
  const handleEventCreated = () => {
    fetchEvents();
  };

  // イベントに参加する関数
  const handleJoinEvent = async (eventId) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error fetching user:', userError);
      alert('ユーザー情報の取得に失敗しました。再度ログインしてください。');
      return;
    }

    if (!user) {
      alert('ユーザーが認証されていません。ログインしてください。');
      return;
    }

    const { data, error } = await supabase.from('participants').insert([
      {
        user_id: user.id,
        event_id: eventId,
      },
    ]);

    if (error) {
      console.error('Error joining event:', error);
      alert('イベントへの参加中にエラーが発生しました。');
    } else {
      alert('イベントに参加しました。');
    }
  };

  // ログアウト関数
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      setSession(null);
    }
  };

  if (!session) {
    return <Auth />;
  }

  return (
    <div>
      <Header onLogout={handleLogout} />
      <main className="container mx-auto p-4">
        <EventForm onEventCreated={handleEventCreated} />
        <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">イベント一覧</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div key={event.id} className="border rounded p-4 shadow bg-white">
              <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
              <p className="text-gray-600">日時: {event.date}</p>
              <p className="text-gray-700">{event.description}</p>
              <button
                onClick={() => handleJoinEvent(event.id)}
                className="mt-2 bg-gold hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded"
              >
                参加する
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
