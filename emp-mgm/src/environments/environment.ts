// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl:'https://qa.invesmate.com/api/v2', //'/api/v2'
  imageUrl: 'https://invesmate.com/uploads/', //'./assets/uploads/',
  rkeyid:'rzp_test_BpuWJaTYFszNGb',
  weburl:'http://localhost:4200/',
  socketLink: 'https://chat.invesmate.com',//'http://localhost:3096',//
  webisteRedirectCookie: 'local',
  websiteRedirectUrl: 'local',
  zoomWebAppUrl:"https://lms.invesmate.com",
  cookieDomain:'localhost',
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
