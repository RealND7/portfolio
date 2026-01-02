import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Briefcase, User } from 'lucide-react';
import { projectsApi } from '../api';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (id) {
          const res = await projectsApi.getOne(id);
          setProject(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch project", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#111] text-white flex items-center justify-center">Loading...</div>;
  if (!project) return <div className="min-h-screen bg-[#111] text-white flex items-center justify-center">Project not found.</div>;

  return (
    <div className="min-h-screen bg-[#111] text-white pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Projects
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Left: Image */}
          <div className="space-y-6">
            <div className={`w-full aspect-video rounded-2xl overflow-hidden ${project.image?.startsWith('http') ? '' : project.image || 'bg-gray-800'}`}>
              {project.image?.startsWith('http') ? (
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-8">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium mb-4">
                {project.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
              <p className="text-xl text-gray-400 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-gray-800 pt-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <User className="w-4 h-4" />
                  CLIENT
                </div>
                <p className="font-medium">{project.client || '-'}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Briefcase className="w-4 h-4" />
                  SERVICE
                </div>
                <p className="font-medium">{project.service || '-'}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  YEAR
                </div>
                <p className="font-medium">{project.year || '-'}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  LOCATION
                </div>
                <p className="font-medium">{project.location || '-'}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;
