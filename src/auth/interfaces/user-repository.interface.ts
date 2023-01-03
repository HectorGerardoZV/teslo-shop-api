import { SinginDto } from "../dto/sigin.dto";
import { User } from "../entities/user.entity";

export interface IUserRepository {
    createUser(signinDto: SinginDto): Promise<User>;
    findUserById(id: string): Promise<User>;
    findUserByEmail(email: string): Promise<User>;
}