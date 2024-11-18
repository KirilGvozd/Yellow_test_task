import {BadRequestException, Injectable, Param} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService
) {}

  async create(createUserDto: CreateUserDto) {
    const email = createUserDto.email;
    const user = await this.userRepository.findOne({
      where: {email},
    });

    if (user) {
      throw new BadRequestException('User with this email already exists!');
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 12);
    return await this.userRepository.save(createUserDto);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: {email},
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new BadRequestException('Invalid credentials!');
    }

    return await this.jwtService.signAsync(
        { id: user.id },
        { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_TOKEN_EXPIRE }
    );
  }
}
