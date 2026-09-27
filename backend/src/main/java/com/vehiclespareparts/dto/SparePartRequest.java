package com.vehiclespareparts.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

/**
 * DTO for creating and updating a SparePart.
 * Contains Jakarta Bean Validation annotations.
 */
@Data
public class SparePartRequest {

    @NotBlank(message = "Part number is required")
    private String partNumber;

    @NotBlank(message = "Part name is required")
    private String name;

    private String description;
    
    private String categoryId;
    
    private String brand;
    
    private String vehicleBrand;
    
    private String vehicleModel;
    
    private Integer manufactureYear;

    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @Min(value = 0, message = "Minimum stock level cannot be negative")
    private Integer minimumStockLevel;

    @PositiveOrZero(message = "Buying price must be zero or positive")
    private BigDecimal buyingPrice;

    @PositiveOrZero(message = "Selling price must be zero or positive")
    private BigDecimal sellingPrice;

    private String supplierId;
    
    private String location;
    
    private String status;

    private String partImageUrl;
    
    private String carImageUrl;
    
    private String partSpecifications;
    
    private String carSpecifications;
}
