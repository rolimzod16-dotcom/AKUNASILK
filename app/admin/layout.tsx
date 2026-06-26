import "../globals.css";

export const metadata = {
  title: "Admin | GREATSILKTRAILS",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-silk-cream font-sans antialiased">{children}</body>
    </html>
  );
}