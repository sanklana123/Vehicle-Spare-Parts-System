package com.vehiclespareparts.repository;

import com.vehiclespareparts.model.SparePart;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for database operations on the SparePart collection.
 */
@Repository
public interface SparePartRepository extends MongoRepository<SparePart, String> {
    boolean existsByPartNumber(String partNumber);
}
