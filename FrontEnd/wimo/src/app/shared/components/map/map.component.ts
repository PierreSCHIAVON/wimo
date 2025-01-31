import { Component, Inject, PLATFORM_ID, AfterViewInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CarsService } from "../../services/cars.service";
import { Car } from "../../services/cars.service";  // Assure-toi d'importer l'interface Car

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
})
export class MapComponent implements AfterViewInit, OnDestroy {

  private map: any; // Déclare une carte de type `any` pour le moment
  private cars: Car[] = []; // Tableau pour stocker les voitures récupérées du service

  // Voitures fictives
  private fictiveCars: Car[] = [
    {
      id: 1,
      app: "WimoApp",
      brand: "Tesla",
      model: "Model X",
      year: 2022,
      plate: "ABC1234",
      lat: 43.6050,
      lon: 1.4440,
      maxLat: 43.6100,
      minLat: 43.6000,
      maxLon: 1.4500,
      minLon: 1.4400,
      maxSpeed: 250,
      speed: 120,
      acceleration: 3.2,
      mileage: 15000,
      createdAt: "2022-05-12T12:34:56",
      updatedAt: "2023-01-01T15:22:10",
      createdAtRelous: 1652364896,
      updatedAtRelous: 1672573130
    },
    {
      id: 2,
      app: "WimoApp",
      brand: "Ford",
      model: "Mustang",
      year: 2021,
      plate: "XYZ5678",
      lat: 43.6070,
      lon: 1.4450,
      maxLat: 43.6120,
      minLat: 43.6000,
      maxLon: 1.4500,
      minLon: 1.4400,
      maxSpeed: 200,
      speed: 150,
      acceleration: 4.5,
      mileage: 10000,
      createdAt: "2021-07-18T10:12:30",
      updatedAt: "2023-01-15T14:45:10",
      createdAtRelous: 1626600750,
      updatedAtRelous: 1673796310
    },
    {
      id: 3,
      app: "WimoApp",
      brand: "BMW",
      model: "i8",
      year: 2020,
      plate: "LMN7890",
      lat: 43.6100,
      lon: 1.4460,
      maxLat: 43.6150,
      minLat: 43.6000,
      maxLon: 1.4550,
      minLon: 1.4400,
      maxSpeed: 250,
      speed: 130,
      acceleration: 3.1,
      mileage: 8000,
      createdAt: "2020-08-22T14:50:10",
      updatedAt: "2023-02-10T16:15:30",
      createdAtRelous: 1598109010,
      updatedAtRelous: 1676033730
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private carsService: CarsService) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('leaflet').then((L) => {
        console.log("Leaflet loaded");
        this.map = L.map('map').setView([43.6043, 1.4437], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        console.log("Map initialized");

        // Charger les voitures après l'initialisation de la carte
        this.loadCars(L);
      }).catch((error) => {
        console.error("Error loading Leaflet:", error);
      });
    }
  }
/*
  loadCars(L: any): void {
    // Ajouter les voitures fictives dans le tableau des voitures
    this.cars.push(...this.fictiveCars);

    // Ajouter des marqueurs pour toutes les voitures
    this.addCarMarkers(L);
  }
*/

loadCars(L: any): void {
// Récupérer toutes les voitures depuis le service
this.carsService.getAllCars().subscribe(
(data: Car[]) => {
this.cars = data;
this.addCarMarkers(L); // Ajouter les marqueurs une fois les voitures chargées
},
(error) => {
console.error('Erreur lors du chargement des voitures:', error);
}
);
}


  addCarMarkers(L: any): void {
    // Ajouter des marqueurs pour chaque voiture sur la carte
    this.cars.forEach(car => {
      const carMarker = L.marker([car.lat, car.lon]).addTo(this.map);
      carMarker.bindPopup(`<b>${car.brand} ${car.model}</b><br>Speed: ${car.speed} km/h<br>Plate: ${car.plate}`);
    });
  }

  ngOnDestroy(): void {
    // Libération des ressources lorsque le composant est détruit
    if (this.map) {
      this.map.remove();
    }
  }
}
