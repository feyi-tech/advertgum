import Head from 'next/head'
import Layout from '../components/Layout'
import ViewAds from '../components/ViewAds'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>AdvertGum Dashboard</title>
        <meta name="description" content="AdvertGum - The best place to advertise" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ViewAds />
    </Layout>
  )
}
