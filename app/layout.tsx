import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Le Pierrot-Thérèse",
  description: "Application Le Pierrot-Thérèse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
