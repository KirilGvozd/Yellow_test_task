import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {BadRequestException, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {LoginUserDto} from "./dto/login-user.dto";

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
          email: 'example@example.com',
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
    it('should return a token and set a cookie', async () => {
      const dto: LoginUserDto = {
        email: 'example@example.com',
        password: 'password123',
      };

      const user = {
        id: 1,
        email: dto.email,
        password: dto.password,
      };

      const token = 'test-token';

      jest.spyOn(service, 'login').mockResolvedValue(token);
      mockUserRepository.findOne.mockResolvedValue(user);

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      const result = await controller.login(dto, mockResponse);

      expect(result).toEqual({
        message: 'Login succeeded!',
        token,
      });
      expect(mockResponse.cookie).toHaveBeenCalledWith('jwt', token, { httpOnly: true });
      expect(service.login).toHaveBeenCalledWith(dto.email, dto.password);
    });

    it('should throw an error if user not found', async () => {
      const dto: LoginUserDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      jest.spyOn(service, 'login').mockRejectedValue(new BadRequestException('User not found'));

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      await expect(controller.login(dto, mockResponse)).rejects.toThrow(BadRequestException);
    });
  });

  describe('logout', () => {
    it('should clear the cookie and return a success message', async () => {
      const mockResponse = {
        clearCookie: jest.fn(),
      } as any;

      const mockRequest = {
        user: { id: 1 },
      } as any;

      const result = await controller.logout(mockResponse, mockRequest);

      expect(result).toEqual({ message: 'Success' });
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('jwt');
    });

    it('should throw an error if user is not logged in', async () => {
      const mockResponse = {
        clearCookie: jest.fn(),
      } as any;

      const mockRequest = {
        user: null,
      } as any;

      await expect(controller.logout(mockResponse, mockRequest)).rejects.toThrow(
          UnauthorizedException,
      );
      expect(mockResponse.clearCookie).not.toHaveBeenCalled();
    });
  });
})