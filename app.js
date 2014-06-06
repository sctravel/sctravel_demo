
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var dateFormat = require('dateformat');
var alipay = require('alipayUtil.js');
var orders = require('./routes/orders');
var orderConfir = require('./routes/orderConfir');



var mail=require('./node_modules/emailUtil');
var queryDB = require('./node_modules/queryDB');
var stringUtils = require('./node_modules/stringUtils');
var tableNames = require('./node_modules/tableNames');
var constants = require('./node_modules/constants')
var confirmPicGenerator = require('./node_modules/confirmPicGenerator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var adminUtil = require('./node_modules/adminLogin');
var accountManager = require('./node_modules/adminUserManagement');
var permissionManager = require('./node_modules/adminToolPermission');
var orderManager = require('./node_modules/adminOrderManagement');
var clientQueryDB = require('./node_modules/clientQueryDB');
var customerToolsQueryDB = require('./node_modules/customerToolsQueryDB');
var adminQueryDB = require('./node_modules/adminQueryDB');


var app = express();



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser('123456xyz'));
app.use(express.session({cookie: { maxAge : constants.SESSION_HOURS*60*60*1000 }})); // Session expires in SESSION_HOURS hours
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.methodOverride());


/*********************************************************
 *Log4js configuration
 *********************************************************/
var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' }, //控制台输出
        {
            type: 'file', //文件输出
            filename: 'logs/access.log',
            maxLogSize: 1024*1024*100,
            backups:3,
            category: 'normal'
        }
    ],
    replaceConsole: true
});
var logger = log4js.getLogger('normal');
logger.setLevel('INFO');
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

exports.logger=function(name){
    var logger = log4js.getLogger(name);
    logger.setLevel('INFO');
    return logger;
}


app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
};


//Home page
app.get('/', function (req,res){
    res.render('spots.ejs');
});


/*************************************************************
 * Data Services using http GET method
 *************************************************************/
// Order: insert data record:
//TODO change all the Get method to Post
//Ticket : delete\Disable ticket
app.get('/services/admin/DeleteSpots/:values', function(req,res) {

    var values = req.params.values;
    console.log("Parameter: " + values);

    adminQueryDB.disableRecord(tableNames.spotTable ,'spot_id', values, function(results){

        res.send(results);
    })
});

app.get('/services/admin/DeleteOffers/:values', function(req,res) {

    var values = req.params.values;
    console.log("Parameter: " + values);

    adminQueryDB.disableRecord(tableNames.offerTable ,'offer_id', values, function(results){

        res.send(results);
    })
});



app.get('/services/admin/InsertOrder/:tableColumnNames/:values', function(req,res) {


    var tableColumnNames = req.params.tableColumnNames;
    console.log("Parameter: " + tableColumnNames);

    var values = req.params.values;
    console.log("Parameter: " + values);

    adminQueryDB.insertRecord(tableNames.orderTable ,tableColumnNames, values, function(results){
        res.send(results);
    })
});


// Order: lookup by confirmation number
app.get('/services/admin/GetCustomersBasedOnConfirmation/:confirmNum', function(req,res) {
    var confirmNum = req.params.confirmNum;
    console.log("Parameter: " + confirmNum);
    orderManager.getOrderFromCustomersConfirmationNumber(confirmNum,function(results){
        res.send(results);
    })
});


//Order: look up by order number
app.get('/services/admin/GetOrderBasedOnOrderId/:orderNum', function(req,res) {
    var orderNum = req.params.orderNum;
    console.log("Parameter: " + orderNum);
    orderManager.getOrderFromOrderNumber(orderNum,function(results){
        res.send(results);
    })
});



//Order:  lookup order by customer name
app.get('/services/admin/GetOrdersBasedOnName/:name', function(req,res) {
    var name = req.params.name;
    console.log("Parameter: " + name);
    orderManager.geOrdersFromCustomerName(name,function(results){
        res.send(results);
    })
});

//Order: lookup by customer phone
app.get('/services/admin/GetOrderBasedOnPhoneNumber/:phone', function(req,res) {
    var phone = req.params.phone;
    console.log("Parameter: " + phone);
    orderManager.getOrderFromCustomersPhoneNumber(phone,function(results){
        res.send(results);
    })
});

// Customer: insert data record:
app.get('/services/admin/InsertCustomer/:tableColumnNames/:values', function(req,res) {

    var tableColumnNames = req.params.tableColumnNames;
    console.log("Parameter: " + tableColumnNames);

    var values = req.params.values;
    console.log("Parameter: " + values);

    adminQueryDB.insertRecord(tableNames.customerTable ,tableColumnNames, values, function(results){
        res.send(results);
    })
});


// Customer: insert data record:
app.get('/services/admin/InsertCustomer/:tableColumnNames/:values', function(req,res) {

    var tableColumnNames = req.params.tableColumnNames;
    console.log("Parameter: " + tableColumnNames);

    var values = req.params.values;
    console.log("Parameter: " + values);

    adminQueryDB.insertRecord(tableNames.customerTable ,tableColumnNames, values, function(results){
        res.send(results);
    })
});


//Ticket: look up by ticket number
app.get('/services/admin/GetCustomersBasedOnTicket/:ticketNum', function(req,res) {
    var ticketNum = req.params.ticketNum;
    console.log("Parameter: " +ticketNum);
    orderManager.getCustomersFromTicketNumber(ticketNum,function(results){
        res.send(results);
    })
});

// Ticket: insert data record:
app.get('/services/admin/InsertTicket/:tableColumnNames/:values', function(req,res) {

    var tableColumnNames = req.params.tableColumnNames;
    console.log("Parameter: " + tableColumnNames);

    var values = req.params.values;
    console.log("Parameter: " + values);

    adminQueryDB.insertRecord(tableNames.sc_sku_tickets ,tableColumnNames, values, function(results){

        res.send(results);
    })
});

//Ticket : delete\Disable ticket
app.get('/services/admin/InsertTicket/:tableColumnNames/:values', function(req,res) {

    var tableColumnNames = req.params.tableColumnNames;
    console.log("Parameter: " + tableColumnNames);

    var values = req.params.values;
    console.log("Parameter: " + values);

    adminQueryDB.insertRecord(tableNames.sc_sku_tickets ,tableColumnNames, values, function(results){

        res.send(results);
    })
});



//Ticket : delete\Disable ticket
app.get('/services/admin/InsertTicket/:tableColumnNames/:values', function(req,res) {

    var tableColumnNames = req.params.tableColumnNames;
    console.log("Parameter: " + tableColumnNames);

    var values = req.params.values;
    console.log("Parameter: " + values);

    adminQueryDB.insertRecord(tableNames.sc_sku_tickets ,tableColumnNames, values, function(results){
        res.send(results);
    })
});


// Routes: insert data record:
app.get('/services/admin/InsertRoutes/:tableColumnNames/:values', function(req,res) {

    var tableColumnNames = req.params.tableColumnNames;
    console.log("Parameter: " + tableColumnNames);

    var values = req.params.values;
    console.log("Parameter: " + values);

    adminQueryDB.insertRecord(tableNames.routeTable ,tableColumnNames, values, function(results){
        res.send(results);
    })
});

app.get('/services/admin/DeleteOffers/:values', function(req,res) {

    var values = req.params.values;
    console.log("Parameter: " + values);

    adminQueryDB.disableRecord(tableNames.offerTable ,'offer_id', values, function(results){

        res.send(results);
    })
});


app.get('/services/getAll/scenerySpots', function(req,res) {

    clientQueryDB.getAllScenerySpots(function(results){
        res.send(results);
    })
});

app.get('/services/getAll/startSpots', function(req,res) {

    clientQueryDB.getAllStartSpots(function(results){
        res.send(results);
    })
});

app.get('/services/getAll/routesByStartSpot', function(req,res) {

    clientQueryDB.getRoutesFromStartSpots(function(results){
        res.send(results);
    })
});

app.get('/services/getAll/offersByRoute', function(req,res) {

    clientQueryDB.getOffersFromRouteId(function(results){
        res.send(results);
    })
});




app.get('/services/getAll/offers', function(req,res) {

    clientQueryDB.getAllOffers(function(results){
        res.send(results);
    })
});

app.get('/services/getAll/routes', function(req,res) {

    clientQueryDB.getAllRoutes(function(results){
        res.send(results);
    })
});

app.get('/services/getAll/buses', function(req,res) {

    clientQueryDB.getAllBuses(function(results){
        res.send(results);
    })
});

app.get('/services/getAll/drivers', function(req,res) {

    clientQueryDB.getAllDrivers(function(results){
        res.send(results);
    })
});

app.get('/services/getAll/validSchedules', function(req,res) {

    clientQueryDB.getAllValidSchedules(function(results){
        res.send(results);
    })
});




app.get('/services/search/orders', function(req,res){
    //console.dir(req);
    var confirmCode = req.query.confirmCode;
    var customerInfo = req.query.customerInfo;
    var orderId = req.query.orderId;

    console.log("ConfirmCode-"+confirmCode);
    console.log("CustomerInfo-"+customerInfo);
    if(confirmCode) {
        customerToolsQueryDB.getVouchersFromConfirmationCode(confirmCode,function(results){
            console.log("Search order by confirmation code!");
            console.dir(results);
            res.send(results);
        });
    } else if(customerInfo) {
        customerToolsQueryDB.getVouchersFromCustomerInfo(customerInfo,function(results){
            console.log("Search order by customer information!");
            console.dir(results);
            res.send(results);
        });
    } else if(orderId) {
        customerToolsQueryDB.getVouchersFromOrderId(orderId,function(results){
            console.log("Search order by orderId!");
            console.dir(results);
            res.send(results);
        })
    }
});

/********************************************************************
 * Customer Tools page
 ********************************************************************/
app.get('/customerTools',function(req,res){
    res.render('customerTools.ejs');
});

/********************************************************************
 * Actions using http POST methods
 ********************************************************************/

app.post('/orders', function (req,res){

    var a = req.body.orderlist;
    req.session.orderlist=a;	
    res.redirect('/orderReview');
});

app.get('/orderReview', function (req,res){
    res.render('orderReview.ejs');
});

app.get('/finalOrder', function (req,res){
    res.render('finalOrder.ejs');
});

app.get('/orders', orders.orders);


app.post('/preorder', orders.placeOrder);
app.get('/orderConfir',orderConfir.orderConfir);

app.post('/alipayto',alipay.alipayto);
app.post('/paynotify',alipay.paynotify);
app.get('/payreturn',alipay.payreturn);

/********************************************************************
 * AdminLogin methods
 ********************************************************************/
passport.use('local', new LocalStrategy(
    function (username, password, done) {

        adminUtil.manualLogin(username,password, function(error,results){
            console.dir(results);
            if(error) {
                return done(null, false, { message: '内部错误.' });
            }
            if(results.isAuthenticated == true ) {
                console.dir(results);
                return done(null, {username : username, randomKey: results.randomKey} );
            } else {
                return done(null, false, { message: results.errorMessage });
            }
        });
    }
));

passport.serializeUser(function (user, done) {//保存user对象
    done(null, {username:user.username, randomKey:user.randomKey});//可以通过数据库方式操作
});

passport.deserializeUser(function (user, done) {//删除user对象
    done(null, {username:user.username, randomKey:user.randomKey} );//可以通过数据库方式操作
});

app.get('/adminLogin', function (req, res) {
    res.render('adminLogin.ejs',{error: req.flash('error'), success: req.flash('success'), message:req.flash('message') });
});

app.get('/admin', isLoggedIn, function (req, res) {
    //console.dir(req.user);
    res.render('admin.ejs',{username : req.user.username, randomKey: req.user.randomKey }  );
});

app.get('/services/admin/allAdminUsers', isLoggedIn, function(req,res){

    accountManager.getAllAdminUsers(req.user.username, req.user.randomKey, function(err, results) {
        if(err) {
            console.error(err);
            res.send(err);
        } else {
            console.info(results);
            res.send(results);
        }

    })
})

app.get('/services/admin/toolIdsByAdminUser/:username', isLoggedIn, function(req,res){

    var selectedUsername = req.params.username;

    permissionManager.getToolIdsFromUsername(req.user.username, req.user.randomKey, selectedUsername, function(err, results) {
        if(err) {
            console.error(err);
            res.send(err);
        } else {
            console.info(results);
            res.send(results);
        }

    })
})

app.get('/queryspots', isLoggedIn, function(req,res){

    res.render('querySpots.ejs',{username : req.user.username, randomKey: req.user.randomKey });
});

app.get('/queryroutes', isLoggedIn, function(req,res){

    res.render('queryRoutes.ejs',{username : req.user.username, randomKey: req.user.randomKey });
});

app.get('/queryoffers', isLoggedIn, function(req,res){

    res.render('queryOffers.ejs',{username : req.user.username, randomKey: req.user.randomKey });
});

app.get('/queryorders', isLoggedIn, function(req,res){

    res.render('queryOrders.ejs',{username : req.user.username, randomKey: req.user.randomKey });
});

app.get('/adminPlaceOrders',isLoggedIn,function(req,res){
    res.render('adminPlaceOrders.ejs',{username : req.user.username, randomKey: req.user.randomKey });
})

app.post('/services/admin/placeOrder',isLoggedIn,function(req,res){
    var username = req.user.username;
    var randomKey = req.user.randomKey;
    var preOrders = req.body.preOrders;

    orderManager.adminPlaceOrder(preOrders.userInfo, preOrders.orderInfo,username,randomKey,function(results){
        console.log(results);
        res.send(results);
    });


})
//Do we really need to expose this to external? Or just within Admin
app.post('/services/orders/cancel', isLoggedIn,function(req,res){
    var orderId = req.body.orderId;
    var username = req.user.username;
    var randomKey = req.user.randomKey;

    orderManager.adminCancelOrder(orderId,username,randomKey,function(err,results){
        if(err){
            console.err(err);
            return;
        }
        res.send("done");
    })
})

app.get('/toolPermission', isLoggedIn, function(req,res){

    res.render('toolPermissionManagement.ejs',{username : req.user.username, randomKey: req.user.randomKey });
});
app.get('/adminUserManagement', isLoggedIn, function(req,res){

    res.render('adminUserManagement.ejs',{username : req.user.username, randomKey: req.user.randomKey });
});

app.get('/services/getConfirmPic',function(req,res){
    var conf = confirmPicGenerator.generateConfirmPic();
    req.session.confirmText = conf[0];
    console.log("text is "+conf[0]);
    res.end(conf[1]);
})
//app.all('/users', isLoggedIn);
app.get('/logout', isLoggedIn, function (req, res) {
    console.log(req.user.username + " logged out.");
    adminUtil.logoutAdminLoginHistory(req.user.username,req.user.randomKey, function(err, results){
        console.info("");//write logout history success
    })
    req.flash('success','登出成功!');
    req.logout();
    res.redirect("/adminLogin");
});

app.post('/adminLogin',
    passport.authenticate('local',
        { successRedirect: '/admin',
            failureRedirect: '/adminLogin',
            failureFlash: true })
);
//Data services for editing the permissions
app.post('/services/admin/editPermissions', isLoggedIn, function(req,res){

    var selectedUsername = req.body.selectedUsername;
    var permissionChanges = req.body.permissionChanges;

    permissionManager.editPermissionsForUser(req.user.username,req.user.randomKey,selectedUsername,permissionChanges, function(err,results){
        if(err) {
            console.error(err);
            res.send(err);
        } else {
            console.info(results);
            res.send(results);
        }
    });

});


app.get('/queryUsers', isLoggedIn, function (req, res) {
    //console.dir(req.user);
    res.render('query_users.ejs',{username : req.user.username, randomKey: req.user.randomKey }  );
});

/*
 app.get('/queryUsersParametersByPhone', isLoggedIn, function (req, res) {
 //console.dir(req.user);
 res.render('query_users.ejs',{username : req.user.username, randomKey: req.user.randomKey }  );
 });


 app.get('/queryUsersParameters', isLoggedIn, function (req, res) {
 //console.dir(req.user);
 res.render('query_user_parameters.ejs',{username : req.user.username, randomKey: req.user.randomKey }  );
 });
 */


app.post('/services/admin/accounts/new',isLoggedIn, function(req,res) {
    var newAccountInfo = req.body.newAccountInfo;

    accountManager.addNewAccount(newAccountInfo,req.user.username,req.user.randomKey, function(err,results){
        if(err) {
            console.error(err);
            res.send(err);
        } else {
            console.info(results);
            res.send(results);
        }
    });

});
app.post('/services/admin/accounts/update',isLoggedIn, function(req,res) {
    var updateAccountInfo = req.body.updateAccountInfo;

    accountManager.updatePasswordForAdminAccount(updateAccountInfo,req.user.username,req.user.randomKey, function(err,results){
        if(err) {
            console.error(err);
            res.send(err);
        } else {
            console.info(results);
            res.send(results);
        }
    });

});
app.post('/services/admin/DeleteSpots/:values', function(req,res) {
   console.info(req);
    var values = req.body.spot_id;
    console.log("Parameter: " + values);

    adminQueryDB.disableRecord(tableNames.spotTable ,'spot_id', values, function(results){

        res.send(results);
    })
});

app.post('/services/admin/accounts/delete',isLoggedIn, function(req,res) {
    var deleteUsername = req.body.deleteUsername;

    accountManager.deleteAccount(deleteUsername,req.user.username,req.user.randomKey, function(err,results){
        if(err) {
            console.error(err);
            res.send(err);
        } else {
            console.info(results);
            res.send(results);
        }
    });

});

http.createServer(app).listen(app.get('port'), function(){
                              console.log('Express server listening on port ' + app.get('port'));
                              });


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.dir(req.user);
        return next();
    }

    res.redirect("/adminLogin");
}
