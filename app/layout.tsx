import { metadata } from "./metadata";
import RootLayoutClient from "./layout.client";
export { metadata };
import { ToasterProvider } from "@/components/ToasterProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootLayoutClient>
      {children} <ToasterProvider />
    </RootLayoutClient>
  );
}
