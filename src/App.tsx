import './App.css';
import LoadingReveal from './components/LoadingReveal';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import DemoSection from './components/DemoSection';
import TechnologySection from './components/TechnologySection';

const App: React.FC = () => {
  return (
    <>
      <LoadingReveal />
      <Navbar />
      <main>
        <HeroSection />
        <IntroSection />
        <DemoSection />
        <TechnologySection />
      </main>
    </>
  );
};

export default App;
