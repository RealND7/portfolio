package com.portfolio.repository;

import com.portfolio.entity.HomeData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HomeDataRepository extends JpaRepository<HomeData, Long> {
}
