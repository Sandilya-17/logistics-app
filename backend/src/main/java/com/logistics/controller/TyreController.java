package com.logistics.controller;

import com.logistics.model.Purchase;
import com.logistics.model.Tyre;
import com.logistics.model.TyreIssue;
import com.logistics.service.TyreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tyres")
public class TyreController {

    @Autowired private TyreService tyreService;

    @PostMapping
    public ResponseEntity<?> addTyre(@RequestBody Tyre tyre) {
        try { return ResponseEntity.ok(tyreService.addTyre(tyre)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @GetMapping
    public List<Tyre> getAllTyres() { return tyreService.getAllTyres(); }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTyre(@PathVariable String id) {
        try { return ResponseEntity.ok(tyreService.getTyreById(id)); }
        catch (RuntimeException e) { return ResponseEntity.notFound().build(); }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTyre(@PathVariable String id, @RequestBody Tyre tyre) {
        try { return ResponseEntity.ok(tyreService.updateTyre(id, tyre)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTyre(@PathVariable String id) {
        tyreService.deleteTyre(id);
        return ResponseEntity.ok("Tyre deleted");
    }

    @PostMapping("/purchases")
    public ResponseEntity<?> addPurchase(@RequestBody Purchase purchase) {
        try { return ResponseEntity.ok(tyreService.addTyrePurchase(purchase)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @PostMapping("/issues")
    public ResponseEntity<?> issueTyre(@RequestBody TyreIssue issue) {
        try { return ResponseEntity.ok(tyreService.issueTyre(issue)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @GetMapping("/issues")
    public List<TyreIssue> getAllIssues() { return tyreService.getAllIssues(); }

    @GetMapping("/issues/truck/{truckNumber}")
    public List<TyreIssue> getIssuesByTruck(@PathVariable String truckNumber) {
        return tyreService.getIssuesByTruck(truckNumber);
    }

    @GetMapping("/issues/tyre/{tyreId}")
    public List<TyreIssue> getIssuesByTyre(@PathVariable String tyreId) {
        return tyreService.getIssuesByTyre(tyreId);
    }

    @GetMapping("/issues/location/{location}")
    public List<TyreIssue> getIssuesByLocation(@PathVariable String location) {
        return tyreService.getIssuesByLocation(location);
    }

    @GetMapping("/issues/date-range")
    public List<TyreIssue> getIssuesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return tyreService.getIssuesByDateRange(start, end);
    }

    @GetMapping("/stock-report")
    public List<Tyre> getStockReport() { return tyreService.getStockReport(); }
}
