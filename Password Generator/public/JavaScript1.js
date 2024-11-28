
function initStyle(){
  // init set hover background of the button to red
  document.getElementById("genButton").style.setProperty('--td-background-color', 'red');
  document.getElementById("genButton").style.transition = ".5s";
}

function changeFunction (checked) {

    
    if (checked) { //(TRADITIONAL GENERATION)

      //document.getElementById("resultLabel")

      document.getElementById("genButton").style.setProperty('--td-background-color', '#1e90ff');
      document.getElementById("genButton").style.transition = ".5s";
        

      // changes the background color and visibility when slider is checked
      document.getElementById("resultLabel").style.background ="rgba(19, 15, 248, 0.384)";
      document.getElementById("resultLabel").style.transition = "1s";
      
      document.getElementById("flex-trad").style.backgroundColor = "dodgerblue";
      document.getElementById("flex-trad").style.transition = "1s";
      
      document.getElementById("flex-dict").style.backgroundColor = "grey";
      document.getElementById("flex-dict").style.transition = "1s";

      document.getElementById("Dict-body").style.visibility = "hidden";
      document.getElementById("trad-body").style.visibility = "visible";

      // changes the font size when the slider is checked 
      document.getElementById("tradTitle").style.fontSize = "50px";
      document.getElementById("dictTitle").style.fontSize = "40px";
    }
    else { // (DICTIONARY GENERATION)

      //style result label on slider clicks
      document.getElementById("resultLabel").style.background ="rgba(248, 15, 15, 0.384)"; 
      document.getElementById("resultLabel").style.transition = "1s";
      
      // style generate button on slider clicks
      document.getElementById("genButton").style.setProperty('--td-background-color', '#ff0000');
      document.getElementById("genButton").style.transition = ".5s";

      
      document.getElementById("flex-trad").style.backgroundColor = "grey";
      document.getElementById("flex-trad").style.transition = "1s";

      document.getElementById("flex-dict").style.backgroundColor = "red";
      document.getElementById("flex-dict").style.transition = "1s";

      document.getElementById("Dict-body").style.visibility = "visible";
      document.getElementById("trad-body").style.visibility = "hidden";

      document.getElementById("tradTitle").style.fontSize = "40px";
      document.getElementById("dictTitle").style.fontSize = "50px";
    }
    
   
}// End changeFunction

//////////////////////////////////////////////////////////////////////////

function generate(){

    var checked = document.getElementById("switch").checked;

    
    var data = "";

    if(checked){
      var input = document.getElementById("numChars").value;
      var nodeList = document.querySelectorAll('input[id="cbTrad"]:checked');

      // Set a limit on how many characters they can enter
      if(input < 10 || input > 100){
        window.alert("Password length must be more than 10 and no greater than 100 characters");
        return;
      }

      // if no checkboxes were checked
      if(nodeList.length == 0){
        var tradCheckboxes = [""];
      }
      else{
      // for each checkbox node, grab the value attribute and add it to an array
        var tradCheckboxes = [];
        nodeList.forEach(node => {
          tradCheckboxes.push(String(node.value));
        });
      }

      //tradCheckboxes
      var body = JSON.stringify({
          value: checked,
          wordCount: input,
          check: tradCheckboxes,
          phrase:data
    
        });
    } //! END IF(CHECKED)

    else{
      // number of words to generate
      var numWords = document.getElementById("id_selectNumWords").value;
      // grab a nodeList of the checkBoxes the were checked
      var nodeList = document.querySelectorAll('input[id="cbDict"]:checked');

      // if no checkboxes were checked
      if(nodeList.length == 0){
        var dictCheckboxes = [""];
      }
      else{
      // for each checkbox node, grab the value attribute and add it to an array
        var dictCheckboxes = [];
        nodeList.forEach(node => {
          dictCheckboxes.push(String(node.value));
        });
      }

      // create json fomrat of data to send to server
      var body = JSON.stringify({
          value: checked,
          wordCount: numWords,
          check: dictCheckboxes,
          phrase: data
    
        });
    }//! END ELSE 

    // send variables to the server to process
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/genMethod");
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    
    // xhr.onload = () => {
    //   if (xhr.readyState == 4 && xhr.status == 201) {
    //     console.log(JSON.parse(xhr.responseText));
    //   } else {
    //     console.log(`Error: ${xhr.status}`);
    //   }
    // };
    xhr.responseType = 'json';
    xhr.send(body);
    
    xhr.onload = function() {
      console.log(xhr.response.phrase);
      var result = xhr.response.phrase;
      document.getElementById("resultLabel").innerHTML = String(result);
    };

    
}

