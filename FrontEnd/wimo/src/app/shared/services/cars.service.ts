import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Car {
  id: number;
  app: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  lat: number;
  lon: number;
  maxLat: number;
  minLat: number;
  maxLon: number;
  minLon: number;
  maxSpeed: number;
  speed: number;
  acceleration: number;
  mileage: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  createdAtRelous: number;
  updatedAtRelous: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarsService {

private apiUrl = 'http://localhost:5432/api/cars'

  constructor(private http: HttpClient) {}
  getAllCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl);
  }
  createCar(car: Car): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, car);
  }
  updateCar(id: number, car: Car): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, car);
  }
  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
