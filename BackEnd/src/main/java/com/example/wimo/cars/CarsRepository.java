package com.example.wimo.cars;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CarsRepository extends JpaRepository<Cars, Long> {
    Cars findByPlate(String plate);
}
