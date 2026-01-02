import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Clock, MousePointer, ShieldCheck, LayoutDashboard, Home, FolderKanban, Code2, Save, Plus, Trash2, Edit, LogOut } from 'lucide-react';
import { homeApi, projectsApi, skillsApi, adminApi } from '../api';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // CMS State
  const [homeData, setHomeData] = useState<any>({
    heroTitle: "",
    heroSubtitle: "",
    profileImage: "",
    nameKr: "",
    nameEn: "",
    email: "",
    phone: "",
    aboutMeTitle: "",
    aboutMeContent: "",
    careerTitle: "",
    careerContent: "",
    projectTitle: "",
    projectContent: ""
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  
  // Dashboard State
  const [stats, setStats] = useState<any>({
    totalVisitors: 0,
    pageViews: 0,
    dailyStats: [],
    popularPages: [],
    logs: []
  });

  // Edit States
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingSkill, setEditingSkill] = useState<any>(null);

  // Fetch Data on Login
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardData();
      fetchHomeData();
      fetchProjects();
      fetchSkills();
    }
  }, [isLoggedIn]);

  const fetchDashboardData = async () => {
    try {
      const res = await adminApi.getStats();
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchHomeData = async () => {
    try {
      const res = await homeApi.get();
      setHomeData(res.data);
    } catch (error) {
      console.error("Failed to fetch home data", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await projectsApi.getAll();
      setProjects(res.data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await skillsApi.getAll();
      setSkills(res.data);
    } catch (error) {
      console.error("Failed to fetch skills", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminApi.login(password);
      localStorage.setItem('adminToken', res.data.token);
      setIsLoggedIn(true);
    } catch (error) {
      alert('로그인 실패: 비밀번호를 확인하세요.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setPassword('');
  };

  const handleSaveHome = async () => {
    try {
      await homeApi.update(homeData);
      alert('홈 설정이 저장되었습니다!');
    } catch (error) {
      alert('홈 설정 저장 실패');
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject._id) {
        await projectsApi.update(editingProject._id, editingProject);
      } else {
        await projectsApi.create(editingProject);
      }
      setEditingProject(null);
      fetchProjects();
      alert('프로젝트가 저장되었습니다!');
    } catch (error) {
      alert('프로젝트 저장 실패');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('정말 이 프로젝트를 삭제하시겠습니까?')) {
      try {
        await projectsApi.delete(id);
        fetchProjects();
      } catch (error) {
        alert('프로젝트 삭제 실패');
      }
    }
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkill._id) {
        await skillsApi.update(editingSkill._id, editingSkill);
      } else {
        await skillsApi.create(editingSkill);
      }
      setEditingSkill(null);
      fetchSkills();
      alert('스킬이 저장되었습니다!');
    } catch (error) {
      alert('스킬 저장 실패');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (confirm('정말 이 스킬을 삭제하시겠습니까?')) {
      try {
        await skillsApi.delete(id);
        fetchSkills();
      } catch (error) {
        alert('스킬 삭제 실패');
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96 border border-gray-700">
          <div className="flex justify-center mb-6">
            <ShieldCheck className="w-12 h-12 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-6">관리자 접속</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-500 transition-colors"
          >
            로그인
          </button>
        </form>
      </div>
    );
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/api/home/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Assuming the server returns the relative path, we prepend the server URL
      const imageUrl = `http://localhost:5000${response.data.imageUrl}`;
      setHomeData({ ...homeData, profileImage: imageUrl });
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-gray-400">총 방문자 수</span>
          </div>
          <p className="text-3xl font-bold">{stats.totalVisitors}</p>
          <p className="text-sm text-green-400 mt-2">+12% (지난주 대비)</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <MousePointer className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-gray-400">페이지 조회수</span>
          </div>
          <p className="text-3xl font-bold">{stats.pageViews}</p>
          <p className="text-sm text-green-400 mt-2">+8% (지난주 대비)</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-gray-400">평균 체류 시간</span>
          </div>
          <p className="text-3xl font-bold">4m 12s</p>
          <p className="text-sm text-red-400 mt-2">-2% (지난주 대비)</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold mb-6">주간 방문자 추이</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="_id" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold mb-6">인기 페이지</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.popularPages}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="views" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Logs Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold">최근 활동 로그</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-700/50 text-gray-400">
              <tr>
                <th className="px-6 py-3 text-sm font-medium">시간</th>
                <th className="px-6 py-3 text-sm font-medium">IP 주소</th>
                <th className="px-6 py-3 text-sm font-medium">페이지</th>
                <th className="px-6 py-3 text-sm font-medium">활동</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {stats.logs.map((log: any) => (
                <tr key={log._id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-300">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="px-6 py-4 text-sm font-mono text-blue-400">{log.ip}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{log.page}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                      {log.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderHomeEditor = () => (
    <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 space-y-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Home className="w-6 h-6 text-blue-500" />
        홈 페이지 설정
      </h2>
      
      {/* Hero Section */}
      <div className="space-y-4 border-b border-gray-700 pb-6">
        <h3 className="text-lg font-semibold text-blue-400">메인 상단 (Hero) 설정</h3>
        <div>
          <label className="block text-gray-400 mb-2">메인 타이틀</label>
          <input 
            type="text" 
            value={homeData.heroTitle || ''}
            onChange={(e) => setHomeData({...homeData, heroTitle: e.target.value})}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2">메인 서브 타이틀</label>
          <input 
            type="text" 
            value={homeData.heroSubtitle || ''}
            onChange={(e) => setHomeData({...homeData, heroSubtitle: e.target.value})}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Profile Section */}
      <div className="space-y-4 border-b border-gray-700 pb-6">
        <h3 className="text-lg font-semibold text-blue-400">프로필 설정</h3>
        <div>
          <label className="block text-gray-400 mb-2">프로필 이미지</label>
          <div className="flex items-center gap-4">
            {homeData.profileImage && (
              <img 
                src={homeData.profileImage} 
                alt="Profile Preview" 
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
              />
            )}
            <div className="flex-1">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              <p className="text-xs text-gray-500 mt-2">
                권장 사이즈: 500x500px (1:1 비율), 최대 2MB. JPG, PNG, GIF 지원.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 mb-2">한글 이름</label>
            <input 
              type="text" 
              value={homeData.nameKr || ''}
              onChange={(e) => setHomeData({...homeData, nameKr: e.target.value})}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">영문 이름</label>
            <input 
              type="text" 
              value={homeData.nameEn || ''}
              onChange={(e) => setHomeData({...homeData, nameEn: e.target.value})}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 mb-2">이메일</label>
            <input 
              type="text" 
              value={homeData.email || ''}
              onChange={(e) => setHomeData({...homeData, email: e.target.value})}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">전화번호</label>
            <input 
              type="text" 
              value={homeData.phone || ''}
              onChange={(e) => setHomeData({...homeData, phone: e.target.value})}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Introduction Sections */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-blue-400">소개 영역 설정</h3>
        
        {/* About Me */}
        <div className="bg-gray-700/30 p-4 rounded-lg">
          <div className="mb-2">
            <label className="block text-gray-400 mb-1 text-sm">자기소개 타이틀</label>
            <input 
              type="text" 
              value={homeData.aboutMeTitle || ''}
              onChange={(e) => setHomeData({...homeData, aboutMeTitle: e.target.value})}
              className="w-full bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1 text-sm">자기소개 내용</label>
            <textarea 
              value={homeData.aboutMeContent || ''}
              onChange={(e) => setHomeData({...homeData, aboutMeContent: e.target.value})}
              rows={3}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Career */}
        <div className="bg-gray-700/30 p-4 rounded-lg">
          <div className="mb-2">
            <label className="block text-gray-400 mb-1 text-sm">경력사항 타이틀</label>
            <input 
              type="text" 
              value={homeData.careerTitle || ''}
              onChange={(e) => setHomeData({...homeData, careerTitle: e.target.value})}
              className="w-full bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1 text-sm">경력사항 내용 (줄바꿈으로 구분)</label>
            <textarea 
              value={homeData.careerContent || ''}
              onChange={(e) => setHomeData({...homeData, careerContent: e.target.value})}
              rows={4}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Project Summary */}
        <div className="bg-gray-700/30 p-4 rounded-lg">
          <div className="mb-2">
            <label className="block text-gray-400 mb-1 text-sm">프로젝트 요약 타이틀</label>
            <input 
              type="text" 
              value={homeData.projectTitle || ''}
              onChange={(e) => setHomeData({...homeData, projectTitle: e.target.value})}
              className="w-full bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1 text-sm">프로젝트 요약 내용 (줄바꿈으로 구분)</label>
            <textarea 
              value={homeData.projectContent || ''}
              onChange={(e) => setHomeData({...homeData, projectContent: e.target.value})}
              rows={6}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSaveHome}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition-colors"
        >
          <Save className="w-4 h-4" />
          변경사항 저장
        </button>
      </div>
    </div>
  );

  const renderProjectEditor = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FolderKanban className="w-6 h-6 text-purple-500" />
          포트폴리오 관리
        </h2>
        <button 
          onClick={() => setEditingProject({})}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          프로젝트 추가
        </button>
      </div>

      {editingProject ? (
        <form onSubmit={handleSaveProject} className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
          <h3 className="text-xl font-bold mb-4">{editingProject._id ? '프로젝트 수정' : '새 프로젝트'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1">프로젝트명</label>
              <input 
                required
                value={editingProject.title || ''}
                onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                className="w-full bg-gray-700 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">카테고리</label>
              <input 
                value={editingProject.category || ''}
                onChange={e => setEditingProject({...editingProject, category: e.target.value})}
                className="w-full bg-gray-700 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">클라이언트</label>
              <input 
                value={editingProject.client || ''}
                onChange={e => setEditingProject({...editingProject, client: e.target.value})}
                className="w-full bg-gray-700 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">연도</label>
              <input 
                value={editingProject.year || ''}
                onChange={e => setEditingProject({...editingProject, year: e.target.value})}
                className="w-full bg-gray-700 rounded px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 mb-1">설명</label>
            <textarea 
              value={editingProject.description || ''}
              onChange={e => setEditingProject({...editingProject, description: e.target.value})}
              className="w-full bg-gray-700 rounded px-3 py-2"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button 
              type="button"
              onClick={() => setEditingProject(null)}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              취소
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              프로젝트 저장
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map(project => (
            <div key={project._id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{project.title}</h3>
                <p className="text-gray-400 text-sm">{project.client} • {project.year}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingProject(project)}
                  className="p-2 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteProject(project._id)}
                  className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSkillEditor = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Code2 className="w-6 h-6 text-yellow-500" />
          스킬 관리
        </h2>
        <button 
          onClick={() => setEditingSkill({})}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          스킬 추가
        </button>
      </div>

      {editingSkill ? (
        <form onSubmit={handleSaveSkill} className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
          <h3 className="text-xl font-bold mb-4">{editingSkill._id ? '스킬 수정' : '새 스킬'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1">스킬명</label>
              <input 
                required
                value={editingSkill.name || ''}
                onChange={e => setEditingSkill({...editingSkill, name: e.target.value})}
                className="w-full bg-gray-700 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">언어 모드</label>
              <select 
                value={editingSkill.language || 'javascript'}
                onChange={e => setEditingSkill({...editingSkill, language: e.target.value})}
                className="w-full bg-gray-700 rounded px-3 py-2"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="css">CSS</option>
                <option value="html">HTML</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-400 mb-1">코드 스니펫</label>
            <textarea 
              value={editingSkill.code || ''}
              onChange={e => setEditingSkill({...editingSkill, code: e.target.value})}
              className="w-full bg-gray-700 rounded px-3 py-2 font-mono text-sm"
              rows={10}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button 
              type="button"
              onClick={() => setEditingSkill(null)}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              취소
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              스킬 저장
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map(skill => (
            <div key={skill._id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-700 rounded">
                  <Code2 className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold">{skill.name}</h3>
                  <p className="text-gray-400 text-xs uppercase">{skill.language}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingSkill(skill)}
                  className="p-2 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteSkill(skill._id)}
                  className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
            관리자 패널
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            대시보드
          </button>
          <button 
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'home' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          >
            <Home className="w-5 h-5" />
            홈 관리
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'projects' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          >
            <FolderKanban className="w-5 h-5" />
            포트폴리오 관리
          </button>
          <button 
            onClick={() => setActiveTab('skills')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'skills' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          >
            <Code2 className="w-5 h-5" />
            스킬 관리
          </button>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            로그아웃
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto h-screen">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'home' && renderHomeEditor()}
        {activeTab === 'projects' && renderProjectEditor()}
        {activeTab === 'skills' && renderSkillEditor()}
      </div>
    </div>
  );
};

export default Admin;
