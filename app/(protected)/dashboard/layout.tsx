import ProtectedRouteWrapper from "@/components/protected-route-wrapper"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRouteWrapper>{children}</ProtectedRouteWrapper>
} 