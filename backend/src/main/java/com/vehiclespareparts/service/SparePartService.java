package com.vehiclespareparts.service;

import com.vehiclespareparts.dto.SparePartRequest;
import com.vehiclespareparts.dto.SparePartResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for Spare Parts operations.
 * Defines business logic boundaries.
 */
public interface SparePartService {
    SparePartResponse createSparePart(SparePartRequest request);
    SparePartResponse getSparePartById(String id);
    Page<SparePartResponse> getAllSpareParts(Pageable pageable);
    SparePartResponse updateSparePart(String id, SparePartRequest request);
    void deleteSparePart(String id);
}
