package com.janithmi.todo_application_backend.repository;

import com.janithmi.todo_application_backend.model.Task;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query("select t from Task t where t.isCompleted = false order by t.createdAt desc")
    List<Task> findLatestActiveTasks(Pageable pageable);
}
