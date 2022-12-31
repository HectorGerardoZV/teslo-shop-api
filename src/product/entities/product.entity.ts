import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ProductImage } from './product-images.entity';
@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'text',
        unique: true,
        nullable: false
    })
    title: string;
    @Column({
        type: 'float',
        nullable: false
    })
    price: number;
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;
    @Column({
        type: 'text',
        nullable: false,
        unique: true
    })
    slug: string;
    @Column({
        type: 'integer',
        nullable: true,
        default: 0
    })
    stock: number;
    @Column({
        type: 'text',
        array: true,
        default: []
    })
    sizes: string[];
    @Column({
        type: 'text',
        nullable: true
    })
    gender: string;
    @Column({
        type: 'text',
        array: true,
        default: []
    })
    tags: string[];
    @OneToMany(() =>
        ProductImage,
        productImage => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title;
        }
        this.slug = this.slug
            .trim()
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
            .replaceAll(".", '_')
            .replaceAll(",", '_')
            .replaceAll("*", '_')
            .replaceAll("$", '_')
            .replaceAll("^", '_')
    }
}
