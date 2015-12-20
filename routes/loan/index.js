var LM = require('../../models/loan');
module.exports = function(app) {  

      app.get('/service/loan/all', function(req, res) {
            
          LM.allLoans(function(e,results){
                if (!e){
                   res.writeHead(200, { 'Content-Type': 'application/json' });   
                   res.write(JSON.stringify(results));
                   res.end();        
                }else{
                    res.send('{}', 400);
                }
            });       
                
      });

      

      app.put('/service/addLoan', function(req, res) {
            console.log(req.body);
            LM.addNewLoan(new LM.loanModel(
                {
                    borrower: req.body.borrower,
                    lender: req.body.lender,
                    startDate:req.body.startDate,
                    accountNumber: req.body.accountNumber,  
                    amount: req.body.amount ,
                    notes:req.body.notes
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

      app.get('/service/loan/delete', function(req, res) {
            console.log(req.param('id'));
            LM.deleteLoan(req.param('id'), function(e){
                if (e){
                        res.send(e, 400);
                }  else{
                        res.send('ok', 200);
                }
            });
      });


};