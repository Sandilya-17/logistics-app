package com.logistics.repository;

import com.logistics.model.Truck;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface TruckRepository extends MongoRepository<Truck, String> {
    Optional<Truck> findByTruckNumber(String truckNumber);
    List<Truck> findByStatus(String status);
    boolean existsByTruckNumber(String truckNumber);
}
