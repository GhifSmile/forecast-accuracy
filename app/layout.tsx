import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import SessionProviderWrapper from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "Forecast Accuracy",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type UserRole = "officer" | "viewer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();


  // const userRole: UserRole = "viewer";
  const userRole: UserRole = "officer";

  return (
    <html lang="en">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "font-sans antialiased"
        )}
      >
        <SessionProviderWrapper>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <AppSidebar role={userRole} />

              <div className="flex flex-col flex-1">
                <main className="flex-1 p-6 bg-slate-50">

                  {children}

                </main>

                <footer className="border-t bg-white text-xs text-slate-500 text-center py-4">
                  © {currentYear} Digital Production | National Supply Chain
                </footer>
              </div>
            </div>
          </SidebarProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
