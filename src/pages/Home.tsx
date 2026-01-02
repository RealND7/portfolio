import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { homeApi, skillsApi } from '../api';

const Home = () => {
  const [homeData, setHomeData] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeRes, skillsRes] = await Promise.all([
          homeApi.get(),
          skillsApi.getAll()
        ]);
        setHomeData(homeRes.data);
        setSkills(skillsRes.data);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        {/* Header Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="h-[1px] w-12 bg-gray-400"></div>
            <span className="text-gray-500 tracking-widest font-medium">PORTFOLIO</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-[#2B4C7E] tracking-tighter">
            {homeData?.heroTitle || "WEB PROFESSIONAL"}
          </h1>
          <p className="text-2xl text-gray-600 mt-4">{homeData?.heroSubtitle || "Full Stack Developer"}</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column: Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-[380px] flex-shrink-0"
          >
            <div className="border-2 border-gray-800 rounded-[32px] overflow-hidden bg-white shadow-xl">
              <div className="p-8 flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-8">Profile</h2>
                
                {/* Image Placeholder */}
                <div className="w-48 h-64 bg-gray-200 mb-8 flex items-center justify-center text-gray-400 overflow-hidden rounded-lg">
                  {homeData?.profileImage ? (
                    <img src={homeData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    "이미지 영역"
                  )}
                </div>

                <div className="text-center space-y-1 w-full">
                  <p className="font-bold text-lg">{homeData?.nameKr || "박영선"}</p>
                  <p className="font-bold text-lg mb-4">{homeData?.nameEn || "PARK YOUNG SUN"}</p>
                  <p className="text-gray-600">{homeData?.email || "thewukc@gmail.com"}</p>
                  <p className="text-gray-600">{homeData?.phone || "010 - 2990 2095"}</p>
                </div>
              </div>
              {/* Card Footer Decoration */}
              <div className="h-12 bg-[#1F1F1F] mt-4 mx-4 mb-4 rounded-b-2xl rounded-t-md"></div>
            </div>
          </motion.div>

          {/* Right Column: Info & Skills */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-1 space-y-16"
          >
            {/* About Me */}
            <section>
              <h2 className="text-3xl font-bold mb-6">{homeData?.aboutMeTitle || "About Me"}</h2>
              <div className="space-y-2 text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {homeData?.aboutMeContent || `"사용자 경험을 최우선으로 생각하는 웹 개발자입니다.
복잡한 문제를 단순하고 직관적인 인터페이스로 풀어내는 과정에서 즐거움을 느낍니다."`}
              </div>
            </section>

            {/* Career */}
            <section>
              <div className="flex items-baseline gap-3 mb-6">
                <h2 className="text-3xl font-bold">{homeData?.careerTitle || "Career"}</h2>
                <span className="text-gray-400 font-medium">경력사항</span>
              </div>
              <div className="space-y-2 text-lg whitespace-pre-line">
                {homeData?.careerContent || `(주)피씨엔 2020.12 ~ 2025.07 기획 (주)피씨엔
서울시청 2020.03 ~ 2020.11 기획(인턴) (주)피씨엔`}
              </div>
            </section>

            {/* Project */}
            <section>
              <div className="flex items-baseline gap-3 mb-6">
                <h2 className="text-3xl font-bold">{homeData?.projectTitle || "Project"}</h2>
                <span className="text-gray-400 font-medium">업무수행 경력</span>
              </div>
              <div className="space-y-2 text-lg whitespace-pre-line">
                {homeData?.projectContent || `KB금융그룹 웹진운영 Web PA
경기주택도시공사 경기주거복지포털 운영 Web PL
KB국민은행 골든라이프X 콘텐츠 제작 운영 Web PA
한국언론진흥재단 뉴스토어 시스템 구축 및 운영 Web PA
그랜드코리아레저(주) GKL 전자사보, 블로그 제작 운영 Web PA
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
          className="mt-24"
        >
          <div className="flex items-baseline gap-3 mb-8">
            <h2 className="text-3xl font-bold">Skills</h2>
            <span className="text-gray-400 font-medium">보유역량</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {skills.map((skill) => (
              <div 
                key={skill.name}
                className="w-28 h-28 border border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors cursor-default"
              >
                <span className="font-bold text-sm text-center px-2">{skill.name}</span>
                <span className="text-sm text-gray-500">{skill.level}</span>
              </div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default Home;
