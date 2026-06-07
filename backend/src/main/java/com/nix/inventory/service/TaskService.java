package com.nix.inventory.service;

import com.nix.inventory.dto.TaskRequest;
import com.nix.inventory.model.Project;
import com.nix.inventory.model.Task;
import com.nix.inventory.model.User;
import com.nix.inventory.repository.ProjectRepository;
import com.nix.inventory.repository.TaskRepository;
import com.nix.inventory.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskService(
            TaskRepository taskRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository
    ) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task createTask(TaskRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User assignedUser = userRepository.findById(request.getAssignedUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(Task.TaskStatus.valueOf(request.getStatus()));
        task.setPriority(Task.TaskPriority.valueOf(request.getPriority()));
        task.setProject(project);
        task.setAssignedUser(assignedUser);

        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long taskId, String status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(Task.TaskStatus.valueOf(status));

        return taskRepository.save(task);
    }

    public Task updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User assignedUser = userRepository.findById(request.getAssignedUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(
                Task.TaskStatus.valueOf(request.getStatus())
        );
        task.setPriority(
                Task.TaskPriority.valueOf(request.getPriority())
        );        task.setProject(project);
        task.setAssignedUser(assignedUser);

        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}