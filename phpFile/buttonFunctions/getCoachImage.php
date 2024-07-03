<?php
session_start();
include '../connection/connection.php';

// Check if user is logged in
if (isset($_SESSION['ath_email'])) {
    $userEmail = $_SESSION['ath_email'];

    // Handle profile image upload
    if (isset($_FILES['profileImage']) && !empty($_FILES['profileImage']['name'])) {
        $targetDir = "../../images/prof_pics/";
        $imageFileType = strtolower(pathinfo($_FILES["profileImage"]["name"], PATHINFO_EXTENSION));
        $uniqueImageName = uniqid() . '.' . $imageFileType;
        $targetFile = $targetDir . $uniqueImageName;

        // Check if the file is a valid image
        $check = getimagesize($_FILES["profileImage"]["tmp_name"]);
        if ($check !== false) {
            // Check file size (500KB limit)
            if ($_FILES["profileImage"]["size"] > 500000) {
                echo json_encode(['error' => 'Sorry, your file is too large.']);
                exit();
            }

            // Move uploaded file to target directory
            if (move_uploaded_file($_FILES["profileImage"]["tmp_name"], $targetFile)) {
                // Update database with new profile image path
                $updateStmt = $conn->prepare("UPDATE athlete_info SET ath_img = ? WHERE ath_email = ?");
                $updateStmt->bind_param("ss", $uniqueImageName, $userEmail);
                if ($updateStmt->execute()) {
                    echo json_encode(['success' => true, 'image' => $uniqueImageName]);
                    exit();
                } else {
                    echo json_encode(['error' => 'Database error updating profile image']);
                    exit();
                }
            } else {
                echo json_encode(['error' => 'Failed to move uploaded file']);
                exit();
            }
        } else {
            echo json_encode(['error' => 'File is not an image']);
            exit();
        }
    } else {
        echo json_encode(['error' => 'No image file received']);
        exit();
    }
} else {
    echo json_encode(['error' => 'User not logged in']);
    exit();
}
?>
