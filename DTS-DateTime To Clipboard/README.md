# Project Title
Date-Time Copy to Clipboard

# Description
## Motivation
We use microsoft forms as our desktop support ticketing system where it uploads to a sharepoint list. On that list we have sections for comments and feedback. However, we write the date and the time in the those notes fields at the start of a new note that we add to any ongoing ticket. I got tired of manually writting out the date and time before writing my note. So I created this quick script and mapped it to a keyboard input to run when pressed.

## Details
I wrote this in both Python and C++. Python was very easy as there is a "copy to clipboard" library (typical of python). I really wanted to optimize speed though in this scenario as python is an interpreted language and it took a bit longer to run. C++ really sped things up and I learned a lot about having to allocate memory to copy the dateTime to the clipboard. It was a fun little project and works great! 

