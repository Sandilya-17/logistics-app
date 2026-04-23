package com.logistics.service;

import com.logistics.model.FuelEntry;
import com.logistics.model.Truck;
import com.logistics.repository.FuelEntryRepository;
import com.logistics.repository.TruckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class FuelService {

    @Autowired
    private FuelEntryRepository fuelEntryRepository;

    @Autowired
    private TruckRepository truckRepository;

    // Add a fuel entry for a truck — CORE LOGIC UNCHANGED
    public FuelEntry addFuelEntry(FuelEntry entry) {
        truckRepository.findByTruckNumber(entry.getTruckNumber())
                .orElseThrow(() -> new RuntimeException("Truck not found: " + entry.getTruckNumber()));

        LocalDateTime now = LocalDateTime.now();
        entry.setFilledAt(now);
        entry.setMonth(now.getMonthValue());
        entry.setYear(now.getYear());

        if (entry.getPricePerLiter() > 0) {
            entry.setTotalCost(entry.getLiters() * entry.getPricePerLiter());
        }

        return fuelEntryRepository.save(entry);
    }

    public List<FuelEntry> getAllFuelEntries() {
        return fuelEntryRepository.findAll();
    }

    public List<FuelEntry> getEntriesByTruck(String truckNumber) {
        return fuelEntryRepository.findByTruckNumber(truckNumber);
    }

    public List<FuelEntry> getMonthlyEntriesByTruck(String truckNumber, int month, int year) {
        return fuelEntryRepository.findByTruckNumberAndMonthAndYear(truckNumber, month, year);
    }

    /**
     * MONTHLY EXCESS FUEL REPORT — CORE LOGIC UNCHANGED
     */
    public List<Map<String, Object>> getMonthlyExcessReport(int month, int year) {
        List<Truck> allTrucks = truckRepository.findAll();
        List<Map<String, Object>> report = new ArrayList<>();

        for (Truck truck : allTrucks) {
            List<FuelEntry> entries = fuelEntryRepository.findByTruckNumberAndMonthAndYear(
                    truck.getTruckNumber(), month, year
            );

            double totalLiters = entries.stream()
                    .mapToDouble(FuelEntry::getLiters)
                    .sum();
            double totalCost = entries.stream()
                    .mapToDouble(FuelEntry::getTotalCost)
                    .sum();

            double fuelLimit = truck.getFuelLimit();
            double excess = totalLiters - fuelLimit;

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("truckNumber", truck.getTruckNumber());
            row.put("driverName", truck.getDriverName());
            row.put("fuelLimit", fuelLimit);
            row.put("totalConsumed", totalLiters);
            row.put("totalCost", totalCost);
            row.put("excess", excess > 0 ? excess : 0);
            row.put("isExcess", excess > 0);
            row.put("entryCount", entries.size());

            report.add(row);
        }

        return report;
    }

    public List<FuelEntry> getAllEntriesForMonth(int month, int year) {
        return fuelEntryRepository.findByMonthAndYear(month, year);
    }
}
