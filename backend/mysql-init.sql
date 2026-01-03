-- root 계정으로 접속하여 실행하세요.
-- mysql -u root -p

-- 1. 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS portfolio DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. 사용자 생성 (비밀번호: portfolio_password)
CREATE USER IF NOT EXISTS 'portfolio_user'@'localhost' IDENTIFIED BY 'portfolio_password';

-- 3. 권한 부여
GRANT ALL PRIVILEGES ON portfolio.* TO 'portfolio_user'@'localhost';

-- 4. 권한 적용
FLUSH PRIVILEGES;
