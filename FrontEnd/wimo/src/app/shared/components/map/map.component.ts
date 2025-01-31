import { Component, Inject, PLATFORM_ID, AfterViewInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
})
export class MapComponent implements AfterViewInit, OnDestroy {

  private map: any; // Déclare une carte de type `any` pour le moment

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('leaflet').then((L) => {
        console.log("Leaflet loaded");
        this.map = L.map('map').setView([43.6043, 1.4437], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        console.log("Map initialized");
      }).catch((error) => {
        console.error("Error loading Leaflet:", error);
      });
    }
  }


  ngOnDestroy(): void {
    // Libération des ressources lorsque le composant est détruit
    if (this.map) {
      this.map.remove();
    }
  }
}
