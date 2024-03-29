import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import clsx from "clsx";
import { PrismicPreview } from "@prismicio/next";
import { createClient, repositoryName } from "@/prismicio";

const urbanist = Urbanist({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const settings = await client.getSingle("settings");
  return {
    title: settings.data.meta_title,
    description: settings.data.meta_description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-900 text-slate-100">
      <body
        className={clsx(
          urbanist.className,
          "relative min-h-screen overflow-x-hidden",
        )}
      >
        <Header />
        {children}
        <Footer />
        <div className="background-gradient absolute inset-0 -z-50 max-h-screen"></div>
        <div className='pointer-events-none absolute inset-0 -z-40 h-full bg-[url("/noiseGif.gif")] opacity-10 mix-blend-soft-light'></div>
      </body>
      <PrismicPreview repositoryName={repositoryName} />
      <GoogleAnalytics gaId="G-MV4EE81ES7" />
    </html>
  );
}
