import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ description: 'The name of the client' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The monthly salary of the client', example: 3500 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  salary: number;

  @ApiProperty({ description: 'The value of the client’s company', example: 120000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  companyValue: number;
}
