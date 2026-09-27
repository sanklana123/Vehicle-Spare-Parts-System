package com.vehiclespareparts.model;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "suppliers")
public class Supplier {
    @Id
    private String id;
    private String name;
    private String contactPerson;
    private String email;
    private String phone;
    private String address;
    private String specializedBrands;
    private String status;
    private double rating;
}
