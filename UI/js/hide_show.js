  function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
   var dynamicContent = getUrlVars()["AccountType"];
$(document).ready(function() {
// Check if the URL parameter is Admin
if (dynamicContent == 'Admin') {
$('#Admin').show();

}
// Check if the URL parameter is Staff
else if (dynamicContent == 'Staff') {
$('#Staff').show();

}
// Check if the URL parameter is Client
else if (dynamicContent == 'Client') {
$('#Client').show();
}
// Check if the URL parmeter is empty or not defined, display default content
else {
$('#default-content').show();
}
});

function myFunction() {
  alert("Sure You Want To Delete the Account");
}
