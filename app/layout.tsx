import type { Metadata } from "next";
import "./globals.css";

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
 <html lang="en" className="h-full antialiased">
 <body className="font-sans min-h-full flex flex-col bg-slate-50 text-slate-900">
 {children}
 </body>
 </html>
 );
}
