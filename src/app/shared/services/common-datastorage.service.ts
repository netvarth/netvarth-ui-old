import {Injectable} from '@angular/core';

@Injectable()

export class CommonDataStorageService {

  private spSettings = {
    'account':null,
    'order': null,
    'appointments':null,
    'waitlist':null,
    'pos':null
  }

  private storage = {
    'terminologies': null,
    'spterminologies':null
  };

  public checkinInfo;

  constructor() {}

  get(type) {
    return this.storage[type];
  }

  set(type, data) {
    this.storage[type] = data;
  }

  clear() {
    this.storage = {
      'terminologies': null,
      'spterminologies': null
    };
  }

  getSettings(type) {
    return this.spSettings[type];
  }

  setSettings(type, data) {
    this.spSettings[type] = data;
  }

}

