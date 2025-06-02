import { Routes } from '@angular/router';
import { ComienzoComponent } from './components/comienzo/comienzo.component';
import { CrearencuestaComponent } from './components/crearencuesta/crearencuesta.component';

import {GestionarComponent} from './components/gestionar/gestionar.component'
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
    path: 'maria',
    component:GestionarComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
