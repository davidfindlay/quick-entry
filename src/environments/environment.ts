// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // api: 'https://api.quickentry.mastersswimmingqld.org.au/api/',
  api: 'https://api.test.quickentry.mastersswimmingqld.org.au/api/',
  // api: 'http://localhost:8088/api/',
  fileRoot: 'https://api.test.quickentry.mastersswimmingqld.org.au/static/',
  // api: 'https://msqprod.davsoft.com.au/api/',
  resultsPortal: 'https://b4wt31qb36.execute-api.ap-southeast-2.amazonaws.com/production/',
  payPalLegacyUrl: 'https://forum.mastersswimmingqld.org.au/swimman/api/paypalpayment.php',
  paypalApi: 'https://api.sandbox.paypal.com',
  sentryDsn: '',
  enableClientPayments: true,
  paypalClientId: 'sb'
  // paypalClientId: 'AZWwmMRH-EF8MkmCfwNITJfMrsQ4Nbkd24LtT66jx5mnXHOEzvVxl2ZfqhdMTCWJI1Q_qdHANwDkrcXu'
};
