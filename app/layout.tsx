import { metadata } from './metadata'
import RootLayoutClient from './layout.client'

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>
} 