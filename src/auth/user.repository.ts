import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SinginDto } from "./dto/sigin.dto";
import { User } from "./entities/user.entity";
import { IUserRepository } from "./interfaces/user-repository.interface";

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }
    public async createUser(signinDto: SinginDto): Promise<User> {
        const user = this.userRepository.create(signinDto);
        await this.userRepository.save(user);
        return user;
    }
    public async findUserById(id: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new NotFoundException('Error, this user doesn\'t exist');
        return user;
    }
    public async findUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) throw new NotFoundException('Error, this user doesn\'t exist');
        return user;
    }

}