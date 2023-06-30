import '@/styles/globals.css';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';


function App({ Component, pageProps }: AppProps<{}>) {
  return (
    <main>
      <Component {...pageProps} />
    </main>
  );
}

export default appWithTranslation(App);
