import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/paginatin.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-images.entity';
import { Product } from './entities/product.entity';
import { IProductRepository } from './interfaces/product-repository';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductRepository implements IProductRepository {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductImage)
        private readonly productImageRepository: Repository<ProductImage>
    ) { }
    public async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        try {
            let product: Product;
            let productImages: ProductImage[];
            if (createProductDto.tags) {
                createProductDto.tags = Array.from(new Set(createProductDto.tags))
                    .map(tag => tag.toLowerCase().trim());
            }
            if (createProductDto.images) {
                console.log(createProductDto);
                productImages = createProductDto.images.map(image => this.productImageRepository.create({ url: image }));
            }
            product = this.productRepository.create({ ...createProductDto, images: productImages });
            await this.productRepository.save(product);
            return product;
        } catch (error) {
            console.log(error);
        }
    }
    public async findAllProducts(paginationDto: PaginationDto): Promise<Product[]> {
        try {
            const { items, page } = paginationDto;
            const products = await this.productRepository.find({
                take: items,
                skip: page * items
            });
            return products;
        } catch (error) {
            console.log(error);
        }
    }
    public async findOneProduct(term: string): Promise<Product> {
        try {
            let product: Product;
            if (isUUID(term)) {
                product = await this.productRepository.findOne({ where: { id: term } });
            } else {
                const query = this.productRepository.createQueryBuilder('product');
                product = await query.where('LOWER(title)= :title OR slug= :slug', {
                    title: term.trim().toLowerCase(),
                    slug: term.trim().toLowerCase(),
                }).leftJoinAndSelect('product.images', 'images').getOne();
            }
            return product;
        } catch (error) {
            console.log(error);
        }
    }
    public async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        try {
            const product = await this.findOneProduct(id);
            const productToUpdate = await this.productRepository.preload({
                id,
                ...product,
                ...updateProductDto,
                images: []
            });
            delete productToUpdate.images;
            let productImages: ProductImage[];
            if (updateProductDto.images) {
                productImages = product.images = [...product.images, ...updateProductDto.images.map(
                    image => this.productImageRepository.create({ url: image })
                )];
                productToUpdate.images = productImages;
            }
            await this.productRepository.save(productToUpdate);
            return this.findOneProduct(id);
        } catch (error) {
            console.log(error);
        }
    }
    public async deleteProduct(id: string): Promise<string> {
        try {
            const productFound = await this.findOneProduct(id);
            if (!productFound) throw new NotFoundException(`Error: the product with id ${id} doesn't exist`);
            await this.productRepository.remove(productFound);
            return `The product with title '${productFound.title}' was deleted successfully`;
        } catch (error) {
            console.log(error);
        }
    }

}