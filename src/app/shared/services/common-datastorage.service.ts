import {Injectable} from '@angular/core';

@Injectable()

export class CommonDataStorageService {

  private storage = {
    'terminologies': null
  };

  constructor() {}

  get(type) {
    return this.storage[type];
  }

  set(type, data) {
    this.storage[type] = data;
    console.log(this.storage);
  }

  clear() {
    this.storage = {
      'terminologies': null
    };
  }


}

