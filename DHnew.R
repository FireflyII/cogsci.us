#4/18/2018
#Scripts for plotting problem game data

#Set directory of data file
setwd("/Volumes/Garfield/cogsci.us/")

#Import data file
game_data <- read.csv("AprilSpikes_percents2.csv")

#Required library for plotting
library(ggplot2)

#A function for finding the mean values in each condition, and returing it as a single list
my_mean2 <- function(dv){
  return (c(mean(game_data[which (game_data$Clear_Completion == 1 & game_data$Clear_Progress == 1),][[dv]]),
           mean(game_data[which (game_data$Clear_Completion == 0 & game_data$Clear_Progress == 1),][[dv]]),
           mean(game_data[which (game_data$Clear_Completion == 1 & game_data$Clear_Progress == 0),][[dv]]),
           mean(game_data[which (game_data$Clear_Completion == 0 & game_data$Clear_Progress == 0),][[dv]])))
}

#A function for finding the mean values in each condition, and listing them separately
my_mean <- function(dv){
  print("Clear Progress & Clear Completion")
  print(eval(parse(text=paste("mean(game_data[which (game_data$Clear_Completion == 1 & game_data$Clear_Progress == 1),]$",dv,")"))))
  print("Clear Progress & Unclear Completion")
  print(eval(parse(text=paste("mean(game_data[which (game_data$Clear_Completion == 0 & game_data$Clear_Progress == 1),]$",dv,")"))))
  print("Unclear Progress & Clear Completion")
  print(eval(parse(text=paste("mean(game_data[which (game_data$Clear_Completion == 1 & game_data$Clear_Progress == 0),]$",dv,")"))))
  print("Unclear Progress & Unclear Completion")
  print(eval(parse(text=paste("mean(game_data[which (game_data$Clear_Completion == 0 & game_data$Clear_Progress == 0),]$",dv,")"))))
}

#Plot the means of each condition so that they can be visually compared
plot(my_mean2("Steps_to_Completion"))
plot(my_mean2("Distance_Traveled"))
plot(my_mean2("Average_Distance_Per_Step"))
plot(my_mean2("Time_Spent"))
plot(my_mean2("Buttons_Pushed"))
plot(my_mean2("Number_of_Paths"))
plot(my_mean2("Average_Path_Length"))
plot(my_mean2("Standard_Deviation_of_Path_Length"))
plot(my_mean2("percent_on_buttons"))
plot(my_mean2("average_button_visits"))
plot(my_mean2("percent_visited"))
plot(my_mean2("backtrack_std"))
plot(my_mean2("average_visit"))
plot(my_mean2("average_per_visited"))
plot(my_mean2("backtrack_ratio"))

#Function from the web for making bar plots with error bars....
data_summary2 <- function(data, varname, groupnames){
  require(plyr)
  summary_func <- function(x, col){
    c(mean = mean(x[[col]], na.rm=TRUE),
      sd = sd(x[[col]], na.rm=TRUE))
  }
  data_sum<-ddply(data, groupnames, .fun=summary_func,
                  varname)
  data_sum <- rename(data_sum, c("mean" = varname))
  return(data_sum)
}

#
# My function for making bar plots that show each condition.
# This may be inelegant, but it is a functional workaround to an
# issue with R and variable references. It's basically constructing
# a string of the proper command, and executing it. The end result
# is a function that needs only the name of the data set, and a string
# for the column to select.
#
# Also, the data has to be identified as "factors" to work properly (see below)
#
# Currently, the code uses Clear_Completion for the X axis.
# If you want to change this, replace this text:
#       aes(x = Clear_Completion, y = ", dv, ", fill = Clear_Progress)
# with
#       aes(x = Clear_Progress, y = ", dv, ", fill = Clear_Completion)
#
my_barplot2 <- function(data,dv){
  pt <- data_summary2(data, varname=dv, groupnames= c("Clear_Progress", "Clear_Completion"))
  print(pt)
  p <-
    eval(parse(text=paste("ggplot(pt, aes(x = Clear_Completion, y = ", dv, ", fill = Clear_Progress)) +
                          geom_bar(stat = \"identity\",
                          color = \"black\",
                          position = position_dodge()) +
                          geom_errorbar(
                          aes(ymin = ", dv, " - (qt(0.975,df=length(game_data$percent_on_buttons)-1)*sd/sqrt(length(game_data$percent_on_buttons))), ymax = ", dv,  "+ (qt(0.975,df=length(game_data$percent_on_buttons)-1)*sd/sqrt(length(game_data$percent_on_buttons)))),
                          width = .2,
                          position = position_dodge(.9)
                          )")))
  return(p)
}

#Set the data to be identified as "factors"
game_data$Clear_Completion <- as.factor(game_data$Clear_Completion)
game_data$Clear_Progress <- as.factor(game_data$Clear_Progress)

#Make the plots
my_barplot2(game_data, "Buttons_Pushed")
my_barplot2(game_data, "percent_visited")
my_barplot2(game_data, "Blue_Visits")
my_barplot2(game_data, "Number_of_Paths")
my_barplot2(game_data, "Steps_to_Completion")
my_barplot2(game_data, "Distance_Traveled")
my_barplot2(game_data, "Time_Spent")
my_barplot2(game_data, "Standard_Deviation_of_Path_Length")
my_barplot2(game_data, "percent_on_buttons")
my_barplot2(game_data, "average_button_visits")
my_barplot2(game_data, "backtrack_std")
my_barplot2(game_data, "Spikes1")
my_barplot2(game_data, "Spikes2")
#etc...
