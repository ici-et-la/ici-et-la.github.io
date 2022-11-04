import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import useGoogleSheets from 'use-google-sheets';

import dynamic from "next/dynamic";


const loadScript = (src:string) =>
  new Promise((resolve:Function, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = (err) => reject(err)
    document.body.appendChild(script)
  })

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
  const googleButton = useRef(null);
  useEffect(() => {
    const src = 'https://accounts.google.com/gsi/client'
    const id = "657764290407-71f2h1ri3k173p5tnr4ja19rhgage90s.apps.googleusercontent.com"
    loadScript(src)
      .then(() => {
        /*global google*/
        console.log(google)
        google.accounts.id.initialize({
          client_id: id,
          callback: handleCredentialResponse,
        })
        google.accounts.id.renderButton(
          googleButton.current, 
          { theme: 'outline', size: 'large' } 
        )
      })
      .catch(console.error)

    return () => {
      const scriptTag = document.querySelector(`script[src="${src}"]`)
      if (scriptTag) document.body.removeChild(scriptTag)
    }
  }, [])

  function handleCredentialResponse(response:any) {
    console.log("Encoded JWT ID token: " + response.credential);
  }

  return (
    <div>
      <Head>
        <title>Research map</title>
        <meta name="description" content="Carte d'intérêts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <MyAwesomeMap/>
        <div ref={googleButton}></div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export default Home
