import type { Metadata } from "next";
import "./pamamanhikan.css";

export const metadata: Metadata = {
  title: "Family Presentation · Jonathan & Nerizza",
  description: "Pamamanhikan presentation for our families.",
  // A private family deck behind a gate — keep it out of search results.
  robots: { index: false, follow: false },
};

export default function PamamanhikanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
