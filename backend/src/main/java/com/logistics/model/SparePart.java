package com.logistics.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "spare_parts")
public class SparePart {
    @Id private String id;
    private String partName;
    private String partCode;
    private String unit;
    private double openingStock;
    private double currentStock;
    private double purchasedStock;
    private double issuedStock;
    private String category;
    private double reorderLevel;
    private double unitPrice;
    private String vendor;
    private String location;
    private String hsn;
    private double gstPercent;
    private String createdBy;

    public String getId() { return id; } public void setId(String v) { id = v; }
    public String getPartName() { return partName; } public void setPartName(String v) { partName = v; }
    public String getPartCode() { return partCode; } public void setPartCode(String v) { partCode = v; }
    public String getUnit() { return unit; } public void setUnit(String v) { unit = v; }
    public double getOpeningStock() { return openingStock; } public void setOpeningStock(double v) { openingStock = v; }
    public double getCurrentStock() { return currentStock; } public void setCurrentStock(double v) { currentStock = v; }
    public double getPurchasedStock() { return purchasedStock; } public void setPurchasedStock(double v) { purchasedStock = v; }
    public double getIssuedStock() { return issuedStock; } public void setIssuedStock(double v) { issuedStock = v; }
    public String getCategory() { return category; } public void setCategory(String v) { category = v; }
    public double getReorderLevel() { return reorderLevel; } public void setReorderLevel(double v) { reorderLevel = v; }
    public double getUnitPrice() { return unitPrice; } public void setUnitPrice(double v) { unitPrice = v; }
    public String getVendor() { return vendor; } public void setVendor(String v) { vendor = v; }
    public String getLocation() { return location; } public void setLocation(String v) { location = v; }
    public String getHsn() { return hsn; } public void setHsn(String v) { hsn = v; }
    public double getGstPercent() { return gstPercent; } public void setGstPercent(double v) { gstPercent = v; }
    public String getCreatedBy() { return createdBy; } public void setCreatedBy(String v) { createdBy = v; }
}
