
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

var canvas=document.getElementById('myCanvas');
var context = canvas.getContext('2d');

canvas.addEventListener('click', function(evt) {
        var mousePos = getMousePos(canvas, evt);

        document.getElementById("xcoor").value= mousePos.x;
        document.getElementById("ycoor").value= mousePos.y;

 }, false);



function previewFile(){

 //selects the first css <img> found
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();


//load image

  reader.addEventListener("load", function () {
  	//document.getElementById("myCanvas").style.backgroundImage = "url("+reader.result+")";
  	var preview = document.getElementById("myCanvas");
  	preview.style.backgroundImage="url("+reader.result+")";
  	//preview.style.
  	//document.querySelector('img').src=reader.result;
  	
  }, false);

  if (file) {
  	reader.readAsDataURL(file);
  	//$('#imagecontent').show();
  	//$('#searchbar').show();
  	document.getElementById("imagecontent").style.display='block';
  	document.getElementById("searchbar").style.display='block';
  	
  }
}

function viewpin(){
  var data =$('#socketid').val();
	$.ajax
  ({


      url: 'http://127.0.0.1:5000/pinassignment/'+data,
      type:'GET',
      dataType:'json',
      success: function(resp)
      {
        $("#loadentry").html("");
          if(resp.status =="ok")
          {
            for(i=0; i<resp.count; i++)
            {
              socketid =resp.entries[i].socketid;
              socketname =resp.entries[i].socketname;
              pinnum= resp.entries[i].pinnum;
              xcoor =resp.entries[i].xcoor;
              ycoor =resp.entries[i].ycoor;
                            
              $("#loadentry").append(rowentry(socketname, pinnum, xcoor, ycoor));
              $('#content').show();
            }
          }
      },
      error: function(err)
      {
        $("#content").html("");
        alert("Error in the code");
      }
  });
  
}

function rowentry(socketname, pinnum, xcoor, ycoor)
{
  
  return '<tr class="table-success">'+
      '<td>'+socketname+'</td>'+
      '<td>'+pinnum+'</td>'+
      '<td>'+xcoor+'</td>'+
      '<td>'+ycoor+'</td>'+
      '<td style="width:200px;"><button class="btn success" onclick="updatefoc();" style="background-color: #4CAF50;"  style="color: white;"><b>Update</b></button>'+
      '<button class="btn success" onclick= "deletefocal();" style="background-color: #f44336;"  style="color: white;"><b>Delete</b></button></td>'+
      '</tr>';
  
}

function assign(){
  $.ajax({
    data:{
      socketid: $('#socketid').val(),
      pinnum:$('#pinnum').val(),
      xcoor:$('#xcoor').val(),
      ycoor:$('#ycoor').val(),
    },
    url:'http://127.0.0.1:5000/pinassignment',
    type: "POST",
    dataType:"json",
    success:function(resp)
    {

      alert(resp.message);
    },
    error: function(err)
    {
      alert("Error in the system occurred");
    }

  });
}


