package com.janithmi.todo_application_backend.mapper;


import com.janithmi.todo_application_backend.dto.TaskRequest;
import com.janithmi.todo_application_backend.dto.TaskResponse;
import com.janithmi.todo_application_backend.model.Task;
import org.junit.jupiter.api.Test;
import java.time.ZonedDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class TaskMapperTest {

    private final TaskMapper taskMapper = new TaskMapper();

    @Test
    void mapToTask_shouldCorrectlyMapRequestToEntity() {
        TaskRequest request = new TaskRequest("Buy Groceries", "Milk, bread, eggs");

        Task task = taskMapper.mapToTask(request);

        assertThat(task).isNotNull();
        assertThat(task.getTitle()).isEqualTo("Buy Groceries");
        assertThat(task.getDescription()).isEqualTo("Milk, bread, eggs");

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

        TaskResponse response = taskMapper.mapToTaskResponse(task);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(taskId);
        assertThat(response.getTitle()).isEqualTo("Complete Report");
        assertThat(response.getDescription()).isEqualTo("Final check before submission.");
        assertThat(response.isCompleted()).isTrue();
        assertThat(response.getCreatedAt()).isEqualTo(creationTime);
    }
}

