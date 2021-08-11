

$(document).ready(function() {
  $('.rowshow').on('click', function() {
    $('.rowshow').removeClass('focus');
    let row = parseInt($(this).attr('data-row'));
    $(this).addClass('focus');
    rowSwitch(row);
  });
  $('button').on('click', function() {
    let sid = $(this).attr('data-slot');
    let num = parseInt($(this).attr('data-num'));
    // let val = parseInt($('#slot'+sid).text());
    let val = parseInt($('#slot'+sid).attr('data-stock'));
    let max = parseInt($('#slot'+sid).attr('data-max'));
    let newval = val + num;
    if (num === 0) newval = 0;
    if (num === 1000) newval = max;
    if (newval > max) newval = max;
    if (newval < 0) newval = 0;
    $('#slot'+sid).attr('data-stock', newval);
    $('#slot'+sid).text(newval.toString()+' / '+max.toString());
  });

  $('.btn-confirm').on('click', function() {
    let newslotinfo = [];
    $('div[id^=slot]').each(function() {
      let tempslotinfo = {
        slot: 0,
        stock: 0,
        max: 0
      };
      tempslotinfo.slot = parseInt($(this).attr('id').split('slot')[1]);
      // tempslotinfo.stock = parseInt($(this).text());
      tempslotinfo.stock = parseInt($(this).attr('data-stock'));
      tempslotinfo.max = parseInt($(this).attr('data-max'));
      newslotinfo.push(tempslotinfo);
      tempslotinfo = null;
    });


    $.ajax({
      type: "POST",
      url: "/stock-update",
      data: JSON.stringify({ slotinfo: newslotinfo }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data) {
        if (data.result == 0) {
          console.log('update was success');
          $('.loading-overlay').show();
          $('html').addClass('loading');
          setTimeout(function(){
            location.href='/';
          }, 1000);
        } else {
          console.log('success', data);
        }
      },
      failure: function(err) {
        if (err.result == -1) {
          console.log('no data receive');
        } else {
          console.log('failed', err);
        }
      }
    });
  });
  $('.rowshow').eq(0).click();
});

function rowSwitch(index) {
  $('.slot-set').hide();
  $('.rowslot'+index).show();
}
