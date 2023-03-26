export function calculateDifferenceHour(time1, time2) {
    //Convert the two hours to seconds
    const hour1 = timeToSeconds(time1);
    const hour2 = timeToSeconds(time2);

    //Calculate the difference between tow hours
    const difference = Math.abs(hour1 - hour2);

    //Convert the difference in hours, minutes and seconds
    let hours = Math.floor(difference / 3600);
    let minutes = Math.floor((difference % 3600) / 60);
    let seconds = difference % 60;

    //Return the difference in the format HH:MM:SS
    return padZero(hours) + ":" + padZero(minutes) + ":" + padZero(seconds);
}

//Convert a time in the format HH:MM:SS to seconds
function timeToSeconds(time) {
    let parts = time.split(":");
    let hours = parseInt(parts[0]);
    let minutes = parseInt(parts[1]);
    let seconds = parseInt(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
}

//Add a zero on the left if the number was smallest than 10
function padZero(number) {
    if (number < 10) {
        return "0" + number;
    } else {
        return number;
    }
}