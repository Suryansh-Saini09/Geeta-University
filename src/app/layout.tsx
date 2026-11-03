import type { Metadata } from "next";
import { headers } from "next/headers";
import { Source_Sans_3, Zilla_Slab } from "next/font/google";
import LenisProvider from "@/components/providers/LenisProvider";
import SiteChrome from "@/components/layout/SiteChrome";
import Footer from "@/components/layout/Footer";
import { getFooterSettings } from "@/server/services/footer";
import { getHeaderNavigation } from "@/server/services/navigation";
import { fetchSocialData } from "@/lib/socialLinks";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const zillaSlab = Zilla_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

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
  const reqHeaders = await headers();
  const isStandalone = reqHeaders.get("x-is-standalone-route") === "1";

  const [footerData, socialData, navData] = isStandalone
    ? [null, { success: true, data: undefined }, null]
    : await Promise.all([
        getFooterSettings(),
        fetchSocialData(),
        getHeaderNavigation(),
      ]);

  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${zillaSlab.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        {isStandalone ? (
          children
        ) : (
          <LenisProvider>
            <SiteChrome
              navData={navData}
              footer={
                footerData ? (
                  <Footer
                    key="gu-footer"
                    data={footerData}
                    socialLinks={socialData.data?.links}
                  />
                ) : null
              }
            >
              {children}
            </SiteChrome>
          </LenisProvider>
        )}
      </body>
    </html>
  );
}
