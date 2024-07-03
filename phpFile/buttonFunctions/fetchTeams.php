<?php
// Database connection
include '../connection/connection.php';  // Ensure this includes your database connection script

// Prepare the SQL query to fetch distinct teams from both tables
$sql = "
    (SELECT DISTINCT ath_team FROM basketball_team_main)
    UNION
    (SELECT DISTINCT ath_team FROM basketball_teams)
";

$result = $conn->query($sql);

if ($result) {
    if ($result->num_rows > 0) {
        $teams = array();
        while ($row = $result->fetch_assoc()) {
            $teams[] = $row['ath_team'];
        }
        echo json_encode(array('status' => 'success', 'teams' => $teams));
    } else {
        echo json_encode(array('status' => 'error', 'message' => 'No teams found'));
    }
} else {
    echo json_encode(array('status' => 'error', 'message' => 'Query error: ' . $conn->error));
}

// Close database connection
$conn->close();
?>
