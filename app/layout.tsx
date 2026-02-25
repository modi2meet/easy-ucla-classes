import { About } from "./components/About";
import { GoogleAnalytics } from "./components/GoogleAnalytics";
import { MobileNavbar } from "./components/MobileNavbar";
import { Navbar } from "./components/Navbar";
import "./globals.css";

export const metadata = {
  title: {
    template: "%s | Find Easy UCLA Classes",
    default: "Find Easy UCLA Classes | UCLA Grade Distributions",
  },
  description:
    "Discover the easiest UCLA classes ranked by percentage of A grades. Filter by quarter, department, and course level. Data sourced through public records requests.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
      </head>
      <body className="flex flex-col min-h-screen bg-white text-notion-text">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <div className="md:hidden">
          <MobileNavbar />
        </div>
        <div className="flex flex-1">{children}</div>
        <div className="flex flex-col text-center p-6 sm:p-12 md:p-16 md:w-[85%] lg:w-[60%] md:mx-auto justify-center border-t border-notion-border">
          <About />
        </div>
      </body>
    </html>
  );
}
