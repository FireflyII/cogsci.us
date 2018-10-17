setwd("/Volumes/Garfield/cogsci.us/")
game_data <- read.csv("AprilBlueLag.csv")

#AOV function
my_aov <- function(data,dv){
  p <- eval(parse(text=paste("aov(", dv, " ~ + Clear_Progress + Clear_Completion,data = data)")))
  return(summary(p))
}

my_aov(game_data, "Buttons_Pushed")
my_aov(game_data, "Time_Spent")

my_aov(game_data, "Steps_to_Completion")
my_aov(game_data, "Distance_Traveled")
my_aov(game_data, "Average_Distance_Per_Step")
my_aov(game_data, "Time_Spent")
my_aov(game_data, "Buttons_Pushed")
my_aov(game_data, "Number_of_Paths")
my_aov(game_data, "Average_Path_Length")
my_aov(game_data, "Standard_Deviation_of_Path_Length")
my_aov(game_data, "percent_on_buttons")
my_aov(game_data, "average_button_visits")
my_aov(game_data, "percent_visited")
my_aov(game_data, "backtrack_std")
my_aov(game_data, "average_visit")
my_aov(game_data, "average_per_visited")
my_aov(game_data, "backtrack_ratio")
my_aov(game_data, "Spikes1")
my_aov(game_data, "Spikes2")
my_aov(game_data, "Blue_Visits")
my_aov(game_data, "Lag_Time")

#LM function
my_lm <- function(data,dv){
  p <- eval(parse(text=paste("lm(", dv, " ~ Clear_Progress + Clear_Completion,data = data)")))
  return(summary(p))
}

my_lm(game_data, "Steps_to_Completion")
my_lm(game_data, "Distance_Traveled")
my_lm(game_data, "Average_Distance_Per_Step")
my_lm(game_data, "Time_Spent")
my_lm(game_data, "Buttons_Pushed")
my_lm(game_data, "Number_of_Paths")
my_lm(game_data, "Average_Path_Length")
my_lm(game_data, "Standard_Deviation_of_Path_Length")
my_lm(game_data, "percent_on_buttons")
my_lm(game_data, "average_button_visits")
my_lm(game_data, "percent_visited")
my_lm(game_data, "backtrack_std")
my_lm(game_data, "average_visit")
my_lm(game_data, "average_per_visited")
my_lm(game_data, "backtrack_ratio")
my_lm(game_data, "Spikes1")
my_lm(game_data, "Spikes2")
my_lm(game_data, "Blue_Visits")
my_lm(game_data, "Lag_Time")

#LM function with interactions
my_lmi <- function(data,dv){
  p <- eval(parse(text=paste("lm(", dv, " ~ Clear_Progress * Clear_Completion,data = data)")))
  return(summary(p))
}

my_lmi(game_data, "Steps_to_Completion")
my_lmi(game_data, "Distance_Traveled")
my_lmi(game_data, "Average_Distance_Per_Step")
my_lmi(game_data, "Time_Spent")
my_lmi(game_data, "Buttons_Pushed")
my_lmi(game_data, "Number_of_Paths")
my_lmi(game_data, "Average_Path_Length")
my_lmi(game_data, "Standard_Deviation_of_Path_Length")
my_lmi(game_data, "percent_on_buttons")
my_lmi(game_data, "average_button_visits")
my_lmi(game_data, "percent_visited")
my_lmi(game_data, "backtrack_std")
my_lmi(game_data, "average_visit")
my_lmi(game_data, "average_per_visited")
my_lmi(game_data, "backtrack_ratio")
my_lmi(game_data, "Spikes1")
my_lmi(game_data, "Spikes2")
my_lmi(game_data, "Blue_Visits")
my_lmi(game_data, "Lag_Time")
