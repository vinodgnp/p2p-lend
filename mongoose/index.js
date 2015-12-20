var mongoose = require('mongoose');
//MONGOHQ_URL
mongoose.connect( process.env.MONGOHQ_URL || 'mongodb://localhost/peer-lend');

