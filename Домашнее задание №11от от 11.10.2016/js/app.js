var cont = document.querySelectorAll('.main_menu_area ul li a ');
var select = localStorage.getItem('selected');
var ul = document.getElementById('nav');

window.onload = function(){
     for (var i=0;i < cont.length; i++) {
            if (select === cont[i].innerHTML) {
                cont[i].className="active";
        }
     }
};

function deleteActive() {
    for (var i=0;i < cont.length; i++) {
        cont[i].className = " ";}
}
function getEventTarget(e) {
    return e.target ;
}

ul.onclick = function(event) {
    var target = getEventTarget(event);
    localStorage.setItem('selected', target.innerHTML);
    deleteActive();
    target.className="active";
};

