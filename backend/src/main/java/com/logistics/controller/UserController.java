package com.logistics.controller;

import com.logistics.model.User;
import com.logistics.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class UserController {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll().stream().peek(u -> u.setPassword(null)).toList();
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> body) {
        String username = (String) body.get("username");
        if (userRepository.existsByUsername(username))
            return ResponseEntity.badRequest().body("Username already exists");

        User u = new User();
        u.setUsername(username);
        u.setPassword(passwordEncoder.encode((String) body.get("password")));
        u.setFullName((String) body.get("fullName"));
        u.setEmail((String) body.get("email"));
        u.setPhone((String) body.get("phone"));
        u.setRole((String) body.getOrDefault("role", "EMPLOYEE"));
        u.setDepartment((String) body.get("department"));
        u.setActive(true);
        @SuppressWarnings("unchecked")
        List<String> perms = (List<String>) body.get("permissions");
        u.setPermissions(perms != null ? perms : List.of());
        return ResponseEntity.ok(userRepository.save(u));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody Map<String, Object> body) {
        return userRepository.findById(id).map(u -> {
            if (body.containsKey("fullName")) u.setFullName((String) body.get("fullName"));
            if (body.containsKey("email")) u.setEmail((String) body.get("email"));
            if (body.containsKey("phone")) u.setPhone((String) body.get("phone"));
            if (body.containsKey("department")) u.setDepartment((String) body.get("department"));
            if (body.containsKey("active")) u.setActive((Boolean) body.get("active"));
            if (body.containsKey("role")) u.setRole((String) body.get("role"));
            if (body.containsKey("password") && !((String)body.get("password")).isBlank())
                u.setPassword(passwordEncoder.encode((String) body.get("password")));
            @SuppressWarnings("unchecked")
            List<String> perms = (List<String>) body.get("permissions");
            if (perms != null) u.setPermissions(perms);
            return ResponseEntity.ok(userRepository.save(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
