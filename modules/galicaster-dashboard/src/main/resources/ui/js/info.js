var agent = {};

function printHtmlAgent( ) {
    var agentInfo = agent;
    console.log(agent);

    // time
    var timeAgent = formatSecondsAsTime ( agentInfo [ 'time-since-last-update'] / 1000 );
    
    // state
    var stateAgent = '';
    var freeHdHtml = '';
    if ( agent.properties !== undefined ){
        
        // State (check if agent is offline) & time
        var pollingObject = getObjects ( agent.properties, "key", "capture.agent.state.remote.polling.interval" );
        if ( pollingObject.length > 0 ) {
            var timeSinceUpdate = parseInt( pollingObject[ 0 ].value );
            if ( agent['time-since-last-update'] > ( timeSinceUpdate * 1000 )) {
                stateAgent = "offline";
            } else {
                stateAgent = agent.state;
            }
        }
        
        // FREE HD
        var freeHdObject = getObjects ( agent.properties, "key", "capture.cleaner.mindiskspace" );
        if ( freeHdObject.length > 0 ) {
            freeHdHtml = humanFileSize( freeHdObject[ 0 ].value );
        }
        
        
    }
    
    var logHtml     = '<img class="iconTable" src="resources/iconLog.png" />';
    var configHtml  = '<img class="iconTable" src="resources/iconConfig.png" />';
    var nextHtml    = '...';
    var toolHtml    = 'WF | VNC | SSH';
    
    // set next - html

    if ( agent.nextRecording !== undefined) {
        nextObj = agent.nextRecording;

        // temporal
        var myRegexp = /start=(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d\:\d+([+-][0-2]\d:[0-5]\d|Z{0,1}))/;
        var match = myRegexp.exec( nextObj[ 'temporal' ][ 0 ][ 'value' ] );
        if( !match || typeof match[1] === "undefined" ) {
            result = 0; 
        } else { 
            result = match[ 1 ];
        }
        var dateObj = fromUTCDateString( match[ 1 ] ) || 0;
        var startsfrom = ( "0" + dateObj.getDay() ).slice( -2 ) + '/' + ( "0" + (dateObj.getMonth()+1) ).slice( -2 ) + '/' + dateObj.getFullYear() + ' ' + ( "0" + dateObj.getHours() ).slice( -2 ) + ':' + ( "0" + dateObj.getMinutes() ).slice( -2 );     
        nextHtml =   '<span title="' + nextObj[ 'title' ][ 0 ][ 'value' ] + '">' + startsfrom  + '</span>';
    }

    // Main Info table
    var infoHtml = '<table id="agentInfoTable"><thead><tr></tr>' +
            '<tr>' +
                '<td> Agent name    </td>' +  
                '<td class="state"> State </td>' +  
                '<td> Time          </td>' +  
                '<td> Next recording</td>' +  
                '<td> Free HD       </td>' +  
                '<td> Tools         </td>' +  
                '<td> Url           </td>' +  
                '<td> Log           </td>' +  
                '<td> CFG           </td>' +  
            '</tr>' +
        '</thead><tbody>';


      

      infoHtml = infoHtml + 
          '<tr class="' + agentInfo.name + '">'+ 
              '<td class="agent">'    + agentInfo.name    + '</td>' + 
              '<td class="state">'    + stateAgent        + '</td>' + 
              '<td class="time">'     + timeAgent         + '</td>' +
              '<td class="next">'     + nextHtml          + '</td>' + 
              '<td class="freehd">'   + freeHdHtml        + '</td>' + 
              '<td class="tool">'     + toolHtml        + '</td>' + 
              '<td class="url">'      + agentInfo.url     + '</td>' + 
              '<td class="log">'      + logHtml           + '</td>' + 
              '<td class="cfg">'      + configHtml        + '</td>' + 
          '</tr>';

     $('#infoAgent').html( infoHtml );

      // capabilities table

      var deviceNames = getCapabilitiesByDevice ( agentInfo.capabilities, 'key', 'capture.device.names');
      var devicesAr = deviceNames[0].value.split(',');

      var devicesArLength = devicesAr.length;

      var capabilitiesTableHtml = '<table id="capabilitiesTable"><thead>'+
          '<tr>' + 
              '<td> Device     </td>' + 
              '<td> flavor     </td>' +
              '<td> outputfile </td>' + 
              '<td> src        </td>' + 
          '</tr>' +
          '</thead><tbody>';

      for (var i=0; i<devicesArLength; i++) {
          var oddClass='';
          if ( i % 2 !== 0) { oddClass = ' odd'; }
          var capAr = getCapabilitiesByDevice ( agentInfo.capabilities, 'key', 'capture.device.'+devicesAr[i]);

          var agentCap = new Array();
          agentCap[ 'device' ] = devicesAr[i];

          $.each( capAr, function(i2,v){

              // property ->> ex: capture.device.A.src -> src
              var property = v.key.replace('capture.device.'+devicesAr[i]+'.', '');
              agentCap[property] = v.value;                        
          });

          capabilitiesTableHtml = capabilitiesTableHtml +
              '<tr class="' + agentCap.device + oddClass + '">'+ 
                  '<td class="device">'       + agentCap.device     + '</td>' + 
                  '<td class="flavor">'       + agentCap.flavor     + '</td>' + 
                  '<td class="outputfile">'   + agentCap.outputfile + '</td>' +
                  '<td class="src">'          + agentCap.src        + '</td>' + 
              '</tr>';

      }

      capabilitiesTableHtml = capabilitiesTableHtml + '</tbody></table>';
      $('#infoCapabilities').html( capabilitiesTableHtml );
  }             



  loadAgent = function ( name ) { 
      var actualDate = toISODate(new Date(), 'utc');
      $.when( $.ajax( '/capture-admin/agents/' + name + '.json' ), 
              $.ajax( '/capture-admin/agents/' + name + '/configuration.json' ), 
              $.ajax( '/recordings/recordings.json?spatial=' + name + '&startsfrom=' + actualDate + '&sort=EVENT_START')
            ).then(function( a1, a2, a3 ){

              // first ajax - agent info
              if ( a1[ 1 ] === "success" ) {
                  var v = a1 [ 0 ][ 'agent-state-update' ];
                  agent = v;
              }

              // second ajax - agent configuration
              if ( a2 [ 1 ] === "success" ) {
                  agent.properties  = a2 [ 0 ][ 'properties-response' ][ 'properties' ];
              } 


              // third ajax - next recording
              if ( a3 [ 1 ] === "success" ) {
                  if ( a3 [ 0 ][ 'catalogs' ].length >0 ) {
                      var nextObj = a3 [ 0 ] [ 'catalogs' ][ 0 ][ 'http://purl.org/dc/terms/' ];
                      // save object
                      agent.nextRecording = nextObj;
                  }
              }
              printHtmlAgent();
      });
  };
  
  function refreshImage( name ) {
      $( '#agentCaptureImage' ).attr( 'src', '/dashboard/rest/agents/' + name + '/snapshot.png');
      
  }

  $(document).ready(function(){

      var arParameters = getUrlVars();
      var agentId = arParameters[ 'agent' ];       
      loadAgent ( agentId );
      $( document ).attr( 'title', 'Agent: ' + arParameters.agent );


      // REFRESH
      $('#refreshButton').click(function(){
          loadAgent ( agentId );
          refreshImage ( agentId );
      });

      setInterval(function() { if($('#autoRefreshButton').is(':checked')) { loadAgent ( agentId ); refreshImage( agentId ); }}, 1000 * 10 * 0.5);
      
      refreshImage ( agentId );
  });