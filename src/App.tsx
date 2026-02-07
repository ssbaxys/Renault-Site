import StarField from './components/StarField';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Compatibility } from './components/Compatibility';
import { ScriptPreview } from './components/ScriptPreview';
import { Installation } from './components/Installation';
import { Changelog } from './components/Changelog';
import { FAQ } from './components/FAQ';
import { Download } from './components/Download';
import { Footer } from './components/Footer';

export function App() {
  return (
    <div className="min-h-screen bg-void text-white-90 relative">
      <StarField />
      <Navbar />
      <Hero />
      <Features />
      <Compatibility />
      <ScriptPreview />
      <Installation />
      <Changelog />
      <FAQ />
      <Download />
      <Footer />
    </div>
  );
}
