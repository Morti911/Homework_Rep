var newUser = document.querySelector('[data-id="user"]');
var btn = document.querySelector('[data-id="button"]');


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
