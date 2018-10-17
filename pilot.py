import io,os,sys,random,string

code = ''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(int(sys.argv[1]))])

#This will simply return a random string of specified length

sys.stdout.write(code)
