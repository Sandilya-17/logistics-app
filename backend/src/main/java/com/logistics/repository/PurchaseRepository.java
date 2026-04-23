package com.logistics.repository;

import com.logistics.model.Purchase;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PurchaseRepository extends MongoRepository<Purchase, String> {
    List<Purchase> findByType(String type);
    List<Purchase> findByPartId(String partId);
}
