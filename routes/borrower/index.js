var AM = require('../../models/account');


module.exports = function(app) {      

        app.get('/service/borrower/all', function(req, res) {
            AM.allBorrowers(function(e,results){
                if (!e){
                   res.writeHead(200, { 'Content-Type': 'application/json' });   
                   res.write(JSON.stringify(results));
                   res.end();        
                }else{
                    res.send('{}', 400);
                }
            });
        });

        app.put('/service/addBorrower', function(req, res) {
            console.log(req.body);
            AM.addNewAccount(new AM.accountModel(
                {
                    name:{
                           first : req.body.name.first,
                           last  : req.body.name.last
                        },
                    email         : req.body.email,
                    user         : req.body.email,
                    pass        : null    
                }), function(e,record){
                    console.log("Record added as "+record);
                        if (e){
                                res.send(e, 400);
                        }  else{

                            res.writeHead(200, { 'Content-Type': 'application/json' });  
                            res.write(JSON.stringify(record));
                            res.end(); 
                            //res.send('ok', 200);
                        }
                });
        });

        app.get('/service/borrower/delete', function(req, res) {
            console.log(req.param('id'));
            AM.deleteAccount(req.param('id'), function(e){
                if (e){
                        res.send(e, 400);
                }  else{
                        res.send('ok', 200);
                }
            });
        });

};
           