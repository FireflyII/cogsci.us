# GET DATA
setwd("/Volumes/Garfield/")

game_data <- read.csv("DataSpikes_percents.csv")

require("ggplot2")
require("dplyr")
require("plyr")

# Summarize data for use in plotting
data_summary <- function(data, varname, groupnames){
  
  # Returns the mean and std. error of a column
  summary_func <- function(x, col){
    c(mean = mean(x[[col]], na.rm=TRUE),
      se = sd(x[[col]]/sqrt(length(x)), na.rm=TRUE))
  }
  
  # Make a table of means and stderrs relative to ind. values
  data_sum <-ddply(data, groupnames, .fun=summary_func,
                   varname)
  print(data_sum)
  return(data_sum)
}

# Make the plot
make_plot <- function(df, iv, dv) {
  
  # Creat a supplementary table with means and standard errors
  df2 <- data_summary(df, varname=dv, groupnames= c(iv))
  the_mean <- df2[["mean"]]
  print(the_mean)
  se <- df2[["se"]]
  
  # Plot with error bars
  ggplot(df2,
         aes_string(x = iv, y = the_mean)) +
    ylab(dv) + 
    geom_bar(stat="identity",color="black", fill="#FF9999") +
    geom_point(data=df, aes_string(x=iv,y=dv),position = position_jitter(w = 0.15, h = 0), alpha=.2) +
    geom_errorbar(
      aes(ymin = the_mean - 1.96*se, ymax = the_mean + 1.96*se),
      width = .2)
}

make_plot(game_data, "Clear_Progress", "percent_on_buttons")
make_plot(game_data, "Clear_Completion", "Blue_Visits")
make_plot(game_data, "Clear_Progress", "Steps_to_Completion")
make_plot(game_data, "Clear_Completion", "Steps_to_Completion")
make_plot(gd, "Clear_Completion", "percent_on_buttons")
make_plot(gd, "Clear_Completion", "average_per_visited")
make_plot(gd, "Clear_Completion", "X2x2_std_time_spent")
make_plot(gd, "Clear_Completion", "Time_Spent")
make_plot(gd, "Clear_Completion", "Steps_to_Completion")
make_plot(gd, "Clear_Completion", "average_visit")
make_plot(game_data, "Clear_Completion", "Number_of_Paths")
make_plot(gd, "Clear_Completion", "X20x20_std_time_spent")

# Not sure this is useful, but FWIW...
make_plot(game_data, "confident", "Clear_Progress")
make_plot(game_data, "taxing", "X10x10_std_time_spent")
make_plot(game_data, "taxing", "average_per_visited")
make_plot(game_data, "confident", "Buttons_Pushed")
make_plot(game_data, "Spikes2","frustrated")

zVar <- (myVar - mean(myVar)) / sd(myVar)

range01 <- function(x){(x-min(x))/(max(x)-min(x))}
