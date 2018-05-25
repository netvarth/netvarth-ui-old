export class SearchFields {
  domain: string;
  location: string;
  locationautoname: string;
  locationtype: string;
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
  passrefinedfilters: any [];
  constructor() {
    const obj = {
      domain: '',
      location: '',
      locationautoname: '',
      locationtype: '',
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
      commonfilters: '',
      passrefinedfilters: []
    };
    return obj;
  }
}
