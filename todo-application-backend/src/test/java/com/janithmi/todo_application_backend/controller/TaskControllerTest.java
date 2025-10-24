package com.janithmi.todo_application_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.janithmi.todo_application_backend.dto.TaskRequest;
import com.janithmi.todo_application_backend.dto.TaskResponse;
import com.janithmi.todo_application_backend.exception.TaskNotFoundException;
import com.janithmi.todo_application_backend.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.ZonedDateTime;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(TaskController.class)
public class TaskControllerTest {
    @Autowired
    private MockMvc mockMvc; // Used to simulate HTTP requests

    @Autowired
    private ObjectMapper objectMapper; // Helper for JSON serialization/deserialization

    @MockitoBean
    private TaskService taskService; // Mocks the service dependency

    private final String BASE_URI = "/api/v1/tasks";

    private TaskRequest createMockRequest() {
        return new TaskRequest("Test Title", "Test Description");
    }

    private TaskResponse createMockResponse() {
        return TaskResponse.builder()
                .id(1L)
                .title("Test Title")
                .isCompleted(false)
                .createdAt(ZonedDateTime.now())
                .build();
    }

    @Test
    void createTaskSuccessfully() throws Exception {
        TaskRequest request = createMockRequest();
        TaskResponse expectedResponse = createMockResponse();

        given(taskService.createTask(any(TaskRequest.class))).willReturn(expectedResponse);

        mockMvc.perform(post(BASE_URI + "/createTask")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated()) // 201
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Test Title")));

        verify(taskService, times(1)).createTask(any(TaskRequest.class));
    }

    // -------------------------------------------------------------------
    // 2. getLatestTasks Tests (GET /api/v1/tasks/recentTasks)
    // -------------------------------------------------------------------

    @Test
    void getLatestTasksWithDefaultLimit() throws Exception {
        // Arrange
        List<TaskResponse> mockList = List.of(createMockResponse());
        final int defaultLimit = 5;

        given(taskService.getLatestTasksActivities(eq(defaultLimit))).willReturn(mockList);

        // Act & Assert (No parameter passed, so defaultLimit is used)
        mockMvc.perform(get(BASE_URI + "/recentTasks"))
                .andExpect(status().isOk()) // 200
                .andExpect(jsonPath("$", hasSize(1)));

        verify(taskService, times(1)).getLatestTasksActivities(eq(defaultLimit));
    }

    @Test
    void getLatestTasks_shouldUseProvidedLimit() throws Exception {
        // Arrange
        final int providedLimit = 3;
        List<TaskResponse> mockList = List.of();

        given(taskService.getLatestTasksActivities(eq(providedLimit))).willReturn(mockList);

        // Act & Assert
        mockMvc.perform(get(BASE_URI + "/recentTasks")
                        .param("limit", String.valueOf(providedLimit)))

                .andExpect(status().isOk());

        verify(taskService, times(1)).getLatestTasksActivities(eq(providedLimit));
    }

    @Test
    void getLatestTasks_shouldUseDefaultLimit_WhenLimitIsInvalid() throws Exception {
        // Arrange
        final int defaultLimit = 5;

        given(taskService.getLatestTasksActivities(eq(defaultLimit))).willReturn(List.of());

        // Act & Assert (Passing invalid limits like 0 or -1)
        mockMvc.perform(get(BASE_URI + "/recentTasks").param("limit", "0"))
                .andExpect(status().isOk());

        mockMvc.perform(get(BASE_URI + "/recentTasks").param("limit", "-10"))
                .andExpect(status().isOk());

        // Verify: The service should have been called twice, both with the default limit of 5
        verify(taskService, times(2)).getLatestTasksActivities(eq(defaultLimit));
    }

    // -------------------------------------------------------------------
    // 3. completeTask Tests (PUT /api/v1/tasks/{id}/complete)
    // -------------------------------------------------------------------

    @Test
    void completeTask_shouldReturnNoContentStatus_OnSuccess() throws Exception {
        // Arrange
        final Long taskId = 10L;

        // Stub: Define service behavior (no exception = success)
        doNothing().when(taskService).completeTask(eq(taskId));

        // Act & Assert
        mockMvc.perform(put(BASE_URI + "/{id}/complete", taskId))
                .andExpect(status().isNoContent()) // 204
                .andExpect(content().string("")); // Must return empty body

        verify(taskService, times(1)).completeTask(eq(taskId));
    }

    @Test
    void completeTask_shouldReturnNotFoundStatus_WhenTaskDoesNotExist() throws Exception {
        // Arrange
        final Long invalidId = 999L;

        // Stub: Define service behavior to throw the exception
        doThrow(new TaskNotFoundException("Task not found with id: " + invalidId))
                .when(taskService).completeTask(eq(invalidId));

        // Act & Assert
        // Assumes a GlobalExceptionHandler is correctly configured to map this exception to 404
        mockMvc.perform(put(BASE_URI + "/{id}/complete", invalidId))
                .andExpect(status().isNotFound()); // 404

        verify(taskService, times(1)).completeTask(eq(invalidId));
    }



}
