import pyperclip as pc
import datetime as dt

x = dt.datetime.now()
time = x.strftime("%m/%d/%Y - %I:%M%p -")
pc.copy(time)

