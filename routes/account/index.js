var AM = require('../../models/account');
var EM = require('../../lib/email-dispatcher');

module.exports = function(app) {
       
// logged-in user homepage //
        
        app.get('/home', function(req, res) {
            if (req.session.user == null){
        // if user is not logged-in redirect back to login page //
                res.redirect('/');
            }   else{
                        res.render('home', {
                                title : 'Control Panel',
                                udata : req.session.user
                        });
            }
        });
        
        app.post('/home', function(req, res){
                if (req.param('user') != undefined) {
                        AM.updateAccount({
                                user                 : req.param('user'),
                                name                 : req.param('name'),
                                email                 : req.param('email'),
                                pass                : req.param('pass')
                        }, function(e, o){
                                if (e){
                                        res.send('error-updating-account', 400);
                                }        else{
                                        req.session.user = o;
                        // update the user's login cookies if they exists //
                                        if (req.cookies.user != undefined && req.cookies.pass != undefined){
                                                res.cookie('user', o.user, { maxAge: 900000 });
                                                res.cookie('pass', o.pass, { maxAge: 900000 });        
                                        }
                                        res.send('ok', 200);
                                }
                        });
                }        else if (req.param('logout') == 'true'){
                        res.clearCookie('user');
                        res.clearCookie('pass');
                        req.session.destroy(function(e){ res.send('ok', 200); });
                }
        });
        
		// creating new accounts //
        
        app.get('/signup', function(req, res) {
                res.render('signup');
        });
        
        app.post('/signup', function(req, res){
           
                AM.addNewAccount(new  AM.accountModel({
                        name:{
                               first : req.param('firstName'),
                               last  : req.param('lastName')
                            },
                        email         : req.param('email'),
                        user         : req.param('email'),
                        pass        : req.param('pass')      
                }), function(e,r){

                        if (e){
                                res.send(e, 400);
                        }        else{
                                res.send('ok', 200);
                        }
                });
        });

// password reset //

        app.post('/lost-password', function(req, res){
        // look up the user's account via their email //
                AM.getAccountByEmail(req.param('email'), function(o){
                        if (o){
                                res.send('ok', 200);
                                EM.dispatchResetPasswordLink(o, function(e, m){
                                // this callback takes a moment to return //
                                // should add an ajax loader to give user feedback //
                                        if (!e) {
                                        //        res.send('ok', 200);
                                        }        else{
                                                res.send('email-server-error', 400);
                                                for (k in e) console.log('error : ', k, e[k]);
                                        }
                                });
                        }        else{
                                res.send('email-not-found', 400);
                        }
                });
        });

        app.get('/reset-password', function(req, res) {
                var email = req.query["e"];
                var passH = req.query["p"];
                AM.validateResetLink(email, passH, function(e){
                        if (e != 'ok'){
                                res.redirect('/');
                        } else{
        // save the user's email in a session instead of sending to the client //
                                req.session.reset = { email:email, passHash:passH };
                                res.render('reset', { title : 'Reset Password' });
                        }
                })
        });
        
        app.post('/reset-password', function(req, res) {
                var nPass = req.param('pass');
        // retrieve the user's email from the session to lookup their account and reset password //
                var email = req.session.reset.email;
        // destory the session immediately after retrieving the stored email //
                req.session.destroy();
                AM.updatePassword(email, nPass, function(e, o){
                        if (o){
                                res.send('ok', 200);
                        }        else{
                                res.send('unable to update password', 400);
                        }
                })
        });
        
       // view & delete accounts //
        
        app.get('/print', function(req, res) {
                AM.getAllRecords( function(e, accounts){
                        res.render('print', { title : 'Account List', accts : accounts });
                })
        });
        
        app.post('/delete', function(req, res){
                AM.deleteAccount(req.body.id, function(e, obj){
                        if (!e){
                                res.clearCookie('user');
                                res.clearCookie('pass');
                    req.session.destroy(function(e){ res.send('ok', 200); });
                        }        else{
                                res.send('record not found', 400);
                        }
            });
        });
        
        app.get('/reset', function(req, res) {
                AM.delAllRecords(function(){
                        res.redirect('/print');        
                });
        });

                 
        
       
};