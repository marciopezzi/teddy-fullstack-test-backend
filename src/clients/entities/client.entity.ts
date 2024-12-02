import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('clients')
export class Client {
  @ApiProperty({ description: 'The unique identifier of the client' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the client' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'The monthly salary of the client' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salary: number;

  @ApiProperty({ description: 'The value of the client’s company' })
  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'company_value' })
  companyValue: number;

  @ApiProperty({ description: 'The date when the client was created' })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'The date when the client was last updated' })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
