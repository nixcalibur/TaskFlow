package com.nix.inventory.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskRequest {
    private String title;
    private String description;
    private String status;
    private String priority;
    private Long projectId;
    private Long assignedUserId;
}