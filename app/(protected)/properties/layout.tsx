import ProtectedRouteWrapper from "@/components/protected-route-wrapper"

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRouteWrapper>{children}</ProtectedRouteWrapper>
} 