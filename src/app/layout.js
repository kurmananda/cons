
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import "./globals.css";



export const metadata = {
  title: "Conscientia IIST",
  description: "AI's impact on engineering education at IIST: A comprehensive research initiative exploring the evolving landscape of learning, skill development, and the future of engineering education in the age of AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-black text-white antialiased">

        <Navbar />
        <div className="h-[10vh] shrink-0 bg-transparent" aria-hidden />

        <main className="min-h-0">
          {children}
        </main>

        <Footer />

      </body>
    </html>
  )
}