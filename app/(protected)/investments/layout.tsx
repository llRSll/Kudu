import ProtectedRouteWrapper from "@/components/protected-route-wrapper"

export default function InvestmentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRouteWrapper>{children}</ProtectedRouteWrapper>
}
