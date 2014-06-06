function isblank(s) {
	for (var i = 0; i < s.length; i++) {
		var c = s.charAt(i);
		if ((c != ' ') && (c != '\n') && (c != '\t')) return false;
	}
	return true;
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

function validatePhone(s) { 
    if (s.length < 6) return false;
	for (var i = 0; i < s.length; i++) {
		var c = s.charAt(i);
		if ((c > '9') ||  (c < '0')) return false;
	}
	return true;
}

$("#preorder").click(function() {
                     
                     if(orders !==null) {                     
                     
                     var userInfo= {};                     
                     userInfo.customerName = $('#name').val();
                     userInfo.email = $('#email').val();
                     userInfo.mobilePhone = $('#phone').val();
					 if(isblank(userInfo.customerName))
					 {
					    alert ("请输入您的姓名");
						return;
					 }
					 if(!validateEmail(userInfo.email))
					 {
					    alert ("请输入您的电子邮件信箱");
						return;
					 }
					 if(!validatePhone(userInfo.mobilePhone))
					 {
					    alert ("请输入您的手机号码");
						return;
					 }
					 
                     //userInfo.order_total_amount = orders.total_amount;
                     orders.userInfo = userInfo;
                     console.log("userName-"+userInfo.customerName+"; email-"+userInfo.email);
                     $.post('/preorder', {"preorders" : orders},  function(data){
                            console.log("Preorder finished");
                            console.dir(data);
                            if(data.isSuccess==true){
                                //orders=null;
                                //req.session.results = data;
                                window.location.href="/finalOrder";
                             }
                            });
                     }
                
});

$("#pay").click(function() {

    var r=confirm("您即将进入网上银行付款");
    if(r == true) {

        window.location.href="http://www.icbc.com.cn";

    }else {

    }

});

$("#cancel").click(function() {

    var r=confirm("你确定取消吗？");
    if(r == true) {

        window.location.href="/";

    }else {

    }

});


$('#preorder').click(function(){

    var name = $('#name').val();
    var phone = $('#phone').val();
    var email = $('#name').val();

    userInfo = {};
    userInfo.name = name ;
    userInfo.phone = phone;
    userInfo.email = email;



});

$('#paybutton').click(function(){


    console.log("pay to alipay!");

    $.post('/sctravel/alipayto', {"orderInfo" : t.preorders[0]},  function(data){
        console.log("redirect to alipay finished");
        console.dir(data);
    });


});

$(function(){
    orders={};
    $.get( "/orders", function(data) {

             orders = data;
        });


  //  jQuery("#list2").jqGrid('navGrid','#pager2',{edit:false,add:false,del:false});
});
jQuery(document).ready(function(){
    jQuery("#list2").jqGrid({ url:'/orders',
        datatype: "json",
        colNames:['出发地','景点','票种','日期','时间','人数','价格','总价'],
        colModel:[  {name:'start',index:'start',align:'center'},
            {name:'end',index:'end', align:"center"},
            {name:'type', index:'type', align:"center" },
            {name:'date',index:'date', align:"center"},
            {name:'time',index:'time', align:"center"},
            {name:'amount',index:'amount', align:"center"},
            {price:'price',index:'price', align:"center"},
            {name:'subtotal',index:'subtotal', align:"center"}

        ],
         height: 'auto',
        // width: '800px',

         autowidth: true,
         caption:"选购订单"
    });
});
