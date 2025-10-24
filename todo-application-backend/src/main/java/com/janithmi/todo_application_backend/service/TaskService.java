package com.janithmi.todo_application_backend.service;

import com.janithmi.todo_application_backend.dto.TaskRequest;
import com.janithmi.todo_application_backend.dto.TaskResponse;
import com.janithmi.todo_application_backend.model.Task;
import com.janithmi.todo_application_backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskResponse createTask (TaskRequest taskRequest) {
        Task task =  mapToTask(taskRequest);
        Task savedTask = taskRepository.save(task);
        return mapToTaskResponse(savedTask);
    }

    public List<TaskResponse> getLatestTasksActivities(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Task> tasks = taskRepository.findLatestActiveTasks(pageable);
        return tasks.stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void completeTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        task.setCompleted(true);
        taskRepository.save(task); // Persist the change
    }

    private Task mapToTask (TaskRequest taskRequest) {
        var task = Task.builder()
                .title(taskRequest.getTitle())
                .description(taskRequest.getDescription())
                .build();
        return task;
    }

    private TaskResponse mapToTaskResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .isCompleted(task.isCompleted())
                .createdAt(task.getCreatedAt())
                .build();
    }

}
