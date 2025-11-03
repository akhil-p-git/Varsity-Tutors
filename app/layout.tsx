import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
import { StudyPresence } from "@/app/components/StudyPresence";
import { Navigation } from "@/app/components/Navigation";
import { AgentDebugger } from "@/app/components/AgentDebugger";
import { DemoControls } from "@/app/components/DemoControls";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Varsity Tutors - Study Together, Grow Together",
  description: "Connect students, parents, and tutors for collaborative learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <Navigation />
          {children}
          <StudyPresence />
          <AgentDebugger />
          {process.env.NODE_ENV === 'development' && <DemoControls />}
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
