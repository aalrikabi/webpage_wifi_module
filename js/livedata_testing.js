       $(function(){
           var testing;
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


        var Frequency = 101;
        var voltageAvg =102;
        var voltageLineAvg = 103;
        var currentAvg = 104;
        var powerSum = 105;
        var reactivePowerSum = 106;
        var apperentPowerSum = 107;
        var powerFactorSum = 108;
        var energyTotal = 109;
        var energyNet = 110;
           var P4_Priority = 102;
           var P5_Priority =103;
           var P6_Priority =104;
           var P7_Priority =105;
           var P8_Priority =106;
           var P9_Priority =107;
           var P10_Priority =108;


				/* All above parameters are in this group*/
        /*var J1939_Data_Group ="J1939_Data"; */
        var J1939_Data_Group ="PortData2";



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
            request = {WPUSHG:{WPUSHGID:"PortData2",Maxrate:50,Minrate:5000}};
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

                //output ports priority
                case 	P4_Priority 	:
                    document.getElementById("j1939_table").rows[2].cells[6].innerHTML = MGP_Parmval(result.MGP.ParamVal);
                    break;
                case 	P5_Priority 	:
                    document.getElementById("j1939_table").rows[3].cells[6].innerHTML = MGP_Parmval(result.MGP.ParamVal);
                    break;
                case 	P6_Priority 	:
                    document.getElementById("j1939_table").rows[4].cells[6].innerHTML = MGP_Parmval(result.MGP.ParamVal);
                    break;
                case 	P7_Priority 	:
                    document.getElementById("j1939_table").rows[5].cells[6].innerHTML =MGP_Parmval(result.MGP.ParamVal);
                    break;
                case 	P8_Priority 	:
                    document.getElementById("j1939_table").rows[6].cells[6].innerHTML =MGP_Parmval(result.MGP.ParamVal)	;
                    break;
                case 	P9_Priority 	:
                    document.getElementById("j1939_table").rows[7].cells[6].innerHTML = MGP_Parmval(result.MGP.ParamVal)	;
                    break;
                case 	P10_Priority 	:
                    document.getElementById("j1939_table").rows[8].cells[6].innerHTML = MGP_Parmval(result.MGP.ParamVal)	;
                    break;
            } /* end of switch case statement */

           } catch (Exception)

             {
             console.log(Exception.message);
             }

         }; /* end of got parameter value response function */


}); /* end of main function */



       // Function returns the product of a and b
       function MGP_Parmval( MGPvalue) {
           var string1;
           switch(MGPvalue) {
               case 0:
                   string1= "OFF";
                   break;
               case 1:
                   string1= "LOW";
                   break;
               case 2:
                   string1="Medium";
                   break;
               case 3:
                   string1="HIGH";
                   break;
               case 4:
                   string1="ON";
                   break;
           }
           return string1;
       }