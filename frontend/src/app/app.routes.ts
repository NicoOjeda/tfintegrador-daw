import { Routes } from '@angular/router';
import { CreacionEncuestaComponent } from './components/creacion-encuesta/crearencuesta.component';
import { EnlacesComponent } from './components/enlaces/enlaces.component';
import { PortadaComponent } from './components/portada/portada.component';
import { EnlaceAccesoComponent } from './components/enlace-acceso/enlace-acceso.component';

export const routes: Routes = [
  {
    path: '',
    component: PortadaComponent,
  },
  {
    path: 'crearcion',
    component: CreacionEncuestaComponent,
  },
  {
    path: 'enlaces',
    component: EnlacesComponent,
  },
  {
    path: 'encuestas-app/:id',
    component: EnlaceAccesoComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
