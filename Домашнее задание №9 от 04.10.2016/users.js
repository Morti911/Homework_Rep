window.addEventListener('load', function () {
  var newUser = document.querySelector('[data-id="user"]');
  var btn = document.querySelector('[data-id="button"]');
  var btnAll = document.querySelector('[data-id="getAll"]');
  var check = document.getElementById(id="isAdmin");
  var checkBoxVal = check.value;
  check.checked = checkBoxVal;


    check.onclick = function () {
        if (this.checked) {checkBoxVal = 'admin';}
        else { checkBoxVal = '';}
      }


  btn.addEventListener('click', function() {
    ajax({
          url:"server.php",
          method:"POST",
          data:
            {
              name: newUser.value,
              role: checkBoxVal
            },
         success:function(data){
           console.log(checkBoxVal);
           document.getElementById("myUl").innerHTML+=data;
          }
        })
    });

    btnAll.addEventListener('click', function() {
      ajax({
            url:"server.php",
            method:"GET",
            data:"list=show",
            success:function(data){
             document.getElementById("myUl").innerHTML=data.responseText;
            }
          })
      });
  });
