import type { Metadata } from "next";

// The dashboard is an internal admin tool — keep it out of search indexes
// entirely. robots.txt blocks crawling too; this covers direct links.
export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
