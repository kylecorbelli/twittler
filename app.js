$(document).ready(function(){ // TODO: Factor this out into a seperate JS file
    var $body = $('body');
    $body.html('');

    // TODO: Add a main button that will allow the user to see all tweets from all users

    // Helper function to format date
    var formatDateTime = function(date) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var hours = (date.getHours() > 12) ? date.getHours() - 12 : date.getHours();
        var amPm = (date.getHours() > 12) ? 'PM' : 'AM';
        var minutes = date.getMinutes().toString();
        while (minutes.length < 2) {
            minutes = '0' + minutes;
        }
        return months[date.getMonth()] + ' ' + date.getDate() + ' - ' + hours + ':' + minutes + ' ' + amPm;
    };

    // Helper function to make new tweets
    var makeTweet = function(theTweet) {
        var output = $('<div data-user="' + theTweet.user + '"></div>');
        output.html('<p><span class="user">' + theTweet.user + '</span> <span class="subtle">@' + theTweet.user + ' | ' + formatDateTime(theTweet.created_at) + '</span><br>' + theTweet.message + '</p>');
            if (showUser !== '_all' && theTweet.user !== showUser) {
                output.hide();
            }
        return output;
    };

    var streamLength = streams.home.length;
    var index = streamLength - 1;
    var tweet;
    var $tweet;
    var showUser = '_all';
    while(index >= 0){
      tweet = streams.home[index];
      $tweet = makeTweet(tweet);
      $tweet.appendTo($body);
      index -= 1;
    }

    // Set event listeners
    var setEventListeners = function() {
        // Filter tweets by user upon clicking that particular user
        $('.user').off('click');
        $('.user').on('click', function() {
            showUser = $(this).closest('div').data('user');
            console.log(showUser);
            $body.find('div').not('[data-user="' + showUser + '"]').hide();
        });
    };

    setEventListeners();

    // Add new tweets as they are created
    setInterval(function() {
        if (streams.home.length > streamLength) {
            for (var i = streamLength; i < streams.home.length; i++) {
                tweet = streams.home[i];
                $tweet = makeTweet(tweet);
                $tweet.prependTo($body);
            }
            streamLength = streams.home.length;
            setEventListeners();
        }
    }, 100);

});