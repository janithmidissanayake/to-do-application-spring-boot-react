package com.janithmi.todo_application_backend.service.Impl;

import com.janithmi.todo_application_backend.dto.TaskRequest;
import com.janithmi.todo_application_backend.dto.TaskResponse;
import com.janithmi.todo_application_backend.exception.TaskNotFoundException;
import com.janithmi.todo_application_backend.mapper.TaskMapper;
import com.janithmi.todo_application_backend.model.Task;
import com.janithmi.todo_application_backend.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

public class TaskServiceImplTest {
    @Mock
    private TaskRepository taskRepository;

    @Mock
    private TaskMapper taskMapper;
    @InjectMocks
    private TaskServiceImpl taskService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private Task createMockTask(Long id) {
        return Task.builder()
                .id(id)
                .title("Task Title")
                .description("Task Description")
                .createdAt(ZonedDateTime.now())
                .build();
    }
    private TaskResponse createMockResponse(Long id) {
        return TaskResponse.builder()
                .id(id)
                .title("Groceries")
                .description("Buy fruits and vegetables")
                .build();
    }

    //successful task creation
    @Test
    void createTaskSuccessfully() {
        TaskRequest mockRequest = new TaskRequest("Groceries", "Buy fruits and vegetables");
        Task unsavedTask = createMockTask(null);
        Task savedTask = createMockTask(1L);
        TaskResponse expectedResponse = createMockResponse(1L);
        given(taskMapper.mapToTask(eq(mockRequest))).willReturn(unsavedTask);
        given(taskRepository.save(eq(unsavedTask))).willReturn(savedTask); // FIXED
        given(taskMapper.mapToTaskResponse(eq(savedTask))).willReturn(expectedResponse);

        TaskResponse actualResponse = taskService.createTask(mockRequest);

        assertThat(actualResponse).isNotNull();
        assertThat(actualResponse.getId()).isEqualTo(1L);
        assertThat(actualResponse.getTitle()).isEqualTo("Groceries");

        verify(taskMapper, times(1)).mapToTask(eq(mockRequest));
        verify(taskRepository, times(1)).save(eq(unsavedTask));
        verify(taskMapper, times(1)).mapToTaskResponse(eq(savedTask));
    }

    @Test
    void getLatestTasksActivities_shouldFetchAndMapTasks() {
        int limit = 2;
        Task task1 = createMockTask(1L);
        Task task2 = createMockTask(2L);
        List<Task> mockTasks = Arrays.asList(task1, task2);

        TaskResponse response1 = createMockResponse(1L);
        TaskResponse response2 = createMockResponse(2L);

        Pageable expectedPageable = PageRequest.of(0, limit);

        given(taskRepository.findLatestActiveTasks(eq(expectedPageable))).willReturn(mockTasks);
        given(taskMapper.mapToTaskResponse(eq(task1))).willReturn(response1);
        given(taskMapper.mapToTaskResponse(eq(task2))).willReturn(response2);

        List<TaskResponse> actualResponses = taskService.getLatestTasksActivities(limit);

        assertThat(actualResponses).hasSize(2);
        assertThat(actualResponses.get(0).getId()).isEqualTo(1L);
        assertThat(actualResponses.get(1).getId()).isEqualTo(2L);

        verify(taskRepository, times(1)).findLatestActiveTasks(eq(expectedPageable));
        verify(taskMapper, times(2)).mapToTaskResponse(any(Task.class));
    }

    @Test
    void getLatestTasksActivities_whenNoTasksFound_shouldReturnEmptyList() {
        int limit = 5;
        Pageable expectedPageable = PageRequest.of(0, limit);

        given(taskRepository.findLatestActiveTasks(eq(expectedPageable)))
                .willReturn(Collections.emptyList());

        List<TaskResponse> actualResponses = taskService.getLatestTasksActivities(limit);

        assertThat(actualResponses).isNotNull().isEmpty();

        verify(taskRepository, times(1)).findLatestActiveTasks(eq(expectedPageable));
        verify(taskMapper, times(0)).mapToTaskResponse(any(Task.class));
    }

    @Test
    void completeTask_shouldSetTaskCompleted() {
        Long taskId = 1L;
        Task task = createMockTask(taskId);

        given(taskRepository.findById(taskId)).willReturn(Optional.of(task));
        given(taskRepository.save(task)).willReturn(task);

        taskService.completeTask(taskId);

        assertThat(task.isCompleted()).isTrue();

        verify(taskRepository, times(1)).findById(taskId);
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    void completeTask_whenTaskNotFound_shouldThrowException() {
        Long taskId = 1L;

        given(taskRepository.findById(taskId)).willReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.completeTask(taskId));

        verify(taskRepository, times(1)).findById(taskId);
        verify(taskRepository, times(0)).save(any());
    }


}


