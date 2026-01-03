package com.portfolio.controller;

import com.portfolio.entity.VisitorLog;
import com.portfolio.repository.VisitorLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final VisitorLogRepository visitorLogRepository;

    @Value("${jwt.secret}")
    private String jwtSecret;

    // 간단한 비밀번호 하드코딩 (실제 운영시에는 DB나 환경변수 사용 권장)
    private final String ADMIN_PASSWORD = "admin_password_123"; 

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String password = loginRequest.get("password");
        if (ADMIN_PASSWORD.equals(password)) {
            // TODO: 실제 JWT 토큰 생성 로직 구현 필요
            Map<String, String> response = new HashMap<>();
            response.put("token", "dummy-jwt-token-for-dev"); 
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid Password"));
        }
    }

    @PostMapping("/log")
    public ResponseEntity<VisitorLog> logVisitor(@RequestBody VisitorLog log, HttpServletRequest request) {
        log.setIp(request.getRemoteAddr());
        log.setUserAgent(request.getHeader("User-Agent"));
        return ResponseEntity.ok(visitorLogRepository.save(log));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long totalVisitors = visitorLogRepository.countByAction("Visit");
        long pageViews = visitorLogRepository.count();
        
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Object[]> dailyStatsRaw = visitorLogRepository.findDailyStats(sevenDaysAgo);
        List<Map<String, Object>> dailyStats = dailyStatsRaw.stream()
            .map(obj -> {
                Map<String, Object> map = new HashMap<>();
                map.put("date", obj[0]);
                map.put("count", obj[1]);
                return map;
            })
            .toList();

        List<Object[]> popularPagesRaw = visitorLogRepository.findPopularPages();
        List<Map<String, Object>> popularPages = popularPagesRaw.stream()
            .map(obj -> {
                Map<String, Object> map = new HashMap<>();
                map.put("name", obj[0]);
                map.put("views", obj[1]);
                return map;
            })
            .toList();
        
        // 최근 로그 20개
        // Pageable을 사용하거나 간단히 stream limit 사용
        List<VisitorLog> logs = visitorLogRepository.findAll().stream()
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .limit(20)
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("totalVisitors", totalVisitors);
        response.put("pageViews", pageViews);
        response.put("dailyStats", dailyStats);
        response.put("popularPages", popularPages);
        response.put("logs", logs);

        return ResponseEntity.ok(response);
    }
}
