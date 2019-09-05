// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  api: 'https://msqtest.davsoft.com.au/api/',
  resultsPortal: 'https://b4wt31qb36.execute-api.ap-southeast-2.amazonaws.com/production/',
  payPalLegacyUrl: 'https://forum.mastersswimmingqld.org.au/swimman/api/paypalpayment.php',
  paypalApi: 'https://api.sandbox.paypal.com'
};
