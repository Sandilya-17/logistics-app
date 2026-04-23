package com.logistics.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "trucks")
public class Truck {

    @Id
    private String id;

    @Indexed(unique = true)
    private String truckNumber;

    private String driverName;
    private double fuelLimit;
    private String status;
    private String driverPhone;
    private String vehicleType;
    private String make;
    private String model;
    private int year;
    private String registrationExpiry;
    private String insuranceExpiry;
    private String fitnessExpiry;
    private String permitExpiry;
    private double odometer;
    private String location;
    private String assignedRoute;
    private LocalDateTime createdAt;
    private String createdBy;
    private String remarks;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTruckNumber() { return truckNumber; }
    public void setTruckNumber(String truckNumber) { this.truckNumber = truckNumber; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public double getFuelLimit() { return fuelLimit; }
    public void setFuelLimit(double fuelLimit) { this.fuelLimit = fuelLimit; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDriverPhone() { return driverPhone; }
    public void setDriverPhone(String driverPhone) { this.driverPhone = driverPhone; }
    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
    public String getRegistrationExpiry() { return registrationExpiry; }
    public void setRegistrationExpiry(String registrationExpiry) { this.registrationExpiry = registrationExpiry; }
    public String getInsuranceExpiry() { return insuranceExpiry; }
    public void setInsuranceExpiry(String insuranceExpiry) { this.insuranceExpiry = insuranceExpiry; }
    public String getFitnessExpiry() { return fitnessExpiry; }
    public void setFitnessExpiry(String fitnessExpiry) { this.fitnessExpiry = fitnessExpiry; }
    public String getPermitExpiry() { return permitExpiry; }
    public void setPermitExpiry(String permitExpiry) { this.permitExpiry = permitExpiry; }
    public double getOdometer() { return odometer; }
    public void setOdometer(double odometer) { this.odometer = odometer; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getAssignedRoute() { return assignedRoute; }
    public void setAssignedRoute(String assignedRoute) { this.assignedRoute = assignedRoute; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
