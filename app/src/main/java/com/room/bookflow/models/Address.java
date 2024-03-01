package com.room.bookflow.models;

import android.content.Context;

import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

@Entity(tableName = "address_table")
public class Address {
    @PrimaryKey(autoGenerate = true)
    @ColumnInfo(name = "address_id")
    private int id;

    private String street;
    private String city;
    private String district;
    private String houseNumber;
    private String state;
    private String postalCode;
    private String lat;
    private String lon;

    public Address(String street, String city, String district, String houseNumber,
                   String state, String postalCode, String lat, String lon) {
        this.street = street;
        this.city = city;
        this.district = district;
        this.houseNumber = houseNumber;
        this.state = state;
        this.postalCode = postalCode;
        this.lat = lat;
        this.lon = lon;
    }

    // Getters and setters...

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getHouseNumber() {
        return houseNumber;
    }

    public void setHouseNumber(String houseNumber) {
        this.houseNumber = houseNumber;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getLat() {
        return lat;
    }

    public void setLat(String lat) {
        this.lat = lat;
    }

    public String getLon() {
        return lon;
    }

    public void setLon(String lon) {
        this.lon = lon;
    }
}
