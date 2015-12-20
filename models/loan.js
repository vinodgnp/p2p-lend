var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;


var LoanSchema = Schema({
  lender: {type: ObjectId },
  borrower: {type: ObjectId},
  accountNumber:{type:Number},
  amount: {type: Number },
  startDate: {type: Date },
  endDate: {type: Date },
  notes:{type:String}
});

var Loan = mongoose.model('Loan', LoanSchema);
exports.loanModel = Loan;

/* record insertion, update & deletion methods */

exports.addNewLoan = function(newData, callback){

  newData.save(callback);
                                  
};

/* list all borrowers */

exports.allLoans = function(callback)
{
        mongoose.model('Loan').find({},callback);
};


exports.deleteLoan = function(id, callback)
{
        mongoose.model('Loan').remove({_id: id}, callback);
};
