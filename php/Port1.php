<?php
// Set headers to make the browser download the results as a csv file
date_default_timezone_set('UTC'); //seting the default timezone
$today = date('mdY_Hm'); // put month day year hours and minutes inside today variable
$filename = 'Port1_' . $today . '.csv'; // make the string for the filename
header("Content-type: text/csv"); // type of file, CSV
header("Content-Disposition: attachment; filename=\"" . basename($filename) . "\""); //file name to be downloaded and type
header("Pragma: no-cache");
header("Expires: 0");
ini_set('max_execution_time', 300); //300 seconds = 5 minutes,, extend the timout for php script
//phpinfo();
// Connect to DB
$conn = new PDO('sqlite:/var/www/Database/logDB'); //connecte to sqlite database

// Query WHERE name like '%Port 1%' and datetime > '2016-06-03 18:55:27'
$query = $conn->query("SELECT datetime,name,value FROM log   WHERE name like '%Port 1 %' "); //select from database
//$row = "this is a test"
// Fetch the first row
$row = $query->fetch(PDO::FETCH_ASSOC);

// If no results are found, echo a message and stop
if ($row == false){
    echo "No results";
    exit;
}

$portfreqenable=0;  // use this when match have been found
$datetimetest =0;  //use this to store time without the seconds
// initate the array1 varable with values to compare with database
$array1= array( 'Port 1 Frequency' , 'Port 1 Voltage Average' , 
    'Port 1 Voltage Line Average' , 'Port 1 Current Average' , 
    'Port 1 Power Total' , 'Port 1 Reactive Power Total' , 
    'Port 1 Apparent Power Total' , 'Port 1 Power Facto Total' , 
    'Port 1 Energy Total' , 'Port 1 Energy Net');
$array2= array_fill(0,11,0);  // array2 will have the values for the varables

// print column header
$ide=0;
echo "Time,";
while ($ide<11):
    echo $array1[$ide] . "," ;  //print the column name from array1
    $ide++;
endwhile;
echo "\n";

while ($row != false) {
    // check if the value is more than 327680, than subtract 655360 from the value
    if($row['value'] > 327680) {
        $row['value'] = $row['value'] - 655360;
    }
    $i=0;

    while ($i<11):
        if($array1[$i]== $row['name']){  //compare the record 'name' from database with array1 and loop
            $array2[$i]= $row['value'];
            $portfreqenable=1;  //match have been found;
            break;
        }
        //  echo "  while loop i:" . $i . "  array1:". $array1[$i] . "  rowName: " . $row['name'] .  "  array2:" . $array2[$i] . "  " ;
        $i++;
    endwhile;


    // this logic is used to compine all the varables with the same minute to be instered to the same column
    //i used this method becouase sometime the seconds are diffrent between record when they should be on the same column
    //the update rate in the configuration file is 1 minute
    if( strpos($row['datetime'], $datetimetest ) !== false) { //test if rowdatetime contain $datetimetest

    }
    else{ //when date are diffrent =start writing to csv the saved values in array2
        if ($portfreqenable == 1){
            echo $datetimetest . ",";  //insert time into the csv
            $dia=0;
            while ($dia<11):
                echo  $array2[$dia]  . ",";  //insert all the values inside array2 to the same csv row, insert coma at the end of each entry
                $dia++;
            endwhile;
            $portfreqenable=0;
            echo  "\n";
        }else
        {
            echo ""  . "\n";
            echo implode(array_values($row), ",");
        }
//        echo implode(array_keys($array2), ",");
        $datetimetest = substr($row['datetime'], -19,16); ///subtract part of the date and compare only date with hour and minitues NO seconds, for each row in csv
    }
    // Fetch the next line
    $row = $query->fetch(PDO::FETCH_ASSOC);// get new record from database
}
echo "\n" . "uploaded successfully";  //at the end of the csv file, show that the php script worked successfully, if this didnt show, there is problem with php

// Prints the column names
function print_titles($row){
    echo implode(array_keys($row), ",") . "\n";
}

//var_dump($row)
?>