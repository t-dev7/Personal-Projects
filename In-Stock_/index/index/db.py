import sqlite3
import smtplib 

_reboot_bit = False
_reboot_label = ""
firstItem = ""

class DB:
    #Variables

    
    _dict = {}
    conn = sqlite3.connect('url.db', check_same_thread=False)
    cursor = conn.cursor()
         
    
###########################################################
################### Getter's & Setter's ###################


    def set_Reboot_Label(label):
        global _reboot_label
        _reboot_label = label
        
    def get_Reboot_Label():
        global _reboot_label
        return _reboot_label
    
    def set_Reboot_Bit(bit):
        global _reboot_bit
        _reboot_bit = bit
    
    def get_Reboot_Bit():
        global _reboot_bit
        return _reboot_bit
    
    def set_dict(dict):
        global _dict
        _dict = dict
        
    def get_dict():
        global _dict 
        return _dict   
    
    def get_firstItem():
        global firstItem
        return firstItem
    
    def set_firstItem(first):
        global firstItem
        firstItem = first
        
###########################################################   
###########################################################   
    def create():
        global conn
        global cursor
        
        #create table if doesnt exist
        DB.cursor.execute("CREATE TABLE IF NOT EXISTS url (link TEXT)")    
        
    #clear all contents of the database   
    def clear():
        DB.cursor.execute("DELETE FROM url")
        DB.conn.commit()

    #method to insert data into the database
    def insert(url):
        key = str(url)
        DB.cursor.execute("INSERT INTO url VALUES (?);", (key,))
        DB.conn.commit()
        
    def rebootEmail():
        content = ("The program crashed... Needs to be rebooted\n") 
        mail=smtplib.SMTP('smtp.gmail.com', 587)
        mail.ehlo()
        mail.starttls()
        sender='0code.emailer0@gmail.com'
        recipient='davistrevor68@gmail.com'
        mail.login('0code.emailer0@gmail.com','password')
        header='To:'+ recipient + '\n'+'From:' \
        +sender+'\n'+'subject:In-Stock Crashed\n'
        content=header + content
        content
        mail.sendmail(sender, recipient, content)
        mail.close()
    
    #check if program needs to be rebooted from a crash or close
    def needReboot():
        
        #check if there is any existing data in db on first insert data
        if(DB.cursor.execute("SELECT EXISTS (SELECT 1 FROM url)").fetchone()[0] == 1):
            
            
            DB.rebootEmail()
            
            #reboot_bit = True
            DB.set_Reboot_Bit(True)
            
            DB.cursor.execute("SELECT * FROM url")
            print("Rebooting\n")
            
            #reboot_label["text"] = "Click Reboot"
            DB.set_Reboot_Label("Click Reboot")

            dict = {}
            DB.set_firstItem(DB.cursor.fetchone())
            DB.cursor.execute("SELECT * FROM url")
            for row in DB.cursor:
                dict[row[0]] = "0"
                print("%s \n" % row[0])
            
            DB.set_dict(dict)
            
        return DB.get_Reboot_Bit()
    
    #method to delete data from database   
    def delete(url):
        DB.cursor.execute(
        "DELETE FROM url WHERE link = ?",
        (url,),
        ).fetchall()
        DB.conn.commit()

