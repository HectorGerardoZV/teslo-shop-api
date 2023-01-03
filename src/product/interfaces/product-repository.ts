import { User } from "src/auth/entities/user.entity";
import { PaginationDto } from "src/common/dto/paginatin.dto";
import { CreateProductDto } from "../dto/create-product.dto";
import { UpdateProductDto } from "../dto/update-product.dto";
import { Product } from "../entities/product.entity";

export interface IProductRepository {
    createProduct(images: Express.Multer.File[], createProductDto: CreateProductDto, user: User): Promise<Product>;
    findAllProducts(paginationDto: PaginationDto, user: User): Promise<Product[]>;
    findOneProduct(term: string, user: User): Promise<Product>;
    updateProduct(id: string, images: Express.Multer.File[], updateProductDto: UpdateProductDto, user: User): Promise<Product>;
    deleteProduct(id: string, user: User): Promise<string>;
}