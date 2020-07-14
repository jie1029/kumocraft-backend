function getFormatDate(date){
    let year = date.getFullYear();
    let month = (1+date.getMonth());
    month = month >= 10? month:'0'+month;
    let day = date.getDate();
    day = day >= 10 ? day: '0'+day;
    let hour = date.getHours();
    hour = hour >= 10 ? hour: '0'+hour;
    let minutes = date.getMinutes();
    minutes = minutes >= 10 ? minutes: '0'+minutes;
    let seconds = date.getSeconds();
    seconds = seconds >= 10 ? seconds: '0'+seconds
    let milliseconds = date.getMilliseconds();
    milliseconds = milliseconds >= 10 ? milliseconds: '0'+milliseconds;
    return year+'-'+month+'-'+day+'-'+hour+'-'+minutes+'-'+seconds+'-'+milliseconds;
}

module.exports = getFormatDate;