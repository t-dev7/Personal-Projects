


function changeFunction (checked) {

    if (checked) {
        document.getElementById("flex-trad").style.backgroundColor = "dodgerblue";
        document.getElementById("flex-dict").style.backgroundColor = "grey";
        document.getElementById("Dict-body").style.visibility = "hidden";
        document.getElementById("trad-body").style.visibility = "visible";
    }
    else {
        document.getElementById("flex-trad").style.backgroundColor = "grey";
        document.getElementById("flex-dict").style.backgroundColor = "red";
        document.getElementById("Dict-body").style.visibility = "visible";
        document.getElementById("trad-body").style.visibility = "hidden";

    }
    
   
}