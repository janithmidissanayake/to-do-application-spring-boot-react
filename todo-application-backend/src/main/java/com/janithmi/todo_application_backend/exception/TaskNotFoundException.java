package com.janithmi.todo_application_backend.exception;


public class  TaskNotFoundException extends RuntimeException {
    public TaskNotFoundException(String message) {
        super(message);
    }
}
