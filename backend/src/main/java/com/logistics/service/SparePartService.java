package com.logistics.service;

import com.logistics.model.Purchase;
import com.logistics.model.SparePart;
import com.logistics.model.SparePartIssue;
import com.logistics.repository.PurchaseRepository;
import com.logistics.repository.SparePartIssueRepository;
import com.logistics.repository.SparePartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SparePartService {

    @Autowired private SparePartRepository sparePartRepository;
    @Autowired private SparePartIssueRepository issueRepository;
    @Autowired private PurchaseRepository purchaseRepository;

    // ─── SPARE PART CRUD ─────────────────────────── CORE UNCHANGED
    public SparePart addSparePart(SparePart part) {
        part.setCurrentStock(part.getOpeningStock());
        part.setPurchasedStock(0.0);
        part.setIssuedStock(0.0);
        return sparePartRepository.save(part);
    }

    public List<SparePart> getAllSpareParts() { return sparePartRepository.findAll(); }

    public SparePart getSparePartById(String id) {
        return sparePartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spare part not found: " + id));
    }

    public SparePart updateSparePart(String id, SparePart updated) {
        SparePart existing = getSparePartById(id);
        existing.setPartName(updated.getPartName());
        existing.setPartCode(updated.getPartCode());
        existing.setUnit(updated.getUnit());
        if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
        if (updated.getReorderLevel() > 0) existing.setReorderLevel(updated.getReorderLevel());
        if (updated.getUnitPrice() > 0) existing.setUnitPrice(updated.getUnitPrice());
        if (updated.getVendor() != null) existing.setVendor(updated.getVendor());
        if (updated.getLocation() != null) existing.setLocation(updated.getLocation());
        if (updated.getHsn() != null) existing.setHsn(updated.getHsn());
        return sparePartRepository.save(existing);
    }

    public void deleteSparePart(String id) { sparePartRepository.deleteById(id); }

    // ─── PURCHASE (Add Stock) ──────────────────── CORE UNCHANGED
    public Purchase addPurchase(Purchase purchase) {
        SparePart part = getSparePartById(purchase.getPartId());
        purchase.setPartName(part.getPartName());
        purchase.setPurchasedAt(LocalDateTime.now());
        purchase.setType("SPARE_PART");
        if (purchase.getPricePerUnit() > 0 && purchase.getQuantity() > 0) {
            double amt = purchase.getQuantity() * purchase.getPricePerUnit();
            purchase.setTotalAmount(amt);
        }
        Purchase saved = purchaseRepository.save(purchase);
        part.setPurchasedStock(part.getPurchasedStock() + purchase.getQuantity());
        part.setCurrentStock(part.getCurrentStock() + purchase.getQuantity());
        sparePartRepository.save(part);
        return saved;
    }

    public List<Purchase> getAllPurchases() { return purchaseRepository.findAll(); }
    public List<Purchase> getPurchasesByPart(String partId) { return purchaseRepository.findByPartId(partId); }

    // ─── ISSUE (Reduce Stock) ──────────────────── CORE UNCHANGED
    public SparePartIssue issuePart(SparePartIssue issue) {
        SparePart part = getSparePartById(issue.getPartId());
        if (part.getCurrentStock() < issue.getQuantity()) {
            throw new RuntimeException(
                "Insufficient stock! Available: " + part.getCurrentStock()
                + ", Requested: " + issue.getQuantity()
            );
        }
        issue.setPartName(part.getPartName());
        issue.setIssuedAt(LocalDateTime.now());
        if (part.getUnitPrice() > 0) {
            issue.setUnitPrice(part.getUnitPrice());
            issue.setTotalValue(part.getUnitPrice() * issue.getQuantity());
        }
        SparePartIssue saved = issueRepository.save(issue);
        part.setIssuedStock(part.getIssuedStock() + issue.getQuantity());
        part.setCurrentStock(part.getCurrentStock() - issue.getQuantity());
        sparePartRepository.save(part);
        return saved;
    }

    public List<SparePartIssue> getAllIssues() { return issueRepository.findAll(); }
    public List<SparePartIssue> getIssuesByTruck(String truckNumber) { return issueRepository.findByTruckNumber(truckNumber); }
    public List<SparePartIssue> getIssuesByPart(String partId) { return issueRepository.findByPartId(partId); }
    public List<SparePartIssue> getIssuesByLocation(String location) { return issueRepository.findByLocation(location); }
    public List<SparePartIssue> getIssuesByDateRange(LocalDateTime start, LocalDateTime end) {
        return issueRepository.findAll().stream()
            .filter(i -> !i.getIssuedAt().isBefore(start) && !i.getIssuedAt().isAfter(end))
            .toList();
    }
    public List<SparePart> getStockReport() { return sparePartRepository.findAll(); }
}
