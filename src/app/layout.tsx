import "./globals.css";
import Provider from "@/components/providers/shared";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="font-sans"
    >
      <body
        className="antialiased"
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
