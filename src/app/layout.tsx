import type { Metadata } from "next";
import LenisProvider from "@/components/providers/LenisProvider";
import SiteChrome from "@/components/layout/SiteChrome";
import Footer from "@/components/layout/Footer";
import { getFooterSettings } from "@/server/services/footer";
import { getHeaderNavigation } from "@/server/services/navigation";
import { fetchSocialData } from "@/lib/socialLinks";
import "./globals.css";

export const metadata: Metadata = {
  title: "Geeta University | Panipat, Delhi NCR",
  description: "Welcome to Geeta University, a premier state university in Panipat, Haryana.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [footerData, socialData, navData] = await Promise.all([
    getFooterSettings(),
    fetchSocialData(),
    getHeaderNavigation(),
  ]);

  return (
    <html lang="en">
      <body>
        <LenisProvider>
          <SiteChrome
            navData={navData}
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
