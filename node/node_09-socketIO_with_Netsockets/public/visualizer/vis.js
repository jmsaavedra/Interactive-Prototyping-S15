/*** JS script for visualizer *** /
// open webkit camera
// set image
*/

$(document).ready(function() {

	setInterval(updateData, 5000);
});


function updateData(){

	$.ajax({
	  url: "output?name=sine",
	  context: document.body
	}).done(function() {
	  $( this ).addClass( "done" );
	});
}