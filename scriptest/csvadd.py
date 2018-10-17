#CSV logfile, add a new entry to the record

import io,os,sys,csv,random,string

fieldnames = ['User','ip','completed','code','condition']

#not needed on the server, but is needed here
#os.chdir('/Volumes/TarDisk-128/temp')

#The name and ip will come from the server. The condition code will be generated here
name = sys.argv[1]
ip = sys.argv[2]
condition = ''.join(str(random.randint(0,1))
	       for x in xrange(3))

#Generate a completion code for use later
code = ''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(12)])

toadd = {'User':name,'ip':ip,'completed':False,'code':code,'condition':condition}


#write the new information to the file
with open('logtest.csv', 'a') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writerow(toadd)

#return the condition code for use in the game
print condition
