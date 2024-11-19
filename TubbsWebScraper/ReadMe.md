# Tide Data WebScraper
Grabs tide data and sends and email when the tides are above a certain height.

# Specifics
Grabs NAVD tide level predictions one week in advance. The program sends an email when if one week in advance, there are 3 consecutive days of tide levels above 6.5 ft. The programs runs once a day starting at 12:07 AM. It has a logging systems to keep track of what is going on and if there are any errors. It also dumbs the JSON value (neatly) in subdirectories and deletes them after one week. The program also renames the JSON files to the date in which they pertain to and also includes a renaming convension when there is a day where the levels are "found".

# Purpose/Mission
A needed trigger to alert engineers to fight flood activities at our place of employment. 
