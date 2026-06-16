import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
 subsets: ["latin"],
 display: "swap",
 variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
 title: "GameInventory — Dashboard",
 description: "Enterprise game inventory management platform",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`}>
 <body className={`${plusJakartaSans.className} min-h-full flex flex-col bg-slate-50 text-slate-900`}>
 {children}
 </body>
 </html>
 );
}
