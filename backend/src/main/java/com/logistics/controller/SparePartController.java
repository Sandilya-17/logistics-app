package com.logistics.controller;

import com.logistics.model.Purchase;
import com.logistics.model.SparePart;
import com.logistics.model.SparePartIssue;
import com.logistics.service.SparePartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/spare-parts")
public class SparePartController {

    @Autowired private SparePartService sparePartService;

    @PostMapping
    public ResponseEntity<?> addSparePart(@RequestBody SparePart part) {
        try { return ResponseEntity.ok(sparePartService.addSparePart(part)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @GetMapping
    public List<SparePart> getAllSpareParts() { return sparePartService.getAllSpareParts(); }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSparePart(@PathVariable String id) {
        try { return ResponseEntity.ok(sparePartService.getSparePartById(id)); }
        catch (RuntimeException e) { return ResponseEntity.notFound().build(); }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSparePart(@PathVariable String id, @RequestBody SparePart part) {
        try { return ResponseEntity.ok(sparePartService.updateSparePart(id, part)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSparePart(@PathVariable String id) {
        sparePartService.deleteSparePart(id);
        return ResponseEntity.ok("Spare part deleted");
    }

    @PostMapping("/purchases")
    public ResponseEntity<?> addPurchase(@RequestBody Purchase purchase) {
        try { return ResponseEntity.ok(sparePartService.addPurchase(purchase)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @GetMapping("/purchases")
    public List<Purchase> getAllPurchases() { return sparePartService.getAllPurchases(); }

    @GetMapping("/purchases/{partId}")
    public List<Purchase> getPurchasesByPart(@PathVariable String partId) {
        return sparePartService.getPurchasesByPart(partId);
    }

    @PostMapping("/issues")
    public ResponseEntity<?> issuePart(@RequestBody SparePartIssue issue) {
        try { return ResponseEntity.ok(sparePartService.issuePart(issue)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @GetMapping("/issues")
    public List<SparePartIssue> getAllIssues() { return sparePartService.getAllIssues(); }

    @GetMapping("/issues/truck/{truckNumber}")
    public List<SparePartIssue> getIssuesByTruck(@PathVariable String truckNumber) {
        return sparePartService.getIssuesByTruck(truckNumber);
    }

    @GetMapping("/issues/part/{partId}")
    public List<SparePartIssue> getIssuesByPart(@PathVariable String partId) {
        return sparePartService.getIssuesByPart(partId);
    }

    @GetMapping("/issues/location/{location}")
    public List<SparePartIssue> getIssuesByLocation(@PathVariable String location) {
        return sparePartService.getIssuesByLocation(location);
    }

    @GetMapping("/issues/date-range")
    public List<SparePartIssue> getIssuesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return sparePartService.getIssuesByDateRange(start, end);
    }

    @GetMapping("/stock-report")
    public List<SparePart> getStockReport() { return sparePartService.getStockReport(); }
}
