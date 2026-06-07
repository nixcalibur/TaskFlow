package com.nix.inventory.controller;

import com.nix.inventory.dto.DashboardStats;
import com.nix.inventory.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public DashboardStats getStats() {
        return dashboardService.getStats();
    }
}