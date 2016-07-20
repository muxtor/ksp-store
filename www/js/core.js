/**
 * Created by Ulugbek on 08.02.16.
 */
$('.to-store').click(function(){
    title = $(this).attr('data-title');
    image = $(this).attr('data-img');
    mon = $(this).attr('data-mon');
    fri = $(this).attr('data-fri');
    phone = $(this).attr('data-phone');
    city = $(this).attr('data-city');
    lon = $(this).attr('data-lon');
    lat = $(this).attr('data-lat');
    $('.store-img').attr('src',image);
    $('.store-title').text(title);
    $('.store-mon').text(mon);
    $('.store-fri').text(fri);
    $('.store .dostavka button a').attr('href','waze://?ll='+lon+','+lat+'&navigate=yes');
    $('.store .call button a').attr('href','tel:'+phone+'');
    $('.stories').hide();
    $('.store').show();
    return false;
})

function $_GET(key) {
    var s = window.location.search;
    s = s.match(new RegExp(key + '=([^&=]+)'));
    return s ? s[1] : false;
}
function showLoader(){
    $('.preloader').fadeIn();
}
function hideLoader(){
    $('.preloader').fadeOut();
}

$(document).ready(function(){
    //index search products
    $('.search-cnt form').submit(function(){
        if($('.search-txt').val()!=''){
            showLoader();
            $('.inners').html('');
            $('.inners').append('<div class="title">Searching '+$('.search-txt').val()+'</div>');
            $('.inners').append('<div class="products"></div>');
            $('.inners .products').append('<div class="p-items searching" id="p-items"></div>');
            $.get("http://nadiros.co.il/ksp/wow.php?find="+$('.search-txt').val(),{},search).fail(function() {
                hideLoader();
            });
        }
        return false;
    });
    function search(data)
    {
        var obj = JSON.parse(data);
        if(data=='null'){
            var count = 0;
        }else{
            var count = Object.keys(obj).length;
        }
        if(data!='null'&&count>0){
            /*var transform =[
                //{"tag":"div","class":"products","children":[
                //{"tag":"div","class":"p-items searching","id":"p-items","children":[
                {"tag":"div","class":"p-item","children":[
                    {"tag":"div","class":"p-item-inner","children":[
                        {"tag":"a","id":"${uin}","href":"product.html?uin="+"${uin}","children":[
                            {"tag":"div","class":"p-name","html":"${name}"},
                            {"tag":"div","class":"p-desc","html":"${desc}"},
                            {"tag":"div","class":"p-price","html":"${price} ₪"}
                        ]}
                    ]}
                ]}
                //]}
                //]}

            ];*/
            var transform =[
                {"tag":"div","class":"p-item","children":[
                    {"tag":"div","class":"p-item-inner","children":[
                        {"tag":"a","id":"${uin}","href":"product.html?uin="+"${uin}","children":[
                            {"tag":"div","class":"p-img","children":[
                                {"tag":"img","src":"${img}","alt":"","html":""}
                            ]},
                            {"tag":"div","class":"p-desc","html":"${name}"},
                            {"tag":"div","class":"p-price","html":"${price} ₪"},
                            {"tag":"div","class":"p-buybtn","html":"<img src='img/buynow.png'/>"}
                        ]}
                    ]}
                ]}
            ];
            $('.inners .products #p-items').json2html(data,transform);
            $('.inners #p-items').append('<div class="clearfix clear"></div>');
        }else{
            $('.inners').html('<h2 style="text-align: center; direction: ltr;">Item not found!</h2>');
        }
        hideLoader();
    }

    

});
var cartList = function(storageName) {
    var storage = window.localStorage;
    //When the cookie is saved the items will be a comma seperated string
    var cookie = storage.getItem(storageName);
    //Load the items or a new array if null.
    if(cookie==null){
        var items = new Object();
    }else{
        var items = JSON.parse(cookie);
    }
    //var items = cookie ? cookie : new Array();

    return {
        "add": function(id,val) {
            idme = "id_"+id;
            //Add to the items.
            items[idme]= val;
            storage.removeItem(storageName);
            storage.setItem(storageName, JSON.stringify(items));
            countSet();
        },
        "remove": function (id) {
            idme = "id_"+id;
            var count = 0;
            $.each( items, function( key, value ) {
                count = count + 1;
            });
            if(count==1){
                window.localStorage.clear();
            }else{
                var newItems = new Object();
                $.each( items, function( key, value ) {
                    if(key==idme){

                    }else{
                        newItems[key]= value;
                    }
                });
                storage.removeItem(storageName);
                storage.setItem(storageName, JSON.stringify(newItems));
            }

            countSet();
        },
        "countItem": function(id) {
            idme = "id_"+id;
            //Get all the items.
            if(items[idme]){
                cnt = JSON.parse(items[idme]);
                var countItem = Number(cnt.count)+1;
            }else{
                var countItem =  1 ;
            }
            return countItem;
        },
        "clear": function() {
            items = null;
            //clear the storage.
            storage.removeItem(storageName);
            countSet();
        },
        "items": function() {
            //Get all the items.
            return storage.getItem(storageName);
        },
        "count": function() {
            var count = 0;
            $.each( items, function( key, value ) {
                var element = JSON.parse(value);
                count = count + Number(element.count);
            });
            //Get all the items.
            return count;
        }
    }
}


function total (){
    function getQunty (qtyIndex){
        var qty=1;
        $(".quanty").each(function(indx, element){
            if(indx==qtyIndex) {
                qty = $(element).val();
            }
        });
        return qty;
    }
    var total = parseInt(0);
    $(".cart-priced").each(function(indx, element){
        total = total + (parseInt($(element).val())*parseInt(getQunty(indx)));
    });
    $('.total').text(total+' ₪');
}
function qty(){
    // This button will increment the value
    $('.qty-plus').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($(this).parent().find('input[name='+fieldName+']').val());
        var cartid = $(this).parent().find('.cart-id').val();
        // If is not undefined
        if (!isNaN(currentVal)) {
            if(currentVal<100){
                // Increment
                $(this).parent().find('input[name='+fieldName+']').val(currentVal + 1);
                $('.id_'+cartid).html(currentVal + 1);
            }
        } else {
            // Otherwise put a 0 there
            $(this).parent().find('input[name='+fieldName+']').val(1);
            $('.id_'+cartid).html(1);
        }
        total();
    });
    // This button will decrement the value till 0
    $(".qty-minus").click(function(e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        var cartid = $(this).parent().find('.cart-id').val();
        // Get its current value
        var currentVal = parseInt($(this).parent().find('input[name='+fieldName+']').val());
        // If it isn't undefined or its greater than 0
        if (!isNaN(currentVal) && currentVal > 1) {
            // Decrement one
            $(this).parent().find('input[name='+fieldName+']').val(currentVal - 1);
            $('.id_'+cartid).html(currentVal - 1);
        } else {
            // Otherwise put a 0 there
            $(this).parent().find('input[name='+fieldName+']').val(1);
            $('.id_'+cartid).html(1);
        }
        total();
    });
    countSet();
}
function countSet(){
    var counts = new cartList("cart");
    //console.log(window.localStorage);
    $('#cartitems').html(counts.count());
}
$(document).ready(function(){
    countSet();

    document.addEventListener("deviceready", onOnline, false);

    function onOnline() {

        // Handle the online event
        var networkState = navigator.connection.type;
        if (networkState !== Connection.NONE) {
            //device.uuid;
            $.get("http://nadiros.co.il/ksp/push.php?uuid="+device.uuid,{},toPush);
        }

        function toPush(data) {
            var pushes = JSON.parse(data);
            cnt = Object.keys(pushes).length;
            if(cnt > 0){
                $.each(pushes, function( index, value ) {
                    pushIt(value);
                });
            }
        }

        function pushIt(data) {
            navigator.notification.alert(
                data.push,         // message
                null,                 // callback
                'Notification from KSP',           // title
                'OK'                  // buttonName
            );
            navigator.notification.vibrate(1000);
            navigator.notification.beep(2);
        }

        setTimeout(onOnline,60000);
    }





});