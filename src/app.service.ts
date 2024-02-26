import { Injectable } from '@nestjs/common';
import { ServiceInfo } from './types';

@Injectable()
export class AppService {
  getServiceInfo(): ServiceInfo {
    return {
      info: 'Pokemon API',
      version: '1.0.0',
      endpoints: {
        pokemon: {
          list: '/pokemon',
          findOne: '/pokemon/:id',
        },
        type: {
          list: '/type',
          findOne: '/type/:id',
        },
        seeder: '/seeder',
      },
    };
  }
}
