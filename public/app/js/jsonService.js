angular.module('loanApp.jsonService', [])
.factory('JsonService', function($http) {

     // return $resource('json',{ }, {getData: {method:'GET', isArray: false}


    var newServiceInstance = {};
    //factory function body that constructs newServiceInstance
    
    newServiceInstance.loadObject = function(key) {
       //  return $resource('allLoans',{ }, {getData: {method:'GET', isArray: false}
        //return data;
    };

    newServiceInstance.allLoans = function(successCallBack) {
      $http.get('/service/loan/all')
           .success(successCallBack);
          
    };


    newServiceInstance.allBorrowers = function(successCallBack) {
      $http.get('/service/borrower/all')
           .success(successCallBack);
    };

    newServiceInstance.allPayments = function(successCallBack) {
      $http.get('/service/payment/all')
           .success(successCallBack);
    };
    

    newServiceInstance.addLoan = function(loan,successCallBack) {
      console.log('Adding loan: '+loan);
      $http.put('/service/addLoan', loan)
     		   .success(successCallBack);
    };

    newServiceInstance.addItem = function(itemType,item,successCallBack) {
      console.log('Adding:');
      console.log(item);
      $http.put('/service/'+itemType+'/add', item)
           .success(successCallBack);
    };

    newServiceInstance.addBorrower = function(borrower,successCallBack) {
      $http.put('/service/addBorrower', borrower)
           .success(successCallBack);
    };  

    newServiceInstance.deleteBorrower = function(id) {
      console.log('Detete Borrower#: '+id);
      $http.get('/service/borrower/delete?id='+id)
          .success(function(data, status) {
            console.log(status);
            console.log(data);
          });
    };

    newServiceInstance.deleteItem = function(itemType,id) {
      console.log('Delete '+itemType+'#: '+id);
      $http.get('/service/'+itemType+'/delete?id='+id)
          .success(function(data, status) {
            console.log(status);
            console.log(data);
          });
    };

   	return newServiceInstance;
});
