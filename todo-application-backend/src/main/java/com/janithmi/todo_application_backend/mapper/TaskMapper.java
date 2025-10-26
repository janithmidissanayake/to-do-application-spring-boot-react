package com.janithmi.todo_application_backend.mapper;

import com.janithmi.todo_application_backend.dto.TaskRequest;
import com.janithmi.todo_application_backend.dto.TaskResponse;
import com.janithmi.todo_application_backend.model.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {
    public Task mapToTask (TaskRequest taskRequest) {
        var task = Task.builder()
                .title(taskRequest.getTitle())
                .description(taskRequest.getDescription())
                .build();
        return task;
    }
    public TaskResponse mapToTaskResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .completed(task.isCompleted())
                .createdAt(task.getCreatedAt())
                .build();
    }
}
