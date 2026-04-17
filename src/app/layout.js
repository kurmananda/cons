
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import "./globals.css";



export const metadata = {
  title: "Conscientia IIST",
  description: "AI's impact on engineering education at IIST: A comprehensive research initiative exploring the evolving landscape of learning, skill development, and the future of engineering education in the age of AI.",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>

        <Navbar />
        <div className="h-[15vh] flex flex-col bg-black/5"></div> {/* Spacer to prevent content from being hidden behind the fixed navbar */}   

        <main>
          {children}
        </main>

        <Footer />

      </body>
    </html>
  )
}