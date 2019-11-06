$(document).ready(function(){

    var percentageOfDesiredLoss = -7.5 , //Максимальный процент потери (фактически может оказаться больше если ты как лох продашь на ТМ)
        commission=6.90, //Твоя комиссия на ТМ
        allItems='{',
        kurs = $('#kurs');
    kurs = kurs[0].innerText;
    kurs = kurs.substring(kurs.indexOf('1$')+3);
    kurs = kurs.substring(0,kurs.indexOf('руб')-1); //Курс даллара

    setTimeout(check, 5000);

    function FireEvent( ElementId, EventName ){
        if( document.getElementsByClassName(ElementId)[0] != null ){
            if( document.getElementsByClassName( ElementId )[0].fireEvent ){
                document.getElementsByClassName( ElementId )[0].fireEvent( 'on' + EventName );
            }else{
                var evObj = document.createEvent( 'Events' );
                evObj.initEvent( EventName, true, false );
                document.getElementsByClassName( ElementId )[0].dispatchEvent( evObj );
            }
        }
    }

    function check(){
        console.log('trying to get data');
        chrome.runtime.sendMessage('try_check', function(f_callback){
            if(f_callback == undefined || f_callback.value == undefined){setTimeout(check, 3500);
            }else{
                if(f_callback.name == 'bg_for_try'){console.log(f_callback.value); getPrice(f_callback.value);
                }else{setTimeout(check, 3500);}
            }
        });
    }

    function getPrice(arr){
        console.log(arr);
        var i=0;
        counter();
        function counter(){
            if(i<arr.length){
                $('#item-name_en').val(arr[i]); //Вводим название в поиск
                FireEvent('btn-load', "click" ); //Кликаем загрузить
                setTimeout(pace_done, 2900);
                let pace_done_checker = 0;
                function pace_done(){
                    if($('body').hasClass('pace-done')){console.log('items loaded'); //Если итемы догрузились
                        var table = $('.table.table-striped.table-bordered').find('tbody').find('tr'); //Берем все тр таблицы
                        if(table.find('td').eq(4).find('a').attr('href') != undefined){
                            for(var q=0; q<table.length; q++){ //Проходим по всем итемам
                                let itemName=(table.find('td').eq(0).text()).slice(1, (table.find('td').eq(0).text()).length-1);
                                let itemSteamPrice=Number(table.find('td').eq(7).find('.edit').text())*kurs;
                                let itemSteamURL=table.find('td').eq(4).find('a').attr('href');
                                let itemAvgAndCommissionTmPrice=table.find('td').eq(5).find('a').attr('title');
                                    itemAvgAndCommissionTmPrice=itemAvgAndCommissionTmPrice.substring(itemAvgAndCommissionTmPrice.indexOf('avg')+27);
                                    itemAvgAndCommissionTmPrice=itemAvgAndCommissionTmPrice.substring(0,itemAvgAndCommissionTmPrice.indexOf('₽')); //АВГ стоимость ТМ
                                    itemAvgAndCommissionTmPrice=itemAvgAndCommissionTmPrice-(itemAvgAndCommissionTmPrice/100*commission);
                                let percentageOfLoss=((itemAvgAndCommissionTmPrice/itemSteamPrice-1)*100).toFixed(1);
                                if(arr[i] == itemName){ //Имя с тм и с трая совпали
                                    console.log('names matched');
                                    let SteamMaxBorder = itemSteamPrice;
                                    if(percentageOfLoss >= percentageOfDesiredLoss){//Прверяем не слишком ли большой -%
                                        console.log('GOOD precent');
                                        border_check();
                                        function border_check(){ //Прибавляем рубль и проверяем не переходит ли процент границу
                                            itemSteamPrice+=10;
                                            if(((itemAvgAndCommissionTmPrice/itemSteamPrice-1)*100).toFixed(1) >= percentageOfDesiredLoss){ //Проверяем % по новой цене
                                                SteamMaxBorder = itemSteamPrice;
                                                border_check(); //Перезаписываем цену стим и еще раз запускаем функцию
                                            } else {
                                                allItems = allItems + '"'+itemName+'":{"url":"'+itemSteamURL+'", "cost":"'+itemSteamPrice+'"},';
                                            }
                                        }
                                    }else{
                                        console.log('BAD precent');
                                    }
                                }else{console.log('the names dont match');}
                            }
                        }
                    }else{
                        setTimeout(pace_done, 2500);
                    }
                    i++;
                    console.log(i+'/'+arr.length);
                    counter();
                }
            } else {
                allItems=allItems.substring(0,allItems.length-1);
                allItems=allItems+'}';
                console.log(allItems);
            }
        }
    }
});
