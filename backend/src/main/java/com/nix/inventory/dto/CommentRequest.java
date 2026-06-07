package com.nix.inventory.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequest {
    private String message;
    private Long userId;
}