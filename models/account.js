var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;
//account-manager.js
var crypto                 = require('crypto');
var moment                 = require('moment');

var AccountSchema = Schema({
  name: { 
  	first: String,
  	last: String 
  },
  email: {type: String },
  user: {type: String },
  pass: {type: String },
  date: {type: Date}
});

mongoose.set('debug', true);

var Account = mongoose.model('Account', AccountSchema);
// the above is necessary as you might have embedded schemas which you don't export

exports.accountModel = Account;

/* login validation methods */

exports.autoLogin = function(user, pass, callback)
{
        Account.findOne({ 'user': user}, 'name pass email', function (err, o) {
	  		if (o){
                o.pass == pass ? callback(o) : callback(null);
            }else{
                callback(null);
            }
	 	 	
	    });
};

exports.manualLogin = function(user, pass, callback)
{
	console.log(Account.toString());
	//Adventure.findOne({ type: 'iphone' }, function (err, adventure) {});
        mongoose.model('Account').findOne({user:user}, function(e, o) {
                if (o == null){
                        callback('user-not-found');
                }        else{
                        validatePassword(pass, o.pass, function(err, res) {
                                if (res){
                                        callback(null, o);
                                }        else{
                                        callback('invalid-password');
                                }
                        });
                }
        });
};

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, callback)
{

        mongoose.model('Account').findOne({user:newData.user}, function(e, o) {
                console.log("acc found");
                console.log(o);
                if (o){
                        callback('username-taken');
                }else{
                        mongoose.model('Account').findOne({email:newData.email}, function(e, o) {
                                if (o){
                                        callback('email-taken');
                                }else{
							
                                    saltAndHash(newData.pass, function(hash){
                                            newData.pass = hash;
                                    // append date stamp when record was created //
                                            //newData.date = moment();
                                             console.log("inserting>>>");
                                             console.log(newData);
                                            newData.save(callback);
                                            //accounts.insert(newData, {safe: true}, callback);
                                    });
                                }
                        });
                }
        });
};

exports.updateAccount = function(newData, callback)
{
        mongoose.model('Account').findOne({user:newData.user}, function(e, o){
                o.name                 = newData.name;
                o.email         = newData.email;
                if (newData.pass == ''){
                        accounts.save(o, {safe: true}, function(err) {
                                if (err) callback(err);
                                else callback(null, o);
                        });
                }else{
                        saltAndHash(newData.pass, function(hash){
                                o.pass = hash;
                                accounts.save(o, {safe: true}, function(err) {
                                        if (err) callback(err);
                                        else callback(null, o);
                                });
                        });
                }
        });
};

exports.updatePassword = function(email, newPass, callback)
{
        mongoose.model('Account').findOne({email:email}, function(e, o){
                if (e){
                        callback(e, null);
                }        else{
                        saltAndHash(newPass, function(hash){
                        o.pass = hash;
                        accounts.save(o, {safe: true}, callback);
                        });
                }
        });
};

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
        mongoose.model('Account').remove({_id: id}, callback);
};

exports.getAccountByEmail = function(email, callback)
{
        mongoose.model('Account').findOne({email:email}, function(e, o){ callback(o); });
};

exports.validateResetLink = function(email, passHash, callback)
{
        mongoose.model('Account').find({ $and: [{email:email, pass:passHash}] }, function(e, o){
                callback(o ? 'ok' : null);
        });
};

exports.getAllRecords = function(callback)
{
        mongoose.model('Account').find().toArray(
                function(e, res) {
                if (e) callback(e)
                else callback(null, res)
        });
};

exports.delAllRecords = function(callback)
{
        mongoose.model('Account').remove({}, callback); // reset Account collection for testing //
};

/* private encryption & validation methods */

var generateSalt = function()
{
        var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
        var salt = '';
        for (var i = 0; i < 10; i++) {
                var p = Math.floor(Math.random() * set.length);
                salt += set[p];
        }
        return salt;
};

var md5 = function(str) {
        return crypto.createHash('md5').update(str).digest('hex');
};

var saltAndHash = function(pass, callback)
{
        var salt = generateSalt();
        callback(salt + md5(pass + salt));
};

var validatePassword = function(plainPass, hashedPass, callback)
{
        var salt = hashedPass.substr(0, 10);
        var validHash = salt + md5(plainPass + salt);
        callback(null, hashedPass === validHash);
};

/* auxiliary methods */

var getObjectId = function(id)
{
        return Account.db.bson_serializer.ObjectID.createFromHexString(id)
};

var findById = function(id, callback)
{
        mongoose.model('Account').findOne({_id: getObjectId(id)},
                function(e, res) {
                if (e) callback(e)
                else callback(null, res)
        });
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
        mongoose.model('Account').find( { $or : a } ).toArray(
                function(e, results) {
                if (e) callback(e)
                else callback(null, results)
        });
};



/* list all borrowers */

exports.allBorrowers = function(callback)
{
        mongoose.model('Account').find({}, 'name email',callback);
};

