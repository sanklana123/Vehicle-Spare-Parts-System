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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    
    private String orderNumber;
    
    private String customerId;
    private String customerName; // denormalized
    
    private String sparePartId;
    private String sparePartName; // denormalized
    
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalAmount;
    
    private String status; // PENDING, PROCESSING, COMPLETED, CANCELLED
    
    private String shippingAddress;
    
    @CreatedDate
    private LocalDateTime orderDate;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
