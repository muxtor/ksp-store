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

//This is not production quality, its just demo code.
var cartList = function(cookieName) {
//When the cookie is saved the items will be a comma seperated string
//So we will split the cookie by comma to get the original array
    var cookie = $.cookie(cookieName);
//Load the items or a new array if null.
    var items = cookie ? cookie.split(/,/) : new Array();

//Return a object that we can use to access the array.
//while hiding direct access to the declared items array
//this is called closures see http://www.jibbering.com/faq/faq_notes/closures.html
    return {
        "add": function(val) {
            //Add to the items.
            items.push(val);
            //Save the items to a cookie.
            //EDIT: Modified from linked answer by Nick see
            //      http://stackoverflow.com/questions/3387251/how-to-store-array-in-jquery-cookie
            $.cookie(cookieName, items.join(','));
            countSet();
        },
        "remove": function (val) {
            //EDIT: Thx to Assef and luke for remove.
            indx = items.indexOf(val);
            if(indx!=-1) items.splice(indx, 1);
            $.cookie(cookieName, items.join(','));
            countSet();
        },
        "clear": function() {
            items = null;
            //clear the cookie.
            $.cookie(cookieName, null);
            countSet();
        },
        "items": function() {
            //Get all the items.
            return items;
        },
        "count": function() {
            //Get all the items.
            return Object.keys(items).length/4;
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
        // If is not undefined
        if (!isNaN(currentVal)) {
            if(currentVal<100){
                // Increment
                $(this).parent().find('input[name='+fieldName+']').val(currentVal + 1);
            }
        } else {
            // Otherwise put a 0 there
            $(this).parent().find('input[name='+fieldName+']').val(1);
        }
        total();
    });
    // This button will decrement the value till 0
    $(".qty-minus").click(function(e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($(this).parent().find('input[name='+fieldName+']').val());
        // If it isn't undefined or its greater than 0
        if (!isNaN(currentVal) && currentVal > 1) {
            // Decrement one
            $(this).parent().find('input[name='+fieldName+']').val(currentVal - 1);
        } else {
            // Otherwise put a 0 there
            $(this).parent().find('input[name='+fieldName+']').val(1);
        }
        total();
    });
    countSet();
}
function countSet(){
    var counts = new cartList("cart");
    $('#cartitems').html(counts.count());
}
$(document).ready(function(){
    countSet();
})