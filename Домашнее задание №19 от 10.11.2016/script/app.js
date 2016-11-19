
function WordFinder() {
    this.text = $("#textarea").text();
    this.input = $("input").val();
    this.replaceVal = "<span>" + this.input + "</span>";
}

WordFinder.prototype.simpleSearch = function () {
    var rExpres = new RegExp(this.input, "ig");
    var textVal = this.text.replace(rExpres, this.replaceVal);
    $("#textarea").html(textVal);
};


WordFinder.prototype.advancedSearch = function () {
    var rExpres = new RegExp(" " + this.input + " ", "ig");
    var textVal = this.text.replace(rExpres, " " + this.replaceVal + " ");
    $("#textarea").html(textVal);
};


WordFinder.prototype.replace = function () {
    var noth = "";
    for (var i = this.input.length; i--;) {
        noth += "*";
    }
    var rExpres = new RegExp(this.input, "ig");
    var textVal = this.text.replace(rExpres, noth);
    $("#textarea").html(textVal);
};



$("#search1").click(function () {
    var x = new WordFinder();
    x.simpleSearch();
});

$("#search2").click(function () {
    var x = new WordFinder();
    x.advancedSearch();
});

$("#replace").click(function () {
    var x = new WordFinder();
    x.replace();
});
