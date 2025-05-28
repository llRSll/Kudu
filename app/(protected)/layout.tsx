// import { metadata } from "../metadata";
import RootLayoutClient from "./layout-client";
// export { metadata };

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
