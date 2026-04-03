import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "H2",
  description: "Next.js framendi fyrir H1 vefþjónustur",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="is">
      <body>
        <Header />
        <main className="container main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}