// components/EventForm.js

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function EventForm({ onEventCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ユーザー情報の取得
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

    // イベントの作成
    const { data, error } = await supabase.from('events').insert([
      {
        title,
        description,
        date,
        created_by: user.id,
      },
    ]);

    if (error) {
      console.error('Error creating event:', error);
      alert('イベントの作成中にエラーが発生しました。');
    } else {
      alert('イベントが作成されました。');
      // フォームをリセット
      setTitle('');
      setDescription('');
      setDate('');
      // イベント一覧を更新
      if (onEventCreated) onEventCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">イベント作成</h2>
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">タイトル</label>
        <input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">説明</label>
        <textarea
          placeholder="説明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">日付</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        作成
      </button>
    </form>
  );
}






