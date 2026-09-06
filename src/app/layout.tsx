import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AEPHAT – Association des Étudiants en Pharmacie du Togo",
  description: "S'informer. Agir. Progresser. L'AEPHAT rassemble les étudiants en pharmacie du Togo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
