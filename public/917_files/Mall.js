
$(function () {
    initScrollLoading();
    initSearcherRules();
    initWeiBoDropDown();
    initMembershipDropDown();
    initAddFavorites();
    initReturnToTop();

    $(".recommend").each(function (i, item) {
        $(item).find("li").mouseover(function () { $(this).addClass("current3"); }).mouseout(function () { $(this).removeClass("current3"); });
    });
});

function initScrollLoading() {
    //滚动加载图片
    $(".scrollLoading").scrollLoading();
}

function initWeiBoDropDown() {
    //微信我们鼠标浮动
    $("#top_wx_us").mouseenter(function () {
        $("#wx_us_show").show();
    }).mouseleave(function () {
        $("#wx_us_show").hide();
    });
    $("#wx_us_show").mouseenter(function () {
        $(this).show();
    }).mouseleave(function () {
        $(this).hide();
    });
}

function initMembershipDropDown() {
    //会员中心下拉菜单
    $("#myhome a").mouseenter(function () {
        $("#site_top_myhome").show();
    }).mouseleave(function () {
        $("#site_top_myhome").hide();
    });

    $("#site_top_myhome").mouseenter(function () {
        $(this).show();
    }).mouseleave(function () {
        $(this).hide();
    });
}

function initAddFavorites() {
    $("#favorites").click(function () {
        var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL';
        try {
            if (document.all) { //IE类浏览器  
                try {
                    window.external.toString(); //360浏览器不支持window.external，无法收藏  
                    window.alert("国内开发的360浏览器等不支持主动加入收藏。\n您可以尝试通过浏览器菜单栏 或快捷键 ctrl+D 试试。");
                }
                catch (e) {
                    try {
                        window.external.addFavorite(window.location, document.title);
                    }
                    catch (e) {
                        window.external.addToFavoritesBar(window.location, document.title);  //IE8  
                    }
                }
            }
            else if (window.sidebar) { //firfox等浏览器  
                window.sidebar.addPanel(document.title, window.location, "");
            }
            else {
                alert('您可以尝试通过快捷键' + ctrl + ' + D 加入到收藏夹~');
            }
        }
        catch (e) {
            window.alert("添加收藏失败！\n解决办法：您可以尝试通过快捷键" + ctrl + "+ D 加入到收藏夹~");
        }
    });
}

//交换始发与到达地
function btnExchange_Click() {
    var departId = $("#hdfDepartId").val();
    var arriveId = $("#hdfArriveId").val();
    if (departId.length == 0 || arriveId.length == 0)
        return;

    var departName = $("#ddlDepart").val();
    var arriveName = $("#ddlArrive").val();

    $("#hdfDepartId").val(arriveId);
    $("#hdfArriveId").val(departId);
    $("#ddlDepart").val(arriveName);
    $("#ddlArrive").val(departName);
}
function initSearcherRules() {
    $("#busSearchForm").validate({
        errorPlacement: function (error, element) {
            //$(".error_label").append( error) ;
        },
        submitHandler: function (form) {
            SmartTrip.Util.showLoading("#busSearchForm");
            form.submit();
        },
        rules: {
            departName: { required: true },
            arriveName: { required: true }
        },
        messages: {
            departName: { required: "" },
            arriveName: { required: "" }
        }
    });
}
function initReturnToTop() {
    $("#back-to-top").hide();
    //当滚动条的位置处于距顶部100像素以下时，跳转链接出现，否则消失
    $(function () {
        $(window).scroll(function () {
            if ($(window).scrollTop() > 100) {
                $("#back-to-top").fadeIn(100);
            } else {
                $("#back-to-top").fadeOut(100);
            }
        });
        //当点击跳转链接后，回到页面顶部位置
        $("#back-to-top").click(function () {
            $('body,html').animate({ scrollTop: 0 }, 500);
            return false;
        });
    });
}