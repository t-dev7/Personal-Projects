# Password Generator
The pupose is to create a password generator that gives the user the ability to choose between two modes of password generation. One that is by randomly selected words from a dictionary separated by a dash "-", the second is the traditional randomized letter, number, symbol password generation. 

## What Each File Is
1. Dictionary.csv is a csv file of 10,000 dictionary words as a starting place to eventually grab random words from to generate a password
2. passPhrases.csv is the result of parsing through dictionary.csv and keeping any words that have more than 5 characters
3. HTMLPage1.html is the main html page for the front end of the webpage
4. JavaScript1.js is the Javascript file to change the highlight and visibility between the generation modes
5. server.js is supposed to be where the node.js server is create and the parsing of the dictionary.csv happens when it first starts up. (There will be a flag eventually to make sure it doesnt run everytime the server goes down and starts up.)
6. public/css is where the css file resides to style the html page with the custom slider and different flex-box orientations.


