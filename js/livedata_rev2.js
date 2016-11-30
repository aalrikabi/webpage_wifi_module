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

	//     var Engine_RPM = 101;
	//     var Accelerator_Position = 102;
	//     var Engine_Load = 103;
	//     var Trip_Distance = 104;
	//     var Total_Distance = 105;
	//     var Engine_Coolent_Temperture = 106;
	//     var Engine_Oil_Pressure = 107;
	//     var Vehicle_Speed = 108;
	//     var Engine_Fuel_Rate = 109;
	//     var Engine_Instantaneous_Fuel_Rate = 110;
	//     var Engine_Air_Intake_Pressure = 111;
	//     var Engine_Air_Intake_Temperture = 112;
	// var Battery_Voltage = 113;
	// var Key_Voltage = 114;
	// var Transmission_Oil_Temperture = 115;
	// var Fuel_Level = 116;
	// bobbyS_vars1.title=100;

	var power2 = 0;
	var powerin = 0;
	var Port1_Frequency = 1;
	var Port1_LineVoltage = 3;
	var Port1_Current = 4;
	var Port1_Power = 5;
	var Port2_Frequency = 11;
	var Port2_LineVoltage = 13;
	var Port2_Current = 14;
	var Port2_Power = 15;
	var Port3_Frequency = 21;
	var Port3_LineVoltage = 23;
	var Port3_Current = 24;
	var Port3_Power = 25;
	var Port4_Frequency = 31;
	var Port4_LineVoltage = 33;
	var Port4_Current = 34;
	var Port4_Power = 35;
	var Port5_Frequency = 41;
	var Port5_LineVoltage = 43;
	var Port5_Current = 44;
	var Port5_Power = 45;
	var Port6_Frequency = 51;
	var Port6_LineVoltage = 53;
	var Port6_Current = 54;
	var Port6_Power = 55;
	var Port7_Frequency = 61;
	var Port7_LineVoltage = 63;
	var Port7_Current = 64;
	var Port7_Power = 65;
	var Port8_Frequency = 71;
	var Port8_LineVoltage = 73;
	var Port8_Current = 74;
	var Port8_Power = 75;
	var Port9_Frequency = 81;
	var Port9_LineVoltage = 83;
	var Port9_Current = 84;
	var Port9_Power = 85;
	var Port10_Frequency = 91;
	var Port10_LineVoltage = 93;
	var Port10_Current = 94;
	var Port10_Power = 95;
	var P4_Priority = 102;
	var P5_Priority = 103;
	var P6_Priority = 104;
	var P7_Priority = 105;
	var P8_Priority = 106;
	var P9_Priority = 107;
	var P10_Priority = 108;

	/* All above parameters are in this group*/
	/*var J1939_Data_Group ="J1939_Data"; */
	var J1939_Data_Group = "PortsData";

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
				if (result.MGPMG == J1939_Data_Group) {
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
			WGPMG : J1939_Data_Group
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

				// case 	Port1_Frequency	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port1_LineVoltage	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port1_Current	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port1_Power	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port2_Frequency	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port2_LineVoltage	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port2_Current	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port2_Power	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port3_Frequency	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port3_LineVoltage	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port3_Current	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port3_Power	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port4_Frequency	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port4_LineVoltage	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port4_Current	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port4_Power	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port5_Frequency	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port5_LineVoltage	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port5_Current	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port5_Power	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port6_Frequency	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port6_LineVoltage	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port6_Current	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port6_Power	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port7_Frequency	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port7_LineVoltage	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port7_Current	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port7_Power	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port8_Frequency	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port8_LineVoltage	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port8_Current	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port8_Power	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port9_Frequency	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port9_LineVoltage	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port9_Current	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port9_Power	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port10_Frequency	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port10_LineVoltage	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port10_Current	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;
				//
				// case 	Port10_Power	:
				//     document.getElementById("j1939_table").rows[1].cells[0].innerHTML = result.Values[i].MGPM.MGPMName;
				//     document.getElementById("j1939_table").rows[1].cells[2].innerHTML = result.Values[i].MGPM.UnitsStr;
				//
				//     break;

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
				WPUSHGID : "PortsData",
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
		/* TODO, turn off for development only*/
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
			result.MGP.ParamVal = 9999;
		}

		// handle the display for the state of the image, based on the state reported by the system master controller //
		try {
			switch(result.MGP.MGPID) {
			case 	Port1_Frequency 	:
				document.getElementById("table_1").rows[2].cells[1].innerHTML = result.MGP.ParamVal * 1 + " Hz";
				break;

			case 	Port1_LineVoltage 	:
				document.getElementById("table_1").rows[2].cells[2].innerHTML = result.MGP.ParamVal * 1 + " V";
				document.getElementById("circule_batterychargepower").innerHTML = result.MGP.ParamVal * 1;
				break;

			case 	Port1_Current 	:
				document.getElementById("table_1").rows[2].cells[3].innerHTML = result.MGP.ParamVal * 1 + " A";
			
				document.getElementById("circule_batterychargepower").innerHTML = result.MGP.ParamVal * 1;
				break;

			case 	Port1_Power 	:
				document.getElementById("table_1").rows[2].cells[4].innerHTML = result.MGP.ParamVal * 1 / 1000 + " kW";
				//  document.getElementById("table_1").rows[2].cells[5].innerHTML = ( Math.round(result.MGP.ParamVal /700)) + " %";//70kw max
				window.Power_chart1.Port1P = result.MGP.ParamVal * 1 / 1000;
				PortPowerpercent();

				// //change color of table cel
				// if (window.Power_chart1.Port1P >0){
				//     document.getElementById("table_1").rows[2].cells[4].className = "w3-blue";
				//     }
				// else {
				//     document.getElementById("table_1").rows[2].cells[4].className += "w3-red";
				// }

				break;
			case 	Port2_Frequency 	:
				document.getElementById("table_1").rows[3].cells[1].innerHTML = result.MGP.ParamVal * 1 + " Hz";
				break;

			case 	Port2_LineVoltage 	:
				document.getElementById("table_1").rows[3].cells[2].innerHTML = result.MGP.ParamVal * 1 + " V";
				break;

			case 	Port2_Current 	:
				document.getElementById("table_1").rows[3].cells[3].innerHTML = result.MGP.ParamVal * 1 + " A";
				break;

			case 	Port2_Power 	:
				document.getElementById("table_1").rows[3].cells[4].innerHTML = result.MGP.ParamVal * 1 / 1000 + " kW";
				//document.getElementById("table_1").rows[3].cells[5].innerHTML = ( Math.round(result.MGP.ParamVal /700)) + " %";//70kw max
				window.Power_chart1.Port2P = result.MGP.ParamVal * 1 / 1000;
				PortPowerpercent();
				break;
			case 	Port3_Frequency 	:
				document.getElementById("table_1").rows[4].cells[1].innerHTML = result.MGP.ParamVal * 1 + " Hz";
				break;

			case 	Port3_LineVoltage 	:
				document.getElementById("table_1").rows[4].cells[2].innerHTML = result.MGP.ParamVal * 1 + " V";
				break;

			case 	Port3_Current 	:
				document.getElementById("table_1").rows[4].cells[3].innerHTML = result.MGP.ParamVal * 1 + " A";
				break;

			case 	Port3_Power 	:
				document.getElementById("table_1").rows[4].cells[4].innerHTML = result.MGP.ParamVal * 1 / 1000 + " kW";
				//document.getElementById("table_1").rows[4].cells[5].innerHTML = ( Math.round(result.MGP.ParamVal /700)) + " %";//70kw max
				window.Power_chart1.Port3P = result.MGP.ParamVal * 1 / 1000;
				PortPowerpercent();
				break;
			case 	Port4_Frequency 	:
				document.getElementById("table_2").rows[2].cells[1].innerHTML = result.MGP.ParamVal * 1 + " Hz";
				break;

			case 	Port4_LineVoltage 	:
				document.getElementById("table_2").rows[2].cells[2].innerHTML = result.MGP.ParamVal * 1 + " V";
				break;

			case 	Port4_Current 	:
				document.getElementById("table_2").rows[2].cells[3].innerHTML = result.MGP.ParamVal * 1 + " A";
				break;

			case 	Port4_Power 	:
				document.getElementById("table_2").rows[2].cells[4].innerHTML = result.MGP.ParamVal * 1 / 1000 + " kW";
				//document.getElementById("table_2").rows[2].cells[5].innerHTML = ( Math.round(result.MGP.ParamVal /700)) + " %";//70kw max
				window.Power_chart1.Port4P = result.MGP.ParamVal * 1 / 1000;
				PortPowerpercent();
				break;
			case 	Port5_Frequency 	:
				document.getElementById("table_2").rows[3].cells[1].innerHTML = result.MGP.ParamVal * 1 + " Hz";
				break;

			case 	Port5_LineVoltage 	:
				document.getElementById("table_2").rows[3].cells[2].innerHTML = result.MGP.ParamVal * 1 + " V";
				break;

			case 	Port5_Current 	:
				document.getElementById("table_2").rows[3].cells[3].innerHTML = result.MGP.ParamVal * 1 + " A";
				break;

			case 	Port5_Power 	:
				document.getElementById("table_2").rows[3].cells[4].innerHTML = result.MGP.ParamVal * 1 / 1000 + " kW";
				//document.getElementById("table_2").rows[3].cells[5].innerHTML = ( Math.round(result.MGP.ParamVal /350)) + " %";//35kw max
				window.Power_chart1.Port5P = result.MGP.ParamVal * 1 / 1000;
				PortPowerpercent();
				break;
			case 	Port6_Frequency 	:
				document.getElementById("table_2").rows[4].cells[1].innerHTML = result.MGP.ParamVal * 1 + " Hz";
				break;

			case 	Port6_LineVoltage 	:
				document.getElementById("table_2").rows[4].cells[2].innerHTML = result.MGP.ParamVal * 1 + " V";
				break;

			case 	Port6_Current 	:
				document.getElementById("table_2").rows[4].cells[3].innerHTML = result.MGP.ParamVal * 1 + " A";
				break;

			case 	Port6_Power 	:
				document.getElementById("table_2").rows[4].cells[4].innerHTML = result.MGP.ParamVal * 1 / 1000 + " kW";
				// document.getElementById("table_2").rows[4].cells[5].innerHTML = ( Math.round(result.MGP.ParamVal /210)) + " %";//21kw max
				window.Power_chart1.Port6P = result.MGP.ParamVal * 1 / 1000;
				PortPowerpercent();
				break;
			case 	Port7_Frequency 	:
				document.getElementById("table_2").rows[5].cells[1].innerHTML = result.MGP.ParamVal * 1 + " Hz";
				break;

			case 	Port7_LineVoltage 	:
				document.getElementById("table_2").rows[5].cells[2].innerHTML = result.MGP.ParamVal * 1 + " V";
				break;

			case 	Port7_Current 	:
				document.getElementById("table_2").rows[5].cells[3].innerHTML = result.MGP.ParamVal * 1 + " A";
				break;

			case 	Port7_Power 	:
				document.getElementById("table_2").rows[5].cells[4].innerHTML = result.MGP.ParamVal * 1 / 1000 + " kW";
				//document.getElementById("table_2").rows[5].cells[5].innerHTML = ( Math.round(result.MGP.ParamVal /210)) + " %";//21kw max
				window.Power_chart1.Port7P = result.MGP.ParamVal * 1 / 1000;
				PortPowerpercent();
				break;
			case 	Port8_Frequency 	:
				document.getElementById("table_2").rows[7].cells[1].innerHTML = result.MGP.ParamVal * 1 + " Hz";
				break;

			case 	Port8_LineVoltage 	:
				document.getElementById("table_2").rows[7].cells[2].innerHTML = result.MGP.ParamVal * 1 + " V";
				break;

			case 	Port8_Current 	:
				document.getElementById("table_2").rows[7].cells[3].innerHTML = result.MGP.ParamVal * 1 + " A";
				break;

			case 	Port8_Power 	:
				document.getElementById("table_2").rows[7].cells[4].innerHTML = result.MGP.ParamVal * 1 / 1000 + " kW";
				//   document.getElementById("table_2").rows[6].cells[5].innerHTML = ( Math.round(result.MGP.ParamVal /350)) + " %";//35kw max
				window.Power_chart1.Port8P = result.MGP.ParamVal * 1 / 1000;
				PortPowerpercent();
				break;
			case 	Port9_Frequency 	:
				document.getElementById("table_2").rows[8].cells[1].innerHTML = result.MGP.ParamVal * 1 + " Hz";
				break;

			case 	Port9_LineVoltage 	:
				document.getElementById("table_2").rows[8].cells[2].innerHTML = result.MGP.ParamVal * 1 + " V";
				break;

			case 	Port9_Current 	:
				document.getElementById("table_2").rows[8].cells[3].innerHTML = result.MGP.ParamVal * 1 + " A";
				break;

			case 	Port9_Power 	:
				document.getElementById("table_2").rows[8].cells[4].innerHTML = result.MGP.ParamVal * 1 / 1000 + " kW";
				// document.getElementById("table_2").rows[7].cells[5].innerHTML = ( Math.round(result.MGP.ParamVal /210)) + " %";//21kw max
				window.Power_chart1.Port9P = result.MGP.ParamVal * 1 / 1000;
				PortPowerpercent();
				break;
			case 	Port10_Frequency 	:
				document.getElementById("table_2").rows[9].cells[1].innerHTML = result.MGP.ParamVal * 1 + " Hz";
				break;

			case 	Port10_LineVoltage 	:
				document.getElementById("table_2").rows[9].cells[2].innerHTML = result.MGP.ParamVal * 1 + " V";
				break;

			case 	Port10_Current 	:
				document.getElementById("table_2").rows[9].cells[3].innerHTML = result.MGP.ParamVal * 1 + " A";
				break;

			case 	Port10_Power 	:
				document.getElementById("table_2").rows[9].cells[4].innerHTML = result.MGP.ParamVal * 1 / 1000 + " kW";
				//  document.getElementById("table_2").rows[8].cells[5].innerHTML = ( Math.round(result.MGP.ParamVal /210)) + " %";//21kw max
				window.Power_chart1.Port10P = result.MGP.ParamVal * 1 / 1000;
				PortPowerpercent();
				break;

			//output ports priority
			case 	P4_Priority 	:
				document.getElementById("table_2").rows[2].cells[6].innerHTML = MGP_Parmval(result.MGP.ParamVal);
				break;
			case 	P5_Priority 	:
				document.getElementById("table_2").rows[3].cells[6].innerHTML = MGP_Parmval(result.MGP.ParamVal);
				break;
			case 	P6_Priority 	:
				document.getElementById("table_2").rows[4].cells[6].innerHTML = MGP_Parmval(result.MGP.ParamVal);
				break;
			case 	P7_Priority 	:
				document.getElementById("table_2").rows[5].cells[6].innerHTML = MGP_Parmval(result.MGP.ParamVal);
				break;
			case 	P8_Priority 	:
				document.getElementById("table_2").rows[7].cells[6].innerHTML = MGP_Parmval(result.MGP.ParamVal);
				break;
			case 	P9_Priority 	:
				document.getElementById("table_2").rows[8].cells[6].innerHTML = MGP_Parmval(result.MGP.ParamVal);
				break;
			case 	P10_Priority 	:
				document.getElementById("table_2").rows[9].cells[6].innerHTML = MGP_Parmval(result.MGP.ParamVal);
				break;
			case 	109 	:
				//p1 con 0=NA 1=open 2=closed 3=fault
				ContactorStatus(1, result.MGP.ParamVal);
				break;
			case 	110 	:
				//p2 con 0=NA 1=open 2=closed 3=fault
				ContactorStatus(2, result.MGP.ParamVal);
				break;
			case 	111 	:
				//p3 con 0=NA 1=open 2=closed 3=fault
				ContactorStatus(3, result.MGP.ParamVal);
				break;
			case 	112 	:
				//p4 con 0=NA 1=open 2=closed 3=fault
				ContactorStatus(4, result.MGP.ParamVal);
				break;
			case 	113 	:
				//p5 con 0=NA 1=open 2=closed 3=fault
				ContactorStatus(5, result.MGP.ParamVal);
				break;
			case 	114 	:
				//p6 con 0=NA 1=open 2=closed 3=fault
				ContactorStatus(6, result.MGP.ParamVal);
				break;
			case 	115 	:
				//p7 con 0=NA 1=open 2=closed 3=fault
				ContactorStatus(7, result.MGP.ParamVal);
				break;
			case 	116 	:
				//p8 con 0=NA 1=open 2=closed 3=fault
				ContactorStatus(8, result.MGP.ParamVal);
				break;
			case 	117 	:
				//p9 con 0=NA 1=open 2=closed 3=fault
				ContactorStatus(9, result.MGP.ParamVal);
				break;
			case 	118 	:
				//p10 con 0=NA 1=open 2=closed 3=fault
				ContactorStatus(10, result.MGP.ParamVal);
				break;
			case 	119 	:
				//TIE-Bus con 0=NA 1=open 2=closed 3=fault
				ContactorStatus(11, result.MGP.ParamVal);
				break;
			case 	120 	:
				//generator timer seconds
				window.Power_chart1.gentimer_sec = result.MGP.ParamVal;
				generator_timer();
				break;
			case 	121 	:
				//generaor timer minutes
				window.Power_chart1.gentimer_minut = result.MGP.ParamVal;
				generator_timer();
				break;
			case 	122 	:
				//generaor timer minutes
				document.getElementById("table_1").rows[2].cells[6].innerHTML = result.MGP.ParamVal * 1 + " kW";
				break;
			case 	123 	:
				//generaor timer minutes
				document.getElementById("table_1").rows[3].cells[6].innerHTML = result.MGP.ParamVal * 1 + " kW";
				break;
			case 	124 	:
				//generaor timer minutes
				document.getElementById("table_1").rows[4].cells[6].innerHTML = result.MGP.ParamVal * 1 + " kW";
				break;
			case 	125 	:
				//generaor timer minutes
				document.getElementById("Mode_status").innerHTML = result.MGP.ParamVal;
				if (result.MGP.ParamVal == 0) {
					document.getElementById("Mode_status").innerHTML = "PMM Mode: NA"
				}
				if (result.MGP.ParamVal == 1) {
					document.getElementById("Mode_status").innerHTML = "PMM Mode: Off"
				}
				if (result.MGP.ParamVal == 2) {
					document.getElementById("Mode_status").innerHTML = "PMM Mode: Bypass"
				}
				if (result.MGP.ParamVal == 3) {
					document.getElementById("Mode_status").innerHTML = "PMM Mode: Auto"
				}

			//data for the evse
			case 1:
				document.getElementById("batterydailychargeenergy").innerHTML = result.MGP.ParamVal;
				break;

				break;

			} /* end of switch case statement */

		} catch (Exception) {
			console.log(Exception.message);
		}

	};
	/* end of got parameter value response function */

	//second call

	// function sendrequestparametervalues2 ()
	// {
	//     request = {WPUSHG:{WPUSHGID:"PortsData2",Maxrate:50,Minrate:5000}};
	//     send(ws, request, var_callbackgotresponse1);
	//     console.log("group parameter push request sent");/* TODO, turn off for development only*/
	// }
	//
	// var timestampHistory1;
	// var commcounter1=0;
	// var timesub1;
	// var var_callbackgotresponse1 = function callbackgotresponse (result) {
	//     console.log("call back reached");/* TODO, turn off for development only*/
	//     console.log(result);/* TODO, turn off for development only*/
	//     timesub1= result.MGP.Timestamp.substr(0,18);
	//     if(timestampHistory1 == timesub1){
	//         commcounter1=1 + commcounter1;
	//     }
	//     else
	//     {
	//         timestampHistory1 = result.MGP.Timestamp.substr(0,18);//"2016-06-21 15:26:30:181108"
	//         commcounter1=0;
	//     }
	//     if(commcounter1 > 100){
	//         result.MGP.ParamVal=0;
	//
	//     }
	//
	//     // handle the display for the state of the image, based on the state reported by the system master controller //
	//     try {
	//         switch(result.MGP.MGPID)
	//         {
	//
	//             //output ports priority
	//
	//
	//
	//         } /* end of switch case statement */
	//
	//     } catch (Exception)
	//
	//     {
	//         console.log(Exception.message);
	//     }
	//
	// }; /* end of got parameter value response function */

});
/* end of main function */

var Power_chart1 = {
	Port1P : 0,
	Port2P : 0,
	Port3P : 0,
	Port4P : 0,
	Port5P : 0,
	Port6P : 0,
	Port7P : 0,
	Port8P : 0,
	Port9P : 0,
	Port10P : 0,
	TIECon : 0,
	Con2Status : 0,
	gentimer_sec : 0,
	gentimer_minut : 0,
	TotalOutputPower : 0
};

// Function returns the product of a and b
function MGP_Parmval(MGPvalue) {
	var string1;
	switch(MGPvalue) {
	case "0":
		string1 = "OFF";
		break;
	case "1":
		string1 = "LOW";
		break;
	case "2":
		string1 = "Medium";
		break;
	case "3":
		string1 = "HIGH";
		break;
	case "4":
		string1 = "ON";
		break;
	}
	return string1;
}

function PortPowerpercent() {
	document.getElementById("port1pp").value = window.Power_chart1.Port1P;
	document.getElementById("port1pa").innerHTML = Math.round((window.Power_chart1.Port1P / 60) * 100) + "% of 60kW";
	//( Math.round(result.MGP.ParamVal /700))
	document.getElementById("port2pp").value = window.Power_chart1.Port2P;
	document.getElementById("port2pa").innerHTML = Math.round((window.Power_chart1.Port2P / 60) * 100) + "% of 60kW";
	document.getElementById("port3pp").value = window.Power_chart1.Port3P;
	document.getElementById("port3pa").innerHTML = Math.round((window.Power_chart1.Port3P / 60) * 100) + "% of 60kW";
	document.getElementById("port4p").value = window.Power_chart1.Port4P;
	document.getElementById("port4pa").innerHTML = Math.round((window.Power_chart1.Port4P / 60) * 100) + "% of 60kW";
	document.getElementById("port5p").value = window.Power_chart1.Port5P;
	document.getElementById("port5pa").innerHTML = Math.round((window.Power_chart1.Port5P / 30) * 100) + "% of 30kW";
	document.getElementById("port6p").value = window.Power_chart1.Port6P;
	document.getElementById("port6pa").innerHTML = Math.round((window.Power_chart1.Port6P / 30) * 100) + "% of 30kW";
	document.getElementById("port7p").value = window.Power_chart1.Port7P;
	document.getElementById("port7pa").innerHTML = Math.round((window.Power_chart1.Port7P / 20) * 100) + "% of 20kW";
	document.getElementById("port8p").value = window.Power_chart1.Port8P;
	document.getElementById("port8pa").innerHTML = Math.round((window.Power_chart1.Port8P / 30) * 100) + "% of 30kW";
	document.getElementById("port9p").value = window.Power_chart1.Port9P;
	document.getElementById("port9pa").innerHTML = Math.round((window.Power_chart1.Port9P / 20) * 100) + "% of 20kW";
	document.getElementById("port10p").value = window.Power_chart1.Port10P;
	document.getElementById("port10pa").innerHTML = Math.round((window.Power_chart1.Port10P / 20) * 100) + "% of 20kW";
	// total_output_power
	document.getElementById("total_output_power").innerHTML = "Total Output Power: " + ((window.Power_chart1.Port4P + window.Power_chart1.Port5P + window.Power_chart1.Port6P + window.Power_chart1.Port7P + window.Power_chart1.Port8P + window.Power_chart1.Port9P + window.Power_chart1.Port10P)).toFixed(2) + " kW";
	window.Power_chart1.TotalOutputPower = ((window.Power_chart1.Port4P + window.Power_chart1.Port5P + window.Power_chart1.Port6P + window.Power_chart1.Port7P + window.Power_chart1.Port8P + window.Power_chart1.Port9P + window.Power_chart1.Port10P)).toFixed(2);
}

function ContactorStatus(ConNum, ConStatus) {
	//input ports color
	if (ConNum <= 3) {
		var jloop = 0;
		while (jloop < 5) {
			//change color of table cel
			switch(ConStatus) {//0=NA 1=open 2=closed 3=fault
			case "0":
				document.getElementById("table_1").rows[1+ConNum].cells[1 + jloop].className = "w3-white";
				break;
			case "1":
				document.getElementById("table_1").rows[1+ConNum].cells[1 + jloop].className = "w3-grey";
				break;
			case "2":
				document.getElementById("table_1").rows[1+ConNum].cells[1 + jloop].className = "w3-white";
				break;
			case "3":
				document.getElementById("table_1").rows[1+ConNum].cells[1 + jloop].className = "w3-red";
				break;
			}
			jloop++;
		}
	}

	// if contactor 13 is closed and primary bus is connected to secodnay
	if (ConNum == 11) {
		if (ConStatus == "2") {
			window.Power_chart1.TIECon = 1;
			/// is closed
			document.getElementById("table_2").rows[6].cells[0].className = "w3-blue";
			document.getElementById("table_2").rows[6].cells[1].className = "w3-white";
			document.getElementById("table_2").rows[6].cells[2].className = "w3-white";
			document.getElementById("table_2").rows[6].cells[3].className = "w3-white";
			document.getElementById("table_2").rows[6].cells[4].className = "w3-white";
			document.getElementById("table_2").rows[6].cells[5].className = "w3-white";
			document.getElementById("table_2").rows[6].cells[6].className = "w3-white";
			document.getElementById("table_2").rows[6].style = "display:none;";
		} else {
			window.Power_chart1.TIECon = 0;
			// is open
			document.getElementById("table_2").rows[6].cells[0].className = "w3-black";
			document.getElementById("table_2").rows[6].cells[1].className = "w3-black";
			document.getElementById("table_2").rows[6].cells[2].className = "w3-black";
			document.getElementById("table_2").rows[6].cells[3].className = "w3-black";
			document.getElementById("table_2").rows[6].cells[4].className = "w3-black";
			document.getElementById("table_2").rows[6].cells[5].className = "w3-black";
			document.getElementById("table_2").rows[6].cells[6].className = "w3-black";
			document.getElementById("table_2").rows[6].style = "display: table-row;";
		}
	}
	if (ConNum == 2) {
		if (ConStatus == "2") {
			window.Power_chart1.Con2Status = 1;
		} else {
			window.Power_chart1.Con2Status = 0;
		}
	}
	/// if contactor 13 is closed, make them same color
	var
	colorClosed;
	if (window.Power_chart1.TIECon == 0 && ConNum >= 8) {
		colorClosed = "w3-white";
	} else if (window.Power_chart1.TIECon == 1 && window.Power_chart1.Con2Status == 1) {//tie is closed and con 2 closed
		colorClosed = "w3-white";
	} else {
		colorClosed = "w3-white";
	}

	// table 2 have empty row after port 7
	var rownumAdjust = 0;
	if (ConNum >= 8) {
		rownumAdjust = -1;
	}
	if (ConNum >= 4 && ConNum <= 7) {
		rownumAdjust = -2;
	}
	// output ports color
	if (ConNum >= 4 && ConNum <= 10) {
		var jloop = 0;
		while (jloop < 6) {
			//change color of table cel
			switch (ConStatus) {//0=NA 1=open 2=closed 3=fault
			case "0":
				document.getElementById("table_2").rows[rownumAdjust + ConNum].cells[1 + jloop].className = "w3-white";
				break;
			case "1":
				document.getElementById("table_2").rows[rownumAdjust + ConNum].cells[1 + jloop].className = "w3-grey";
				break;
			case "2":
				document.getElementById("table_2").rows[rownumAdjust + ConNum].cells[1 + jloop].className = colorClosed;
				break;
			case "3":
				document.getElementById("table_2").rows[rownumAdjust + ConNum].cells[1 + jloop].className = "w3-red";
				break;
			}

			jloop++;
		}
	}

}

function generator_timer() {
	// function pad(n) {
	//     return (n < 10) ? ("0" + n) : n;
	// }
	document.getElementById("gen_timer").innerHTML = "Reset Timer: " + window.Power_chart1.gentimer_minut + ":" + ((window.Power_chart1.gentimer_sec < 10) ? ("0" + window.Power_chart1.gentimer_sec) : window.Power_chart1.gentimer_sec);

}