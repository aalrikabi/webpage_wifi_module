<?php
// Set headers to make the browser download the results as a csv file
$today = date('mdY_Hm');
$filename = 'Port2_' . $today . '.csv';
header("Content-type: text/csv");
 header("Content-Disposition: attachment; filename=\"" . basename($filename) . "\"");
header("Pragma: no-cache");
header("Expires: 0");
//phpinfo();
// Connect to DB
$conn = new PDO('sqlite:/var/www/Database/logDB');

// Query WHERE name like '%Port 1%' and datetime > '2016-06-03 18:55:27'
$query = $conn->query("SELECT datetime,name,value FROM log  WHERE name like '%Port 2 %' ");
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
while ($row != false) {
  // check if the value is more than 32767, than subtract 65536 from the value
  if($row['value'] > 32767 )
   {
     $row['value']= $row['value'] - 65536;
   }
    // Print the line
  echo implode(array_values($row), ",") . "\n";
    // Fetch the next line
  $row = $query->fetch(PDO::FETCH_ASSOC);
}

// Prints the column names
function print_titles($row){
    echo implode(array_keys($row), ",") . "\n";
}
?>
