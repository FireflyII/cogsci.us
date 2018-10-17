# CSV logfile stuff

import io,os,csv,sys

#switch to the right directory
#os.chdir('/Volumes/TarDisk-128/temp')

#establish the headers to be used
fieldnames = ['User','ip','completed','code']

#some sample data to write
toadd1 = {'User':'Daniel','ip':'192.168.10.1','completed':True,'code':'A1B2'}
toadd2 = {'User':'Jeff','ip':'127.0.0.1','completed':False,'code':'B148'}
toadd3 = {'User':'Dave','ip':'196.36.42.8','completed':False,'code':'C333'}
toadd4 = {'User':'Mia','ip':'122.122.122.5','completed':True,'code':'1147'}
#one more for a little later...
toadd5 = {'User':'Dave','ip':'196.360.42.8','completed':True,'code':'4848'}

#open a (new) file, and write to it:
with open('logtest.csv','w') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerow(toadd1)
    writer.writerow(toadd2)
    writer.writerow(toadd3)
    writer.writerow(toadd4)


#create a 'data' list and populate it with the contents of the saved file...
#while we're at it, make a list of the names in the file!
data = []
datakeys = []
def loadcsv(fn):
##    data = []
##    datakeys = []
    with open(fn) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data.append(row)
            datakeys.append(row['User'])

def addif(past, now):
    if now['User'] in datakeys:
        print "TAKEN"
    else:
        past.append(now)
        print "AVAIL"

#(over)write the file with current information
def savecsv(fn):
    with open(fn,'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in data:
            writer.writerow(row)
            
loadcsv('logtest.csv')
#addif(data, toadd5)
fn = sys.argv[1]
#print fn
#with open("look.txt","w") as txt:
#    txt.write(fn)

if fn in datakeys:
    print "TAKEN"
else:
    print "AVAIL"

