import {Injectable} from '@angular/core';

@Injectable()

export class SearchDataStorageService {

  private storage = {
    'searchlabels' : null
  };

  constructor() {}

  getAll() {
    return this.storage.searchlabels;
  }

  set(data) {
    this.storage.searchlabels = data;
  }
  

}

