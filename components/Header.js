// components/Header.js

import Link from 'next/link';

export default function Header({ onLogout }) {
  return (
    <header className="bg-gold text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link href="/">イベントアプリ</Link>
      </h1>
      <button
        onClick={onLogout}
        className="bg-white hover:bg-gray-100 text-gold font-bold py-2 px-4 rounded"
      >
        ログアウト
      </button>
    </header>
  );
}


