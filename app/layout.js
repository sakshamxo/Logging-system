import localFont from "next/font/local";
import "./globals.css";


export const metadata = {
  title: "Healthnifity",
  description: "Track actions with ease and manage access securely.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
