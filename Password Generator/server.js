
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


app.post('/genMethod', (req, res) => {
    var checked = req.body.value; // Access the variable
    var wordCount = req.body.wordCount;
    var checkBoxes = req.body.check;

    if(!checked)
        generateDict(wordCount, checkBoxes);
    else
        generateTrad(wordCount, checkBoxes);

    console.log(checkBoxes);

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

function random(int){
    return (Math.floor(Math.random() * int));
}
//////////////////////////////////////////////////////////////////////////

function generateDict(wordCount, checkBoxes){
    var gen = "";

    option = "";
    checkBoxes.forEach((element) => {
        option += String(element);
    });

    //! Testing
    console.log(option);
  
   
            
    switch (option) {
        
        case '1':   // include numbers
            for(let i = 0; i < wordCount; i++){
                if(random(2) == 0)
                    gen+= (String(random(10)) + m_DictWords.get(String(random(csvWordCount))));     // add number at beginning of word
                else
                    gen += (m_DictWords.get(String(random(csvWordCount))) + String(random(10)))     // add number at end
                
                // Stop the programs from adding the separator "-" at the end 
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ( "-");
                }
            }
            console.log(gen);
            break;

        case '12':  //include nums and replace common
            for(let i = 0; i < wordCount; i++){
                if(random(2) == 0)
                    gen+= (String(random(10)) + replaceChar(m_DictWords.get(String(random(csvWordCount)))));     // add number at beginning of word
                else
                    gen += (replaceChar(m_DictWords.get(String(random(csvWordCount)))) + String(random(10)))     // add number at end
                
                // Stop the programs from adding the separator "-" at the end 
                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
            }
            console.log(gen);
            break;

        case '13':  // include nums and no same starting
            
            console.log(option);
            break;

        case '2':   // Replace common
            for(let i = 0; i < wordCount; i++){
                gen += (replaceChar(m_DictWords.get(String(random(csvWordCount)))));
                    if(i + 1 == wordCount){
                        // Do Nothing
                    }
                    else{
                        gen+= ("-");
                    }
                }
            console.log(gen);
            break;

        case '23':   // Replace common and no same starting 
            console.log(option);
            break;

            
        case '3': //  No same starting letter   
            
            console.log(option);
            break;
        
        default:
            for(let i = 0; i < wordCount; i++){
                gen+= m_DictWords.get(String(random(csvWordCount)));

                if(i + 1 == wordCount){
                    // Do Nothing
                }
                else{
                    gen+= ("-");
                }
            }
            console.log(gen);
            break;
    }
} 
 

function generateTrad(wordCount, checkBoxes){
    gen = "";

    option = "";
    checkBoxes.forEach((element) => {
        option += String(element);
    });

    console.log(option);
  
    switch (option) {
        
        case '1':   // include numbers
            
            console.log(option);
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
   

function replaceChar(word){


    var result = "";
    for(i = 0; i < word.length; i++)

        switch(word.charAt(i)){
            case 'a':
            case 'A':
                result += '@';
                break;

            case 'i':
            case 'I':
                result += '1';
                break;
            
            
            
            default:
                result += word.charAt(i);
        }

    return result;
}