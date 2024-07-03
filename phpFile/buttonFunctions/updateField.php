<?php
include '../connection/connection.php';

if (isset($_POST['ath_id'], $_POST['field'], $_POST['value'])) {
    $athId = $_POST['ath_id'];
    $fieldName = $_POST['field'];
    $newValue = $_POST['value'];

    // Validate and sanitize inputs if necessary

    // Update the specified field
    $stmt = null;
    switch ($fieldName) {
        case 'height':
            $stmt = $conn->prepare("UPDATE `admin_info` SET `ath_height` = ? WHERE `AthleteID` = ?");
            break;
        case 'weight':
            $stmt = $conn->prepare("UPDATE `admin_info` SET `ath_weight` = ? WHERE `AthleteID` = ?");
            break;
        case 'age':
            $stmt = $conn->prepare("UPDATE `admin_info` SET `ath_age` = ? WHERE `AthleteID` = ?");
            break;
        default:
            echo json_encode(['status' => 'error', 'message' => 'Invalid field name']);
            exit();
    }

    // Bind parameters and execute update
    $stmt->bind_param("si", $newValue, $athId);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update field']);
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid parameters']);
}
$conn->close();
?>
