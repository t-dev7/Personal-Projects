

function changeFunction (checked) {

    
    if (checked) { //(TRADITIONAL GENERATION)
        

        // changes the background color and visibility when slider is checked
        document.getElementById("flex-trad").style.backgroundColor = "dodgerblue";
        document.getElementById("flex-dict").style.backgroundColor = "grey";
        document.getElementById("Dict-body").style.visibility = "hidden";
        document.getElementById("trad-body").style.visibility = "visible";

        // changes the font size when the slider is checked 
        document.getElementById("tradTitle").style.fontSize = "50px";
        document.getElementById("dictTitle").style.fontSize = "40px";
    }
    else { // (DICTIONARY GENERATION)
       

        document.getElementById("flex-trad").style.backgroundColor = "grey";
        document.getElementById("flex-dict").style.backgroundColor = "red";
        document.getElementById("Dict-body").style.visibility = "visible";
        document.getElementById("trad-body").style.visibility = "hidden";

        document.getElementById("tradTitle").style.fontSize = "40px";
        document.getElementById("dictTitle").style.fontSize = "50px";
    }
    
   
}// End changeFunction

//////////////////////////////////////////////////////////////////////////

function generate(){

    var checked = document.getElementById("switch").checked;

    // number of words to generate
    var numWords = document.getElementById("id_selectNumWords").value;

    if(checked){
        var nodeList = document.querySelectorAll('input[id="cbTrad"]:checked').values();
        //tradCheckboxes
        var body = JSON.stringify({
            value: checked,
            wordCount: numWords,
            check: tradCheckboxes
      
          });
    }
    else{
        var nodeList = document.querySelectorAll('input[id="cbDict"]:checked');
        var dictCheckboxes = [];

        nodeList.forEach(node => {
            dictCheckboxes.push(node.value);
          });

        
        var body = JSON.stringify({
            value: checked,
            wordCount: numWords,
            check: dictCheckboxes
      
          });
    }

    // send variables to the server to process
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/genMethod");
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 201) {
        console.log(JSON.parse(xhr.responseText));
      } else {
        console.log(`Error: ${xhr.status}`);
      }
    };
    xhr.send(body);

}

