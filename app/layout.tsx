import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
 subsets: ["latin"],
 display: "swap",
 variable: "--font-jakarta",
});

export const metadata: Metadata = {
 title: "Ferryshop — Dashboard",
 description: "Enterprise Ferryshop management platform",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
 <body className={`${jakarta.variable} font-sans min-h-full flex flex-col bg-slate-50 text-slate-900`}>
 {children}
 </body>
 </html>
 );
}
