
const express = require('express');

const app = express();
const PORT = 3000;
var http = require('http');
const fs = require('fs');

const readline = require('readline');

const m_DictWords = new Map();

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
function random(int){
    return (Math.floor(Math.random() * int));
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
                gen += replaceChar(m_DictWords.get(String(random(csvWordCount))), option);     // add number at beginning of word
                
                
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
                if(random(2) == 0)
                    gen+= (String(random(10)) + m_DictWords.get(String(random(csvWordCount))));     // add number at beginning of word
                else
                    gen += (m_DictWords.get(String(random(csvWordCount))) + String(random(10)));    // add number at end
                
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
                gen += replaceChar(m_DictWords.get(String(random(csvWordCount))), option);
                    
                if(i + 1 == wordCount){
                        // Do Nothing
                    }
                    else{
                        gen+= ("-");
                    }
                }
            break;
        
        case '3': //* NO SAME STARTING LETTER ******************
            var w1 = m_DictWords.get(String(random(csvWordCount)));
            var w2 = m_DictWords.get(String(random(csvWordCount)));
            for(let i = 0; i < wordCount; i++){
                
                // If w1 first char == w2 first char, re-gen w2 until chars !=
                if(w1.charAt(0) == w2.charAt(0)){
                    while (w1.charAt(0) == w2.charAt(0)){
                        w2 = m_DictWords.get(String(random(csvWordCount)));
                    }
                }

                gen += w1;      // add w1 to result string
                w1 = w2;        // So we only have to pass one variable
                w2 = "";        // clear w2 so if() above doesnt catch again          
                
                
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
                
                if(random(2) == 0)  
                    gen+= (String(random(10)) + replaceChar(m_DictWords.get(String(random(csvWordCount))), option));     // add number at beginning of word
                else
                    gen += (replaceChar(m_DictWords.get(String(random(csvWordCount))), option) + String(random(10)));     // add number at end
                

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
                gen += replaceChar(m_DictWords.get(String(random(csvWordCount))), option);
                    
                if(i + 1 == wordCount){
                        // Do Nothing
                    }
                else{
                    gen+= ("-");
                }
            }
            break;

        
        case '03':   //* Include Caps & No Same Starting **********************
            var w1 = m_DictWords.get(String(random(csvWordCount)));
            var w2 = m_DictWords.get(String(random(csvWordCount)));
            for(let i = 0; i < wordCount; i++){
                
                if(w1.charAt(0) == w2.charAt(0))
                    while (w1.charAt(0) == w2.charAt(0)){
                        w2 = m_DictWords.get(String(random(csvWordCount)));
                    }

                gen += replaceChar(w1, option);
                w1 = w2;    // so that w2 gets passed into the replace function without having to allocate more mem
                w2 = "";

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
                if(random(2) == 0)
                    gen+= (String(random(10)) + replaceChar(m_DictWords.get(String(random(csvWordCount))), option));     // add number at beginning of word
                else
                    gen += (replaceChar(m_DictWords.get(String(random(csvWordCount))), option) + String(random(10)));    // add number at end
                
               
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
            }
            break;

        case '13':  //* NUMS AND NO SAME STARTING
            var w1 = m_DictWords.get(String(random(csvWordCount)));
            var w2 = m_DictWords.get(String(random(csvWordCount)));
        
            for(let i = 0; i < wordCount; i++){
                if(w1.charAt(0) == w2.charAt(0))
                    while (w1.charAt(0) == w2.charAt(0)){
                        w2 = m_DictWords.get(String(random(csvWordCount)));
                    }


                if(random(2) == 0)  
                    gen+= (String(random(10)) + w1);     // add number at beginning of word
                else
                    gen += (w1 + String(random(10)));     // add number at end

                w1 = w2;   
                w2 = "";
                

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
            var w1 = m_DictWords.get(String(random(csvWordCount)));
            var w2 = m_DictWords.get(String(random(csvWordCount)));
            for(let i = 0; i < wordCount; i++){
                
                if(w1.charAt(0) == w2.charAt(0))
                    while (w1.charAt(0) == w2.charAt(0)){
                        w2 = m_DictWords.get(String(random(csvWordCount)));
                    }

                gen += replaceChar(w1, option); // if chars are not the same, then replace common nums/syms
                w1 = w2;    
                w2 = "";
                
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
                    
            }
            break;

        case '012':   //* CAPS | NUMS | REPLACE ********************** 
        //TODO: Has problem sometimes where 'e' gets duplicated
            for(let i = 0; i < wordCount; i++){
                if(random(2) == 0)  
                    gen+= (String(random(10)) + replaceChar(m_DictWords.get(String(random(csvWordCount))), option));     // add number at beginning of word
                else
                    gen += (replaceChar(m_DictWords.get(String(random(csvWordCount))), option) + String(random(10)));
            
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
                }
            break;

        case '013':   //* CAPS | NUMS | NO SAME STARTING ********************** 
            var w1 = m_DictWords.get(String(random(csvWordCount)));
            var w2 = m_DictWords.get(String(random(csvWordCount)));
            for(let i = 0; i < wordCount; i++){
                // If w1 first char == w2 first char, re-gen w2 until chars !=
                if(w1.charAt(0) == w2.charAt(0)){
                    while (w1.charAt(0) == w2.charAt(0)){
                        w2 = m_DictWords.get(String(random(csvWordCount)));
                    }
                }

                if(random(2) == 0)  
                    gen+= (String(random(10)) + replaceChar(w1, option));     // add number at beginning of word
                else
                    gen += (replaceChar(w1, option) + String(random(10)));

                w1 = w2;        // So we only have to pass one variable
                w2 = "";        // clear w2 so if() above doesnt catch again 

                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
            }
            break;
        
        case '023':   //* CAPS | REPLACE | NO SAME STARTING ********************** 
            var w1 = m_DictWords.get(String(random(csvWordCount)));
            var w2 = m_DictWords.get(String(random(csvWordCount)));
            for(let i = 0; i < wordCount; i++){
                if(w1.charAt(0) == w2.charAt(0)){
                    while (w1.charAt(0) == w2.charAt(0)){
                        w2 = m_DictWords.get(String(random(csvWordCount)));
                    }
                }

                gen += replaceChar(w1, option); // if chars are not the same, then replace common nums/syms
                w1 = w2;    
                w2 = "";
                
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
            }

            break;

        case '123':   //* REPLACE COMMON | INCLUDE NUMS | NO SAME STARTING ********************** 
            var w1 = m_DictWords.get(String(random(csvWordCount)));
            var w2 = m_DictWords.get(String(random(csvWordCount)));
            for(let i = 0; i < wordCount; i++){
                if(w1.charAt(0) == w2.charAt(0)){
                    while (w1.charAt(0) == w2.charAt(0)){
                        w2 = m_DictWords.get(String(random(csvWordCount)));
                    }
                }

                if(random(2) == 0)  
                    gen+= (String(random(10)) + replaceChar(w1, option));     
                else
                    gen += (replaceChar(w1, option) + String(random(10)));

                w1 = w2;    
                w2 = "";
                
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
            }
            break;
        
        case '0123':   //* ALL ********************** 
            var w1 = m_DictWords.get(String(random(csvWordCount)));
            var w2 = m_DictWords.get(String(random(csvWordCount)));
            for(let i = 0; i < wordCount; i++){

                //TODO: Revise this statement to search for a list of first chars that have been used.
                //TODO: This statement doesnt truly make all the chars different. It was only used when testing when user chose to gen 2 words.
                if(w1.charAt(0) == w2.charAt(0)){   
                    while (w1.charAt(0) == w2.charAt(0)){
                        w2 = m_DictWords.get(String(random(csvWordCount)));
                    }
                }

                if(random(2) == 0)  
                    gen+= (String(random(10)) + replaceChar(w1, option));     
                else
                    gen += (replaceChar(w1, option) + String(random(10)));

                w1 = w2;    
                w2 = m_DictWords.get(String(random(csvWordCount))); //? Will we keep this? This was a quick fix to grab the 3 word to be generated.
                
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
                gen+= m_DictWords.get(String(random(csvWordCount)));

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


function generateTrad(wordCount, checkBoxes){
    gen = "";

    option = "";
    checkBoxes.forEach((element) => {
        option += String(element);
    });

    console.log(option);
  
    switch (option) {
        
        case '1':   // include numbers
            
            console.log(gen);
            break;

        case '12':  //include nums and replace common
            
            console.log(option);
            break;

        case '13':  // include nums and no same starting
            
            console.log(option);
            break;

        case '2':   // Replace common
            console.log(option);
            break;

        case '23':   // Replace common and no same starting 
            console.log(option);
            break;

            
        case '3': //  No same starting letter   
            
            console.log(option);
            break;
        
        default:
            let x = "no";
            break;
    }
}   
   
//!||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||


function replaceChar(word, option){
    var result = "";

    //* Any option that includes '2' excluding '0'
    if(includes(option, '2') && !includes(option, '0')){
        console.log("Entered condition exclude 0");
        for(i = 0; i < word.length; i++){

            switch(word.charAt(i)){
                case 'a':
                case 'A':
                    if(random(3)==0)
                        result += '@';
                    else
                        result += word.charAt(i);
                    
                    break;
    
                case 'i':
                case 'I':
                    if(random(3)==0)
                        result += '1';
                    else
                        result += word.charAt(i);
                    break;
                
                case 'o':
                case 'O':
                    if(random(3)==0)
                        result += '0';
                    else
                        result += word.charAt(i);
                    break;
    
                case 'e':
                case 'E':
                    if(random(3)==0)
                        result += '3';
                    else
                        result += word.charAt(i);
                    break;
    
                case 's':
                case 'S':
                    if(random(3)==0)
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
        console.log("Entered condition exclude 2");
        tempChar = '';
        for(i = 0; i < word.length; i++){
            if(random(11) > 8){
                tempChar = word.charAt(i);
                result += tempChar.toUpperCase();
            }
            else
                result += word.charAt(i);
        }
    }
    
    //* Any option that includes both '0' and '2'
    else if(includes(option, '2') && includes(option, '0')){ 
        console.log("Entered condition has 0 and 2");
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
                    if(random(3)==0)    
                        result += '@';

                    // If not, then "roll dice" to see if it will be capitalized
                    else{
                        if(random(4)==0){
                            tempChar = word.charAt(i);
                            result += tempChar.toUpperCase();
                        }
                        else
                            result += word.charAt(i);
                    }
                    break;
    
                case 'i':
                case 'I':
                    if(random(3)==0)
                        result += '1';
                    else{
                        if(random(4)==0){
                            tempChar = word.charAt(i);
                            result += tempChar.toUpperCase();
                        }
                        else
                            result += word.charAt(i);
                    }
                    break;
                
                case 'o':
                case 'O':
                    if(random(3)==0)
                        result += '0';
                    else{
                        if(random(4)==0){
                            tempChar = word.charAt(i);
                            result += tempChar.toUpperCase();
                        }
                        else
                            result += word.charAt(i);
                    }
                    break;
    
                case 'e':
                case 'E':
                    if(random(3)==0)
                        result += '3';
                    else{
                        if(random(4)==0){
                            tempChar = word.charAt(i);
                            result += tempChar.toUpperCase();
                        }
                        else
                            result += word.charAt(i);
                    }
    
                case 's':
                case 'S':
                    if(random(3)==0)
                        result += '$';
                    else{
                        if(random(4)==0){
                            tempChar = word.charAt(i);
                            result += tempChar.toUpperCase();
                        }
                        else
                            result += word.charAt(i);
                    }
                    break;
                
                
                default:
                    if(random(4)==0){
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

