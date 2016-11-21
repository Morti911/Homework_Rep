var form = [];
$("#submit").click(function (e) {
    e.preventDefault();
    $("form div").each(function () {
        var key = $(this).children("input[name]").attr("name");
        var value = $(this).children("input[name]").val();
        var rel;
        if ($(this).children("input[type='checkbox']").prop("checked")) {
            rel = Univ.validate(key, value);
        } else {
            rel = new Univ(key, value);
        }
        form.push(rel);
    });
    $("input[name]").val("");
    $("input[type='checkbox']").prop("checked", false);
    console.log(form);
    form = [];
});

function Univ(key, value) {
    this[key] = value;
}

Univ.validate = function (key, value) {
    var rel = new Univ(key, value);
    rel.validate = function () {
      console.log('Validated');
    };
    return rel;
};