import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WSPFloat from "../components/WSPFloat";
import ClientCartWrapper from "../components/ClientCartWrapper";

export const metadata = {
  title: "L&A | REMERAS",
  description: "Tienda oficial de L&A Remeras. Calidad premium y diseños exclusivos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased bg-black text-white" suppressHydrationWarning={true}>
        <Navbar />
        <ClientCartWrapper />
        
        {children}
        
        <WSPFloat />
        <Footer />
      </body>
    </html>
  );
}