class Banner{
    constructor(selector,bannerList){
        this.selector = selector;
        this.length = bannerList.length
        this.index = 0
        this.timer = null
        this.setBanner(bannerList)
        this.setDots()
    }
    setBanner(bannerList){
        var images = ""
        var dots = ""
        bannerList.forEach( (list,index )=> {
            images += 
            "<a href='"+list.link+"' class='banner-slide"+(index==0?" banner-pagination-bullet-active":"")+"' "+(index==0?"style='opacity:1'":"")+">"+
                "<img alt='banner' class='banner-img' src='"+list.image+"?x-oss-process=image/resize,w_1220'>"+
            "</a>";
            dots += "<span class='banner-pagination-bullet'></span>"
        });
        var bannerContainer = 
                "<div class='banner-container'>"+
                    "<div class='banner-wrapper'>"+
                        images+
                    "</div>"+
                    "<div class='banner-pagination'>"+
                        dots+
                    "</div>"+
                "</div>"
        $(".banner").append(bannerContainer)
    }
    setDots(){
        var _this = this;
        $(".banner-pagination").on('click',function(e){
            var evt = window.event || e;
            _this.index = $(evt.target).index()
            _this.goto(_this.index);
        })
    }
    goto(index){
        index = index%this.length
        $(this.selector+" .banner-wrapper").children().eq(index)
            .css({opacity:1})
            .siblings().css({opacity:0})
        $(this.selector+" .banner-pagination").children().eq(index)
            .addClass("banner-pagination-bullet-active")
            .siblings().removeClass("banner-pagination-bullet-active")
        this.autoplay();
    }
    autoplay(){
        clearInterval(this.timer)
        var _this = this
        _this.timer = setInterval(() => {
            _this.index = (_this.index+1)%_this.length;
            _this.goto(_this.index)
        }, 2500);
    }
}
class HomeActivities{
    constructor(activitiesList){
        this.activitiesList = activitiesList;
        this.setActivities()
    }
    setActivities(){
        var activities = ""
        this.activitiesList.forEach(list => {
            activities += 
                "<figure class='advertise'>"+
                    "<img src='"+list.image+"'>"+
                    "<a href='"+list.link+"' class='ad-click-mask'></a>"+
                "</figure>"
        });
        $(".activities-wrap").append(activities);
    }
}
class CommonSpuList {
    constructor(dataList,isRefresh=true) {
        this.dataList = dataList;
        this.isRefresh = isRefresh;
        this.setAll()
        this.setHoverColor()
    }
    getItem(sku,index){
        var color = ""
        if (sku.spu.sku_info.length > 1) {
            var colorId = "";
            sku.spu.sku_info.forEach((list,index) => {
                
                if(colorId != list.color_id){
                    var img =""
                    list.spec_json.forEach(ele =>{
                        if(ele.image!=""){
                            img = ele.image
                        }
                    })
                    color +=
                    "<figure  class = 'outer "+(index==0?"active":"")+"'  color-index='"+index+"'>"+
                        "<img src = '"+img+"?x-oss-process=image/resize,w_20'>"+
                    "</figure>"
                }
                colorId = list.color_id;
            });
        }
        var item =
            "<section  class='spu-item-normal-box' index='"+ index +"'>" +
                "<figure class='item-cover'>" +
                    "<img src='" + sku.spu.sku_info[0].ali_image + "?x-oss-process=image/resize,w_216'>" +
                "</figure>" +
                "<article>" +
                    "<h3>" + sku.spu.sku_info[0].title + "</h3>" +
                    "<h5 class='txt-product-title'>" + sku.spu.sku_info[0].sub_title + "</h5>" +
                "</article>" +
                "<aside class='item-attr-colors'>" +
                    color+
                "</aside>" +
                "<article class='item-price'>" +
                    "<span>¥ " + (sku.spu.price - sku.spu.after_sell_info.ship_price) + "</span>" +
                    "<span class='orignal-price'>" + sku.spu.sku_info[0].price + "</span>" +
                "</article>" +
            "<div class='activity-tag'>" +
            (sku.spu.sale_status == 3 ? "" : "<span class='yellow'>直降</span>" ) +
            "</div>" +
            "<div class='markup-tag'></div>" +
            "</section>"
        return item;
    }
    setAll(fatherSelector){
        var all = ""
        this.dataList.forEach((list,index) => {
            all += this.getItem(list,index);
        });
        if(this.isRefresh) $('.category-list').empty();
        $(fatherSelector).append(all);
    }
    getAll(){
        var all = ""
        this.dataList.forEach((list,index) => {
            all += this.getItem(list,index);
        });
        if(this.isRefresh) $('.category-list').empty();
        return all
    }
    setHoverColor(fatherSelector){
        var _this = this
        $(fatherSelector+" .item-attr-colors figure").on("mouseenter",function(e){
            var evt = window.event || e;
            var colorIndex = $(evt.target).attr("color-index");
            var index = $(this).parent().parent().attr("index")
            var thisTitle =  
                "<h3>" + _this.dataList[index].spu.sku_info[colorIndex].title + "</h3>" +
                "<h5 class='txt-product-title'>" + _this.dataList[index].spu.sku_info[0].sub_title + "</h5>" ;
            var thisImage = 
                "<img src='" + _this.dataList[index].spu.sku_info[colorIndex].ali_image + "?x-oss-process=image/resize,w_216'>" 
            var thisPrice =
                "<span>¥ " + (_this.dataList[index].spu.sku_info[colorIndex].price - _this.dataList[index].spu.after_sell_info.ship_price) + "</span>" +
                "<span class='orignal-price'>" + _this.dataList[index].spu.sku_info[colorIndex].price + "</span>"
            $(this).parent()
                .prev().empty().append(thisTitle)
                .prev().empty().append(thisImage)
            $(this).parent()
                .next().empty().append(thisPrice)
            $(this).addClass("active").siblings().removeClass("active")
        })
    }
}


class IndexFLoor{
    constructor(floorData){
        this.floorData = floorData;
    }
    getAdvertise(advertise){
        var adv = 
            "<figure class='advertise flex-2in4'>"+
                "<img src='"+advertise.image+"?x-oss-process=image/resize,w_600' alt='广告位图片'>"+
                "<a href='"+advertise.link+"' class='ad-click-mask'></a>"+
            "</figure>"
        return adv
    }
    setAll(){
        this.floorData.forEach( (floor,index) => {
            var skuList = new CommonSpuList(floor.tabs[0].tab_items.slice(1),false)
            var floor = 
                "<div id='floor"+index+"'>"+
                    "<section class='common-normal-box'>"+
                        "<header class='d-flex justify-content-between'>"+
                            "<h5>"+floor.title+"</h5>"+
                        "</header>"+
                        "<aside class='common-flex-box multi-line flex-four'>"+
                            this.getAdvertise(floor.tabs[0].tab_items[0])+
                            skuList.getAll()
                        "</aside>"+
                    "</section>"+
                "</div>"
            

            $(".home-wrap").append(floor);
            skuList.setHoverColor("#floor"+index)
            
        });
    }
    

}




function _3dHover( selector ){
    var h = $(selector).height();
    var w = $(selector).width();
    $(".banner").on('mousemove',function(e){
        var evt = window.event || e;
        $(selector).css({
            transition:"none",
            transform: "rotateX("+-(evt.offsetY-h/2)/h+"deg) rotateY("+(evt.offsetX-w/2)/w+"deg)",
            boxShadow: -(evt.offsetX-w/2)/w*20+"px "+-(evt.offsetY-h/2)/h*20+"px 10px 0 rgba(0,0,0,0.2)"
        })
    })
    $(".banner").on('mouseleave',function(e){
        var evt = window.event || e;
        $(selector).css({
            transition: "0.15s ease-in-out",
            transform: "rotateX(0deg) rotateY(0deg)",
            boxShadow:  "0 0 10px 0px rgba(0,0,0,0.2)"
        })
    })
}


$.ajax({
    url: "/home/product/home",
    dataType: "json",
    success: function (response) {
        var banner = new Banner(".banner",response.data.home_carousel)
        banner.autoplay()
        var activities = new HomeActivities(response.data.home_activities)
        var homeHot = new CommonSpuList(response.data.home_hot)
        homeHot.setAll(".home-hot-list")
        homeHot.setHoverColor(".home-hot-list")
        var floors = new IndexFLoor(response.data.home_floors)
        floors.setAll()
        // _3dHover(".banner-container");
    }
});