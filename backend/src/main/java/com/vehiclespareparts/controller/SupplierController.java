package com.vehiclespareparts.controller;
import com.vehiclespareparts.model.Supplier;
import com.vehiclespareparts.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin("*")
public class SupplierController {
    @Autowired private SupplierRepository repo;

    @GetMapping
    public List<Supplier> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getById(@PathVariable String id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Supplier create(@RequestBody Supplier supplier) { return repo.save(supplier); }

    @PutMapping("/{id}")
    public ResponseEntity<Supplier> update(@PathVariable String id, @RequestBody Supplier updated) {
        return repo.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setContactPerson(updated.getContactPerson());
            existing.setEmail(updated.getEmail());
            existing.setPhone(updated.getPhone());
            existing.setAddress(updated.getAddress());
            existing.setSpecializedBrands(updated.getSpecializedBrands());
            existing.setRating(updated.getRating());
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
