package com.medicaltransport.controller;

import com.medicaltransport.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ApiResponse<Map<String, String>> healthCheck() {
        return ApiResponse.success(
            "Medical Transport Platform API is running",
            Map.of("status", "UP", "service", "medical-transport-backend")
        );
    }
}
