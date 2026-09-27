package com.vehiclespareparts.controller;
import com.vehiclespareparts.model.User;
import com.vehiclespareparts.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {
    @Autowired private UserRepository repo;
    @Autowired private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable String id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody User user) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Email is required"));
        }
        if (repo.existsByEmail(user.getEmail().trim().toLowerCase())) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "User with email '" + user.getEmail() + "' already exists."));
        }
        user.setEmail(user.getEmail().trim().toLowerCase());
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            user.setPassword(passwordEncoder.encode("password123"));
        }
        if (user.getStatus() == null || user.getStatus().isBlank()) {
            user.setStatus("ACTIVE");
        }
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("STAFF");
        }
        return ResponseEntity.ok(repo.save(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody User updated) {
        return repo.findById(id).map(existing -> {
            if (updated.getName() != null) existing.setName(updated.getName());
            if (updated.getEmail() != null && !updated.getEmail().isBlank()) {
                existing.setEmail(updated.getEmail().trim().toLowerCase());
            }
            if (updated.getRole() != null) existing.setRole(updated.getRole());
            if (updated.getDepartment() != null) existing.setDepartment(updated.getDepartment());
            if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
            if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
                existing.setPassword(passwordEncoder.encode(updated.getPassword()));
            }
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        java.util.Optional<User> userOpt = repo.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
        User u = userOpt.get();
        if ("biyan@autoparts.com".equalsIgnoreCase(u.getEmail())) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Primary Administrator account (biyan@autoparts.com) is protected and cannot be deleted."));
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
