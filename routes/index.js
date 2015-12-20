var AM = require('../models/account');
//var AM  = Models.accountModel;

module.exports = function(app) {
		
		// main login page //

        app.get('/', function(req, res){
        // check if the user's credentials are saved in a cookie //
                if (req.cookies.user == undefined || req.cookies.pass == undefined){
                        res.render('login', { title: 'Hello - Please Login To Your Account' });
                } else{
        // attempt automatic login //
                        AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
                                if (o != null){
                                    req.session.user = o;
                                        res.redirect('/home');
                                }        else{
                                        res.render('login', { title: 'Hello - Please Login To Your Account' });
                                }
                        });
                }
        });
        
        app.post('/', function(req, res){
        		console.log("posted");
                AM.manualLogin(req.param('user'), req.param('pass'), function(e, o){
                        if (!o){
                                res.send(e, 400);
                        }        else{
                            req.session.user = o;
                                if (req.param('remember-me') == 'true'){
                                        res.cookie('user', o.user, { maxAge: 900000 });
                                        res.cookie('pass', o.pass, { maxAge: 900000 });
                                }
                                res.send(o, 200);
                        }
                });
        });
		
	    // other routes entered here as require(route)(app);
	    // we basically pass 'app' around to each route
		require('./account')(app);
		require('./borrower')(app);
		require('./loan')(app);
		require('./payment')(app);
		
		app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

}