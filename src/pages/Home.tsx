import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { homeApi } from '../api';

const Home = () => {
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;

    const animate = () => {
      if (!isDragging && !isPaused) {
        container.scrollLeft += 1; // Adjust speed here
        // Infinite scroll reset
        if (container.scrollLeft >= container.scrollWidth / 3) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isDragging, isPaused]);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Scroll-fast
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const onTouchStart = () => setIsPaused(true);
  const onTouchEnd = () => setIsPaused(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homeRes = await homeApi.get();
        setHomeData(homeRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
        
        {/* Header Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 md:mb-20"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="h-[1px] w-8 md:w-12 bg-gray-400"></div>
            <span className="text-sm md:text-base text-gray-500 tracking-widest font-medium">PORTFOLIO</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-black animate-text-shine tracking-tighter break-words leading-tight pb-2">
            {homeData?.heroTitle || "WEB PROFESSIONAL"}
          </h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 md:gap-16">
          {/* Left Column: Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-[380px] flex-shrink-0"
          >
            <div className="border-2 border-gray-800 rounded-[32px] overflow-hidden bg-white shadow-xl">
              <div className="p-6 md:p-8 flex flex-col items-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Profile</h2>
                
                {/* Image Placeholder */}
                <div className="w-40 h-56 md:w-48 md:h-64 bg-gray-200 mb-6 md:mb-8 flex items-center justify-center text-gray-400 overflow-hidden rounded-lg">
                  {homeData?.profileImage ? (
                    <img src={homeData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    "이미지 영역"
                  )}
                </div>

                <div className="text-center space-y-1 w-full">
                  <p className="font-bold text-base md:text-lg">{homeData?.nameKr || "박영선"}</p>
                  <p className="font-bold text-base md:text-lg mb-4">{homeData?.nameEn || "PARK YOUNG SUN"}</p>
                  <p className="text-sm md:text-base text-gray-600">{homeData?.email || "thewukc@gmail.com"}</p>
                  <p className="text-sm md:text-base text-gray-600">{homeData?.phone || "010 - 2990 2095"}</p>
                </div>
              </div>
              {/* Call Button */}
              <a 
                href={`tel:${homeData?.phone?.replace(/[^0-9]/g, '') || "01029902095"}`}
                className="h-12 bg-[#CCFF00] mt-4 mx-4 mb-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer text-black no-underline shadow-sm"
              >
                <Phone className="w-5 h-5 fill-black" strokeWidth={2.5} />
                <span className="font-bold text-lg tracking-tight">Make a Call</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Info & Skills */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-1 space-y-12 md:space-y-16"
          >
            {/* About Me */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">{homeData?.aboutMeTitle || "About Me"}</h2>
              <div className="space-y-2 text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {homeData?.aboutMeContent || `"사용자 경험을 최우선으로 생각하는 웹 개발자입니다.
복잡한 문제를 단순하고 직관적인 인터페이스로 풀어내는 과정에서 즐거움을 느낍니다."`}
              </div>
            </section>

            {/* Career */}
            <section>
              <div className="flex items-baseline gap-3 mb-4 md:mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">{homeData?.careerTitle || "Career"}</h2>
                <span className="text-sm md:text-base text-gray-400 font-medium">경력사항</span>
              </div>
              <div className="space-y-2 text-base md:text-lg whitespace-pre-line">
                {homeData?.careerContent || `(주)피씨엔 2020.12 ~ 2025.07 기획 (주)피씨엔
서울시청 2020.03 ~ 2020.11 기획(인턴) (주)피씨엔`}
              </div>
            </section>

            {/* Project */}
            <section>
              <div className="flex items-baseline gap-3 mb-4 md:mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">{homeData?.projectTitle || "Project"}</h2>
                <span className="text-sm md:text-base text-gray-400 font-medium">업무수행 경력</span>
              </div>
              <div className="space-y-2 text-base md:text-lg whitespace-pre-line">
                {homeData?.projectContent || `KB금융그룹 웹진운영 Web PA
경기주택도시공사 경기주거복지포털 운영 Web PL
KB국민은행 골든라이프X 콘텐츠 제작 운영 Web PA
한국언론진흥재단 뉴스토어 시스템 구축 Web PA
한국언론진흥재단 뉴스토어 시스템 운영 Web PA
그랜드코리아레저(주) GKL 전자사보 구축 Web PA
그랜드코리아레저(주) 블로그 제작 운영 Web PA
대통령비서실 국정현황홈페이지 사업 Web PA`}
              </div>
            </section>
          </motion.div>
        </div>

        {/* Skills Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 md:mt-24 overflow-hidden"
        >
          <div className="flex items-baseline gap-3 mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Skills</h2>
            <span className="text-sm md:text-base text-gray-400 font-medium">보유역량</span>
          </div>
          
          <div 
            ref={scrollRef}
            className="relative w-full overflow-x-auto no-scrollbar py-10 px-4 cursor-grab active:cursor-grabbing"
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="flex gap-4 w-max">
              {[...STATIC_SKILLS, ...STATIC_SKILLS, ...STATIC_SKILLS].map((skill, index) => (
                <div 
                  key={`${skill.name}-${index}`}
                  className="group w-24 h-24 md:w-28 md:h-28 border border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white flex-shrink-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 hover:border-[var(--skill-color)]"
                  style={{ '--skill-color': `#${skill.color}` } as React.CSSProperties}
                >
                  <img src={skill.icon} alt={skill.name} className="w-10 h-10 md:w-14 md:h-14 object-contain transition-transform duration-300 group-hover:scale-110 pointer-events-none" />
                  <span className="font-bold text-xs md:text-sm text-center px-1 text-gray-800 transition-colors duration-300 group-hover:text-[var(--skill-color)]">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

const STATIC_SKILLS = [
  { name: "PowerPoint", level: "상", icon: "https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/file_type_powerpoint.svg", color: "B7472A" },
  { name: "Excel", level: "상", icon: "https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/file_type_excel.svg", color: "217346" },
  { name: "Figma", level: "상", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", color: "F24E1E" },
  { name: "Photoshop", level: "상", icon: "https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/file_type_photoshop.svg", color: "31A8FF" },
  { name: "HTML5", level: "상", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", color: "E34F26" },
  { name: "CSS3", level: "상", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", color: "1572B6" },
  { name: "JavaScript", level: "상", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", color: "F7DF1E" },
  { name: "TypeScript", level: "중", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", color: "3178C6" },
  { name: "React", level: "중", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", color: "61DAFB" },
  { name: "Tailwind", level: "중", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", color: "06B6D4" },
  { name: "Node.js", level: "중", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", color: "339933" },
];

export default Home;
