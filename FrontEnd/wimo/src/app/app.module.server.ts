import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';  // Importation correcte d'AppModule
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,  // Importez AppModule ici
    ServerModule,  // Importez le module serveur ici
  ],
  bootstrap: [AppComponent],  // Bootstrapping du composant principal
})
export class AppServerModule {}
