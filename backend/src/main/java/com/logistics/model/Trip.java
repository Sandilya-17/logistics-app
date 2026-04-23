package com.logistics.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "trips")
public class Trip {
    @Id private String id;
    private String tripNumber;
    private String truckNumber;
    private String driverName;
    private String fromLocation;
    private String toLocation;
    private String consignee;
    private String commodity;
    private double freightAmount;
    private double advancePaid;
    private double balanceAmount;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private double startOdometer;
    private double endOdometer;
    private double distanceCovered;
    private String lrNumber;
    private String invoiceNumber;
    private String paymentStatus;
    private String createdBy;
    private LocalDateTime createdAt;
    private String remarks;

    public String getId() { return id; } public void setId(String v) { id = v; }
    public String getTripNumber() { return tripNumber; } public void setTripNumber(String v) { tripNumber = v; }
    public String getTruckNumber() { return truckNumber; } public void setTruckNumber(String v) { truckNumber = v; }
    public String getDriverName() { return driverName; } public void setDriverName(String v) { driverName = v; }
    public String getFromLocation() { return fromLocation; } public void setFromLocation(String v) { fromLocation = v; }
    public String getToLocation() { return toLocation; } public void setToLocation(String v) { toLocation = v; }
    public String getConsignee() { return consignee; } public void setConsignee(String v) { consignee = v; }
    public String getCommodity() { return commodity; } public void setCommodity(String v) { commodity = v; }
    public double getFreightAmount() { return freightAmount; } public void setFreightAmount(double v) { freightAmount = v; }
    public double getAdvancePaid() { return advancePaid; } public void setAdvancePaid(double v) { advancePaid = v; }
    public double getBalanceAmount() { return balanceAmount; } public void setBalanceAmount(double v) { balanceAmount = v; }
    public String getStatus() { return status; } public void setStatus(String v) { status = v; }
    public LocalDateTime getStartDate() { return startDate; } public void setStartDate(LocalDateTime v) { startDate = v; }
    public LocalDateTime getEndDate() { return endDate; } public void setEndDate(LocalDateTime v) { endDate = v; }
    public double getStartOdometer() { return startOdometer; } public void setStartOdometer(double v) { startOdometer = v; }
    public double getEndOdometer() { return endOdometer; } public void setEndOdometer(double v) { endOdometer = v; }
    public double getDistanceCovered() { return distanceCovered; } public void setDistanceCovered(double v) { distanceCovered = v; }
    public String getLrNumber() { return lrNumber; } public void setLrNumber(String v) { lrNumber = v; }
    public String getInvoiceNumber() { return invoiceNumber; } public void setInvoiceNumber(String v) { invoiceNumber = v; }
    public String getPaymentStatus() { return paymentStatus; } public void setPaymentStatus(String v) { paymentStatus = v; }
    public String getCreatedBy() { return createdBy; } public void setCreatedBy(String v) { createdBy = v; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime v) { createdAt = v; }
    public String getRemarks() { return remarks; } public void setRemarks(String v) { remarks = v; }
}
