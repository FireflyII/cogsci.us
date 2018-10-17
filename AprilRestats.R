setwd("/Volumes/Garfield/cogsci.us/")
#game_data <- read.csv("AprilSpikes_percents2.csv")
#game_data <- read.csv("AprilwithBlue.csv")
#game_data <- read.csv("AprilwithBlue_noimps.csv")
game_data <- read.csv("AprilBlueLag.csv")
gridd <- read.csv("gridiest.csv")
library(ggplot2)

View(game_data)
Scale(game_data)
mean(game_data[which (game_data$Clear_Completion == 1 & game_data$Clear_Progress == 1),]$backtrack_ratio)
mean(game_data[which (game_data$Clear_Completion == 0 & game_data$Clear_Progress == 1),]$backtrack_ratio)
mean(game_data[which (game_data$Clear_Completion == 1 & game_data$Clear_Progress == 0),]$backtrack_ratio)
mean(game_data[which (game_data$Clear_Completion == 0 & game_data$Clear_Progress == 0),]$backtrack_ratio)
game_data$Average_Distance_Per_Step
mean(game_data[which (game_data$Clear_Completion == 1 & game_data$Clear_Progress == 1),]$Average_Distance_Per_Step)
mean(game_data[which (game_data$Clear_Completion == 0 & game_data$Clear_Progress == 1),]$Average_Distance_Per_Step)
mean(game_data[which (game_data$Clear_Completion == 1 & game_data$Clear_Progress == 0),]$Average_Distance_Per_Step)
mean(game_data[which (game_data$Clear_Completion == 0 & game_data$Clear_Progress == 0),]$Average_Distance_Per_Step)

look<-c(mean(game_data[which (game_data$Clear_Completion == 1 & game_data$Clear_Progress == 1),]$Buttons_Pushed),
  mean(game_data[which (game_data$Clear_Completion == 0 & game_data$Clear_Progress == 1),]$Buttons_Pushed),
  mean(game_data[which (game_data$Clear_Completion == 1 & game_data$Clear_Progress == 0),]$Buttons_Pushed),
  mean(game_data[which (game_data$Clear_Completion == 0 & game_data$Clear_Progress == 0),]$Buttons_Pushed))

plot(scale(look))
boxplot(look)

my_mean2 <- function(dv){
  return (c(mean(game_data[which (game_data$Clear_Completion == 1 & game_data$Clear_Progress == 1),][[dv]]),
           mean(game_data[which (game_data$Clear_Completion == 0 & game_data$Clear_Progress == 1),][[dv]]),
           mean(game_data[which (game_data$Clear_Completion == 1 & game_data$Clear_Progress == 0),][[dv]]),
           mean(game_data[which (game_data$Clear_Completion == 0 & game_data$Clear_Progress == 0),][[dv]])))
}

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
plot(my_mean2("Blue_Visits"))
look <- game_data[which (game_data$Clear_Completion == 1 & game_data$Clear_Progress == 1),]$Buttons_Pushed
View(look)

hist(game_data[which (game_data$Clear_Completion == 1 & game_data$Clear_Progress == 1),]$Buttons_Pushed)
hist(game_data[which (game_data$Clear_Completion == 1 & game_data$Clear_Progress == 0),]$Buttons_Pushed)
hist(game_data[which (game_data$Clear_Completion == 0 & game_data$Clear_Progress == 1),]$Buttons_Pushed)
hist(game_data[which (game_data$Clear_Completion == 0 & game_data$Clear_Progress == 0),]$Buttons_Pushed)



hist(game_data[which (game_data$Clear_Completion == 0),]$Buttons_Pushed)
hist(game_data[which (game_data$Clear_Completion == 1),]$Buttons_Pushed)
hist(game_data[which (game_data$Clear_Progress == 0),]$Buttons_Pushed)
hist(game_data[which (game_data$Clear_Progress == 1),]$Buttons_Pushed)

How many times they tried to exit
Buttons pressed for exit
Later, find out when the exit was tried

Send R script for making graphs


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

#My attempt to automate the above
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

game_data$Clear_Completion <- as.factor(game_data$Clear_Completion)
game_data$Clear_Progress <- as.factor(game_data$Clear_Progress)

my_barplot2(game_data, "Buttons_Pushed")

te <- game_data$Time_Spent_Grid[1]
heatmap( te, Rowv=NA, Colv=NA, col = heat.colors(256),  margins=c(5,10))
View(te)

my_barplot2(game_data, "Buttons_Pushed")
my_barplot2(game_data, "percent_visited")
my_barplot2(game_data, "Steps_to_Completion")
my_barplot2(game_data, "Distance_Traveled")
my_barplot2(game_data, "Average_Distance_Per_Step")
my_barplot2(game_data, "Time_Spent")
my_barplot2(game_data, "Buttons_Pushed")
my_barplot2(game_data, "Number_of_Paths")
my_barplot2(game_data, "Average_Path_Length")
my_barplot2(game_data, "Standard_Deviation_of_Path_Length")
my_barplot2(game_data, "percent_on_buttons")
my_barplot2(game_data, "average_button_visits")
my_barplot2(game_data, "percent_visited")
my_barplot2(game_data, "backtrack_std")
my_barplot2(game_data, "average_visit")
my_barplot2(game_data, "average_per_visited")
my_barplot2(game_data, "backtrack_ratio")
