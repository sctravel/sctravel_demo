$(function () {
    setCurrent();
    //    setTitle();

    //滚动加载图片
    $(".scrollLoading").scrollLoading();

    //倒计时代码
    var end = $("#endTime").val();
    var note = $('#notes');
    var ts1 = new Date();
    var ts2 = new Date(Date.parse(end.replace(/-/g, "/")));
    var t = (ts2 - ts1) + new Date().getTime();
    $('#notes').countdown({
        timestamp: t,
        callback: function (days, hours, minutes, seconds) {
            var message = "";
            message += days + " 天 ";
            message += hours + " 时 ";
            message += minutes + " 分 ";
            message += seconds + " 秒";
            note.html(message);
        }
    });

    //幻灯片代码
    $("#banners").Xslider({
        // 默认配置
        affect: 'fade', //效果 有scrollx|scrolly|fade|none
        speed: 2000, //动画速度
        space: 3000, //时间间隔
        auto: true, //自动滚动
        trigger: 'mouseover', //触发事件 注意用mouseover代替hover
        conbox: '#banner_list', //内容容器id或class
        ctag: 'div', //内容标签 默认为<a>
        switcher: '#banner_li', //切换触发器id或class
        stag: 'div', //切换器标签 默认为a
        current: 'test', //当前切换器样式名称
        rand: false //是否随机指定默认幻灯图片
    });

    /******
    * 导航效果
    */
    var top = $("#bg_detail").offset().top; //获取初始元素位置
    var scroH = $(this).scrollTop(); //获取滚动条的滑动距离
    $(window).bind('scroll', function () {
        var scroH = $(this).scrollTop(); //获取滚动条的滑动距离
        if (scroH >= top) {
            $("#bg_detail").removeClass("bot").addClass("tops");
        } else {
            $("#bg_detail").removeClass("tops").addClass("bot");
        }
    });
    $("#bg_detail > ul > li > a ").each(function (index) {
        $(this).click(function () {
            $("#bg_detail > ul >li > a").removeClass("tg_current");
            $(this).attr("class", "tg_current");
        });
    });


    //历史记录
    //HistoryRecord(products.id);

    //重置分页
    SmartTrip.QueryUtil.initPager();

    //绑定每页显示N条记录的Select框事件
    SmartTrip.QueryUtil.bindPageSizeChangeEvent();

    //显示列表状态
    SmartTrip.QueryUtil.resetRecordsRange(parseInt($('#hdfRecordCount').val()));

    initFilterValue();

    //评论信息
    query();
});


//加载评论
function query() {
    //显示遮罩
    SmartTrip.Util.showLoading();
    var requestData = {
        cache: false,
        pageIndex: $('#hdfPageIndex').val(),
        pageSize: $('#hdfPageSize').val(),
        orderBy: $('#hdfOrderBy').val(),
        isAsc: $('#hdfIsAsc').val(),
        productId: $("#hdfProductId").val()
    };

    SmartTrip.Util.ajax({
        url: "/Mall/GetComments",
        data: requestData,
        success: function (data) {
            if (data.Success) {
                $(".comment_content").html(data.Value);
                $('#hdfRecordCount').val(data.Tag);
                //隐藏遮罩
                SmartTrip.Util.removeLoading();

                //重置分页
                SmartTrip.QueryUtil.initPager();

                //显示列表状态
                SmartTrip.QueryUtil.resetRecordsRange(data.Tag);

                //更新排序状态
                SmartTrip.QueryUtil.updateSortStatus();
            }
            else {
                $.sticky(data.Message, { type: "st-error" });
                //隐藏遮罩
                SmartTrip.Util.removeLoading();
            }
        }
    });
}

//购买门票
function buyTicket(id) {
    if ($("#hdfHasFreeBus").val() == "1") {
        javascript: gotos('fybh'); 
        return false;
    }
    else {
        location.href = '/mall/product?id=' + id;
    }
}

//购买直通车套票
function buyBus(id) {
    location.href = '/mall/busorder?id=' + id;
}

function gotos(id) {
    $("#" + id).ScrollTo(1000);
}

function setCurrent() {
    var pType = $("#hdfProductType").val();
    if (pType) {
        $("#nav_" + pType).attr("class", "current1");
    }
}

//覆写title
function setTitle() {
    document.title = $("#hdfTitle").val();
}