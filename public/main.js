$(function() {
  var $cardContainer = $('#card-container');
  var $cardTemplate = $($('#card-template').html());

  var zips = {};

  $('form').on('submit', function (e) {
    e.preventDefault();

    var zip = $.trim($('#zip').val());

    // clear out the field for a new zip
    $('#zip').val('');

    if (!zip || isNaN(zip)) return;

    var $zipCard = zips[zip];

    if ($zipCard) {
      // one already exists
      $zipCard.find('.card').animate({
        borderWidth: "5px"
      }, 300).animate({
        borderWidth: "1px"
      }, 300);
    } else {
      // make one
      $zipCard = zips[zip] = $cardTemplate.clone();
      
      $zipCard
        .find('.day-zip')
          .text(zip);
      
      var socket = io();

      socket.emit('set zip', zip);

      socket.on('set temp', function(data) {
        $zipCard.find('.day-low')
          .text(data.low);
        
        $zipCard.find('.day-high')
          .text(data.high);

        $zipCard.find('.fa-spin').addClass('d-none');
      })

      $zipCard
        .on('click', function() {
          socket.emit('request update', {});
          $zipCard.find('.fa-spin').removeClass('d-none');
        })
        .appendTo($cardContainer);
    }
  })
});
