

EditEvent = function () {
    this._identifier;
    // EVENT INFO
    this._abstract = '';
    this._contributor = '';
    this._course = '';
    this._creator = '';
    this._description = '';
    this._isPartOf;
    this._language = '';
    this._license = '';
    this._spatial = '';
    this._subject = '';
    this._title = '';
    
    this._allAgents;
    this._allProcessing;
    // DATE
    this._duration;
    this._endDate;
    this._startDate;
    
    // RC
    this._belongsRC;
    this._createRC;
    this._ids = {};
    this._changeOnlyFollowing;
    this._rrule;
    this._startRC;
    
    // Agent Properties & wfproperties
    this._agentProperties;
    this._wfproperties;
    
    this.get = function ( arg ) {
        return function() {
          if ( arguments.length === 1 ) {
            var val = arguments[ 0 ];
            if ( typeof val !== "undefined" && val !== this[ arg ] ) {
                this[ arg ] = val;
            }
          } else {
            return this[ arg ];
          }
        };
    };
    //FUNCTIONS 
    // EVENT INFO
    this.identifier     = this.get( "_identifier" );
    this.abstract       = this.get( "_abstract" );
    this.contributor    = this.get( "_contributor" );
    this.course         = this.get( "_course" );
    this.creator        = this.get( "_creator" );
    this.description    = this.get( "_description" );
    this.language       = this.get( "_language" );
    this.license        = this.get( "_license" );
    this.spatial        = this.get( "_spatial" );
    this.subject        = this.get( "_subject" );
    this.title          = this.get( "_title" );
    this.allAgents      = this.get( "_allAgents" );
    this.allProcessing  = this.get( "_allProcessing" );
    
    // DATE
    this.duration       = this.get( "_duration" );
    this.startDate      = this.get( "_startDate" );
    this.endDate        = this.get( "_endDate" );
    
    // RC
    this.belongsRC      = this.get( "_belongsRC" );
    this.createRC       = this.get( "_createRC" );
    this.ids            = this.get( "_ids" );
    this.changeOnlyFollowing = this.get( "_changeOnlyFollowing" );
    this.rrule          = this.get( "_rrule" );
    this.startRC        = this.get( "_startRC" );
    
    
    // Agent Properties
    this.agentProperties = this.get( "_agentProperties" );
    this.wfproperties   = this.get( "_wfproperties" );
};

var edit = {
    html: {},
    old: new EditEvent(),
    new: new EditEvent()
};


edit.loadValues = function() {
    $.ajax({
        dataType: "jsonp",
        jsonp: 'jsonp',
        jsonpCallback: 'callback1',
        url: '/recordings/' + edit.old.identifier() + '.json'
    }).done(function (data) {
        if( typeof data === "undefined" || typeof data[ 'http://purl.org/dc/terms/' ] === "undefined" ) {
            console.log( "error" );
            return false;
        } else {
            //AGENT PROPERTIES
            $.ajax({
                dataType: "text",
                jsonpCallback: 'callback2',
                url: '/recordings/' + edit.old.identifier() + '/agent.properties'
            }).error(function(data){
                console.log("error calling", data);
            }).done(function (data) {
                edit.old.agentProperties( data.split( '\n' ) );
            });  
            
            
            
            
            
            var eventData = data[ 'http://purl.org/dc/terms/' ];
            edit.loadValuesObject( eventData );
            edit.html.loadValues();
            
            
            
            // ISPARTOF - SERIES
            var isPartOf;
            var isPartOfHash = '';
            
            if( typeof eventData[ 'isPartOf' ] !== "undefined" ) {
                
                isPartOfHash = eventData[ 'isPartOf' ][ 0 ][ 'value' ];
                $.ajax({
                    dataType: "jsonp",
                    jsonp: 'jsonp', 
                    jsonpCallback: 'callback10',
                    url: '/series/' + isPartOfHash + '.json'
                }).error(function(data2){
                    console.log("error calling", data2);
                }).done(function ( data2 ) {
                    var isPartOfTitle = data2[ 'http://purl.org/dc/terms/' ][ 'title' ][ 0 ][ 'value' ];
                    //$( '#isPartOf input[name="isPartOf"]' ).val( isPartOfTitle );
                    //$( '#isPartOf input[name="isPartOf"]' ).attr( 'id', 'seriesSelect' );
                    $( '#isPartOf' ).append( '<input type="text" value="' + isPartOfTitle + '" id="seriesSelect" class="value_tag" name="isPartOfTitle" />' );

                    var autoCompleteOptions = {
                        source: function(request, response) {
                            $.ajax({
                                url:  '/series/series.json',
                                data: {
                                  q: request.term,
                                  sort: 'TITLE'
                                },
                                dataType: 'json',
                                type: 'GET',
                                success: function(data3) {
                                  var series_list = [];
                                  data3 = data3.catalogs;
                                  $.each(data3, function(){
                                    series_list.push({
                                      value: this['http://purl.org/dc/terms/']['title'][0].value,
                                      id: this['http://purl.org/dc/terms/']['identifier'][0].value
                                    });
                                  });
                                  response(series_list);
                                }, 
                                error: function() {
                                  ocUtils.log('could not retrieve series_data');
                                }
                            });
                        },
                        select: function(event, ui){
                            $('#isPartOf input[name="isPartOf"]').val(ui.item.id);
                        },
                        search: function(){
                            //$('#isPartOf').val('');
                        }
                    };
                    $('#seriesSelect').autocomplete( autoCompleteOptions );
                });

            } else {
                $( '#isPartOf' ).append(  '<input type="text" value="" id="seriesSelect" class="value_tag" name="isPartOfTitle" />' );
                isPartOf = "";
                var autoCompleteOptions = {
                        source: function(request, response) {
                            $.ajax({
                                url:  '/series/series.json',
                                data: {
                                  q: request.term,
                                  sort: 'TITLE'
                                },
                                dataType: 'json',
                                type: 'GET',
                                success: function(data4) {
                                  var series_list = [];
                                  data4 = data4.catalogs;
                                  $.each(data4, function(){
                                    series_list.push({
                                      value: this['http://purl.org/dc/terms/']['title'][0].value,
                                      id: this['http://purl.org/dc/terms/']['identifier'][0].value
                                    });
                                  });
                                  response(series_list);
                                }, 
                                error: function() {
                                  ocUtils.log('could not retrieve series_data');
                                }
                            });
                        },
                        select: function(event, ui){
                            $('#isPartOf input[name="isPartOf"]').val(ui.item.id);
                        },
                        search: function(){
                            //$('#isPartOf').val('');
                        }
                    };
                    $('#seriesSelect').autocomplete( autoCompleteOptions );
            }
            
            
            // AGENTS
            $.ajax({
                dataType: "jsonp",
                jsonp: 'jsonp', 
                jsonpCallback: 'callback2',
                url: '/capture-admin/agents.json'
            }).error(function(data){
                console.log("error calling", data);
            }).done(function (data_agents) {
                // agents
                edit.old.allAgents( process_mh_array_response(data_agents.agents.agent) );

                var html_combo_agents = '<select id="comboAgents">';
                $.each(edit.old.allAgents(), function (i, v) {
                   var agentName = "";
                  if( typeof v.name !== "undefined") { agentName = v.name;  } else { agentName = "-"; }
                  var agentSelected = '';
                  if ( agentName === edit.old.spatial() ) { agentSelected = ' selected=selected '; }
                  html_combo_agents = html_combo_agents + '<option ' + agentSelected + ' value="' + agentName + '">' + agentName + '</option>';

                });

                html_combo_agents = html_combo_agents + '</select>';
                $.when( $('#agents').append(html_combo_agents) ).done(function() {

                    $('#comboAgents').change(); 
                } 
                );

            });
            
          
            
            // PROCESSING
            
            $.ajax({
                dataType: "jsonp",
                jsonp: 'jsonp', 
                jsonpCallback: 'callback3',
                url: '/workflow/definitions.json'
            }).done(function (data) {
                edit.old.allProcessing( data['workflow_definitions'] || data['definitions']['definition'] );
               
                var comboProcessingSelected = 'full'; // default
                $.each(edit.old.agentProperties(), function(i, v){
                    if( v.indexOf("org.opencastproject.workflow.definition") !== -1) {
                        comboProcessingSelected = v.split('org.opencastproject.workflow.definition=')[1];
                        return false; // found, break the loop
                    }
                });

		scheduleTags = ['schedule'];

                var htmlComboProcessing = '<select id="comboProcessing">';
                $.each( edit.old.allProcessing(), function (i, v) {

		    var wTags = process_mh_array_response(v.tags.tag);
		    var isSchedule = false;

		    for(i=0; i < wTags.length; i++) {
			if( $.inArray( wTags[i], scheduleTags ) !== -1 ) { isSchedule = true } 
		    }

		    if(!isSchedule) return;

                    var optionSelected = "";
                    if ( v.id === comboProcessingSelected ) { optionSelected = ' selected="selected" '; }
                    htmlComboProcessing = htmlComboProcessing + '<option '+ optionSelected + ' value="' + v.id + '">' + v.title + '</option>';
                });      
                htmlComboProcessing = htmlComboProcessing + '</select>';

                $( '#processing ul li' ).append( htmlComboProcessing );


                // 
                // PROCESSING PANEL
                //var id = $('#comboProcessing').val(); // TODO se elige el por defecto o el que esta seleccionado en la edicion
                edit.html.showProcessingPanelConfiguration( comboProcessingSelected );
            });
            
        }        
    });
};

edit.loadValuesObject = function( data ) {
    $.each( data, function( i, v ) {
        if ( i === "temporal" || i === "isPartOfTitle" || i === "isPartOf" ) {
                return true;
        }
        if ( data[ i ] !== undefined ){
            edit.old[ i ]( data[ i ][ 0 ][ 'value' ] );
        } else {
            edit.old[ i ]( '' );
        }
    });
    
    // TODO -> ISPARTOF
    
    /*
     *  TEMPORAL
     */
    // START_DATE
    var valueTemporal, eventStart, eventEnd, duration;
    if( data [ 'temporal' ] !== undefined ) {
        valueTemporal = data[ 'temporal' ][ 0 ][ 'value' ];
    } else {
        valueTemporal = 0;
    }
    
    eventStart = edit.getTimeRegexp( valueTemporal, "start" );
    edit.old.startDate( eventStart );


    // END & DURATION
    eventEnd = edit.getTimeRegexp( valueTemporal, "end" );
    edit.old.endDate( eventEnd );
    
    duration = eventEnd - eventStart;
    edit.old.duration( duration );
    

    /*
     * RC
     */
    if ( edit.old.abstract() !== '' ){
        edit.old.rrule( edit.getRRuleFromAbstract( edit.old.abstract() ));
        edit.old.startRC( edit.getStartDateRRuleFromAbstract( edit.old.abstract() ));
    }
};


edit.getRRuleFromAbstract = function( key ) {
    var myRegexp = /(.*)##(.*)##(.*)/;
    var match = myRegexp.exec( key );
    var result;
    
    if( !match || typeof match[ 2 ] === "undefined" ) {
        result = 0; 
    } else { 
        result = match[ 2 ];
    }
    return result;
};

edit.getStartDateRRuleFromAbstract = function( key ) {
    var myRegexp = /.*##START=([0-9]*)_.*/;
    var startRCms;
    var match = myRegexp.exec( key );
    
    if ( match !== null && match [ 1 ] !== undefined ) {
        startRCms = match [ 1 ];
    } else {
        startRCms = 0;
    }
    var startDateRC = parseInt( startRCms );
    var today = ( new Date() ).getTime();
    
    if ( today < startDateRC ) {
        startDateRC = today;
    }
    
    return startDateRC;
};


edit.getObjectFromRRule = function( key ) {
    var result = edit.getRRuleFromAbstract( key );
    var myRegexp2 = /(FREQ=\w*);(INTERVAL=[0-9]*);(UNTIL=[0-9]*|COUNT=[0-9]*);*(BYDAY=.*)*/;
    var match = myRegexp2.exec( result );
    var res = {};
    
    if ( match !== undefined && match !== null && match.length > 0 ) {
        for(i = 1; i < match.length; i++) { 
            if ( match[ i ] === undefined ) { continue; }
            x = match[ i ].split( '=' ); 
            res[ x[ 0 ] ] = x[ 1 ];
        }
    }
    return res;    
};


edit.getTimeRegexp = function( myString, str ) {
    var myRegexp;
    if (str === "start") {
       myRegexp = /start=(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d\:\d+([+-][0-2]\d:[0-5]\d|Z))/;
    } else if (str === "end") {
       myRegexp = /end=(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d\:\d+([+-][0-2]\d:[0-5]\d|Z))/;
    } else {
       return 0;
    }
    var match = myRegexp.exec( myString );
    var result = fromUTCDateString( match[ 1 ] ).getTime() || 0;

    return result;
};

edit.createDays = function( repeatObj ) {
    /*
   params = {
       type        :   'month',                 // day, month o week
       actualDate  :   new Date('2013-03-22'),
       endDate     :   new Date('2013-04-22'),  // endDate y repetitions son excluyentes
       repetitions :   5,                       // endDate y repetitions son excluyentes
       interval    :   2,        
       weekDays    :   [ 1, 3, 4 ]              // sólo para la opcion week
   };
   */
    
    
    // INICIALIZACION
    var actualDate      = repeatObj.actualDate;
    // actualDate.setHours(00,00,00,000);
    var interval        = repeatObj.interval;
    var type            = repeatObj.type;
    var isRepetition    = false;
    var repetitions;
    var endDate;
    var arWeekDays;
    var res             = new Array(); // resultado
    var newday;
    
    if ( typeof repeatObj.repetitions === 'number' || typeof repeatObj.repetitions ===  'string' ) {
        repetitions = repeatObj.repetitions;
        isRepetition = true;
    } else {
        endDate = repeatObj.endDate;
        endDate.setHours(23,59,59,999);
        isRepetition = false;
    }
      
    
    if (type === "DAILY") {
        //  DAY
        var day = new Date( actualDate );
        if ( isRepetition ) {
            
            // REPETITIONS
            for(var i=0; i < repetitions; i++ ) {
                newday = new Date ( day );
                res.push( newday );   
                day.setDate( day.getDate() + interval );
            }
        } else {
            // DATE LIMIT
            while ( day.getTime() <= endDate.getTime() ) {   
                newday = new Date ( day );
                res.push( newday );   
                day.setDate( day.getDate() + interval );
            }

        }
    } else if (type === "WEEKLY") {
        // WEEK
        if ($(repeatObj.weekDays).length === 0) {
            console.log("error: incorret number of arguments");
            return;
        }
        arWeekDays = repeatObj.weekDays;  // week days selected
        // firstDay of the week
        var firstWeekDay = new Date( actualDate );
        var numActualDate = actualDate.getDay()-1;
        firstWeekDay.setDate ( actualDate.getDate() - numActualDate );
        
        if ( isRepetition ) {
            // REPETITIONS
            var repActual= 0;
            for( var i=0; repActual < repetitions; i = i + interval ) {   
                var day = new Date( actualDate );
                for ( var j=0; j< arWeekDays.length && repActual < repetitions; j++ ){
                    day = new Date( firstWeekDay );
                    day.setDate( firstWeekDay.getDate() + i*7 + arWeekDays[ j ] );
                    if ( day < actualDate ) {
                        continue;
                    } else {
                        newday = new Date ( day );
                        res.push( newday );
                        repActual++;
                    }
                }
            }
        } else {
            // DATE LIMIT
            var day = new Date( firstWeekDay );
            for(var i=0; day <= endDate; i=i+interval ) {   
                for (var j=0; j< arWeekDays.length; j++ ){
                    day = new Date( firstWeekDay );
                    day.setDate( firstWeekDay.getDate() + i*7 + arWeekDays[ j ] );
                    if ( day < actualDate ) {
                        // before base Date
                        continue;
                    } else {
                        if ( day <= endDate ) {
                            newday = new Date ( day );
                            res.push ( newday );
                        }
                    }
                }
            }            

        }
    } else if (type === "MONTHLY") {
        // MONTH
        var day = new Date( actualDate );
        if ( isRepetition ) {
            for( var i=0; i < repetitions; i++ ) {   
                newday = new Date ( day );
                res.push( newday );   
                day.setMonth( day.getMonth() + interval );
            }
        } else {
            while (day <= endDate) {   
                newday = new Date ( day );
                res.push( newday );   
                day.setMonth( day.getMonth() + interval);
            }
        }
        
        
    } else {
        // ERROR
        console.log("error: type not supported");
    }
    
    return res;
};

edit.deleteEvent = function( id, action ) {
    $.ajax({
        type: 'DELETE',
        url: '/recordings/' + id,
        error:function (xhr, ajaxOptions, thrownError){
            console.log(xhr);
            console.log(thrownError);
        }  
    }).done(function (data) {
        if ( typeof action === 'function' ) {
            action();
        }
   });
};


edit.checkConflicts = function( actionOK, actionNOK, onStart ) {
    var onStartBool = true;
    
    if ( onStart === undefined ) {
        onStartBool = true;
    } else {
        onStartBool = onStart;
    }
    
   var isOK = false;
   var device = $('#comboAgents').val();
   var dateAsObject = $('#startDateInput').datepicker( 'getDate' ); // falta sumar la hora
   var hourMinutes = $('#startTimeInput').val();
   var myTime = hourMinutes.split(':');
   var myTimeMs = (myTime[0] * 60 * 60 * 1000) + (myTime[1] * 60 * 1000); // hora en ms
   dateAsObject.setTime( dateAsObject.getTime() + myTimeMs);
   var start = dateAsObject.getTime();
  
   var durationHourMinutes = $('#durationInput').val();
   var myDuration = durationHourMinutes.split(':');
   var duration = (myDuration[0] * 60 * 60 * 1000) + (myDuration[1] * 60 * 1000); // hour in ms
   
   var end = start + duration;
   
   var now = new Date();
   var nowTime = now.getTime();
   var editable   = (getUrlVars()["edit"] === "1")   ? true : false;
    if ( editable && ( nowTime > start ) ) { // past date
       var html_list = "<li><b>Date error: You can't book events in past dates </b></li>";
        $('#conflicts_list').html(html_list);
        $('#conflicts').fadeIn();
        
        if ( typeof actionNOK === 'function' ) { 
            actionNOK(); 
            return; 
        }
   } else {
        var isSerie = false;
   
        if ( $('#repeatCheckInput').is(':checked') ) {
            isSerie = true;
        }
       
        if ($('#conflicts').is(':visible')) {
            $('#conflicts_list').html(''); // vaciamos la lista
            $('#conflicts').fadeOut();
        }
        
        var dataConflicts = {};
        var abstract = edit.old.abstract();
        if ( isSerie )  {
            
            var daysSerie = edit.html.getRepeatInfo();
            var endSerie = 0;
            if ( daysSerie.length > 0 ) {
                endSerie = $( daysSerie ).last()[ 0 ].getTime() + duration;
            }

            dataConflicts = {
                'device'    : $('#comboAgents').val(),
                'start'     : start,
                'end'       : endSerie,
                'duration'  : duration,
                'rrule'     : edit.buildKeyRepeatOptions( false ),
                'timezone'  : 'Europe/Madrid'
            };
        } else {
            dataConflicts =  {
                'device'    : device,
                'start'     : start,
                'end'       : end,
                'duration'  : duration
            };            
        }
        
        $.ajax({
            type        : 'GET',
            dataType    : "jsonp",
            data        : dataConflicts,
            jsonp       : 'jsonp', 
            jsonpCallback : 'callback4',
            url         : '/recordings/conflicts.json'
        }).always(function (data) { 
            
          if(typeof data === "undefined" || typeof data['catalogs'] === "undefined") {
             isOK = true;
          } else {
             isOK = false;
          }
          
          if (!isOK) {
             var html_list = "";
             var existsConflicts = false;
             $.each(data['catalogs'], function(i, v){

                var myId = v['http://purl.org/dc/terms/']['identifier'][0]['value'];
                
                if ( myId === edit.old.identifier() ) {
                    return true; 
                } else { 
                    if ( onStartBool && abstract !== undefined && abstract !== "" ) { // the ids of the serie (abstract) will be deleted     
                        
                        var conflictingAbstract = v['http://purl.org/dc/terms/']['abstract'][0]['value'];  
                        if ( abstract === conflictingAbstract ) {
                            return true;
                        } else {
                            existsConflicts = true;
                        }
                        
                    } else {
                        existsConflicts = true; 
                    }  
                }    
                
                var title = v['http://purl.org/dc/terms/']['title'][0]['value'];
                var temporal = v['http://purl.org/dc/terms/']['temporal'][0]['value'];
                html_list = html_list + '<li><span class="conflict_title"><a href="scheduler.html?eventId=' + myId + '&edit=1">' + title + '</a></span><span class="conflict_info">' + parseMsToDate( edit.getTimeRegexp(temporal, 'start') ) + ' - ' + parseMsToDate( edit.getTimeRegexp(temporal, 'end') ) + '</span></li>';
             });
             if ( existsConflicts ) {
                $('#conflicts_list').html(html_list);
                $('#conflicts').fadeIn();
                if ( typeof actionNOK === 'function' ) { 
                    actionNOK(); 
                    return;
                }
            } else {
                if ($('#conflicts').is(':visible')) {
                    $('#conflicts_list').html(''); // vaciamos la lista
                    $('#conflicts').fadeOut();
                }
                if ( typeof actionOK === 'function' ) {
                    actionOK();
                    return;
                }
            }
          } else {

             if ($('#conflicts').is(':visible')) {
                   $('#conflicts_list').html(''); // vaciamos la lista
                   $('#conflicts').fadeOut();
             }
             if ( typeof actionOK === 'function' ) {
                 actionOK();
                 return;
             }
          }
        });
   }
};


edit.buildKeyRepeatOptions = function( onlyRrule, startDateRC ) {
   var fullKey;
   if ( onlyRrule === undefined ) {
       fullKey = true;
   } else{
       fullKey = onlyRrule;
   }
   var key = '';
    var type = $( '#repeatType' ).val();
    var freq = 'FREQ=';
    
    //agent
    if ( fullKey ) {
        key = key + $('#comboAgents').val() + '##';
    }
    
    // TYPE: DAY, WEEK, MONTH
    if ( type === "DAILY" ) {
        freq = freq + 'DAILY;';
    } else if ( type === "WEEKLY" ) {
        freq = freq + 'WEEKLY;';
    } else { // month
        freq = freq + 'MONTHLY;';
    }
    
    var repeatInterval = parseInt($( '#repeatInterval select' ).val());
    key = key + freq + 'INTERVAL=' + repeatInterval + ';';
    
    // ENDING
    var endingSelected = $("input[name='repeat_ending']:checked");
    var endingLetter = '';
    var endingValue = '';
    if ($(endingSelected).attr('id') === 'option_num_repetitions'){
        endingLetter = 'COUNT='; // After num repetitions
        endingValue = parseInt($(endingSelected).next('input[type=text]').val());
    } else {
        endingLetter = 'UNTIL='; // On date
        var endingDate = $('#enddate_repetitions').datepicker('getDate');
        endingDate.setDate( endingDate.getDate() + 1 ); // UNTIL + 1 day
        endingValue = endingDate.getFullYear() + ("0" + (endingDate.getMonth()+1)).slice(-2) + ( "0" + endingDate.getDate()).slice(-2);    

    }
    key = key + endingLetter + endingValue;

    // DAYS OF THE WEEK
    if ( type === "WEEKLY" ) {
        var inputDays = $('#repeatDays input[type=checkbox]');
        var strDays = "";
        var c=0;
        var separator = '';
        $.map( inputDays, function(i, v){ 
            if ( $( i ).is( ':checked' ) ) {
                if ( c > 0 ) { separator = ','; }
                strDays =  strDays + separator + $( i ).attr( 'name' ) ;
                c++;
            }
        });
        
        
        key = key + ';BYDAY=' + strDays;
    }
    
    if ( fullKey ) {
        var startRCms = 0;
        if ( startDateRC !== undefined ) {
            startRCms = startDateRC;
        } else {
            var fullRrule = edit.old.abstract();
            if( fullRrule === '' ) {
                var startDateRC = $('#startDateInput').datepicker( 'getDate' );
                startRCms = startDateRC.getTime();
            } else {
                var myRegexp = /.*##START=([0-9]*)_.*/;
                var match = myRegexp.exec( fullRrule );

                if ( match[ 1 ] !== undefined ) {
                    startRCms = match [ 1 ];   
                }
            }
        }
        
        key = key + '##START=' + startRCms + '_' + getRandomInt(1,9999); // final fake "hash" (actual time + random number)
    }
    return key;
};
edit.updateMediaPackageEvent = function( id, actionOK ) {
    
    var payload = {
        'agentparameters' :  edit.createAgentParametersScheduler(),
        'dublincore'      :  edit.createDublinCoreParametersScheduler(),
        'events'          :  edit.createEventParametersScheduler(),
        'wfproperties'   :  edit.createWfproperties()
    }; 

    $.ajax({
        type: 'PUT',
        data: payload,
        url: '/recordings/' + id,
        error:function ( xhr, ajaxOptions, thrownError ){
            console.log(xhr);
            console.log(thrownError);
        }  
    }).done(function ( data ) {
        if ( typeof actionOK === 'function' ) {
            actionOK();
            return;
        }
        
    });
};

edit.updateEventToRC = function() {
    var redirect = function () { window.location.href='calendar.html'; };
    var actionOK = function() {
        edit.deleteEvent( edit.old.identifier(), redirect ); 
    };
    edit.createMediaPackageRC( 1, actionOK );
};


edit.updateRCToRC = function( all ) {
    if ( all === undefined ) {
        console.log( "updateRCToRc: error" );
        return;
    }
    var agent;
    var deleteRCFromDate;
    var option = all ? 0 : 1;
    
    var redirect = function () { window.location.href='calendar.html'; };
    var actionOK = function() { 
        if ( all ) {
            deleteRCFromDate =  edit.getStartDateRRuleFromAbstract( edit.old.abstract() );
        } else {
            // delete from actual date event
            deleteRCFromDate = $('#startDateInput').datepicker( 'getDate' ).getTime();
        }
        edit.deleteRC( edit.old.abstract(), edit.old.spatial(), deleteRCFromDate, redirect ); 
    };
    
    edit.createMediaPackageRC( option, actionOK);
};


edit.createMediaPackageRC = function( option, actionOK ) { 
    //option can be:
    // 0 - all the events of the RC
    // 1 - the event is being edited and next events of the RC
    
    var startDateDC;    // startDate of the Dublin core
    var startDateRC;    // startDate of the RC (#abstract)
    if ( option === 0 ) {
        // the startDateDC is the first event date of the present (and future)
        startDateRC = edit.getStartDateRRuleFromAbstract( edit.old.abstract() );
    } else if ( option === 1 ) {
        // FOLLOWING
        // the startDateDC is the startDate of the edited event
        // the startDateRC (abstract) is the startDate of the edited event too
        startDateRC = ($( '#startDateInput' ).datepicker( 'getDate' )).getTime();
    } else {
        startDateRC = ($( '#startDateInput' ).datepicker( 'getDate' )).getTime();
    }
    
    startDateDC = startDateRC;
    // generate the id of the new serie
    //var idSerie = edit.buildKeyRepeatOptions( true, startDateDC ); //fake hash
    var payload = {
        'agentparameters' :  edit.createAgentParametersScheduler(),
        'dublincore'      :  edit.createDublinCoreParametersRC( startDateRC ), 
        'events'          :  edit.createEventParametersRC( startDateDC ),
        'wfpproperties'   :  edit.createWfproperties()
    };

    $.ajax({
        type: 'POST',
        data: payload,
        url: '/recordings/',
        error:function ( xhr, ajaxOptions, thrownError ){
            console.log(xhr);
            console.log(thrownError);
        }  
    }).done(function ( data ) {
        if ( typeof actionOK === 'function' ) {
            actionOK();
            return;
        }        
    });
};

edit.createWfproperties = function() {
    var htmlWfp = '';
    // select all inputs except "distribution" ones
    var group = $('#processingPanel input.configField:not("#dist input.configField")');
    $( group ).map(function (){
        
        var boolbtn;
        if ( $( this ).is( ':checked' ) ) { 
            boolbtn = 'true';
        } else { 
            boolbtn = 'false';
        } 
        
        htmlWfp = htmlWfp + this.id + '=' + boolbtn + '\n';
    });
    
    return htmlWfp;
};

edit.createDublinCoreParametersRC = function( startDateRC) {
    
    var queryDublinCoreParameters = '<dublincore xmlns="http://www.opencastproject.org/xsd/1.0/dublincore/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:oc="http://www.opencastproject.org/matterhorn/" >\n';


    queryDublinCoreParameters = queryDublinCoreParameters + '<dcterms:abstract>' + edit.buildKeyRepeatOptions( true, startDateRC ) + '</dcterms:abstract>\n';

    var infoInputs = $('.editInfo input.value_tag'); 
    $.each(infoInputs, function (i,v) {
       var dctermName    = $(v).attr('name');
       var dctermValue   = $(v).val();
       if ( dctermName !== 'identifier' ){
         queryDublinCoreParameters = queryDublinCoreParameters + '<dcterms:' + dctermName + '>' + dctermValue + '</dcterms:' + dctermName + '>\n';
       }
    });

    // anado la hora

       // STARTDATE
    //var dateAsObject = new Date($('#startDateInput').datepicker( 'getDate' )); // falta sumar la hora
    // la fecha de inicio es la de inicio de la serie, no de este evento

    var dateAsObject = new Date( startDateRC ); // falta sumar la hora
    var hourMinutes = $('#startTimeInput').val();
    var myTime = hourMinutes.split(':');
    var myTimeMs = ( myTime[ 0 ] * 60 * 60 * 1000 ) + ( myTime[ 1 ] * 60 * 1000 ); // hora en ms
    dateAsObject.setTime( dateAsObject.getTime() + myTimeMs);
    var startFormatted = toISODate(dateAsObject, true);

    // DURATION
    var durationHourMinutes = $('#durationInput').val();
    var myDuration = durationHourMinutes.split(':');
    var duration = (myDuration[0] * 60 * 60 * 1000) + (myDuration[1] * 60 * 1000); // hora en ms


     var daysSerie = edit.html.getRepeatInfo();
     
     var endSerie = 0;
     if ( daysSerie.length > 0 ) {
         endSerie = $( daysSerie ).last()[ 0 ];
         endSerie.setTime( endSerie.getTime() + duration );
     } 
     

    var endFormatted = toISODate(endSerie, true);
    console.log("%c endFormatted: %O", "color:red;font-weight:bold", endFormatted);

    queryDublinCoreParameters = queryDublinCoreParameters + '<dcterms:temporal>start=' + startFormatted + '; end=' + endFormatted + '; scheme=W3C-DTF;</dcterms:temporal>\n';

    // add spatial
    var spatial  = $('#comboAgents').val();
    queryDublinCoreParameters = queryDublinCoreParameters + '<dcterms:spatial>' + spatial + '</dcterms:spatial>\n';

    // recurrence rule
     var  rrule = edit.buildKeyRepeatOptions( false );
     
     queryDublinCoreParameters = queryDublinCoreParameters + '<oc:recurrence>' + rrule + '</oc:recurrence>\n';
    // cierro el xml

    queryDublinCoreParameters = queryDublinCoreParameters + '</dublincore>';   
    //queryDublinCoreParameters = queryDublinCoreParameters + '<dcterms:abstract>GC-K2##FREQ=WEEKLY;INTERVAL=2;UNTIL=20130522;BYDAY=TU,FR,SA##1368000307731_4061</dcterms:abstract></dublincore>';   
    console.log("%c queryDublinCoreParameters : %O", "color:red;font-weight:bold", queryDublinCoreParameters);

    return queryDublinCoreParameters;
};

edit.createEventParametersRC = function() {
    var queryEventParameters = '';

    // STARTDATE
    var dateAsObject = $('#startDateInput').datepicker( 'getDate' ); // falta sumar la hora
    var hourMinutes = $('#startTimeInput').val();
    var myTime = hourMinutes.split(':');
    var myTimeMs = (myTime[0] * 60 * 60 * 1000) + (myTime[1] * 60 * 1000); // hora en ms
    dateAsObject.setTime( dateAsObject.getTime() + myTimeMs);
    var startDate = dateAsObject.getTime();

    queryEventParameters = queryEventParameters + 'startDate=' + startDate + '\n';

    // DURATION
    var durationHourMinutes = $('#durationInput').val();
    var myDuration = durationHourMinutes.split(':');
    var duration = (myDuration[0] * 60 * 60 * 1000) + (myDuration[1] * 60 * 1000); // hora en ms

    console.log("%c duration1: %O", "color:red;font-weight:bold", duration );


// DURATION2
     var daysSerie = edit.html.getRepeatInfo();

     var endSerie = 0;
     if ( daysSerie.length > 0 ) {
         endSerie = $( daysSerie ).last()[ 0 ];
         endSerie.setTime( endSerie.getTime() + duration );
     } 

     duration = endSerie.getTime() - startDate + 60000;




    queryEventParameters = queryEventParameters + 'duration=' + duration + '\n';
    queryEventParameters = queryEventParameters + 'agentTimeZone=Europe/Madrid\n'; // TODO agentTimeZone
    

    return queryEventParameters;    
};

edit.deleteRC = function ( key, agent, from, action ) {

    // get ids of the serie    
    var fromFormatted = toISODate( new Date( from ), 'utc' );
    var dataIds = {
        'abstract'  : key,
        'startsfrom': fromFormatted, //now
        'spatial'   : agent
    };

    var idsAjax = new Array();
    $.ajax({
        data: dataIds,
        dataType: "jsonp",
        jsonp: 'jsonp', 
        jsonpCallback: 'callback1',
        url: '/recordings/recordings.json'
    }).done(function (data) {
        $.each( data.catalogs, function( i, v) {
            var newId = v['http://purl.org/dc/terms/'].identifier[0].value;
            var f = $.ajax({
                        type: 'DELETE',
                        url: '/recordings/' + newId,
                        error:function (xhr, ajaxOptions, thrownError){
                            console.log(xhr);
                            console.log(thrownError);
                        }
            });
            idsAjax.push( f );
        });
        

        $.when( idsAjax ).then( function( data ) {
           if ( typeof action === 'function' ) {
               action();
            }
        });  
        
    });
};

edit.updateEventToEvent = function() {
    var actionOK = function() { 
        window.location.href='calendar.html'; 
    };
    edit.updateMediaPackageEvent( edit.old.identifier(), actionOK );
};

edit.createAgentParametersScheduler = function() {
   /*    EXAMPLE
   agentparameters
   "capture.device.names=MOCK_SCREEN,MOCK_PRESENTER,MOCK_MICROPHONE
   org.opencastproject.workflow.definition=full
   org.opencastproject.workflow.config.trimHold=false
   org.opencastproject.workflow.config.captionHold=false
   "
   */

   var queryAgentParameters = 'capture.device.names=';
   var captureDeviceNames='';
   var first = true;
   var captureDeviceNamesInputs = $('#listDevices ul li input:checked'); 
   $.each(captureDeviceNamesInputs, function(i,v){

      if(!first) { captureDeviceNames = captureDeviceNames + ",";} else { first = false; }
      captureDeviceNames = captureDeviceNames + $(v).val();

   });
   queryAgentParameters = queryAgentParameters + captureDeviceNames + '\n';
   
   var valueComboProcessing = $('#comboProcessing').val();
   queryAgentParameters = queryAgentParameters + 'org.opencastproject.workflow.definition=' + valueComboProcessing + '\n';
   
   var configProcessing = $('#processingPanel input.configField, #processingPanel select.configField');
   configProcessingText = '';
   $.each(configProcessing, function (i, v) {
       var myBool;
       if ( $(v).is(':checked') ) {
           myBool = 'true';
       } else {
           myBool = 'false';
       }
      configProcessingText = configProcessingText + 'org.opencastproject.workflow.config.' + $(v).attr('name') + '=' + myBool + '\n';
   });
   queryAgentParameters = queryAgentParameters + configProcessingText;
   
   return queryAgentParameters;
};

edit.createDublinCoreParametersScheduler = function() {
   var queryDublinCoreParameters = '<dublincore xmlns="http://www.opencastproject.org/xsd/1.0/dublincore/" xmlns:dcterms="http://purl.org/dc/terms/">\n';
   
   infoInputs = $('.editInfo input.value_tag'); 
   $.each(infoInputs, function (i,v) {
      var dctermName    = $(v).attr('name');
      var dctermValue   = $(v).val();
      
      queryDublinCoreParameters = queryDublinCoreParameters + '<dcterms:' + dctermName + '>' + dctermValue + '</dcterms:' + dctermName + '>\n';
   });
   
   // anado la hora
   
      // STARTDATE
   var dateAsObject = $('#startDateInput').datepicker( 'getDate' ); // falta sumar la hora
   var hourMinutes = $('#startTimeInput').val();
   var myTime = hourMinutes.split(':');
   var myTimeMs = (myTime[0] * 60 * 60 * 1000) + (myTime[1] * 60 * 1000); // hora en ms
   dateAsObject.setTime( dateAsObject.getTime() + myTimeMs);
   var startFormatted = toISODate(dateAsObject, true);
   
   // DURATION
   var durationHourMinutes = $('#durationInput').val();
   var myDuration = durationHourMinutes.split(':');
   var duration = (myDuration[0] * 60 * 60 * 1000) + (myDuration[1] * 60 * 1000); // hora en ms
   dateAsObject.setTime( dateAsObject.getTime() + duration);
   var endFormatted = toISODate(dateAsObject, true);
   
   queryDublinCoreParameters = queryDublinCoreParameters + '<dcterms:temporal>start=' + startFormatted + '; end=' + endFormatted + '; scheme=W3C-DTF;</dcterms:temporal>\n';
   
   // add spatial
   var spatial  = $('#comboAgents').val();
   queryDublinCoreParameters = queryDublinCoreParameters + '<dcterms:spatial>' + spatial + '</dcterms:spatial>\n';
   
   // cierro el xml
   
   queryDublinCoreParameters = queryDublinCoreParameters + '</dublincore>';   
   //queryDublinCoreParameters = queryDublinCoreParameters + '<dcterms:abstract>GC-K2##FREQ=WEEKLY;INTERVAL=2;UNTIL=20130522;BYDAY=TU,FR,SA##1368000307731_4061</dcterms:abstract></dublincore>';   
   return queryDublinCoreParameters;
};


edit.createEventParametersScheduler = function() {
   /*
    * event
      "startDate=1364378400000
      duration=3600000
      null=151
      agentTimeZone=60
      "
    
    
    FREQ=WEEKLY;BYDAY=TU,FR,SA;BYHOUR=2;BYMINUTE=0
    */
   
   var queryEventParameters = '';
   
   // STARTDATE
   var dateAsObject = new Date($('#startDateInput').datepicker( 'getDate' )); // falta sumar la hora
   var hourMinutes = $('#startTimeInput').val();
   var myTime = hourMinutes.split(':');
   var myTimeMs = (myTime[0] * 60 * 60 * 1000) + (myTime[1] * 60 * 1000); // hora en ms
   dateAsObject.setTime( dateAsObject.getTime() + myTimeMs);
   var startDate = dateAsObject.getTime();
   
   queryEventParameters = queryEventParameters + 'startDate=' + startDate + '\n';
   
   // DURATION
   var durationHourMinutes = $('#durationInput').val();
   var myDuration = durationHourMinutes.split(':');
   var duration = (myDuration[0] * 60 * 60 * 1000) + (myDuration[1] * 60 * 1000); // hora en ms
   
   queryEventParameters = queryEventParameters + 'duration=' + duration + '\n';
   
   queryEventParameters = queryEventParameters + 'agentTimeZone=Europe/Madrid\n'; // TODO agentTimeZone
   
   return queryEventParameters;
     
     
};


edit.updateRCToEvent = function( option ) {    
    /*
     * option = 0 <- delete all events in the RC
     * option = 1 <- delete all following events
     * option = 2 <- delete none
     */
    var actionOK;
    
    if ( option === 0 ) {
        var fullKey = edit.old.abstract();
        
        actionOK = function() {
            var redirect = function () { window.location.href='calendar.html'; };
            var agent = $( '#comboAgents' ).val();
            
            var deleteRCFromDate = edit.getStartDateRRuleFromAbstract( fullKey );
            edit.deleteRC( fullKey, agent, deleteRCFromDate, redirect ); 

        };
    } else if ( option === 1 ) {
        var fullKey = edit.old.abstract();
        
        actionOK = function() {
            var redirect = function () { window.location.href='calendar.html'; };
            var agent = $( '#comboAgents' ).val();
            
            var deleteRCFromDate = edit.getStartDateRRuleFromAbstract( fullKey );
            edit.deleteRC( fullKey, agent, deleteRCFromDate, redirect ); 

        };
    } else {
        actionOK = function() { window.location.href='calendar.html'; };
    }
    $( '#abstract' ).val('');
    edit.updateMediaPackageEvent( edit.old.identifier(), actionOK );  
};


/*
 * HTML
 * 
 */
edit.html.loadValues = function () {
    var html_ini = '<input type="text" class="value_tag" ';
    var html_fin = ' />';
    var html_ini_hidden = '<input type="hidden" class="value_tag" ';
    
    $( '#identifier' )  .append( html_ini_hidden + 'value="' + edit.old.identifier()   + '" name="identifier" ' + html_fin );
    $( '#abstract' )    .append( html_ini_hidden + 'value="' + edit.old.abstract()     + '" name="abstract" ' + html_fin );
    $( '#contributor' ) .append( html_ini + 'value="' + edit.old.contributor()  + '" name="contributor" ' + html_fin );
    $( '#course' )      .append( html_ini + 'value="' + edit.old.course()       + '" name="course" ' + html_fin );
    $( '#creator' )     .append( html_ini + 'value="' + edit.old.creator()      + '" name="creator" ' + html_fin );
    $( '#description')  .append( html_ini + 'value="' + edit.old.description()  + '" name="description" ' + html_fin );
    //$( '#isPartOf' )    .append( html_ini + 'value="--" name="isPartOf" ' + html_fin );
    $( '#language' )    .append( html_ini + 'value="' + edit.old.language()     + '" name="language" ' + html_fin );
    $( '#license' )     .append( html_ini + 'value="' + edit.old.license()      + '" name="license" ' + html_fin );
    $( '#spatial' )     .append( html_ini + 'value="' + edit.old.spatial()      + '" name="spatial" ' + html_fin );
    $( '#subject' )     .append( html_ini + 'value="' + edit.old.subject()      + '" name="subject" ' + html_fin );
    $( '#title' )       .append( html_ini + 'value="' + edit.old.title()        + '" name="title" ' + html_fin );
    
    //date
    var temporal_hours = Math.floor(edit.old.duration() / 3600000);
    var temporal_minutes = Math.round((edit.old.duration() % 3600) / 60);
    var temporal_hours_formatted    = ("0" + temporal_hours).slice(-2);
    var temporal_minutes_formatted  = ("0" + temporal_minutes).slice(-2);
    $( '#duration input[type=text]' ).val( temporal_hours_formatted +":"+temporal_minutes_formatted );
    
    var temporalStart = new Date( edit.old.startDate() );
    var temporalStartFormatted = ("0" + temporalStart.getDate()).slice(-2) + "/" + ("0" + (temporalStart.getMonth()+1)).slice(-2) + "/" + temporalStart.getFullYear();
    $( '#startDateInput' ).val( temporalStartFormatted );
    
    var timeFormatted = ("0" + temporalStart.getHours()).slice(-2) + ":" + ("0" + temporalStart.getMinutes()).slice(-2);
    
    $( '#startTimeInput' ).val( timeFormatted );
    
    // ABSTRACT 
    var abstract;
    if( edit.old.abstract() !== undefined && edit.old.abstract() !== '' ) {
        abstract = edit.old.abstract();
        $('#repeatCheckInput').prop('checked', 'checked');
        $('#repeatPanel').css( 'display', 'block' );

        $( '#startDateInput' ).val(temporalStartFormatted);
edit.html.setRepeatOptions( edit.old.abstract() );

    } else {
        abstract = "";
        var tomorrow = $('#startDateInput').datepicker( 'getDate' );
        
        tomorrow.setDate( tomorrow.getDate()+1 );
        var d = ( "0" + tomorrow.getDate()).slice(-2) + '/' + ("0" + (tomorrow.getMonth()+1)).slice(-2) + '/' +  tomorrow.getFullYear();
 
        $( '#enddate_repetitions').val( d );
        $( '#num_repetitions').val( 2 );
    }

    // set RC options
    edit.html.createCancelUpdateButtons();
};


edit.html.setRepeatOptions = function( key ) {
    var opt = edit.getObjectFromRRule( key );

    $('#repeatType').val( opt.FREQ );
    if ( opt.FREQ === "WEEKLY" ) {
        $('#repeatDays').slideDown();
        var weekDaysAr = opt.BYDAY.split(',');
        $.each ( weekDaysAr, function( i, v ) {
            $( '#repeatDays input[name=' + v + ']' ).prop( 'checked', true );
            $( '#repeatDays input[name=' + v + ']' ).parents('.weekDays').addClass( 'active' );
        });   
    }
    $('#repeatInterval select').val( opt.INTERVAL );
    if ( opt.COUNT !== undefined ){
        $( '#option_num_repetitions' ).prop( 'checked', true);
        $( '#option_enddate_repetitions' ).prop( 'checked', false);
        $( '#num_repetitions' ).val( opt.COUNT );
        $( '#num_repetitions').prop( 'disabled', false );
        $( '#enddate_repetitions').prop( 'disabled', true );
        
        // the enddate(not used at first) is set to tomorrow
         var tomorrow = $('#startDateInput').datepicker( 'getDate' );
        tomorrow.setDate( tomorrow.getDate()+1 );
        var d = ( "0" + tomorrow.getDate()).slice(-2) + '/' + ("0" + (tomorrow.getMonth()+1)).slice(-2) + '/' +  tomorrow.getFullYear();
        $( '#enddate_repetitions').val( d );
        
    } else {
        $( '#option_num_repetitions' ).prop( 'checked', false);
        $( '#option_enddate_repetitions' ).prop( 'checked', true);
        $( '#enddate_repetitions').prop( 'disabled', false );
        $( '#num_repetitions').prop( 'disabled', true );
        //set date
        if ( opt.UNTIL !== undefined && opt.UNTIL.length > 0 ) {
            var d = opt.UNTIL.substr(6,2) + '/' + opt.UNTIL.substr(4,2) + '/' + opt.UNTIL.substr(0,4);
        } else {
            d = "Error. Pick a new date.";
        }
        $( '#enddate_repetitions' ).val( d );
    }
};

edit.html.showDevicesAgent = function( agentName ){
   var agentTemp = getObjects(edit.old.allAgents(), 'name', agentName);
   var htmlComboDevices;

   var myDevice = getObjects(agentTemp[ 0 ][ 'capabilities' ][ 'item' ], 'key', 'capture.device.names');

   if (agentTemp[0]['capabilities'] === undefined || agentTemp[0]['capabilities'] === "") {
     htmlComboDevices = '<ul value="">Agent defaults will be used</ul>';
   } else {
    var arDevices = myDevice[ 0 ].value.split(',');

     // create array with active channels
    var activeChannels;
    $.each(edit.old.agentProperties(), function(i, v){
        if( v.indexOf("capture.device.names") !== -1) { 
            activeChannels = v.split('capture.device.names=')[1].split(',');
            return false; // found, break the loop
        }
    });
    
     
     // html
     htmlComboDevices = '<ul>';
     var activeStr;
     for(var i=0; i<arDevices.length; i++) {
        if( $.inArray( arDevices[i], activeChannels) > -1 ) {
            activeStr = ' checked=checked ';
        } else {
            activeStr = '';
        }
        htmlComboDevices = htmlComboDevices + '<li><input type=checkbox value="' + arDevices[i] + '" ' + activeStr + ' />' + arDevices[i] + '</li>';
     }
     htmlComboDevices = htmlComboDevices + '</ul>';
   }
   $('#listDevices').html(htmlComboDevices);
};

edit.html.showProcessingDescription = function( processingId ){
   var objectProc = getObjects(edit.old.allProcessing(), 'id', processingId);
   $('#processingDescription').html( objectProc[ 0 ][ 'description' ] ); 
};


edit.html.showProcessingPanelConfiguration = function( id ) {
   var url_agent_properties = '/workflow/configurationPanel?definitionId=' + id;
   $.ajax({
         dataType: 'html',
           url: url_agent_properties
       }).done(function(data){
        $('#processingPanel').html(data);

        // SELECT THE CHECKBOXES ACORDING TO AGENT.PROPERTIES
        var myRegexp = /org.opencastproject.workflow.config.(\w+)=(\w+)/g;
        $.each( edit.old.agentProperties(), function( i, v ) {
            var match = myRegexp.exec( v );
            if ( match !== null) {               
                if ( match[ 2 ] === "true" ){
                    $( '#' + match[ 1 ]).prop( 'checked', 'checked');
                }
            }

        });
       });
};

edit.html.getRepeatInfo = function() {

    // type of date
    var type = $( '#repeatType' ).val();
    
    // get actual date
    var actualDate = $( '#startDateInput' ).datepicker( 'getDate' );
    var hourMinutes = $('#startTimeInput').val();
    var myTime = hourMinutes.split(':');
    var myTimeMs = ( myTime[0] * 60 * 60 * 1000 ) + ( myTime[1] * 60 * 1000 ); // hora en ms
    actualDate.setTime( actualDate.getTime() + myTimeMs );
    
    
    var arDays;
    if ( $('#repeatCheckInput').is(':checked') ) {
        var interval = parseInt($( '#repeatInterval select' ).val());
    
        // get ending
        var isRepetition = false;
        var repetitions;
        var endDate;
        var endingSelected = $("input[name='repeat_ending']:checked");
        if ($(endingSelected).attr('id') === 'option_num_repetitions'){
            isRepetition = true;
            repetitions = parseInt($(endingSelected).next('input[type=text]').val());
        } else {
            isRepetition = false;
            endDate = $(endingSelected).next('input[type=text]').datepicker('getDate');
        }

        var params = {
            'type'          :   type,
            'actualDate'    :   actualDate,
            'interval'      :   interval
        };
        if( type === 'WEEKLY' ) {
            params.weekDays     =   edit.html.getWeekDays();
        }
        if( isRepetition ) {
            params.repetitions  = repetitions;
        } else {
            params.endDate      = endDate;
        }

        arDays = edit.createDays( params );  // generate list of dates
    } else {
        arDays = new Array ( actualDate );
    
    }
    
    return arDays;
    
};

edit.html.getWeekDays = function() {
    var daysSelected = $( '#repeatDays input[type=checkbox]:checked' );
    var arWeekDays = new Array();
    $.each(daysSelected, function (i,v){
        var nombre = $(this).attr('name');
        var numDay = 0;
        switch(nombre){
            case 'MO':
                numDay = 0;
                break;
            case 'TU':
                numDay = 1;
                break;
            case 'WE':
                numDay = 2;
                break;
            case 'TH':
                numDay = 3;
                break;
            case 'FR':
                numDay = 4;
                break;
            case 'SA':
                numDay = 5;
                break;
            case 'SU':
                numDay = 6;
                break;
            default:
                console.log('error: weekday option unknown');
                return 0;
                break;
        }
        arWeekDays.push(numDay);

    });
    
    return arWeekDays;
    
};    
    
edit.html.createCancelUpdateButtons = function() {
    var editable   = (getUrlVars()["edit"] === "1")   ? true : false;
    var cancelBtn = '<input id="btn_cancel" type="button" class="rounded" value="cancel" name="cancel" />';
    var updateBtn = '<input id="btn_update" type="button" class="rounded" value="Update" name="update"/>';
    var returnBtn = '<input id="btn_cancel" type="button" class="rounded" value="Return" name="cancel" />';
    var deleteBtn = '<input id="btn_delete" type="button" class="rounded" value="Delete" name="delete" />';
    
    if ( editable ) {
        $('#menu_buttons').append( deleteBtn );
        $('#menu_buttons').append( cancelBtn );
        $('#menu_buttons').append( updateBtn );
    } else {
        // warning box
        var fieldsNotEditableHtml = '<div class="rounded" id="readOnly">Read-only mode. This event is over so it is not editable.</div>';
        $('#wrapper').prepend( fieldsNotEditableHtml );
        $('#menu_buttons').append( returnBtn );
    }      
};



edit.html.launchMessagePastDates = function() { //message box error: past date
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
};
     

/*
 * DOCUMENT READY
 */


eventId = getUrlVars()[ "eventId" ] || 0;
edit.old.identifier( eventId );
edit.loadValues();
    
    
$( document ).ready( function () {

    
    
   $( '#agents' ).on( "change", "#comboAgents", function( event ){
      var agentNameSelected = $( this ).val();
      edit.html.showDevicesAgent( agentNameSelected );
      edit.checkConflicts();
   });
   
   $( '#processing' ).on( "change", "#comboProcessing", function( event ){
      var processingSelected = $( this ).val();
      edit.html.showProcessingDescription( processingSelected );
      edit.html.showProcessingPanelConfiguration( processingSelected );
   });
   
   $( '#repeatCheckInput, #repeatInterval select, ' +
      '#option_num_repetitions, #option_enddate_repetitions, ' + 
      '#enddate_repetitions' ).click( function(){
       edit.checkConflicts();
   });
   
   $( ' #num_repetitions' ).change( function(){
      edit.checkConflicts(); 
   });
   
   $( '#repeatDays input[type=checkbox]' ).click( function() {
       if ( $( this ).is( ':checked' ) ) {
           $( this ).parents( '.weekDays' ).addClass( 'active' );
       } else {
           $( this ).parents( '.weekDays' ).removeClass( 'active' );
       }
       edit.checkConflicts();
   });
 
      $(' #startDateInput').datepicker({
         dateFormat: 'dd/mm/yy',
         controlType: 'select',
         minDate: new Date(),
         onClose:   edit.checkConflicts
         
      });
      $(' #enddate_repetitions').datepicker({
         dateFormat: 'dd/mm/yy',
         controlType: 'select',
         minDate: new Date(),
         onClose: edit.checkConflicts
         
      });
      $(' #startTimeInput').timepicker({
         controlType: 'select',
         stepMinute: 5,
         timeFormat: 'HH:mm',
         onClose:   edit.checkConflicts
         
      });

    
    $(' #durationInput').timepicker({
         controlType: 'select',
         stepMinute: 5,
         timeFormat: 'HH:mm',
         onClose:   edit.checkConflicts
    });
    
    $('#showAdditionalInfo').click(function() {
       
      $('#additionalInfo').slideToggle( function (){
         $('#showAdditionalInfo').toggleClass('additionalInfoOpened');

      });
    });
    
    $('#titleInfo').click(function(){
       $('#divInfo').slideToggle( function (){
         $('#titleInfo').toggleClass('sectionClose');
       });
    });
    
    $('#titleCaptura').click(function(){
       $('#divCaptura').slideToggle( function (){
         $('#titleCaptura').toggleClass('sectionClose');
       });
    });
    
    $('#titleProcessing').click(function(){
       $('#divProcessing').slideToggle( function (){
         $('#titleProcessing').toggleClass('sectionClose');
       });
    });
    
    
    
    
    
    $("#menu_buttons").on("click", "#btn_update", function(e){
        e.preventDefault();  

        var belongsRC;
        if ( edit.old.abstract() !== undefined && edit.old.abstract() !== "" ){
            belongsRC = true;
        } else {
            belongsRC = false;
        }
       
        var createRC;
        if ( $('#repeatCheckInput').is(':checked') ) {
            createRC = true;
            var endingSelected = $("input[name='repeat_ending']:checked");
            if ($(endingSelected).attr('id') === 'option_num_repetitions'){
                var endingValue = parseInt($(endingSelected).next('input[type=text]').val());
                if ( endingValue <= 0 ) {
                    // error 
                    var html_list = "<li><b>The number of occurrences must be greather than 0</b></li>";
                    $('#conflicts_list').html(html_list);
                    $('#conflicts').fadeIn();
                    return;
                }
            }
            // 
        } else {
            createRC = false;
        }
       
       var checkConflictsDeleteAll;
       var deleteAllRC = false;

        var ok;
        if ( !belongsRC && !createRC ){
            ok = function() { edit.updateEventToEvent(); };
            edit.checkConflicts( ok, null, checkConflictsDeleteAll );
        } else if ( belongsRC && !createRC ) {
            $( "#messageUpdateRCToEvent" ).dialog({
                resizable: true,
                modal: true,
                width: 500,
                buttons: {
                    "All events in the series": function() {
                        var option = 0;
                        checkConflictsDeleteAll = true;
                        ok = function() { edit.updateRCToEvent( option ); };
                        edit.checkConflicts( ok, null, checkConflictsDeleteAll );
                        $(this).dialog("close");
                    },
                    "All the following": function() {
                        var option = 1;
                        checkConflictsDeleteAll = false;
                        ok = function() { edit.updateRCToEvent( option ); };
                        edit.checkConflicts( ok, null, checkConflictsDeleteAll );
                        $(this).dialog("close");
                    },
                    "None": function() {
                        var option = 2;
                        checkConflictsDeleteAll = false;
                        ok = function() { edit.updateRCToEvent( option ); };
                        edit.checkConflicts( ok, null, checkConflictsDeleteAll );
                        $(this).dialog("close");
                    }
                }
            });
            
        } else if ( !belongsRC && createRC ) {
            ok = function() { edit.updateEventToRC(); };
            edit.checkConflicts( ok, null, checkConflictsDeleteAll );
        } else if ( belongsRC && createRC ) {
            $( "#messageUpdateRCToRC" ).dialog({
                resizable: true,
                modal: true,
                width: 500,
                buttons: {
                  "All events in the series": function() {
                    deleteAllRC2 = true;
                    ok = function() { edit.updateRCToRC( deleteAllRC2 ); };
                    edit.checkConflicts( ok, null, checkConflictsDeleteAll );
                    $(this).dialog("close");
                  },
                  "All the following": function() {
                    deleteAllRC2 = false;
                    ok = function() { edit.updateRCToRC( deleteAllRC2 ); };
                    edit.checkConflicts( ok, null, checkConflictsDeleteAll );
                    $(this).dialog("close");
                  }
                }
            });
           
           
       } else {
           console.error( "Option not found!" );
       }

    });

    $("#menu_buttons").on("click", "#btn_cancel", function(e){
        e.preventDefault();
       window.location.href='calendar.html';
    });
    
    $("#menu_buttons").on("click", "#btn_delete", function(e){
        e.preventDefault();
        
        var belongsRC;
        var deleteAllRC = false;
        var key = edit.old.abstract();
        if ( key !== "" ){
            belongsRC = true;
        } else {
            belongsRC = false;
        }
        var redirect = function() { window.location.href='calendar.html'; };
        
        if ( belongsRC ) {
            if ( confirm ( "Do you want to delete the rest of the elements of the RC?" ) ) {
                var deleteRCFromDate = edit.getStartDateRRuleFromAbstract( key );
                edit.deleteRC( key, edit.old.spatial(), deleteRCFromDate, redirect );
            } else {
                edit.deleteEvent( edit.old.identifier(), redirect );
            }
        } else {
            edit.deleteEvent( edit.old.identifier(), redirect );
        }

       
    });
    
    $('#repeatCheckInput').click(function(){
        $('#repeatPanel').slideToggle();
    });
    
    $('#repeatType').click(function () { 
        var valor = $(this).val();

        switch (valor){
            default:
            case 'DAILY':
                $('#repeatIntervalText').html('días');
                $('#repeatDays').fadeOut();
                break;
            case 'WEEKLY':
                $('#repeatIntervalText').html('semanas');
                $('#repeatDays').slideDown();
                break;
            case 'MONTHLY':
                $('#repeatIntervalText').html('meses');
                $('#repeatDays').fadeOut();
                break;
          
         }

         edit.checkConflicts();
     });
     
     $('#repeatEnd input[name="repeat_ending"]').click(function(){
         idClicked = $(this).attr('id');
         if(idClicked === 'option_num_repetitions'){
             $('#enddate_repetitions').attr('disabled','disabled');
             $('#num_repetitions').removeAttr('disabled');
         } else {
            $('#enddate_repetitions').removeAttr('disabled');
            $('#num_repetitions').attr('disabled','disabled');
         }
         
     });
});
