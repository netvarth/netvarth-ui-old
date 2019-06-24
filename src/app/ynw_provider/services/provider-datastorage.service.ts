import {Injectable} from '@angular/core';

@Injectable()

export class ProviderDataStorageService {

  private storage = {
    'bprofile' : null,
    'waitlistManage': null
  };

  constructor() {}

  get(type) {
    return this.storage[type];
  }

  set(type, data) {
    this.storage[type] = data;
  }


}

