import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NavBar } from "@/components/customer/Navbar";
import { PrimeReactProvider } from 'primereact/api';
import Chatbot from '@/components/customer/chatbot';
import { Toaster } from "react-hot-toast";
import { useState } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SurfTurf - Premium Sports Turf Booking Platform",
  description: "Book premium sports turfs for football, cricket, basketball, tennis and more. Find the best turfs in your city with advanced booking system.",
  keywords: "sports turf, football turf, cricket ground, basketball court, tennis court, turf booking, sports facility",
  authors: [{ name: "SurfTurf Team" }],
  openGraph: {
    title: "SurfTurf - Premium Sports Turf Booking",
    description: "Book premium sports turfs for football, cricket, basketball, tennis and more.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SurfTurf - Premium Sports Turf Booking",
    description: "Book premium sports turfs for football, cricket, basketball, tennis and more.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>

      <body className="bg-white transition-all ease-in-out relative">
        <PrimeReactProvider>
          <NavBar />
          {children}

          {/* Chatbot container */}
          <div className="fixed bottom-4 right-4 z-50">
            <Toaster
              position="top-right"
              reverseOrder={false}
            />
            <Chatbot />
          </div>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
