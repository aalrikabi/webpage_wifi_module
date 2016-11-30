<?php
// Set headers to make the browser download the results as a csv file
date_default_timezone_set('UTC'); //seting the default timezone
$today = date('mdY_Hm');
$filename = 'Port2_' . $today . '.csv';
header("Content-type: text/csv");
header("Content-Disposition: attachment; filename=\"" . basename($filename) . "\"");
header("Pragma: no-cache");
header("Expires: 0");
ini_set('max_execution_time', 300); //300 seconds = 5 minutes,, extend the timout for php script
//phpinfo();
// Connect to DB
$conn = new PDO('sqlite:/var/www/Database/logDB');

// Query WHERE name like '%Port 1%' and datetime > '2016-06-03 18:55:27'
$query = $conn->query("SELECT datetime,name,value FROM log   WHERE name like '%Port 2 %' ");
//$row = "this is a test"
// Fetch the first row
$row = $query->fetch(PDO::FETCH_ASSOC);

// If no results are found, echo a message and stop
if ($row == false){
    echo "No results";
    exit;
}
// Print the titles using the first line
//print_titles($row);

$portfreqenable=0;
$datetimetest =0;

$array1= array( 'Port 2 Frequency' , 'Port 2 Voltage Average' , 'Port 2 Voltage Line Average' , 'Port 2 Current Average' , 'Port 2 Power Total' , 'Port 2 Reactive Power Total' , 'Port 2 Apparent Power Total' , 'Port 2 Power Facto Total' , 'Port 2 Energy Total' , 'Port 2 Energy Net');
$array2= array_fill(0,11,0);

// print column header
$ide=0;
echo "Time,";
while ($ide<11):
    echo $array1[$ide] . "," ;
    $ide++;
endwhile;
echo "\n";

while ($row != false) {
    // check if the value is more than 32767, than subtract 65536 from the value
    if($row['value'] > 327680) {
        $row['value'] = $row['value'] - 655360;
    }
    $i=0;
    while ($i<11):
        if($array1[$i]== $row['name']){
            $array2[$i]= $row['value'];
            $portfreqenable=1;
            break;
        }
        //  echo "  while loop i:" . $i . "  array1:". $array1[$i] . "  rowName: " . $row['name'] .  "  array2:" . $array2[$i] . "  " ;
        $i++;
    endwhile;

    if( strpos($row['datetime'], $datetimetest ) !== false) { //test if rowdatetime contain $datetimetest

    }
    else{ //when date are diffrent =start writing to csv the saved values in array2
        if ($portfreqenable == 1){
            echo $datetimetest . ",";
            $dia=0;
            while ($dia<11):
                echo  $array2[$dia]  . ",";
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
        $datetimetest = substr($row['datetime'], -19,16); ///subtract part of the date and compare only date with hour and minitues NO seconds
    }
    // Fetch the next line
    $row = $query->fetch(PDO::FETCH_ASSOC);
}
echo "\n" . "uploaded successfully";

// Prints the column names
function print_titles($row){
    echo implode(array_keys($row), ",") . "\n";
}

//var_dump($row)
?>