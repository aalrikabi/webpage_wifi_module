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
            
            var Engine_RPM = 101;
            var Accelerator_Position = 102;
            var Engine_Load = 103;
            var Trip_Distance = 104;
            var Total_Distance = 105;
            var Engine_Coolent_Temperture = 106;
            var Engine_Oil_Pressure = 107;  
            var Vehicle_Speed = 108;  
            var Engine_Fuel_Rate = 109; 
            var Engine_Instantaneous_Fuel_Rate = 110;
            var Engine_Air_Intake_Pressure = 111;
            var Engine_Air_Intake_Temperture = 112;
				var Battery_Voltage = 113;
				var Key_Voltage = 114;
				var Transmission_Oil_Temperture = 115;
				var Fuel_Level = 116;
				
				/* All above parameters are in this group*/
				var J1939_Data_Group ="J1939_Data";
 
                 
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
            	/*var Engine_RPM = 101;
            var Accelerator_Position = 102;
            var Engine_Load = 103;
            var Trip_Distance = 104;
            var Total_Distance = 105;
            var Engine_Coolent_Temperture = 106;
            var Engine_Oil_Pressure = 107;  
            var Vehicle_Speed = 108;  
            var Engine_Fuel_Rate = 109; 
            var Engine_Instantaneous_Fuel_Rate = 110;
            var Engine_Air_Intake_Pressure = 111;
            var Engine_Air_Intake_Temperture = 112;
				var Battery_Voltage = 113;
				var Key_Voltage = 114;
				var Transmission_Oil_Temperture = 115;
				var Fuel_Level = 116;*/
            	
				case Engine_RPM:

				document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            
            break;
          	
				case Engine_Load:

				document.getElementById("j1939_table").rows[2].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            document.getElementById("j1939_table").rows[2].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            
            break;
                      	
				case Accelerator_Position:

				document.getElementById("j1939_table").rows[3].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            document.getElementById("j1939_table").rows[3].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            
            break; 
                      	
				case Vehicle_Speed:

				document.getElementById("j1939_table").rows[4].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            document.getElementById("j1939_table").rows[4].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            
            break; 
                      	
				case Engine_Fuel_Rate:

				document.getElementById("j1939_table").rows[5].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            document.getElementById("j1939_table").rows[5].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            
            break; 
                      	
				case Engine_Instantaneous_Fuel_Rate:

				document.getElementById("j1939_table").rows[6].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            document.getElementById("j1939_table").rows[6].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            
            break; 
                      	
				case Engine_Air_Intake_Pressure:

				document.getElementById("j1939_table").rows[7].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            document.getElementById("j1939_table").rows[7].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            
            break; 
                      	
				case Engine_Air_Intake_Temperture:

				document.getElementById("j1939_table").rows[8].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            document.getElementById("j1939_table").rows[8].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            
            break; 
                      	
				case Fuel_Level:

				document.getElementById("j1939_table").rows[9].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            document.getElementById("j1939_table").rows[9].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            
            break; 
                      	
				case Engine_Coolent_Temperture:

				document.getElementById("j1939_table").rows[10].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            document.getElementById("j1939_table").rows[10].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            
            break; 
                      	
				case Engine_Oil_Pressure:

				document.getElementById("j1939_table").rows[11].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            document.getElementById("j1939_table").rows[11].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            
            break; 
                      	
				case Transmission_Oil_Temperture:

				document.getElementById("j1939_table").rows[12].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            document.getElementById("j1939_table").rows[12].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            
            break; 
                      	
				case Trip_Distance:

				document.getElementById("j1939_table").rows[13].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            document.getElementById("j1939_table").rows[13].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            
            break; 
                      	
				case Total_Distance:

				document.getElementById("j1939_table").rows[14].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            document.getElementById("j1939_table").rows[14].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            
            break; 
                      	
				case Battery_Voltage:

				document.getElementById("j1939_table").rows[15].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            document.getElementById("j1939_table").rows[15].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            
            break; 
                      	
				case Key_Voltage:

				document.getElementById("j1939_table").rows[16].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
            document.getElementById("j1939_table").rows[16].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
            
            break; 
   
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
            
            request = {WPUSHG:{WPUSHGID:"J1939_Data",Maxrate:50,Minrate:5000}};
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
            	/*var Engine_RPM = 101;
            var Accelerator_Position = 102;
            var Engine_Load = 103;
            var Trip_Distance = 104;
            var Total_Distance = 105;
            var Engine_Coolent_Temperture = 106;
            var Engine_Oil_Pressure = 107;  
            var Vehicle_Speed = 108;  
            var Engine_Fuel_Rate = 109; 
            var Engine_Instantaneous_Fuel_Rate = 110;
            var Engine_Air_Intake_Pressure = 111;
            var Engine_Air_Intake_Temperture = 112;
				var Battery_Voltage = 113;
				var Key_Voltage = 114;
				var Transmission_Oil_Temperture = 115;
				var Fuel_Level = 116;*/
            	
				case Engine_RPM:

            document.getElementById("j1939_table").rows[1].cells[1].innerHTML = result.MGP.ParamVal;
            
            break;
          	
				case Engine_Load:

            document.getElementById("j1939_table").rows[2].cells[1].innerHTML = result.MGP.ParamVal;
            
            break;
                      	
				case Accelerator_Position:

            document.getElementById("j1939_table").rows[3].cells[1].innerHTML = result.MGP.ParamVal;
            
            break; 
                      	
				case Vehicle_Speed:

            document.getElementById("j1939_table").rows[4].cells[1].innerHTML = result.MGP.ParamVal;
            
            break; 
                      	
				case Engine_Fuel_Rate:

            document.getElementById("j1939_table").rows[5].cells[1].innerHTML = result.MGP.ParamVal;
            
            break; 
                      	
				case Engine_Instantaneous_Fuel_Rate:

            document.getElementById("j1939_table").rows[6].cells[1].innerHTML = result.MGP.ParamVal;
            
            break; 
                      	
				case Engine_Air_Intake_Pressure:

            document.getElementById("j1939_table").rows[7].cells[1].innerHTML = result.MGP.ParamVal;
            
            break; 
                      	
				case Engine_Air_Intake_Temperture:

            document.getElementById("j1939_table").rows[8].cells[1].innerHTML = result.MGP.ParamVal;
            
            break; 
                      	
				case Fuel_Level:

            document.getElementById("j1939_table").rows[9].cells[1].innerHTML = result.MGP.ParamVal;
            
            break; 
                      	
				case Engine_Coolent_Temperture:

            document.getElementById("j1939_table").rows[10].cells[1].innerHTML = result.MGP.ParamVal;
            
            break; 
                      	
				case Engine_Oil_Pressure:

            document.getElementById("j1939_table").rows[11].cells[1].innerHTML = result.MGP.ParamVal;
            
            break; 
                      	
				case Transmission_Oil_Temperture:

            document.getElementById("j1939_table").rows[12].cells[1].innerHTML = result.MGP.ParamVal;
            
            break; 
                      	
				case Trip_Distance:

            document.getElementById("j1939_table").rows[13].cells[1].innerHTML = result.MGP.ParamVal;
            
            break; 
                      	
				case Total_Distance:

            document.getElementById("j1939_table").rows[14].cells[1].innerHTML = result.MGP.ParamVal;
            
            break; 
                      	
				case Battery_Voltage:

            document.getElementById("j1939_table").rows[15].cells[1].innerHTML =  (parseInt(result.MGP.ParamVal) / 10).toFixed(1);
            
            break; 
                      	
				case Key_Voltage:

            document.getElementById("j1939_table").rows[16].cells[1].innerHTML =  (parseInt(result.MGP.ParamVal) / 10).toFixed(1);
            
            break; 
   
            } /* end of switch case statement */
            
           } catch (Exception) 
                                
             {
             console.log(Exception.message);	
             }
            
         }; /* end of got parameter value response function */


}); /* end of main function */
		
