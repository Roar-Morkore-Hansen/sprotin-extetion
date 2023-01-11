


function doXMLHttpRequest(dicId,inputVal) {
  //send XMLHttpRequest
  const xhr = new XMLHttpRequest();

  const url = `https://sprotin.fo/dictionary_search_json.php?DictionaryId=${dicId}&DictionaryPage=1&SearchFor=${inputVal}&SearchInflections=0&SearchDescriptions=0&Group=&SkipOtherDictionariesResults=0&SkipSimilarWords=0`;

  //set logo link til at vera tað sama sum search orðið
  const url_link = `https://sprotin.fo/dictionaries?_DictionaryId=${dicId}&DictionaryPage=1&SearchFor=${inputVal}&SearchInflections=0&SearchDescriptions=0&Group=&SkipOtherDictionariesResults=0&SkipSimilarWords=0`;
  $('#logo_link')[0].href = url_link;

  //xhr GET request
  xhr.open('GET', url);
  xhr.responseType = 'json'

  xhr.onload = function() {

    const data = xhr.response;
    dataDisplay(data);
  }
  xhr.send();
};
