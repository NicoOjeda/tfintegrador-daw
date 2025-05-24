import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Encuesta } from './encuesta.entity';
import { Exclude } from 'class-transformer';

@Entity('respuestas')
export class Respuesta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Encuesta)
  @JoinColumn({ name: 'id_encuesta' }) // Clave foránea en la tabla "respuestas"
  @Exclude()
  encuesta: Encuesta;
}
