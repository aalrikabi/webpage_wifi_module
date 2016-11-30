       $(function(){
            if (typeof WebSocket === "undefined") {
                $("#grid").html('The application requires Web Sockets and HTML5 support. Please update your Browser. /></a>');
                return;
            }

            /* Setup the websocket connection, need to decided weather to use secure or standard socket */

            var loc = window.location;
            var wsUriVPCA;
				if (loc.protocol === "https:") {
				wsUriVPCA = "wss:";
				} else {
				wsUriVPCA = "ws:";
				}
				wsUriVPCA += loc.host + "/VPCA";
            var ws = new WebSocket(wsUriVPCA);

            /* Define the parameters we will use on this page
            These numbers match the parameter ID in VPCA database */

        var tag1 = 5;
        var tag2 =15;
        var tag3 = 25;
        var tag4 = 35;
        var tag5 = 45;
        var tag6 = 55;
        var tag7 = 65;
        var tag8 = 75;
        var tag9 = 85;
        var tag10 = 95;

				/* All above parameters are in this group*/
        /*var J1939_Data_Group ="J1939_Data"; */
        var J1939_Data_Group ="Power";

            /* Defines for the state machine enumeration on the system master controller */
            var var_Off = 0;
            var var_On_Transition = 1;
            var var_On = 2;
            var var_Off_Transition = 3;

				var string = "";

            //Bind the grid when the socket connects
            ws.onopen = function() {

                sendrequestformetadata(); // send request for the parameters meta data we want on this page
            };

            //Close the socket when the browser window is closed.
            window.onbeforeunload = closedownsocket;

            function closedownsocket() {
					      request = {"WPUSHC":""}; // clear the push requests
                //Send the data to the server side application VCPA
                ws.send(JSON.stringify(request));
             	  console.log("clear push request sent");

                ws.close(); // close the socket
            }

            // this function sends data through the socket and calls the callback function to process the returned data
            function send(ws, request, callback) {
                if (ws.readyState != 1) {
                    return;
                }

                //Listen to the "message" event to get server response
                ws.addEventListener("message", function(e) {
                	try {
                    var result = JSON.parse(e.data);
                    //Check if the response is for the meta data request
                    if (result.MGPMG == J1939_Data_Group) {
                        //Stop listening we will no longer look for the meta data
                        ws.removeEventListener("message", arguments.callee);
                        //Invoke the callback with the result
                        var_gotmetadataresponse(result);
                    }
                    else
                    {
								//Invoke the callback with the result
                        var_callbackgotresponse(result);
                    }
           			} catch (Exception)
             		{
             		console.log(Exception.message);
             		}
                });
                //Send the data to the server side application VCPA
                ws.send(JSON.stringify(request));
            }
            // this function requests the meta data for the group and sets the callback function for the returned data
             function sendrequestformetadata ()
             {
            	request = {WGPMG:J1939_Data_Group};
             	send(ws, request, var_gotmetadataresponse);
             	console.log("meta data requests sent"); /* TODO, turn off for development only*/
            }
            var var_gotmetadataresponse = function gotmetadataresponse (result) {
            console.log("call back reached");/* TODO, turn off for development only*/
           	console.log(result);/* TODO, turn off for development only*/
           // Loop through each of the results values array and consume the appropriate information //
           for (i=0; i < result.Values.length; i++)
           {
            try {
            switch(result.Values[i].MGPM.MGPMID)
            {

    				case tag1:
    				document.getElementById("Power_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName ;
            //    document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case tag2:

    				document.getElementById("Power_table").rows[2].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
              //  document.getElementById("j1939_table").rows[2].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case tag3:

    				document.getElementById("Power_table").rows[3].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
                //document.getElementById("j1939_table").rows[3].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case tag4:
          //  document.getElementById("j1939_table").rows[4].cells[0].innerHTML = result.Values[i].MGPM.UnitsStr;

    				document.getElementById("Power_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.MGPMName;
              //  document.getElementById("j1939_table").rows[4].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case tag5:

    				document.getElementById("Power_table").rows[2].cells[2].innerHTML = result.Values[i].MGPM.MGPMName;
              //  document.getElementById("j1939_table").rows[5].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case tag6:

    				document.getElementById("Power_table").rows[3].cells[2].innerHTML = result.Values[i].MGPM.MGPMName;
              ///  document.getElementById("j1939_table").rows[6].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case tag7:

    				document.getElementById("Power_table").rows[4].cells[2].innerHTML = result.Values[i].MGPM.MGPMName;
                ///document.getElementById("j1939_table").rows[7].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case tag8:

    				document.getElementById("Power_table").rows[5].cells[2].innerHTML = result.Values[i].MGPM.MGPMName;
              ///  document.getElementById("j1939_table").rows[8].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case tag9:

    				document.getElementById("Power_table").rows[6].cells[2].innerHTML = result.Values[i].MGPM.MGPMName;
              //  document.getElementById("j1939_table").rows[9].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case tag10:

    				document.getElementById("Power_table").rows[7].cells[2].innerHTML = result.Values[i].MGPM.MGPMName;
                //document.getElementById("j1939_table").rows[10].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

            } /* end of switch case statement */

	document.getElementById("Power_table").rows[8].cells[0].innerHTML = "Total Input Power" ;
  	document.getElementById("Power_table").rows[8].cells[2].innerHTML = "Total Output Power" ;
           } catch (Exception)

             {
             console.log(Exception.message);
             }

          } /* end of for loop */
         sendrequestparametervalues(); // send the push request for the parameters we want on this page and set the call back function to parse the returned message
         }; /* end of got parameter meta data function */



         // this function requests the runtime data for the group and sets the callback function for the returned data
         function sendrequestparametervalues ()
             {
              var port4p;
               var port5p;
               var port6p;
              var port7p;
            var port8p;
            var port9p;
            var port10p;
            var port1p;
            var port2p;
            var port3p;
            request = {WPUSHG:{WPUSHGID:"Power",Maxrate:50,Minrate:5000}};
             send(ws, request, var_callbackgotresponse);
             console.log("group parameter push request sent");/* TODO, turn off for development only*/
            }
            var var_callbackgotresponse = function callbackgotresponse (result) {
            console.log("call back reached");/* TODO, turn off for development only*/
           	console.log(result);/* TODO, turn off for development only*/

            // handle the display for the state of the image, based on the state reported by the system master controller //

            try {
            switch(result.MGP.MGPID)
            {

				case tag1:

            document.getElementById("Power_table").rows[1].cells[1].innerHTML = result.MGP.ParamVal /1000 + " kW";
            port1p = result.MGP.ParamVal *1;
            break;

				case tag2:

            document.getElementById("Power_table").rows[2].cells[1].innerHTML = result.MGP.ParamVal /1000 +" kW";
            port2p = result.MGP.ParamVal *1;
            break;

				case tag3:

            document.getElementById("Power_table").rows[3].cells[1].innerHTML = result.MGP.ParamVal /1000 + " kW";
            port3p = result.MGP.ParamVal *1;
            break;

				case tag4:

            document.getElementById("Power_table").rows[1].cells[3].innerHTML = result.MGP.ParamVal /1000 +" kW";
            port4p = result.MGP.ParamVal *1;

            break;

				case tag5:

            document.getElementById("Power_table").rows[2].cells[3].innerHTML = result.MGP.ParamVal /1000 +" kW";
            port5p = result.MGP.ParamVal *1;

            break;

				case tag6:

            document.getElementById("Power_table").rows[3].cells[3].innerHTML = result.MGP.ParamVal /1000 + " kW";
            port6p = result.MGP.ParamVal *1;

            break;

				case tag7:

            document.getElementById("Power_table").rows[4].cells[3].innerHTML = result.MGP.ParamVal /1000 + " kW";
            port7p = result.MGP.ParamVal *1;

            break;

				case tag8:

            document.getElementById("Power_table").rows[5].cells[3].innerHTML = result.MGP.ParamVal /1000 +" kW";
            port8p = result.MGP.ParamVal *1;

            break;

				case tag9:

            document.getElementById("Power_table").rows[6].cells[3].innerHTML = result.MGP.ParamVal /1000 + " kW";
            port9p = result.MGP.ParamVal *1;

            break;

				case tag10:

            document.getElementById("Power_table").rows[7].cells[3].innerHTML = result.MGP.ParamVal /1000 + " kW";
            port10p = result.MGP.ParamVal *1;

            break;

            } /* end of switch case statement */


              document.getElementById("Power_table").rows[8].cells[1].innerHTML = (port1p + port2p + port3p )/1000 +" kW";
              document.getElementById("Power_table").rows[8].cells[3].innerHTML = (port4p + port5p + port6p +port7p + port8p + port9p + port10p)/1000 + " kW";


           } catch (Exception)

             {
             console.log(Exception.message);
             }

         }; /* end of got parameter value response function */


}); /* end of main function */
