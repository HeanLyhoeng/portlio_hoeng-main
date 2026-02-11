import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { ExploreMyWork } from './components/ExploreMyWork';
import { FullGallery } from './components/FullGallery';
// import { FeaturedWork } from './components/FeaturedWork';
import { Skills } from './components/Skills';
import { PortfolioCategories } from './components/PortfolioCategories';

import { Footer } from './components/Footer';
import { DesignDetail } from './components/DesignDetail';
import { ProjectDetail } from './components/ProjectDetail';
import { AboutUs } from './components/AboutUs';
import { Services } from './components/Services';
import { SoftwareSales } from './Nuel-folio ux_ui-portfolio/src/pages/SoftwareSales';
import { Pricing } from './components/Pricing';
import { Moon, Sun } from 'lucide-react';

// Section component type for reordering
type SectionComponent = {
  id: string;
  name: string;
  component: React.ReactNode;
};

const App: React.FC = () => {
  const location = useLocation();
  const [currentRoute, setCurrentRoute] = useState<string>('');
  const [activeMenu, setActiveMenu] = useState<string>('home');
  const [sectionOrder, setSectionOrder] = useState<string[]>(() => {
    // Load from localStorage or use default
    const saved = localStorage.getItem('sectionOrder');
    return saved ? JSON.parse(saved) : ['portfolio', 'services', 'about'];
  });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);

  // Force dark theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
  }, []);

  // Handle hash routing and active menu tracking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '' || hash === '#/' || hash === '#') {
        // Home page
        setCurrentRoute('');
        setActiveMenu('home');
      } else if (hash.startsWith('#/project/')) {
        const projectId = hash.replace('#/project/', '');
        setCurrentRoute(`project-${projectId}`);
        setActiveMenu('home'); // Keep home background for project details
      } else if (hash.startsWith('#/design/')) {
        setCurrentRoute(hash.replace('#/design/', ''));
        setActiveMenu('home'); // Keep home background for design details
      } else if (hash === '#/about') {
        setCurrentRoute('about');
        setActiveMenu('about');
      } else if (hash === '#/services') {
        setCurrentRoute('services');
        setActiveMenu('services');
      } else if (hash === '#/software-sales') {
        setCurrentRoute('software-sales');
        setActiveMenu('services');
      } else if (hash === '#/pricing') {
        setCurrentRoute('pricing');
        setActiveMenu('home'); // or 'pricing' if you want a specific active state
      } else if (hash === '#work') {
        // Selected Work anchor link
        setCurrentRoute('');
        setActiveMenu('work');

      } else if (hash === '#/all-works') {
        setCurrentRoute('all-works');
        setActiveMenu('work');
      } else {
        // For other anchor links on home page, keep current route empty
        if (hash.startsWith('#')) {
          setCurrentRoute('');
          setActiveMenu('home');
        }
      }
    };

    // Run on mount, on hash change, and when react-router location changes
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [location]);

  // Save section order to localStorage
  useEffect(() => {
    localStorage.setItem('sectionOrder', JSON.stringify(sectionOrder));
  }, [sectionOrder]);

  // Admin mode toggle (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsAdminMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleBack = () => {
    window.location.hash = '';
    setCurrentRoute('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Section definitions — ids (work, services, about) must match Header anchor hrefs (#work) and Footer #contact
  const sections: Record<string, SectionComponent> = {
    portfolio: {
      id: 'work',
      name: 'Portfolio',
      component: <ExploreMyWork />
    },
    services: {
      id: 'services',
      name: 'Services',
      component: <Skills />
    },
    about: {
      id: 'about',
      name: 'About Me',
      component: <PortfolioCategories />
    },

  };

  const handleDragStart = (sectionId: string) => {
    setDraggedSection(sectionId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetSectionId: string) => {
    if (!draggedSection || draggedSection === targetSectionId) return;

    const newOrder = [...sectionOrder];
    const draggedIndex = newOrder.indexOf(draggedSection);
    const targetIndex = newOrder.indexOf(targetSectionId);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedSection);

    setSectionOrder(newOrder);
    setDraggedSection(null);
  };

  // Route handling
  if (currentRoute === 'about') {
    return (
      <div className="min-h-screen bg-dark-bg text-slate-200 selection:bg-neon-primary selection:text-black overflow-x-hidden">
        <Header />
        <AboutUs onBack={handleBack} />
      </div>
    );
  }

  if (currentRoute === 'services') {
    return (
      <div className="min-h-screen bg-dark-bg text-slate-200 selection:bg-neon-primary selection:text-black overflow-x-hidden">
        <Header />
        <Services onBack={handleBack} />
      </div>
    );
  }

  if (currentRoute === 'software-sales') {
    return (
      <div className="min-h-screen bg-dark-bg text-slate-200 selection:bg-neon-primary selection:text-black overflow-x-hidden">
        <Header />
        <SoftwareSales onBack={handleBack} />
      </div>
    );
  }

  if (currentRoute === 'pricing') {
    return (
      <div className="min-h-screen bg-black text-slate-200 selection:bg-neon-primary selection:text-black overflow-x-hidden">
        <Header />
        <Pricing />
        <Footer />
      </div>
    );
  }

  if (currentRoute.startsWith('project-') || /^\d+$/.test(currentRoute)) {
    const projectId = currentRoute.replace('project-', '');
    return (
      <div className="min-h-screen bg-dark-bg text-slate-200 selection:bg-neon-primary selection:text-black overflow-x-hidden">
        <Header />
        <ProjectDetail projectId={projectId} onBack={handleBack} />
        <Footer />
      </div>
    );
  }

  if (
    currentRoute &&
    currentRoute !== 'about' &&
    currentRoute !== 'services' &&
    currentRoute !== 'all-works'
  ) {
    return (
      <div className="min-h-screen bg-dark-bg text-slate-200 selection:bg-neon-primary selection:text-black overflow-x-hidden">
        <Header />
        <DesignDetail categoryTitle={currentRoute} onBack={handleBack} />
        <Footer />
      </div>
    );
  }

  if (currentRoute === 'all-works') {
    return <FullGallery onBack={handleBack} />;
  }

  // Render sections in order
  const renderSection = (sectionId: string) => {
    const section = sections[sectionId];
    if (!section) return null;

    const sectionElement = (
      <div
        key={section.id}
        id={section.id}
        draggable={isAdminMode}
        onDragStart={() => handleDragStart(section.id)}
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(section.id)}
        className={isAdminMode ? 'relative cursor-move' : ''}
      >
        {isAdminMode && (
          <div className="absolute top-4 right-4 z-10 bg-neon-primary text-black px-3 py-1 rounded text-xs font-mono font-bold">
            {section.name}
          </div>
        )}
        {section.component}
      </div>
    );

    return sectionElement;
  };

  return (
    <div className="min-h-screen selection:bg-neon-primary selection:text-black overflow-x-hidden bg-dark-bg">
      <Header />

      {isAdminMode && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-neon-primary text-black px-4 py-2 rounded-lg font-mono text-sm font-bold shadow-lg">
          Admin Mode: Drag sections to reorder (Ctrl+Shift+A to toggle)
        </div>
      )}
      <main className="pt-24">
        <div
          draggable={isAdminMode}
          onDragStart={() => handleDragStart('portfolio')}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop('portfolio')}
        >
          <Hero activeMenu={activeMenu} />
          <TrustBar />
        </div>

        {sectionOrder.map(sectionId => renderSection(sectionId))}
      </main>
      <Footer />
    </div>
  );
};

export default App;