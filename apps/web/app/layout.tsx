import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Map, RocketIcon } from "lucide-react";
import { QueryProvider } from "@/modules/query";
import { SidebarWidget } from "@/modules/sidebar";
import { ThemeProvider } from "@/modules/theme";
import styles from "./layout.module.css";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Space",
  description: "Discover space",
};

const sidebarLinks = [
  { href: "/", label: "Home", icon: <Map size={20} aria-hidden />, section: "Navigation" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
        <ThemeProvider>
          <div className={styles.shell}>

            <main className={styles.main}>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
