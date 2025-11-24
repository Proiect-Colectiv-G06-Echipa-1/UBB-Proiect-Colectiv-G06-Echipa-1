package com.example.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    @Query("SELECT p FROM tasks t JOIN t.parents p WHERE t.id = :id")
    Set<Task> getParentsOf(@Param("id") Integer id);
    List<Task> findAllByStatus(TaskStatus status);
    List<Task> findByStatusAndAssignees_Id(TaskStatus status, Long assigneeID);
    @Query(value = """
        WITH RECURSIVE blocked_tasks AS (
            -- 1. Find tasks directly blocked by an incomplete parent
            SELECT td.task_id 
            FROM task_dependencies td
            JOIN tasks parent ON td.parent_task_id = parent.id
            WHERE parent.status <> 'COMPLETED'
            
            UNION
            
            -- 2. Find tasks blocked by tasks found in step 1 (Indirect)
            SELECT td.task_id
            FROM task_dependencies td
            JOIN blocked_tasks bt ON td.parent_task_id = bt.task_id
        )
        SELECT COUNT(DISTINCT task_id) FROM blocked_tasks
        """, nativeQuery = true)
    long countBlockedTasks();
}
