import { Product } from "src/product/entities/product.entity";
import {
    BeforeInsert,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { genSaltSync, hashSync, compare } from 'bcrypt';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true,
        nullable: false
    })
    email: string;

    @Column({
        type: 'text',
        nullable: false
    })
    fullName: string;

    @Column({
        type: 'text',
        unique: false,
        nullable: false
    })
    password: string;

    @Column({
        type: 'boolean',
        nullable: false,
        default: true
    })
    isActive: boolean;

    @OneToMany(() =>
        Product,
        product => product.user
    )
    products: Product[];

    @Column({
        type: 'text',
        array: true,
        default: ["normal"]
    })
    roles: string[]

    @BeforeInsert()
    encryptPassword() {
        const salt = genSaltSync(10);
        this.password = hashSync(this.password, salt);
    }
    @BeforeInsert()
    toLowerCaseProperties() {
        this.email = this.email.toLowerCase().trim();
        this.fullName = this.fullName.toLowerCase().trim();
    }

    async comparePassport(password: string) {
        return await compare(password, this.password);
    }
}
