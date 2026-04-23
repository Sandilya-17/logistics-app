package com.logistics.controller;

import com.logistics.model.FuelEntry;
import com.logistics.repository.FuelEntryRepository;
import com.logistics.service.FuelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fuel")
public class FuelController {

    @Autowired private FuelService fuelService;
    @Autowired private FuelEntryRepository fuelEntryRepository;

    @PostMapping
    public ResponseEntity<?> addFuelEntry(@RequestBody FuelEntry entry) {
        try { return ResponseEntity.ok(fuelService.addFuelEntry(entry)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @GetMapping
    public List<FuelEntry> getAllEntries() { return fuelService.getAllFuelEntries(); }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFuelEntry(@PathVariable String id, @RequestBody FuelEntry entry) {
        return fuelEntryRepository.findById(id).map(existing -> {
            entry.setId(id);
            if (entry.getPricePerLiter() > 0)
                entry.setTotalCost(entry.getLiters() * entry.getPricePerLiter());
            return ResponseEntity.ok(fuelEntryRepository.save(entry));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFuelEntry(@PathVariable String id) {
        fuelEntryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/truck/{truckNumber}")
    public List<FuelEntry> getEntriesByTruck(@PathVariable String truckNumber) {
        return fuelService.getEntriesByTruck(truckNumber);
    }

    @GetMapping("/truck/{truckNumber}/monthly")
    public List<FuelEntry> getMonthlyEntriesByTruck(
            @PathVariable String truckNumber,
            @RequestParam int month, @RequestParam int year) {
        return fuelService.getMonthlyEntriesByTruck(truckNumber, month, year);
    }

    @GetMapping("/monthly")
    public List<FuelEntry> getAllEntriesForMonth(@RequestParam int month, @RequestParam int year) {
        return fuelService.getAllEntriesForMonth(month, year);
    }

    @GetMapping("/excess-report")
    public List<Map<String, Object>> getExcessReport(@RequestParam int month, @RequestParam int year) {
        return fuelService.getMonthlyExcessReport(month, year);
    }
}
