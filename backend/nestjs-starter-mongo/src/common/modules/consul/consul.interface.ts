import { ModuleMetadata } from '@nestjs/common';

export interface ConsulModuleOptions {
  host: string;
  port: number;
  defaults?: {
    token?: string;
  };
}

export interface ConsulServiceOptions {
  name: string;
  id?: string;
  tags?: string[];
  address: string;
  port: number;
  check?: {
    name?: string;
    http: string;
    interval: string;
    timeout: string;
    deregistercriticalserviceafter?: string;
    status?: string;
    notes?: string;
    tls_skip_verify?: boolean;
  };
}

export interface ConsulModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<ConsulModuleOptions> | ConsulModuleOptions;
  inject?: any[];
}