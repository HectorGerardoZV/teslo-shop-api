import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-images.entity';
import { ProductRepository } from './product.repository';
import { FileModule } from 'src/file/file.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  imports: [
    ConfigModule,
    FileModule,
    TypeOrmModule.forFeature([
      Product,
      ProductImage
    ]),
  ]
})
export class ProductModule { }
