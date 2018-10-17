#Open the CSV logfile, look for a specific entry that isn't complete, and
#update it so that it is.
import io,os,csv,sys

fieldnames = ['User','ip','completed','code','condition']

#(over)write the file with current information
def savecsv(fn):
    with open(fn,'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in data:
            writer.writerow(row)

#make the data object and read everything in
data = []
with open('logtest.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        data.append(row)
        
#look for a specific user, then make the change if appropriate
for user in data:
    if user['User']==sys.argv[1]:
        if user['completed']=='True':
            print "Already marked as completed"
        else:
            user['completed']='True';
            print "Changed to completed"
            savecsv('logtest.csv')
        


