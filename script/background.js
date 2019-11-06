var allItemsTm={};
	allItemsTm.name='bg_for_try';
	allItemsTm.value=undefined;

chrome.runtime.onMessage.addListener(function(request, sender, f_callback){

	if(request.name == 'tm_for_bg') {allItemsTm.value=request.value;}

	if(allItemsTm.value != undefined){
		if(request == 'try_check'){
			f_callback(allItemsTm);
			allItemsTm.value=undefined;
		}
	}
});
