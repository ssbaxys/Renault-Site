import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { ScriptPreview } from './components/ScriptPreview';
import { Installation } from './components/Installation';
import { FAQ } from './components/FAQ';
import { Download } from './components/Download';
import { Footer } from './components/Footer';

export function App() {
  return (
    <div className="min-h-screen bg-void text-white-90">
      <Navbar />
      <Hero />
      <Features />
      <ScriptPreview />
      <Installation />
      <FAQ />
      <Download />
      <Footer />
    </div>
  );
}
