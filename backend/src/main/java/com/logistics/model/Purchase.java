package com.logistics.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "purchases")
public class Purchase {
    @Id private String id;
    private String partId;
    private String partName;
    private double quantity;
    private double pricePerUnit;
    private String supplierName;
    private LocalDateTime purchasedAt;
    private String invoiceNumber;
    private String type;
    private double totalAmount;
    private double gstAmount;
    private String purchasedBy;
    private String paymentStatus;
    private String paymentMode;
    private String poNumber;
    private String warehouseLocation;
    private boolean approved;
    private String approvedBy;

    public String getId() { return id; } public void setId(String v) { id = v; }
    public String getPartId() { return partId; } public void setPartId(String v) { partId = v; }
    public String getPartName() { return partName; } public void setPartName(String v) { partName = v; }
    public double getQuantity() { return quantity; } public void setQuantity(double v) { quantity = v; }
    public double getPricePerUnit() { return pricePerUnit; } public void setPricePerUnit(double v) { pricePerUnit = v; }
    public String getSupplierName() { return supplierName; } public void setSupplierName(String v) { supplierName = v; }
    public LocalDateTime getPurchasedAt() { return purchasedAt; } public void setPurchasedAt(LocalDateTime v) { purchasedAt = v; }
    public String getInvoiceNumber() { return invoiceNumber; } public void setInvoiceNumber(String v) { invoiceNumber = v; }
    public String getType() { return type; } public void setType(String v) { type = v; }
    public double getTotalAmount() { return totalAmount; } public void setTotalAmount(double v) { totalAmount = v; }
    public double getGstAmount() { return gstAmount; } public void setGstAmount(double v) { gstAmount = v; }
    public String getPurchasedBy() { return purchasedBy; } public void setPurchasedBy(String v) { purchasedBy = v; }
    public String getPaymentStatus() { return paymentStatus; } public void setPaymentStatus(String v) { paymentStatus = v; }
    public String getPaymentMode() { return paymentMode; } public void setPaymentMode(String v) { paymentMode = v; }
    public String getPoNumber() { return poNumber; } public void setPoNumber(String v) { poNumber = v; }
    public String getWarehouseLocation() { return warehouseLocation; } public void setWarehouseLocation(String v) { warehouseLocation = v; }
    public boolean isApproved() { return approved; } public void setApproved(boolean v) { approved = v; }
    public String getApprovedBy() { return approvedBy; } public void setApprovedBy(String v) { approvedBy = v; }
}
