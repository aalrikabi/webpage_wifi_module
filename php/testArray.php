<html>
<body>
Welcome <?php
// Set headers to make the browser download the results as a csv file
date_default_timezone_set('UTC'); //seting the default timezone
$today = date('mdY_Hm');
$filename = 'AllPorts_' . $today . '.csv';
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
$array1= array( 'Port 1 Power Total' );

// initalizes the array and set the values to zero
$array2= array_fill(0,1000000,0);

// print column header
$ide=0;
echo "Time,";
while ($ide<119):
    echo $array1[$ide] . "," ;
    $ide++;
endwhile;
echo "\n";


    $i=0;
while ($row != false) {
    // check if the value is more than 32767, than subtract 65536 from the value
    if($row['value'] > 327680)
    {
        $row['value'] = $row['value'] - 655360;
    }

    //if the name of the verialable is same as array1, then write the value in array2[i] location
    if($array1[0]== $row['name']){
            $array2[$i]= $row['value'];
            $portfreqenable=1;
        $i++;
    }

    
    // Fetch the next line
    $row = $query->fetch(PDO::FETCH_ASSOC);
}

$num2=0;
while ( $num2 < 1000000){
	if ($array2[$num2] != 0) {
	echo $array2[$num2] . "\n"	;
	
	}
	
	$num2++;
}


echo "\n" . "uploaded successfully";

// Prints the column names
function print_titles($row){
    echo implode(array_keys($row), ",") . "\n";
}

//var_dump($row)
?>.<br />
</body>
</html>





<?php
$test = 'hello world!';
?>
<html>
<head></head>
<body>
<script>var test = '<?php echo $test; ?>';</script>
<script src="external.js"></script>
</body>
</html>