package com.logistics.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "fuel_entries")
public class FuelEntry {

    @Id
    private String id;
    private String truckNumber;
    private double liters;
    private double pricePerLiter;
    private double totalCost;
    private LocalDateTime filledAt;
    private String filledBy;
    private String fuelStation;
    private int month;
    private int year;
    private String enteredBy;
    private double odometerReading;
    private String paymentMode;
    private String invoiceNumber;
    private String remarks;
    private boolean approved;
    private String approvedBy;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTruckNumber() { return truckNumber; }
    public void setTruckNumber(String t) { this.truckNumber = t; }
    public double getLiters() { return liters; }
    public void setLiters(double l) { this.liters = l; }
    public double getPricePerLiter() { return pricePerLiter; }
    public void setPricePerLiter(double p) { this.pricePerLiter = p; }
    public double getTotalCost() { return totalCost; }
    public void setTotalCost(double t) { this.totalCost = t; }
    public LocalDateTime getFilledAt() { return filledAt; }
    public void setFilledAt(LocalDateTime f) { this.filledAt = f; }
    public String getFilledBy() { return filledBy; }
    public void setFilledBy(String f) { this.filledBy = f; }
    public String getFuelStation() { return fuelStation; }
    public void setFuelStation(String f) { this.fuelStation = f; }
    public int getMonth() { return month; }
    public void setMonth(int m) { this.month = m; }
    public int getYear() { return year; }
    public void setYear(int y) { this.year = y; }
    public String getEnteredBy() { return enteredBy; }
    public void setEnteredBy(String e) { this.enteredBy = e; }
    public double getOdometerReading() { return odometerReading; }
    public void setOdometerReading(double o) { this.odometerReading = o; }
    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String p) { this.paymentMode = p; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String i) { this.invoiceNumber = i; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String r) { this.remarks = r; }
    public boolean isApproved() { return approved; }
    public void setApproved(boolean a) { this.approved = a; }
    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String a) { this.approvedBy = a; }
}
