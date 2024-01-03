import tkinter as tk
import time
import smtplib
import requests
import sqlite3
from bs4 import BeautifulSoup
from threading import*
DELAY_TIME = 60 # seconds
dict = {}
dict_wait = {}
toDelete = []
val = ""
#global first_entry1
#global delete_bit
#global reboot_bit
first_entry1 = False
delete_bit = False  #boolean to skip going to method everytime if there is nothgin to delete
reboot_bit = False
#thread_bool =False

window = tk.Tk()

window.geometry("700x200")

#DEFINE METHODS ########################################################



#create a local data base (database meant to serve as backup in case program goes down)
#all of the looping is done through dictionary data structure for speed


def db_create():
    global conn
    conn = sqlite3.connect('url.db', check_same_thread=False)
    global cursor
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS url (link TEXT)")    #create table 
    
#method to check if database items need to be reloaded into dictionary data structure
def db_checkForReboot():
    #check if there is any existing data in db on first insert data
    if(cursor.execute("SELECT EXISTS (SELECT 1 FROM url)").fetchone()[0] == 1):
        global reboot_bit
        global thread_bool
        global reboot_label
        
        reboot_bit = True
        cursor.execute("SELECT * FROM url")
        print("Rebooting\n")
        reboot_label["text"] = "Click Reboot"
        for row in cursor:
            dict[row[0]] = "0"
            print("%s \n" % row[0])

def reboot():
    global reboot_bit
    global reboot_label
    
    reboot_label["text"] = ""
    threading()
        
        
    
#clear all contents of the database   
def db_clear():
    cursor.execute("DELETE FROM url")
    conn.commit()

#method to insert data into the database
def db_insert(url):
    key = str(url)
    cursor.execute("INSERT INTO url VALUES (?);", (key,))
    conn.commit()

#method to delete data from database   
def db_delete(url):
    cursor.execute(
    "DELETE FROM url WHERE link = ?",
    (url,),
    ).fetchall()
    conn.commit()
    
    
#method to show time since last update. Meant to be visual proof program running
def update_time_label():
    t = time.localtime()
    current_time = time.strftime("%H:%M:%S", t)
    time_label["text"] = "Last Updated: %s" % current_time
    
    
    
#method to send email when item is in stock
def send_email(url):
    content = ("This Item is Now in Stock\n %s" %url) 
    item = str(url)
    mail=smtplib.SMTP('smtp.gmail.com', 587)
    mail.ehlo()
    mail.starttls()
    sender='0code.emailer0@gmail.com'
    recipient='davistrevor68@gmail.com'
    mail.login('0code.emailer0@gmail.com','rbzr eosv canh znbb')
    header='To:'+ recipient + '\n'+'From:' \
    +sender+'\n'+'subject:Item in Stock!\n'
    content=header + content
    content
    mail.sendmail(sender, recipient, content)
    mail.close()

#method to search each url saved and check for in stock update
def processHTML(url):
    global toDelete 
    global delete_bit
    
    page = requests.get(url)

    soup = BeautifulSoup(page.content, "html.parser")

    # the search is case sensitive
    if(soup.find(string = "Sold out")):
        pass
    elif(soup.find(string = "Sold Out")):
        pass
    elif(soup.find(string = "SOLD OUT")):
        pass
    elif(soup.find(string = "sold out")):
        pass
    elif(soup.find(string = "Out of Stock")):
        pass
    elif(soup.find(string = "Out Of Stock")):
        pass
    elif(soup.find(string = "out of stock")):
        pass
    elif(soup.find(string = "Out of stock")):
        pass
    elif(soup.find(string = "OUT OF STOCK")):
        pass
    else:
        #send_email(url)         #send an email to notify you the item is in stock
        toDelete.append(url)    #list of url to remove from saved now that it is in stock
        delete_bit = True       
        print("In Stock")

#method to delete url's from saved list after they were in stock
def delete_instock():
    global delete_bit
    
    for x in toDelete:  #loop through url delete list
        del dict[x]     #delete dictionary entry
        db_delete(x)    #delete database entry
    toDelete.clear()    #clear the list
    delete_bit = False  #set boolean to false... no more items to delete

#method that checks if the key that was entered is already in the dictionary
def checkKey(dic, url):

    if url in dic.keys():           #loop through dictionary
        print("Already Tracking")
    else:                           #if it's not in the dictionary 
        dic[url] = "0"      #add it
        db_insert(url)              #insert the data into db


#inserts the url into the dictionary
def insertURL():
    global first_entry1
    global thread_bool
    global reboot_bit
    
    url = e1.get("1.0","end-1c")    #get text from textbox area
    
    if (first_entry1 == False and reboot_bit == False):      #if a entry has never been entered before
        dict[url] = "0"             #set the value to "sold out"
        e1.delete("1.0","end")      #clear the text box area
        first_entry1 = True
        db_insert(url)              #insert data
        threading()                 #start threading method
    elif(reboot_bit == True or first_entry1 == True):
        checkKey(dict, url)         
        e1.delete("1.0","end")      #clear text box area
        if(thread_bool == False):
            threading()

def call_thread():
    global thread_bool
    threading()
        
#thread to run web check and keep mainloop going at same time
def threading(): 
    # Call work function 
    t1=Thread(target=check_if_updated) 
    t1.start() 
    

#method to loop through dictionary and see if any of url's have been updated
def check_dictionary():
    global delete_bit
    
    if(len(dict) > 0):
        for x in dict.keys():
            processHTML(x)      #method to actually search url
        if(delete_bit == True): #if there are items to be deleted
            delete_instock()


#check the websites in the dictionary to see if they have been updated 
def check_if_updated():
    while True:
        
        check_dictionary()      #method
        update_time_label()
        

        #time.sleep(DELAY_TIME)  #after 1 loop, pause for 60 sec and then run again
        time.sleep(61)  #after 1 loop, pause for 60 sec and then run again
        
def main():
    
    print("")

#########################################################################

#text box creation
e1 = tk.Text(window, height = 5, width = 20) 
e1.grid(row=0,column=0)

global reboot_label
reboot_label=tk.Label(window, text="", font=('Aerial 12'))
reboot_label.grid(row=0,column=1)

print("Running...\n")
db_create()
db_checkForReboot()



global time_label
time_label=tk.Label(window, text="Last Updated: ", font=('Aerial 12'))
time_label.grid(row=1,column=1)


# Button Creation 
printButton = tk.Button(window, 
                        text = "Enter",  
                        command = insertURL)
printButton.grid(row=2,column=0) 

dbClear_Button = tk.Button(window, 
                        text = "Clear Database",  
                        command = db_clear)
dbClear_Button.grid(row=3,column=0) 

# Button Creation 
startButton = tk.Button(window, 
                        text = "Recover from reboot",  
                        command = reboot)
startButton.grid(row=4,column=0) 

window.mainloop()





