import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { AppProviders } from "@/components/AppProviders"

export const metadata: Metadata = {
  title: "Dominance",
  description: "An x402-powered territory game.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AppProviders>
          <Navbar />
          <main>{children}</main>
        </AppProviders>
      </body>
    </html>
  )
}