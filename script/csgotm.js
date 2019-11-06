$(document).ready(function(){

    var allItems=[];
    setTimeout(parseAllItems, 3000);
    function parseAllItems(){
        $('#applications').find('.item').each(function(indx, element){
            let tmp = $(element).find('.name');
            allItems.push(tmp[0].innerText);
        });

        var objForTry={};
        objForTry.name='tm_for_bg';
        objForTry.value=allItems;
        console.log('===== parsing is over =====');
        console.log(objForTry.value);
        chrome.runtime.sendMessage(objForTry);
    }
});