package com.example.wimo.cars;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarsController {

    private final CarsService carsService;

    @GetMapping
    public ResponseEntity<List<Cars>> getAllCars() {
        return ResponseEntity.ok(carsService.getAllCars());
    }

    @PostMapping
    public ResponseEntity<Cars> createCar(@RequestBody Cars car) {
        return ResponseEntity.ok(carsService.createCar(car));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cars> updateCar(@PathVariable Long id, @RequestBody Cars carDetails) {
        Cars updatedCar = carsService.updateCar(id, carDetails);
        if (updatedCar != null) {
            return ResponseEntity.ok(updatedCar);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carsService.deleteCar(id);
        return ResponseEntity.ok().build();
    }
}
