import type { Metadata } from "next";
import LenisProvider from "@/components/providers/LenisProvider";
import SiteChrome from "@/components/layout/SiteChrome";
import Footer from "@/components/layout/Footer";
import { getFooterSettings } from "@/server/services/footer";
import { fetchSocialData } from "@/lib/socialLinks";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://geetauniversity.edu.in"),
  title: "Geeta University | Panipat, Delhi NCR",
  description: "Welcome to Geeta University, a premier state university in Panipat, Haryana.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [footerData, socialData] = await Promise.all([
    getFooterSettings(),
    fetchSocialData(),
  ]);

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <LenisProvider>
          <SiteChrome
            footer={
              <Footer
                data={footerData}
                socialLinks={socialData.data?.links}
              />
            }
          >
            {children}
          </SiteChrome>
        </LenisProvider>
      </body>
    </html>
  );
}
