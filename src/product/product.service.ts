import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/paginatin.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { IProductRepository } from './interfaces/product-repository';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: IProductRepository
  ) { }
  public async create(images: Express.Multer.File[], createProductDto: CreateProductDto, user: User): Promise<Product> {
    return await this.productRepository.createProduct(images, createProductDto, user);
  }

  public async findAll(paginationDto: PaginationDto, user: User): Promise<Product[]> {
    return await this.productRepository.findAllProducts(paginationDto, user);
  }

  public async findOne(term: string, user: User) {
    return await this.productRepository.findOneProduct(term, user);
  }

  public async update(id: string, images: Express.Multer.File[], updateProductDto: UpdateProductDto, user: User) {
    return await this.productRepository.updateProduct(id, images, updateProductDto, user);
  }

  public async remove(id: string, user: User) {
    return await this.productRepository.deleteProduct(id, user);
  }
}
