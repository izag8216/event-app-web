// pages/_app.js

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-blue-100">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
