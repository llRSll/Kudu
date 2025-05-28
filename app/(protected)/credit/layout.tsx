import ProtectedRouteWrapper from "@/components/protected-route-wrapper"

export default function CreditLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRouteWrapper>{children}</ProtectedRouteWrapper>
}
