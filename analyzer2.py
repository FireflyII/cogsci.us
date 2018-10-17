##Analyze log files and produce any of a number of outputs.
##Input can be either a file or directory, possible outputs are
##a plot, a trimmed plot (consisting of only points where direction changed),
##a histogram of path lengths, and a CSV version of the data file. An output
##folder can also be optionally specified, and will be created if it doesn't
##exist already.

##Syntax is:
##      python analyzer2.py <filename or directory> <-p|t|h|c> <-f> <output directory>
##
##      p = plot
##      t = trimmed plot
##      h = histogram
##      c = CSV
##
## example:
##  python analyzer2.py pilotlogs -hc -f pilotdata
##
## This will run the program on the directory 'pilotlogs,' and create histograms
## and CSV files for all appropriate files, storing the results in the folder 'pilotdata'

import io,os,sys,json,csv
import matplotlib.pyplot as plt
fieldnames = ['x','y','time','keys']
isfile = False
isdir = False
#Make sure there are enough inputs before anything else
if len(sys.argv)<2:
    print "You need to include at least a file name!"
    quit()

#Check whether we're looking at a file or a directory, and whether it exists
if '.' in sys.argv[1]:
    if os.path.isfile(sys.argv[1]):
        isfile = True
    else:
        print "That file does not exist."
        quit()
else:
    if os.path.exists(sys.argv[1]):
        isdir = True
    else:
        print "That directory does not exist."
        quit()
        

#Look for the flags now. The default (no flags set) will be to do everything.
if len(sys.argv) > 2:
    doPlot = 'p' in sys.argv[2]
    doTrim = 't' in sys.argv[2]
    doHist = 'h' in sys.argv[2]
    doCSV = 'c' in sys.argv[2]
else:
    doPlot, doTrim, doHist, doCSV = True


#Check for the file flag (not included above...)
if '-f' in sys.argv:
    fold = sys.argv[sys.argv.index('-f')+1]
    #if the folder doesn't exist, make it
    if not(os.path.exists(fold)):
        os.mkdir(fold)
else:
    fold = os.getcwd()

################################################
#
#
#   Analytical Functions
#
#
################################################

#At the beginning of the file, both X and Y are going to the same for a while,
#So in order to start tracking turns, the first thing to do is find the first value
#that changes.
#
#The findFirst function locates the first position in a list that is different
#from the ones before.
def findFirst(A):
    for i in range(len(A)):
        if i!=len(A)-1:
            if (A[i+1] != A[i]):
                return i+1
        else:
            return len(A)

#Given a list, and a starting position, find the next time the value changes
def nextX(Xs,start):
    if start < len(Xs):
        for i in range(start,len(Xs)):
            if Xs[i] != Xs[start]:
                return i
        return False
    else:
        return False

#This function will take a list of x coordinates and a list of y coordinates,
#along with two empty lists for the output. It looks to see which list changes
#first (either x, or y), then alternates back and forth between the two, logging
#each time there is a change. In this way, the resulting lists nXs and nYs should
#be comprised of only those points where the player turned, marking the edges of
#a path.
def findTurns(Xs, Ys, nXs, nYs):
    s = 0
    t = True
    fX = findFirst(Xs)
    fY = findFirst(Ys)
    if fX < fY:
        nXs.append(Xs[fX])
        nYs.append(Ys[fX])
        while t:
            s = nextX(Ys, s)
            if s != False:
                nXs.append(Xs[s-1])
                nYs.append(Ys[s-1])
                s = nextX(Xs, s)
                if s!= False:
                    nXs.append(Xs[s-1])
                    nYs.append(Ys[s-1])
                else:
                    t = False
            else:
                t = False
    else:
        nXs.append(Xs[fY])
        nYs.append(Ys[fY])
        while t:
            s = nextX(Xs, s)
            if s != False:
                nXs.append(Xs[s-1])
                nYs.append(Ys[s-1])
                s = nextX(Ys, s)
                if s != False:
                    nXs.append(Xs[s-1])
                    nYs.append(Ys[s-1])
                else:
                    t = False
            else:
                t = False

#Given the new Xs and Ys (from above), the findDistances function calculates the length of travel
#between turns, and returns a list thereof.
def findDistances(nXs, nYs):
    # This will result in a list of all the lengths of travel. 
    nu = []
    for i in range(0,len(nXs)-1):
        nu.append(abs(nXs[i+1]-nXs[i]))
        nu.append(abs(nYs[i+1]-nYs[i]))
    #remove 0s (which are a byproduct of duplicate numbers and the fact that I'm
    #probably not using the best approach here...
    while nu.count(0)>0:
        nu.remove(0)
    return nu

#Taking a filename as an argument, the analyze function proceeds to read the file,
#extract the x and y coordinates, calculate the corner points and path lengths, then
#output a plot of x and y, a plot of the trimmed/corner points, a histogram of the path lengths,
#and the data reformated into a CSV file for ease of import into other programs later, all dependent
#on which flags were specified when the program is called from the command line.
def analyze(fl2):
    if isdir:
        fl=sys.argv[1]+"/"+fl2
        fold2=sys.argv[1]+"/"+fold
    else:
        fl=fl2
    a = open(fl,"r")
    b = a.read().splitlines()
    TX = []
    TY = []
    nTX = []
    nTY = []
    b.remove('')
    for R in b:
        d = json.loads(R)
        for i in d:
            TX.append(i.get("x"))
            TY.append(i.get("y"))
    findTurns(TX, TY, nTX, nTY)
    l = findDistances(nTX, nTY)
    lu = {}
    for x in l:
        if x in lu:
            lu[x]+=1
        else:
            lu[x]=1
    if doPlot:
        plt.plot(TX,TY, '.b', alpha=0.1)
        plt.savefig(fold+"/"+fl2[:-4]+"_PLOT.png",format="png")
        plt.clf()
        #print "filename: "+fold+"/"+fl2[:-4]+"_PLOT.png"
    if doTrim:
        plt.plot(nTX,nTY,'.b',alpha=0.1)
        plt.savefig(fold+"/"+fl2[:-4]+"_TRIM.png", format="png")
        plt.clf()
    if doHist:
        plt.hist(l,normed=False,bins=30)
        plt.savefig(fold+"/"+fl2[:-4]+"_HIST.png", format="png")
        plt.clf()
    if doCSV:
        #In addition to reformatting the data itself, this will also
        #add two new columns. One representing an array of the buttons,
        #and which have been pressed, and the other a running tally of how
        #many buttons have been pressed.
        fieldnames = ['x','y','time','keys','pressed','sofar']
        pressed = [0,0,0,0,0,0,0,0]
        dicts = []
        for R in b:
            d = json.loads(R)
            for i in d:
		dicts.append({'x':i.get("x"),'y':i.get("y"),'time':i.get("time"),'keys':i.get("keys")})
        for i in dicts:
            x = i['x']
            y = i['y']
            #pressed=[0,0,0,0,0,0,0,0]
            if x>=288 and x<=304 and y>=255 and y<=271:
                pressed[0]=1
            elif x>=554 and x<=570 and y>=31 and y<=47:
                pressed[1]=1
            elif x>=331 and x<=347 and y>=34 and y<=50:
                pressed[2]=1
            elif x>=38 and x<=54 and y>=581 and y<=597:
                pressed[3]=1
            elif x>=3 and x<=19 and y>=389 and y<=405:
                pressed[4]=1
            elif x>=37 and x<=53 and y>=287 and y<=303:
                pressed[5]=1
            elif x>=501 and x<=517 and y>=265 and y<=281:
                pressed[6]=1
            elif x>=326 and x<=342 and y>=581 and y<=597:
                pressed[7]=1
            i['pressed']=pressed[:]
            i['sofar']=sum(pressed)
        with open(fold+"/"+fl2[:-4]+".csv",'a') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for i in dicts:
                writer.writerow(i)

#################################

#If it's one file, do the analysis, otherwise, run through the directory.
#For single files, the name of the file won't matter, but for running through
#a directory, we'll double-check that the file ends in numbers in order to avoid
#survey files and focus on logged data. Also, running the script 'TimedOutTest.py'
#changes the end of the files where subjects timed out, and will be avoided this way.
if isfile:
    analyze(sys.argv[1])
else:
    filelist = os.listdir(sys.argv[1])
    loglist = []
    for i in filelist:
        if i[len(i)-8:-4].isdigit():
            loglist.append(i)
    for i in loglist:
        print "current file is: " + i
        analyze(i)
