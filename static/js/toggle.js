// the toggle relation in relationEditBox

console.log("in toggle.js");

$(function(){
  $("#toggle-one").bootstrapToggle();
});


// fill the relation_exp and relation_demo with text
$(function () {
  $("#toggle-one").change(function () {
    console.log("hello world");
    if($(this).prop('checked') == true) {
      $("#relation_exp").html("it's the exponent");
      $("#relation_demo").html("the demo of the relation");
    } else {
      $("#relation_exp").html("");
      $("#relation_demo").html("");
    }
  });
});
