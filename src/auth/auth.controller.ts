import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;

    try {
      const response = await axios.post(
        'https://3i-vox.ru/oauth/token',
        {
          grant_type: 'password',
          username,
          password,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        access_token: response.data.access_token,
      };
    } catch (error: any) {
      console.error(
        'Error obtaining OAuth token:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to obtain OAuth token',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
