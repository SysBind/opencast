
var global_config = {
    server: ""
    
};

var calendar;

AllCatalogs = function( objeto_catalogos ) {
   var catalogs = new Array();
   $.each( objeto_catalogos, function( index, value ) {    
      catalog = new Catalog( value );
      catalogs.push( catalog );
   });
   this.catalogs = catalogs;
   
};

Catalog = function( objeto_catalogo ) {
    this._temporal        = {};
    
    if ( objeto_catalogo !== undefined && objeto_catalogo[ 'http://purl.org/dc/terms/' ] !== undefined ) {
        if(typeof objeto_catalogo[ 'http://purl.org/dc/terms/' ][ 'creator' ] !== "undefined")
            this._creator         = objeto_catalogo[ 'http://purl.org/dc/terms/' ][ 'creator' ]   [ 0 ][ 'value' ] || '';
        else
            this._creator = '';

        if(typeof objeto_catalogo[ 'http://purl.org/dc/terms/' ][ 'identifier' ] !== "undefined")
            this._identifier      = objeto_catalogo[ 'http://purl.org/dc/terms/' ][ 'identifier' ][ 0 ][ 'value' ] || 0;
        else
            this._identifier = 0;

        if(typeof objeto_catalogo[ 'http://purl.org/dc/terms/' ][ 'spatial' ] !== "undefined")
            this._spatial         = objeto_catalogo[ 'http://purl.org/dc/terms/' ][ 'spatial' ]   [ 0 ][ 'value' ] || '';
        else
            this._spatial = '';

        if(typeof objeto_catalogo[ 'http://purl.org/dc/terms/' ][ 'title' ] !== "undefined")
            this._title           = objeto_catalogo[ 'http://purl.org/dc/terms/' ][ 'title' ]     [ 0 ][ 'value' ] || '';
        else
            this._title = '';

        // proceso el valor de tiempo, (ej: "start=2013-03-14T10:00:00Z; end=2013-03-14T10:15:00Z; scheme=W3C-DTF;")
        var myString = objeto_catalogo[ 'http://purl.org/dc/terms/' ][ 'temporal' ]  [ 0 ][ 'value' ] || 0;

    //    var myRegexp = /^start=(.*);\ end=(.*);\ scheme=(.*);/;
        var myRegexp = /start=(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d\:\d+([+-][0-2]\d:[0-5]\d|Z{0,1}))/;
        var match = myRegexp.exec( myString );
        if( !match || typeof match[1] === "undefined" ) {
            result = 0; 
        } else { 
            result = match[ 1 ];
        }
        this._temporal._start = fromUTCDateString( match[ 1 ] ) || 0;

        var myRegexp = /end=(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d\:\d+([+-][0-2]\d:[0-5]\d|Z{0,1}))/;
        var match = myRegexp.exec( myString );
        if( !match || typeof match[1] === "undefined" ) {
            result = 0; 
        } else { 
            result = match[ 1 ];
        }
        this._temporal._end = fromUTCDateString( match[ 1 ] ) || 0;

        var myRegexp = /scheme=(.*);/;
        var match = myRegexp.exec( myString );
        if( !match || typeof match[1] === "undefined" ) {
            result = 0; 
        } else { 
            result = match[ 1 ];
        }
        this._temporal._scheme = match[ 1 ] || 0;
    
    }
   /*
    * GETTERS Y SETTERS
    */

   // function creator
   this.creator = function () {
      if ( arguments.length === 1 ) {
         var val = arguments[ 0 ];
         if ( typeof val !== "undefined" && val !== this._creator ) {
             this._creator = val;
         }
     } else {
         return this._creator;
     }
   };

   // function identifier
   this.identifier = function () {
      if ( arguments.length === 1 ) {
         var val = arguments[ 0 ];
         if ( typeof val !== "undefined" && val !== this._identifier ) {
             this._identifier = val;
         }
     } else {
         return this._identifier;
     }
   };

   // function spatial
   this.spatial = function () {
      if ( arguments.length === 1 ) {
         var val = arguments[ 0 ];
         if ( typeof val !== "undefined" && val !== this._spatial ) {
             this._spatial = val;
         }
     } else {
         return this._spatial;
     }
   };



   // function start
   this.start = function () {
      if ( arguments.length === 1 ) {
         var val = arguments[ 0 ];
         if ( typeof val !== "undefined" && val !== this._temporal._start ) {
             this._temporal._start = val;
         }
     } else {
         return this._temporal._start;
     }
   };

   // function end
   this.end = function () {
      if ( arguments.length === 1 ) {
         var val = arguments[ 0 ];
         if ( typeof val !== "undefined" && val !== this._temporal._end ) {
             this._temporal._end = val;
         }
     } else {
         return this._temporal._end;
     }
   };
   // function scheme
   this.scheme = function () {
      if ( arguments.length === 1 ) {
         var val = arguments[ 0 ];
         if ( typeof val !== "undefined" && val !== this._temporal._scheme ) {
             this._temporal._scheme = val;
         }
     } else {
         return this._temporal._scheme;
     }
   };

   // function title
   this.title = function () {
      if ( arguments.length === 1 ) {
         var val = arguments[ 0 ];
         if ( typeof val !== "undefined" && val !== this._title ) {
             this._title = val;
         }
     } else {
         return this._title;
     }
   };


   // END OF GETTERS & SETTERS

}; // END OF Catalog

var agents_color = new Array();
  
function set_agents_colors( agents ) {
   
   //var colors = ['darkorange', 'blue', 'fuchsia', 'green', 'darkcyan', 'maroon', 'navy', 'olive', 'purple', 'red', 'silver', 'teal', 'MediumVioletRed', 'tomato' ];
   var colors = [ 'Blue',   'CadetBlue', 'Chartreuse',  'Coral', 'CornflowerBlue', 'Crimson', 'DarkCyan', 'DarkGoldenRod', 'DarkGray', 'DarkGreen', 'DarkKhaki', 'DarkMagenta', 'DarkOliveGreen', 'Darkorange', 'DarkOrchid', 'DarkRed', 'DarkSalmon', 'DarkSeaGreen', 'DarkSlateGray', 'DarkTurquoise', 'DarkViolet', 'DeepPink', 'DeepSkyBlue', 'DimGray', 'DimGrey', 'DodgerBlue', 'FloralWhite', 'ForestGreen', 'Fuchsia', 'Gold', 'GoldenRod', 'Gray', 'Green', 'HotPink', 'IndianRed ', 'Indigo  ', 'LimeGreen', 'Magenta', 'Maroon', 'MediumAquaMarine', 'MediumBlue', 'MediumOrchid', 'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen', 'MediumTurquoise', 'MediumVioletRed', 'MidnightBlue', 'Navy', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'Peru', 'Pink', 'Plum', 'Purple', 'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'Sienna', 'Silver', 'Chocolate', 'SkyBlue', 'SlateBlue', 'SlateGray', 'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Thistle', 'Tomato', 'Turquoise', 'Violet', 'YellowGreen', 'Brown', 'BlueViolet'];
   color = 100;
   $.each( agents, function(i, v){
       agents_color [v.name] = colors[(i%colors.length)];
   });
}

function search ( params ) {
    if ( params === undefined ){
        params = {};
    }
    params [ 'startsfrom' ]  = toISODate( firstDay, true );
    params [ 'endsto' ]    = toISODate( lastDay, true );

    $.ajax({
        dataType: "jsonp",
        data: params,
        jsonp: 'jsonp', 
        jsonpCallback: 'callback1',
        url: "/recordings/recordings.json"  
    }).done(function (data) {
        all_catalogs = new AllCatalogs( data['catalogs'] ); // trae todos los catalogos de todos los agentes
        filtrar_por_agents();
    });
}


function print_html_agents( agents ) {
    html_agent = '';
    html_draggable_agent = '';
    
    $.each( agents, function( i, v ){
        html_agent = html_agent + '<li><span class="external-event ' + agents_color[v.name] + '">' + v.name + '</span><input type="checkbox" name="sel_agentes" value="' + v.name + '" id="check_'+ v.name +'" /></li>';
        html_draggable_agent = html_draggable_agent + '<li><div class="external-event">' + v.name + '</div></li>'; 
    });
    
    $('#list_filter_agents').append(html_agent);
    $('#list_draggable_agents').append(html_draggable_agent);
}

function getAgents() {
    $.ajax({
        dataType: "jsonp",
        data: params,
        jsonp: 'jsonp', 
        jsonpCallback: 'callback2',
        url: "/capture-admin/agents.json"    
    }).done(function ( data ) {
        var agents = process_mh_array_response(data.agents.agent);
        print_html_agents( agents );
    });
}



function filtrar_por_agents () {
    reset_calendar();
    catalogos_buscados = get_catalogs_buscados( all_catalogs.catalogs ); // filtra por agentes activos   
    print_catalogs( catalogos_buscados ); // imprime los catalogs
}

function addEventsToCalendar( catalog ) {

    var event = {
        title   :   catalog.title(),
        id      :   catalog.identifier(),
        allDay  :   false,
        start   :   catalog.start(),
        end     :   catalog.end(),
        //url:      'scheduler.html?eventId=' + catalog.identifier() + '&edit=true',
        
        color   :   agents_color[catalog.spatial()]
    };
    
    // disable past events
    var today = new Date();
    if ( catalog.end().getTime() < today.getTime() ) {
        event.editable = false;
        event.url = 'scheduler.html?eventId=' + catalog.identifier() + '&edit=0';
    } else {
        event.editable = true;
        event.url = 'scheduler.html?eventId=' + catalog.identifier() + '&edit=1';
    }
   
    calendar.fullCalendar( 'renderEvent', event );
}


function print_catalogs( catalogs ) {
    $.each( catalogs, function( i, v ) {
        addEventsToCalendar( v );
    });
}

function get_catalogs_buscados ( catalogs ) {
    ids_agentes_activos = new Array();
    
    ids_agentes_activos = $( '#list_filter_agents li:not(.li_all) input[type=checkbox]:checked' ).map( function() {
        return $( this ).val();
    });
    
    
    catalogos_a_mostrar = $.grep( catalogs, function ( n, i ){ return ($.inArray(n.spatial(), ids_agentes_activos)>-1);});

    return catalogos_a_mostrar;
}

function reset_calendar() {
    // limpio el calendario
    calendar.fullCalendar( 'removeEvents' );
}

function init() {
    $.ajax({
            dataType: "jsonp",
            jsonp: 'jsonp', 
            jsonpCallback: 'callback3',
            url: "/capture-admin/agents.json"    
    }).done( function ( data ) {
        var agents = process_mh_array_response(data.agents.agent);
        set_agents_colors( agents );
        print_html_agents( agents );
        do_events_draggable(); 
        
        var urlVars = getUrlVars();
        if( urlVars[ 'agent' ] !== undefined) {
            // select agent in the panel
            var selectedAgent = urlVars[ 'agent' ];
            $('#check_'+selectedAgent).prop( 'checked', true );
        } else {
            // select all agents
            $( '#filter input[type=checkbox]' ).prop( 'checked', true );
        }
            
        init_calendar();
        //search();  
    });
}

function do_events_draggable () {
    $('#filter ul li span.external-event').each(function() {

        // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
        // it doesn't need to have a start or end
        var eventObject = {
                title: 'New event' /*+jQuery.now().toString().slice(-10)*/, // use the element's text as the event title
                agent: $.trim($(this).text())   // id
        };

        // store the Event Object in the DOM element so we can get to it later
        $(this).data('eventObject', eventObject);

        // make the event draggable using jQuery UI
        $(this).draggable({
                zIndex: 999,
                revert: true,      // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
        });

    });
}

function createAgentParametersDropCalendar( data ) {
    var queryAgentParameters = '';
    var devicenames = '';

    if (data['agent-state-update']['capabilities']['item']) {
    
        if (typeof data['agent-state-update']['capabilities']['item'].length=== 'undefined') {
	    // solo tiene el elemento capture.device.names
	    devicenames = data['agent-state-update']['capabilities']['item']['value'];
        } else {
	    $.each(data['agent-state-update']['capabilities']['item'], function(i, v){ 
		if( v.key === 'capture.device.names' ) {
		    devicenames = v.value;
		    return false;
		}
	    });
	}
    }

    queryAgentParameters = queryAgentParameters + 'capture.device.names=' + devicenames + '\n';
    return queryAgentParameters;

}

function createDublinCoreParametersDropCalendar ( dataObject ) {
 
    var queryDublinCoreParameters = '<dublincore xmlns="http://www.opencastproject.org/xsd/1.0/dublincore/" xmlns:dcterms="http://purl.org/dc/terms/">';
    
    queryDublinCoreParameters = queryDublinCoreParameters + '<dcterms:title>' + dataObject.title + '</dcterms:title>';
    queryDublinCoreParameters = queryDublinCoreParameters + '<dcterms:temporal>start=' + toISODate( dataObject.start, true ) + '; end='+ toISODate(dataObject.end, true) +  '; scheme=W3C-DTF;</dcterms:temporal>';
    queryDublinCoreParameters = queryDublinCoreParameters + '<dcterms:spatial>' + dataObject.agent +'</dcterms:spatial>';
   
    queryDublinCoreParameters = queryDublinCoreParameters + '</dublincore>';
    return queryDublinCoreParameters;
}

function createEventParametersDropCalendar( dataObject ) {
   
    
    var startTime   = dataObject.start.getTime();
    var endTime     = dataObject.end.getTime();
    var duration    = endTime - startTime;
    
    var queryEventParameters = 'startDate=' + startTime + '\n';
    queryEventParameters = queryEventParameters + 'duration=' + duration + '\n';
    queryEventParameters = queryEventParameters + 'agentTimeZone=60' + '\n';
    
    return queryEventParameters;
}

function getFirstDay() {
    var firstDay;
    var dateToday;
            
    if (calendar === undefined || calendar.fullCalendar( 'getDate' ) === undefined) {
        dateToday= new Date();
    } else {
        dateToday = calendar.fullCalendar( 'getDate' );
    }

    if ( calendarCurrentView === 'agendaDay') {
        firstDay = dateToday;
    } else if ( calendarCurrentView === 'agendaWeek') {
        var day = dateToday.getDay();
        var diff = dateToday.getDate() - day + (day === 0 ? -6:1); // adjust when day is Sunday
        dateToday.setDate( diff );
        firstDay = dateToday;
    } else {    // month view
        firstDay = new Date(dateToday.getFullYear(), dateToday.getMonth(), 1);
    }
    
    firstDay.setHours(00,00,00,000);
    return firstDay;
}

function getLastDay() {
    var lastDay;
    var dateToday;
            
    if (calendar === undefined || calendar.fullCalendar( 'getDate' ) === undefined)
        dateToday= new Date();
    else{
        dateToday = calendar.fullCalendar( 'getDate' );
    }

    if ( calendarCurrentView === 'agendaDay') {
        lastDay = dateToday;
    } else if ( calendarCurrentView === 'agendaWeek') {
        var day = dateToday.getDay();
        var diff = dateToday.getDate() - day + (day === 0 ? 0:+7); // adjust when day is Sunday
        dateToday.setDate( diff );
        lastDay = dateToday;
    } else {    // month view
        lastDay = new Date(dateToday.getFullYear(), dateToday.getMonth() + 1, 0);
    }
    lastDay.setHours(23,59,59,999);
    return lastDay;  
    
}

function checkConflicts( eventId, device, start, end, callback_ok ) {
   var existsConflicts = false;
   var isOK = false;
   
   var startDate = start.getTime();
   var endDate   = end.getTime();
   var duration = endDate - startDate;
    $.ajax({
        dataType: "jsonp",
        jsonp: 'jsonp', 
        jsonpCallback: 'callback4',
        url: '/recordings/conflicts.json?device=' + device + '&start=' + startDate + '&end=' + endDate + '&duration=' + duration
    }).done(function (data) { 
        if(typeof data === "undefined" || typeof data['catalogs'] === "undefined") {
           isOK = true;
        } else{
           isOK = false;
        }

        if ( isOK ) {
            existsConflicts = false;
        } else {         
            $.each(data['catalogs'], function(i, v){
                var myId = v['http://purl.org/dc/terms/']['identifier'][0]['value'];
                if (myId === eventId ) { 
                    return true; 
                } else { 
                    existsConflicts = true; 
                    return false; 
                }     
            });
        }

        if ( callback_ok !== 'undefined' ) {
            callback_ok( existsConflicts );
        }
    });
}
var caca;
function createWfproperties( agentProperties ) {
    caca = agentProperties;
    // SELECT THE CHECKBOXES ACORDING TO AGENT.PROPERTIES
    var myRegexp = /org.opencastproject.workflow.config.(.+)=(\w+)/;
    var wfpHtml = '';
    var data = agentProperties.split( '\n' );

    $.each( data, function( i, v ) {
        var match = myRegexp.exec( v );
        if ( match !== null) {
            wfpHtml = wfpHtml + match[ 1 ] + '=' + match[ 2 ] + '\n';
        }
    });

    return wfpHtml;
}
/* UPDATE AGENT - CREATE MEDIA PACKAGE */
function updateEvent( event ) {
    
    // CREATE MEDIAPACKAGE
    var catalogSearched = getObjects( all_catalogs.catalogs, "_identifier", event.id );
    var agent = {};
    agent.name = catalogSearched [ 0 ][ '_spatial' ];
    

    $.when( $.ajax( '/recordings/' + event.id + '.json' ), 
            $.ajax( '/capture-admin/agents/' + agent.name + '/configuration.json' ),
            $.ajax( '/recordings/' + event.id + '/agent.properties' )
    ).then(function( a1, a2, a3){

        // first ajax - agent info
        if ( a1[ 1 ] === "success" ) {
            event.parameters = a1[ 0 ][ 'http://purl.org/dc/terms/' ];
            
        }

        // second ajax - agent configuration
        if ( a2[ 1 ] === "success" ) {
            agent.configuration  = a2[ 0 ][ 'properties-response' ][ 'properties' ];
        } 
        
        if ( a3[ 1 ] === "success" ) {
            agent.properties  = a3[ 0 ];
        } 
        
        
        var startDate   = event.start.getTime();
        var endDate     = event.end.getTime();
        var duration    = endDate - startDate;

        var payload = {
            'agentparameters' :  createAgentParameters( agent.properties ),
            'dublincore'      :  createDublinCoreParameters( agent.name, startDate, endDate, event.parameters ),
            'events'          :  createEventParameters( startDate, duration ),
            'wfproperties'    :  createWfproperties( agent.properties )
        }; 

        $.ajax({
            type: 'PUT',
            data: payload,
            url: '/recordings/' + event.id,
            error:function (xhr, ajaxOptions, thrownError){
                console.log(xhr);
                console.log(thrownError);
            }  
         }).done(function (data) {
            //console.log( "Event updated:",data );

         });       
    });    
}






function createAgentParameters( properties ) {
    /*    EXAMPLE
   agentparameters
   "capture.device.names=MOCK_SCREEN,MOCK_PRESENTER,MOCK_MICROPHONE
   org.opencastproject.workflow.definition=full
   org.opencastproject.workflow.config.trimHold=false
   org.opencastproject.workflow.config.captionHold=false
   "
   */

    // capture.device.names
    var myRegexp = /capture.device.names=(.*)\n/;
    var match = myRegexp.exec( properties );
    if( !match || typeof match[1] === "undefined" ) {
        resultCaptureDeviceNames = 0; 
    } else { 
        resultCaptureDeviceNames = match[ 1 ];
    }
    // org.opencastproject.workflow.definition
    var myRegexp = /org.opencastproject.workflow.definition=(.*)\n/;
    var match = myRegexp.exec( properties );
    if( !match || typeof match[1] === "undefined" ) {
        resultWorkflowDefinition = 0; 
    } else { 
        resultWorkflowDefinition = match[ 1 ];
    }
    
    // org.opencastproject.workflow.config.trimHold
    var myRegexp = /org.opencastproject.workflow.config.trimHold=(.*)\n/;
    var match = myRegexp.exec( properties );
    if( !match || typeof match[1] === "undefined" ) {
        resultConfigTrimHold = 0; 
    } else { 
        resultConfigTrimHold = match[ 1 ];
    }
    
    // org.opencastproject.workflow.config.captionHold
    var myRegexp = /org.opencastproject.workflow.config.captionHold=(.*)\n/;
    var match = myRegexp.exec( properties );
    if( !match || typeof match[1] === "undefined" ) {
        resultConfigCaptionHold = 0; 
    } else { 
        resultConfigCaptionHold = match[ 1 ];
    }
    
    // build queryAgentParameters string
    var queryAgentParameters = '';
    queryAgentParameters = queryAgentParameters + 'capture.device.names=' + resultCaptureDeviceNames + '\n';
    queryAgentParameters = queryAgentParameters + 'org.opencastproject.workflow.definition=' + resultWorkflowDefinition + '\n';
    queryAgentParameters = queryAgentParameters + 'org.opencastproject.workflow.config.trimHold=' + resultConfigTrimHold + '\n';
    queryAgentParameters = queryAgentParameters + 'org.opencastproject.workflow.config.captionHold=' + resultConfigCaptionHold + '\n';
    
    return queryAgentParameters;
    

}

function createDublinCoreParameters( agentName, startDate, endDate, parameters ) {

    var queryDublinCoreParameters = '<dublincore xmlns="http://www.opencastproject.org/xsd/1.0/dublincore/" xmlns:dcterms="http://purl.org/dc/terms/">\n';
   
    $.each( parameters, function ( i,v ) {
        if ( i === "temporal" ) {
            return true;
        }
        dctermName = i;
        if ( i === "abstract" ) {
            dctermValue = '';
        } else {
            dctermValue = v[ 0 ][ 'value' ];
        }
        
        
        queryDublinCoreParameters = queryDublinCoreParameters + '<dcterms:' + dctermName + '>' + dctermValue + '</dcterms:' + dctermName + '>\n';
    });

    // STARTDATE, ENDDATE & DURATION
    var startFormatted = toISODate( startDate, true );
    var endFormatted = toISODate( endDate, true );
    queryDublinCoreParameters = queryDublinCoreParameters + '<dcterms:temporal>start=' + startFormatted + '; end=' + endFormatted + '; scheme=W3C-DTF;</dcterms:temporal>\n';
   
   
    // cierro el xml
    queryDublinCoreParameters = queryDublinCoreParameters + '</dublincore>';   
    return queryDublinCoreParameters;
}

function createEventParameters( startDate, duration ) {
   /*
    * event
      "startDate=1364378400000
      duration=3600000
      null=151
      agentTimeZone=60
      "
    */
   
   var queryEventParameters = '';
   queryEventParameters = queryEventParameters + 'startDate=' + startDate + '\n';
   queryEventParameters = queryEventParameters + 'duration=' + duration + '\n';
   queryEventParameters = queryEventParameters + 'agentTimeZone=60\n'; // TODO agentTimeZone
   
   return queryEventParameters;  
}

/* END UPDATE AGENT - END CREATE MEDIA PACKAGE */

var calendarDefaultView = 'agendaWeek';
var calendarCurrentView = calendarDefaultView;
var firstDay            = getFirstDay();
var lastDay             = getLastDay();

function init_calendar() {
   $( ".datepicker" ).datepicker({ dateFormat: 'dd/mm/yy' });

   calendar = $( '#calendar' ).fullCalendar({
        //defaultView: 'agendaWeek',
        defaultView: calendarDefaultView,
        viewDisplay: function(view) {
            calendarCurrentView = view.name;
            firstDay = getFirstDay();
            lastDay = getLastDay();
            if( calendar!== undefined ) { 
                search(); /* prevent second run when calendar loads (bug?) */ 
            }
        },
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'agendaDay, agendaWeek, month'
        },
        editable: true,
        firstDay: 1, // TODO :: METER EN ARCHIVO DE CONFIGURACION
        allDaySlot: false,
        next:   function() {
            console.log('siguiente');
        },/*
        eventClick: function(event) {
            if (event.url) {
                window.open(event.url, event.title);
                return false;
            }
        },*/
        droppable: true, // this allows things to be dropped onto the calendar !!!
        drop: function( date, allDay ) { // this function is called when something is dropped

            var today = new Date();
            // if calendar view == month, the date is now() + 2 hours ( prevents book a event in a past date )
            view = calendar.fullCalendar( 'getView' );            
            if ( view.name === 'month' && date.toDateString() === today.toDateString() ){
                date = new Date();
                date.setHours( date.getHours() + 2 );
            }
            
            
            if ( date.getTime() < today.getTime() ) {
                launchMessagePastDates();
                return false;
            }
               
                // retrieve the dropped element's stored Event Object
                var originalEventObject = $( this ).data( 'eventObject' );
                
         
                // we need to copy it, so that multiple events don't have a reference to the same object
                var copiedEventObject = $.extend({}, originalEventObject);
         
                // assign it the date that was reported
                copiedEventObject.start     = date; 
                copiedEventObject.end       = new Date(date.getTime()+3300000); 
                copiedEventObject.allDay    = false;
                copiedEventObject.color     = agents_color[originalEventObject.agent]; // coge el color del array de agentes-colores
                
                
                
            var callback_ok = function( conflicts ) {
                if ( conflicts ) {
                    launchConflictError();
                    return false;

                } else {
                    // creo el evento en matterhorn
                   var payload = {
                      'dublincore'      :  createDublinCoreParametersDropCalendar( copiedEventObject ),
                      'event'           :  createEventParametersDropCalendar( copiedEventObject )
                   };

                    var agentName       = copiedEventObject.agent;
                    var id = -1;

                   $.ajax({
                          url           :   '/capture-admin/agents/' + agentName + '.json',
                          error: function (xmlHttpRequest, textStatus, errorThrown) {
                              console.log(xmlHttpRequest, textStatus, errorThrown);
                          },
                                  crossDomain: true
                   }).done(function (data) { 
                        payload.agentparameters = createAgentParametersDropCalendar ( data );


                        $.ajax({
                            type        :   'POST',
                            data        :   payload,
                            url         :   '/recordings'
                        }).done(function (data2, status, xhr) { 

                            var str = xhr.getResponseHeader("Location");
                            var myRegexp = /.*\/(\d+).xml/;
                            var match = myRegexp.exec( str );

                            if( !match || typeof match[ 1 ] === "undefined" ) {
                                id = -1; 
                            } else { 
                                id = match[ 1 ];
                            }

                            copiedEventObject.url       = 'scheduler.html?eventId=' + id + '&edit=1';
                            // render the event on the calendar
                            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                            calendar.fullCalendar( 'renderEvent', copiedEventObject, true );
                            
                            //TODO: añadir el nuevo evento (tengo el ID) a panel.agents
                            addNewEventToCatalogs( copiedEventObject );
                         });
                   });
                }
            };
            
           checkConflicts( -1 , copiedEventObject.agent, copiedEventObject.start, copiedEventObject.end, callback_ok );
                


        },
        events: function(start, end, callback) {
            //alert("nuevo evento con start: "+start + " / end: "+end);
         },
        eventResize: function(event,dayDelta,minuteDelta,revertFunc) {
            var catalogSearched = getObjects( all_catalogs.catalogs, "_identifier", event.id );
            var agent = catalogSearched [ 0 ][ '_spatial' ];
            var callback_ok = function( conflicts ) {
                
                if ( conflicts ) {
                    launchConflictError();
                    revertFunc();
                } else {
                    if ( confirm ( "Save changes?" ) ) {
                        updateEvent( event );
                    } else {
                        revertFunc();
                    }
                }
            };
            
           checkConflicts( event.id, agent, event.start, event.end, callback_ok );

        },
        eventDrop: function(event,dayDelta,minuteDelta,allDay,revertFunc) {
            var today = new Date();
            
            if ( event._end.getTime() < today.getTime() ) {
                launchMessagePastDates();
                revertFunc();
                return false;
            }
            var catalogSearched = getObjects( all_catalogs.catalogs, "_identifier", event.id );
            var agent = catalogSearched [ 0 ][ '_spatial' ];
            
            var callback_ok = function( conflicts ) {
                
                if ( conflicts ) {
                    launchConflictError();
                    revertFunc();
                } else {
                    if ( confirm ( "Save changes?" ) ) {
                        updateEvent( event );
                    } else {
                        revertFunc();
                    }
                }
            };  
           checkConflicts( event.id, agent, event.start, event.end, callback_ok );
        }
        
   });
   

   

   calendar.fullCalendar('gotoDate', firstDay);
   
   // obtengo los valores de las fechas del calendario
   view = calendar.fullCalendar( 'getView' );

   $( '#from_date' ).val( ( "0" + view.start.getDate()).slice( -2 ) + "/" + ( "0" + ( view.start.getMonth()+1 )).slice( -2 ) + "/" + view.start.getFullYear());
   $( '#to_date ').val( ( "0" + view.end.getDate()).slice( -2 ) + "/" + ( "0" + ( view.end.getMonth()+1 )).slice( -2 ) + "/" + view.end.getFullYear());
       
}

function addNewEventToCatalogs( obj ) { //TODO
    var nc = new Catalog();
    nc.creator( "" );
    nc.end ( obj.end );
    nc.identifier( obj.id );
    nc.scheme( "W3C-DTF" );
    nc.spatial( obj.agent );
    nc.start( obj.start );
    nc.title( obj.title );

    all_catalogs.catalogs.push( nc ); 
}


function launchMessagePastDates() { //message box error: past date
    $( "#messagePastDates" ).dialog({
        resizable: true,
        //width:200,
        modal: true,
        buttons: {
          "OK": function() {
            $( this ).dialog( "close" );
          }
        }
  });
}
   
function launchConflictError() { //message box error: past date
    
    $( "#messageConflicts" ).dialog({
        resizable: true,
        //height:140,
        modal: true,
        buttons: {
          "OK": function() {
            $( this ).dialog( "close" );
          }
        }
  });
}

$( document ).ready( function() {
   $( '#search_input' ).keypress( function( e ){
       if ( e.which === 13 ) {
        reset_calendar();
        params = {};
         if( $( '#search_input' ).val()!== '' ) {
             params.q = $( '#search_input' ).val();
         }
         search( params );    
       }
   });
   $( '#search_input' ).focusout( function( e ){
        reset_calendar();
        params = {};
         if( $( '#search_input' ).val()!== '' ) {
             params.q = $( '#search_input' ).val();
         }
         search( params );    
   });


    $( '#filter' ).on( "click", "input[type=checkbox]", function( event ){
       val_clickado = $( this ).val();
       clickado = $( this ).is( ':checked' );
       if ( val_clickado === "all" ) {
           if( clickado ) {
               $( '#filter input[type=checkbox]' ).prop( 'checked', true );
           } else {
               $( '#filter input[type=checkbox]' ).prop( 'checked', false );
           }
       } else {
           if ( clickado ) {
               // examino cuántos checks están marcados
                if ( !$( '#list_filter_agents li input[type=checkbox]:not(:checked)' ).length ) {
                    // chequeo "todos"
                    $( '#title_filter_agents input[type=checkbox]' ).prop( 'checked', true );
                }
           } else {
               // quito el check a "todos"
                $( '#title_filter_agents input[type=checkbox]' ).prop( 'checked', false );
           }
       }
       
       filtrar_por_agents();
    });
    init(); // ejecutar al inicio
});

