package com.vehiclespareparts.repository;
import com.vehiclespareparts.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface CustomerRepository extends MongoRepository<Customer, String> {}
