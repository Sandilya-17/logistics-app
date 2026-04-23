package com.logistics.controller;

import com.logistics.model.User;
import com.logistics.repository.UserRepository;
import com.logistics.security.JwtUtil;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordEncoder passwordEncoder;

    // Seed default admin on startup if no users exist
    @PostConstruct
    public void seedAdmin() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("System Administrator");
            admin.setEmail("admin@logistics.com");
            admin.setRole("ADMIN");
            admin.setDepartment("MANAGEMENT");
            admin.setActive(true);
            userRepository.save(admin);
        }
        if (!userRepository.existsByUsername("employee1")) {
            User emp = new User();
            emp.setUsername("employee1");
            emp.setPassword(passwordEncoder.encode("emp123"));
            emp.setFullName("Ravi Kumar");
            emp.setEmail("ravi@logistics.com");
            emp.setPhone("9876543210");
            emp.setRole("EMPLOYEE");
            emp.setDepartment("OPERATIONS");
            emp.setActive(true);
            emp.setPermissions(List.of("FUEL_ENTRY", "VIEW_TRUCKS", "SPARE_PART_ISSUE"));
            userRepository.save(emp);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        return userRepository.findByUsername(username)
            .filter(u -> u.isActive() && passwordEncoder.matches(password, u.getPassword()))
            .map(u -> {
                u.setLastLogin(LocalDateTime.now());
                userRepository.save(u);
                String token = jwtUtil.generateToken(u.getUsername(), u.getRole());
                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", u.getUsername(),
                    "fullName", u.getFullName(),
                    "role", u.getRole(),
                    "department", u.getDepartment() != null ? u.getDepartment() : "",
                    "permissions", u.getPermissions() != null ? u.getPermissions() : List.of()
                ));
            })
            .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return ResponseEntity.status(401).build();
        return userRepository.findByUsername(auth.getName())
                .map(u -> ResponseEntity.ok(Map.of(
                    "username", u.getUsername(),
                    "fullName", u.getFullName(),
                    "role", u.getRole(),
                    "department", u.getDepartment() != null ? u.getDepartment() : "",
                    "permissions", u.getPermissions() != null ? u.getPermissions() : List.of()
                )))
                .orElse(ResponseEntity.status(404).build());
    }

    // ── Change Password (any logged-in user) ──────────────
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return ResponseEntity.status(401).build();

        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        if (newPassword == null || newPassword.length() < 4)
            return ResponseEntity.badRequest().body(Map.of("message", "New password must be at least 4 characters"));

        return userRepository.findByUsername(auth.getName())
            .map(u -> {
                if (!passwordEncoder.matches(currentPassword, u.getPassword()))
                    return ResponseEntity.status(400).body(Map.of("message", "Current password is incorrect"));
                u.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(u);
                return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
            })
            .orElse(ResponseEntity.status(404).build());
    }

    // ── Update Profile (any logged-in user) ──────────────
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> body) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return ResponseEntity.status(401).build();

        return userRepository.findByUsername(auth.getName())
            .map(u -> {
                if (body.containsKey("fullName") && !body.get("fullName").isBlank())
                    u.setFullName(body.get("fullName"));
                if (body.containsKey("email"))
                    u.setEmail(body.get("email"));
                if (body.containsKey("phone"))
                    u.setPhone(body.get("phone"));
                if (body.containsKey("department"))
                    u.setDepartment(body.get("department"));
                userRepository.save(u);
                return ResponseEntity.ok(Map.of(
                    "message", "Profile updated successfully",
                    "fullName", u.getFullName() != null ? u.getFullName() : "",
                    "email", u.getEmail() != null ? u.getEmail() : "",
                    "phone", u.getPhone() != null ? u.getPhone() : "",
                    "department", u.getDepartment() != null ? u.getDepartment() : ""
                ));
            })
            .orElse(ResponseEntity.status(404).build());
    }

    // ── Change Username (any logged-in user) ──────────────
    @PostMapping("/change-username")
    public ResponseEntity<?> changeUsername(@RequestBody Map<String, String> body) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return ResponseEntity.status(401).build();

        String currentPassword = body.get("currentPassword");
        String newUsername = body.get("newUsername");

        if (newUsername == null || newUsername.trim().length() < 3)
            return ResponseEntity.badRequest().body(Map.of("message", "Username must be at least 3 characters"));

        if (userRepository.existsByUsername(newUsername.trim()))
            return ResponseEntity.badRequest().body(Map.of("message", "Username already taken"));

        return userRepository.findByUsername(auth.getName())
            .map(u -> {
                if (!passwordEncoder.matches(currentPassword, u.getPassword()))
                    return ResponseEntity.status(400).body(Map.of("message", "Password is incorrect"));
                u.setUsername(newUsername.trim());
                userRepository.save(u);
                return ResponseEntity.ok(Map.of("message", "Username changed successfully"));
            })
            .orElse(ResponseEntity.status(404).build());
    }
}
