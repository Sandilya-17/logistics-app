package com.logistics.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tyres")
public class Tyre {
    @Id private String id;
    private String tyreName;
    private String tyreCode;
    private String size;
    private String brand;
    private double openingStock;
    private double currentStock;
    private double purchasedStock;
    private double issuedStock;
    private String type;
    private double unitPrice;
    private double reorderLevel;
    private String vendor;
    private String createdBy;

    public String getId() { return id; } public void setId(String v) { id = v; }
    public String getTyreName() { return tyreName; } public void setTyreName(String v) { tyreName = v; }
    public String getTyreCode() { return tyreCode; } public void setTyreCode(String v) { tyreCode = v; }
    public String getSize() { return size; } public void setSize(String v) { size = v; }
    public String getBrand() { return brand; } public void setBrand(String v) { brand = v; }
    public double getOpeningStock() { return openingStock; } public void setOpeningStock(double v) { openingStock = v; }
    public double getCurrentStock() { return currentStock; } public void setCurrentStock(double v) { currentStock = v; }
    public double getPurchasedStock() { return purchasedStock; } public void setPurchasedStock(double v) { purchasedStock = v; }
    public double getIssuedStock() { return issuedStock; } public void setIssuedStock(double v) { issuedStock = v; }
    public String getType() { return type; } public void setType(String v) { type = v; }
    public double getUnitPrice() { return unitPrice; } public void setUnitPrice(double v) { unitPrice = v; }
    public double getReorderLevel() { return reorderLevel; } public void setReorderLevel(double v) { reorderLevel = v; }
    public String getVendor() { return vendor; } public void setVendor(String v) { vendor = v; }
    public String getCreatedBy() { return createdBy; } public void setCreatedBy(String v) { createdBy = v; }
}
