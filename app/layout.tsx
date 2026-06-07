import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/Navbar"

export const metadata: Metadata = {
  title: "PixelAds",
  description: "An x402 pixel takeover marketplace template.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}