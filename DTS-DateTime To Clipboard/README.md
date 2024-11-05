# Project Title
Date-Time Copy to Clipboard

# Description
Source files that grab the current Date in the format "mm/dd/yyyy - hh:mm am/pm" and copies it to the system clipboard.

## Motivation
At work we use microsoft forms as our desktop support ticketing system where it then uploads the ticket details to a sharepoint list. On that list we have sections for comments and feedback. In these fields we write the date and the time at the start of a new note or update to any ongoing ticket. However, I got tired of manually writting out the date and time when updating the note field. So I created this quick script and mapped it to a keyboard input to run when pressed.

## Details
I wrote this in both Python and C++. Python was very easy as there is a "copy to clipboard" library (typical of python). However, I really wanted to optimize speed in this scenario as python is an interpreted language and it took a bit longer to run. C++ really sped things up and I learned a lot about having to allocate memory to copy the dateTime to the clipboard. It was a fun little project and works great! 

