import "./globals.css";
import Provider from "@/components/providers/shared";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await headers();

  return (
    <html lang="en" suppressHydrationWarning className="font-sans">
      <body className="antialiased">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
