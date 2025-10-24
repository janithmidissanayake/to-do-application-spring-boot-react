package com.janithmi.todo_application_backend.repository;

import com.janithmi.todo_application_backend.model.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.ZonedDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;


@DataJpaTest
public class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    private Task saveTask(String title, boolean isCompleted, ZonedDateTime createdAt) {
        Task task = Task.builder()
                .title(title)
                .isCompleted(isCompleted)
                .createdAt(createdAt)
                .build();
        return taskRepository.save(task);
    }

    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
    }

    @Test
    void findLatestActiveTasks() {
        ZonedDateTime now = ZonedDateTime.now();

        saveTask("Buy Milk", false, now.minusDays(3));
        saveTask("Finished Project", true, now.minusDays(2)); // completed, excluded
        saveTask("Review Code", false, now.minusDays(2).plusMinutes(1));
        saveTask("Call Client", false, now.minusDays(1).plusSeconds(5)); // newest

        Pageable pageable = PageRequest.of(0, 3);

        List<Task> result = taskRepository.findLatestActiveTasks(pageable);

        assertThat(result).isNotNull().hasSize(3);
        assertThat(result.get(0).getTitle()).isEqualTo("Call Client");
        assertThat(result.get(1).getTitle()).isEqualTo("Review Code");
        assertThat(result.get(2).getTitle()).isEqualTo("Buy Milk");
        assertThat(result).extracting(Task::isCompleted).containsOnly(false);
    }

    @Test
    void findLatestActiveTasks_shouldRespectLimit() {
        ZonedDateTime now = ZonedDateTime.now();

        // Add small offsets to ensure strict ordering
        saveTask("Task A", false, now.minusDays(3));
        saveTask("Task B", false, now.minusDays(2).plusSeconds(1));
        saveTask("Task C", false, now.minusDays(1).plusSeconds(2));

        Pageable pageable = PageRequest.of(0, 2); // limit 2

        List<Task> result = taskRepository.findLatestActiveTasks(pageable);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getCreatedAt())
                .isAfter(result.get(1).getCreatedAt());
    }

    @Test
    void findLatestActiveTasks_limitLargerThanAvailableTasks_shouldReturnAll() {
        ZonedDateTime now = ZonedDateTime.now();

        saveTask("Task X", false, now.minusDays(2).plusSeconds(1));
        saveTask("Task Y", false, now.minusDays(1).plusSeconds(2));

        Pageable pageable = PageRequest.of(0, 5);

        List<Task> result = taskRepository.findLatestActiveTasks(pageable);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getCreatedAt())
                .isAfter(result.get(1).getCreatedAt());
    }

    @Test
    void findLatestActiveTasks_noTasks_shouldReturnEmptyList() {
        Pageable pageable = PageRequest.of(0, 3);

        List<Task> result = taskRepository.findLatestActiveTasks(pageable);

        assertThat(result).isNotNull().isEmpty();
    }

    @Test
    void findLatestActiveTasks_allCompleted_shouldReturnEmptyList() {
        ZonedDateTime now = ZonedDateTime.now();

        saveTask("Task 1", true, now.minusDays(1));
        saveTask("Task 2", true, now.minusDays(2));

        Pageable pageable = PageRequest.of(0, 2);

        List<Task> result = taskRepository.findLatestActiveTasks(pageable);

        assertThat(result).isNotNull().isEmpty();
    }
}
