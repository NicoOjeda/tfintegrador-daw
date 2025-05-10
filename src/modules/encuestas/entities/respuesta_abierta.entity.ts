import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pregunta } from './pregunta.entity';
import { Respuesta } from './respuesta.entity';

@Entity('respuestas_abiertas')
export class RespuestaAbierta {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  texto: string;

  @ManyToOne(() => Pregunta)
  @JoinColumn({ name: 'id_pregunta' })
  pregunta: Pregunta;

  @ManyToOne(() => Respuesta)
  @JoinColumn({ name: 'id_respuesta' })
  respuesta: Respuesta;
}
