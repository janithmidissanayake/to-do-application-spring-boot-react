package com.janithmi.todo_application_backend.service;

import com.janithmi.todo_application_backend.dto.TaskRequest;
import com.janithmi.todo_application_backend.dto.TaskResponse;

import java.util.List;

public interface TaskService {
    TaskResponse createTask(TaskRequest taskRequest);
    List<TaskResponse> getLatestTasksActivities(int limit);
    void completeTask(Long id);
}
