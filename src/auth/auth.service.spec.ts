import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should return a registered user', async () => {
      const dto: CreateUserDto = {
        email: 'example@example.com',
        password: 'password123',
        name: 'John Doe',
      };

      const hashedPassword = await bcrypt.hash(dto.password, 12);
      const savedUser = { id: 1, email: dto.email, password: hashedPassword, name: dto.name };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue(savedUser);

      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValueOnce(hashedPassword);
      const result = await service.create(dto);

      expect(result).toEqual(savedUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: savedUser.email } });
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
      });
    })

    it('should throw an error if email already exists', async () => {
      const dto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: "John Doe",
      };

      mockUserRepository.findOne.mockResolvedValue({ id: 1, email: dto.email });

      await expect(service.create(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: {
          email: dto.email,
        }
      });
    })

    describe('login', () => {
      it('should throw an error if user is not found', async () => {
        jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(null);

        await expect(service.login('test@example.com', 'password')).rejects.toThrow(
          new BadRequestException('User not found'),
        );
      });

      it('should throw an error if password is invalid', async () => {
        const user = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
        jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(user);
        jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

        await expect(service.login('test@example.com', 'wrongPassword')).rejects.toThrow(
          new BadRequestException('Invalid credentials!'),
        );
      });

      it('should return a JWT token if login is successful', async () => {
        const user = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
        jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(user);
        jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
        jest.spyOn(jwtService, 'signAsync').mockResolvedValue('fakeJwtToken');

        const result = await service.login('test@example.com', 'password');

        expect(result).toBe('fakeJwtToken');
        expect(jwtService.signAsync).toHaveBeenCalledWith(
          { id: user.id },
          { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_TOKEN_EXPIRE },
        );
      });
    });
  })
})