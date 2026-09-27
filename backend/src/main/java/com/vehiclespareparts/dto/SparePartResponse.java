package com.vehiclespareparts.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for returning a SparePart in API responses.
 */
@Data
@Builder
public class SparePartResponse {
    private String id;
    private String partNumber;
    private String name;
    private String description;
    private String categoryId;
    private String brand;
    private String vehicleBrand;
    private String vehicleModel;
    private Integer manufactureYear;
    private Integer quantity;
    private Integer minimumStockLevel;
    private BigDecimal buyingPrice;
    private BigDecimal sellingPrice;
    private String supplierId;
    private String location;
    private String status;
    private String partImageUrl;
    private String carImageUrl;
    private String partSpecifications;
    private String carSpecifications;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
