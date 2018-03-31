// On Home page load
App.controller('home', function (page) {

  if(typeof(Storage) !== "undefined"){
    // reset recipient email if new user button clicked
    $(page).find('#new-user')
    .clickable()
    .on('click', function(){
      // remove recipient email if any
      if(localStorage.getItem('recipient-email') !== null){
        localStorage.removeItem('recipient-email');
      }
      // redirect to second page
      App.load('page2');
    });

    // load contacts list if recipient emails are saved
    if(localStorage.getItem('recipient-list') !== null){
      // get recipient list
      var list = JSON.parse(localStorage.getItem('recipient-list'));
      // append each address to the list as a button
      $.each(list, function(index, value){
        $(page).find('#contact-list').append('<div class="app-button redirect">'+value+'</div>');
      });
      // show list
      $(page).find('#contact-list').show();
      // find all added contact buttons and make them clickable
      $(page).find('.redirect')
      .clickable()
      .on('click', function(){
        // save recipient email in storage
        localStorage.setItem('recipient-email',$(this).html());
        // redirect to second page
        App.load('page2');
      });
    } else {
      // hide contact list if no contacts
      $(page).find('#contact-list').hide();
    }
  }

});


// On page2 load
App.controller('page2', function (page) {
  // hide info div
  $(page).find('#info').hide();

  // load sender email if saved
  if(typeof(Storage) !== 'undefined'){
    if(localStorage.getItem('sender-email') !== null){
      $(page).find('#sender-email').val(localStorage.getItem('sender-email'));
    }
    if(localStorage.getItem('recipient-email') !== null){
      $(page).find('#recipient-email').val(localStorage.getItem('recipient-email'));
    }
  }

  // when send button clicked
  $(page).find('#send-btn')
  .clickable()
  .on('click', function () {

    var toEmail = $(page).find("#recipient-email").val();
    var fromEmail = $(page).find("#sender-email").val();
    var subjectVar = $(page).find("#subject").val();
    var messageVar = $(page).find("#message").val();

    if(typeof(Storage) !== "undefined"){
      // save sender email address for caching
      localStorage.setItem('sender-email', fromEmail);
      // save recipient email in list
      // create list array
      var recipientList = new Array();
      // get array list form local storage
      if(localStorage.getItem('recipient-list') !== null){
        recipientList = JSON.parse(localStorage.getItem('recipient-list'));
      }
      // check if recipient email is not in the list and add it
      if($.inArray(toEmail, recipientList) == -1){
        recipientList.push(toEmail);
        recipientList.sort();
      }
      // save list in local storage
      localStorage.setItem('recipient-list', JSON.stringify(recipientList));
    }

    $.ajax({
      type: 'GET',
      url: 'YOUR-WEB-SERVER-PATH-HERE/sendemail.php?callback=response',
      // data to be added to query string:
      data: {
        to: toEmail,
        from: fromEmail,
        subject: subjectVar,
        message: messageVar
      },
      dataType: 'jsonp',
      timeout: 300,
      context: $('body'),
      success: function(data){
        if(data.success == true){
          $(page).find('#info').html("Your email was send successfully!").show();
        }else{
          $(page).find('#info').html("Your email was not send, please try again.").show();
        }
      },
      error: function(xhr, type){
        $(page).find('#info').html("Your email was not send, please try again.").show();
      }
    });

  });

});


try {
  App.restore();
} catch (err) {
  App.load('home');
}
