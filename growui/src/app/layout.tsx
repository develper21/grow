import "./globals.css";
import { Inter } from "next/font/google";
import { CssBaseline } from "@mui/material";
import Navbar from "@/components/Navbar"; // Import the new client component

const inter = Inter({ subsets: ["latin"] });

// metadata export can only be in a Server Component
export const metadata = {
  title: "Mutual Fund Explorer",
  description: "Mutual Fund Explorer with SIP Calculator",
};

// RootLayout remains a Server Component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CssBaseline />

        {/* Navigation Panel is now a separate Client Component */}
        <Navbar />

        {/* Page content */}
        <main>{children}</main>
      </body>
    </html>
  );
}