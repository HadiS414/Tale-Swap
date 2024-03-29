import './globals.css'
import { Inter } from 'next/font/google'
import Nav from "./components/Nav";
import QueryWrapper from './components/QueryWrapper';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Tale Swap',
}

export default function RootLayout({ children }) {
  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet" />
        <link rel="icon" href="/images/favicon.ico" />
      </head>
      <html lang="en" className="bg-off-white">
        <body className={inter.className}>
          <QueryWrapper>
            <Nav />
            {children}
          </QueryWrapper>
        </body>
      </html>
    </>
  )
}
