package com.logistics.repository;

import com.logistics.model.SparePart;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SparePartRepository extends MongoRepository<SparePart, String> {
}
