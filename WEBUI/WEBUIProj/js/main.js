$(document).ready(function () {
    $('#btnFilter').click(function () {
    $('#filterEdit').show();
    });

    $('#btnBug').click(function () {
    $('#bugEdit').show();
    });

    $('#btnProject').click(function () {
    $('#projectEdit').show();
    });
	
	$('#btnModule').click(function () {
    $('#moduleEdit').show();
    });
	
	$('#btnUser').click(function () {
    $('#userEdit').show();
    });
});

function setVis(id, visibility) {
	document.getElementById(id).style.display = visibility;
}
function editFilter(){
	document.getElementById('filterEdit').style.display = "block";
}
function editBug(){
	document.getElementById('bugEdit').style.display = "block";
}
function editProject(){
	document.getElementById('projectEdit').style.display = "block";
}
function editModule(){
	document.getElementById('moduleEdit').style.display = "block";
}
function editUser(){
	document.getElementById('userEdit').style.display = "block";
}
$(function() {
    $('a[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });
  });			
  
$('.carousel').carousel({
   interval: 5000 //changes the speed
})