exports.orders = function(req, res){
    console.log("order.js");
    console.log("OrderList:" + req.session.orderlist);
    res.send(req.session.orderlist);
};

var queryDB = require('../node_modules/queryDB');

exports.placeOrder = function(req,res) {

        var returnObject={};


        var preorders = req.body.preorders;

        var userInfo = preorders.userInfo;

        var confirmTextInSession = req.session.confirmText;
        var confirmText = preorders.confirmText;
        console.log("confirmText-"+confirmText+"; confirmTextInSession-"+confirmTextInSession);


        if(!preorders || !(preorders.total_amount>0) ){
            returnObject.hasError = true;
            returnObject.errorMessage = "订单信息不正确，请回首页重新下单，谢谢合作！";
            res.send(returnObject);
            return;
        }
        //backend validation - customer information
        if(!userInfo || !userInfo.customerName || !userInfo.mobilePhone || userInfo.customerName=="" || userInfo.mobilePhone==""){
            returnObject.hasError = true;
            returnObject.errorMessage = "用户信息为空，请验证后重新输入！";
            res.send(returnObject);
            return;
        }

        if(confirmText != confirmTextInSession) {
            returnObject.hasError = true;
            returnObject.errorMessage = "验证码不正确,请重新输入！";
            res.send(returnObject);
            return;
        }

        var orderInfoArray= {};

        console.dir(userInfo);
        console.log("preorders=" + preorders.rows.length);

        orderInfoArray.vouchersArray=[];


        for(var i = 0; i < preorders.rows.length-1; i++) {

            var order = {};
            var row = preorders.rows[i]
            orderInfoArray.vouchersArray[i] = {};

            orderInfoArray.vouchersArray[i].offerId = preorders.offers[i];
            orderInfoArray.vouchersArray[i].skuId = preorders.routes[i];
            orderInfoArray.vouchersArray[i].scheduleId = preorders.schedules[i];
            orderInfoArray.vouchersArray[i].validDate = preorders.rows[i].cell[3];
            orderInfoArray.vouchersArray[i].quantity = preorders.rows[i].cell[5];
            orderInfoArray.vouchersArray[i].offerSubtotalAmount = preorders.rows[i].cell[7];

        }

        orderInfoArray.totalAmount=preorders.total_amount;


        var result ={};

        var handleOrder=function(number) {

            req.session.results=number;
            res.send(number);

        }

        queryDB.placeOrder(userInfo,orderInfoArray,'sysuser',handleOrder);


}