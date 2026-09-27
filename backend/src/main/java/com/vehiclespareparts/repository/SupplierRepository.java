package com.vehiclespareparts.repository;
import com.vehiclespareparts.model.Supplier;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface SupplierRepository extends MongoRepository<Supplier, String> {}
