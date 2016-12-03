// $(function(){
$(function() {
	var testing;
	if ( typeof WebSocket === "undefined") {
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

	var power2 = 0;
	var powerin = 0;
	var Port1_Frequency = 1;
	var Port1_LineVoltage = 3;
	var Port1_Current = 4;
	var Port1_Power = 5;
	var Port1_EnergyNet = 10;

	/* All above parameters are in this group*/
	/*var Data_Group ="J1939_Data"; */
	var Data_Group = "Grid_pages";

	/* Defines for the state machine enumeration on the system master controller */
	var var_Off = 0;
	var var_On_Transition = 1;
	var var_On = 2;
	var var_Off_Transition = 3;

	var string = "";

	//Bind the grid when the socket connects
	ws.onopen = function() {

		sendrequestformetadata();
		// send request for the parameters meta data we want on this page
	};

	//Close the socket when the browser window is closed.
	window.onbeforeunload = closedownsocket;

	function closedownsocket() {
		request = {
			"WPUSHC" : ""
		};
		// clear the push requests
		//Send the data to the server side application VCPA
		ws.send(JSON.stringify(request));
		console.log("clear push request sent");
		ws.close();
		// close the socket
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
				if (result.MGPMG == Data_Group) {
					//Stop listening we will no longer look for the meta data
					ws.removeEventListener("message", arguments.callee);
					//Invoke the callback with the result
					var_gotmetadataresponse(result);
				} else {
					//Invoke the callback with the result
					var_callbackgotresponse(result);
					var_callbackgotresponse1(result);
				}
			} catch (Exception) {
				console.log(Exception.message);
			}
		});
		//Send the data to the server side application VCPA
		ws.send(JSON.stringify(request));
	}

	// this function requests the meta data for the group and sets the callback function for the returned data
	function sendrequestformetadata() {
		request = {
			WGPMG : Data_Group
		};
		send(ws, request, var_gotmetadataresponse);
		console.log("meta data requests sent");
		/* TODO, turn off for development only*/
	}

	var var_gotmetadataresponse = function gotmetadataresponse(result) {
		console.log("call back reached");
		/* TODO, turn off for development only*/
		console.log(result);
		/* TODO, turn off for development only*/
		// Loop through each of the results values array and consume the appropriate information //
		for ( i = 0; i < result.Values.length; i++) {
			try {
				switch(result.Values[i].MGPM.MGPMID) {

				} /* end of switch case statement */

			} catch (Exception) {
				console.log(Exception.message);
			}

		}/* end of for loop */
		sendrequestparametervalues();
		// send the push request for the parameters we want on this page and set the call back function to parse the returned message
		sendrequestparametervalues2();
	};
	/* end of got parameter meta data function */
	// this function requests the runtime data for the group and sets the callback function for the returned data
	function sendrequestparametervalues() {
		request = {
			WPUSHG : {
				WPUSHGID : "Grid_pages",
				Maxrate : 50,
				Minrate : 5000
			}
		};
		send(ws, request, var_callbackgotresponse);
		console.log("group parameter push request sent");
		/* TODO, turn off for development only*/

	}

	var timestampHistory;
	var commcounter = 0;
	var timesub;
	var var_callbackgotresponse = function callbackgotresponse(result) {
		console.log("call back reached");
		/* TODO, turn off for development only*/
		console.log(result);

		/* timesub used to minotr status updates from server */
		timesub = result.MGP.Timestamp.substr(0, 18);
		//clear the values if there is no update
		if (timestampHistory == timesub) {
			commcounter = 1 + commcounter;
		} else {
			timestampHistory = result.MGP.Timestamp.substr(0, 18);
			//"2016-06-21 15:26:30:181108"
			commcounter = 0;
		}
		if (commcounter > 200) {
			result.MGP.ParamVal = 99999;
		}

		// handle the display for the state of the image, based on the state reported by the system master controller //
		try {
			//1	P1_Frequency
			//2	P1_voltageAvg
			//3	P1_vofltageLineAvg
			//4	P1_currentAvg
			//5	P1_powerSum
			//6	P1_reactivePowerSum
			//7	P1_apperentPowerSum
			//8	P1_powerFactoSum
			//9	P1_energyTotal
			//10	P1_energyNet
			switch(result.MGP.MGPID) {

			case 	Port1_Frequency 	:
				document.getElementById("table_1").rows[5].cells[1].innerHTML = result.MGP.ParamVal * 1 + " Hz";
				break;

			case 	Port1_LineVoltage 	:
				document.getElementById("table_1").rows[3].cells[1].innerHTML = result.MGP.ParamVal * 1 + " V";
				break;

			case 	Port1_Current 	:
				document.getElementById("table_1").rows[2].cells[1].innerHTML = result.MGP.ParamVal * 1 + " A";
				break;

			case 	Port1_Power 	:
				document.getElementById("table_1").rows[1].cells[1].innerHTML = result.MGP.ParamVal * 1 / 1000 + " kW";
				break;

			case 2:
				//p1 line voltage
				document.getElementById("table_1").rows[4].cells[1].innerHTML = result.MGP.ParamVal * 1 + "V";
				break;

			case 	8 	:
				//p1 power factor
				document.getElementById("table_1").rows[6].cells[1].innerHTML = result.MGP.ParamVal * 1 + "PF";
				break;

			case Port1_EnergyNet	:
				//p1 energy net TODO
				document.getElementById("table_1").rows[7].cells[1].innerHTML = result.MGP.ParamVal * 1 + "kWh";
				break;

			case 	9	:
				//p1 energy total
				document.getElementById("table_1").rows[8].cells[1].innerHTML = result.MGP.ParamVal * 1 + "kWh";
				break;

			case 	1	:
				//p1 energy Import TODO
				document.getElementById("table_1").rows[9].cells[1].innerHTML = result.MGP.ParamVal * 1 + "kWh";
				break;

			case 	1	:
				//p1 energy Export TODO
				document.getElementById("table_1").rows[10].cells[1].innerHTML = result.MGP.ParamVal * 1 + "kWh";
				break;

			case 	6	:
				//p1 Reactive Power KVAR
				document.getElementById("table_1").rows[11].cells[1].innerHTML = result.MGP.ParamVal * 1 + "kVAR";
				break;

			case 	7	:
				//p1 Apperent Power KVA
				document.getElementById("table_1").rows[12].cells[1].innerHTML = result.MGP.ParamVal * 1 + "kVA";
				break;

			case 	1	:
				//p1 Status TODO
				document.getElementById("table_1").rows[13].cells[1].innerHTML = result.MGP.ParamVal * 1 + "kVA";
				break;

			case 	1	:
				//p1 Error Code TODO
				document.getElementById("table_1").rows[14].cells[1].innerHTML = result.MGP.ParamVal * 1 + "kVA";
				break;
			case 	126	:
				//p1 Error Code TODO
				break;

			} /* end of switch case statement */
		if (result.MGP.MGPID >= 132) {
				var test11=0;
			}
		} catch (Exception) {
			console.log(Exception.message);
		}

	};

});
/* end of main function */
