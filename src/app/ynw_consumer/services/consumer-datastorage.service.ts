import {Injectable} from '@angular/core';

@Injectable()

export class ConsumerDataStorageService {

  private storage = {
    'waitlist' : null
  };

  constructor() {}

  get() {
    return this.storage.waitlist;
  }

  set(data) {
    this.storage.waitlist = data;
  }


}

