//Sprotin Extension v_10
//OPTIMIZE


function onClick(dicId) {
  var inputVal = $('#input').val();
  if (inputVal == preWord && dicId == dictionaryId) {
    return;
  }else {
    newWord(dicId,inputVal);
    selector(dicId);
  }
}

function selector(dicId) {

  var inputVal = $('#input').val();

  //tid start
  window.tidStart = Date.now()

  console.log("[START] starting...");
  console.log(inputVal, dicId)

  window.dictionaryId = dicId;
  window.preWord = inputVal;

  //set ccs class til active
  $(".activeB").removeClass("activeB");
  $(".activeR").removeClass("activeR");
  $("#" + dictionaryId).children(".button").addClass("activeB");
  $("#" + dictionaryId).children(".results").addClass("activeR");

  doXMLHttpRequest(dicId,inputVal);
};


function dataDisplay(data) {
  console.log(data)

  //vísur úrslit per orðabók

  for (i = 0; i < selector_len; i++) {
    var res = $('#res_' + array_dicId[i])[0];
    res.innerHTML = data.dictionaries_results[i].results;
  };
  //tøm listan
  clearList();

  var dataWord_len = data.words.length

  if (data.status == 'not_found') {
    //</=== Einki úrslit funnið ===>
    $('#similarWord_list')[0].innerHTML = data.message;

    //variablar
    var similarWordStr = "";
    var similarWord_Len = data.similar_words.length;
    var similarWord_Element = $('#similarWord_list')[0];

    if (similarWord_Len > 0) {
      similarWordStr += '<p class="meintiTu"> <br> Meinti tú:&nbsp;</p>';

      for (i = 0; i < similarWord_Len; i++) {
        similarWordStr += `<span class="word_link">${data.similar_words[i].SearchWord}</span>`;
        if (i < similarWord_Len - 1) {
          similarWordStr += '<span class="komma">,</span>&nbsp;'
        }
      };
      similarWord_Element.innerHTML += `<div class similarWord_list>${similarWordStr}</div>`;

      //add EventListener til orð

      $('.similarWord').click(function () {
        $("#input").val(this.innerText);
        onClick(dictionaryId)
      })
    };
    $('#results_list')[0].innerHTML = '<div class="notFound_text"> Er orðið skrivað í grundsniði? T.d. eitur <b>bygdi</b> í navnhátti <b>byggja</b>, <b>londum</b> í hvørfalli eintal <b>land</b>.	</div>';
    //</=== Einki úrslit funnið ===>
  } else {
    //<===display word===>
    //variablar
    var words_len = data.words.length;
    var result_div = '';

    for (var i = 0; i < words_len; i++) {
      var result_str = '';
      var result_sub_str = '';
      var subtitleStr = '';

      if (data.words[i].Phonetic != null) {
        subtitleStr += `<div> &nbsp ${data.words[i].Phonetic} </div>`;
      }
      if (data.words[i].InflexCats != null) {
        subtitleStr += `<div> &nbsp ${data.words[i].InflexCats} </div>`;
      }
      var input_word = $('#input').val();
      console.log(data.words[i].SearchWord,input_word.hyphen().length)
      console.log(data.words[i].SearchWord.mark(data.words[i].SearchWord.toLowerCase().indexOf(input_word.hyphen().toLowerCase()),input_word.hyphen().length,["<mark>","</mark>"]))
      result_sub_str += `<div class="Word">${data.words[i].SearchWord.mark(data.words[i].SearchWord.toLowerCase().indexOf(input_word.hyphen().toLowerCase()),input_word.hyphen().length,["<mark>","</mark>"])}</div>${subtitleStr}`;

      if (data.words[i].InflectedForm != null) {
        result_sub_str += `&nbsp <a id="bend_button-Id" class="bend_button">bendingarlið</a>`
      }
      result_str += `<div class="DisplayWord">${result_sub_str}</div>`;

      result_str += `<div id="tableDiv" class="tableDiv_hidden"><div class="tableText">Bendingarsnið '${data.words[i].SearchWord}'</div><table class="tableClass_hidden">${BendTable(data.words[i].InflectedForm)}</table></div>`;

      result_str += `<div class="Explanation_description">${data.words[i].Explanation}</div>`;

      result_div += `<div class="result_element"> ${result_str} </div>`;
    }

    $('#results_list')[0].innerHTML += result_div;

    var image = $('.result_element img');
    var imageLen = image.length;

    for (var i = 0; i < imageLen; i++) {
      var imgSrc = $('.result_element img')[i].src;
      var imgURL = "http://sprotin.fo/" + imgSrc.substring(imgSrc.indexOf('upload/'),imgSrc.length);
      $('.result_element img')[i].src = imgURL;
      $('.image.full_width')[i].href = imgURL;
      $('.image.full_width').target = '_blank';
    };
  //</===display word===>
  };

  //add EventListener til sí orð og similarWords
  wordLink()
  bendLink()


  //enda tid og conventera frá [ms] til [s]
  var deltaTid = (Date.now() - tidStart)/1000;
  console.log("[TID] samala tíð er " + deltaTid.toString() + " sekund")
  console.log("[END] ended...")
};

function clearList() {
  var similarWord_list = $('#similarWord_list')[0];
  var results_list = $('#results_list')[0];

  while (similarWord_list.firstChild) {
    similarWord_list.removeChild(similarWord_list.firstChild);
  };
  while (results_list.firstChild) {
    results_list.removeChild(results_list.firstChild);
  };

}

function wordLink() {
  $('.word_link').click(function () {
    var DisplayWord = $(this).parent().parent().parent().parent().parent().parent().find("div")[1].innerText;
    $('#input').val($(this)[0].innerHTML.replace("-",DisplayWord));
    onClick(dictionaryId);
  })
}

function bendLink() {
  $('.bend_button').click(function () {
    $( this ).toggleClass('bend_button red')
    $( this ).parent().parent().find('#tableDiv').toggleClass('tableDiv tableDiv_hidden');
  });
}


function BendTable(array) {
  if (array != null) {
    array_len = array.length;
    var strCell = "";
    var strRows = "";
    var strTable = "";

    if (array_len == 6) {
      for (var i = 0; i < array_len; i++) {
        strCell = `<th style="width:15%; font-weight: bold; border-left-style: none;">${array_collum_6[i]}</th><th>${array[i]}</th>`;
        strRows += `<tr>${strCell}</tr>`
      }
      strTable = `<tr class="table">${strRows}</tr>`;

    }else if (array_len == 16) {
      var array_antRows = array_len/2 //8
      strRows += '<tr><th style="width:15%; border-left-style: none;"></th><th style="width:15%"></th><th style="font-weight: bold">óbundið / indef.</th><th style="font-weight: bold">bundið / def.</th></tr>';
      for (var i = 0; i < array_antRows; i++) {
        strCell = `<th style=" font-weight: bold; border-left-style: none;">${array_collum[i]}</th><th style="font-weight: bold">${array_collum[i + array_antRows]}</th><th>${array[i]}</th><th>${array[i + array_antRows]}</th>`;
        strRows += `<tr>${strCell}</tr>`
      }
      strTable = `<tr class="table">${strRows}</tr>`;
    }else if (array_len == 24) {
      var array_antRows = 8
      var array_len_third = array_len/3
      strRows += '<th style="width:15%; border-left-style: none;"></th><th width:15%></th><th style="font-weight: bold">kallkyn / mask.</th><th style="font-weight: bold">kvennkyn / fem.</th><th style="font-weight: bold">hvørkikyn / neutr.</th>';
      for (var i = 0; i < array_antRows; i++) {
        strCell = `<th style="font-weight: bold; border-left-style: none;">${array_collum[i]}</th><th style="font-weight: bold">${array_collum[i + array_antRows]}</th><th>${array[i]}</th><th>${array[i + array_len_third]}</th><th>${array[i + (array_len_third*2)]}</th>`;
        strRows += `<tr>${strCell}</tr>`
      }
      strTable += `<tr class="table">${strRows}</tr>`;
    }
    return strTable
  } else {
    return "";
  }
};

//aftur og fram

function newWord(id,word) {
  currentElement = [id,word];
  backwardStack.push([dictionaryId,preWord]);
}

function goBackwards() {
  if (!this.backwardStack.length) {
        return;
    }
  forwardStack.push(currentElement);
  currentElement = backwardStack.pop();
  ForBacReq(currentElement[0],currentElement[1]);
}

function goForward() {
  if (!this.forwardStack.length) {
        return;
    }
    backwardStack.push(currentElement);
    currentElement = forwardStack.pop();
    ForBacReq(currentElement[0],currentElement[1])
}

function ForBacReq(id,word) {
  $('#input').val(word);
  selector(id);
}

//variablar

var forwardStack = [];
var backwardStack = [];
var currentWORD = "";

var preWord = ""

var array_dicId = ["1","2","3","4","5","21","6","7","10","20","30","9","11","12","24","26","15","25","22","23","13","32"];
var selector_len = $('.selector').length;

var empty = "";
var array_collum_1 = ["<br>eintal / sing.<br>",empty,empty,empty,"fleirtal / plur.",empty,empty,empty];
var array_collum_2 = ["hvørfall / nominativ","hvønnfall / akkusativ","hvørjumfall / dativ","hvørsfall / genitiv","hvørfall / nominativ","hvønnfall / akkusativ","hvørjumfall / dativ","hvørsfall / genitiv"];
var array_collum = array_collum_1.concat(array_collum_2);

var array_collum_6 = ["Navnháttur","3. persónur eintal í nútíð","eintal í tátíð","fleirtal í tátíð","lýsingarháttur í tátíð","lýsingarháttur í tátíð, kallkyn hvørfall"];


var tidStart;
var dictionaryId = 1;
var button = $('#1')[0];
var results = $('#res_1')[0];


String.prototype.mark = function(start, wordCount, newSubStr) {
  return this.slice(0,start) + newSubStr[0] + this.slice(start,wordCount+start) + newSubStr[1] + this.slice(start+wordCount);
}

String.prototype.hyphen = function() {
    return this.replace(/-/,'');
}

//action



// EventListener til selector
$(".selector").click(function () {
  onClick($(this).attr('id'))
});



$("#input").focus()

//EventListener til trýst av enter í input
$( "#input").on("keydown", function ( event ) {
  if (event.keyCode == 13) {
    onClick(dictionaryId)
  }
});



// EventListener til clearknøtt
$("#x-button").click(function () {
  $("#input").val("")
  onClick(dictionaryId);
});

$("#search-button").click(function () {
  onClick(dictionaryId);
});

// EventListener til aftur og fram knøtt

$("#back-button").click(function () {
  goBackwards();
});

$("#forward-button").click(function () {
  goForward();
});
