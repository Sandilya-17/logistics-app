package com.logistics.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "tyre_issues")
public class TyreIssue {
    @Id private String id;
    private String tyreId;
    private String tyreName;
    private String truckNumber;
    private double quantity;
    private LocalDateTime issuedAt;
    private String location;
    private String position;
    private String remarks;
    private String issuedBy;
    private double unitPrice;
    private double totalValue;
    private boolean approved;
    private String approvedBy;

    public String getId() { return id; } public void setId(String v) { id = v; }
    public String getTyreId() { return tyreId; } public void setTyreId(String v) { tyreId = v; }
    public String getTyreName() { return tyreName; } public void setTyreName(String v) { tyreName = v; }
    public String getTruckNumber() { return truckNumber; } public void setTruckNumber(String v) { truckNumber = v; }
    public double getQuantity() { return quantity; } public void setQuantity(double v) { quantity = v; }
    public LocalDateTime getIssuedAt() { return issuedAt; } public void setIssuedAt(LocalDateTime v) { issuedAt = v; }
    public String getLocation() { return location; } public void setLocation(String v) { location = v; }
    public String getPosition() { return position; } public void setPosition(String v) { position = v; }
    public String getRemarks() { return remarks; } public void setRemarks(String v) { remarks = v; }
    public String getIssuedBy() { return issuedBy; } public void setIssuedBy(String v) { issuedBy = v; }
    public double getUnitPrice() { return unitPrice; } public void setUnitPrice(double v) { unitPrice = v; }
    public double getTotalValue() { return totalValue; } public void setTotalValue(double v) { totalValue = v; }
    public boolean isApproved() { return approved; } public void setApproved(boolean v) { approved = v; }
    public String getApprovedBy() { return approvedBy; } public void setApprovedBy(String v) { approvedBy = v; }
}
