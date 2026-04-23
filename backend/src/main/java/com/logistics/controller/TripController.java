package com.logistics.controller;

import com.logistics.model.Trip;
import com.logistics.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    @Autowired private TripRepository tripRepository;

    @PostMapping
    public ResponseEntity<?> addTrip(@RequestBody Trip trip) {
        try {
            if (trip.getTripNumber() == null || trip.getTripNumber().isBlank()) {
                String seq = String.format("%04d", tripRepository.count() + 1);
                trip.setTripNumber("TRIP-" + LocalDateTime.now().getYear() + "-" + seq);
            }
            trip.setCreatedAt(LocalDateTime.now());
            String user = SecurityContextHolder.getContext().getAuthentication().getName();
            trip.setCreatedBy(user);
            if (trip.getStatus() == null) trip.setStatus("PLANNED");
            if (trip.getAdvancePaid() > 0)
                trip.setBalanceAmount(trip.getFreightAmount() - trip.getAdvancePaid());
            return ResponseEntity.ok(tripRepository.save(trip));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<Trip> getAllTrips() { return tripRepository.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTrip(@PathVariable String id) {
        return tripRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrip(@PathVariable String id, @RequestBody Trip updated) {
        return tripRepository.findById(id).map(t -> {
            if (updated.getTruckNumber() != null) t.setTruckNumber(updated.getTruckNumber());
            if (updated.getDriverName() != null) t.setDriverName(updated.getDriverName());
            if (updated.getFromLocation() != null) t.setFromLocation(updated.getFromLocation());
            if (updated.getToLocation() != null) t.setToLocation(updated.getToLocation());
            if (updated.getConsignee() != null) t.setConsignee(updated.getConsignee());
            if (updated.getCommodity() != null) t.setCommodity(updated.getCommodity());
            if (updated.getFreightAmount() > 0) t.setFreightAmount(updated.getFreightAmount());
            if (updated.getAdvancePaid() >= 0) {
                t.setAdvancePaid(updated.getAdvancePaid());
                t.setBalanceAmount(t.getFreightAmount() - updated.getAdvancePaid());
            }
            if (updated.getStatus() != null) t.setStatus(updated.getStatus());
            if (updated.getLrNumber() != null) t.setLrNumber(updated.getLrNumber());
            if (updated.getPaymentStatus() != null) t.setPaymentStatus(updated.getPaymentStatus());
            if (updated.getEndDate() != null) t.setEndDate(updated.getEndDate());
            if (updated.getEndOdometer() > 0) {
                t.setEndOdometer(updated.getEndOdometer());
                t.setDistanceCovered(updated.getEndOdometer() - t.getStartOdometer());
            }
            if (updated.getRemarks() != null) t.setRemarks(updated.getRemarks());
            return ResponseEntity.ok(tripRepository.save(t));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable String id) {
        tripRepository.deleteById(id);
        return ResponseEntity.ok("Trip deleted");
    }

    @GetMapping("/truck/{truckNumber}")
    public List<Trip> getTripsByTruck(@PathVariable String truckNumber) {
        return tripRepository.findByTruckNumber(truckNumber);
    }

    @GetMapping("/status/{status}")
    public List<Trip> getTripsByStatus(@PathVariable String status) {
        return tripRepository.findByStatus(status);
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary() {
        long total = tripRepository.count();
        long inTransit = tripRepository.countByStatus("IN_TRANSIT");
        long delivered = tripRepository.countByStatus("DELIVERED");
        long planned = tripRepository.countByStatus("PLANNED");
        double totalFreight = tripRepository.findAll().stream()
                .mapToDouble(Trip::getFreightAmount).sum();
        double totalPending = tripRepository.findAll().stream()
                .mapToDouble(Trip::getBalanceAmount).sum();
        return ResponseEntity.ok(Map.of(
            "total", total, "inTransit", inTransit,
            "delivered", delivered, "planned", planned,
            "totalFreight", totalFreight, "totalPending", totalPending
        ));
    }
}
