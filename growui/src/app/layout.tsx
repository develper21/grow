import "./globals.css";
import { Inter } from "next/font/google";
import { CssBaseline } from "@mui/material";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Grow",
  description: "Grow with SIP Calculator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CssBaseline />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}