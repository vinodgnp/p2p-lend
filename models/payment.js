var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;


var PaymentSchema = Schema({
  amount: {type: Number },
  date: {type: Date },
  loan:{type: ObjectId}
});

var Payment = mongoose.model('Payment', PaymentSchema);
exports.paymentModel = Payment;

/* record insertion, update & deletion methods */

exports.addNewPayment = function(newData, callback){

  newData.save(callback);
                                  
};

/* list all borrowers */

exports.allPayments = function(callback)
{
        mongoose.model('Payment').find({},callback);
};


exports.deletePayment = function(id, callback)
{
        mongoose.model('Payment').remove({_id: id}, callback);
};
