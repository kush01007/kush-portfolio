import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import Skills from "./components/Skills"
import Projects from "./components/Projects"
import Contact from "./components/Contact"
import Footer from "./components/Footer"

function App() {
  return (
    <main className="min-h-screen bg-[#05080D] text-white">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </main>
  )
}

export default App