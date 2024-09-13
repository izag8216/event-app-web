// components/Auth.js

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');

  const handleLogin = async (email) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      console.error('ログインエラー:', error.message);
      alert('ログイン中にエラーが発生しました。');
    } else {
      alert('メールを確認してください。');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          ログインまたはサインアップ
        </h2>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => handleLogin(email)}
          className="w-full bg-gold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
        >
          送信
        </button>
      </div>
    </div>
  );
}
