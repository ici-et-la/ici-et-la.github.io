import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useEffect } from 'react';
import { useState } from 'react';

import dynamic from "next/dynamic";

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
//  const [map, setMap] = useState(<></>);
//  useEffect(() => {
//    setMap(<MyAwesomeMap></MyAwesomeMap>)
//  }, []);
  return (
    <div>
      <Head>
        <title>Research map</title>
        <meta name="description" content="Carte d'intérêts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <MyAwesomeMap/>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export default Home
