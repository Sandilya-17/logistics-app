package com.logistics.service;

import com.logistics.model.Truck;
import com.logistics.repository.TruckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TruckService {

    @Autowired
    private TruckRepository truckRepository;

    public List<Truck> getAllTrucks() { return truckRepository.findAll(); }

    public Truck getTruckById(String id) {
        return truckRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Truck not found: " + id));
    }

    public List<String> getTruckNumbers() {
        return truckRepository.findAll().stream()
                .filter(t -> "ACTIVE".equals(t.getStatus()))
                .map(Truck::getTruckNumber).collect(Collectors.toList());
    }

    public List<String> getAllTruckNumbers() {
        return truckRepository.findAll().stream()
                .map(Truck::getTruckNumber).collect(Collectors.toList());
    }

    public Truck addTruck(Truck truck) {
        if (truck.getStatus() == null) truck.setStatus("ACTIVE");
        truck.setCreatedAt(LocalDateTime.now());
        return truckRepository.save(truck);
    }

    public Truck updateTruck(String id, Truck u) {
        return truckRepository.findById(id).map(t -> {
            t.setTruckNumber(u.getTruckNumber()); t.setDriverName(u.getDriverName());
            t.setFuelLimit(u.getFuelLimit()); t.setStatus(u.getStatus());
            if (u.getDriverPhone() != null) t.setDriverPhone(u.getDriverPhone());
            if (u.getVehicleType() != null) t.setVehicleType(u.getVehicleType());
            if (u.getMake() != null) t.setMake(u.getMake());
            if (u.getModel() != null) t.setModel(u.getModel());
            if (u.getYear() > 0) t.setYear(u.getYear());
            if (u.getRegistrationExpiry() != null) t.setRegistrationExpiry(u.getRegistrationExpiry());
            if (u.getInsuranceExpiry() != null) t.setInsuranceExpiry(u.getInsuranceExpiry());
            if (u.getFitnessExpiry() != null) t.setFitnessExpiry(u.getFitnessExpiry());
            if (u.getPermitExpiry() != null) t.setPermitExpiry(u.getPermitExpiry());
            if (u.getLocation() != null) t.setLocation(u.getLocation());
            if (u.getAssignedRoute() != null) t.setAssignedRoute(u.getAssignedRoute());
            if (u.getOdometer() > 0) t.setOdometer(u.getOdometer());
            if (u.getRemarks() != null) t.setRemarks(u.getRemarks());
            return truckRepository.save(t);
        }).orElseThrow(() -> new RuntimeException("Truck not found: " + id));
    }

    public void deleteTruck(String id) { truckRepository.deleteById(id); }
}
