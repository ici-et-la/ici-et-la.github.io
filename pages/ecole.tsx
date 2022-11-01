import type { NextPage } from 'next'
import Head from 'next/head'

// styles of react-impressjs
import styles from '../styles/Home.module.css'


const Ecole: NextPage = () => {

    return(
    <div>
        <Head>
            <title>Education et Instruction</title>
        </Head>
        <main>
            <h1>Education et Instruction</h1>
            <section>
                <ul>
                    <li>Instruction libre pour les enfants en s&apos;inspirant des méthodes alternatives Montessori, Frenet, Steiner, école démocratique </li>
                    <li>Accepting, accommodating place. Supporting natural development, connection and appreciation to nature.</li>
                    <li>Gentle education. Respectful to all.</li>
                    <li>A forest school would be amazing, but volunteering with animals would also be great. </li>
                </ul>
            </section>

        </main>
    </div>
    )
}

export default Ecole