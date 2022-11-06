import type { NextPage } from 'next'
import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/Home.module.css'
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
// import { useEffect, useRef } from 'react';
// import { useState } from 'react';
import useGoogleSheets from 'use-google-sheets';
//import { GoogleLogin } from '@react-oauth/google';
//import { useGoogleLogin } from '@react-oauth/google';
const { useGoogleLogin } = require('@react-oauth/google');
// import axios from "axios";
//const { GoogleSpreadsheet } = require('google-spreadsheet');

import dynamic from "next/dynamic";

const sheet_id = "1gd4w1x8qWrIxgb0_NuHqrOV4TeiluY5jzMnSSg2JmMo";
const client_id = "657764290407-71f2h1ri3k173p5tnr4ja19rhgage90s.apps.googleusercontent.com";

const MyAwesomeMap = dynamic(() => import("../components/Map"), { ssr:false });

/**
   <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
 */
const Home: NextPage = () => {
  // const oauthClient = new OAuth2Client({
  //   clientId: client_id
  // });
  // oauthClient.on('tokens', credentials => {
  //   console.log(credentials.access_token);
  //   console.log(credentials.scope);
  //   console.log(credentials.expiry_date);
  //   console.log(credentials.token_type); // will always be 'Bearer'
  // })
  const onSuccessHandler = (tokenResponse:any) => {
    console.log(tokenResponse);
    let accessToken = tokenResponse.access_token;
    fetch("https://sheets.googleapis.com/v4/spreadsheets/" + sheet_id, {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
       }
    }).then((response) => {
      fetch("https://sheets.googleapis.com/v4/spreadsheets/" + sheet_id + "/values/Ecoles", {
        headers: {
          'Authorization': 'Bearer ' + accessToken,
        }
      }).then((response) => {
        let data = response.json();
      })
    })
    
    // const doc = new GoogleSpreadsheet(sheet_id);
    // doc.useRawAccessToken(accessToken);
    // doc.loadInfo();
    // console.log(doc.sheetsByTitle["Ecole"].getRows());
    
  }
  // const login = () => {
  //   window.open(oauthClient.generateAuthUrl({
  //     client_id: client_id,
  //     scope: "https://www.googleapis.com/auth/spreadsheets.readonly"
  //   }), "google_auth", "status=no,titlebar=no,toolbar=no")
  // }
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
        <MyAwesomeMap/>
        <button onClick={() => login()}>
          Sign in with Google 🚀{' '}
        </button>;
      
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export default Home
