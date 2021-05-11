var fuseOptions = {
  includeScore: true,
  useExtendedSearch: true,
  shouldSort: true,
  includeMatches: true,
  tokenize:true,
  /*threshold: 0.0,
  location: 0,
  distance: 100,*/
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    {name:"title",weight:0.8},
    {name:"content",weight:0.3},
    {name:"tags",weight:0.3},
    {name:"description",weight:0.3}
  ]
}


var summaryInclude=60;
var searchQuery = ''; //searchQuery = param("s");

if(searchQuery){
  $("#search-query").val(searchQuery);
  executeSearch(searchQuery);
}else {
  $('#search-results').append("<p>Please enter a word or phrase above</p>");
}

function executeSearch(searchQuery){
  var result;
  $.getJSON( "/index.json", function( data ) {
    var pages = data;
    console.log({"data":pages});
    var fuse = new Fuse(pages, fuseOptions);
    result = fuse.search(searchQuery);
    console.log({"matches":result});
    
    $("#local-search-result").empty();
    
    if(result.length > 0){
      populateResults(result);
    }else{
   	 $('#local-search-result').append("<p>No matches found</p>");
    }
    
  });
  
  return result;
}

function executeSearch_old(searchQuery){
  var result;
  $.getJSON( "/index.json", function( data ) {
    var pages = data;
    //console.log({"data":pages});
    var fuse = new Fuse(pages, fuseOptions);
    result = fuse.search(searchQuery);
    //console.log({"matches":result});
    
    $("#local-search-result").empty();
    
    if(result.length > 0){
      populateResults(result);
    }else{
   	 $('#local-search-result').append("<p>No matches found</p>");
    }
    
  });
  
  return result;
}


function populateResults(result){
  $.each(result,function(key,value){
    var content= value.item.content;
    var snippet = "";
    var snippetHighlights=[];
    var tags =[];
    if( fuseOptions.tokenize ){
      snippetHighlights.push(searchQuery);
    }else{
      $.each(value.matches,function(matchKey, mvalue){
      
        if(mvalue.key == "tags" || mvalue.key == "description" ){
          snippetHighlights.push(mvalue.value);
        }else if(mvalue.key == "content" || mvalue.key == "contents"){
        
          start = mvalue.indices[0][0]-summaryInclude>0?mvalue.indices[0][0]-summaryInclude:0;
          end = mvalue.indices[0][1]+summaryInclude<content.length?mvalue.indices[0][1]+summaryInclude:content.length;
          snippet += content.substring(start,end);
          
          snippetHighlights.push(mvalue.value.substring(mvalue.indices[0][0],mvalue.indices[0][1]-mvalue.indices[0][0]+1));
          
          
        }
      });
    }

    if(snippet.length<1){
      snippet += content.substring(0,summaryInclude*2);
    }
    //pull template from hugo templarte definition
    var templateDefinition = $('#search-result-template').html();
    //replace values
    var output = render(templateDefinition,{key:key,title:value.item.title,link:value.item.uri,tags:value.item.tags,categories:value.item.categories,snippet:snippet});
    //console.log(output);
    $('#local-search-result').append(output);

    $.each(snippetHighlights,function(snipkey,snipvalue){
      $("#summary-"+key).mark(snipvalue);
    });

  });
}


function param(name) {
    return decodeURIComponent((location.search.split(name + '=')[1] || '').split('&')[0]).replace(/\+/g, ' ');
}

function render(templateString, data) {

  var conditionalMatches,conditionalPattern,copy;
  conditionalPattern = /\$\{\s*isset ([a-zA-Z]*) \s*\}(.*)\$\{\s*end\s*}/g;
  //since loop below depends on re.lastInxdex, we use a copy to capture any manipulations whilst inside the loop
  copy = templateString;
  while ((conditionalMatches = conditionalPattern.exec(templateString)) !== null) {
    if(data[conditionalMatches[1]]){
      //valid key, remove conditionals, leave content.
      copy = copy.replace(conditionalMatches[0],conditionalMatches[2]);
    }else{
      //not valid, remove entire section
      copy = copy.replace(conditionalMatches[0],'');
    }
  }
  templateString = copy;
  //now any conditionals removed we can do simple substitution
  var key, find, re;
  for (key in data) {
    find = '\\$\\{\\s*' + key + '\\s*\\}';
    re = new RegExp(find, 'g');
    templateString = templateString.replace(re, data[key]);
  }
  return templateString;
}
