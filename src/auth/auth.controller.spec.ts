import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test-token'),
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
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should return a registered user', async () => {
        const dto: CreateUserDto = {
          email: 'test@example.com',
          password: 'password123',
          name: 'John Doe',
        };

        const hashedPassword = 'hashed-password';
        const savedUser = { id: 1, ...dto, password: hashedPassword };

        mockUserRepository.findOne.mockResolvedValue(null);
        mockUserRepository.save.mockResolvedValue(savedUser);

        jest.spyOn(service, 'create').mockResolvedValue(savedUser);

        const response = await controller.register(dto);

        expect(response).toEqual(savedUser);
        expect(service.create).toHaveBeenCalledWith(dto);
    })

      it('should throw an error if email already exists', async () => {
        const dto: CreateUserDto = {
          email: 'existing@example.com',
          password: 'password123',
          name: "John Doe",
        };

        mockUserRepository.findOne.mockResolvedValue({ id: 1, email: dto.email });

        jest.spyOn(service, 'create').mockRejectedValue(
            new BadRequestException('User with this email already exists!'),
        );

        await expect(controller.register(dto)).rejects.toThrow(
            BadRequestException,
        );
        expect(service.create).toHaveBeenCalledWith(dto);
      });
  })

  describe('login', () => {

  })
})