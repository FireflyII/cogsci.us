#CSV logfile, check if existing record
import io,os,csv,sys

#not sure if needed, but list the fieldnames
fieldnames = ['User','ip','completed','code']

#This is how we'll determine what to send back...
ret = 0

#make objects for data, and keys (usernames)
#also, a dictionary of ips and names, to prevent
#duplicate sources, even with different names
data = []
datakeys = []
ip_name = {}
with open('logtest.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        data.append(row)
        datakeys.append(row['User'])
        ip_name[row['ip']]=row['User']

#check if the name exists
if sys.argv[1] in datakeys:
    ret = 1 # the name has been used
elif sys.argv[2] in ip_name:
    ret = 2 # the ip has been used, with a different name
else:
    ret = 3 # neither the name nor the ip have been used

print ret
