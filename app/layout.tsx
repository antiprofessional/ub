import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Uber',
  description: 'Move the way you want',
  icons: { 
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
              <link
          href="https://fonts.cdnfonts.com/css/uber-move-text"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
