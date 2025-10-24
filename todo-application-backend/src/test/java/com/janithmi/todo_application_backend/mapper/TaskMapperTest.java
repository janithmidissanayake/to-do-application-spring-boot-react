package com.janithmi.todo_application_backend.mapper;


import com.janithmi.todo_application_backend.dto.TaskRequest;
import com.janithmi.todo_application_backend.dto.TaskResponse;
import com.janithmi.todo_application_backend.model.Task;
import org.junit.jupiter.api.Test;
import java.time.ZonedDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class TaskMapperTest {

    // The class under test is instantiated directly
    private final TaskMapper taskMapper = new TaskMapper();

    @Test
    void mapToTask_shouldCorrectlyMapRequestToEntity() {
        // 1. Arrange
        TaskRequest request = new TaskRequest("Buy Groceries", "Milk, bread, eggs");

        // 2. Act
        Task task = taskMapper.mapToTask(request);

        // 3. Assert (Check if fields were copied correctly)
        assertThat(task).isNotNull();
        assertThat(task.getTitle()).isEqualTo("Buy Groceries");
        assertThat(task.getDescription()).isEqualTo("Milk, bread, eggs");

        // Assert defaults provided by Task.builder() if applicable (e.g., isCompleted is null/false)
        assertThat(task.getId()).isNull();
        assertThat(task.isCompleted()).isFalse();
    }

    @Test
    void mapToTaskResponse_shouldCorrectlyMapEntityToResponse() {
        // 1. Arrange
        Long taskId = 5L;
        ZonedDateTime creationTime = ZonedDateTime.now().minusHours(1);

        Task task = Task.builder()
                .id(taskId)
                .title("Complete Report")
                .description("Final check before submission.")
                .isCompleted(true)
                .createdAt(creationTime)
                .build();

        // 2. Act
        TaskResponse response = taskMapper.mapToTaskResponse(task);

        // 3. Assert (Check if all fields were copied correctly)
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(taskId);
        assertThat(response.getTitle()).isEqualTo("Complete Report");
        assertThat(response.getDescription()).isEqualTo("Final check before submission.");
        assertThat(response.isCompleted()).isTrue();
        assertThat(response.getCreatedAt()).isEqualTo(creationTime);
    }
}

