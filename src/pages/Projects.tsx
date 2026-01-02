import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../api';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectsApi.getAll();
        setProjects(res.data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const nextSlide = () => {
    if (projects.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    if (projects.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  if (loading) return <div className="min-h-screen bg-[#111] text-white flex items-center justify-center">Loading...</div>;
  if (projects.length === 0) return <div className="min-h-screen bg-[#111] text-white flex items-center justify-center">No projects found.</div>;

  return (
    <div className="min-h-screen bg-[#111] text-white overflow-hidden flex flex-col justify-center relative">
      
      {/* Background Text Decoration */}
      <div className="absolute top-20 left-10 text-[10rem] font-black text-[#1a1a1a] select-none pointer-events-none leading-none">
        PROJECTS
      </div>

      <div className="max-w-[1600px] w-full mx-auto px-4 h-[600px] relative flex items-center">
        
        {/* Navigation Buttons */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 z-50 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 z-50 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Carousel Container */}
        <div className="w-full h-full flex items-center justify-center perspective-1000">
          <AnimatePresence mode='wait'>
            {projects.map((project, index) => {
              // Calculate relative position
              let position = index - currentIndex;
              if (position < -1) position += projects.length;
              if (position > 1) position -= projects.length;
              
              // Only render active, prev, and next cards for performance/visuals
              // But for simple carousel logic with few items, we can render all with styles
              
              const isActive = index === currentIndex;
              const isPrev = (index === currentIndex - 1) || (currentIndex === 0 && index === projects.length - 1);
              const isNext = (index === currentIndex + 1) || (currentIndex === projects.length - 1 && index === 0);
              
              if (!isActive && !isPrev && !isNext) return null;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.8, x: 100 }}
                  animate={{ 
                    opacity: isActive ? 1 : 0.4,
                    scale: isActive ? 1 : 0.8,
                    x: isActive ? 0 : isPrev ? -600 : 600,
                    zIndex: isActive ? 10 : 1,
                    rotateY: isActive ? 0 : isPrev ? 25 : -25
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute w-[800px] h-[500px] bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl flex"
                >
                  {/* Content Layout (Like the reference image) */}
                  <div className="w-1/2 p-10 flex flex-col justify-between relative z-10 bg-[#1a1a1a]">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-2 py-1 bg-white text-black text-xs font-bold uppercase">
                          {project.category}
                        </span>
                      </div>
                      <h2 className="text-4xl font-bold leading-tight mb-2">
                        {project.title.split(' ').map((word: string, i: number) => (
                          <span key={i} className="block">{word}</span>
                        ))}
                      </h2>
                    </div>

                    <div className="space-y-4 text-sm text-gray-400">
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Client</p>
                        <p className="text-white">{project.client}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Service Provided</p>
                        <p className="text-white">{project.year} / {project.service}</p>
                      </div>
                      <button 
                        onClick={() => navigate(`/projects/${project._id}`)}
                        className="flex items-center gap-2 text-white font-bold hover:gap-4 transition-all group mt-4"
                      >
                        VIEW PROJECT 
                        <ArrowRight className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
                      </button>
                    </div>
                  </div>

                  {/* Image Area */}
                  <div className={`w-1/2 h-full ${project.image} relative`}>
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] to-transparent w-20"></div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2">
        {projects.map((_, idx) => (
          <div 
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-white' : 'w-4 bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
