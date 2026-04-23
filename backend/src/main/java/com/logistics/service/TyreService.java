package com.logistics.service;

import com.logistics.model.Purchase;
import com.logistics.model.Tyre;
import com.logistics.model.TyreIssue;
import com.logistics.repository.PurchaseRepository;
import com.logistics.repository.TyreIssueRepository;
import com.logistics.repository.TyreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TyreService {

    @Autowired private TyreRepository tyreRepository;
    @Autowired private TyreIssueRepository issueRepository;
    @Autowired private PurchaseRepository purchaseRepository;

    // ─── TYRE CRUD ──────────────────────────────── CORE UNCHANGED
    public Tyre addTyre(Tyre tyre) {
        tyre.setCurrentStock(tyre.getOpeningStock());
        tyre.setPurchasedStock(0.0);
        tyre.setIssuedStock(0.0);
        return tyreRepository.save(tyre);
    }

    public List<Tyre> getAllTyres() { return tyreRepository.findAll(); }

    public Tyre getTyreById(String id) {
        return tyreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tyre not found: " + id));
    }

    public Tyre updateTyre(String id, Tyre updated) {
        Tyre existing = getTyreById(id);
        existing.setTyreName(updated.getTyreName());
        existing.setTyreCode(updated.getTyreCode());
        existing.setSize(updated.getSize());
        existing.setBrand(updated.getBrand());
        if (updated.getType() != null) existing.setType(updated.getType());
        if (updated.getUnitPrice() > 0) existing.setUnitPrice(updated.getUnitPrice());
        if (updated.getReorderLevel() > 0) existing.setReorderLevel(updated.getReorderLevel());
        if (updated.getVendor() != null) existing.setVendor(updated.getVendor());
        return tyreRepository.save(existing);
    }

    public void deleteTyre(String id) { tyreRepository.deleteById(id); }

    // ─── PURCHASE ──────────────────────────────── CORE UNCHANGED
    public Purchase addTyrePurchase(Purchase purchase) {
        Tyre tyre = getTyreById(purchase.getPartId());
        purchase.setPartName(tyre.getTyreName());
        purchase.setPurchasedAt(LocalDateTime.now());
        purchase.setType("TYRE");
        if (purchase.getPricePerUnit() > 0 && purchase.getQuantity() > 0)
            purchase.setTotalAmount(purchase.getQuantity() * purchase.getPricePerUnit());
        Purchase saved = purchaseRepository.save(purchase);
        tyre.setPurchasedStock(tyre.getPurchasedStock() + purchase.getQuantity());
        tyre.setCurrentStock(tyre.getCurrentStock() + purchase.getQuantity());
        tyreRepository.save(tyre);
        return saved;
    }

    // ─── ISSUE ─────────────────────────────────── CORE UNCHANGED
    public TyreIssue issueTyre(TyreIssue issue) {
        Tyre tyre = getTyreById(issue.getTyreId());
        if (tyre.getCurrentStock() < issue.getQuantity()) {
            throw new RuntimeException(
                "Insufficient tyre stock! Available: " + tyre.getCurrentStock()
                + ", Requested: " + issue.getQuantity()
            );
        }
        issue.setTyreName(tyre.getTyreName());
        issue.setIssuedAt(LocalDateTime.now());
        if (tyre.getUnitPrice() > 0) {
            issue.setUnitPrice(tyre.getUnitPrice());
            issue.setTotalValue(tyre.getUnitPrice() * issue.getQuantity());
        }
        TyreIssue saved = issueRepository.save(issue);
        tyre.setIssuedStock(tyre.getIssuedStock() + issue.getQuantity());
        tyre.setCurrentStock(tyre.getCurrentStock() - issue.getQuantity());
        tyreRepository.save(tyre);
        return saved;
    }

    public List<TyreIssue> getAllIssues() { return issueRepository.findAll(); }
    public List<TyreIssue> getIssuesByTruck(String t) { return issueRepository.findByTruckNumber(t); }
    public List<TyreIssue> getIssuesByTyre(String id) { return issueRepository.findByTyreId(id); }
    public List<TyreIssue> getIssuesByLocation(String loc) { return issueRepository.findByLocation(loc); }
    public List<TyreIssue> getIssuesByDateRange(LocalDateTime start, LocalDateTime end) {
        return issueRepository.findAll().stream()
            .filter(i -> !i.getIssuedAt().isBefore(start) && !i.getIssuedAt().isAfter(end))
            .toList();
    }
    public List<Tyre> getStockReport() { return tyreRepository.findAll(); }
}
