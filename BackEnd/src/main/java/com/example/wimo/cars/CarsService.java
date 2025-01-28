package com.example.wimo.cars;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CarsService {

    private final CarsRepository carsRepository;

    public List<Cars> getAllCars() {
        return carsRepository.findAll();
    }

    public Cars updateCarLocation(String plate, BigDecimal lat, BigDecimal lon, BigDecimal speed) {
        Cars car = carsRepository.findByPlate(plate);
        if (car != null) {
            car.setLat(lat);
            car.setLon(lon);
            car.setSpeed(speed);
            car.setUpdatedAt(Instant.now());
            car.setUpdatedAtRelous(BigDecimal.valueOf(System.currentTimeMillis() / 1000.0));
            return carsRepository.save(car);
        }
        return null;
    }

    public Cars createCar(Cars car) {
        car.setCreatedAt(Instant.now());
        car.setUpdatedAt(Instant.now());
        car.setCreatedAtRelous(BigDecimal.valueOf(System.currentTimeMillis() / 1000.0));
        car.setUpdatedAtRelous(BigDecimal.valueOf(System.currentTimeMillis() / 1000.0));
        return carsRepository.save(car);
    }

    public Cars updateCar(Long id, Cars carDetails) {
        return carsRepository.findById(id)
                .map(existingCar -> {
                    // Update basic info
                    existingCar.setApp(carDetails.getApp());
                    existingCar.setBrand(carDetails.getBrand());
                    existingCar.setModel(carDetails.getModel());
                    existingCar.setYear(carDetails.getYear());

                    // Update boundaries
                    existingCar.setMaxLat(carDetails.getMaxLat());
                    existingCar.setMinLat(carDetails.getMinLat());
                    existingCar.setMaxLon(carDetails.getMaxLon());
                    existingCar.setMinLon(carDetails.getMinLon());
                    existingCar.setMaxSpeed(carDetails.getMaxSpeed());

                    // Update timestamps
                    existingCar.setUpdatedAt(Instant.now());
                    existingCar.setUpdatedAtRelous(BigDecimal.valueOf(System.currentTimeMillis() / 1000.0));

                    return carsRepository.save(existingCar);
                })
                .orElse(null);
    }

    public void deleteCar(Long id) {
        carsRepository.findById(id).ifPresent(car -> {
            car.setDeletedAt(Instant.now());
            carsRepository.save(car);
        });
    }
}