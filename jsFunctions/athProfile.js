$(document).ready(function() {
    // Make an AJAX request to fetch the logged-in user data
    $.ajax({
        type: "GET",
        url: "phpFile/buttonFunctions/fetchLoggedIn.php",
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                console.log('Logged-in user type:', response.userType);
                console.log('Logged-in user data:', response.loggedInUserData);

                $('#name').text(response.loggedInUserData.ath_name);
                $('#username').text('@' + response.loggedInUserData.ath_user);
                $('#name1').text(response.loggedInUserData.ath_name);
                $('#username1').text('@' + response.loggedInUserData.ath_user);
            } else {

                alert(response.message);
                window.location.href = 'login.html';
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', error);
        }
    });


    // Example AJAX request in JavaScript

        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchProfilePercentage.php",  // Replace with your PHP file path
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    // Data retrieval successful, process the data
                    const athlete = response.data;
                    console.log('Received data:', athlete);
    
                    // Construct HTML card for the athlete
                    const cardHtml = `
                    
                                    <div class="progress mb-2" style = "height: 1.5rem;">
                                        <div class="progress-bar bg-success" role="progressbar" style="width: ${athlete.total_percentage}%" aria-valuenow="${athlete.total_percentage}" aria-valuemin="0" aria-valuemax="100">Overall: ${athlete.total_percentage}</div>
                                    </div>
                                    <div class="progress mb-2" style = "height: 1.5rem;>
                                        <div class="progress-bar bg-primary" role="progressbar" style="width: ${athlete.shooting}%" aria-valuenow="${athlete.shooting}" aria-valuemin="0" aria-valuemax="100">Shooting: ${athlete.shooting}</div>
                                    </div>
                                    <div class="progress mb-2" style = "height: 1.5rem;>
                                        <div class="progress-bar bg-info" role="progressbar" style="width: ${athlete.passing}%" aria-valuenow="${athlete.passing}" aria-valuemin="0" aria-valuemax="100">Passing: ${athlete.passing}</div>
                                    </div>
                                    <div class="progress mb-2" style = "height: 1.5rem;>
                                        <div class="progress-bar bg-warning" role="progressbar" style="width: ${athlete.rebounding}%" aria-valuenow="${athlete.rebounding}" aria-valuemin="0" aria-valuemax="100">Rebounding: ${athlete.rebounding}</div>
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar bg-danger" role="progressbar" style="width: ${athlete.defending}%" aria-valuenow="${athlete.defending}" aria-valuemin="0" aria-valuemax="100">Defending: ${athlete.defending}</div>
                                  
                    `;
    
                    // Append the card HTML to the container
                    $('#athleteTableBody').html(cardHtml);
                } else {
                    // Error handling if status is not success
                    console.error('Error:', response.message);
                }
            },
            error: function(xhr, status, error) {
                // Error handling for AJAX request
                console.error('AJAX Error:', error);
            }
        });

    


});