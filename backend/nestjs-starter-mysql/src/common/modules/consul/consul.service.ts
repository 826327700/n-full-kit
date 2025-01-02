import { Injectable, OnModuleDestroy, OnModuleInit, Inject } from '@nestjs/common';
import  Consul from 'consul';
import { ConsulModuleOptions, ConsulServiceOptions } from './consul.interface';
import { CONSUL_MODULE_OPTIONS } from './consul.constants';

interface IConsulService {
  Service: string;
  ID: string;
  Tags: string[];
  Port: number;
  Address: string;
}

@Injectable()
export class ConsulService implements OnModuleInit, OnModuleDestroy {
  private readonly consul: Consul;
  private serviceId: string;

  constructor(
    @Inject(CONSUL_MODULE_OPTIONS)
    private readonly options: ConsulModuleOptions,
  ) {
    this.consul = new Consul({
      host: this.options.host,
      port: this.options.port,
      defaults: this.options.defaults,
    });
  }

  async onModuleInit() {
    // Module initialization logic
  }

  async onModuleDestroy() {
    console.log('ConsulService onModuleDestroy');
    if (this.serviceId) {
      await this.deregister(this.serviceId);
    }
  }

  async register(options: ConsulServiceOptions): Promise<string> {
    const serviceId = options.id || `${options.name}-${options.port}`;
    
    try {
      await this.consul.agent.service.register({
        id: serviceId,
        name: options.name,
        tags: options.tags || [],
        address: options.address,
        port: options.port,
        check: options.check ? {
          name: options.check.name || `${options.name} health check`,
          http: options.check.http,
          interval: options.check.interval,
          timeout: options.check.timeout,
          deregistercriticalserviceafter: options.check.deregistercriticalserviceafter || '30s',
          status: options.check.status,
          notes: options.check.notes,
          tlsskipverify: options.check.tls_skip_verify,
        } : undefined,
      });
  
      this.serviceId = serviceId;
      console.log(`Service registered with Consul: ${serviceId}`);
      return serviceId;
    } catch (error) {
      console.error('Failed to register service with Consul:', error);
      throw error;
    }
  }

  async deregister(serviceId: string): Promise<void> {
    try {
        console.log(`Service deregistered from Consul: ${serviceId}`);
      await this.consul.agent.service.deregister(serviceId);
    } catch (error) {
      console.error('Failed to deregister service from Consul:', error);
      throw error;
    }
  }

  async getService(serviceName: string): Promise<IConsulService[]> {
    try {
      const services = await this.consul.agent.service.list();
      return Object.values(services as Record<string, IConsulService>).filter(
        (service) => service.Service === serviceName,
      );
    } catch (error) {
      console.error('Failed to get service from Consul:', error);
      throw error;
    }
  }
}