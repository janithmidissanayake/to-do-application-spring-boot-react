package com.janithmi.todo_application_backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@Entity

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "task")
public class Task {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        @Column(nullable = false)
        private String title;
        @Column(columnDefinition = "TEXT")
        private String description;
        @Column(name = "is_completed", nullable = false)
        private boolean isCompleted = false;
        @CreationTimestamp
        @Column(name = "created_at", nullable = false)
        private ZonedDateTime createdAt;

    }

