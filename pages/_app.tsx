import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { GoogleOAuthProvider } from '@react-oauth/google';

function MyApp({ Component, pageProps }: AppProps) {
  return <GoogleOAuthProvider clientId="657764290407-71f2h1ri3k173p5tnr4ja19rhgage90s.apps.googleusercontent.com">
    <Component {...pageProps} />
  </GoogleOAuthProvider>
}

export default MyApp
