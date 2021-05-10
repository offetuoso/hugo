$(document).on("keyup", "input[id='local-search-input']", function () {
	searchQuery = $("input[id='local-search-input']").val();    
    if(searchQuery != ''){
	    executeSearch(searchQuery);
    }else{
   		$("#local-search-result").empty();
   		$("#local-search-result").html('<div id="no-result"><i class="fa fa-search fa-5x" /></div>');   		
    }
    
});

$(document).on('click', '.popup-btn-close',function(e) {
     onPopupClose();
});

$(document).on('click', '.social-icons__link',function(e) {
        
        if($(this).find('div').hasClass('icon_search')){
      		 e.preventDefault();
      		 proceedsearch();
        }
        
}); 


function proceedsearch() {
      $("body").append('<div class="search-popup-overlay local-search-pop-overlay"></div>').css('overflow', 'hidden');
      $('.search-popup-overlay').click(onPopupClose);
      $('.popup').toggle();
      $('#local-search-input').val('');
      var $localSearchInput = $('#local-search-input');
      $localSearchInput.attr("autocapitalize", "none");
      $localSearchInput.attr("autocorrect", "off");
      $localSearchInput.focus();
      $("#local-search-result").html('<div id="no-result"><i class="fa fa-search fa-5x" /></div>');
}


var onPopupClose = function (e) {
      $('.popup').hide();
      $('#local-search-input').val('');
      $('.search-result-list').remove();
      $('#no-result').remove();
      $(".local-search-pop-overlay").remove();
      $('body').css('overflow', '');
}
    
    


