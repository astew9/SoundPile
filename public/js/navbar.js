$(document).ready(function() {
    var scroll_start = 0;
    var startchange = $('.navbar');
    var offset = startchange.offset();
    $('.navbar').css('background', 'transparent');
    $('.navbar').css('border', 'none');
    $(document).scroll(function() {
        scroll_start = $(this).scrollTop();
        if(scroll_start > offset.top) {
            $('.navbar').css('background', 'white');
            $('.navbar').css('border-bottom', '1px solid  #fc4a1a');
        } else {
            $('.navbar').css('background', 'transparent');
            $('.navbar').css('border', 'none');
        }
    });
});
