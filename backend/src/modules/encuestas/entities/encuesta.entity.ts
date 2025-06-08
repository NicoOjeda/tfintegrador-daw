import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pregunta } from './pregunta.entity';

@Entity('encuestas')
export class Encuesta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => Pregunta, (pregunta) => pregunta.encuesta, {
    cascade: ['insert'],
  })
  preguntas: Pregunta[];

  @Column({ name: 'codigo_respuesta' })
  codigoRespuesta: string;

  @Column({ name: 'codigo_resultado' })
  @Exclude()
  codigoResultados: string;

  @Column({ name: 'deshabilitar', default: true  })
  deshabilitar: boolean;
}
