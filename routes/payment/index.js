var PM = require('../../models/payment');
module.exports = function(app) {  

      app.get('/service/payment/all', function(req, res) {
            
          PM.allPayments(function(e,results){
                if (!e){
                   res.writeHead(200, { 'Content-Type': 'application/json' });   
                   res.write(JSON.stringify(results));
                   res.end();        
                }else{
                    res.send('{}', 400);
                }
            });       
                
      });

      app.put('/service/payment/add', function(req, res) {
            console.log(req.body);
            PM.addNewPayment(new PM.paymentModel(
                {
                    loan: req.body.loan,
                    date:req.body.date,
                    amount: req.body.amount 
                }), function(e,record){
                    console.log("Record added as "+record);
                        if (e){
                                res.send(e, 400);
                        }else{

                            res.writeHead(200, { 'Content-Type': 'application/json' });  
                            res.write(JSON.stringify(record));
                            res.end(); 
                            
                        }
                });
        });

      app.get('/service/payment/delete', function(req, res) {
            console.log(req.param('id'));
            PM.deletePayment(req.param('id'), function(e){
                if (e){
                        res.send(e, 400);
                }  else{
                        res.send('ok', 200);
                }
            });
      });


};