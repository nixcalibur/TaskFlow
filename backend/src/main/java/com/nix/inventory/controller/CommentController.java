package com.nix.inventory.controller;

import com.nix.inventory.dto.CommentRequest;
import com.nix.inventory.model.Comment;
import com.nix.inventory.service.CommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/{taskId}/comments")
    public Comment addComment(
            @PathVariable Long taskId,
            @RequestBody CommentRequest request
    ) {
        return commentService.addComment(taskId, request);
    }

    @GetMapping("/{taskId}/comments")
    public List<Comment> getCommentsByTaskId(@PathVariable Long taskId) {
        return commentService.getCommentsByTaskId(taskId);
    }
}