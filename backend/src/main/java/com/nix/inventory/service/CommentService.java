package com.nix.inventory.service;

import com.nix.inventory.dto.CommentRequest;
import com.nix.inventory.model.Comment;
import com.nix.inventory.model.Task;
import com.nix.inventory.model.User;
import com.nix.inventory.repository.CommentRepository;
import com.nix.inventory.repository.TaskRepository;
import com.nix.inventory.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public CommentService(
            CommentRepository commentRepository,
            TaskRepository taskRepository,
            UserRepository userRepository
    ) {
        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public Comment addComment(Long taskId, CommentRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setMessage(request.getMessage());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setTask(task);
        comment.setUser(user);

        return commentRepository.save(comment);
    }

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public List<Comment> getCommentsByTaskId(Long taskId) {
        return commentRepository.findByTaskId(taskId);
    }
}