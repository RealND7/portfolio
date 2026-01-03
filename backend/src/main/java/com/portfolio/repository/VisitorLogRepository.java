package com.portfolio.repository;

import com.portfolio.entity.VisitorLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface VisitorLogRepository extends JpaRepository<VisitorLog, Long> {
    long countByAction(String action);

    @Query("SELECT v.page, COUNT(v) as count FROM VisitorLog v WHERE v.action = 'PageView' GROUP BY v.page ORDER BY count DESC")
    List<Object[]> findPopularPages();

    @Query("SELECT CAST(v.timestamp AS LocalDate) as date, COUNT(v) as count FROM VisitorLog v WHERE v.action = 'Visit' AND v.timestamp >= :startDate GROUP BY date ORDER BY date ASC")
    List<Object[]> findDailyStats(@Param("startDate") LocalDateTime startDate);
}
