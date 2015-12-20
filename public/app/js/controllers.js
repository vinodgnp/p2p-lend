'use strict';
/* Controllers */

function NavCtrl($scope,$location,JsonService) {

  $scope.getMenuClass = function(path) {
    
    if ($location.path().substr(0, path.length) == path) {
      return "active"
    } else {
      return ""
    }
  }
}
function LoanCtrl($scope,$location,JsonService) {

  
  $scope.borrowers = [];
  $scope.loans = [];
  $scope.payments = [];
  
  $scope.csvBuffer = '';

  
  $scope.initForm = function() {
   $scope.allBorrowers();
  }

  $scope.allBorrowers= function(){
    JsonService.allBorrowers(function(data,status){
        console.log(status);
        console.log('allBorrowers:');
        console.log(data);
        for (var i = 0;i<data.length; i++) {
          $scope.borrowers.push(data[i]);
        }
        $scope.allLoans();
    }); 
  }

  $scope.allLoans= function(){
    JsonService.allLoans(function(data,status){
        console.log(status);
        console.log('allLoans:');
        console.log(data);
        for (var i = 0;i<data.length; i++) {
          $scope.loans.push(data[i]);
        }
        $scope.allPayments();
    }); 
  }
   
  $scope.allPayments= function(){
    JsonService.allPayments(function(data,status){
        console.log(status);
        console.log('allPayments:');
        console.log(data);
        for (var i = 0;i<data.length; i++) {
          $scope.payments.push(data[i]);
        }
    }); 
  }  
  
  
  
  $scope.addLoan = function() {
  
    var newLoan =$scope.loan;
   
    var loanModel ={};
    loanModel.accountNumber =newLoan.accountNumber;
    loanModel.startDate = newLoan.startDate; 
    loanModel.amount=newLoan.amount;
    loanModel.notes=newLoan.notes;
    loanModel.borrower=newLoan.borrower;
    loanModel.lender=null;//TODO:to be filled
    console.log(loanModel); 
   
    JsonService.addLoan(loanModel, function(data, status) {
            console.log(status);
            console.log(data);
             $scope.loan= {};
             $scope.loans.push(data);
    });
   
  }
  
  $scope.getLoanStatus = function(id){
   
   return $scope.getOutstandingAmountForLoan(id) ==0 ? 'Closed':'Open';

  }
  $scope.exportCSV = function(objs) {
    $scope.csvBuffer = '';	
    jQuery.each(objs, function(i, obj) {
      var row = i+1;
      for(var key in obj){
  	   	row+=obj[key]+',';
  	  }
   	console.log(row);	
	  $scope.csvBuffer += row + '\n';
	  });
  }
  
  $scope.exportLoans = function() {
  	$scope.exportCSV($scope.loans);
  	var blob = new Blob([$scope.csvBuffer], {type: "text/plain;charset=utf-8"});
  	saveAs(blob, "Loans.csv");
  }
 
  $scope.addPayment = function() {
     JsonService.addItem('payment',$scope.payment,function(data,status){
        console.log(status);
        console.log('added payment:');
        console.log(data);
        $scope.payments.push(data);
     });
	   
	   $scope.payment= {};
  }
  
  $scope.addborrower = function() {
     JsonService.addBorrower($scope.borrower,function(data,status){
        console.log(status);
        console.log('added borrower:');
        console.log(data);
               
        $scope.borrowers.push(data);
     });
     //$scope.allBorrowers();
	   $scope.borrower= {};
    
  }

  $scope.deleteBorrower = function(index) {
    console.log(index); 
    console.log($scope.borrowers[index]); 
    JsonService.deleteBorrower($scope.borrowers[index]._id);
    $scope.borrowers.splice(index,1);

  }

  $scope.deleteLoan = function(index) {
    console.log(index); 
    console.log($scope.loans[index]); 
    JsonService.deleteItem('loan',$scope.loans[index]._id);
    $scope.loans.splice(index,1);

  }
    

  
  $scope.getRepaymentAmountForLoan= function(loan_id) {
    var repaymentAmount = 0;
    for (var i = 0; i < $scope.payments.length; i++) {
  		if(loan_id == $scope.payments[i].loan){
  			repaymentAmount += $scope.payments[i].amount;
  		}
	  }
	  return repaymentAmount;
    
  }

  $scope.getAccountNumber= function(loan_id) {
 
    for (var i = 0; i < $scope.loans.length; i++) {
      if(loan_id == $scope.loans[i]._id){
        return $scope.loans[i].accountNumber;
      }
    }
    return '';
    
  }


  
  $scope.getOutstandingAmountForLoan= function(loan_id) {
		var outstandingAmount = 0;
		for (var j = 0; j < $scope.loans.length; j++) {
			 if (loan_id == $scope.loans[j]._id){
					outstandingAmount = $scope.loans[j].amount;
					for (var i = 0; i < $scope.payments.length; i++) {
						if(loan_id == $scope.payments[i].loan){
							outstandingAmount -= $scope.payments[i].amount;
						}
					}
			 }
		}
		return outstandingAmount; 
	}
	
	$scope.getRepaymentAmountForBorrower= function(borrowerName) {
		var repaymentAmount = 0;
		for (var i = 0; i < $scope.payments.length; i++) {
			if(borrowerId == $scope.payments[i].borrowerId){
				repaymentAmount += $scope.payments[i].amount;
			}
		}
		return repaymentAmount;
  }
  
    
	$scope.getOutstandingAmountForBorrower= function(borrower_id) {
    var outstandingAmount = 0;
	 
		for (var j = 0; j < $scope.loans.length; j++) {
			 if (borrower_id == $scope.loans[j].borrower){
					outstandingAmount += $scope.loans[j].amount;
          var loan_id= $scope.loans[j]._id;
					for (var i = 0; i < $scope.payments.length; i++) {
						if(loan_id == $scope.payments[i].loan){
							outstandingAmount -= $scope.payments[i].amount;
						}
					}
			 }
	  }
    return outstandingAmount;
  }

  $scope.getBorrowerName= function(id){
    for (var i= 0; i < $scope.borrowers.length; i++) {
      var b=$scope.borrowers[i];
      if(id==b._id){return b.name.first +' '+ b.name.last}
    }
   
  }


  $scope.initForm();
  
      
}

