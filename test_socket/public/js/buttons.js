function onFileChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    };

   function onReaderLoad(event){
        var graphObj = JSON.parse(event.target.result);
        graph.clear();
        graph.fromJSON(graphObj);
         console.log('loaded');
         socket.emit('load',graph.toJSON());   
    }


function readit() {

    $.ajax({
      type: "GET",
      dataType: "json",
      cache: false,
      url: "./graphfile.json",
      success: function (jsonString, textStatus, errorThrown) {
         graph.clear();  
         graph.fromJSON(jsonString);   
        }
     });
    }

function openit(filename) {
   var filename2 = filename.replace(/^.*\\/, "");
   console.log(filename2);
       $.ajax({
      type: "GET",
      dataType: "json",
      cache: false,
      url: "./extraFiles/"+filename2,
      success: function (jsonString, textStatus, errorThrown) {
         graph.clear();  
        }
     });
    saved = false;
}


function newit(){
    graph.clear();
    saved = false;

}

function saveit(){
     //document.location = 'data:Application/octet-stream,' + encodeURIComponent(JSON.stringify(graph.toJSON()));
    var outfile = document.getElementById("theFile").value;
    if (outfile == "") {var outfile2 = "buffer.json";}
    else {var outfile2 = outfile.replace(/^.*\\/, "");}
    $.ajax({
        type : "POST",
        url : "./writejson.php",
        dataType : 'json',
        data : {fileout : outfile2, data : JSON.stringify(graph.toJSON())},
    });
};


function clearit(){
if (saved) {
    graph.clear();
    saved = false;
    socket.emit('clear');
}
else {
    alert("Warning: You haven't saved the current graph");
    saved = true;
}
};

function saveitas(){
     //document.location = 'data:Application/octet-stream,' + encodeURIComponent(JSON.stringify(graph.toJSON()));
     var jsonout = JSON.stringify(graph.toJSON());
     saveAs(new Blob([jsonout], {type:"application/json"}), "buffer.json");
     saved = true;
     //graph.clear();
};

function pngit(){
//V(paper.svg).remove(hrr);
var svgDoc = paper.svg;
var serializer = new XMLSerializer();
var svgString = serializer.serializeToString(svgDoc);
saveAs(new Blob([svgString], {type:"application/svg+xml"}), "buffer.svg")

};