/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

padString = function(str, pad, padlen){
    if(typeof str !== 'string'){
        str = str.toString();
    }
    while(str.length < padlen && pad.length > 0){
        str = pad + str;
    }
    return str;
};


function fromUTCDateString(UTCDate) {
    var date = new Date(0);
    if(UTCDate[UTCDate.length - 1] == 'Z') {
        var dateTime = UTCDate.slice(0,-1).split("T");
        var ymd = dateTime[0].split("-");
        var hms = dateTime[1].split(":");
        date.setUTCMilliseconds(0);
        date.setUTCSeconds(parseInt(hms[2], 10));
        date.setUTCMinutes(parseInt(hms[1], 10));
        date.setUTCHours(parseInt(hms[0], 10));
        date.setUTCDate(parseInt(ymd[2], 10));
        date.setUTCMonth(parseInt(ymd[1], 10) - 1);
        date.setUTCFullYear(parseInt(ymd[0], 10));
    }
    return date;
}

/**  
 * Convert Date object to yyyy-MM-dd'T'HH:mm:ss'Z' string.
 * */
function toISODate(date, utc) {
    //align date format
    var date = new Date(date);
    var out;
    if(typeof utc === undefined) {
        utc = true;
    }
    if(utc) {
        out = date.getUTCFullYear() + '-' +
        padString((date.getUTCMonth()+1) ,'0' , 2) + '-' +
        padString(date.getUTCDate() ,'0' , 2) + 'T' +
        padString(date.getUTCHours() ,'0' , 2) + ':' +
        padString(date.getUTCMinutes() ,'0' , 2) + ':' +
        padString(date.getUTCSeconds() ,'0' , 2) + 'Z';
    } else {
        out = date.getFullYear() + '-' +
        padString((date.getMonth()+1) ,'0' , 2) + '-' +
        padString(date.getDate() ,'0' , 2) + 'T' +
        padString(date.getHours() ,'0' , 2) + ':' +
        padString(date.getMinutes() ,'0' , 2) + ':' +
        padString(date.getSeconds() ,'0' , 2);
    }
    return out;
}
