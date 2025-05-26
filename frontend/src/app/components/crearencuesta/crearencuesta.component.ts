import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-crearencuesta',
  standalone: true,
  imports: [ButtonModule, InputTextModule, FormsModule],
  templateUrl: './crearencuesta.component.html',
  styleUrl: './crearencuesta.component.css'
})
export class CrearencuestaComponent {

}
