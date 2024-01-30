import tkinter as tk
import os
import sys
import time 
from time import sleep
import smtplib
import requests
from lxml.html import fromstring
import multiprocessing as mp
from db import DB
import pandas as pd
from bs4 import BeautifulSoup
from threading import*

#################
#Global Variables
#################
DELAY_TIME = 60 # seconds
dict = {}
firstItem = ""
toDelete = []
val = ""
first_entry1 = False
delete_bit = False  #boolean to skip going to method everytime if there is nothgin to delete
reboot_bit = False
proxies_ = []
pCount = 0
thePage = []
timeTrack = time.localtime()


window = tk.Tk()

window.geometry("700x200")

#DEFINE METHODS ########################################################



#create a local data base (database meant to serve as backup in case program goes down)
#all of the looping is done through dictionary data structure for speed

def get_proxies():
    url = 'https://free-proxy-list.net/'
    
    resp = requests.get(url)
    df = pd.read_html(resp.text)[0]

    proxies = []
    
    for i in df.index:
        if(df['Https'][i]=="yes"):
            proxy = str(df['IP Address'][i]) + ':' + str(df['Port'][i])
            proxies.append(proxy)

    return proxies

def restart():
    print('Restarting script...')
    os.execv(sys.executable, ['python'] + sys.argv)
    
    

def reboot():
    global reboot_bit
    global reboot_label
    global dict
    global timeTrack
    
    timeTrack = time.localtime()
    
    #t = time.localtime()
    current_time = time.strftime("%D, %I:%M:%S %p", timeTrack)
    reboot_label["text"] = "Reboot On: %s" % current_time
    
    threading(dict)
        
    
#method to show time since last update. Meant to be visual proof program running
def update_time_label():
    t = time.localtime()
    current_time = time.strftime("%I:%M:%S %p", t)
    time_label["text"] = "Last Updated: %s" % current_time
    
def noMoreUrlEmail():
        content = ("There are no more URL's to track\n") 
        mail=smtplib.SMTP('smtp.gmail.com', 587)
        mail.ehlo()
        mail.starttls()
        sender='0code.emailer0@gmail.com'
        recipient='davistrevor68@gmail.com'
        mail.login('0code.emailer0@gmail.com','password')
        header='To:'+ recipient + '\n'+'From:' \
        +sender+'\n'+'subject:In-Stock Finished\n'
        content=header + content
        content
        mail.sendmail(sender, recipient, content)
        mail.close()
    
#method to send email when item is in stock
def send_email(url):
    global dict
    content = ("This Item is Now in Stock\n %s" %url) 
    item = str(url)
    mail=smtplib.SMTP('smtp.gmail.com', 587)
    mail.ehlo()
    mail.starttls()
    sender='0code.emailer0@gmail.com'
    recipient='davistrevor68@gmail.com'
    mail.login('0code.emailer0@gmail.com','password')
    header='To:'+ recipient + '\n'+'From:' \
    +sender+'\n'+'subject:Item in Stock!\n'
    content=header + content
    content
    mail.sendmail(sender, recipient, content)
    mail.close()
    
def proxy_process(i, url, proxies, s, e):
    global thePage
    global stop_threads
    global firstItem
   
    print("This is thread %i \n" %i)
    if(stop_threads == True):
        return
    for j in range(s,e):
        try:
            page = requests.get(firstItem,proxies={"http": proxies[j], "https": proxies[j]},timeout=2)
            #if the page goes through...
            #loop through dictionary
            for link in dict:
                page = requests.get(dict[link],proxies={"http": proxies[j], "https": proxies[j]},timeout=2)
                thePage.append(page)
            
            
            
            print("Thread %i found the page at index:%i" % (i,j))
            stop_threads=True
            time.sleep(0.1)
            print("Closing Thread #%i" %i)
            return
        except:
            print("Not fount in thread %i : [%i]\n" % (i,j))
    print("Closing Thread #%i" %i)


       

#method to search each url saved and check for in stock update
def processHTML(url):
    global toDelete 
    global delete_bit
    global pCount
    global proxies_
    global thePage
    global stop_threads
    global firstItem

    threads = []
    stop_threads=False
    itCount = len(proxies_)/mp.cpu_count()
    itCount = int(itCount)
    itStart = 0
    itEnd = itCount-1
    
    #creating threads for checking proxies
    for i in range(mp.cpu_count()):
        t=Thread(target=proxy_process, args=(i, url, proxies_, itStart, itEnd)) 
        t.start()
        threads.append(t)  
        if(itCount+itEnd < len(proxies_)):
            if i == 0:
                itStart += itCount
            else:
                itStart += (itCount-1)
                
            itEnd += (itCount -1)
        else:
            itStart = itEnd
            itEnd = len(proxies_)-1
            t2=Thread(target=proxy_process, args=(i, url, proxies_, itStart, itEnd))
            t2.start() 
            threads.append(t2)
            break
        
    for t in threads:
        t.join()
         
    #just use own address if couldnt find 
    if(stop_threads == True):
        for i in len(dict):
            soup = BeautifulSoup(thePage[i].content, "html.parser")
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
                send_email(url)         #send an email to notify you the item is in stock
                toDelete.append(url)    #list of url to remove from saved now that it is in stock
                delete_bit = True       
                print("In Stock")
            
    else:
        for x in dict.keys():
            page = requests.get(x)
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
                send_email(url)         #send an email to notify you the item is in stock
                toDelete.append(url)    #list of url to remove from saved now that it is in stock
                delete_bit = True       
                print("In Stock")

#method to delete url's from saved list after they were in stock
def delete_instock():
    global delete_bit
    
    for x in toDelete:  #loop through url delete list
        del dict[x]     #delete dictionary entry
        DB.delete(x)    #delete database entry
    toDelete.clear()    #clear the list
    delete_bit = False  #set boolean to false... no more items to delete
    
    #after last 
    if(len(dict) == 0):
        noMoreUrlEmail()
        sys.exit(1)

#method that checks if the key that was entered is already in the dictionary
def checkKey(dic, url):

    if url in dic.keys():           #loop through dictionary
        print("Already Tracking")
    else:                           #if it's not in the dictionary 
        dic[url] = "0"      #add it
        DB.insert(url)              #insert the data into db


#inserts the url into the dictionary
def insertURL():
    global first_entry1
    global reboot_bit
    global firstItem
    global firstEntry_label
    
    firstEntry_label["text"] = ""
    
    url = e1.get("1.0","end-1c")    #get text from textbox area
    
    if (first_entry1 == False and reboot_bit == False):      #if a entry has never been entered before
        dict[url] = "0"             #set the value to "sold out"
        firstItem = url
        e1.delete("1.0","end")      #clear the text box area
        first_entry1 = True
        DB.insert(url)              #insert data
        threading(dict)                 #start threading method
    elif(reboot_bit == True or first_entry1 == True):
        checkKey(dict, url)         
        e1.delete("1.0","end")      #clear text box area
        if(reboot_bit == False):
            threading(dict)

        
#thread to run web check and keep mainloop going at same time
def threading(dict): 
    # Call work function 
    t1=Thread(target=check_if_updated, args = dict) 
    t1.start() 
    

#method to loop through dictionary and see if any of url's have been updated
def check_dictionary(dict):
    global delete_bit
    
    if(len(dict) > 0):
        processHTML(dict)      #method to actually search url
        if(delete_bit == True): #if there are items to be deleted
            delete_instock()


#check the websites in the dictionary to see if they have been updated 
def check_if_updated(dict):
    global timeTrack

    while True:
        global proxies_
        #if time elapsed is 24 hours, restart the code 
        t = time.mktime(time.localtime())-time.mktime(timeTrack)
        if(t >= 86400.0): 
            restart()
        
        
        
        #get updated proxies
        proxies_= get_proxies()
        
        check_dictionary(dict)      
        update_time_label()
        

        #time.sleep(DELAY_TIME)  #after 1 loop, pause for 60 sec and then run again
        time.sleep(61)  #after 1 loop, pause for 60 sec and then run again
        
def db_clear():
    DB.clear()
        


#########################################################################

#text box creation
e1 = tk.Text(window, height = 5, width = 20) 
e1.grid(row=0,column=0)

firstEntry_label=tk.Label(window, text="", font=('Aerial 12'))
firstEntry_label.grid(row=3,column=1)


reboot_label=tk.Label(window, text="", font=('Aerial 12'))
reboot_label.grid(row=0,column=1)


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


print("Running...\n")


DB.create()

if(DB.needReboot()):
    reboot_bit=DB.get_Reboot_Bit()
    dict = DB.get_dict()
    firstItem = DB.get_firstItem()
    reboot_label.config(text=DB.get_Reboot_Label())
    window.after(0,reboot)
else:
    firstEntry_label["text"] = "Please enter a url"


    
window.mainloop()





