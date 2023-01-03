import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-images.entity';
import { ProductRepository } from './product.repository';
import { FileModule } from 'src/file/file.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  imports: [
    AuthModule,
    ConfigModule,
    FileModule,
    TypeOrmModule.forFeature([
      Product,
      ProductImage
    ]),
  ]
})
export class ProductModule { }
