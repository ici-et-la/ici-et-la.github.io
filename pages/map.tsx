import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { useState } from 'react';

import dynamic from "next/dynamic";


const { useGoogleLogin } = require('@react-oauth/google');



const sheet_id = "1gd4w1x8qWrIxgb0_NuHqrOV4TeiluY5jzMnSSg2JmMo";
const client_id = "657764290407-71f2h1ri3k173p5tnr4ja19rhgage90s.apps.googleusercontent.com";

const MyAwesomeMap = dynamic(() => import("../components/Map"), { ssr:false });


const Home: NextPage = () => {
  const [tokenResponse, setTokenResponse] = useState({})
  const [interestMap, setInterestMap] = useState(<><div>Data not loaded</div></>)
  const onSuccessHandler = (tokenResponse:any) => {
    setTokenResponse(tokenResponse);
    setInterestMap(<MyAwesomeMap tokenResponse={tokenResponse} sheet_id={sheet_id}/>)
  }
  const login = useGoogleLogin({
    onSuccess: onSuccessHandler,
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly"
  });
  return (
    <div>
      <Head>
        <title>Research map</title>
        <meta name="description" content="Carte d'intérêts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <button onClick={() => login()}>
          Charger les données 🚀{' '}
        </button>;
        {interestMap}
      
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export default Home
