
//去除空格
String.prototype.trim = function () { return this.replace(/(^\s*)|(\s*$)/g, ""); };
String.prototype.lTrim = function () { return this.replace(/(^\s*)/g, ""); };
String.prototype.rTrim = function () { return this.replace(/(\s*$)/g, ""); };

//实现String.format;
String.format = function ()
{
    if (arguments.length == 0)
        return null;

    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++)
    {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }

    return str;
};

//公用静态类。
var SmartTrip = {};
SmartTrip.Util = {};

//封装一般的ajax请求
SmartTrip.Util.ajax = function (para)
{
    para = $.extend({type:'post'}, para);
    SmartTrip.Util.ajaxSubmit(null, para);
};

SmartTrip.Util.ajaxSubmit = function (form, params)
{
    var objParams = { dataType: "json", beforeSend: function (XMLHttpRequest) { XMLHttpRequest.setRequestHeader("isAjax", "true"); } };
    if (typeof params == 'function')
        params = { success: params };
    else if (typeof params != 'object')
        params = { success: params };

    if (!params.success)
        params.success = function () { }

    objParams = $.extend(objParams, params, { success: function (d, s, jqXHR)
    {
        //处理登录超时
        if (d!=null && d.HasException == true && d.Value == "AjaxRequestLoginTimeout")
        {
            alert("登录超时，请重新登录");
            window.top.location.href = d.Tag + "?action=LoginOut";
        }
        else
        {
            params.success.apply(this, [d, s, jqXHR]);
        }
    }
    });
    if (form == null)
        $.ajax(objParams);
    else
        $(form).ajaxSubmit(objParams);
}



SmartTrip.Util.startsWith = function (str, prefix, start, end)
{
    if (arguments.length < 2)
    {
        throw new TypeError('SmartTrip.Util.startsWith() requires at least 2 arguments');
    }

    // check if start and end are null/undefined or a 'number'
    if ((start == null) || (isNaN(new Number(start))))
    {
        start = 0;
    }
    if ((end == null) || (isNaN(new Number(end))))
    {
        end = Number.MAX_VALUE;
    }

    // if it's an array
    if (typeof prefix == "object")
    {
        for (var i = 0, j = prefix.length; i < j; i++)
        {
            var res = SmartTrip.Util._stringTailMatch(str, prefix[i], start, end, true);
            if (res)
            {
                return true;
            }
        }
        return false;
    }

    return SmartTrip.Util._stringTailMatch(str, prefix, start, end, true);
};

SmartTrip.Util.endsWith = function (str, suffix, start, end)
{
    if (arguments.length < 2)
    {
        throw new TypeError('SmartTrip.Util.endsWith() requires at least 2 arguments');
    }

    // check if start and end are null/undefined or a 'number'
    if ((start == null) || (isNaN(new Number(start))))
    {
        start = 0;
    }
    if ((end == null) || (isNaN(new Number(end))))
    {
        end = Number.MAX_VALUE;
    }

    // if it's an array
    if (typeof suffix == "object")
    {
        for (var i = 0, j = suffix.length; i < j; i++)
        {
            var res = SmartTrip.Util._stringTailMatch(str, suffix[i], start, end, false);
            if (res)
            {
                return true;
            }
        }
        return false;
    }

    return SmartTrip.Util._stringTailMatch(str, suffix, start, end, false);
};

SmartTrip.Util.loadCss = function (cssFile)
{
    ///	<summary>
    ///	  动态加载CSS文件
    ///	</summary>
    var head = document.getElementsByTagName('HEAD').item(0);
    var style = document.createElement('link');
    style.href = cssFile;
    style.rel = 'stylesheet';
    style.type = 'text/css';
    head.appendChild(style);
};

/**
* 显示Loading遮罩
*/
SmartTrip.Util.showLoading = function (maskArea)
{
    if (maskArea != undefined)
    {
        $(maskArea).mask("loading");
    } else
    {
        $(".content").mask("loading");
    }
};

/**
* 隐藏Loading遮罩
*/
SmartTrip.Util.removeLoading = function (maskArea)
{
    if (maskArea != undefined)
    {
        $(maskArea).unmask();
    } else
    {
        $(".content").unmask();
    }
}


/**
* 查询相关功能辅助
*/
SmartTrip.QueryUtil = {
    lastKeywordPressTime: new Date(),

    /**
    * 初始化分页
    */
    initPager: function () {
        var pageIndex = $("#hdfPageIndex").val();
        var pageSize = $("#hdfPageSize").val();
        var recordCount = $("#hdfRecordCount").val();
        $(".pager").pager({
            pageIndex: pageIndex,
            pageSize: pageSize,
            recordCount: recordCount,
            pageIndexChanged: function (pageIndex, pageSize) {
                $("#hdfPageIndex").val(pageIndex);
                $("#hdfPageSize").val(pageSize);

                query();
            }
        });
    },

    /**
    * 显示列表数据状态
    */
    resetRecordsRange: function (recordCount) {
        var pageRange = $("#hdfPageIndex").val() * $("#hdfPageSize").val();

        if (pageRange > recordCount)
            pageRange = recordCount;

        var rangeStart = ($("#hdfPageIndex").val() - 1) * $("#hdfPageSize").val() + 1;
        if (parseInt(rangeStart) <= 0)
            rangeStart = 1;
        //pageRange = rangeStart + " - " + pageRange;
        //$("#statusRecordsCount").html(recordCount);
        //$("#statusRecordsRange").html(pageRange);
        //$('.pagerRemark').text(String.format('共{0}条记录，显示从{1}到{2}', recordCount, rangeStart, pageRange));
        $('.pagerRemark').text(String.format('共{0}条记录', recordCount, rangeStart, pageRange));
    },

    /**
    * 绑定每页显示N条记录的Select框事件
    */
    bindPageSizeChangeEvent: function () {
        $("#pageSizeChange").change(function () {
            $('#hdfPageIndex').val('1');
            $("#hdfPageSize").val($(this).val());
            query();
        });
    },

    /**
    * 排序
    */
    sortOrder: function () {
        var orderBy = $(this).attr('sort-expression');
        var existingOrderBy = $('#hdfOrderBy').val();
        var isAsc = 'True';
        if (orderBy == existingOrderBy) {
            if ($('#hdfIsAsc').val() == 'False')
                isAsc = 'True';
            else
                isAsc = 'False';
        }

        //重置查询参数
        $('#hdfPageIndex').val('1');
        $('#hdfOrderBy').val(orderBy);
        $('#hdfIsAsc').val(isAsc);

        query();
    },

    updateSortStatus: function () {
        $('.sort-up').removeClass('active');
        $('.sort-down').removeClass('active');
        var orderBy = $('#hdfOrderBy').val();
        var isAsc = $('#hdfIsAsc').val();

        if (isAsc == 'True')
            $('a[sort-expression="' + orderBy + '"]').parent().find('.sort-up').addClass('active');
        else
            $('a[sort-expression="' + orderBy + '"]').parent().find('.sort-down').addClass('active');
    },

    /**
    * 绑定搜索框事件
    */
    bindSearchEvent: function (btnSearch)
    {
        $(btnSearch).bind('click', function ()
        {
            $("#hdfPageIndex").val("1");
            if (typeof (query) == 'function')
                query();
        });
    }
    
};

SmartTrip.Location = {};
SmartTrip.Location.ReLoad = function() {
    if (/\?/.test(window.location.href))
        window.location.href = window.location.href + "&_" + Math.random();
    else
        window.location.href = window.location.href + "?_" + Math.random();
};


SmartTrip.Cookies = {};
SmartTrip.Cookies.setCookie = function (name, value, time) {
    var days = 30;
    var exp = new Date();
    var t;
    if (time) {
        t = exp.getTime() + time;
    }
    else {
        t = exp.getTime() + days * 24 * 60 * 60 * 1000;
    }
    exp.setTime(t);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
};

SmartTrip.Cookies.getCookie = function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return (arr[2]);
    else
        return null;
};

SmartTrip.Cookies.delCookie = function (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = SmartTrip.Cookies.getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};

SmartTrip.Common = {};
SmartTrip.Common.formatCurrency = function(num) {
    var s = num + '';
    if (/[^0-9\.\-]/.test(s)) return "invalid value";
    s = s.replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(s))
        s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    return "￥" + s.replace(/^\./, "0.");
};

// 判断完毕后加载样式
function setActiveStyleSheet(filename) {
    if (location.href.indexOf("ClientType") < 0) {
        if (location.href.indexOf("?") < 0)
            location.href = location.href + "?ClientType=" + filename;
        else
            location.href = location.href + "&ClientType=" + filename;
    }
}

function checkClientType() {
    // 判断是否为移动端运行环境
    if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
        if (window.location.href.indexOf("?mobile") < 0) {
            try {
                if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                    // 判断访问环境是 Android|webOS|iPhone|iPod|BlackBerry 则加载以下样式
                    setActiveStyleSheet("Mobile");
                } else if (/iPad/i.test(navigator.userAgent)) {
                    // 判断访问环境是 iPad 则加载以下样式
                    setActiveStyleSheet("MobileIPad");
                } else {
                    // 判断访问环境是 其他移动设备 则加载以下样式
                    setActiveStyleSheet("MobileOther");
                }
            } catch(e) {
            }
        }
    } else {
        // 如果以上都不是，则加载以下样式
        setActiveStyleSheet("Computer");
    }
}

////Array.forEach implementation for IE support..
////https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
//if (!Array.prototype.forEach) {
//    Array.prototype.forEach = function (callback, thisArg) {
//        var T, k;
//        if (this == null) {
//            throw new TypeError(" this is null or not defined");
//        }
//        var O = Object(this);
//        var len = O.length >>> 0; // Hack to convert O.length to a UInt32
//        if ({}.toString.call(callback) != "[object Function]") {
//            throw new TypeError(callback + " is not a function");
//        }
//        if (thisArg) {
//            T = thisArg;
//        }
//        k = 0;
//        while (k < len) {
//            var kValue;
//            if (k in O) {
//                kValue = O[k];
//                callback.call(T, kValue, k, O);
//            }
//            k++;
//        }
//    };
//}



function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

jQuery.validator.addMethod("equalValue", function (value, element) {
    return this.optional(element) || element._value != value;
}, "请正确填写电话号码");

jQuery.validator.addMethod("password", function (value, element) {
    return this.optional(element) || value.match(/^[A-Za-z0-9_]*$/);
}, "密码只能是包含字母数字和下划线");

jQuery.validator.addMethod("mobile", function (value, element) {
    var length = value.length;
    var mobile = /^1\d{10,10}$/;
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "手机号码格式错误");

jQuery.validator.addMethod("phone", function (value, element) {
    var tel = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
    var mobile = /^1\d{10,10}$/;
    return this.optional(element) || tel.test(value) || mobile.test(value);
}, "电话号码格式错误");

jQuery.validator.addMethod("isIdCardNo", function (value, element) {
    return this.optional(element) || isIdCardNo(value);
}, "请正确输入您的身份证号码");

function isIdCardNo(num) {
    var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
    var parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
    var varArray = new Array();
    var lngProduct = 0;
    var intCheckDigit;
    var intStrLen = num.length;
    var idNumber = num;
    // initialize
    if (intStrLen != 18) {
        return false;
    }
    // check and set value
    for (i = 0; i < intStrLen; i++) {
        varArray[i] = idNumber.charAt(i);
        if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
            return false;
        } else if (i < 17) {
            varArray[i] = varArray[i] * factorArr[i];
        }
    }
    if (intStrLen == 18) {
        //check date
        var date8 = idNumber.substring(6, 14);
        if (isDate8(date8) == false) {
            return false;
        }
        // calculate the sum of the products
        for (i = 0; i < 17; i++) {
            lngProduct = lngProduct + varArray[i];
        }
        // calculate the check digit
        intCheckDigit = parityBit[lngProduct % 11];
        // check last digit
        if (varArray[17] != intCheckDigit) {
            return false;
        }
    }
    else {        //length is 15
        //check date
        var date6 = idNumber.substring(6, 12);
        if (isDate6(date6) == false) {
            return false;
        }
    }
    return true;
}

Date.prototype.format = function (formatter) {
    if (!formatter || formatter == "") {
        formatter = "yyyy-MM-dd";
    }
    var year = this.getFullYear().toString();
    var month = (this.getMonth() + 1).toString();
    var day = this.getDate().toString();
    var yearMarker = formatter.replace(/[^y|Y]/g, '');
    if (yearMarker.length == 2) {
        year = year.substring(2, 4);
    }
    var monthMarker = formatter.replace(/[^m|M]/g, '');
    if (monthMarker.length > 1) {
        if (month.length == 1) {
            month = "0" + month;
        }
    }
    var dayMarker = formatter.replace(/[^d]/g, '');
    if (dayMarker.length > 1) {
        if (day.length == 1) {
            day = "0" + day;
        }
    }
    return formatter.replace(yearMarker, year).replace(monthMarker, month).replace(dayMarker, day);
};


SmartTrip.Common.sumColumn = function() {
    var arg = arguments;
    var arr = new Array();
    var pix = new Array();
    var j;
    for (j = 0; j < 100; j++) {
        arr[j] = 0;
        pix[j] = "";
    }
    $("tbody.content tr").each(function() {
        $(this).find("td").each(function(index) {
            for (var i = 0; i < arg.length; i++) {
                if (index == arg[i]) {
                    var isC = ($(this).html().indexOf("￥") >= 0) || ($(this).html().indexOf("¥")>=0);
                    var isD = $(this).html().indexOf(".") > 0;
                    if (isC) {
                        pix[index] = "￥";
                    }

                    var num = $(this).html();
                    
                    if (isD) {
                        arr[arg[i]] = toDecimal2(parseFloat(arr[arg[i]]) + parseFloat(num.replace(/\,/g, "").match(/\d+\.\d+/g)));
                    } else {
                        arr[arg[i]] = parseInt(arr[arg[i]]) + parseInt(num.replace(/\,/g, "").match((/\d+/g)));
                    }
                }
            }
        });
    });

    for (j = 0; j < arg.length; j++) {
        $("tfoot td").each(function(index) {
            if (index == arg[j]) {
                $(this).html( pix[arg[j]] ==""?arr[arg[j]]: SmartTrip.Common.formatCurrency(arr[arg[j]]));
            }
        });
    }
};

SmartTrip.Common.setCellValue = function (jsonString) {
    try {
        var json = $.parseJSON(jsonString);
        $("tfoot tr td[cellName]").each(function () {
            var v = eval("json." + $(this).attr("cellName"));
            if (v != undefined)
                $(this).html(v);
        });
    }
    catch (err) {
        $(this).html("");
    }
};

SmartTrip.Common.getParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
};

function showFavoritesDialog(id) {
    $("#favorites-dialog").show();
    $("#favorites-dialog").dialog({
        title: "添加收藏",
        autoOpen: false,
        modal: true,
        height: 200,
        width: 600,
        resizable: false,
        draggable: true,
        open: function () {
            $("#framefavoritesDialog").attr("src", "/mall/savefavoritesdialog?pid=" + id+"&type=1");
        }
    });
    $("#favorites-dialog").dialog("open");
}

function closeFavoritesDialog() {
    $("#favorites-dialog").dialog("close");
}
