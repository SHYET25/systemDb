<?php
include '../connection/connection.php';

// Function to update team status based on athlete rankings
function updateTeamStatus($conn) {
    $sql = "SELECT ai.AthleteID, bap.total_percentage
            FROM basketball_athlete_percentage bap
            JOIN athlete_info ai ON bap.ath_id = ai.AthleteID
            ORDER BY bap.total_percentage DESC";
    
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $athletes = array();
        while ($row = $result->fetch_assoc()) {
            $athletes[] = $row;
        }

        // Determine team status based on ranking
        foreach ($athletes as $key => $athlete) {
            $ath_id = $athlete['AthleteID'];
            $team_status = '';

            if ($key < 6) {
                $team_status = 'MAIN 6';
            } elseif ($key >= 6 && $key < 12) {
                $team_status = 'BENCH';
            } elseif ($key >= 12 && $key < 18) {
                $team_status = 'BACK UPS';
            }

            // Update athlete's team status in the database
            $updateSql = "UPDATE basketball_team_main SET ath_team = '$team_status' WHERE ath_id = $ath_id";
            $updateResult = $conn->query($updateSql);

            if (!$updateResult) {
                return ['status' => 'error', 'message' => 'Failed to update team status'];
            }
        }

        return ['status' => 'success'];
    } else {
        return ['status' => 'error', 'message' => 'No athletes found'];
    }
}

// Check if request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Call function to update team status
    $updateStatus = updateTeamStatus($conn);

    // Respond with JSON based on update status
    echo json_encode($updateStatus);
} else {
    // Handle invalid request method
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

$conn->close();
?>
