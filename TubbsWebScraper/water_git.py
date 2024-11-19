#water_git

from datetime import datetime
from datetime import date
from datetime import timedelta
import requests
import sys
import json
from bs4 import BeautifulSoup
from threading import*
import multiprocessing as mp
import time 
import smtplib
import logging
import os
from logging.handlers import RotatingFileHandler
from logging.handlers import TimedRotatingFileHandler
from time import sleep


class sevenFeet:
    def __init__(self, data, dt):
        self.data = data       # json dictionary data
        self.dt = dt           # "Days Tracked"


class dates:
    def today(self):
        today = date.today()
        today = today.strftime("%Y%m%d")    # format for the search in URL
        return today
    
    #today "Normal Format"
    def todayNF():
        today = date.today()
        return today.strftime("%m-%d-%Y")
    
    #Formatting for comparing and printing 
    def todayWind(self):
       today = date.today()
       return today.strftime("%Y-%m-%d")
    
    def nextWeekWind(self):
        today = date.today()
        nextWeekWind = today + timedelta(weeks=1)
        return nextWeekWind.strftime("%m-%d-%Y")
    
    def beginDate(self):
        today = date.today()
        BeginDate = today + timedelta(weeks=1)
        return BeginDate.strftime("%Y%m%d") #format the days to match how the api queries the data


    def endDate(self):
        today = date.today()
        EndDate = today + timedelta(days=9) #end data processing for three days after the begin processing date
        return EndDate.strftime("%Y%m%d")
    
  
######################################################
#Global Variables
upTimeDays = 1
dateObj = dates()
initialGet = False
wCount = 0
checkWindFlag = False            # flag to tell system to check the wind data for specific days
checkWindCounter = 0             #count the days the wind checker has checked to make sure it falls within the three days of 7ft
toPop = False
daysInARow = 0      # counter for days in a row 7ft occurs

threeDaysList = []  # list of json data objects where the water level was greater than 7ft
threads= []         # list of threads
days = {}
threadNum = 0

################# LOGGER ####################################

logger = logging.getLogger("tubbs")

formatter = logging.Formatter('%(asctime)s - %(levelname)s - Line %(lineno)s: %(message)s')


#File Handler to rotate log files ever day and keep 8 backups
#fileHandler = TimedRotatingFileHandler(dates.todayNF() + "_log.log", when='d', interval=1, backupCount=8)
#File handler to rotate log files and rotate once file size reached 50KB
fileHandler = RotatingFileHandler("logs/" + dates.todayNF() + ".log", backupCount=7, maxBytes=50000)
fileHandler.setFormatter(formatter)

stdout = logging.StreamHandler(stream=sys.stdout)
logger.addHandler(fileHandler)
stdout.setLevel(logging.INFO)

logger.addHandler(stdout)
# Setting the threshold of logger to DEBUG
logger.setLevel(logging.INFO)
###############################################################

# deletes the data files if they are more than a week old
def deleteFile(f):
    global logger
    n = 7
    cwd = os.getcwd()

    os.chdir(os.path.join(os.getcwd(), f))
    fileList = os.listdir()
    ct = time.time()
    day = 86400
  

    for i in fileList:
        # get the location of the file 
        file_location = os.path.join(os.getcwd(), i) 
        # file_time is the time when the file is modified 
        file_time = os.stat(file_location).st_mtime 
    
        # if a file is modified before N days then delete it 
        if(file_time <= ct - day*n):
            logger.info("Delete : %s", i)  
            os.remove(file_location) 
    os.chdir(cwd)

###############################

def getParsedDay_List(date):
    try:
        split = " "         # character/string to split at
        result = ""         # String to return

        for i in date:
            result = i['t'].partition(split)[0]     # find only the first date and not the time of data set
            break                                   # exit loop after first find
    except Exception as error:
        logger.error("Trouble parsing the day  : %s", str(error))
    return result
#################################

# Function that get the first date of the data set in formatted form and returns it
def getParsedDay(date):
    split = " "         # character/string to split at
    result = ""         # String to return

    result = date['t'].partition(split)[0]     # find only the first date and not the time of data set
                                          

    return result
###################################

def send_email(message, subject):
    global logger
    try:
        content = message 
        mail=smtplib.SMTP('mail.vsfcd.com', 25)
        mail.ehlo()
        mail.starttls()
        sender='sender@domanin.com'
        recipient= ['recipient@domain.com']

        header='To:'+ ", ".join(recipient) + '\n'+'From:' \
        +sender+'\n'+'subject:' + subject + '\n\n'

        msg = header + content
        mail.sendmail(sender, recipient, msg)
        mail.close()
        logger.info("Email Sent")

    except Exception as error:
        logger.error("Water level email FAILED to send")
        

def send_error_email(message):
    try:
        content = message
        mail=smtplib.SMTP('mail.vsfcd.com', 25)
        mail.ehlo()
        mail.starttls()
        sender='sender@domanin.com'
        recipient= ['recipient@domain.com']


        header='To:'+ recipient + '\n'+'From:' \
        +sender+'\n'+'subject:Code Error\n\n'

        msg = header + content
        mail.sendmail(sender, recipient, msg)
        mail.close()
    except Exception as error:
        logger.error("Email level email FAILED to send")
        

###################################################


#send an email concerning water levels
def send_water_email(list):
    global logger
    


    try:
        content = ("Water levels of 7ft were found starting "+ str(dateObj.nextWeekWind()) +"\n" + str(list) + "\n\n" ) 
        mail=smtplib.SMTP('mail.vsfcd.com', 25)
        mail.ehlo()
        mail.starttls()
        sender='sender@domanin.com'
        recipient= ['recipient@domain.com']

        header='To:'+ ", ".join(recipient) + '\n'+'From:' \
        +sender+'\n'+'subject:Water Level Warning\n\n'

        msg = header + content
        mail.sendmail(sender, recipient, msg)
        mail.close()
        logger.info("Water level email sent")

    except Exception as error:
        logger.error("Water level email FAILED to send")
        send_error_email(error)
        

######################################################

   

# Function that finds if the water level meets or exceeds 7ft
def findWater(iCount):
    global daysInARow
    global threeDaysList
    global checkWindFlag
    vCount = 0          #counter for data points of 1 day in tideData
    sevenFound = False
    waterList = "Date             Time        Lvl\n-----------------------------------------\n"
    global logger

    tideURL = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&begin_date=" + dateObj.beginDate() + "&end_date=" + dateObj.endDate() + "&datum=NAVD&station=9414863&time_zone=lst_ldt&units=english&interval=&format=json"
    # Get URL Content
    try:
        logger.info("Getting data from tide URL")
        t = requests.get(tideURL)
        tsoup = BeautifulSoup(t.content, 'html.parser')
        tideData = tsoup.prettify()
        tideData = json.loads(tideData)
        v = tideData["predictions"]      #predictied tide level in feet

    except Exception as error:
        logger.critical("Error in findWater() get request: %s", str(error))
        send_error_email("Program has been termitated due to error obtaining water data, Error: " + str(error))
        sys.exit() 


    if(iCount == 0):    #to determine which data set is coming in through the multithread. (0=water levels, 1=wind speed)
        for i in v:     #loop through the dictionary of the predicted values for that day
            try:
                if(vCount < 239 and sevenFound == False):   # amount of data points for one day.
                    level = float(i["v"])                   # cast to float value
                    if(level >= 6.500):                      # if the level is greater than or equal to 7ft
                        logger.info("%s: %s - FOUND high level", i['t'], i['v'])
                        daysInARow += 1
                        sevenFound = True
                        waterList += (str(i['t']) + " - " + str(i['v']) + " ft - FOUND high level\n" )

                    vCount += 1
                
                elif(vCount < 239 and sevenFound == True):      # if seven feet was already found anytime during the day
                    vCount += 1
                    continue

                elif(vCount == 239 and sevenFound == False):    # if seven feet was not found at any point during a day
                    logger.info("%s: Water level does not exceed threshold", getParsedDay(i))
                    waterList += (getParsedDay(i) + ": Water level does not exceed threshold\n")
                    vCount = 0                                  # set the count back to 0 for the next day
                    daysInARow = 0
                
                elif(vCount == 239 and sevenFound == True):     # if it is the data point of the day and 7ft has been found
                    vCount = 0                                  # set the count back to 0 for the next day
                    sevenFound = False

            except Exception as error:
                
                logger.error("findWater() error: %s", str(error))
                send_error_email(str(error))


        if(daysInARow == 3):                    # if there are three days in a row of 7ft
            try:
                logger.info("High water levels were found: %s", getParsedDay_List(v))
 
                send_water_email(waterList)                            # send an email out (place holder)

                #reset variables for the next getRequest
                waterList = "Date             Time        Lvl\n-----------------------------------------\n"
                daysInARow = 0                                
                
                #creates json file to show the data for that day
                json_object = json.dumps(v, indent=2)
                with open("data/water/FOUND_" + dates.todayNF() + "_waterData.json", "w") as outfile:
                    outfile.write(json_object)
                deleteFile("data/water")

            except Exception as error:
                logger.error("Error at dayInARow == 3, stopping program: %s", str(error))
                send_error_email("Program was terminated due to error creating a dataObj. Error: " + str(error))
                sys.exit()
        else:
            #creates json file to show the data for that day
            json_object = json.dumps(v, indent=2)
            with open("data/water/" + dates.todayNF() + "_waterData.json", "w") as outfile:
                outfile.write(json_object)
            deleteFile("data/water")
        


# initial entry into the code at a specific time
while True:
    now = datetime.now()
    now = now.strftime("%H:%M:%S")
    sys.stdout.write("\r" + now)
    sys.stdout.flush()


    if(initialGet == True or  now == "00:07:00"):   # if the code has already been entered once or it is 12:07 am

        print("\nEntered main program loop at " + now + "\n")
        initialGet = True

        while True:
            findWater(0)

            #After a week send an email about the status of the data
            if(upTimeDays %7 == 0):                 #message                                                              subject
                send_email("One week check in\n Uptime: "+ str(upTimeDays), "Tubbs Status")

            sys.stdout.write("\r" + "Up Time: " + str(upTimeDays) + " day(s)\n")
            sys.stdout.flush()
            time.sleep(86400)   #wait for 24 hours
            os.system('cls')    # clear the terminal screen
            logger.info("Terminal Screen Cleared...")
            upTimeDays +=1
            
    


