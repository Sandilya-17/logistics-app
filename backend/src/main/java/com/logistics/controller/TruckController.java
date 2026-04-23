package com.logistics.controller;

import com.logistics.model.Truck;
import com.logistics.service.TruckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trucks")
public class TruckController {

    @Autowired
    private TruckService truckService;

    @PostMapping
    public ResponseEntity<?> addTruck(@RequestBody Truck truck) {
        try { return ResponseEntity.ok(truckService.addTruck(truck)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @GetMapping
    public List<Truck> getAllTrucks() { return truckService.getAllTrucks(); }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTruck(@PathVariable String id) {
        try { return ResponseEntity.ok(truckService.getAllTrucks().stream()
                .filter(t -> t.getId().equals(id)).findFirst().orElseThrow()); }
        catch (Exception e) { return ResponseEntity.notFound().build(); }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTruck(@PathVariable String id, @RequestBody Truck truck) {
        try { return ResponseEntity.ok(truckService.updateTruck(id, truck)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTruck(@PathVariable String id) {
        truckService.deleteTruck(id);
        return ResponseEntity.ok("Truck deleted successfully");
    }

    @GetMapping("/numbers")
    public List<String> getTruckNumbers() { return truckService.getTruckNumbers(); }
}
