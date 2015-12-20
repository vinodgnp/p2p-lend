'use strict';

/* router */
var routerModule = angular.module('loanApp.router', []);

routerModule.value('version', '0.1');

routerModule.config(function($routeProvider) {
  $routeProvider.
      when('/loan'    , {template: 'app/partials/loan.htm',     controller: LoanCtrl}).
      when('/payment' , {template: 'app/partials/payment.htm',  controller: LoanCtrl}).
	  when('/borrower', {template: 'app/partials/borrower.htm', controller: LoanCtrl}).
      otherwise({redirectTo: '/loan'});
});