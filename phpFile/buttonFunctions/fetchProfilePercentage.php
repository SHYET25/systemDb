<?php
session_start();
include '../connection/connection.php';

// Check if a session variable with athlete email is set
if (isset($_SESSION['ath_email'])) {
    $athleteEmail = $_SESSION['ath_email'];

    // Prepare and execute SQL query to fetch AthleteID based on email
    $stmt = $conn->prepare("SELECT AthleteID FROM athlete_info WHERE ath_email = ?");
    $stmt->bind_param("s", $athleteEmail); // Assuming athlete email is a string
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if any rows were returned
    if ($result->num_rows > 0) {
        // Fetch athlete ID
        $athleteData = $result->fetch_assoc();
        $athleteId = $athleteData['AthleteID'];

        // Prepare and execute SQL query to fetch athlete percentage data
        $stmt = $conn->prepare("SELECT * FROM basketball_athlete_percentage WHERE ath_id = ?");
        $stmt->bind_param("i", $athleteId); // Bind athlete ID
        $stmt->execute();
        $result = $stmt->get_result();

        // Check if any rows were returned
        if ($result->num_rows > 0) {
            // Fetch athlete percentage data (assuming single result)
            $athletePercentage = $result->fetch_assoc();

            // Output data as JSON
            echo json_encode(['status' => 'success', 'data' => $athletePercentage]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No results found for athlete ID: ' . $athleteId]);
        }

        // Close statement and connection
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No athlete found with email: ' . $athleteEmail]);
    }

    // Close connection
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Athlete email not found in session.']);
}
?>
