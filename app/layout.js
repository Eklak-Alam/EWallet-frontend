import { ApiProvider } from "@/context/AppContext";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ApiProvider>
          <Navbar />
          {children}
        </ApiProvider>
      </body>
    </html>
  );
}
