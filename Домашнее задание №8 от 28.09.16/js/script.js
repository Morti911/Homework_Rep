
var modal = document.getElementById('myModal');
var btn = document.getElementById("myBtn");
var content = document.getElementById("content-container").innerHTML;
 btn.onclick = function() {
      modal.style.display = "block";

      for (var i = 0; i < newArray.length; i++) {
        var node = newArray[i];
        var elVal = node.value;
        var elCont = node.count;
        content += "<p class='popUpCont'>" +elVal +" ---  "+ elCont + "<button class='popUpDel' onclick='delFunc()' >DELETE</button> </p>"  ;
        document.getElementById("content-container").innerHTML = content;

  };
};
var delFunc = function() {
  console.log();
};


  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      };
  };

var elems = document.getElementsByTagName("*");
var arr = [];
for (var i = 0; i < elems.length; i++) {
  arr[i]=elems[i].nodeName;
};

function compressArray(original) {
	var compressed = [];
	var copy = original.slice(0);
	for (var i = 0; i < original.length; i++) {
		var myCount = 0;
		for (var w = 0; w < copy.length; w++) {
			if (original[i] == copy[w]) {
				myCount++;
				delete copy[w];
			};
		};
		if (myCount > 0) {
			var a = new Object();
			a.value = original[i];
			a.count = myCount;
			compressed.push(a);
		};
	};

	return compressed;
};

var newArray = compressArray(arr);

function sortArray(a, b) {
  return b.count - a.count;
};

newArray.sort(sortArray);
