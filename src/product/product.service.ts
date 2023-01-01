import { Inject, Injectable } from '@nestjs/common';
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
  public async create(images: Express.Multer.File[], createProductDto: CreateProductDto): Promise<Product> {
    return await this.productRepository.createProduct(images, createProductDto);
  }

  public async findAll(paginationDto: PaginationDto): Promise<Product[]> {
    return await this.productRepository.findAllProducts(paginationDto);
  }

  public async findOne(term: string) {
    return await this.productRepository.findOneProduct(term);
  }

  public async update(id: string, images: Express.Multer.File[], updateProductDto: UpdateProductDto) {
    return await this.productRepository.updateProduct(id, images, updateProductDto);
  }

  public async remove(id: string) {
    return await this.productRepository.deleteProduct(id);
  }
}
