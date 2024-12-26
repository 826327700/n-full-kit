
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConsulService } from './consul.service';
import { CONSUL_MODULE_OPTIONS } from './consul.constants';
import { ConsulModuleAsyncOptions, ConsulModuleOptions } from './consul.interface';

@Module({})
export class ConsulModule {
  static forRoot(options: ConsulModuleOptions): DynamicModule {
    return {
      module: ConsulModule,
      providers: [
        {
          provide: CONSUL_MODULE_OPTIONS,
          useValue: options,
        },
        ConsulService,
      ],
      exports: [ConsulService],
    };
  }

  static forRootAsync(options: ConsulModuleAsyncOptions): DynamicModule {
    return {
      module: ConsulModule,
      imports: options.imports || [],
      providers: [
        ...this.createAsyncProviders(options),
        ConsulService,
      ],
      exports: [ConsulService],
    };
  }

  private static createAsyncProviders(
    options: ConsulModuleAsyncOptions,
  ): Provider[] {
    return [
      {
        provide: CONSUL_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
    ];
  }
}