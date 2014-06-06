function compute_total(){
   
   var subs = $('.subtotal');
    var total = 0;
    for(var i = 0; i <subs.length; i ++ ) {

        if(subs[i].value == "") {

            sub_total = 0;
        }else {

            sub_total =subs[i].value;
        }

        total = total + parseInt(sub_total);

        if(total==0){

            $("#buyButton").attr('disabled','disabled');
        }else {

            $("#buyButton").removeAttr('disabled');
        }
    }
    $('#total').prop('value', total);
}

function init(lineNum){
    var line_Num = lineNum;

    $('.datepicker').datepicker({
        dateFormat: 'yy-mm-dd',
        regional: 'zh-CN'
    });

   var  date = new Date();
   var n = date.getDay();
   var   endDate = new Date();
   endDate.setDate(endDate.getDate() + 14);
   var  startDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();


    $('#date_' + line_Num).datepicker( "option", "minDate",startDate);
    $('#date_' + line_Num).datepicker( "option", "maxDate", endDate);


    $.ajax({url:"/services/getAll/startSpots", success:function(results) {

        var startSpots = results;
        var option = "<option value = \"\">" +  "请选择" + "</option>";

        $(option).appendTo($('#start_' + line_Num));
        for(var startSpotIndex in startSpots) {

          var  startSpot = startSpots[startSpotIndex];


            var option = "<option value = "  +  startSpot.spot_id + ">" +  startSpot.spot_name  + "</option>"

            $(option).appendTo($('#start_' + line_Num));
        }

    }});

   var  start_id = '#start_' + line_Num;
    $(start_id).change(function() {

         id = this.id;
        var curr_lineNum= id.substring(id.indexOf('_') + 1);
        var end_id = '#end_'+ curr_lineNum;
        $(end_id).empty();
        var type_id = '#type_'+ curr_lineNum;
        $(type_id).empty();
		var date_id = "#date_" + curr_lineNum;
		$(date_id).datepicker( "setDate", "" ); 
        var time_id = "#time_" + curr_lineNum;
        $(time_id).empty();

        var option = "<option value =  \"\">" +  "请选择" + "</option>";

        $(option).appendTo($(end_id));

        $.ajax({url:"/services/getAll/routesByStartSpot", success:function(results) {

           var  routes = results;
             startSpot_id = $('#start_' + curr_lineNum).val();

             var route = routes[startSpot_id];
            for( var i=0; i < route.length; i++) {


                var end_spot_name = route[i].to_label;

                var option = "<option value = "  +  route[i].route_id + ">" +  end_spot_name  + "</option>"

                $(option).appendTo($(end_id));

            }

        }});


    });
    var end_id = '#end_' + line_Num;
    $(end_id).change(function(){
        var id = this.id;

        var curr_lineNum= id.substring(id.indexOf('_') + 1);

        var type_id = '#type_'+ curr_lineNum;
        $(type_id).empty();
		var date_id = "#date_" + curr_lineNum;
		$(date_id).datepicker( "setDate", "" ); 
        var time_id = "#time_" + curr_lineNum;
        $(time_id).empty();

        var option = "<option value =  \"\">" +  "请选择" + "</option>";

        $(option).appendTo($(type_id));
        $.ajax({url:"/services/getAll/offersByRoute", success:function(results) {
            var route_id =  $('#end_' + curr_lineNum).val();
             offers = results;
            offer = offers[route_id];
            for (var i =0; i < offer.length;i ++) {


                var s= offer[i].offer_name.indexOf("(");
                var type='只含车票';
                if(s>=0){

                    var e = offer[i].offer_name.indexOf(")");

                    if(e>0) {
                        type =  offer[i].offer_name.substring(s+1,e);

                    }
                }
                var option = "<option value = "  +  i + ">" +  type  + "</option>"

                $(option).appendTo($(type_id));

            }

        }});
    });

    $('.type').change(function(){
        var id = this.id;
        var curr_lineNum = id.substring(id.indexOf("_")+1);
		var date_id = "#date_" + curr_lineNum;
		$(date_id).datepicker( "setDate", "" ); 
        var time_id = "#time_" + curr_lineNum;
        $(time_id).empty();
        var type_id = "#" + id;
        var price = offer[$(type_id).val()].offer_price;
        var price_id = "#price_" + curr_lineNum;
        $(price_id).attr("value",price );

		var amount_id = "#amount_" + curr_lineNum;
        var num = $(amount_id).val();
        
		var subtotal = price * num;
        var subtotal_id = "#subtotal_" + curr_lineNum;
        $(subtotal_id).attr("value", subtotal);

        compute_total();

    });


 var  date_id = "#date_" +line_Num;
    $(date_id).change(function(){
        var id = this.id;
        var curr_lineNum = id.substring(id.indexOf('_') + 1);
        var time_id = "#time_" + curr_lineNum;
        $(time_id).empty();
        var option = "<option value =  \"\">" +  "请选择" + "</option>";

        $(option).appendTo($(time_id));

        $.ajax({url:"/services/getAll/validSchedules", success:function(results) {
            var end_id = "#end_" + curr_lineNum;
            var route_id = $(end_id).val();
            var schedules = results;
            var schedule = schedules[route_id];
            var date_id = "#date_" + curr_lineNum;


            for (var i =0; i < schedule.length;i ++) {

                if( schedule[i].schedule_date == null || (schedule[i].schedule_date == $(date_id).val())){					
                    var option = "<option value = "  +  schedule[i].schedule_id + ">" +  schedule[i].departure_time  + "</option>"

                    $(option).appendTo($(time_id));
                }
            }
        }});

    });

    $( ".amount" ).change(function() {
        var id = this.id;
        var curr_lineNum = id.substring(id.indexOf("_")+1);

        var num = $(this).val();
		if (num >= 10)
		{
			$(this).val(1);
			alert ("请打电话订购10张或更多的票.");			
			return; 
		}

        var price_id = "#price_" + curr_lineNum;
        var price = $(price_id).val();
        var subtotal = price * num;
        var subtotal_id = "#subtotal_" + curr_lineNum;
        $(subtotal_id).attr("value", subtotal);

        compute_total();

    });



}

/***
 * Customize the validation process and warning style for the buyTicket form
 * @xitu
 * @returns {boolean}
 */
function validateBuyTicketForm() {
    var reporter = new MessageReporter("validationReporter");

    for(var i=1; i<=lineNum; ++i) {
        $('#start_'+i).css({border:"none"});
        $('#end_'+i).css({border:"none"});
        $('#type_'+i).css({border:"none"});
        $('#date_'+i).css({border:"none"});
        $('#time_'+i).css({border:"none"});
        $('#amount_'+i).css({border:"none"});

        var start = $('#start_'+i).val();
        if(start == "") {
            $('#start_'+i).css({border:"2px solid red"});
            reporter.errorStatus("请选择第"+i+"行的出发地.");
            reporter.render();
            return false;
        }
        var end = $('#end_'+i).val();
        if(end == "") {
            $('#end_'+i).css({border:"2px solid red"});
            reporter.errorStatus("请选择第"+i+"行的行程景点.");
            reporter.render();
            return false;
        }
        var type = $('#type_'+i).val();
        if(type == "") {
            $('#type_'+i).css({border:"2px solid red"});
            reporter.errorStatus("请选择第"+i+"行的票的种类.");
            reporter.render();
            return false;
        }
        var date = $('#date_'+i).val();
		var validDateFormat=/^\d{4}-\d{2}-\d{2}$/
        if(!validDateFormat.test(date)) {
            $('#date_'+i).css({border:"2px solid red"});
            reporter.errorStatus("请输入第"+i+"行的正确的日期格式 (YYYY-MM-DD)");
            reporter.render();
            return false;
        }
        var time = $('#time_'+i).val();
        if(time == "") {
            $('#time_'+i).css({border:"2px solid red"});
            reporter.errorStatus("请选择第"+i+"行的出发时间.");
            reporter.render();
            return false;
        }
        var number = $('#amount_'+i).val();
        if(!/^\d+$/.test(number) ) {
            $('#amount_'+i).css({border:"2px solid red"});
            reporter.errorStatus("第"+i+"行的人数必须是大于0的整数.");
            reporter.render();
            return false;
        }
    }
    return true;
}

$("#buyButton").click(function() {
    var reporter = new MessageReporter("validationReporter");
    reporter.clear();
    if(!validateBuyTicketForm()) {
       return;
    }
    var picked_offers = [];
    var picked_routes=[];
    var picked_schedules = [];
    var start = $('.start option:selected');
    var end  = $('.end option:selected');
    var type = $('.type option:selected');

    var date = $('.datepicker');
    var time = $('.time option:selected');
    var amount= $('.amount');

    var price = $('.price');
    var subtotal= $('.subtotal');
    var total = $('.total');

    var orders_picked = [];
    for(var i = 0; i < start.length;i ++){
		if (subtotal[i].value == 0 || time[i].value == 0) return;		
        var order = { "cell" : [start[i].text, end[i].text, type[i].text, date[i].value, time[i].text, amount[i].value, price[i].value, subtotal[i].value ]};
        orders_picked.push(order);
    }
    
	var order_total = {"cell": [' ',' ',' ',' ',' ',' ','合计',total.val()]};


    orders_picked.push(order_total);



   var orderlist= {"rows" : orders_picked};

    for(var i =0; i < end.length; i ++ ) {

        var route = end[i].value;
        var offer = offers[route];
        var schedule_id = time[i].value;
        var type_val = type[i].value;
        var offer_id = offer[type_val].offer_id;
        var route_id = offer[type_val].route_id;
        picked_offers.push(offer_id);
        picked_routes.push(route_id);
        picked_schedules.push(schedule_id);

    }

    orderlist.offers = picked_offers;
    orderlist.routes = picked_routes;
    orderlist.schedules = picked_schedules;

     orderlist.total_amount=total.val();
    //var total = { "total" : total[0].value}
    //orders.push(total);

     $.post('/orders', {"orderlist" : orderlist},  function(data){

        window.location.href="/orderReview";
     });



 });
 
 $("#addButton").click(function(){
	 if (lineNum > 4)
	 {
	    alert ("网购只允许一次订购五种或以下的票");
		return;
	 }
     lineNum ++;

     var start_id =   'start_' + lineNum ;

     var end_id = 'end_' + lineNum;

     var type_id = 'type_' + lineNum;
     var date_id = 'date_' + lineNum;
     var time_id = 'time_' + lineNum;
     var amount_id = 'amount_' + lineNum;
     var price_id = 'price_' + lineNum;
     var subtotal_id = 'subtotal_' + lineNum;

  $("#buyTicket").append("<div class=\"row-fluid order new\" >" +
    " <div  class=\"span2\"><bold>出发地：</bold><select id=\"" +start_id + "\" class=\"start\" style=\"width:140px;\"></select></div>"
     +  " <div  class=\"span2\"><bold>景点：</bold><select id=\"" +end_id + "\" class=\"end input-small\" style=\"width:140px;\"></select></div>"
     +"<div  class=\"span2\" ><bold>票种：</bold><select id=\"" +type_id + "\" class=\"type input-small\"  style=\"width:140px;\"></select></div>"
     + " <div  class=\"span2\"><bold>日期：<input  id = \"" +date_id + "\"class=\"datepicker input-small\" type=\"text\" style=\"width:120px;\"></input></bold></div>"
     + " <div  class=\"span2\"><bold>时间：</bold><select id = \"" +time_id + "\" class=\"time input-small\" style=\"width:100px;\"></select></div>"
     + " <div  class=\"span1\"><bold>人数：</bold><input id= \"" +amount_id + "\" type=\"text\" class=\"amount input-small\" style=\"width:50px;\" value=\"1\"/></div>"
     + " <div  class=\"span1\"><bold>单价：</bold><input  id = \"" +price_id + "\"  class=\"price input-small\" type=\"text\" readonly value=\"\" style=\"width:50px;\"></input></div>"
     + " <div  class=\"span1\"><bold>总价：</bold><input  id = \"" +subtotal_id + "\"  class=\"subtotal input-small\" type=\"text\" style=\"width:50px;\" readonly value=0></input></div>"

     +   "</div>");

     init(lineNum);
   compute_total();


	
	 $(".del_button").click(function(){
	
         $(this).parent().remove();
		  var total =0;
		var array = $('.subtotal');
		for(var i = 0; i <array.length;i ++) {
		
		total = total + parseInt(array[i].value) ;
		
		}
		$("#total").val(total);
         if($("#total").val()==0){

             $("#buyButton").attr('disabled','disabled');
         }else {

             $("#buyButton").removeAttr('disabled');
         }
     });

	 });
$('#resetButton').click(
    function(){

        $('.well')[0].reset();
        $('.new').remove();
		$("#price_1").attr("value", 0);
		$("#subtotal_1").attr("value", 0);
		$("#end_1").empty();
		$("#type_1").empty();
		$("#time_1").empty();
		lineNum = 1;
        if($("#total").val()==0){
            $("#buyButton").attr('disabled','disabled');
        }else {

            $("#buyButton").removeAttr('disabled');
        }

 }
);




 $( "#count" ).spinner();
function selectCity(index, updateAccordion) {



    if (updateAccordion) {
        $( "#accordion-map" ).accordion("option", "active", index);
    }
    $('#gmap3').gmap3({
        exec: {
            name: "marker",
            all:"true",
            func: function(value){
                // data.object is the google.maps.Marker object
                if (value.data.index === index) {
                    value.object.setIcon("http://maps.google.com/mapfiles/marker_green.png");
                } else {
                    value.object.setIcon("http://maps.google.com/mapfiles/marker.png");
                }
            }
        }
    });
}

 function initMap(data) {

     $( "#accordion-map" ).accordion({
         header: "h3",
         activate: function(event, ui) {
             // index / 2 because of the 2 elements by set (h3 + div)
			      var city = ui.newHeader.index() / 2;
                  var img_src = "../sctravel/images/pic" +  city;

                  $("#boxImage1").attr("src", img_src + "_1.jpg");
                  $("#firstImage").attr("href", img_src + "_1.jpg");
				  $("#firstImage").attr("title", $("#"+ (city+1)).attr("name"));

                  $("#boxImage2").attr("src", img_src + "_2.jpg");
                  $("#secondImage").attr("href", img_src + "_2.jpg");
				  $("#secondImage").attr("title", $("#"+ (city+1)).attr("name"));

                  $("#boxImage3").attr("src", img_src + "_3.jpg");
                  $("#thirdImage").attr("href", img_src + "_3.jpg");
				  $("#thirdImage").attr("title", $("#"+ (city+1)).attr("name"));

                  $("#boxImage4").attr("src", img_src + "_4.jpg");
                  $("#forthImage").attr("href", img_src + "_4.jpg");
				  $("#forthImage").attr("title", $("#"+ (city+1)).attr("name"));

                  $("#boxImage5").attr("src", img_src + "_5.jpg");
                  $("#fifthImage").attr("href", img_src + "_5.jpg");
				  $("#fifthImage").attr("title", $("#"+ (city+1)).attr("name"));

                  $("#boxImage6").attr("src", img_src + "_6.jpg");
                  $("#sixthImage").attr("href", img_src + "_6.jpg");
				  $("#sixthImage").attr("title", $("#"+ (city+1)).attr("name"));
             selectCity(city);
         }
     });

     $('#gmap3').gmap3({
             map:{
                 options:{
                     center:[30.782343,104.054664],
                     zoom: 10
                 }
             },

           marker:{
             values: data || [], // Pass it an empty array if no markers are specified
             options:{
                 draggable: false
            },

           events:{
                   click: function (marker, event, context) {


                       selectCity(context.data.index, true);
                   }
               }
           }
          });

     $("#tabs").tabs({
         activate: function(event, ui) {

             if (ui.newPanel.hasClass("gmap3")) {
                 ui.newPanel.gmap3({trigger: "resize"});
             }
         }
     });



 }

jQuery(function($){
    $.datepicker.regional['zh-CN'] = {
        closeText: '关闭',
        prevText: '<上月',
        nextText: '下月>',
        currentText: '今天',
        monthNames: ['一月','二月','三月','四月','五月','六月',
            '七月','八月','九月','十月','十一月','十二月'],
        monthNamesShort: ['一','二','三','四','五','六',
            '七','八','九','十','十一','十二'],
        dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
        dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
        dayNamesMin: ['日','一','二','三','四','五','六'],
        weekHeader: '周',
        dateFormat: 'yy-mm-dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: '年'};
    $.datepicker.setDefaults($.datepicker.regional['zh-CN']);
});

$(function(){
    //##### Accordion with gmap3 http://127.0.0.1:3000/test
    $('#datepicker').datepicker({
        inline: false
    });


    lineNum = 1;
    $.ajax({url:"/services/getAll/sceneryspots", success:function(results){

        var spots = results;
        var cordinators = [];
        for(var spotIndex in spots) {

            spot = spots[spotIndex];

            var latLng = [];

            latLng.push(spot.longitude);
            latLng.push(spot.latitude);



            var data = { index : (spot.spot_id-1)};

            var cordinator={};

            cordinator.latLng = latLng;
            cordinator.data = data;
            cordinators.push(cordinator);

           var url = "../sctravel/spotDesc/" + spot.spot_id + ".html";

            desc = "<h3 id =" + spot.spot_id + " name='" + spot.spot_name + "'>" + spot.spot_name + "</h3>" + "<div><iframe src="  +  url + " frameborder=\"0\" scrolling=\"auto\" width=\"100%\" height=\"90%\"  ></iframe></div>"

            $('#accordion-map').append(desc);

        }
        initMap(cordinators);
    }});


    init(lineNum);
    // force maps to refresh on show

});

$("#adminBuyButton").click(function() {

    function validateBuyTicketForm() {
        reporter.clear();

        for(var i=1; i<=lineNum; ++i) {
            $('#start_'+i).css({border:"none"});
            $('#end_'+i).css({border:"none"});
            $('#type_'+i).css({border:"none"});
            $('#date_'+i).css({border:"none"});
            $('#time_'+i).css({border:"none"});
            $('#amount_'+i).css({border:"none"});

            var start = $('#start_'+i).val();
            if(start == "") {
                $('#start_'+i).css({border:"2px solid red"});
                reporter.errorStatus("请选择第"+i+"行的出发地.");
                reporter.render();
                return false;
            }
            var end = $('#end_'+i).val();
            if(end == "") {
                $('#end_'+i).css({border:"2px solid red"});
                reporter.errorStatus("请选择第"+i+"行的行程景点.");
                reporter.render();
                return false;
            }
            var type = $('#type_'+i).val();
            if(type == "") {
                $('#type_'+i).css({border:"2px solid red"});
                reporter.errorStatus("请选择第"+i+"行的票的种类.");
                reporter.render();
                return false;
            }
            var date = $('#date_'+i).val();
            var validDateFormat=/^\d{4}-\d{2}-\d{2}$/
            if(!validDateFormat.test(date)) {
                $('#date_'+i).css({border:"2px solid red"});
                reporter.errorStatus("请输入第"+i+"行的正确的日期格式 (YYYY-MM-DD)");
                reporter.render();
                return false;
            }
            var time = $('#time_'+i).val();
            if(time == "") {
                $('#time_'+i).css({border:"2px solid red"});
                reporter.errorStatus("请选择第"+i+"行的出发时间.");
                reporter.render();
                return false;
            }
            var number = $('#amount_'+i).val();
            if(!/^\d+$/.test(number) ) {
                $('#amount_'+i).css({border:"2px solid red"});
                reporter.errorStatus("第"+i+"行的人数必须是大于0的整数.");
                reporter.render();
                return false;
            }
        }
        return true;
    }

    function validateUserInfoForm(){
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
            if (s.length <10 || s.length>15) return false;
            for (var i = 0; i < s.length; i++) {
                var c = s.charAt(i);
                if ((c > '9') ||  (c <'0')) {
                    return false;
                }
            }
            return true;
        }

        reporter.clear();
        var customerName = $('#name').val();
        var mobilePhone = $('#phone').val();
        var email = $('#email').val();


        if(isblank(customerName))
        {
            $('#amount_'+i).css({border:"2px solid red"});
            reporter.errorStatus("请输入您的姓名");
            reporter.render();

            return false;
        }
        if(!validatePhone(mobilePhone))
        {
            reporter.errorStatus("请输入您的手机号码");
            reporter.render();

            return false;
        }
        if(!validateEmail(email))
        {
            reporter.errorStatus("请输入您的电子邮件信箱");
            reporter.render();

            return false;
        }


        return true;
    }
    var reporter = new MessageReporter("adminOrderReporter");

    reporter.clear();
    if(!validateBuyTicketForm() || !validateUserInfoForm()) {
        return;
    }

    var customerName = $('#name').val();
    var mobilePhone = $('#phone').val();
    var email = $('#email').val();

    var userInfo = {};
    userInfo.customerName = $('#name').val();
    userInfo.mobilePhone = $('#phone').val();
    userInfo.email = $('#email').val();

    var orderInfo = {};
    orderInfo.vouchersArray=[];
    orderInfo.totalAmount=$('.total').val();

    var start = $('.start option:selected');
    var end  = $('.end option:selected');
    var type = $('.type option:selected');

    var date = $('.datepicker');
    var time = $('.time option:selected');
    var amount= $('.amount');

    var price = $('.price');
    var subtotal= $('.subtotal');



    for(var i =0; i < end.length; i ++ ) {
        var voucher = {};

        var route = end[i].value;
        var offer = offers[route]; //global variable in calmap.js
        var schedule_id = time[i].value;
        var type_val = type[i].value;
        var offer_id = offer[type_val].offer_id;
        var route_id = offer[type_val].route_id;

        voucher.offerId    =  offer_id;
        voucher.skuId      =  route_id;
        voucher.scheduleId = schedule_id;
        voucher.quantity   =  amount[i].value;
        voucher.validDate  = date[i].value;
        voucher.offerSubtotalAmount = subtotal[i].value;

        orderInfo.vouchersArray.push(voucher);

    }
    var orders={};
    orders.userInfo = userInfo;
    orders.orderInfo = orderInfo;

    console.dir(orders);
    if(orderInfo.vouchersArray.length<1) {
        reporter.errorStatus("订单内容为空，请重试.");
        reporter.render();
        return;
    }


    $.post('/services/admin/placeOrder', {"preOrders" : orders},  function(data){
        console.log("admin place order finished");
        console.dir(data);
        if(data.isSuccess==true){
            reporter.successStatus("恭喜您成功下了一个订单. 确认码为："+data.confirmCode);
            reporter.render();
        } else {
            reporter.errorStatus("下订单失败，请联系管理员.");
            reporter.render();
        }

        $('#name').val("");
        $('#phone').val("");
        $('#email').val("");

    });
});