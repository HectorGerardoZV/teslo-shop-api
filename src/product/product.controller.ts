import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/paginatin.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from 'src/file/helpers/file.helper';
import { diskStorage } from 'multer';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 20, {
    fileFilter,
    storage: diskStorage({
      destination: "./static/products",
      filename: fileNamer
    })
  }))
  public async create(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productService.create(images, createProductDto);
  }

  @Get()
  public async findAll(@Query() paginationDto: PaginationDto) {
    return await this.productService.findAll(paginationDto);
  }

  @Get(':term')
  public async findOne(@Param('term') term: string) {
    return this.productService.findOne(term);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 20, {
    fileFilter,
    storage: diskStorage({
      destination: "./static/products",
      filename: fileNamer
    })
  }))
  public async update(
    @Param('id') id: string,
    @UploadedFiles() images: Express.Multer.File[],
    @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, images, updateProductDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
