package com.janithmi.todo_application_backend.service.Impl;

import com.janithmi.todo_application_backend.dto.TaskRequest;
import com.janithmi.todo_application_backend.dto.TaskResponse;
import com.janithmi.todo_application_backend.exception.TaskNotFoundException;
import com.janithmi.todo_application_backend.mapper.TaskMapper;
import com.janithmi.todo_application_backend.model.Task;
import com.janithmi.todo_application_backend.repository.TaskRepository;
import com.janithmi.todo_application_backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    @Override
    public TaskResponse createTask (TaskRequest taskRequest) {
        Task task =taskMapper.mapToTask(taskRequest);
        Task savedTask = taskRepository.save(task);
        return taskMapper.mapToTaskResponse(savedTask);
    }

    @Override
    public List<TaskResponse> getLatestTasksActivities(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Task> tasks = taskRepository.findLatestActiveTasks(pageable);
        return tasks.stream()
                .map(taskMapper::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void completeTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id: " + id));

        task.setCompleted(true);
        taskRepository.save(task);
    }


}
