package com.logistics.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "spare_part_issues")
public class SparePartIssue {
    @Id private String id;
    private String partId;
    private String partName;
    private String truckNumber;
    private double quantity;
    private LocalDateTime issuedAt;
    private String location;
    private String remarks;
    private String issuedBy;
    private double unitPrice;
    private double totalValue;
    private String jobCardNumber;
    private String mechanicName;
    private boolean approved;
    private String approvedBy;

    public String getId() { return id; } public void setId(String v) { id = v; }
    public String getPartId() { return partId; } public void setPartId(String v) { partId = v; }
    public String getPartName() { return partName; } public void setPartName(String v) { partName = v; }
    public String getTruckNumber() { return truckNumber; } public void setTruckNumber(String v) { truckNumber = v; }
    public double getQuantity() { return quantity; } public void setQuantity(double v) { quantity = v; }
    public LocalDateTime getIssuedAt() { return issuedAt; } public void setIssuedAt(LocalDateTime v) { issuedAt = v; }
    public String getLocation() { return location; } public void setLocation(String v) { location = v; }
    public String getRemarks() { return remarks; } public void setRemarks(String v) { remarks = v; }
    public String getIssuedBy() { return issuedBy; } public void setIssuedBy(String v) { issuedBy = v; }
    public double getUnitPrice() { return unitPrice; } public void setUnitPrice(double v) { unitPrice = v; }
    public double getTotalValue() { return totalValue; } public void setTotalValue(double v) { totalValue = v; }
    public String getJobCardNumber() { return jobCardNumber; } public void setJobCardNumber(String v) { jobCardNumber = v; }
    public String getMechanicName() { return mechanicName; } public void setMechanicName(String v) { mechanicName = v; }
    public boolean isApproved() { return approved; } public void setApproved(boolean v) { approved = v; }
    public String getApprovedBy() { return approvedBy; } public void setApprovedBy(String v) { approvedBy = v; }
}
