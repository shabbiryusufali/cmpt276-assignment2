/*
Author: Shabbir Yusufali
Date: January 30, 2021
Description: This document contains the JavaScript for the calculator.html file
It has the functions to calculate the mean and weighted average grades. as well as
add more rows for more activities and also updates the percentages in the percent 
boxes as users type or increment the numbers.
Citations:
- I referenced "https://www.w3schools.com/jsref/jsref_tofixed.asp" to 
  learn how to truncate the numbers to 2 decimal points
- I referenced provided materials for html, css and js

*/

// These lines of code listen for button clicks or keypresses to update the window accordingly
document.getElementById("weightedAverage").addEventListener("click", weightedAverage);
document.getElementById("mean").addEventListener("click", meanGrade);
document.getElementById("addActivity").addEventListener("click", addActivity);
document.addEventListener("keyup", updateWindow);
document.addEventListener("click", updateWindow);


// This function gets the data needed to calculate the mean grade then performs
// The math operations on it to get the mean of the inputted grades
function meanGrade() {
    let activityTable = document.getElementById("calculatorFields");
    let arrayOfActivities = activityTable.getElementsByTagName("tr");
    let scores = document.getElementsByName("score");
    let totals = document.getElementsByName("total");
    let averageGrade = 0;
    let itemsToDivideBy = 0;
    let alertEmpty = false;
    for (let i = 0; i < scores.length; i++) {
        let percent = arrayOfActivities[i].getElementsByTagName("p");
        if ((scores[i].value != 0 || totals[i].value != 0) && (scores[i].value != null && totals[i].value != null)) {
            averageGrade += scores[i].value / totals[i].value;
            console.log("Running average is: " + averageGrade);
            itemsToDivideBy++;
            percent[0].innerHTML = ((scores[i].value / totals[i].value).toFixed(4) * 100).toFixed(2) + "%";
        } else {
            alertEmpty = true;
        }
    }

    if (alertEmpty == true) {
        alert("There is at least one activity that is either empty or is 0/0");

    }
    averageGrade = (averageGrade / itemsToDivideBy).toFixed(2) * 1;
    if (Number.isFinite(averageGrade) == false) {
        console.log("ERRORED Average is: " + averageGrade);
        alert('ERROR: ANSWER IS "NOT A NUMBER" OR IS "INFINITE"');
        document.getElementById("result").innerHTML = "ERROR";
        return;
    }
    let numToPrint = (averageGrade * 100)
    document.getElementById("result").innerHTML = numToPrint.toFixed(2) + "%";
}


// This function gets the data needed to calculate the weighted average grade 
// then performs the math operations on it to get the weighted average of the 
// inputted grades
function weightedAverage() {
    let activityTable = document.getElementById("calculatorFields");
    let arrayOfActivities = activityTable.getElementsByTagName("tr");
    let scores = document.getElementsByName("score");
    let totals = document.getElementsByName("total");
    let weights = document.getElementsByName("weight");
    let averageGrade = 0;
    let weightTotal = 0;
    let alertEmpty = false;
    for (let i = 0; i < scores.length; i++) {
        let percent = arrayOfActivities[i].getElementsByTagName("p");
        if ((scores[i].value != 0 || totals[i].value != 0) && (scores[i].value != null && totals[i].value != null)) {
            weightTotal += weights[i].value * 1;
            averageGrade += (scores[i].value / totals[i].value) * weights[i].value;
            percent[0].innerHTML = (scores[i].value / totals[i].value).toFixed(4) * 100 + "%";
        } else {
            alertEmpty = true;
        }
    }
    if (alertEmpty == true) {
        alert("There is at least one activity that is either empty or is 0/0");

    }
    averageGrade = (averageGrade / weightTotal).toFixed(4) * 1;
    if (Number.isFinite(averageGrade) == false) {
        alert('ERROR: ANSWER IS "NOT A NUMBER" OR IS "INFINITE"');
        document.getElementById("result").innerHTML = "ERROR";
        return;
    }
    let numToPrint = (averageGrade * 100)
    document.getElementById("result").innerHTML = numToPrint.toFixed(2) + "%";
}

// This function adds a new "activity" to the window
function addActivity() {
    let calculatorActivities = [];
    let activityTable = document.getElementById("calculatorFields");
    calculatorActivities = activityTable.getElementsByTagName("tr");
    document.getElementById("calculatorFields").insertAdjacentHTML('beforeend', "<tr><td><label>Activity " + (calculatorActivities.length + 1) + "</label></td><td><label>A" + (calculatorActivities.length + 1) + "</label></td><td><input type=\"number\" name=\"weight\"></td><td><input type=\"number\" name=\"score\">/<input type=\"number\" name=\"total\"></td><td><p></p></td></tr>");
}

// This function updates the window by calling the updatePercentage function to
// update the percentages in the percent column
function updateWindow() {
    let activityTable = document.getElementById("calculatorFields");
    let arrayOfActivities = activityTable.getElementsByTagName("tr");
    updatePercentage(arrayOfActivities);
}

// This function calculates and displays the percentages of the inputted scores
function updatePercentage(arrayOfActivities) {
    for (let i = 0; i < arrayOfActivities.length; i++) {
        let arrayOfInputs = arrayOfActivities[i].getElementsByTagName("input");
        let activityPercent = 100 * (arrayOfInputs[1].value / arrayOfInputs[2].value);
        let percentToUpdate = arrayOfActivities[i].getElementsByTagName("p");
        if (Number.isFinite(activityPercent)) {
            percentToUpdate[0].innerHTML = activityPercent.toFixed(2) + "%";
        } else {
            percentToUpdate[0].innerHTML = "";
        }
    }
}