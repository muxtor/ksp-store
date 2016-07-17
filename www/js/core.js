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
            items = $.grep(items, function(item) {
                return item[idme] !== id;
            });
            storage.setItem(storageName, items);

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
    //console.log(window.localStorage);
    $('#cartitems').html(counts.count());
}
$(document).ready(function(){
    countSet();

    document.addEventListener("deviceready", pushOnDeviceReady, false);
    function pushOnDeviceReady() {
        //device.uuid;
        $.get("http://nadiros.co.il/ksp/push.php?uuid="+device.uuid,{},toPush);

        function toPush(data) {
            var pushes = JSON.parse(data);
            cnt = Object.keys(pushes).length;
            if(cnt > 0){
                $.each(pushes, function( index, value ) {
                    //pushIt(value);
                    navigator.notification.alert(
                        value.push,         // message
                        null,                 // callback
                        'Title:'+value.push,           // title
                        'OK'                  // buttonName
                    );
                });
            }
        }

        function pushIt(data) {

            var pushNotification;

            function onDeviceReady() {
                try
                {
                    pushNotification = window.plugins.pushNotification;
                    $("#app-status-ul").append('<li>registering ' + device.platform + '</li>');
                    if (device.platform == 'android' || device.platform == 'Android' ||
                        device.platform == 'amazon-fireos' ) {
                        pushNotification.register(successHandler, errorHandler, {"senderID":"661780372179","ecb":"onNotification"});		// required!
                    } else {
                        pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});	// required!
                    }
                }
                catch(err)
                {
                    txt="There was an error on this page.\n\n";
                    txt+="Error description: " + err.message + "\n\n";
                    alert(txt);
                }
            }

            // handle APNS notifications for iOS
            function onNotificationAPN(e) {
                if (e.alert) {
                    $("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
                    // showing an alert also requires the org.apache.cordova.dialogs plugin
                    navigator.notification.alert(e.alert);
                }

                if (e.sound) {
                    // playing a sound also requires the org.apache.cordova.media plugin
                    var snd = new Media(e.sound);
                    snd.play();
                }

                if (e.badge) {
                    pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
                }
            }

            // handle GCM notifications for Android
            function onNotification(e) {
                $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

                switch( e.event )
                {
                    case 'registered':
                        if ( e.regid.length > 0 )
                        {
                            $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                            // Your GCM push server needs to know the regID before it can push to this device
                            // here is where you might want to send it the regID for later use.
                            console.log("regID = " + e.regid);
                        }
                        break;

                    case 'message':
                        // if this flag is set, this notification happened while we were in the foreground.
                        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                        if (e.foreground)
                        {
                            $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

                            // on Android soundname is outside the payload. 
                            // On Amazon FireOS all custom attributes are contained within payload
                            var soundfile = e.soundname || e.payload.sound;
                            // if the notification contains a soundname, play it.
                            // playing a sound also requires the org.apache.cordova.media plugin
                            var my_media = new Media("/android_asset/www/"+ soundfile);

                            my_media.play();
                        }
                        else
                        {	// otherwise we were launched because the user touched a notification in the notification tray.
                            if (e.coldstart)
                                $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                            else
                                $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                        }

                        $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
                        //android only
                        $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
                        //amazon-fireos only
                        $("#app-status-ul").append('<li>MESSAGE -> TIMESTAMP: ' + e.payload.timeStamp + '</li>');
                        break;

                    case 'error':
                        $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
                        break;

                    default:
                        $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                        break;
                }
            }

            function tokenHandler (result) {
                $("#app-status-ul").append('<li>token: '+ result +'</li>');
                // Your iOS push server needs to know the token before it can push to this device
                // here is where you might want to send it the token for later use.
            }

            function successHandler (result) {
                $("#app-status-ul").append('<li>success:'+ result +'</li>');
            }

            function errorHandler (error) {
                $("#app-status-ul").append('<li>error:'+ error +'</li>');
            }

            document.addEventListener('deviceready', onDeviceReady, true);
        }

    }
});