import { Injectable } from '@nestjs/common';
import { ServiceInfo } from './types';

@Injectable()
export class AppService {
  getServiceInfo(): ServiceInfo {
    return {
      info: 'Pokemon API',
      version: '1.0.0',
      pokemon: '/pokemon',
      type: '/type',
    };
  }
}
