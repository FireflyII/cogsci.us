#CSV logfile, add a new entry to the record

import io,os,sys,csv,random,string

fieldnames = ['User','ip','completed','code','condition']

#not needed on the server, but is needed here
#os.chdir('/Volumes/TarDisk-128/temp')

#The name and ip will come from the server. The condition code will be generated here
name = sys.argv[1]
ip = sys.argv[2]
#condition = ''.join(str(random.randint(0,1))
#	       for x in xrange(3))

#Instead of randomly generating the condition, we'll increment based on the
#number of logged users.
data = []
with open('logtest.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        data.append(row)

#Reduced number of conditions from 8 to 4
#tobi={0:'000',1:'001',2:'010',3:'011',4:'100',5:'101',6:'110',7:'111'}
tobi={0:'00',1:'01',2:'10',3:'11'}

#condition = tobi[(len(data)+1)%8]
condition = tobi[(len(data)+1)%4]

#Generate a completion code for use later
code = ''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(12)])

toadd = {'User':name,'ip':ip,'completed':False,'code':code,'condition':condition}


#write the new information to the file
with open('logtest.csv', 'a') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writerow(toadd)

#return the condition code for use in the game
#sys.stdout.write(condition)

#return the condition code and the completion code
re = condition+","+code
sys.stdout.write(re)
