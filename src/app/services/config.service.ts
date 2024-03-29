import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private server: string;

  constructor() {
    const host = location.hostname;

    if (host === 'localhost') {
      this.server = 'http://localhost:3001';
    } else {
      this.server = '/api';
    }
  }

  getServer(service: string): string {
    return "http://10.55.37.16/api2" + service;  }
}