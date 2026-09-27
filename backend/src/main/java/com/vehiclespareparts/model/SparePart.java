package com.vehiclespareparts.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Model representing a Spare Part document in MongoDB.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "spare_parts")
public class SparePart {
    @Id
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
    private String status; // ACTIVE, INACTIVE, OUT_OF_STOCK
    
    private String partImageUrl;
    private String carImageUrl;
    private String partSpecifications;
    private String carSpecifications;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
