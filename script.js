$(document).ready(function() {
    var userControl = false;

    // Generate the keyboard keys
    for (var i = 1; i <= 10; i++) {
        $('#keyboard').append('<div class="key" data-key="' + i + '"></div>');
    }

    // Function to toggle key colors
    function toggleKeyColor(key) {
        var dataKey = $(key).data('key');
        $.ajax({
            type: 'POST',
            url: 'process.php',
            data: { action: 'toggleKeyColor', key: dataKey },
            success: function(response) {
                if (response === 'success') {
                    $(key).toggleClass('red yellow');
                }
            }
        });
    }

    // Handle key click events
    $('.key').on('click', function() {
        if (userControl) {
            toggleKeyColor(this);
        }
    });

    // Handle control button click
    $('#controlButton').on('click', function() {
        $.ajax({
            type: 'POST',
            url: 'process.php',
            data: { action: 'acquireControl' },
            success: function(response) {
                if (response === 'success') {
                    userControl = true;
                    $('#controlButton').attr('disabled', 'disabled');
                    setTimeout(function() {
                        releaseControl();
                    }, 120000); // 120 seconds timeout
                }
            }
        });
    });

    // Function to release control
    function releaseControl() {
        userControl = false;
        $('#controlButton').removeAttr('disabled');
    }

    // Polling function to update key colors
    function pollKeyColors() {
        $.ajax({
            type: 'POST',
            url: 'process.php',
            data: { action: 'getKeyColors' },
            success: function(response) {
                var colors = JSON.parse(response);
                $('.key').each(function(index) {
                    if (colors[index] === 'red') {
                        $(this).addClass('red');
                    } else {
                        $(this).removeClass('red');
                    }
                    if (colors[index] === 'yellow') {
                        $(this).addClass('yellow');
                    } else {
                        $(this).removeClass('yellow');
                    }
                });
            },
            complete: function() {
                setTimeout(pollKeyColors, 1000); // Poll every 1 second
            }
        });
    }

    // Start polling for key colors
    pollKeyColors();
});
