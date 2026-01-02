import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Skills from './pages/Skills';
import Admin from './pages/Admin';
import { adminApi } from './api';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Log visit on app load (or route change if desired, but let's stick to app load for "Visit" and route change for "PageView")
    const logVisit = async () => {
      try {
        await adminApi.logVisit({
          action: 'Visit',
          page: location.pathname // Changed from details to page to match schema
        });
      } catch (error) {
        console.error("Failed to log visit", error);
      }
    };
    logVisit();
  }, []); // Run once on mount

  useEffect(() => {
     // Log page view on route change
     const logPageView = async () => {
      if (location.pathname === '/') return; // Already logged by initial visit potentially, or just log everything
      try {
        await adminApi.logVisit({
          action: 'PageView',
          page: location.pathname // Changed from details to page to match schema
        });
      } catch (error) {
        // console.error("Failed to log page view", error);
      }
    };
    logPageView();
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="skills" element={<Skills />} />
      </Route>
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
