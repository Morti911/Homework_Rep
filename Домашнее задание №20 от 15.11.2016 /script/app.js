class WordFinder {
    constructor() {
        this.text = $("#textarea").text();
        this.input = $("input").val();
        this.replaceVal = "<span>" + this.input + "</span>";
    }
}

WordFinder.prototype.simpleSearch = function () {
    let rExpres = new RegExp(this.input, "ig");
    let textVal = this.text.replace(rExpres, this.replaceVal);
    $("#textarea").html(textVal);
};
WordFinder.prototype.advancedSearch = function () {
    let rExpres = new RegExp(" " + this.input + " ", "ig");
    let textVal = this.text.replace(rExpres, " " + this.replaceVal + " ");
    $("#textarea").html(textVal);
};
WordFinder.prototype.replace = function () {
    let noth = "";
    for (let i = this.input.length; i--;) {
        noth += "*";
    }
    let rExpres = new RegExp(this.input, "ig");
    let textVal = this.text.replace(rExpres, noth);
    $("#textarea").html(textVal);
};

$("#search1").click(function () {
    let x = new WordFinder();
   x.simpleSearch();
});
$("#search2").click(function () {
    let x = new WordFinder();
    x.advancedSearch();
});
$("#replace").click(function () {
    let x = new WordFinder();
 x.replace();
});
