// the toggle relation in relationEditBox

console.log("in toggle.js");
// console.log(on_or_off);
// console.log(relation);
// console.log(source_Id);
// console.log(target_Id);

var sourceId = $("#toggle-one").attr('sourceId');
var targetId = $("#toggle-one").attr('targetId');

var relationNode;
var hasRelation = function (sourceNode_id, targetNode_id) {
  var rel = false;

  for (i in relation) {
    if ((relation[i].input == sourceNode_id) && (relation[i].output == targetNode_id)) {
      relationNode = relation[i];
      rel = true;
      break;
    }
  }

  return rel;
};

var relationStatus = hasRelation(sourceId, targetId);

var on_or_off = "off";
if ( relationStatus ) {
  on_or_off= "on";
}
$('#toggle-one').bootstrapToggle(on_or_off);


$(function(){


  if ($("#toggle-one").prop('checked') == true) {
    displayRelation();
  } else {
    concealRelation();
  }
});


// fill the relation_exp and relation_demo with text
$(function () {
  $("#toggle-one").change(function () {
    console.log("hello world");
    if($(this).prop('checked') == true) {
      displayRelation();
     } else {
       concealRelation();
   }
  });
});

function displayRelation () {

  $("#relation_exp").html('相关系数 (1-10): <input id="relation_exp_value" type="number" name="points" min="1" max="10"/>');
  if (relationStatus && (relationNode.coefficient != null)) {// coefficient
    $("#relation_exp_value").attr("value", relationNode.coefficient);
  }

  $("#relation_demo").html('因果实例： <textarea id="relation_case_value" rows="15" cols="97">' + '</textarea>');

  if (relationStatus && (relationNode.case != null)) {
    $("#relation_case_value").val(relationNode.case);
  }
}

function concealRelation () {
  $("#relation_exp").html("");
  $("#relation_demo").html("");
}
