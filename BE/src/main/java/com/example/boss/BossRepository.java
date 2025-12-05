package com.example.boss;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BossRepository extends JpaRepository<Boss, Long> {
}