import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
		<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet"/>
	  </Head>
      <body className='font-mono bg-gradient-to-r from-purple-500 to-pink-500'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
