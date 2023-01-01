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
import { ConfigService } from '@nestjs/config';
import { unlinkSync } from 'fs';

@Injectable()
export class ProductRepository implements IProductRepository {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductImage)
        private readonly productImageRepository: Repository<ProductImage>,
        private readonly configService: ConfigService
    ) { }
    public async createProduct(images: Express.Multer.File[], createProductDto: CreateProductDto): Promise<Product> {
        try {
            let product: Product;
            let productImages: ProductImage[];
            let tags: string[];
            let sizes: string[];
            if (createProductDto.tags) {
                tags = JSON.parse(createProductDto.tags);
                tags = Array.from(new Set(tags))
                    .map(tag => tag.toLowerCase().trim());
            }
            if (createProductDto.sizes) {
                sizes = JSON.parse(createProductDto.sizes);
                sizes = Array.from(new Set(tags))
                    .map(size => size.trim().toLowerCase())
            }

            if (images) {
                productImages = images
                    .map(image => this.productImageRepository.create({
                        url: `${this.configService.get('HOST_API')}/files/products/${image.filename}`
                    }));
            }
            product = this.productRepository.create({ ...createProductDto, images: productImages, tags, sizes });
            await this.productRepository.save(product);
            return product;
        } catch (error) {
            console.log(error);
        }
        return null;
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
    public async updateProduct(id: string, images: Express.Multer.File[], updateProductDto: UpdateProductDto): Promise<Product> {
        try {
            const product = await this.findOneProduct(id);
            if (!product) throw new NotFoundException(`Error: The product with id '${id}' doesn't exist`);
            let sizes = [];
            let tags = [];
            if (updateProductDto.sizes) {
                const updatedSizes: string[] = JSON.parse(updateProductDto.sizes);
                sizes = [...product.sizes, updatedSizes];
            }
            if (updateProductDto.tags) {
                const updatedTags: string[] = JSON.parse(updateProductDto.tags);
                tags = [...tags, updatedTags];
            }

            const productToUpdate = await this.productRepository.preload({
                id,
                ...updateProductDto,
                sizes,
                tags
            });
            delete productToUpdate.images;
            let productImages: ProductImage[];
            if (images) {
                productImages = product.images = [...product.images, ...images.map(
                    image => this.productImageRepository.create({ url: `${this.configService.get('HOST_API')}/files/products/${image.filename}` })
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
            productFound.images.forEach(image => {
                unlinkSync(`./static/products/${image.url.split("/")[image.url.split("/").length - 1]}`);
            })
            await this.productRepository.remove(productFound);
            return `The product with title '${productFound.title}' was deleted successfully`;
        } catch (error) {
            console.log(error);
        }
    }

}