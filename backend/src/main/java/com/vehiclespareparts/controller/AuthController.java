package com.vehiclespareparts.controller;

import com.vehiclespareparts.model.User;
import com.vehiclespareparts.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");
        String department = request.get("department");

        if (name == null || name.isBlank() || email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name, email, and password are required."));
        }

        String cleanEmail = email.trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            return ResponseEntity.badRequest().body(Map.of("message", "An account with email '" + cleanEmail + "' already exists."));
        }

        User newUser = User.builder()
                .name(name.trim())
                .email(cleanEmail)
                .password(passwordEncoder.encode(password))
                .role("STAFF")
                .status("ACTIVE")
                .department(department != null && !department.isBlank() ? department.trim() : "General Staff")
                .build();

        User saved = userRepository.save(newUser);

        Map<String, Object> response = new HashMap<>();
        response.put("token", "token_" + UUID.randomUUID().toString().replace("-", ""));

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", saved.getId());
        userInfo.put("name", saved.getName());
        userInfo.put("email", saved.getEmail());
        userInfo.put("role", saved.getRole());
        userInfo.put("department", saved.getDepartment());
        userInfo.put("status", saved.getStatus());
        userInfo.put("avatarUrl", saved.getAvatarUrl());

        response.put("user", userInfo);
        response.put("message", "Account registered successfully!");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            Map<String, String> err = new HashMap<>();
            err.put("message", "Email and password are required.");
            return ResponseEntity.badRequest().body(err);
        }

        Optional<User> userOpt = userRepository.findByEmail(email.trim().toLowerCase());
        if (userOpt.isEmpty()) {
            // Case-insensitive fallback check
            userOpt = userRepository.findAll().stream()
                    .filter(u -> u.getEmail() != null && u.getEmail().equalsIgnoreCase(email.trim()))
                    .findFirst();
        }

        if (userOpt.isEmpty()) {
            Map<String, String> err = new HashMap<>();
            err.put("message", "No account found with email: " + email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        User user = userOpt.get();

        if ("INACTIVE".equalsIgnoreCase(user.getStatus())) {
            Map<String, String> err = new HashMap<>();
            err.put("message", "Account is deactivated. Please contact an Administrator.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err);
        }

        boolean matches = passwordEncoder.matches(password, user.getPassword()) 
                       || password.equals(user.getPassword());

        if (!matches) {
            Map<String, String> err = new HashMap<>();
            err.put("message", "Invalid password provided. Please try again.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("token", "token_" + UUID.randomUUID().toString().replace("-", ""));

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("name", user.getName());
        userInfo.put("email", user.getEmail());
        userInfo.put("role", user.getRole());
        userInfo.put("department", user.getDepartment());
        userInfo.put("status", user.getStatus());
        userInfo.put("avatarUrl", user.getAvatarUrl());

        response.put("user", userInfo);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(@PathVariable String id) {
        return userRepository.findById(id).map(u -> {
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", u.getId());
            userInfo.put("name", u.getName());
            userInfo.put("email", u.getEmail());
            userInfo.put("role", u.getRole());
            userInfo.put("department", u.getDepartment());
            userInfo.put("status", u.getStatus());
            userInfo.put("avatarUrl", u.getAvatarUrl());
            userInfo.put("createdAt", u.getCreatedAt());
            return ResponseEntity.ok(userInfo);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request) {
        String id = request.get("id");
        String email = request.get("email");
        String name = request.get("name");
        String department = request.get("department");
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        if (id == null || id.isBlank()) {
            Map<String, String> err = new HashMap<>();
            err.put("message", "User ID is required.");
            return ResponseEntity.badRequest().body(err);
        }

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            Map<String, String> err = new HashMap<>();
            err.put("message", "User account not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }

        User user = userOpt.get();

        // Check if updating email and ensure not duplicated
        if (email != null && !email.trim().equalsIgnoreCase(user.getEmail())) {
            String newEmail = email.trim().toLowerCase();
            Optional<User> existing = userRepository.findByEmail(newEmail);
            if (existing.isPresent() && !existing.get().getId().equals(user.getId())) {
                Map<String, String> err = new HashMap<>();
                err.put("message", "The email address '" + newEmail + "' is already registered to another user.");
                return ResponseEntity.badRequest().body(err);
            }
            user.setEmail(newEmail);
        }

        if (name != null && !name.isBlank()) {
            user.setName(name.trim());
        }

        if (department != null) {
            user.setDepartment(department.trim());
        }

        // Handle password change if specified
        if (newPassword != null && !newPassword.isBlank()) {
            if (currentPassword == null || currentPassword.isBlank()) {
                Map<String, String> err = new HashMap<>();
                err.put("message", "Current password is required to change your password.");
                return ResponseEntity.badRequest().body(err);
            }

            boolean matches = passwordEncoder.matches(currentPassword, user.getPassword())
                           || currentPassword.equals(user.getPassword());

            if (!matches) {
                Map<String, String> err = new HashMap<>();
                err.put("message", "Current password does not match.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
            }

            if (newPassword.length() < 6) {
                Map<String, String> err = new HashMap<>();
                err.put("message", "New password must be at least 6 characters long.");
                return ResponseEntity.badRequest().body(err);
            }

            user.setPassword(passwordEncoder.encode(newPassword));
        }

        User saved = userRepository.save(user);

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", saved.getId());
        userInfo.put("name", saved.getName());
        userInfo.put("email", saved.getEmail());
        userInfo.put("role", saved.getRole());
        userInfo.put("department", saved.getDepartment());
        userInfo.put("status", saved.getStatus());
        userInfo.put("avatarUrl", saved.getAvatarUrl());
        userInfo.put("createdAt", saved.getCreatedAt());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profile updated successfully!");
        response.put("user", userInfo);

        return ResponseEntity.ok(response);
    }
}
