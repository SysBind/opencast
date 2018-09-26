
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] === 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i === key && obj[key] === val) {
            objects.push(obj);
            return objects;
        }
    }
    return objects;
}

// obtener parámetros de la url
function getUrlVars() {
    var vars    = {};
    var parts   = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function( m, key, value ) {
        vars[key] = value;
    });
    return vars;
} 

//TODO change name function and add in lib
function process_mh_array_response( res ) {
    if (res === undefined) return [];
    if ($.isArray(res)) {
	return res;
    } else {
	return [res];
    }
}


function getCapabilitiesByDevice (obj, key, val) {
   var objects = [];
   $.each(obj, function (i,v){
        if (typeof v === 'object') {
            objects = objects.concat(getCapabilitiesByDevice ( v, key, val ));
        } else {
            if ( i === key && v.indexOf( val ) >=0 ) {
                objects.push(obj);
                return objects;
            }
        }
   });
   return objects;
}
/*
 * 
 * 
 */


// DATE MANAGEMENT 

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


function formatSecondsAsTime(secs, format) {
  var hr  = Math.floor(secs / 3600);
  var min = Math.floor((secs - (hr * 3600))/60);
  var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

  if (hr < 10)  { hr    = "0" + hr; }
  if (min < 10) { min = "0" + min; }
  if (sec < 10) { sec  = "0" + sec; }
  if (hr)       { hr   = "00"; }

  if (format != null) {
    var formatted_time = format.replace('hh', hr);
    formatted_time = formatted_time.replace('h', hr*1+""); // check for single hour formatting
    formatted_time = formatted_time.replace('mm', min);
    formatted_time = formatted_time.replace('m', min*1+""); // check for single minute formatting
    formatted_time = formatted_time.replace('ss', sec);
    formatted_time = formatted_time.replace('s', sec*1+""); // check for single second formatting
    return formatted_time;
  } else {
    return hr + ':' + min + ':' + sec;
  }
}

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseMsToDate( ms, type, delimiter ) {
    if ( delimiter === undefined ) {
        delimiter = '/';
    }
    if ( type === undefined ) {
        type = 'dd/mm/yyyy';
    }
    var myDate = new Date( ms );
    var dateStr = '';
    if ( type === 'dd/mm/yyyy' ) {
        dateStr = myDate.getDate() + delimiter + ('0' + (myDate.getMonth()+1 )).slice( -2 ) + delimiter + myDate.getFullYear();
    } else if ( type === 'dd/mm/yy' ) {
        dateStr = ("0" + myDate.getDate()).slice( -2 ) + delimiter + ('0' + (myDate.getMonth()+1 )).slice( -2 ) + delimiter + myDate.getFullYear().toString().slice( -2 );
    }
    return dateStr;
}


function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(bytes < thresh) return bytes + ' B';
    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(bytes >= thresh);
    return bytes.toFixed(1)+' '+units[u];
}
