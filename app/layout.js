import { DM_Sans } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import { ToastProvider } from "@/components/ui/toast";
import TopLoader from "@/components/ui/top-loader";

const dmSans = DM_Sans({
  weight: ['400','500','600','700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});


const description = "When we say we deliver the goods, we mean it. And we're not just talking about products. We deliver on our promise to never let you down. Since 1992, we've been providing the highest level of service possible, owning the full logistics process end-to-end.";

export const metadata = {
  title: "Corporate Traffic",
  description
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.className}`}>
        <ToastProvider />
        <StoreProvider>
          <TopLoader />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
