const express = require('express');
const router = express.Router();
const HomeData = require('../models/HomeData');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use timestamp + original extension to avoid name conflicts
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: Images Only!'));
  }
});

// Upload endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }
    // Return the path to the uploaded file
    // Assuming the server is running on the same host, we return the relative path
    // The frontend will prepend the server URL
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET home data
router.get('/', async (req, res) => {
  try {
    let homeData = await HomeData.findOne();
    if (!homeData) {
      // Return default if not found
      homeData = {
        heroTitle: "WEB PROFESSIONAL",
        heroSubtitle: "Full Stack Developer",
        
        profileImage: "",
        nameKr: "박영선",
        nameEn: "PARK YOUNG SUN",
        email: "thewukc@gmail.com",
        phone: "010 - 2990 2095",

        aboutMeTitle: "About Me",
        aboutMeContent: `"사용자 경험을 최우선으로 생각하는 웹 개발자입니다.\n복잡한 문제를 단순하고 직관적인 인터페이스로 풀어내는 과정에서 즐거움을 느낍니다."`,

        careerTitle: "Career",
        careerContent: `(주)피씨엔 2020.12 ~ 2025.07 기획 (주)피씨엔\n서울시청 2020.03 ~ 2020.11 기획(인턴) (주)피씨엔`,

        projectTitle: "Project",
        projectContent: `KB금융그룹 웹진운영 Web PA\n경기주택도시공사 경기주거복지포털 운영 Web PL\nKB국민은행 골든라이프X 콘텐츠 제작 운영 Web PA\n한국언론진흥재단 뉴스토어 시스템 구축 및 운영 Web PA\n그랜드코리아레저(주) GKL 전자사보, 블로그 제작 운영 Web PA\n대통령비서실 국정현황홈페이지 사업 Web PA`
      };
    }
    res.json(homeData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST/PUT home data
router.post('/', async (req, res) => {
  try {
    let homeData = await HomeData.findOne();
    if (homeData) {
      homeData = await HomeData.findByIdAndUpdate(homeData._id, req.body, { new: true });
    } else {
      homeData = new HomeData(req.body);
      await homeData.save();
    }
    res.json(homeData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;