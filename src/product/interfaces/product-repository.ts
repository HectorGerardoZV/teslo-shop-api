import { PaginationDto } from "src/common/dto/paginatin.dto";
import { CreateProductDto } from "../dto/create-product.dto";
import { UpdateProductDto } from "../dto/update-product.dto";
import { Product } from "../entities/product.entity";

export interface IProductRepository {
    createProduct(createProductDto: CreateProductDto): Promise<Product>
    findAllProducts(paginationDto: PaginationDto): Promise<Product[]>
    findOneProduct(term: string): Promise<Product>
    updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product>
    deleteProduct(id: string): Promise<string>
}