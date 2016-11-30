<?php
// Set headers to make the browser download the results as a csv file
date_default_timezone_set('UTC'); //seting the default timezone
$today = date('mdY_Hm');
$filename = 'AllPorts_' . $today . '.csv';
header("Content-type: text/csv");
header("Content-Disposition: attachment; filename=\"" . basename($filename) . "\"");
header("Pragma: no-cache");
header("Expires: 0");
ini_set('max_execution_time', 300); //300 seconds = 5 minutes
//phpinfo();
// Connect to DB
$conn = new PDO('sqlite:/var/www/Database/logDB');

// Query WHERE name like '%Port 1%' and datetime > '2016-06-03 18:55:27'
$query = $conn->query("SELECT datetime,name,value FROM log  WHERE datetime >= '2016-06-15' ");
//$row = "this is a test"
// Fetch the first row
$row = $query->fetch(PDO::FETCH_ASSOC);
echo " row[value]  - 655360";
// If no results are found, echo a message and stop
if ($row == false){
    echo "No results";
    exit;
}
// Print the titles using the first line
//print_titles($row);

$portfreqenable=0;
$datetimetest =0;
//$array1= array('Port 1 Frequency','Port 2 Frequency','Port 3 Frequency','Port 4 Frequency','Port 5 Frequency','Port 6 Frequency','Port 7 Frequency','Port 8 Frequency','Port 9 Frequency','Port 10 Frequency');
$array1= array( 'Port 1 Frequency' , 'Port 1 Voltage Average' , 'Port 1 Voltage Line Average' , 'Port 1 Current Average' , 'Port 1 Power Total' , 'Port 1 Reactive Power Total' , 'Port 1 Apparent Power Total' , 'Port 1 Power Facto Total' , 'Port 1 Energy Total' , 'Port 1 Energy Net' ,
                'Port 2 Frequency' , 'Port 2 Voltage Average' , 'Port 2 Voltage Line Average' , 'Port 2 Current Average' , 'Port 2 Power Total' , 'Port 2 Reactive Power Total' , 'Port 2 Apparent Power Total' , 'Port 2 Power Facto Total' , 'Port 2 Energy Total' , 'Port 2 Energy Net' ,
                'Port 3 Frequency' , 'Port 3 Voltage Average' , 'Port 3 Voltage Line Average' , 'Port 3 Current Average' , 'Port 3 Power Total' , 'Port 3 Reactive Power Total' , 'Port 3 Apparent Power Total' , 'Port 3 Power Facto Total' , 'Port 3 Energy Total' , 'Port 3 Energy Net' ,
                'Port 4 Frequency' , 'Port 4 Voltage Average' , 'Port 4 Voltage Line Average' , 'Port 4 Current Average' , 'Port 4 Power Total' , 'Port 4 Reactive Power Total' , 'Port 4 Apparent Power Total' , 'Port 4 Power Facto Total' , 'Port 4 Energy Total' , 'Port 4 Energy Net' ,
                'Port 5 Frequency' , 'Port 5 Voltage Average' , 'Port 5 Voltage Line Average' , 'Port 5 Current Average' , 'Port 5 Power Total' , 'Port 5 Reactive Power Total' , 'Port 5 Apparent Power Total' , 'Port 5 Power Facto Total' , 'Port 5 Energy Total' , 'Port 5 Energy Net' ,
                'Port 6 Frequency' , 'Port 6 Voltage Average' , 'Port 6 Voltage Line Average' , 'Port 6 Current Average' , 'Port 6 Power Total' , 'Port 6 Reactive Power Total' , 'Port 6 Apparent Power Total' , 'Port 6 Power Facto Total' , 'Port 6 Energy Total' , 'Port 6 Energy Net' ,
                'Port 7 Frequency' , 'Port 7 Voltage Average' , 'Port 7 Voltage Line Average' , 'Port 7 Current Average' , 'Port 7 Power Total' , 'Port 7 Reactive Power Total' , 'Port 7 Apparent Power Total' , 'Port 7 Power Facto Total' , 'Port 7 Energy Total' , 'Port 7 Energy Net' ,
                'Port 8 Frequency' , 'Port 8 Voltage Average' , 'Port 8 Voltage Line Average' , 'Port 8 Current Average' , 'Port 8 Power Total' , 'Port 8 Reactive Power Total' , 'Port 8 Apparent Power Total' , 'Port 8 Power Facto Total' , 'Port 8 Energy Total' , 'Port 8 Energy Net' ,
                'Port 9 Frequency' , 'Port 9 Voltage Average' , 'Port 9 Voltage Line Average' , 'Port 9 Current Average' , 'Port 9 Power Total' , 'Port 9 Reactive Power Total' , 'Port 9 Apparent Power Total' , 'Port 9 Power Facto Total' , 'Port 9 Energy Total' , 'Port 9 Energy Net' ,
                'Port 10 Frequency' , 'Port 10 Voltage Average' , 'Port 10 Voltage Line Average' , 'Port 10 Current Average' , 'Port 10 Power Total' , 'Port 10 Reactive Power Total' , 'Port 10 Apparent Power Total' , 'Port 10 Power Facto Total' , 'Port 10 Energy Total' , 'Port 10 Energy Net',
    'P4_Priority','P5_Priority','P6_Priority','P7_Priority','P8_Priority','P9_Priority','P10_Priority',
    'P1_CONStatus','P2_CONStatus','P3_CONStatus','P4_CONStatus','P5_CONStatus','P6_CONStatus','P7_CONStatus','P8_CONStatus','P9_CONStatus','P10_CONStatus','TIE_CONStatus' );


$array2= array_fill(0,119,0);

// print column header
$ide=0;
echo "Time,";
while ($ide<119):
    echo $array1[$ide] . "," ;
    $ide++;
endwhile;
echo "\n";


while ($row != false) {
    // check if the value is more than 32767, than subtract 65536 from the value
    if($row['value'] > 327680)
    {
        $row['value'] = $row['value'] - 655360;
//        if ($negative > 32767)
//        {
//            $row['value']= $row['value'] * 0;
//        }
//        if ($negative < 32767) {
//            $row['value']=$row['value'] - 655357;
//        }
    }

    $i=0;
    while ($i<119):
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
            while ($dia<119):
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
