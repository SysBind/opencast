
//Custom Events and the Observer Pattern
var o = $( {} );
$.each({
        trigger : 'publish',
        on      : 'subscribe',
        off     : 'unsubscribe'
}, function( key, val ) {
        jQuery[ val ] = function() {
                o[ key ].apply( o, arguments );
        };
});

var panel = {
    agents  :   {},                 // agents
    html    :   {},                 // VIEW
    refresh :   { _default : 3600 }    // refresh - agent timers
};

var dataToBinary = function(data){
    var data_string = "";
    for(var i=0; i<data.length; i++){
        data_string += String.fromCharCode(data[i].charCodeAt(0) & 0xff);
    }
    return data_string;
};

function getBase64FromImageUrl(URL) {
    var img = new Image();
    img.src = URL;
    img.onload = function () {

        var canvas = document.createElement("canvas");
        canvas.width =this.width;
        canvas.height =this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        panel.preCacheImgOff = dataURL;

    };
}

//getBase64FromImageUrl( '/dashboard/resources/off.png' );
//panel.preCacheImgOff = getBase64FromImageUrl( '/dashboard/resources/off.png' );
panel.preCacheImgOff = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAFoCAYAAADHMkpRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QQYDTQbO87VqQAABpxJREFUeNrt1kEBACAAhLDT/gVsaxC2CLw4294AAMi4EgAAtBhAAIAYAwgAEGMAAQBiDCAAQIwBBACIMYAAADEGEAAgxgACAMQYQACAGAMIABBjAAEAYgwgAECMAQQAiDGAAAAxBhAAIMYAAgDEGEAAgBgDCAAQYwABAGIMIABAjAEEAIgxgAAAMQYQACDGAAIAxBhAAIAYAwgAEGMAAQBiDCAAQIwBBACIMYAAADEGEAAgxgACAMQYQACAGAMIABBjAAEAYgwgAECMAQQAiDGAAAAxBhAAIMYAAgDEGEAAgBgDCAAQYwABAGIMIABAjAEEAIgxgAAAMQYQACDGAAIAxBhAAIAYAwgAEGMAAQBiDCAAQIwBBACIMYAAADEGEAAgxgACAMQYQACAGAMIABBjAAEAYgwgAECMAQQAiDGAAAAxBhAAIMYAAgDEGEAAgBgDCAAQYwABAGIMIABAjAEEAIgxgAAAMQYQACDGAAIAxBhAAIAYAwgAEGMAAQBiDCAAQIwBBACIMYAAADEGEAAgxgACAMQYQACAGAMIABBjAAEAYgwgAECMAQQAiDGAAAAxBhAAIMYAAgDEGEAAgBgDCAAQYwABAGIMIABAjAEEAIgxgAAAMQYQACDGAAIAxBhAAIAYAwgAEGMAAQBiDCAAQIwBBACIMYAAADEGEAAgxgACAMQYQACAGAMIABBjAAEAYgwgAECMAQQAiDGAAAAxBhAAIMYAAgDEGEAAgBgDCAAQYwABAGIMIABAjAEEAIgxgAAAMQYQACDGAAIAxBhAAIAYAwgAEGMAAQBiDCAAQIwBBACIMYAAADEGEAAgxgACAMQYQACAGAMIABBjAAEAYgwgAECMAQQAiDGAAAAxBhAAIMYAAgDEGEAAgBgDCAAQYwABAGIMIABAjAEEAIgxgAAAMQYQACDGAAIAxBhAAIAYAwgAEGMAAQBiDCAAQIwBBACIMYAAADEGEAAgxgACAMQYQACAGAMIABBjAAEAYgwgAECMAQQAiDGAAAAxBhAAIMYAAgDEGEAAgBgDCAAQYwABAGIMIABAjAEEAIgxgAAAMQYQACDGAAIAxBhAAIAYAwgAEGMAAQBiDCAAQIwBBACIMYAAADEGEAAgxgACAMQYQACAGAMIABBjAAEAYgwgAECMAQQAiDGAAAAxBhAAIMYAAgDEGEAAgBgDCAAQYwABAGIMIABAjAEEAIgxgAAAMQYQACDGAAIAxBhAAIAYAwgAEGMAAQBiDCAAQIwBBACIMYAAADEGEAAgxgACAMQYQACAGAMIABBjAAEAYgwgAECMAQQAiDGAAAAxBhAAIMYAAgDEGEAAgBgDCAAQYwABAGIMIABAjAEEAIgxgAAAMQYQACDGAAIAxBhAAIAYAwgAEGMAAQBiDCAAQIwBBACIMYAAADEGEAAgxgACAMQYQACAGAMIABBjAAEAYgwgAECMAQQAiDGAAAAxBhAAIMYAAgDEGEAAgBgDCAAQYwABAGIMIABAjAEEAIgxgAAAMQYQACDGAAIAxBhAAIAYAwgAEGMAAQBiDCAAQIwBBACIMYAAADEGEAAgxgACAMQYQACAGAMIABBjAAEAYgwgAECMAQQAiDGAAAAxBhAAIMYAAgDEGEAAgBgDCAAQYwABAGIMIABAjAEEAIgxgAAAMQYQACDGAAIAxBhAAIAYAwgAEGMAAQBiDCAAQIwBBACIMYAAADEGEAAgxgACAMQYQACAGAMIABBjAAEAYgwgAECMAQQAiDGAAAAxBhAAIMYAAgDEGEAAgBgDCAAQYwABAGIMIABAjAEEAIgxgAAAMQYQACDGAAIAxBhAAIAYAwgAEGMAAQBiDCAAQIwBBACIMYAAADEGEAAgxgACAMQYQACAGAMIABBjAAEAYgwgAECMAQQAiDGAAAAxBhAAIMYAAgDEGEAAgBgDCAAQYwABAGIMIABAjAEEAIgxgAAAMQYQACDGAAIAxBhAAIAYAwgAEGMAAQBiDCAAQIwBBACIMYAAADEGEAAgxgACAMQYQACAGAMIABBjAAEAYgwgAECMAQQAiDGAAAAxBhAAIMYAAgDEGEAAgBgDCAAQYwABAGIMIABAjAEEAIgxgAAAMQYQACDGAAIAxBhAAIAYAwgAEGMAAQBiDCAAQIwBBACIMYAAADEGEAAgxgACAMQYQACAGAMIABBjAAEAYgwgAECMAQQAiDGAAAAxBhAAIMYAAgDEGEAAgBgDCAAQYwABAGIMIABAjAEEAIgxgAAAMR+YLANpVtV3WwAAAABJRU5ErkJggg%3D%3D';

panel.loadAgents = function () {
    $.ajax({
        url:    '/capture-admin/agents.json'
    }).done( function ( data ) {
        $.each( process_mh_array_response( data.agents.agent ), function ( i, v ){
            panel.agents[ v.name ] = v;
            panel.agents[ v.name ].preCacheImg = panel.preCacheImgOff;
        });
    
        $.publish( 'dashboard/reloadall' );
        
        
    });
};


panel.loadAgentsSync = function () {
    $.ajax({
	    url:    '/capture-admin/agents.json',
	    async: false,
	    success: function ( data ) {
		$.each( process_mh_array_response( data.agents.agent ), function ( i, v ){
			panel.agents[ v.name ] = v;
			panel.agents[ v.name ].preCacheImg = panel.preCacheImgOff;
		});
		$.publish( 'dashboard/reloadall' );
	    } });

};


panel.loadAgent = function ( name ) {
    var actualDate = toISODate(new Date(), 'utc');
    $.when( $.ajax( '/capture-admin/agents/' + name + '.json' ), 
            $.ajax( '/capture-admin/agents/' + name + '/configuration.json' ), 
            $.ajax( '/recordings/recordings.json?spatial=' + name + '&startsfrom=' + actualDate + '&sort=EVENT_START')
          ).then(function( a1, a2, a3 ){

            var preCacheImg = panel.agents[ name ].preCacheImg;
            // first ajax - agent info
            if ( a1[ 1 ] === "success" ) {
                var v = a1 [ 0 ][ 'agent-state-update' ];
                panel.agents[ name ] = v;
                             
            }

            // second ajax - agent configuration
            if ( a2 [ 1 ] === "success" ) {
                panel.agents[name].properties  = a2 [ 0 ][ 'properties-response' ][ 'properties' ];
            } 
            
            
            // set offline status
            if ( v.properties !== undefined ) {            
                // State (check if agent is offline) & time   
                var pollingObject = getObjects ( v.properties, "key", "capture.agent.state.remote.polling.interval" );
                if ( pollingObject.length > 0 ) {
                    var timeSinceUpdate = parseInt( pollingObject[ 0 ].value );
                    if ( v['time-since-last-update'] > ( timeSinceUpdate * 1000 )) {
                        v.state = "offline";
                    }
                }
            }


            // third ajax - next recording
            if ( a3 [ 1 ] === "success" ) {
                if ( a3 [ 0 ][ 'catalogs' ].length >0 ) {
                    var nextObj = a3 [ 0 ] [ 'catalogs' ][ 0 ][ 'http://purl.org/dc/terms/' ];
                    // save object
                    
                    
                    $.ajax({
                          url:   '/recordings/' + nextObj['identifier'][0].value + '.json',
                          error: function (xmlHttpRequest, textStatus, errorThrown) {
                              console.log(xmlHttpRequest, textStatus, errorThrown);
                          },
                        crossDomain: true
                    }).done(function (data) { 
                        $.extend( nextObj, data['http://purl.org/dc/terms/'] );
                        panel.agents[ name ].nextRecording = nextObj;
                    });
                    
                    
                }
            }
            
            panel.agents[ name ].preCacheImg = preCacheImg; // precache images
            
            $.publish( 'dashboard/reload', name ); 
    });
};

panel.search = function ( params ) {
   $.ajax({
         dataType: "jsonp",
         data: params,
         jsonp: 'jsonp', 
         jsonpCallback: 'callback1',
         url: "/recordings/recordings.json"
            
    }).done(function ( data ) {
        console.log( 'search',data );
    }); 
};

panel.refreshAllAgents = function () {

    $.each( panel.agents, function ( i, v ){
        panel.refreshAgents( v.name );
    });
};

    
panel.refreshAgents = function ( name, customInterval) {
    var data = panel.refresh[ name ];
    var aux_int = customInterval || panel.refresh._default;
    
    if (data) {
        clearInterval( data.id );
        aux_int = customInterval || data.interval;
    }
    panel.refresh[ name ] = {
        interval: aux_int,
        id: setInterval( function(){ $.publish( 'dashboard/reload', name ); console.log("actualizo");}, aux_int * 1000 )
    };
};




/*
 * 
 * VIEW
 * 
 */

panel.html.agentDefaultSize = 200;
panel.html.actualSize = panel.html.agentDefaultSize;
panel.html.agentDefaultFontSize = 14;
panel.html.actualFontSize = panel.html.agentDefaultFontSize;
panel.html.agentMinSize = 100;
panel.html.agentMaxSize = 600;
panel.html.agentSizeInc = 50;
panel.html.agentsHide = new Array();        // list of hidden agents [id]
panel.html.agentsFiltered = new Array();    // list of filtered agents [id]
panel.html.agentsOpacity = 0.5;
panel.html.panelStyle = '';
panel.html.imminentTimeMs = 4 * 3600 * 1000;


panel.html.loadStyle = function () {
    // load default value for table/grid
    if( localStorage && localStorage.getItem( 'stylePanel' ) ){
        panel.html.panelStyle = localStorage.getItem( 'stylePanel' );

        if ( panel.html.panelStyle === "table" ) {
            $( '.tableBtn' ).addClass ( 'pressed' );
            $(' .addBtn ').prop( 'disabled', true );
            $(' .subBtn ').prop( 'disabled', true );
        } else {
            $( '.gridBtn' ).addClass ( 'pressed' );
        }
    } else {
        panel.html.panelStyle = "grid";
        $( '.gridBtn' ).addClass ( 'pressed' );
    }
};


panel.html.setAgentsSize = function(width,animate,duration) {
    if ( width<panel.html.agentMinSize ) {
        width = panel.html.agentMinSize;
    }
    if ( width>panel.html.agentMaxSize ) {
        width = panel.html.agentMaxSize;
    }
    var height = width;
    var style = {
        "width":width + "px",
        "height":height + "px"
    };
    if ( duration===undefined ) duration = 500;
    var agentsItems = $('.dashboardItemContainer');
    $.each(agentsItems, function( i, agent ){
        if (animate) {
            $(agent).animate(style,{complete:function() {
                panel.html.scaleTexts( agent );
            },duration:duration});
        }
        else {
            $(agent).css( style );
            panel.html.scaleTexts( agent );
        }
    });
    
    return width;
};



panel.html.incAgentsSize = function() {
    var size = parseInt($('.dashboardItemContainer').first().css('width').slice(0,-2));
    size += panel.html.agentSizeInc;
    var actualSize = panel.html.setAgentsSize(size,true,200);
    return actualSize;
};
	
panel.html.decAgentsSize = function() {
    var size = parseInt($('.dashboardItemContainer').first().css('width').slice(0,-2));
    size -= panel.html.agentSizeInc;
    var actualSize = panel.html.setAgentsSize(size,true,200);
    return actualSize;
};


panel.html.agents = function ( name, isOdd ) {
    var htmlAgent = '';
    var v = panel.agents[ name ];
    
    // opacity
        var opacity = 1;
        var display = 'block';
        var show_or_hide = "show";
        
        var hiddenCheckOn = false;
        if ( $( '#showHidden' ).is( ':checked' )) {
            hiddenCheckOn = true;
        }

        var filterCheckOn = false;
        if ( $( '#showFiltered' ).is( ':checked' )) {
            filterCheckOn = true;
        }
    
        agentId = name;
        if ( hiddenCheckOn ) {  
            if ( filterCheckOn ){
                // no compruebo si están filtrados, si están ocultos se pone la 
                // opacidad a lo que marca la constante
                if ( $.inArray ( agentId, panel.html.agentsHide ) === -1 ) {
                    opacity = 1;
                    //panel.html.showHideAgentAction( agentId, true );
                } else {
                    opacity = panel.html.agentsOpacity;
                    show_or_hide = 'hide';
                    //panel.html.showHideAgentAction( agentId, true, panel.html.agentsOpacity );
                }
            } else {
                // si están filtrados no se muestran, si están ocultos se pone
                // la opacidad a lo que marca la constante
                if ( $.inArray ( agentId, panel.html.agentsFiltered ) > -1 ) {
                    if ( $.inArray ( agentId, panel.html.agentsHide ) === -1 ) {
                        opacity = 1;
                        //panel.html.showHideAgentAction( agentId, true );
                    } else {
                        opacity = panel.html.agentsOpacity;
                        show_or_hide = 'hide';
                        //panel.html.showHideAgentAction( agentId, true, panel.html.agentsOpacity );
                    } 
                } else {
                    opacity = 0;
                    display = 'none';
                    show_or_hide = 'hide';
                    //panel.html.showHideAgentAction( agentId, true, 0 );
                }
            }
            
        } else {
            if ( filterCheckOn ){
                // no se comprueban los filtrados, se muestran si no están ocultos
                if ( $.inArray ( agentId, panel.html.agentsHide ) === -1 ) {
                    opacity = 1;
                    //panel.html.showHideAgentAction( agentId, true );
                } else {
                    opacity = 0;
                    display = 'none';
                    show_or_hide = 'hide';
                    //panel.html.showHideAgentAction( agentId, true, 0 );
                }
            } else {
                // no muestro los ocultos ni los filtrados
                if ( $.inArray ( agentId, panel.html.agentsHide ) === -1 && 
                     $.inArray ( agentId, panel.html.agentsFiltered ) > -1 ) {
                    opacity = 1;
                    //panel.html.showHideAgentAction( agentId, true );
                } else {
                    opacity = 0;
                    display = 'none';
                    show_or_hide = 'hide';
                    //panel.html.showHideAgentAction( agentId, true, 0 );
                }
            }
            
        } 
    
    
    
    
    
    
    if ( panel.html.panelStyle === "grid" ) {
        // GRID
       

        
        var stateAgent = '';
        if ( v.properties !== undefined ) {            
            // State (check if agent is offline) & time   
            var pollingObject = getObjects ( v.properties, "key", "capture.agent.state.remote.polling.interval" );
            if ( pollingObject.length > 0 ) {
                var timeSinceUpdate = parseInt( pollingObject[ 0 ].value );
                if ( v['time-since-last-update'] > ( timeSinceUpdate * 1000 )) {
                    stateAgent = "offline";
                } else {
                    stateAgent = v.state;
                }
            }
        } else {
            stateAgent = "idle";        // TODO (caso por contemplar)
        }

        
        var imageSrc = panel.agents[ v.name ].preCacheImg || panel.preCacheImgOff;
        
        htmlAgent = 
            '<div class="dashboardItemContainer" id="' + v.name + '" style="opacity: ' + opacity  + '; display: ' + display + '; width: ' + panel.html.actualSize + 'px; height: ' + panel.html.actualSize + 'px; float: left;">' + 
                '<img class="dashboardItem image" src="' + imageSrc + '" alt="v.name" id="screen_'+ v.name + '" style="font-size: ' + panel.html.actualFontSize + 'px;">' +
                '<img class="dashboardItem screenGlass" src="resources/monitor_glass.png" alt="screen glass" style="font-size: ' + panel.html.actualFontSize + 'px;">' + 
                '<div class="dashboardItem onlineIcon"  id="online_status_' + v.name + '" style="font-size: ' + panel.html.actualFontSize + 'px;"></div>' + 
                '<div class="dashboardItem statusText ' + stateAgent + '" id="statusText_' + v.name + '" style="font-size: ' + panel.html.actualFontSize + 'px;">' + stateAgent + '</div>' + 
                '<div class="dashboardItem info name"   style="font-size: ' + panel.html.actualFontSize + 'px;">' + v.name + '</div>' + 
                '<div class="dashboardItem infoButton"  style="font-size: 24px;">i</div>' +
                '<div class="dashboardItem hideButton ' + show_or_hide + '"     title="Ocultar agente. Para volver a mostrar desplegar la barra lateral y seleccionar &quot;ver agentes ocultos&quot;, y luego pulsra el botón mostrar del agente" style="font-size: 31px;"></div>' +
                '<a class="vncLink" href="vnc.html?host=' + v.url + '"><div class="dashboardItem vncButton" style="font-size: 31px;"></div></a>' +
                '<a href="calendar.html?agent=' + v.name + '"><div class="dashboardItem calendarButton" style="font-size: 31px;"></div></a>' +
            '</div>';
    
    } else {    // TABLE VIEW
        var oddClass = '';
        
        if ( isOdd ) {
            oddClass = 'odd';
        }
        
        if ( display === "block" ) {
            display = "table-row";  // fix for tables
        }
        
        var calendarHtml= '<a href="calendar.html?agent=' + v.name + '"><img class="iconTable" src="resources/iconCalendarTable.png" /></a>';
          
        var stateAgent  = '';
        var timeAgent   = '...';
        var nextHtml    = '...';
        var freeHdHtml  = '...';
        var toolHtml    = 'WF | <span class="vncButton">VNC</span> | SSH';
        var volHtml     = 'Vvm';
        var videoHtml   = '<img class="iconTable infoButton" src="resources/iconVideo.png" />';
        var logHtml     = '<img class="iconTable" src="resources/iconLog.png" />';
        var configHtml  = '<img class="iconTable" src="resources/iconConfig.png" />';
        var hideHtml    = '<div class="iconTable hideButton ' + show_or_hide + '"></div>';

        if ( v.properties !== undefined ) {
            // Free space
            var freeHdObject = getObjects ( v.properties, "key", "capture.cleaner.mindiskspace" );
            if ( freeHdObject.length > 0 ) {
                freeHdHtml = humanFileSize( freeHdObject[ 0 ].value );
            }
            
            // State (check if agent is offline) & time
            var pollingObject = getObjects ( v.properties, "key", "capture.agent.state.remote.polling.interval" );
            if ( pollingObject.length > 0 ) {
                var timeSinceUpdate = parseInt( pollingObject[ 0 ].value );
                if ( v['time-since-last-update'] > ( timeSinceUpdate * 1000 )) {
                    stateAgent = "offline";
                } else {
                    stateAgent = v.state;
                }
                timeAgent = formatSecondsAsTime ( v[ 'time-since-last-update' ] / 1000 );
            }
        }
        
        // set next - html

        if ( panel.agents[ name ].nextRecording !== undefined) {
            nextObj = panel.agents[ name ].nextRecording;

            // temporal
            var myRegexp = /start=(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d\:\d+([+-][0-2]\d:[0-5]\d|Z{0,1}))/;
            var match = myRegexp.exec( nextObj[ 'temporal' ][ 0 ][ 'value' ] );
            if( !match || typeof match[1] === "undefined" ) {
                result = 0; 
            } else { 
                result = match[ 1 ];
            }
            var dateObj = fromUTCDateString( match[ 1 ] ) || 0;
            var startsfrom = ( "0" + dateObj.getDate() ).slice( -2 ) + '/' + ( "0" + (dateObj.getMonth()+1) ).slice( -2 ) + '/' + dateObj.getFullYear() + ' ' + ( "0" + dateObj.getHours() ).slice( -2 ) + ':' + ( "0" + dateObj.getMinutes() ).slice( -2 );  
            
            // next event and tooltip
            var nextEvent = {
                'title'         :   '',
                'creator'       :   '',
                'isPartOf'      :   '',
                'contributor'   :   '',
                'subject'       :   '',
                'language'      :   '',
                'description'   :   '',
                'license'       :   ''
            };
            
            $.each( nextObj, function( i, v )  {
                nextEvent[ i ] = v[ 0 ].value;
            });
            
            nextHtml =   '<span>' + startsfrom  + '</span><div class="moreInfoNext">+</div>' + '<div class="tooltip">';
            
            nextHtml = nextHtml + '<table><thead><td>Field</td><td>Value</td></thead><tbody>';
            var j = 0;
            $.each( nextEvent, function( i2, v2 )  {
                if ( i2 === "abstract" ) { return true; }
                if ( v2 !== '' ){
                    var odd = "";
                    j++;
                    if ( j % 2 !== 0 ) { odd = "odd"; }
                        if ( i2 === "temporal" )    { i2 = "start"; v2 = startsfrom; }
                        if ( i2 === "spatial")      { i2 = "agent"; }
                        if ( i2 === "identifier" )  { v2 = '<a href="/dashboard/scheduler.html?eventId=' + v2 + '&edit=1">' + v2 + '</a>'; };
                        nextHtml = nextHtml + '<tr class="' + odd + '"><td>' + i2 + '</div><td>' + v2 + '</div></tr>';
                }
                
            });
            nextHtml = nextHtml + '</tbody></table>';
            nextHtml = nextHtml + '</div>'; //end tooltip
            
            
        }
        
        var stateHtml   = '<div class="stateAgentTableName ' + stateAgent + '">' + stateAgent + '</div>';
        
        // set timeHtml
        var timeHtml = '<div class="stateAgentTableName">' + timeAgent + '</div>';

       

            htmlAgent = htmlAgent + '<tr id="' + v.name + '" class="agentTableRow '     + oddClass      + '" style="opacity: ' + opacity + '; display: ' + display + ';">';
                htmlAgent = htmlAgent + '<td class="col col1">'   + v.name        + '</td>';
                htmlAgent = htmlAgent + '<td class="col col2">'   + calendarHtml  + '</td>';
                htmlAgent = htmlAgent + '<td class="col col3">'   + stateHtml     + '</td>';
                htmlAgent = htmlAgent + '<td class="col col4">'   + timeHtml      + '</td>';
                htmlAgent = htmlAgent + '<td class="col col5 nextEventTd">'   + nextHtml      + '</td>';
                htmlAgent = htmlAgent + '<td class="col col6">'   + freeHdHtml    + '</td>';
                htmlAgent = htmlAgent + '<td class="col col7">'   + toolHtml      + '</td>';
                htmlAgent = htmlAgent + '<td class="col col8">'   + volHtml       + '</td>';
                htmlAgent = htmlAgent + '<td class="col col9">'   + videoHtml     + '</td>';
                htmlAgent = htmlAgent + '<td class="col col10">'  + logHtml       + '</td>';
                htmlAgent = htmlAgent + '<td class="col col11">'  + configHtml    + '</td>';  
                htmlAgent = htmlAgent + '<td class="col col12">'  + hideHtml      + '</td>';  
            htmlAgent = htmlAgent + '</tr>';
        

    }
    
    return htmlAgent;
};


panel.html.prepareToScaleTexts = function(domNode) {
    for (var i=0;i<domNode.children.length;++i) {
        var child = domNode.children[i];
        var nodeSize = {x:$(child).position().left,y:$(child).position().top,w:$(child).width(),h:$(child).height()};
        child.originalSize = {fontSize:this.fontSize(child)};
        child.originalSize.x = nodeSize.x;
        child.originalSize.y = nodeSize.y;
        child.originalSize.w = nodeSize.w;
        child.originalSize.h = nodeSize.h;
        
    }
    
};


panel.html.scaleTexts = function(domNode) {
    
    for (var i=0;i<domNode.children.length;++i) {
        var child = domNode.children[i];
        var nodeSize = {
            x:$(child).position().left,
            y:$(child).position().top,
            w:$(child).width(),
            h:$(child).height()
        };

        var originalSize = child.originalSize;

        if (!originalSize) {
            console.log("base.dom.scaleTexts(): domNode could not be scaled. Original element size not found.");
            return;
        }

        var scaleFactor = nodeSize.w / originalSize.w;
        var fontSize = originalSize.fontSize.size * scaleFactor;
        if ( $( child).hasClass( 'statusText' ) ){
            panel.html.actualFontSize = fontSize;
        }
        child.style.fontSize = fontSize + originalSize.fontSize.units;
    }
};

panel.html.hideItem = function(agentElem) {
    agentElem.isAgentHidden = true;
    //this.applyFilters(true);
};

panel.html.fontSize = function(domElement) {
    var size = {size:0,units:'px'}
    var measure = $(domElement).css('font-size');
    if (/(\d+\.*\d*)(\D+)/.test(measure)) {
            size.size = RegExp.$1;
            size.units = RegExp.$2;
    }
    return size;
};


panel.html.allagents = function () {
    var htmlAgents = '';
    
    if ( panel.html.panelStyle === "table" ){
        htmlAgents = htmlAgents + '<table class="agentsTable">';
            htmlAgents = htmlAgents + '<thead><tr class="agentsTableHeader">';
                htmlAgents = htmlAgents + '<td class="col col1">Agent</td>';
                htmlAgents = htmlAgents + '<td class="col col2">Cal</td>';
                htmlAgents = htmlAgents + '<td class="col col3">State</td>';
                htmlAgents = htmlAgents + '<td class="col col4">Time</td>';
                htmlAgents = htmlAgents + '<td class="col col5">Next</td>';
                htmlAgents = htmlAgents + '<td class="col col6">Free HD</td>';
                htmlAgents = htmlAgents + '<td class="col col7">Tools</td>';
                htmlAgents = htmlAgents + '<td class="col col8">Audio</td>';
                htmlAgents = htmlAgents + '<td class="col col9">Video</td>';
                htmlAgents = htmlAgents + '<td class="col col10">Log</td>';
                htmlAgents = htmlAgents + '<td class="col col11">CFG</td>';
                htmlAgents = htmlAgents + '<td class="col col12">Hide</td>';
            htmlAgents = htmlAgents + '</tr></thead><tbody>';
        
    }

    var odd = 1;
    var isOdd = true;
    panel.html.agentsFiltered.length = 0; //emtpy array
    $.each( panel.agents , function ( i, v ){
        if ( odd % 2 === 0 ) {
            isOdd = true;
        } else {
            isOdd = false;
        }
        // update filteredAgents list
        panel.html.filteredAgentsUpdate( v );
        
        var htmlAgent = panel.html.agents( v.name, isOdd );
        htmlAgents = htmlAgents + htmlAgent;
        odd++;
    });

    if ( panel.html.panelStyle === "table" ){
        htmlAgents = htmlAgents + '</tbody></table>';
    }

    return htmlAgents;
};

panel.html.filteredAgentsUpdate = function ( v ) {
    var arTemp = new Array();
    var addItemStatus = false;
    var addItemCalendar = false;
    var checkStatus = false;
    var checkCalendar = false;
    /*
     * MATTERHORN STATUS
     */
    if ( $( '#filterStatus_Main' ).hasClass( 'pressed' ) ) {
        checkStatus = true;
    }
    
    if ( checkStatus ) {
        if ( $( '#filterStatus_Offline' ).is( ':checked' ) ) {
            if ( v.state === "offline" ) {
                addItemStatus = true;
            }
        }
        if ( $( '#filterStatus_Idle' ).is( ':checked' ) ) {
            if ( v.state === "idle" ) {
                addItemStatus = true;
            }
        }
        if ( $( '#filterStatus_Recording' ).is( ':checked' ) ) {
            if ( v.state === "recording" ) {
                //panel.html.agentsFiltered.push( v.name );
                addItemStatus = true;
            }
        }
    }
    


    /*
     * NEXT RECORDING - CALENDAR STATUS
     */
    
    if ( $( '#filterCalendar_Main' ).hasClass( 'pressed' ) ) {
        checkCalendar = true;
    }
    
    var nr;
    if ( checkCalendar ) {
        if ( v.nextRecording === undefined) {
            nr = undefined;
        } else {
            nr = v.nextRecording.temporal[0].value; // ex: "start=2013-04-30T06:00:00Z; end=2013-04-30T07:55:00Z; scheme=W3C-DTF;"
        }
            
        var arStatusNextRecording = getArrayStatusNextRecording( nr );
        
        if ( $( '#filterCalendar_NoRecordings' ).is( ':checked' ) ) {
            if ( $.inArray( "noRecordings", arStatusNextRecording ) > -1 ) {
                addItemCalendar = true;
            }
        }

        if ( $( '#filterCalendar_Recording' ).is( ':checked' ) ) {
            if ( $.inArray( "recording", arStatusNextRecording ) > -1 ) {
                addItemCalendar = true;
            }
        }
        if ( $( '#filterCalendar_Imminent' ).is( ':checked' ) ) {
            if ( $.inArray( "imminent", arStatusNextRecording ) > -1 ) {
                addItemCalendar = true;
            }
        }
        if ( $( '#filterCalendar_Today' ).is( ':checked' ) ) {
            if ( $.inArray( "today", arStatusNextRecording ) > -1 ) {
                addItemCalendar = true;
            }
        }
        if ( $( '#filterCalendar_Tomorrow' ).is( ':checked' ) ) {
            if ( $.inArray( "tomorrow", arStatusNextRecording ) > -1 ) {
                addItemCalendar = true;
            }
        }
        if ( $( '#filterCalendar_LaterTomorrow' ).is( ':checked' ) ) {
            if ( $.inArray( "laterTomorrow", arStatusNextRecording ) > -1 ) {
                addItemCalendar = true;
            }
        }        
    }
    
    if ( ( ( checkStatus && addItemStatus )     || !checkStatus ) &&
         ( ( checkCalendar && addItemCalendar ) || !checkCalendar ) ) {
        panel.html.agentsFiltered.push( v.name );
    }
};

panel.html.showAgent = function ( agentId, animate, showOpacity ) {
    var indexHiddenId = $.inArray( agentId, panel.html.agentsHide );
    if( indexHiddenId >-1 ) { // idAgent is in the list, remove it
        panel.html.agentsHide.splice( indexHiddenId, 1 );
    }
    
    var indexFilteredId  = $.inArray( agentId, panel.html.agentsFiltered );
    if( indexFilteredId >-1 ) { // idAgent is in the list, if 
        panel.html.agentsHide.splice( indexFilteredId, 1 );
    }
    
    panel.html.showHideAgentAction( agentId, true);
};

panel.html.hideAgent = function ( agentId ) {
    var indexId = $.inArray( agentId, panel.html.agentsHide );
    if( indexId === -1 ) { // idAgent is not in the list, add it
        panel.html.agentsHide.push( agentId );
    }
    var opacity;
    if($('#showHidden').is(':checked')) {
        opacity = panel.html.agentsOpacity;
    } else {
        opacity = 0;
    }
    panel.html.showHideAgentAction( agentId, true, opacity);
};

        
panel.html.showHideAgentAction = function ( idAgent, animate, showOpacity) {
    var agentElem = '#'+idAgent;
    if (showOpacity===undefined) showOpacity = 1;
    if (animate) {
        if (showOpacity === 0 ){ //hide
            $(agentElem).animate({opacity:0},{complete:function() {
                $(this).hide();
            }});
        } else {
            $(agentElem).show();
            $(agentElem).animate({opacity:showOpacity});
        }         
    } else { //no animate
        if (showOpacity===0) {
            $(agentElem).hide();
        } else {
            $(agentElem).show();
            $(agentElem).css({'opacity':showOpacity});
        }
    }
};

// controla si se muestran o no los agentes
panel.html.updateDrawAgents = function () {
    var hiddenCheckOn = false;
    if ( $( '#showHidden' ).is( ':checked' )) {
        hiddenCheckOn = true;
    }
    
    var filterCheckOn = false;
    if ( $( '#showFiltered' ).is( ':checked' )) {
        filterCheckOn = true;
    }
    panel.html.agentsFiltered.length=0; //empty list
    $.each(panel.agents, function( i, agent ) {
        panel.html.filteredAgentsUpdate( agent );
        agentId = agent.name;
        if ( hiddenCheckOn ) {  
            if ( filterCheckOn ){
                // no compruebo si están filtrados, si están ocultos se pone la 
                // opacidad a lo que marca la constante
                if ( $.inArray ( agentId, panel.html.agentsHide ) === -1 ) {
                    panel.html.showHideAgentAction( agentId, true );
                } else {
                    panel.html.showHideAgentAction( agentId, true, panel.html.agentsOpacity );
                }
            } else {
                // si están filtrados no se muestran, si están ocultos se pone
                // la opacidad a lo que marca la constante
                if ( $.inArray ( agentId, panel.html.agentsFiltered ) > -1 ) {
                    if ( $.inArray ( agentId, panel.html.agentsHide ) === -1 ) {
                        panel.html.showHideAgentAction( agentId, true );
                    } else {
                        panel.html.showHideAgentAction( agentId, true, panel.html.agentsOpacity );
                    } 
                } else {
                    panel.html.showHideAgentAction( agentId, true, 0 );
                }
            }
            
        } else {
            if ( filterCheckOn ){
                // no se comprueban los filtrados, se muestran si no están ocultos
                if ( $.inArray ( agentId, panel.html.agentsHide ) === -1 ) {
                    panel.html.showHideAgentAction( agentId, true );
                } else {
                    panel.html.showHideAgentAction( agentId, true, 0 );
                }
            } else {
                // no muestro los ocultos ni los filtrados
                if ( $.inArray ( agentId, panel.html.agentsHide ) === -1 && 
                     $.inArray ( agentId, panel.html.agentsFiltered ) > -1 ) {
                    panel.html.showHideAgentAction( agentId, true );
                } else {
                    panel.html.showHideAgentAction( agentId, true, 0 );
                }
            }
            
        }

        
    });
    
};

//SUBSCRIBE
$.subscribe( 'dashboard/reloadall', function( e ) {
    
    // refresh agents
    // panel.refreshAllAgents();
    var htmlAgents = panel.html.allagents();

    $( '.dashboardContainer' ).html( htmlAgents );
    
    // refresh agents properties (configuration)
    $.each( panel.agents, function ( i, agent ){
        panel.loadAgent( agent.name );
    });

});

$.subscribe( 'dashboard/reload', function( e, name ) {
    var htmlAgent = panel.html.agents ( name );
    
    $( '.dashboardContainer > #'+name ).replaceWith( htmlAgent );
    panel.html.prepareToScaleTexts( $('#'+name)[0] ); // prepare agent to scale texts
    
});

function getArrayStatusNextRecording( strdate ) {
    
    //example-datestr: "start=2013-04-30T06:00:00Z; end=2013-04-30T07:55:00Z; scheme=W3C-DTF;"
    var ar = new Array();
    
    if ( strdate === undefined) {
        ar.push( 'noRecordings' );
    } else {
        var myRegexp = /start=(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d\:\d+([+-][0-2]\d:[0-5]\d|Z{0,1}))/;
        var match = myRegexp.exec( strdate );
        if( !match || typeof match[1] === "undefined" ) {
            result = 0; 
        } else { 
            result = match[ 1 ];
        }

        var dateObj = fromUTCDateString( match[ 1 ] ) || 0;
        var dateObjTime = dateObj.getTime();
        var now = new Date();
        var dateObjStr = dateObj.toDateString();
        var nowStr = now.toDateString();


        // RECORDING & IMMINENT
        var diffTime = dateObjTime - now.getTime();
        if ( diffTime <= 0 ) {
            ar.push( 'recording' );
        }
        if ( diffTime > 0 && diffTime <= panel.html.imminentTimeMs ) {
            ar.push( 'imminent' );
        }

        // TODAY
        var isToday = ( dateObjStr == nowStr );
        if ( isToday ) {
            ar.push( 'today' );
        }

        // TOMORROW
        var tomorrow = new Date();
        tomorrow.setDate( tomorrow.getDate()+1 );  
        var isTomorrow = ( dateObjStr == tomorrow.toDateString() );
        if ( isTomorrow ) {
            ar.push( 'tomorrow' );
        }

        // LATER TOMORROW
        var laterTomorrow = new Date();
        laterTomorrow.setDate( laterTomorrow.getDate()+2 );
        laterTomorrow.setHours(00,00,00,000);

        var isLaterTomorrow = ( dateObjTime > laterTomorrow.getTime() );

        if ( isLaterTomorrow ) {
            ar.push( 'laterTomorrow' );
        }
    }
    
    return ar;
}

function init() {
    panel.html.loadStyle();
    panel.loadAgentsSync();

}





function precacheImages() {
    $.each(panel.agents, function(name,v){
        
        
        var stateAgent = '';
        if ( v.properties !== undefined ) {            
            // State (check if agent is offline) & time   
            var pollingObject = getObjects ( v.properties, "key", "capture.agent.state.remote.polling.interval" );
            if ( pollingObject.length > 0 ) {
                var timeSinceUpdate = parseInt( pollingObject[ 0 ].value );
                if ( v['time-since-last-update'] > ( timeSinceUpdate * 1000 )) {
                    stateAgent = "offline";
                } else {
                    stateAgent = v.state;
                }
            }
        } else {
            stateAgent = "idle";  // TODO 
        }
        
        if ( stateAgent === "offline" ) {
            panel.agents[ name ].preCacheImg = panel.preCacheImgOff;
        } else {
            var urlImg = '/dashboard/rest/agents/' + name  + '/snapshot.png';
            var img = new Image();


            img.onload = function () {

                var canvas = document.createElement("canvas");
                canvas.width =this.width;
                canvas.height =this.height;

                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0);

                var dataURL = canvas.toDataURL("image/png");

                panel.agents[ name ].preCacheImg = dataURL;

            };
            img.onerror = function() {
                panel.agents[ name ].preCacheImg = panel.preCacheImgOff;
            };
            img.src = urlImg;
        }
            
    });  
}

$( document ).ready( function(){ 
	init();
    
	setInterval(function() { 
		if($('#autoRefreshButton').is(':checked')) {
		    precacheImages();
		    $.publish( 'dashboard/reloadall' );
		}
	    }, 1000 * 10 * 1);

	//setTimeout(  setInterval(function() { if($('#autoRefreshButton').is(':checked')) { precacheImages(); }}, 1000 * 10 * 1), 1000 * 10 * 0.5 );


        // calendar icon
        $( ".goToCalendar a img").hover( function() {
            $(this).attr('src', 'img/calendar2.gif');
        }, function() {
            $(this).attr('src', 'img/calendar-grey.gif');
        });
        
        // show/hide sidebar panel
        $('.showUtilsButton').click(function(event) {
            var widthUtilityView = $('.utilityView').css('width');
            if ($(this).hasClass('collapsed')) {   // show panel
                $(this).removeClass('collapsed');
                $(this).addClass('expanded');
                $(this).html ('<');
                //$('.utilityView').show();
               $('.dashboardMainContainer').animate({'left':widthUtilityView},{duration:200});
               //$('.tabrow').animate({'left':widthUtilityView},{duration:200});
            } else {
                $(this).removeClass('expanded');
                $(this).addClass('collapsed');
                $(this).html ('>');
                $('.dashboardMainContainer').animate({'left': 0},{duration:200});
               // $('.tabrow').animate({'left': 0},{duration:200});
                //$('.utilityView').hide();
            }
        });
        
        // grid & table buttons
        $('.tableBtn').click(function() {
            
            if ( !$( this ).hasClass ( 'pressed' ) ){
                var newStyle = '';
                $( '.gridBtn' ).removeClass ( 'pressed' );
                $( this ).addClass( 'pressed' );
                newStyle = 'table';
                
                $(' .subBtn ').prop( 'disabled', true );
                $(' .addBtn ').prop( 'disabled', true );
            
                panel.html.panelStyle = newStyle;
                localStorage.setItem( 'stylePanel', newStyle );
                $.publish( 'dashboard/reloadall' );
            }
        });
        
        $('.gridBtn').click(function() {
            if ( !$( this ).hasClass ( 'pressed' ) ){
                var newStyle = '';
                $( '.tableBtn' ).removeClass ( 'pressed' );
                $( this ).addClass( 'pressed' );
                newStyle = 'grid';
                
               $(' .subBtn ').prop( 'disabled', false );
               $(' .addBtn ').prop( 'disabled', false );
            
                panel.html.panelStyle = newStyle;
                localStorage.setItem( 'stylePanel', newStyle );            
                $.publish( 'dashboard/reloadall' );
            }
        });



        
        // size buttons
        $('.addBtn').click(function() {
            var newSize = panel.html.incAgentsSize();
            panel.html.actualSize = newSize;
        });
        $('.subBtn').click(function() {
             var newSize = panel.html.decAgentsSize();
             panel.html.actualSize = newSize;
        });
        
        // click button + for more info
        $( ".dashboardContainer" ).on( "click", ".nextEventTd" ,function(){
            $( this ).children( '.tooltip').fadeIn();
        }).on( "mouseleave", ".nextEventTd", function(){
            $( this ).children( '.tooltip').fadeOut();
        });

  
        // hide/show agents
        $( '.dashboardContainer' ).on( "click", ".hideButton    ", function( event ) {   
            var idParent;
            if ( panel.html.panelStyle === "grid" ) {
                idParent = $(this).parent().attr('id');
            } else {
                idParent = $(this).parents('.agentTableRow').attr('id');
            }
            if($(this).hasClass('show')) {
                $(this).removeClass('show');
                $(this).addClass('hide');
                panel.html.hideAgent( idParent ); // add agent to the hide Agents list
                
            } else {
                $(this).removeClass('hide');
                $(this).addClass('show');
                panel.html.showAgent( idParent ); // add agent to the hide Agents list
            }
        });
        
        
        // vnc Screen
        $( '.dashboardContainer' ).on( "click", ".vncLink", function( e ) {     
            e.preventDefault();
            
            var url = $.trim( $( this ).attr( 'href' ) );
            var host = url.slice( url.indexOf( "host=" )+5 );
            
            if ( host === '' ) {
                alert ( 'Host URL: "' + host + '" is not valid' );
            } else {
                var agentName = $(this).parents('.dashboardItemContainer').attr('id');
                window.open( url, agentName, 'width=600, height=480' );
            }
            
            
        });
        
        // info Screen
        $( '.dashboardContainer' ).on( "click", ".infoButton", function( event ) {      
            var agentName;
            if ( panel.html.panelStyle === "grid" ) {
                agentName = $(this).parents('.dashboardItemContainer').attr('id');   
            } else {
                agentName = $(this).parents('.agentTableRow').attr('id');
            }
            
            window.open('info.html?agent=' + agentName, agentName, 'width=1280, height=1024');
        });
        
        
        // checks sidebar: filtered and hidden
       $( '#showHidden, #showFiltered, #filterStatus input[type=checkbox], #filterCalendar input[type=checkbox]' ).click(function(){
           panel.html.updateDrawAgents();
       });
       
       //filter show/hide
       
       $( '#filterStatus_Main, #filterCalendar_Main' ).click(function(){ 
           if ( $( this ).hasClass( 'pressed') ) {
               $( this ).removeClass( 'pressed' );
           } else {
               $( this ).addClass( 'pressed' );
           }
           
           $( this ).next( '.filterOptions' ).slideToggle();
           panel.html.updateDrawAgents();
       });
    
});