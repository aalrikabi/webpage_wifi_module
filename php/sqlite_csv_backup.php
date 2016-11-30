<?php
// Set headers to make the browser download the results as a csv file
$today = date('mdY_Hm');
$filename = 'AllPorts_' . $today . '.csv';
header("Content-type: text/csv");
header("Content-Disposition: attachment; filename=\"" . basename($filename) . "\"");
header("Pragma: no-cache");
header("Expires: 0");
//phpinfo();
// Connect to DB
$conn = new PDO('sqlite:/var/www/Database/logDB');

// Query WHERE name like '%Port 1%' and datetime > '2016-06-03 18:55:27'
$query = $conn->query("SELECT datetime,name,value FROM log  WHERE datetime > '2016-06-09 1:55:27' ");
//$row = "this is a test"
// Fetch the first row
$row = $query->fetch(PDO::FETCH_ASSOC);

// If no results are found, echo a message and stop
if ($row == false){
    echo "No results";
    exit;
}
// Print the titles using the first line
print_titles($row);

// Iterate over the results and print each one in a line
while ($row != false)
{
    // check if the value is more than 32767, than subtract 65536 from the value
    if($row['value'] > 32767)
    {
        $negative = $row['value'] - 655357;
        if ($negativeNum > 32767)
        {
            $row['value']= $row['value'] * 0;
        }
        if ($negativeNum < 32767) {
            $row['value']=$row['value'] - 655357;
        }
    }
    // Print the line
    echo implode(array_values($row), ",") . "\n";
    // Fetch the next line
    $row = $query->fetch(PDO::FETCH_ASSOC);
}

// Prints the column names
function print_titles($row){
    echo "Power Management Module" ."\n";
    echo "PMM" ."\n";
    //  echo $Bytes . "\n";
    $Bytes = disk_total_space("/");
    echo dataSize($Bytes) . "\n";
    echo dataSize() . "\n";
    //  $disk_used = foldersize("./");
    //echo $disk_used . "MB \n";

    //  $f = './';
    $f ='./';
    // $io = popen ( '/usr/bin/du -m /mnt ' . $f, 'r' );
    $size = fgets ( $io, 4096);
    $size = substr ( $size, 0, strpos ( $size, "\t" ) );
    pclose ( $io );
    echo 'Directory: ' . $f . ' => Size: ' . $size . "MB \n";

    $df = disk_free_space("/mnt");
    echo $df ."***mb \n";


    $uptime = exec("uptime");

    $parts = split("load average:", $uptime);

    $load = split(", ", $parts[1]);

    echo "Current load: " . $load[0] ."\n";

    echo implode(array_keys($row), ",") . "\n";
}


//  /This is  a more readable way of viewing the returned float

// $Bytes contains the total number of bytes on "/"


function dataSize($Bytes)
{
    $Type=array("", "kilo", "mega", "giga", "tera");
    $counter=0;
    while($Bytes>=1024)
    {
        $Bytes/=1024;
        $counter++;
    }
    return("".$Bytes." ".$Type[$counter]."bytes");
}


?>