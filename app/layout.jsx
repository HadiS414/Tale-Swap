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
    <html lang="en" className="bg-off-white">
      <body className={inter.className}>
        <QueryWrapper>
          <Nav />
          {children}
        </QueryWrapper>
      </body>
    </html>
  )
}
