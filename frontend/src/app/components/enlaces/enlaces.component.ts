import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { HeaderComponent } from '../header/header.component';
import { QRCodeComponent } from 'angularx-qrcode';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enclace',
  standalone: true,
  imports: [
    ToastModule,
    ButtonModule,
    CardModule,
    HeaderComponent,
    QRCodeComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './enlaces.component.html',
  styleUrl: './enlaces.component.css',
  providers: [MessageService],
})
export class EnlacesComponent {
  private messageService: MessageService = inject(MessageService);
  private router: Router = inject(Router);
  respuestaUrl = signal<string>('');
  resultadosUrl = signal<string>('');
  enlaceRespuesta = "✅ Tu encuesta fue creada con éxito. "
  enlaceGestion = "🔒 Este es tu enlace de gestión. Es privado, no lo compartas con nadie.  "
  correoDestino = signal<string>('');

  constructor() {
    const state = this.router.getCurrentNavigation()?.extras.state;

    if (
      state?.['id'] &&
      state?.['codigoRespuesta'] &&
      state?.['codigoResultados']
    ) {
      const baseUrl = 'http://localhost:4200/encuestas-app';
      this.respuestaUrl.set(
        `${baseUrl}/${state['id']}?codigo=${state['codigoRespuesta']}&tipo=RESPUESTA`,
      );
      this.resultadosUrl.set(
        `${baseUrl}/${state['id']}?codigo=${state['codigoResultados']}&tipo=RESULTADOS`,
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Faltan datos para generar los enlaces',
      });
      this.router.navigate(['/']);
    }
  }

  copiar(texto: string) {
    navigator.clipboard.writeText(texto).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Enlace copiado',
        detail: 'Ya podés compartirlo',
        life: 2500,
      });
    });
  }

  enviarCorreo() {
    if (!this.correoDestino()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Correo requerido',
        detail: 'Ingrese un correo válido.',
        life: 2500,
      });
      return;
    }

    
    this.messageService.add({
      severity: 'success',
      summary: '📩 Correo enviado',
      detail: `El enlace se ha enviado correctamente a ${this.correoDestino()} .`,
      life: 2500,
    });

    console.log(`envío de correo a: ${this.correoDestino()}`);
  }
}
