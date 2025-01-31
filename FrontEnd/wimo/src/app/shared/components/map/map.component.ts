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
      carMarker.bindPopup(`<b>${car.brand} ${car.model}</b><br>Speed: ${car.speed} km/h`);
    });
  }

  ngOnDestroy(): void {
    // Libération des ressources lorsque le composant est détruit
    if (this.map) {
      this.map.remove();
    }
  }
}

