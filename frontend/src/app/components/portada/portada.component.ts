import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-portada',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './portada.component.html',
  styleUrls: ['./portada.component.scss']
})
export class PortadaComponent implements AfterViewInit {
  @ViewChild('contenido', { static: true }) contenidoRef!: ElementRef;

  ngAfterViewInit(): void {
    const contenido = this.contenidoRef.nativeElement;

    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      contenido.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    });
  }
}
