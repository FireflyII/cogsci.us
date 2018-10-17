#Convert a folder of survey files into a single CSV
#
#There should be nothing but survey files in the folder,
#as this version does no checking for file names, etc.
#
#Syntax: python surveycsv.py <input_directory> <output_filename>

import io,os,sys,json,csv

files = os.listdir(sys.argv[1])
fieldnames = ['id','confident','remember','last','smooth','wander','suprised','practice','drawn','taxing','frustrated','worthwhile','rewarding','fun','gender','english','letters','growing','now','17','age']

#Converts files into dictionaries for writing to a csv
def todict(tags,lis):
	end={}
	for i in range(len(tags)):
		end[tags[i]]=lis[i]
	return end

outf = sys.argv[2]
data = []

#Build the dictionaries

for i in range(len(files)):
    a = open(sys.argv[1]+'/'+files[i])
    b = a.read().splitlines()
    b = [files[i][:-4]] + b
    data.append(todict(fieldnames, b))

with open(outf, 'w') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    for row in data:
        writer.writerow(row)

print "All done!"
