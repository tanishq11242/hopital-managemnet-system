package com.healthcare.login.controller;

import com.healthcare.login.model.LoginRequest;
import com.healthcare.login.model.LoginResponse;
import com.healthcare.login.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * Controller handling authentication endpoints and page navigation.
 */
@Controller
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Serve the main login page.
     */
    @GetMapping("/")
    public String loginPage() {
        return "login";
    }

    /**
     * Handle login API requests.
     */
    @PostMapping("/api/login")
    @ResponseBody
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.authenticate(
                request.getUsername(),
                request.getPassword(),
                request.getRole()
        );

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Doctor dashboard page.
     */
    @GetMapping("/dashboard/doctor")
    public String doctorDashboard() {
        return "dashboard-doctor";
    }

    /**
     * Admin dashboard page.
     */
    @GetMapping("/dashboard/admin")
    public String adminDashboard() {
        return "dashboard-admin";
    }

    /**
     * Patient dashboard page.
     */
    @GetMapping("/dashboard/patient")
    public String patientDashboard() {
        return "dashboard-patient";
    }
}
