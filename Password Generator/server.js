

var http = require('http');
const fs = require('fs');

const readline = require('readline');
var port = process.env.PORT || 1337;
const m_DictWords = new Map();
var wordCount = 0;

http.createServer(function (req, res) {
    fs.readFile('HTMLPage1.html', function (err, data) {
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
}).listen(port);




function init_DictLoad() {

        try {
            const data = fs.readFileSync('dictionary.csv', 'utf8');
            let writer = fs.createWriteStream('passPhrases.csv');
            const lines = data.split('\r\n');
            
            // loops through the dictionary of words that have a length greater than 5 characters
            for(let line of lines) {
                if (String(line).length > 5) {
                    m_DictWords.set(String(line), wordCount);   // maps words to increasing counter numbers
                    wordCount += 1; // increase the counter

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


init_DictLoad();