// the toggle relation in relationEditBox

console.log("in toggle.js");
// console.log(on_or_off);
// console.log(relation);

$(function(){
  if ($(this).prop('checked') == true) {
    displayRelation();
  } else {
    concealRelation();
  }
});


// fill the relation_exp and relation_demo with text
$(function () {
  $("#toggle-one").change(function () {
    console.log("hello world");
    displayRelation();
    if($(this).prop('checked') == true) {
     } else {
       concealRelation();
   }
  });
});

function displayRelation () {
  $("#relation_exp").html("it's the exponent");
  $("#relation_demo").html("the demo of the relation");
}

function concealRelation () {
  $("#relation_exp").html("");
  $("#relation_demo").html("");
}
