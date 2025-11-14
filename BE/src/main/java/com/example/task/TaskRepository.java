package com.example.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    @Query("SELECT p FROM tasks t JOIN t.parents p WHERE t.id = :id")
    Set<Task> getParentsOf(@Param("id") Integer id);
}
