package com.example.wimo.cars;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
@Getter
@Setter
@Entity
@Table(name = "voiture")
public class Cars {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "app", nullable = false)
    private String app;

    @Column(name = "brand", nullable = false)
    private String brand;

    @Column(name = "model", nullable = false)
    private String model;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "plate", nullable = false, unique = true)
    private String plate;

    @Column(name = "lat", precision = 10, scale = 8)
    private BigDecimal lat;

    @Column(name = "lon", precision = 10, scale = 8)
    private BigDecimal lon;

    @Column(name = "max_lat", precision = 10, scale = 8)
    private BigDecimal maxLat;

    @Column(name = "min_lat", precision = 10, scale = 8)
    private BigDecimal minLat;

    @Column(name = "max_lon", precision = 10, scale = 8)
    private BigDecimal maxLon;

    @Column(name = "min_lon", precision = 10, scale = 8)
    private BigDecimal minLon;

    @Column(name = "max_speed", nullable = false)
    private Integer maxSpeed;

    @Column(name = "speed", precision = 10, scale = 8)
    private BigDecimal speed;

    @Column(name = "acceleration", precision = 10, scale = 8)
    private BigDecimal acceleration;

    @Column(name = "mileage", precision = 10, scale = 8)
    private BigDecimal mileage;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @Column(name = "created_at_relous", precision = 13, scale = 3)
    private BigDecimal createdAtRelous;

    @Column(name = "updated_at_relous", precision = 13, scale = 3)
    private BigDecimal updatedAtRelous;

}
