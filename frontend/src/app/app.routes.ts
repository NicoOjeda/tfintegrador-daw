import { Routes } from '@angular/router';
import { ComienzoComponent } from './components/comienzo/comienzo.component';
import { CrearencuestaComponent } from './components/crearencuesta/crearencuesta.component';

export const routes: Routes = [
  {
    path: '',
    component: ComienzoComponent,
  },
  {
    path: 'crear-encuesta',
    component: CrearencuestaComponent
  },
  {
    path: '**',
    redirectTo: '',
  },
];
