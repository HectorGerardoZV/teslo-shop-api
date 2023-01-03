import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/paginatin.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from 'src/file/helpers/file.helper';
import { diskStorage } from 'multer';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/enums/roles.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @Auth(ValidRoles.NORMAL)
  @UseInterceptors(FilesInterceptor('images', 20, {
    fileFilter,
    storage: diskStorage({
      destination: "./static/products",
      filename: fileNamer
    })
  }))
  public async create(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
  ) {
    return this.productService.create(images, createProductDto, user);
  }

  @Get()
  @Auth(ValidRoles.NORMAL)
  public async findAll(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return await this.productService.findAll(paginationDto, user);
  }

  @Get(':term')
  @Auth(ValidRoles.NORMAL)
  public async findOne(
    @Param('term') term: string,
    @GetUser() user: User
  ) {
    return this.productService.findOne(term, user);
  }

  @Patch(':id')
  @Auth(ValidRoles.NORMAL)
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
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User
  ) {
    return this.productService.update(id, images, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN, ValidRoles.SUPER_ADMIN)
  public async remove(
    @Param('id') id: string,
    @GetUser() user: User
  ) {
    return this.productService.remove(id, user);
  }
}
