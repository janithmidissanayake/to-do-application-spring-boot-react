package com.janithmi.todo_application_backend.controller;

import com.janithmi.todo_application_backend.dto.TaskRequest;
import com.janithmi.todo_application_backend.dto.TaskResponse;
import com.janithmi.todo_application_backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

private final TaskService taskService;

    @PostMapping("/createTask")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse createTask(@RequestBody TaskRequest request) {
        TaskResponse response = taskService.createTask(request);
        return response;
    }

    @GetMapping("/recentTasks")
    @ResponseStatus(HttpStatus.OK)
    public List<TaskResponse> getLatestTasks(@RequestParam(defaultValue = "5") int limit) {
        if (limit <= 0) limit = 5;
        List<TaskResponse> tasks = taskService.getLatestTasksActivities(limit);
        return tasks;
    }

    @PutMapping("/{id}/complete")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content for successful modification with no response body
    public void completeTask(@PathVariable Long id) {
        taskService.completeTask(id);
    }
}
