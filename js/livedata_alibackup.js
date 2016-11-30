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

        var Frequency = 1;
        var voltageAvg =2;
        var voltageLineAvg = 3;
        var currentAvg = 4;
        var powerSum = 5;
        var reactivePowerSum = 6;
        var apperentPowerSum = 7;
        var powerFactorSum = 8;
        var energyTotal = 9;
        var energyNet = 10;

				/* All above parameters are in this group*/
        /*var J1939_Data_Group ="J1939_Data"; */
        var J1939_Data_Group ="Port_1";

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

    				case Frequency:
    				document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName ;
                document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case voltageAvg:

    				document.getElementById("j1939_table").rows[2].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
                document.getElementById("j1939_table").rows[2].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case voltageLineAvg:

    				document.getElementById("j1939_table").rows[3].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
                document.getElementById("j1939_table").rows[3].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case currentAvg:
          //  document.getElementById("j1939_table").rows[4].cells[0].innerHTML = result.Values[i].MGPM.UnitsStr;

    				document.getElementById("j1939_table").rows[4].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
                document.getElementById("j1939_table").rows[4].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case powerSum:

    				document.getElementById("j1939_table").rows[5].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
                document.getElementById("j1939_table").rows[5].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case reactivePowerSum:

    				document.getElementById("j1939_table").rows[6].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
                document.getElementById("j1939_table").rows[6].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case apperentPowerSum:

    				document.getElementById("j1939_table").rows[7].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
                document.getElementById("j1939_table").rows[7].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case powerFactorSum:

    				document.getElementById("j1939_table").rows[8].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
                document.getElementById("j1939_table").rows[8].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case energyTotal:

    				document.getElementById("j1939_table").rows[9].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
                document.getElementById("j1939_table").rows[9].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;

    				case energyNet:

    				document.getElementById("j1939_table").rows[10].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
                document.getElementById("j1939_table").rows[10].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;

                break;
            //
    				// case Engine_Oil_Pressure:
            //
    				// document.getElementById("j1939_table").rows[11].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            //     document.getElementById("j1939_table").rows[11].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            //
            //     break;
            //
    				// case Transmission_Oil_Temperture:
            //
    				// document.getElementById("j1939_table").rows[12].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            //     document.getElementById("j1939_table").rows[12].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            //
            //     break;
            //
    				// case Trip_Distance:
            //
    				// document.getElementById("j1939_table").rows[13].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            //     document.getElementById("j1939_table").rows[13].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            //
            //     break;
            //
    				// case Total_Distance:
            //
    				// document.getElementById("j1939_table").rows[14].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            //     document.getElementById("j1939_table").rows[14].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            //
            //     break;
            //
    				// case Battery_Voltage:
            //
    				// document.getElementById("j1939_table").rows[15].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            //     document.getElementById("j1939_table").rows[15].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            //
            //     break;
            //
    				// case Key_Voltage:
            //
    				// document.getElementById("j1939_table").rows[16].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            //     document.getElementById("j1939_table").rows[16].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            //
            //     break;

            } /* end of switch case statement */

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
            request = {WPUSHG:{WPUSHGID:"Port_1",Maxrate:50,Minrate:5000}};
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

        // var Frequency = 1;
        // var voltageAvg =2;
        // var voltageLineAvg = 3;
        // var currentAvg = 4;
        // var powerSum = 5;
        // var reactivePowerSum = 6;
        // var apperentPowerSum = 7;
        // var powerFactorSum = 8;
        // var energyTotal = 9;
        // var energyNet = 10;

				case Frequency:

            document.getElementById("j1939_table").rows[1].cells[1].innerHTML = result.MGP.ParamVal *1 + " Hz";

            break;

				case voltageAvg:

            document.getElementById("j1939_table").rows[2].cells[1].innerHTML = result.MGP.ParamVal *1 +" V L-N";

            break;

				case voltageLineAvg:

            document.getElementById("j1939_table").rows[3].cells[1].innerHTML = result.MGP.ParamVal *1 + "V L-L";

            break;

				case currentAvg:

            document.getElementById("j1939_table").rows[4].cells[1].innerHTML = result.MGP.ParamVal *1 +" A";

            break;

				case powerSum:

            document.getElementById("j1939_table").rows[5].cells[1].innerHTML = result.MGP.ParamVal *1 +" W";

            break;

				case reactivePowerSum:

            document.getElementById("j1939_table").rows[6].cells[1].innerHTML = result.MGP.ParamVal *1 + " VAR";

            break;

				case apperentPowerSum:

            document.getElementById("j1939_table").rows[7].cells[1].innerHTML = result.MGP.ParamVal *1 + " W";

            break;

				case powerFactorSum:

            document.getElementById("j1939_table").rows[8].cells[1].innerHTML = result.MGP.ParamVal *1+" PF";

            break;

				case energyNet:

            document.getElementById("j1939_table").rows[9].cells[1].innerHTML = result.MGP.ParamVal *1 + " kW";

            break;

				case energyTotal:

            document.getElementById("j1939_table").rows[10].cells[1].innerHTML = result.MGP.ParamVal *1 + " kW";

            break;
        //
				// case Engine_Oil_Pressure:
        //
        //     document.getElementById("j1939_table").rows[11].cells[1].innerHTML = result.MGP.ParamVal;
        //
        //     break;
        //
				// case Transmission_Oil_Temperture:
        //
        //     document.getElementById("j1939_table").rows[12].cells[1].innerHTML = result.MGP.ParamVal;
        //     var a = parseInt(result.MGP.ParamVal)
        //     break;
        //
				// case Trip_Distance:
        //
        //     document.getElementById("j1939_table").rows[13].cells[1].innerHTML = result.MGP.ParamVal;
        //
        //     break;
        //
				// case Total_Distance:
        //
        //     document.getElementById("j1939_table").rows[14].cells[1].innerHTML = result.MGP.ParamVal;
        //
        //     break;
        //
				// case Battery_Voltage:
        //
        //     document.getElementById("j1939_table").rows[15].cells[1].innerHTML =  (parseInt(result.MGP.ParamVal) / 10).toFixed(1);
        //
        //     break;
        //
				// case Key_Voltage:
        //
        //     document.getElementById("j1939_table").rows[16].cells[1].innerHTML =  (parseInt(result.MGP.ParamVal) / 10).toFixed(1);
        //
        //     break;

            } /* end of switch case statement */

           } catch (Exception)

             {
             console.log(Exception.message);
             }

         }; /* end of got parameter value response function */


}); /* end of main function */
