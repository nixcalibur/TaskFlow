package com.nix.inventory.service;

import com.nix.inventory.dto.DashboardStats;
import com.nix.inventory.model.Task;
import com.nix.inventory.repository.TaskRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final TaskRepository taskRepository;

    public DashboardService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public DashboardStats getStats() {
        return new DashboardStats(
                taskRepository.count(),
                taskRepository.countByStatus(Task.TaskStatus.TODO),
                taskRepository.countByStatus(Task.TaskStatus.IN_PROGRESS),
                taskRepository.countByStatus(Task.TaskStatus.DONE),
                taskRepository.countByPriority(Task.TaskPriority.HIGH)
        );
    }
}