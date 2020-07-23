$( document ).ready(function() {
    
    $('.dropdown-menu a').on('click', function(){
        const selText = $(this).text();
        $('#display').removeClass("none").html("<p>"+selText+"</p>");
        if(selText == "Get All Tea"){
            $('#display').getAll();
        }
        if(selText == "Get One Tea"){
            $('#display').getOne();
        }
        if(selText == "Post new comment"){
            $('#display').postOne();
        }
        if(selText == "Post New Tea (Admin only)"){
            $('#display').postTea();
        }
        if(selText == "Delete All Tea (Admin only)"){
            $('#display').delAll();
        }
        if(selText == "Delete One Tea (Admin only)"){
            $('#display').delOne();
        }
    });

})

$.fn.getAll = function () {
    $.getJSON('https://tea-api-vic-lo.herokuapp.com/tea', function(data) {
        $('#display').append("<pre>"+JSON.stringify(data,null,4)+"</pre>")
    })
};

$.fn.getOne = function(){
    $('#display').append('<input type="text" id="getOne" name="name" placeholder="Tea name">\
        <button type="button" class="form-btn" id="oneTea">Get My Tea~</button>');

    $('#oneTea').on('click', function() {
        $.getJSON('https://tea-api-vic-lo.herokuapp.com/tea/'+$('#getOne').val(), function(data){
            $('#display').html("<p>Here's your Tea!</p><pre>"+JSON.stringify(data,null,4)+"</pre>")
        })
    });
}

$.fn.postOne = function(){
    $('#display').append('<input type="text" id="postOne" name="name" placeholder="Tea to comment">\
    <input type="text" id="comment" name="comment" placeholder="Comment">\
    <button type="button" class="form-btn" id="oneComment">Post My Comment~</button>');

    $('#oneComment').on('click', function() {
        $.ajax({
            url: 'https://tea-api-vic-lo.herokuapp.com/tea/'+$('#postOne').val(),
            type: 'post',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({"comment":$('#comment').val()}),
            success: function(data) {
                $('#display').html("<p>Thanks for your comment! Here's all the comments so far.</p><pre>"+JSON.stringify(data.comments,null,4)+"</pre>")
            }
        });
    });
}

$.fn.postTea = function(){
    $('#display').append('<form method="post" enctype="multipart/form-data" id="myform">\
    <input type="text" id="postTeaName" name="name" placeholder="Tea name">\
    <input type="text" id="description" name="description" placeholder="Description">\
    <input type="text" id="keywords" name="keywords" placeholder="Keywords">\
    <input type="text" id="origin" name="origin" placeholder="Origin">\
    <input type="number" id="time" name="brew_time" placeholder="Brew Time">\
    <input type="number" id="temperature" name="temperature" placeholder="Temperature"></form>\
    <input type="file" id="img" name="image" accept="image/*">\
    <input type="text" id="apikey" name="apikey" placeholder="Admin Password">\
    <button type="submit" class="form-btn" id="newTea">MAKE new tea!</button>');

    $('#newTea').on('click', function() {
        const form = $("myform")[0];
        const fd = new FormData(form);
        console.log(fd.getAll());
        $.ajax({
            url: 'https://tea-api-vic-lo.herokuapp.com/tea/',
            type: 'post',
            data: fd,
            contentType: false,
            crossDomain: true,
            processData:false,
            headers:{
                "dataType": 'jsonp',   
                "Content-type": "application/javascript",
                 "apikey": $('#apikey').val()
            },
            success: function(data) {
                $('#display').html("<p>A new tea is born!</p><pre>"+JSON.stringify(data,null,4)+"</pre>")
            }
        });
    });
}
