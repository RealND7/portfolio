import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FileCode2, ChevronRight, ChevronDown } from 'lucide-react';
import { skillsApi } from '../api';

const Skills = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [isFolderOpen, setIsFolderOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await skillsApi.getAll();
        setSkills(res.data);
        if (res.data.length > 0) {
          setSelectedSkill(res.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch skills", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleSkillClick = (skill: any) => {
    setSelectedSkill(skill);
  };

  if (loading) return <div className="min-h-screen bg-[#1e1e1e] text-white flex items-center justify-center">Loading...</div>;
  if (skills.length === 0) return <div className="min-h-screen bg-[#1e1e1e] text-white flex items-center justify-center">No skills found.</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#1e1e1e] text-gray-300 overflow-hidden">
      
      {/* Sidebar (Explorer) */}
      <div className="w-64 bg-[#252526] border-r border-[#333] flex flex-col">
        <div className="p-3 text-xs font-bold tracking-wider text-gray-500 uppercase">Explorer</div>
        
        {/* Project Folder */}
        <div>
          <div 
            className="flex items-center gap-1 px-2 py-1 hover:bg-[#2a2d2e] cursor-pointer text-gray-200 font-bold"
            onClick={() => setIsFolderOpen(!isFolderOpen)}
          >
            {isFolderOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span className="text-sm">PORTFOLIO-SKILLS</span>
          </div>

          {/* File List */}
          {isFolderOpen && (
            <div className="mt-1">
              {skills.map((skill) => (
                <div
                  key={skill._id}
                  onClick={() => handleSkillClick(skill)}
                  className={`
                    flex items-center gap-2 px-6 py-1 cursor-pointer text-sm transition-colors
                    ${selectedSkill?._id === skill._id ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-gray-400'}
                  `}
                >
                  <FileCode2 className={`w-4 h-4 ${
                    skill.name === 'React' ? 'text-blue-400' :
                    skill.name === 'TypeScript' ? 'text-blue-600' :
                    skill.name === 'Tailwind' ? 'text-cyan-400' :
                    'text-yellow-400'
                  }`} />
                  <span>{skill.name}.{skill.language === 'typescript' ? 'tsx' : 'css'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        {selectedSkill && (
          <div className="flex bg-[#252526] border-b border-[#1e1e1e]">
            <div className="px-4 py-2 bg-[#1e1e1e] border-t-2 border-blue-500 text-white text-sm flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-blue-400" />
              <span>{selectedSkill.name}.{selectedSkill.language === 'typescript' ? 'tsx' : 'css'}</span>
            </div>
          </div>
        )}

        {/* Monaco Editor */}
        <div className="flex-1 relative">
          {selectedSkill && (
            <Editor
              height="100%"
              defaultLanguage="typescript"
              language={selectedSkill.language}
              value={selectedSkill.code}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 24,
                fontFamily: "'Fira Code', monospace",
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                padding: { top: 20 },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Skills;
