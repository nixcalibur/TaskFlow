package com.nix.inventory.repository;

import com.nix.inventory.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

    long countByStatus(Task.TaskStatus status);

    long countByPriority(Task.TaskPriority priority);

}