// Logic here is to keep a good reference of what's used

// models
Account = require('./account');
Loan = require('./loan');
Payment = require('./payment');
// User = require('./user');

// exports
exports.accountModel = Account.accountModel;
exports.loanModel = Loan.loanModel;
exports.paymentModel = Payment.paymentModel;
