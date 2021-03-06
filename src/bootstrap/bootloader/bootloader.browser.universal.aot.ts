import '../polyfills.browser.aot';
import '../rxjs.imports';
declare let ENV: string;

import { enableProdMode } from '@angular/core';
import { platformUniversalDynamic } from 'angular2-universal';

export function load(AppModuleNgFactory) {
  if ('production' === ENV) {
    enableProdMode();
  }

  function main() {
    return platformUniversalDynamic().bootstrapModuleFactory(AppModuleNgFactory)
      .catch(err => console.log(err));
  }

  function bootstrapDomReady() {
    document.addEventListener('DOMContentLoaded', main);
  }

  bootstrapDomReady();
}
