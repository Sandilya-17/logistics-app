package com.logistics.repository;

import com.logistics.model.Trip;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TripRepository extends MongoRepository<Trip, String> {
    List<Trip> findByTruckNumber(String truckNumber);
    List<Trip> findByStatus(String status);
    List<Trip> findByConsignee(String consignee);
    long countByStatus(String status);
}
