package com.vehiclespareparts.controller;

import com.vehiclespareparts.dto.SparePartRequest;
import com.vehiclespareparts.dto.SparePartResponse;
import com.vehiclespareparts.service.SparePartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing Spare Parts.
 * Exposes endpoints for CRUD operations.
 */
@RestController
@RequestMapping("/api/parts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For development, allow all origins
public class SparePartController {

    private final SparePartService service;

    @PostMapping
    public ResponseEntity<SparePartResponse> createSparePart(@Valid @RequestBody SparePartRequest request) {
        SparePartResponse response = service.createSparePart(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SparePartResponse> getSparePartById(@PathVariable String id) {
        return ResponseEntity.ok(service.getSparePartById(id));
    }

    @GetMapping
    public ResponseEntity<Page<SparePartResponse>> getAllSpareParts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getAllSpareParts(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SparePartResponse> updateSparePart(
            @PathVariable String id, 
            @Valid @RequestBody SparePartRequest request) {
        return ResponseEntity.ok(service.updateSparePart(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSparePart(@PathVariable String id) {
        service.deleteSparePart(id);
        return ResponseEntity.noContent().build();
    }
}
