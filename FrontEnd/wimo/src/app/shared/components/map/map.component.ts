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

  private carMarkers: any[] = []; // Tableau pour stocker les marqueurs des voitures réelles

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

        // Mettre à jour les positions des voitures réelles toutes les 20 secondes
        setInterval(() => this.updateRealCars(L), 20000); // 20 secondes
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
    // Ajouter des marqueurs pour chaque voiture réelle
    this.cars.forEach(car => {
      const carMarker = L.marker([car.lat, car.lon]).addTo(this.map);
      carMarker.bindPopup(`<b>${car.brand} ${car.model}</b><br>Speed: ${car.speed} km/h<br>Plate: ${car.plate}`);
      this.carMarkers.push(carMarker); // Ajouter le marqueur à la liste
    });
  }

  // Met à jour la position des voitures réelles toutes les 20 secondes
  updateRealCars(L: any): void {
    // Mettre à jour la position des voitures réelles et leurs marqueurs
    this.cars.forEach((car, index) => {
      // Exemple de mise à jour : déplacement aléatoire pour chaque voiture réelle
      car.lat += (Math.random() - 0.5) * 0.001; // Déplacement aléatoire sur la latitude
      car.lon += (Math.random() - 0.5) * 0.001; // Déplacement aléatoire sur la longitude

      // Mise à jour du marqueur pour la voiture réelle
      const updatedMarker = this.carMarkers[index]; // Récupérer le marqueur de la voiture réelle
      updatedMarker.setLatLng([car.lat, car.lon]); // Mettre à jour la position du marqueur
      updatedMarker.getPopup().setContent(`<b>${car.brand} ${car.model}</b><br>Speed: ${car.speed} km/h<br>Plate: ${car.plate}`);
    });
  }

  ngOnDestroy(): void {
    // Libération des ressources lorsque le composant est détruit
    if (this.map) {
      this.map.remove();
    }
  }
}
