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

    //$('.navbar-nav li').removeClass('active');
    //$(this).addClass('active');

    $('[data-toggle="tooltip"]').tooltip();

});

$('body').on('click', '.navbar-nav li', function () {
    $('.navbar-nav li.active').removeClass('active');
    $(this).addClass('active');
});

function setVis(id, visibility) {
    document.getElementById(id).style.display = visibility;
}
function editFilter() {
    document.getElementById('filterEdit').style.display = "block";
}
function editBug() {
    document.getElementById('bugEdit').style.display = "block";
}
function editProject() {
    document.getElementById('projectEdit').style.display = "block";
}
function editModule() {
    document.getElementById('moduleEdit').style.display = "block";
}
function editUser() {
    document.getElementById('userEdit').style.display = "block";
}
$(function () {
    $('a[href*="#"]:not([href="#"])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
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
});

$(document).on('click', '#close-preview', function () {
    $('.image-preview').popover('hide');
    // Hover befor close the preview
    $('.image-preview').hover(
        function () {
            $('.image-preview').popover('show');
        },
         function () {
             $('.image-preview').popover('hide');
         }
    );
});

$(function () {
    // Create the close button
    var closebtn = $('<button/>', {
        type: "button",
        text: 'x',
        id: 'close-preview',
        style: 'font-size: initial;',
    });
    closebtn.attr("class", "close pull-right");
    // Set the popover default content
    $('.image-preview').popover({
        trigger: 'manual',
        html: true,
        title: "<strong>Preview</strong>" + $(closebtn)[0].outerHTML,
        content: "There's no image",
        placement: 'bottom'
    });
    // Clear event
    $('.image-preview-clear').click(function () {
        $('.image-preview').attr("data-content", "").popover('hide');
        $('.image-preview-filename').val("");
        $('.image-preview-clear').hide();
        $('.image-preview-input input:file').val("");
        $(".image-preview-input-title").text("Browse");
    });
    // Create the preview image
    $(".image-preview-input input:file").change(function () {
        var img = $('<img/>', {
            id: 'dynamic',
            width: 250,
            height: 200
        });
        var file = this.files[0];
        var reader = new FileReader();
        // Set preview image into the popover data-content
        reader.onload = function (e) {
            $(".image-preview-input-title").text("Change");
            $(".image-preview-clear").show();
            $(".image-preview-filename").val(file.name);
            img.attr('src', e.target.result);
            $(".image-preview").attr("data-content", $(img)[0].outerHTML).popover("show");
        }
        reader.readAsDataURL(file);
    });
});