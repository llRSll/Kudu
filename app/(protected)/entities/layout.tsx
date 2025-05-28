import ProtectedRouteWrapper from "@/components/protected-route-wrapper"

export default function EntitiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRouteWrapper>{children}</ProtectedRouteWrapper>
}
