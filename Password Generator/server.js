
const express = require('express');

const app = express();
const PORT = 3000;
var http = require('http');
const fs = require('fs');

const readline = require('readline');

const m_DictWords = new Map();
const m_Symbols = new Map([[1, '!'], [2, '@'], [3, '#'], [4, '$'], [5, '%'], [6, '&']]);

var csvWordCount = 0;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // For form data

app.use(express.json()); // For JSON data

// Receive and respond to button click 
app.post('/genMethod', (req, res) => {
    var checked = req.body.value;       // Access the variable
    var wc = req.body.wordCount;        // how many words in generation
    var checkBoxes = req.body.check;    // which checkboxes were checked
    var data = "";
    

    
    // Dictionary method
    if(!checked){
        data = generateDict(wc, checkBoxes);
    }
    // Traditional Method
    else
        data = generateTrad(wc, checkBoxes);


     // Send a response back to the client
     var body = JSON.stringify({     
        value: checked,
        wordCount: wc,
        check: checkBoxes,
        phrase: data
      });
     res.status(200).send(body);
    
  });


app.listen(PORT, (error) =>{
    if(!error){
        console.log("Server is Successfully Running and App is listening on port "+ PORT);
        init_DictLoad();
    }
        else 
        console.log("Error occurred, server can't start", error);
    }
);
    
//!||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||


function init_DictLoad() {

        try {
            const data = fs.readFileSync('dictionary.csv', 'utf8');
            let writer = fs.createWriteStream('passPhrases.csv');
            const lines = data.split('\r\n');
            
            // loops through the dictionary of words that have a length greater than 5 characters
            for(let line of lines) {
                if (String(line).length > 5) {
                    m_DictWords.set(String(csvWordCount), String(line));   // maps words to increasing counter numbers                    
                    csvWordCount += 1; // increase the counter

                    line += ",\r\n";
                    writer.write(String(line));
                    
                    const values = line.split(',');
                    
                }
            }

            writer.end();

        } catch (err) {
            console.error(err);
        }

}

//!||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

// Random number generation
function random(max, min){
    var rand = (Math.floor(Math.random() * (max - min)) + min);
    return rand;
}

//!||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

function generateDict(wordCount, checkBoxes){
    var gen = "";       // Result
    var option = "";    // CheckBox determination

    // Checkboxes are in allocated to a number (e.g. 1, 2, 3...) in string format
    // For each element in the array of checkboxes, append it to "option" string
    checkBoxes.forEach((element) => {
        option += String(element);
    });
  
   
    // switch statement to handle checkboxes     
    switch (option) {
        case '0':   //* INCLUDE CAPS ******************************
            for(let i = 0; i < wordCount; i++){
                gen += replaceChar(m_DictWords.get(String(random(csvWordCount,0))), option);     // add number at beginning of word
                
                
                // Stop the programs from adding the separator "-" at the end 
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
            }
            break;

        case '1':   //* INCLUDE NUMBERS ******************
            for(let i = 0; i < wordCount; i++){
               
                // Random number gen to decide if the number is before or after the word
                if(random(2,0) == 0)
                    gen+= (String(random(10,0)) + m_DictWords.get(String(random(csvWordCount,0))));     // add number at beginning of word
                else
                    gen += (m_DictWords.get(String(random(csvWordCount,0))) + String(random(10,0)));    // add number at end
                
                // Stop the programs from adding the separator "-" at the end 
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ( "-");
                }
            }
            break;

        case '2':   //* REPLACE COMMON *******************
            for(let i = 0; i < wordCount; i++){

                // Call replaceChar method with random words as variable
                gen += replaceChar(m_DictWords.get(String(random(csvWordCount,0))), option);
                    
                if(i + 1 == wordCount){
                        // Do Nothing
                    }
                    else{
                        gen+= ("-");
                    }
                }
            break;
        
        case '3': //* NO SAME STARTING LETTER ******************
            var w1 = m_DictWords.get(String(random(csvWordCount,0)));
            var w2 = m_DictWords.get(String(random(csvWordCount,0)));
            var char = [];

            for(let i = 0; i < wordCount; i++){
                
                // If w1 first char == w2 first char, re-gen w2 until chars !=
                while (includes(char, w2.charAt(0))){
                    w2 = m_DictWords.get(String(random(csvWordCount,0)));
                }

                gen += w1;      // add w1 to result string
                w1 = w2;        // So we only have to pass one variable
                w2 = m_DictWords.get(String(random(csvWordCount,0)));        // clear w2 so if() above doesnt catch again          
                
                
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
                    
            }
            break;

        case "01":   //* CAPS & NUMBERS ******************************
            for(let i = 0; i < wordCount; i++){
                
                if(random(2,0) == 0)  
                    gen+= (String(random(10,0)) + replaceChar(m_DictWords.get(String(random(csvWordCount,0))), option));     // add number at beginning of word
                else
                    gen += (replaceChar(m_DictWords.get(String(random(csvWordCount,0))), option) + String(random(10,0)));     // add number at end
                

                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
            }   
            break;

        case "02":   //* Include Caps & Replace Common *************************
            for(let i = 0; i < wordCount; i++){
                gen += replaceChar(m_DictWords.get(String(random(csvWordCount,0))), option);
                    
                if(i + 1 == wordCount){
                        // Do Nothing
                    }
                else{
                    gen+= ("-");
                }
            }
            break;

        
        case '03':   //* Include Caps & No Same Starting **********************
            var w1 = m_DictWords.get(String(random(csvWordCount,0)));
            var w2 = m_DictWords.get(String(random(csvWordCount,0)));
            var char = [];

            for(let i = 0; i < wordCount; i++){
                
                while (includes(char, w2.charAt(0))){
                    w2 = m_DictWords.get(String(random(csvWordCount,0)));
                }

                gen += replaceChar(w1, option);
                w1 = w2;    // so that w2 gets passed into the replace function without having to allocate more mem
                w2 = m_DictWords.get(String(random(csvWordCount,0)));

                // Stop the programs from adding the separator "-" at the end 
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
            }
            
            break;

        case '12':  //* NUM AND REPLACE COMMON *************
            for(let i = 0; i < wordCount; i++){
                if(random(2,0) == 0)
                    gen+= (String(random(10,0)) + replaceChar(m_DictWords.get(String(random(csvWordCount,0))), option));     // add number at beginning of word
                else
                    gen += (replaceChar(m_DictWords.get(String(random(csvWordCount,0))), option) + String(random(10,0)));    // add number at end
                
               
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
            }
            break;

        case '13':  //* NUMS AND NO SAME STARTING
            var w1 = m_DictWords.get(String(random(csvWordCount,0)));
            var w2 = m_DictWords.get(String(random(csvWordCount,0)));
            var char = [];
        
            for(let i = 0; i < wordCount; i++){

                while (includes(char, w2.charAt(0))){
                    w2 = m_DictWords.get(String(random(csvWordCount,0)));
                }


                if(random(2,0) == 0)  
                    gen+= (String(random(10,0)) + w1);     // add number at beginning of word
                else
                    gen += (w1 + String(random(10,0)));     // add number at end

                w1 = w2;   
                w2 = m_DictWords.get(String(random(csvWordCount,0)));
                

                // Stop the programs from adding the separator "-" at the end 
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
                
            }
            
            break;


        case '23':   //* REPLACE COMMON AND NO SAME STARTING ********************** 
            var w1 = m_DictWords.get(String(random(csvWordCount,0)));
            var w2 = m_DictWords.get(String(random(csvWordCount,0)));
            var char = [];

            for(let i = 0; i < wordCount; i++){
                
                while (includes(char, w2.charAt(0))){
                    w2 = m_DictWords.get(String(random(csvWordCount,0)));
                }

                gen += replaceChar(w1, option); // if chars are not the same, then replace common nums/syms
                w1 = w2;    
                w2 = m_DictWords.get(String(random(csvWordCount,0)));
                
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
                    
            }
            break;

        case '012':   //* CAPS | NUMS | REPLACE ********************** 
            for(let i = 0; i < wordCount; i++){
                if(random(2,0) == 0)  
                    gen+= (String(random(10,0)) + replaceChar(m_DictWords.get(String(random(csvWordCount,0))), option));     // add number at beginning of word
                else
                    gen += (replaceChar(m_DictWords.get(String(random(csvWordCount,0))), option) + String(random(10,0)));
            
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
                }
            break;

        case '013':   //* CAPS | NUMS | NO SAME STARTING ********************** 
            var w1 = m_DictWords.get(String(random(csvWordCount,0)));
            var w2 = m_DictWords.get(String(random(csvWordCount,0)));
            var char = [];

            for(let i = 0; i < wordCount; i++){
                // If w1 first char == w2 first char, re-gen w2 until chars !=
                while (includes(char, w2.charAt(0))){
                    w2 = m_DictWords.get(String(random(csvWordCount,0)));
                }

                if(random(2,0) == 0)  
                    gen+= (String(random(10,0)) + replaceChar(w1, option));     // add number at beginning of word
                else
                    gen += (replaceChar(w1, option) + String(random(10,0)));

                w1 = w2;        // So we only have to pass one variable
                w2 = m_DictWords.get(String(random(csvWordCount,0)));        // clear w2 so if() above doesnt catch again 

                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
            }
            break;
        
        case '023':   //* CAPS | REPLACE | NO SAME STARTING ********************** 
            var w1 = m_DictWords.get(String(random(csvWordCount,0)));
            var w2 = m_DictWords.get(String(random(csvWordCount,0)));
            var char = [];

            for(let i = 0; i < wordCount; i++){

                while (includes(char, w2.charAt(0))){
                    w2 = m_DictWords.get(String(random(csvWordCount,0)));
                }

                gen += replaceChar(w1, option); // if chars are not the same, then replace common nums/syms
                w1 = w2;    
                w2 = m_DictWords.get(String(random(csvWordCount,0)));
                
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
            }

            break;

        case '123':   //* REPLACE COMMON | INCLUDE NUMS | NO SAME STARTING ********************** 
            var w1 = m_DictWords.get(String(random(csvWordCount,0)));
            var w2 = m_DictWords.get(String(random(csvWordCount,0)));
            var char = [];

            for(let i = 0; i < wordCount; i++){

                while (includes(char, w2.charAt(0))){
                    w2 = m_DictWords.get(String(random(csvWordCount,0)));
                }

                if(random(2,0) == 0)  
                    gen+= (String(random(10,0)) + replaceChar(w1, option));     
                else
                    gen += (replaceChar(w1, option) + String(random(10,0)));

                w1 = w2;    
                w2 = m_DictWords.get(String(random(csvWordCount,0)));
                
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
            }
            break;
        
        case '0123':   //* ALL ********************** 
            var w1 = m_DictWords.get(String(random(csvWordCount,0)));
            var w2 = m_DictWords.get(String(random(csvWordCount,0)));
            var char = [];

            for(let i = 0; i < wordCount; i++){
                char.push(w1.charAt(0));

                while (includes(char, w2.charAt(0))){
                    w2 = m_DictWords.get(String(random(csvWordCount,0)));
                }
               
                if(random(2,0) == 0)  
                    gen+= (String(random(10,0)) + replaceChar(w1, option));     
                else
                    gen += (replaceChar(w1, option) + String(random(10,0)));

                w1 = w2;    
                w2 = m_DictWords.get(String(random(csvWordCount,0))); //? Will we keep this? This was a quick fix to grab the 3rd & 4th word to be generated.
                
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
            }
            break;
            
 
        default:    //* NOTHING CHECKED ****************
            for(let i = 0; i < wordCount; i++){
                gen+= m_DictWords.get(String(random(csvWordCount, 0)));

                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
            }
            break;
    }

    return gen;
} 

//!||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

//TODO: Inside
function generateTrad(charCount, checkBoxes){
    gen = "";

    var numCount = 0;
    var symCount = 0;
    var upCount = 0;

    option = "";
    checkBoxes.forEach((element) => {
        option += String(element);
    });

  
    switch (option) {
        
        case '1':   // include numbers
            for(var i = 0; i < charCount; i++){

                if(random(3,0) == 0){
                    gen += String(random(9,0));
                    numCount += 1;
                }
                else
                    gen += String.fromCharCode(random(122, 97));

            }
            
            break;

        case '12':  //include nums and replace common
            for(var i = 0; i < charCount; i++){

                if(random(4,0) == 0){       // rand num chance
                    gen += String(random(9,0));
                    numCount += 1;
                }
                else if(random(4,0) == 0){
                    gen += m_Symbols.get((random(6,1)));
                    symCount += 1;
                }   
                else
                    gen += String.fromCharCode(random(122, 97)); // regular char

            }
            break;

        case '13':  // include nums and no same starting
            for(var i = 0; i < charCount; i++){

                if(random(4,0) == 0){       // rand num chance
                    gen += String(random(9,0));
                    numCount += 1;
                }
                else if(random(3,0) == 0){        // rand num chance
                    gen += (String.fromCharCode(random(122, 97))).toUpperCase(); 
                    upCount += 1;
                }    //rand sym chance
                else
                    gen += String.fromCharCode(random(122, 97)); // regular char

            }
            break;

        case '2':   // Replace common
            for(var i = 0; i < charCount; i++){

                if(random(4,0) == 0){
                    gen += m_Symbols.get((random(6,1)));
                    symCount += 1;
                }
                else
                    gen += String.fromCharCode(random(122, 97));

            }
            break;

        case '23':   // Replace common and no same starting 
            for(var i = 0; i < charCount; i++){

                if(random(4,0) == 0){
                    gen += m_Symbols.get((random(6,1)));
                    symCount += 1;
                }
                else if(random(3,0) == 0){        // rand num chance
                    gen += (String.fromCharCode(random(122, 97))).toUpperCase(); 
                    upCount += 1;
                }    //rand sym chance
                else
                    gen += String.fromCharCode(random(122, 97)); // regular char

            }
            break;

            
        case '3': //  No same starting letter   
            for(var i = 0; i < charCount; i++){

                if(random(3,0) == 0){        // rand num chance
                    gen += (String.fromCharCode(random(122, 97))).toUpperCase(); 
                    upCount += 1;
                }
                else
                    gen += String.fromCharCode(random(122, 97)); // regular char

            }
            break;

        case '123':
            for(var i = 0; i < charCount; i++){

                if(random(4,0) == 0){
                    gen += m_Symbols.get((random(6,1)));
                    symCount += 1;
                }
                else if(random(3,0) == 0){        // rand num chance
                    gen += (String.fromCharCode(random(122, 97))).toUpperCase(); 
                    upCount += 1;
                }    //rand sym chance
                else if(random(4,0) == 0){       // rand num chance
                    gen += String(random(9,0));
                    numCount += 1;
                }
                else
                    gen += String.fromCharCode(random(122, 97)); // regular char

            }
            break;
        default:
            for(var i = 0; i < charCount; i++){
                gen += String.fromCharCode(random(122, 97))
            }
            break;
    }

    //TODO: Check to make sure that there is at LEAST ONE of whatever checked item was chosen
    //TODO: probably do this at the case level. Try to fancy it up by not just putting it at the end
    //TODO: Maybe use random() to grab a place in the string and replace that char
    //TODO: Add the char Position (charAt(i)) to some type of array not to accidentaly replace
    //TODO: the char we just replaced.

    return gen;
}   
   
//!||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

//TODO: Inside
function replaceChar(word, option){
    var result = "";

    //* Any option that includes '2' excluding '0'
    if(includes(option, '2') && !includes(option, '0')){
        console.log("Entered condition exclude 0");
        for(i = 0; i < word.length; i++){

            switch(word.charAt(i)){
                case 'a':
                case 'A':
                    if(random(3,0)==0)
                        result += '@';
                    else
                        result += word.charAt(i);
                    
                    break;
    
                case 'i':
                case 'I':
                    if(random(3,0)==0)
                        result += '1';
                    else
                        result += word.charAt(i);
                    break;
                
                case 'o':
                case 'O':
                    if(random(3,0)==0)
                        result += '0';
                    else
                        result += word.charAt(i);
                    break;
    
                case 'e':
                case 'E':
                    if(random(3,0)==0)
                        result += '3';
                    else
                        result += word.charAt(i);
                    break;
    
                case 's':
                case 'S':
                    if(random(3,0)==0)
                        result += '$';
                    else
                        result += word.charAt(i);
                    break;
                
                
                default:
                    result += word.charAt(i);
                    break;
            }
        }
    }

    //* Any option that includes '0' excluding '2'
    else if(!includes(option, '2') && includes(option, '0')){
        tempChar = '';
        for(i = 0; i < word.length; i++){
            if(random(11,0) > 8){
                result += word.charAt(i).toUpperCase();
            }
            else
                result += word.charAt(i);
        }
    }
    
    //TODO: DOUBLE LETTERING AND SYMBOLING 
    //* Any option that includes both '0' and '2'
    else if(includes(option, '2') && includes(option, '0')){ 
        tempChar = '';

        // We cant have a letter that can be replaced with a number or symbol also be capitalized.
        // if the letter can be replaced with a num or sym, "flip a coin" to see if it should be replaced
        // if it WONT be replaced, then "roll dice" to see if it should be caps
        // if it WILL be replaced, then dont "roll dice" and move on to next char
        for(i = 0; i < word.length; i++){
            switch(word.charAt(i)){
                case 'a':
                case 'A':
                    // If it lands on desired outcome replace with sym/num
                    if(random(3,0)==0)    
                        result += '@';

                    // If not, then "roll dice" to see if it will be capitalized
                    else{
                        if(random(4,0)==0){
                            tempChar = word.charAt(i);
                            result += tempChar.toUpperCase();
                        }
                        else
                            result += word.charAt(i);
                    }
                    break;
    
                case 'i':
                case 'I':
                    if(random(3,0)==0)
                        result += '1';
                    else{
                        if(random(4,0)==0){
                            tempChar = word.charAt(i);
                            result += tempChar.toUpperCase();
                        }
                        else
                            result += word.charAt(i);
                    }
                    break;
                
                case 'o':
                case 'O':
                    if(random(3,0)==0)
                        result += '0';
                    else{
                        if(random(4,0)==0){
                            tempChar = word.charAt(i);
                            result += tempChar.toUpperCase();
                        }
                        else
                            result += word.charAt(i);
                    }
                    break;
    
                case 'e':
                case 'E':
                    if(random(3,0)==0)
                        result += '3';
                    else{
                        if(random(4,0)==0){
                            tempChar = word.charAt(i);
                            result += tempChar.toUpperCase();
                        }
                        else
                            result += word.charAt(i);
                    }
    
                case 's':
                case 'S':
                    if(random(3,0)==0)
                        result += '$';
                    else{
                        if(random(4,0)==0){
                            tempChar = word.charAt(i);
                            result += tempChar.toUpperCase();
                        }
                        else
                            result += word.charAt(i);
                    }
                    break;
                
                
                default:
                    if(random(4,0)==0){
                        tempChar = word.charAt(i);
                        result += tempChar.toUpperCase();
                    }
                    else
                        result += word.charAt(i);
                    break;
            }
        }
    }
    return result;
}

function includes(option, char){
    for(var i = 0; i < option.length; i++){
        if (option.charAt(i) == char)
            return true;
    }
    return false;
}

function includes(charArray, char){
    for(var i = 0; i < charArray.length; i++){
        if (charArray[i] == char)
            return true;
    }
    return false;
}
