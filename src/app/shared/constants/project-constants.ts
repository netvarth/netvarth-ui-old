export const projectConstants = {
  GOOGLEAPIKEY: 'AIzaSyBy0c2wXOnE16A7Xr4NKrELGa_m_8KCy6U',
  PERPAGING_LIMIT: 10,
  CONSUMER_DASHBOARD_REFRESH_TIME: 120, // seconds
  INBOX_REFRESH_TIME: 30, // seconds
  ALERT_REFRESH_TIME: 30, // seconds
  SMALL_DEVICE_BOUNDARY: 991,
  PROVIDER_SMALL_DEVICE_BOUNDARY: 767,
  searchpass_criteria: {
    'start': 0,
    'return': 'title,sector,logo,place1,business_phone_no,unique_id',
    'fq': '',
    'q': '',
    'size': 10,
    'parser': 'structured', // 'q.parser'
    'options': '', // 'q.options'
    'sort': '',
    'distance': ''
  },
  myweekdays: [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ],
  myweekdaysSchedule: [
    '',
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ],
  OPEN_NOW_INTERVAL: 2, // interval which calculates the time for open now condition in search
  MY_DATE_FORMATS: {
    parse: {
      dateInput: 'L'
    },
    display: {
      dateInput: 'L',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    }
  },
  TIMEOUT_DELAY: 2000, // msec
  TIMEOUT_DELAY_SMALL: 200, // msec
  TIMEOUT_DELAY_LARGE: 4100, // msec
  TIMEOUT_DELAY_LARGE6: 6000, // msec
  TIMEOUT_DELAY_LARGE10: 10000, // msec
  TIMEOUT_DELAY_600: 600,
  TOOLBAR_CONFIG: [
    {
      name: 'document',
      groups: ['mode', 'document', 'doctools'],
      items: ['Source', '-', 'NewPage', 'Preview', '-', 'Templates']
    },
    {
      name: 'clipboard',
      groups: ['clipboard', 'undo'],
      items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
    },
    {
      name: 'editing',
      groups: ['find', 'selection'],
      items: ['Find', 'Replace', '-', 'SelectAll']
    },
    {
      name: 'basicstyles',
      groups: ['basicstyles', 'cleanup'],
      items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat']
    },
    {
      name: 'paragraph',
      groups: ['list', 'indent', 'blocks', 'align', 'bidi'],
      items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv',
        '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language']
    },
    {
      name: 'links',
      items: ['Link', 'Unlink', 'Anchor']
    },
    {
      name: 'insert',
      items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak', 'Iframe']
    },
    { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
    { name: 'colors', items: ['TextColor', 'BGColor'] },
    { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
    { name: 'others', items: ['-'] }

  ],
  DISPLAY_DATE_FORMAT: 'DD/MM/YYYY',
  PIPE_DISPLAY_DATE_FORMAT: 'dd/MM/y',
  PIPE_DISPLAY_DATE_FORMAT_WITH_DAY: 'E, dd/MM/y',
  PIPE_DISPLAY_TIME_FORMAT: 'h:mm a',
  PIPE_DISPLAY_DATE_TIME_FORMAT: 'dd/MM/y h:mm a',
  POST_DATE_FORMAT: 'YYYY-MM-DD',
  BASE_SCHEDULE: [
    {
      day: 4,
      sTime: '09:00 AM',
      eTime: '12:00 PM'
    },
    {
      day: 2,
      sTime: '09:00 AM',
      eTime: '06:00 PM'
    },
    {
      day: 3,
      sTime: '09:00 AM',
      eTime: '06:00 PM'
    },
    {
      day: 1,
      sTime: '09:00 AM',
      eTime: '06:00 PM'
    },
    {
      day: 5,
      sTime: '09:00 AM',
      eTime: '06:00 PM'
    }
    ,
    {
      day: 6,
      sTime: '09:00 AM',
      eTime: '06:00 PM'
    },
    {
      day: 7,
      sTime: '09:00 AM',
      eTime: '12:00 PM'
    }
  ],
  DEFAULT_STARTTIME: '09:00 AM',
  DEFAULT_ENDTIME: '06:00 PM',
  IMAGE_FORMATS: [
    'image/gif',
    'image/png',
    'image/jpeg',
    'image/bmp',
    'image/webp'
  ],
  IMAGE_MAX_SIZE: 5000000, // byte
  FILE_MAX_SIZE: 10000000,
  INTERVAL_TIME: 60000, // byte
  AUTOSUGGEST_MIN_CHAR: 3,  // minimum characters required for autosuggest
  AUTOSUGGEST_LOC_MAX_CNT: 100000, // max number of locations that will be displayed in the autosuggestion
  SEARCH_DEFAULT_LOCATION: {
    'autoname': 'Bengaluru, Karnataka',
    'name': 'Bengaluru',
    'lat': '12.971599',
    'lon': '77.594563',
    'typ': 'city'
  },
  MAP_ZOOM: 15,
  MAP_BASE_URL: 'https://www.google.com/maps/place/', // this is used to implement google map related API calls
  LOCATION_BADGE_ICON: { // images to be used for the location badges
    'physiciansemergencyservices': { 'icon': 'emergency.png', 'class': 'icon-emergency' }, // dynamic
    'dentistemergencyservices': { 'icon': 'emergency.png', 'class': 'icon-emergency' }, // dynamic
    'altemergencyservices': { 'icon': 'emergency.png', 'class': 'icon-emergency' }, // dynamic
    'emergencyservices': { 'icon': 'emergency.png', 'class': 'icon-emergency' }, // dynamic
    'traumacentre': { 'icon': 'trauma.png', 'class': 'icon-trauma' }, // dynamic
    'firstaid': { 'icon': 'noimage.png', 'class': 'icon-first-aid' }, // dynamic
    '24hour': { 'icon': 'noimage.png', 'class': 'icon-open-time' },
    'parkingtype': { 'icon': 'noimage.png', 'class': 'icon-parking' },
    'autopaymentoptions': { 'icon': 'autopay.png', 'class': 'icon-auto-payment' },
    'docambulance': { 'icon': 'ambulance.png', 'class': 'icon-ambulance' },
    'none': { 'icon': 'noimage.png', 'class': 'icon-trauma' }
  },
  SOCIAL_MEDIA: [
    { key: 'facebook', iconClass: 'fa fa-facebook-square fb', iconImg: 'facebook.png', displayName: 'Facebook' },
    { key: 'twitter', iconClass: 'fa fa-twitter-square tw', iconImg: 'twitter.png', displayName: 'Twitter' },
    { key: 'youtube', iconClass: 'fa fa-youtube-square ytb', iconImg: 'youtube.png', displayName: 'Youtube' },
    { key: 'linkedin', iconClass: 'fa fa-linkedin lkd', iconImg: 'linkedin.png', displayName: 'LinkedIn' },
    { key: 'googleplus', iconClass: 'fa fa-google-plus-square gpl', iconImg: 'googleplus.png', displayName: 'Google+' },
    { key: 'pinterest', iconClass: 'fa fa-pinterest-square pntr', iconImg: 'pinterest.png', displayName: 'Pinterest' },
    { key: 'website', iconClass: 'fa fa-globe site', iconImg: 'website.png', displayName: 'Website' }
  ],
  PRIVACY_PERMISSIONS: {
    'all': 'Public (All can see)',
    'customersOnly': 'Customer',
    'self': 'Private (None can see)'
  },
  TOOLTIP_CLS: 'ynwtooltipcls',
  TOOLTIP_PRIVACYPHONE: 'Example : Cell Phone,  Mobile, Emergency, Main Line, others etc',
  TOOLTIP_PRIVACYEMAIL: 'Example : Office Email id, Personal Email id etc',
  TOOLTIP_MALE: 'Male',
  TOOLTIP_FEMALE: 'Female',
  VALIDATOR_BLANK_FALSE: /^((?!\s{2,}).)*$/,
  VALIDATOR_BLANK: /^\s*$/,
  // VALIDATOR_URL: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
  VALIDATOR_URL: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
  VALIDATOR_NUMBERONLY: /^\d+$/,
  VALIDATOR_FLOAT: /^[+-]?([0-9]*[.])?[0-9]+$/,
  VALIDATOR_PHONENUMBERCOUNT10: /^\d{10}$/,
  VALIDATOR_CHARONLY: /^[a-zA-Z\. ]+$/,
  VALIDATOR_ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
  VALIDATOR_ALPHANUMERIC_HYPHEN: /^[a-zA-Z0-9-]*$/,
  // VALIDATOR_CHARONLY: /^[a-zA-Z][a-zA-Z ]+$/,
  // VALIDATOR_EMAIL: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/,
  VALIDATOR_EMAIL: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
  VALIDATOR_MAX6: 6, // max char count
  VALIDATOR_MAX9: 9, // max char count
  VALIDATOR_MAX10: 10, // max char count
  VALIDATOR_MAX50: 50, // max char count
  VALIDATOR_MAX100: 100, // max char count
  VALIDATOR_MAX150: 150, // max char count
  VALIDATOR_MAX200: 200, // max char count
  VALIDATOR_MAX250: 250, // max char count
  VALIDATOR_MAX500: 500, // max char count
  VALIDATOR_MAX_LAKH: 100,
  VALIDATOR_MOBILE_AND_EMAIL: /^(?:\d{10}|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4})$/,
  QTY_MAX_VALUE: 100000,
  PRICE_MAX_VALUE: 100000,
  TIME_MAX_VALUE: 3600,
  PERC_MAX_VALUE: 100,
  WAITLIST_CANCEL_RESON: [{ title: 'No Show Up', value: 'noshowup', reasonkey: 'noShowUpCancel', type: 2 },
  { title: 'Self', value: 'self', reasonkey: 'selfCancel' },
  { title: 'Blocked', value: 'blocked', reasonkey: 'blockedCancel' },
  { title: 'Closing Soon', value: 'closingSoon', reasonkey: 'closingSoonCancel', type: 2 },
  { title: 'Too Full', value: 'tooFull', reasonkey: 'tooFullCancel' }],
  DOMAINLIST_APIFETCH_HOURS: 1, // hours which decides whether domain list api should be execured or not
  REFINE_ENUMLIST_DEFAULT_SHOW_CNT: 5,
  DISTANCE_STATE: 300, // in Km
  DISTANCE_CITY: 40, // in Km
  DISTANCE_AREA: 5, // in Km
  DISTANCE_METRO: 10, // in Km
  DISTANCE_CAPITAL: 20, // in Km

  AUDITLOG_CNT: 10,
  AUDITLOG_FILTER_CATEGORIES: [
    {
      name: 'SETTINGS',
      displayName: 'Settings',
      subcat: [
        { name: 'LOCATION', dispName: 'Location' },
        { name: 'QUEUE', dispName: 'Queues' },
        { name: 'SERVICE', dispName: 'Service' },
        { name: 'HOLIDAY', dispName: 'Holiday' },
        { name: 'WAITLIST', dispName: 'Waitlist' },
        { name: 'PAYMENT', dispName: 'Payment' },
        { name: 'COUPOUN', dispName: 'Coupon' },
        { name: 'ITEM', dispName: 'Item' },
        { name: 'ADDWORD', dispName: 'Jaldee Adword' },
        { name: 'TAX', dispName: 'Tax' },
        { name: 'DISCOUNT', dispName: 'Discount' },
        { name: 'ACCOUNT', dispName: 'Account' }
      ]
    },
    {
      name: 'WAITLIST',
      displayName: 'Waitlist',
      subcat: [
        { name: 'CANCEL', dispName: 'Cancel' },
        { name: 'WAIT', dispName: 'Wait' },
        { name: 'DELAY', dispName: 'Delay' },
        { name: 'WAITLIST', dispName: 'Waitlist' },
        { name: 'RATING', dispName: 'Rating' },
        { name: 'BILL', dispName: 'Bill' }
      ]
    },
    {
      name: 'LICENSE',
      displayName: 'License',
      subcat: [
        { name: 'ADDON', dispName: 'Add-on' },
        { name: 'INVOICE', dispName: 'Invoice' },
        { name: 'LICENSE', dispName: 'License' }
      ]
    },
    {
      name: 'SIGNUP',
      displayName: 'Signup',
      subcat: [
        { name: 'PROVIDER', dispName: 'Provider' },
        { name: 'CONSUMER', dispName: 'Consumer' }
      ]
    }
  ],
  AUDITLOG_FILTER_ACTION: [
    { name: 'ADD', dispName: 'Add' },
    { name: 'DELETE', dispName: 'Delete' },
    { name: 'EDIT', dispName: 'Edit' },
    // { name: 'COPY', dispName: 'Copy' },
    { name: 'VIEW', dispName: 'View' }
  ],
  ALERT_CNT: 10,
  BUSINESS_NAME_MAX_LENGTH: 50,
  BUSINESS_DESC_MAX_LENGTH: 2000,
  REPORT_STATUSES: {
    PAYMENTPENDING: 'Payment Pending',
    REQUESTED: 'Requested',
    PAID: 'Paid',
    INDISPUTE: 'In-Dispute'
  },
  PARKING_TYPES: [
    { displayName: 'None', value: 'none' },
    { displayName: 'Free Parking', value: 'free' },
    { displayName: 'Street Parking', value: 'street' },
    { displayName: 'Private Parking', value: 'privatelot' },
    { displayName: 'Valet Parking', value: 'valet' },
    { displayName: 'Paid Parking', value: 'paid' }
  ],
  PARKING_TYPES_DISPLAY: {
    none: 'None',
    free: 'Free Parking',
    street: 'Street Parking',
    privatelot: 'Private Parking',
    valet: 'Valet Parking',
    paid: 'Paid Parking'
  },
  REPORT_STATUS_FILTER: [
    { displayName: 'Payment Pending', value: 'PAYMENTPENDING' },
    { displayName: 'Requested', value: 'REQUESTED' },
    { displayName: 'Paid', value: 'PAID' },
    { displayName: 'In-Dispute', value: 'INDISPUTE' }
  ],
  ITEM_STATUS: {
    ACTIVE: 'Enabled',
    INACTIVE: 'Disabled'
  },
  COUPON_NOTES: {
    MINIMUM_BILL_AMT_REQUIRED: 'Minimum bill amount',
    COUPON_APPLIED: 'Coupon already applied',
    SELF_PAY_REQUIRED: 'Self pay required',
    NO_OTHER_COUPONS_ALLOWED: 'No other coupons allowed',
    EXCEEDS_APPLY_LIMIT: 'Exceeds apply limit',
    ONLY_WHEN_FITST_CHECKIN: 'Only for first check-in',
    ONLINE_CHECKIN_REQUIRED: 'Online check-in required',
    CANT_COMBINE_WITH_OTHER_COUPONES: 'Can\'t combine with other coupons'
  },
  CHECK_IN_STATUSES: {
    Done: 'Completed',
    Started: 'Started',
    Arrived: 'Arrived',
    CheckedIn: 'Checked in',
    Cancelled: 'Cancelled'
  },
  CHECK_IN_STATUSES_FILTER: [
    { displayName: 'checked in', value: 'checkedIn' },
    { displayName: 'Arrived', value: 'arrived' },
    { displayName: 'Started', value: 'started' },
    { displayName: 'Completed', value: 'done' },
    { displayName: 'Cancelled', value: 'cancelled' }
  ],
  JCOUPON_STATES: {
    NEW: 'New - Available for Use',
    EXPIRED: 'Expired',
    ENABLED: 'Enabled',
    DISABLED: 'Disabled',
    DISABLED_BY_JALDEE: 'Disabled By Jaldee',
    DISABLED_PROVIDER_LIMIT_REACHED: 'Disabled (Limit Reached)'
  },
  LICENSE_PACKAGES: {
    5: 'You can change your license package anytime. Once the trial period expires, we will automatically put you in to "Basic Free"',
    1: '',
    7: '',
    2: '',
    3: '',
    4: ''
  },
  PROFILE_ERROR_STACK: {
    1: 'Please set up the \'Basic Information\' section to view your dashboard.',
    2: 'Please set profile name',
    3: 'Please set location',
    4: 'No active services found',
    5: 'No active queues found',
    pushMsg: 'Push message',
    email: 'Email',
    none: 'None',
    professionalConsulting: 'Eg:- Adv.Pranav, Ameya Professionals Private Limited, etc',
    healthCare: 'Eg:- Seven Star Clinic, Dr. Mani, Bright Hospital, etc',
    personalCare: 'Eg:- Herbal beauty parlour, Aloe Sita Beauty Salon & Spa, etc',
    finance: 'Eg:- Manappuram Finance Limited, Bajaj Allianz Life Insurance Co. Ltd, etc',
    foodJoints: 'Eg:- Pepper Restaurant, Madurai Vegetarian, etc',
    vastuAstrology: 'Eg:- Vastupeedam, Ambadi Jyothisham Center, etc',
    religiousPriests: 'Eg:- Our Lady of Dolours Basilica Church, Sri Vadakkumnatha Temple, etc',
    veterinaryPetcare: 'Eg:- Veterinary Clinic, Adat Veterinary Hospital, etc'
  },
  DOMAIN_SEARCH_SUGGESTIONS: {
    all: 'Search for doctors, professionals, beauty saloons, ....',
    professionalconsulting: 'Search for lawyers, civil architects, chartered accountants, ....',
    healthcare: 'Search for hospitals, doctors, dentists,.....',
    personalcare: 'Search for beauty saloons, fitness centers, massage centers, ......',
    finance: 'Search for financial institutions, insurances, loans, ......',
    foodjoints: 'Search for restaurants, caterers, home bakers, .....',
    vastuastrology: ' Search for astrologers, vastu consultants, ......',
    religiouspriests: 'Search for temples, poojas, ceremonies, .....',
    veterinarypetcare: 'Search for veterinary doctors, pet grooming, pet training, ......'
  },

  LICENSE_METRIC: {
    1: 'Jaldee_Business_Listing',
    2: 'Search',
    3: 'Business_Profile_View',
    4: 'Number_Of_Provider',
    5: 'Transactions',
    6: 'Jaldee_Pay/Billing',
    7: 'Storage',
    8: 'Jaldee_Keywords',
    9: 'Kiosk',
    10: 'Jaldee_POS',
    11: 'Corporate_Integration',
    12: 'Jaldee_Coupon',
    13: 'Custom_URL',
    14: 'Guaranteed_Business_Value_Protection',
    15: 'Additional_Transation_Charges'

  },
  REGION_LANGUAGE: 'en-US',
  TIME_ZONE_REGION: 'Asia/Kolkata',
  KEY: 'JALDEESOFT',
  STATUS_BOARD: [
    {
      'name': 'token',
      'displayname': 'Token',
      'label': false,
      'checked': false,
      'order': 1,
    },
    {
      'name': 'service',
      'displayname': 'Service',
      'label': false,
      'checked': false,
      'order': 2,
    },
    {
      'name': 'appxWaitingTime',
      'displayname': 'Waiting Time',
      'label': false,
      'checked': false,
      'order': 3,
    },
    {
      'name': 'queue',
      'displayname': 'Queue',
      'label': false,
      'checked': false,
      'order': 4,
    },
    {
      'name': 'waitlistingFor',
      'displayname': 'Customer',
      'label': false,
      'checked': false,
      'order': 5,
    }
  ],
  ADWORDSPLIT: '__',
  FILETYPES_UPLOAD: [
    'image/jpg',
    'image/png',
    'image/jpeg',
    'application/pdf'
  ]
};
