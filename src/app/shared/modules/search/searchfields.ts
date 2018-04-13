export class SearchFields {
  domain: string;
  location: string;
  locationautoname: string;
  latitude: string;
  longitude: string;
  kw: string;
  kwautoname: string;
  kwdomain: string;
  kwsubdomain: string;
  kwtyp: string;
  sortfield: string;
  sortorder: string;
  labelq: string;
  subsector: string;
  specialization: string;
  rating: string;
  commonfilters: string;
  constructor() {
    const obj = {
      domain: '',
      location: '',
      locationautoname: '',
      latitude: undefined,
      longitude: undefined,
      sortfield: 'title',
      sortorder: 'asc',
      kw: '',
      kwautoname: '',
      kwdomain: '',
      kwsubdomain: '',
      kwtyp: '',
      labelq: '',
      subsector: '',
      specialization: '',
      rating: '',
      commonfilters: ''
    };
    return obj;
  }
}
