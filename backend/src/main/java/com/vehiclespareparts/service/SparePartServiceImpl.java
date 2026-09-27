package com.vehiclespareparts.service;

import com.vehiclespareparts.dto.SparePartRequest;
import com.vehiclespareparts.dto.SparePartResponse;
import com.vehiclespareparts.exception.DuplicateResourceException;
import com.vehiclespareparts.exception.ResourceNotFoundException;
import com.vehiclespareparts.model.SparePart;
import com.vehiclespareparts.repository.SparePartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Implementation of SparePartService.
 * Handles business rules and mapping between entities and DTOs.
 */
@Service
@RequiredArgsConstructor
public class SparePartServiceImpl implements SparePartService {

    private final SparePartRepository repository;

    @Override
    public SparePartResponse createSparePart(SparePartRequest request) {
        if (repository.existsByPartNumber(request.getPartNumber())) {
            throw new DuplicateResourceException("Spare part with part number " + request.getPartNumber() + " already exists");
        }

        SparePart sparePart = mapToEntity(request);
        // Default to ACTIVE status if not provided
        if (sparePart.getStatus() == null || sparePart.getStatus().isEmpty()) {
            sparePart.setStatus("ACTIVE");
        }

        SparePart saved = repository.save(sparePart);
        return mapToResponse(saved);
    }

    @Override
    public SparePartResponse getSparePartById(String id) {
        SparePart sparePart = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Spare part not found with id " + id));
        return mapToResponse(sparePart);
    }

    @Override
    public Page<SparePartResponse> getAllSpareParts(Pageable pageable) {
        return repository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public SparePartResponse updateSparePart(String id, SparePartRequest request) {
        SparePart existingPart = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Spare part not found with id " + id));

        // If part number is changing, verify it doesn't clash with an existing one
        if (!existingPart.getPartNumber().equals(request.getPartNumber()) && 
            repository.existsByPartNumber(request.getPartNumber())) {
            throw new DuplicateResourceException("Spare part with part number " + request.getPartNumber() + " already exists");
        }

        updateEntityFromRequest(existingPart, request);
        SparePart updated = repository.save(existingPart);
        return mapToResponse(updated);
    }

    @Override
    public void deleteSparePart(String id) {
        SparePart existingPart = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Spare part not found with id " + id));
        
        // Instead of hard deleting, we could mark as INACTIVE, but for this basic requirement we will delete
        repository.delete(existingPart);
    }

    // Mapping methods
    private SparePart mapToEntity(SparePartRequest request) {
        return SparePart.builder()
                .partNumber(request.getPartNumber())
                .name(request.getName())
                .description(request.getDescription())
                .categoryId(request.getCategoryId())
                .brand(request.getBrand())
                .vehicleBrand(request.getVehicleBrand())
                .vehicleModel(request.getVehicleModel())
                .manufactureYear(request.getManufactureYear())
                .quantity(request.getQuantity())
                .minimumStockLevel(request.getMinimumStockLevel())
                .buyingPrice(request.getBuyingPrice())
                .sellingPrice(request.getSellingPrice())
                .supplierId(request.getSupplierId())
                .location(request.getLocation())
                .status(request.getStatus())
                .partImageUrl(request.getPartImageUrl())
                .carImageUrl(request.getCarImageUrl())
                .partSpecifications(request.getPartSpecifications())
                .carSpecifications(request.getCarSpecifications())
                .build();
    }

    private void updateEntityFromRequest(SparePart entity, SparePartRequest request) {
        entity.setPartNumber(request.getPartNumber());
        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setCategoryId(request.getCategoryId());
        entity.setBrand(request.getBrand());
        entity.setVehicleBrand(request.getVehicleBrand());
        entity.setVehicleModel(request.getVehicleModel());
        entity.setManufactureYear(request.getManufactureYear());
        entity.setQuantity(request.getQuantity());
        entity.setMinimumStockLevel(request.getMinimumStockLevel());
        entity.setBuyingPrice(request.getBuyingPrice());
        entity.setSellingPrice(request.getSellingPrice());
        entity.setSupplierId(request.getSupplierId());
        entity.setLocation(request.getLocation());
        entity.setStatus(request.getStatus());
        entity.setPartImageUrl(request.getPartImageUrl());
        entity.setCarImageUrl(request.getCarImageUrl());
        entity.setPartSpecifications(request.getPartSpecifications());
        entity.setCarSpecifications(request.getCarSpecifications());
    }

    private SparePartResponse mapToResponse(SparePart entity) {
        return SparePartResponse.builder()
                .id(entity.getId())
                .partNumber(entity.getPartNumber())
                .name(entity.getName())
                .description(entity.getDescription())
                .categoryId(entity.getCategoryId())
                .brand(entity.getBrand())
                .vehicleBrand(entity.getVehicleBrand())
                .vehicleModel(entity.getVehicleModel())
                .manufactureYear(entity.getManufactureYear())
                .quantity(entity.getQuantity())
                .minimumStockLevel(entity.getMinimumStockLevel())
                .buyingPrice(entity.getBuyingPrice())
                .sellingPrice(entity.getSellingPrice())
                .supplierId(entity.getSupplierId())
                .location(entity.getLocation())
                .status(entity.getStatus())
                .partImageUrl(entity.getPartImageUrl())
                .carImageUrl(entity.getCarImageUrl())
                .partSpecifications(entity.getPartSpecifications())
                .carSpecifications(entity.getCarSpecifications())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
