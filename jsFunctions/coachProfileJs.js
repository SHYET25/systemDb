$(document).ready(function() {
    var selectedAthletes = [];

    // Function to handle AJAX errors
    function handleAjaxError(xhr, status, error) {
        console.error('AJAX Error:', error);
    }

    // Fetch logged-in user data and update the UI
    function fetchLoggedInUserData() {
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchLoggedIn.php",
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    $('#name').text(response.loggedInUserData.coach_name);
                    $('#username').text('@' + response.loggedInUserData.coach_user);
                    $('#name1').text(response.loggedInUserData.coach_name);
                    $('#username1').text('@' + response.loggedInUserData.coach_user);

                } else {
                    alert(response.message);
                    window.location.href = 'login.html';
                }
            },
            error: handleAjaxError
        });
    }

    // Populate the team dropdown
    function populateDropdown() {
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchTeams.php",
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    const dropdown = $('#gameDropdown');
                    dropdown.empty();
                    dropdown.append('<option value="all">All</option>');
                    response.teams.forEach(function(team) {
                        dropdown.append(`<option value="${team}">${team}</option>`);
                    });
                } else {
                    console.error('Error fetching teams:', response.message);
                }
            },
            error: handleAjaxError
        });
    }

    // Fetch athlete data based on position and name filters
    function fetchAthletesData(position = 'All', name = '') {
        var gameNumber = $('#gameDropdown').val();
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchAthletes.php",
            data: { position: position, name: name, game_number: gameNumber },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    populateAthleteTable(response.data);
                } else {
                    console.error('Error:', response.message);
                }
            },
            error: handleAjaxError
        });
    }

    // Populate athlete table with data
    function populateAthleteTable(data) {
        var athleteTableBody = $('#athleteTableBody');
        athleteTableBody.empty();
        var athletesPerColumn = Math.ceil(data.length / 2);
        var column1 = $('<div class="col-md-6"></div>');
        var column2 = $('<div class="col-md-6"></div>');

        data.forEach(function(athlete, index) {
            var card = `<div class="card mb-3" style="max-width: 100%;">
                            <div class="row no-gutters">
                                <div class="col-md-4">
                                    <img src="${athlete.image_url}" class="card-img" alt="Athlete Image">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <p class="card-title h5">${athlete.ath_name}</p>
                                        <p class="card-text h6"><strong>Position:</strong> ${athlete.ath_position}</p>
                                        <p class="card-text h6"><strong>ID:</strong> ${athlete.AthleteID}</p>
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input athlete-checkbox" data-id="${athlete.AthleteID}" ${athlete.disabled ? 'disabled' : ''}>
                                            <label class="form-check-label">Select Athlete</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            var $card = $(card);
            if (index < athletesPerColumn) {
                column1.append($card);
            } else {
                column2.append($card);
            }
            if (athlete.disabled) {
                $card.addClass('disabled-card');
            }
        });
        athleteTableBody.append($('<div class="row"></div>').append(column1, column2));

        // Handle checkbox changes
        $('.athlete-checkbox').change(function() {
            var athleteId = $(this).data('id');
            var athleteName = $(this).closest('.card-body').find('.card-title').text();
            var athletePosition = $(this).closest('.card-body').find('.card-text strong:contains("Position")').next().text();

            if ($(this).prop('checked')) {
                selectedAthletes.push({ AthleteID: athleteId, ath_name: athleteName, ath_position: athletePosition });
            } else {
                selectedAthletes = selectedAthletes.filter(function(athlete) {
                    return athlete.AthleteID !== athleteId;
                });
            }
            updateSelectedAthletesDisplay();
        });
    }


    function fetchAthletesDataHome(position = 'All', name = '') {
        
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchAthletesHome.php",
            data: { position: position, name: name},
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    populateAthleteTableHome(response.data);
                } else {
                    console.error('Error:', response.message);
                }
            },
            error: handleAjaxError
        });
    }

    // Populate athlete table with data
    function populateAthleteTableHome(data) {
        var athleteTableBody = $('#athleteTableBodyHome');
        athleteTableBody.empty();
        var athletesPerColumn = Math.ceil(data.length / 2);
        var column1 = $('<div class="col-md-6"></div>');
        var column2 = $('<div class="col-md-6"></div>');

        data.forEach(function(athlete, index) {
            var card = `<div class="card mb-3" style="max-width: 100%;">
                            <div class="row no-gutters">
                                <div class="col-md-4">
                                    <img src="images/prof_pics/${athlete.ath_img}" class="card-img" alt="Athlete Image">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <p class="card-title h5">${athlete.ath_name}</p>
                                        <p class="card-text h6"><strong>Position:</strong> ${athlete.ath_position}</p>
                                        <p class="card-text h6"><strong>ID:</strong> ${athlete.AthleteID}</p>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>`;
            var $card = $(card);
            if (index < athletesPerColumn) {
                column1.append($card);
            } else {
                column2.append($card);
            }
            
        });
        athleteTableBody.append($('<div class="row"></div>').append(column1, column2));
    }
    


    // Update the display of selected athletes
    function updateSelectedAthletesDisplay() {
        var selectedAthletesList = $('#selectedAthletesList');
        selectedAthletesList.empty();

        selectedAthletes.forEach(function(athlete) {
            var athleteItem = `<div class="selected-athlete-item">
                                ${athlete.ath_name} (${athlete.ath_position})
                                <button type="button" class="btn btn-link btn-remove-athlete" data-id="${athlete.AthleteID}"><i class="bi bi-x-circle-fill"></i></button>
                               </div>`;
            selectedAthletesList.append(athleteItem);
        });

        $('.btn-remove-athlete').click(function() {
            var athleteId = $(this).data('id');
            selectedAthletes = selectedAthletes.filter(function(athlete) {
                return athlete.AthleteID !== athleteId;
            });
            updateSelectedAthletesDisplay();
            $('#athleteTableBody').find('input[data-id="' + athleteId + '"]').prop('checked', false);
        });
    }

    // Validate the selected team name
    function validateTeamName() {
        const teamName = $("#teamDropdown");
        const isValid = teamName.val().trim() !== '' && teamName.val().toLowerCase() !== 'all';
        teamName.toggleClass('is-invalid', !isValid);
        return isValid;
    }

    // Save game data for selected athletes
    function saveGameData() {
        var team = $('#teamDropdown').val();


        selectedAthletes.forEach(function(athlete) {
            var data = { ath_bball_player_id: athlete.AthleteID, game_team: team };

            $.ajax({
                type: "POST",
                url: "phpFile/buttonFunctions/saveGameData.php",
                data: data,
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'success') {
                        confirm('Game data saved for athlete: ' + athlete.ath_name);
                        selectedAthletes = [];
                        updateSelectedAthletesDisplay();
                        fetchAthletesData($('#positionFilter').val(), $('#searchBar').val());
                        
                        populateDropdown();
                    } else {
                        console.error('Error:', response.message);
                        alert(response.message);
                    }
                },
                error: handleAjaxError
            });
        });
    }

    // Event bindings
    $('#addGameButton').click(function() {
        fetchAthletesData();

        $('#gameModal').modal('show');
    });

    $('#closeModal').click(function() {
        $('#gameModal').modal('hide');
    });

    $('#positionFilter').change(function() {

        fetchAthletesData($('#positionFilter').val(), $('#searchBar').val());
    });

    $('#positionFilterHome').change(function() {

        fetchAthletesDataHome($('#positionFilterHome').val(), $('#searchBarHome').val());
    });

    $('#searchBar').on('input', function() {
        fetchAthletesData($('#positionFilter').val(), $(this).val());
    });

    $('#searchBarHome').on('input', function() {
        fetchAthletesDataHome($('#positionFilterHome').val(), $(this).val());

    });

    $('#gameDropdown').change(function() {
        document.getElementById('teamDropdown').value = this.value;
        fetchAthletesData($('#positionFilter').val(), $('#searchBar').val());
    });

    $('#saveGameButton').click(function() {
        if (validateTeamName()) {
            saveGameData();
        }
    });

    // Initial calls
    fetchLoggedInUserData();
    populateDropdown();
    fetchAthletesData();
    fetchAthletesDataHome();

    // ADD SCRIM TEAM------------------------------------------------------------------------------------------------------------
    
    $('#viewGameDataButton').click(function() {
        var gameNumber = $('#viewGameDropdown').val();
        var quarter = $('#quarterDropdown').val(); // Get selected quarter

        // Fetch teams dynamically based on gameNumber
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchTeam12.php",
            data: { game_number: gameNumber },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    var firstTeam = response.data.team_1;
                    var secondTeam = response.data.team_2;

                    // Show modal
                    $('#viewGameDataModal').modal('show');

                    // Populate match name dropdown
                    populateMatchNameDropdown();

                    // Fetch team data
                    fetchTeamData(gameNumber, firstTeam, secondTeam, quarter);
                    fetchTeamDatax(gameNumber, firstTeam, secondTeam);
                    
                    
                    fetchTeamQuarterTotal(gameNumber, firstTeam, secondTeam, quarter);
                    fetchFinalPoints(gameNumber, firstTeam, secondTeam);
                    

                } else {
                    console.error('Error fetching teams:', response.message);
                    alert('Create a Match First!');
                    // Handle error case if needed
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error fetching teams:', error);
                // Handle AJAX error
            }
        });
    });

    // Change handler for dropdowns
    $('#viewGameDropdown, #firstTeamDropdown, #secondTeamDropdown, #quarterDropdown').change(function() {
        var gameNumber = $('#viewGameDropdown').val();

        // Fetch teams dynamically based on gameNumber
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchTeam12.php",
            data: { game_number: gameNumber },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    var firstTeam = response.data.team_1;
                    var secondTeam = response.data.team_2;
                    var quarter = $('#quarterDropdown').val(); // Get selected quarter

                    fetchTeamDatax(gameNumber, firstTeam, secondTeam);
                    fetchTeamData(gameNumber, firstTeam, secondTeam, quarter);
                    
                    fetchAndUpdateTeamTotal(gameNumber, firstTeam, secondTeam);
                    
                    fetchTeamQuarterTotal(gameNumber, firstTeam, secondTeam, quarter);
                    fetchFinalPoints(gameNumber, firstTeam, secondTeam);

                } else {
                    console.error('Error fetching teams:', response.message);
                    // Handle error case if needed
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error fetching teams:', error);
                // Handle AJAX error
            }
        });
    });

    $(document).ready(function() {
        $('#finalizedGameButton').click(function() {
            var gameNumber = $('#viewGameDropdown').val();
    
            // Fetch teams dynamically based on gameNumber
            $.ajax({
                type: "GET",
                url: "phpFile/buttonFunctions/fetchTeam12.php",
                data: { game_number: gameNumber },
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'success') {
                        var firstTeam = response.data.team_1;
                        var secondTeam = response.data.team_2;
    
                        // Ask for confirmation before proceeding
                        var confirmFinalize = confirm('Do you want to finalize this game?');
                        if (confirmFinalize) {
                            
                            
                            fetchAthleteInfoTotalGame(gameNumber, firstTeam, secondTeam);
                            fetchAthleteInfoPercent(gameNumber, firstTeam, secondTeam);
                            fetchFinalizeGame(gameNumber, firstTeam, secondTeam);
                            updateTeamStatus(gameNumber, firstTeam, secondTeam);

                            setTimeout(function() {
                                window.location.reload();
                            }, 4000); // 3000 milliseconds = 3 seconds
                            
                            
                        } 

                        
                    } else {
                        console.error('Error fetching teams:', response.message);
                        // Handle error case if needed
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error fetching teams:', error);
                    // Handle AJAX error
                }
            });
        });
        
        function fetchFinalizeGame(gameNumber, firstTeam, secondTeam) {
            // Function to update the finalized data
            function updateFinalizedData(firstTeamData, secondTeamData) {
                // Log the first team's name and points

    
                // Determine match win and lose
                var matchWin, matchLose;
                if (firstTeamData.game_pts > secondTeamData.game_pts) {
                    matchWin = firstTeamData.game_team;
                    matchLose = secondTeamData.game_team;
                } else {
                    matchWin = secondTeamData.game_team;
                    matchLose = firstTeamData.game_team;
                }
    
                // Prepare data for the update
                var updateData = {
                    game_number: gameNumber,
                    first_team: firstTeamData.game_team,
                    first_team_score: firstTeamData.game_pts,
                    second_team: secondTeamData.game_team,
                    second_team_score: secondTeamData.game_pts,
                    match_win: matchWin,
                    match_lose: matchLose
                };
    
                // Send AJAX request to update the database
                $.ajax({
                    type: "POST",
                    url: "phpFile/buttonFunctions/updateMatchWin.php",
                    data: updateData,
                    dataType: 'json',
                    success: function(response) {
                        if (response.status === 'success') {

                        } else {
                            console.error('Error updating match result:', response.message);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('AJAX Error updating match result:', xhr.responseText);
                    }
                });
            }
    
            // Fetch data for the first team
            $.ajax({
                type: "GET",
                url: "phpFile/buttonFunctions/fetchFinalizedData.php",
                data: { game_number: gameNumber, team: firstTeam },
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'success') {
                        // Process the first team's data
                        var firstTeamData = response.data;
    
                        // Fetch data for the second team
                        $.ajax({
                            type: "GET",
                            url: "phpFile/buttonFunctions/fetchFinalizedData.php",
                            data: { game_number: gameNumber, team: secondTeam },
                            dataType: 'json',
                            success: function(response) {
                                if (response.status === 'success') {
                                    // Process the second team's data
                                    var secondTeamData = response.data;
    
                                    // Update finalized data with both teams' data
                                    updateFinalizedData(firstTeamData, secondTeamData);
                                } else {
                                    console.error('Error fetching second team data:', response.message);
                                }
                            },
                            error: function(xhr, status, error) {
                                console.error('AJAX Error fetching second team data:', xhr.responseText);
                            }
                        });
                    } else {
                        console.error('Error fetching first team data:', response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error fetching first team data:', xhr.responseText);
                }
            });
        }
    });

    function fetchAthleteInfoTotalGame(gameNumber) {
        // Function to update the finalized data
        function updateAthleteInfoData(firstTeamData, secondTeamData) {
            // Initialize a map to store sums for each ath_bball_player_id
            var sums = {};
        
            // Step 1: Calculate sums for firstTeamData
            firstTeamData.forEach(function(newDataItem) {
                var newDataID = newDataItem.ath_bball_player_id;
        
                if (!sums[newDataID]) {
                    sums[newDataID] = {
                        total_pts_sum: 0,
                        total_2fgm_sum: 0,
                        total_2pts_sum: 0,
                        total_3fgm_sum: 0,
                        total_3pts_sum: 0,
                        total_ftm_sum: 0,
                        total_ftpts_sum: 0,
                        total_2fga_sum: 0,
                        total_3fga_sum: 0,
                        total_fta_sum: 0,
                        total_ass_sum: 0,
                        total_block_sum: 0,
                        total_steal_sum: 0,
                        total_ofreb_sum: 0,
                        total_defreb_sum: 0,
                        total_turn_sum: 0,
                        total_foul_sum: 0,
                        total_game_sum: 0
                    };
                }
        
                // Update sums for each column
                sums[newDataID].total_pts_sum += parseInt(newDataItem.game_pts || 0, 10);
                sums[newDataID].total_2fgm_sum += parseInt(newDataItem.game_2fgm || 0, 10);
                sums[newDataID].total_2pts_sum += parseInt(newDataItem.game_2pts || 0, 10);
                sums[newDataID].total_3fgm_sum += parseInt(newDataItem.game_3fgm || 0, 10);
                sums[newDataID].total_3pts_sum += parseInt(newDataItem.game_3pts || 0, 10);
                sums[newDataID].total_ftm_sum += parseInt(newDataItem.game_ftm || 0, 10);
                sums[newDataID].total_ftpts_sum += parseInt(newDataItem.game_ftpts || 0, 10);
                sums[newDataID].total_2fga_sum += parseInt(newDataItem.game_2fga || 0, 10);
                sums[newDataID].total_3fga_sum += parseInt(newDataItem.game_3fga || 0, 10);
                sums[newDataID].total_fta_sum += parseInt(newDataItem.game_fta || 0, 10);
                sums[newDataID].total_ass_sum += parseInt(newDataItem.game_ass || 0, 10);
                sums[newDataID].total_block_sum += parseInt(newDataItem.game_block || 0, 10);
                sums[newDataID].total_steal_sum += parseInt(newDataItem.game_steal || 0, 10);
                sums[newDataID].total_ofreb_sum += parseInt(newDataItem.game_ofreb || 0, 10);
                sums[newDataID].total_defreb_sum += parseInt(newDataItem.game_defreb || 0, 10);
                sums[newDataID].total_turn_sum += parseInt(newDataItem.game_turn || 0, 10);
                sums[newDataID].total_foul_sum += parseInt(newDataItem.game_foul || 0, 10);
                sums[newDataID].total_game_sum += parseInt(newDataItem.game_number || 0, 10);
            });
        
            // Step 2: Update secondTeamData with summed values
            secondTeamData.forEach(function(oldDataItem) {
                var oldDataID = oldDataItem.ath_bball_id;
                
                if (sums[oldDataID]) {
                    // Update each column with the sum of old and new data
                    oldDataItem.total_pts = parseInt(oldDataItem.total_pts || 0, 10) + sums[oldDataID].total_pts_sum;
                    oldDataItem.total_2fgm = parseInt(oldDataItem.total_2fgm || 0, 10) + sums[oldDataID].total_2fgm_sum;
                    oldDataItem.total_2pts = parseInt(oldDataItem.total_2pts || 0, 10) + sums[oldDataID].total_2pts_sum;
                    oldDataItem.total_3fgm = parseInt(oldDataItem.total_3fgm || 0, 10) + sums[oldDataID].total_3fgm_sum;
                    oldDataItem.total_3pts = parseInt(oldDataItem.total_3pts || 0, 10) + sums[oldDataID].total_3pts_sum;
                    oldDataItem.total_ftm = parseInt(oldDataItem.total_ftm || 0, 10) + sums[oldDataID].total_ftm_sum;
                    oldDataItem.total_ftpts = parseInt(oldDataItem.total_ftpts || 0, 10) + sums[oldDataID].total_ftpts_sum;
                    oldDataItem.total_2fga = parseInt(oldDataItem.total_2fga || 0, 10) + sums[oldDataID].total_2fga_sum;
                    oldDataItem.total_3fga = parseInt(oldDataItem.total_3fga || 0, 10) + sums[oldDataID].total_3fga_sum;
                    oldDataItem.total_fta = parseInt(oldDataItem.total_fta || 0, 10) + sums[oldDataID].total_fta_sum;
                    oldDataItem.total_ass = parseInt(oldDataItem.total_ass || 0, 10) + sums[oldDataID].total_ass_sum;
                    oldDataItem.total_block = parseInt(oldDataItem.total_block || 0, 10) + sums[oldDataID].total_block_sum;
                    oldDataItem.total_steal = parseInt(oldDataItem.total_steal || 0, 10) + sums[oldDataID].total_steal_sum;
                    oldDataItem.total_ofreb = parseInt(oldDataItem.total_ofreb || 0, 10) + sums[oldDataID].total_ofreb_sum;
                    oldDataItem.total_defreb = parseInt(oldDataItem.total_defreb || 0, 10) + sums[oldDataID].total_defreb_sum;
                    oldDataItem.total_turn = parseInt(oldDataItem.total_turn || 0, 10) + sums[oldDataID].total_turn_sum;
                    oldDataItem.total_foul = parseInt(oldDataItem.total_foul || 0, 10) + sums[oldDataID].total_foul_sum;
                    oldDataItem.total_game = (parseInt(oldDataItem.total_game || 0, 10) + sums[oldDataID].total_game_sum) / 4;
                   
                    // Calculate total rebounds as the sum of defensive and offensive rebounds
                    oldDataItem.total_reb = (parseInt(oldDataItem.total_defreb || 0, 10) + parseInt(oldDataItem.total_ofreb || 0, 10)) +
                        (sums[oldDataID].total_defreb_sum + sums[oldDataID].total_ofreb_sum);
        
                    // Log the data being sent for debugging purposes
                    console.log('Sending data:', oldDataItem);
        
                    // Example: Send AJAX request to update the database with oldDataItem
                    $.ajax({
                        type: "POST",
                        url: "phpFile/buttonFunctions/updateAthleteTotal.php",
                        data: { updateData: oldDataItem },
                        dataType: 'json',
                        success: function(response) {
                            if (response.status === 'success') {
                                console.log('Match result updated successfully for player ID:', oldDataID);
                            } else {
                                console.error('Error updating match result for player ID:', oldDataID, response.message);
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error('AJAX Error updating match result:', xhr.responseText);
                        }
                    });
                }
            });
        
            // Log the updated secondTeamData (for debugging purposes)
            console.log('Updated secondTeamData:', secondTeamData);
        }

        
        
        // Fetch data for the first team
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchAthleteNames.php",
            data: { game_number: gameNumber },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    var athletesNewData = response.data;
        
                    // Fetch data for the second team
                    $.ajax({
                        type: "GET",
                        url: "phpFile/buttonFunctions/fetchAthletesCurrentData.php",
                        data: { game_number: gameNumber },
                        dataType: 'json',
                        success: function(response) {
                            if (response.status === 'success') {
                                var athletesOldData = response.data;
        
                                // Now you have both athletesNewData and athletesOldData
                                // Process or use the data as needed
                                console.log('Athletes New Data:', athletesNewData);
                                console.log('Athletes Old Data:', athletesOldData);
        
                                // Example: Update UI or call a function with both datasets
                                updateAthleteInfoData(athletesNewData, athletesOldData);
                            } else {
                                console.error('Error fetching second team data:', response.message);
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error('AJAX Error fetching second team data:', xhr.responseText);
                        }
                    });
                } else {
                    console.error('Error fetching first team data:', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error fetching first team data:', xhr.responseText);
            }
        });
    }

// dsa

    function fetchAthleteInfoPercent(gameNumber) {
        // Function to update the finalized data
        function updateAthleteInfoPercent(firstTeamData, secondTeamData) {
            // Initialize a map to store sums for each ath_bball_player_id
            var sums = {};
        
            // Step 1: Calculate sums for firstTeamData
            firstTeamData.forEach(function(newDataItem) {
                var newDataID = newDataItem.ath_bball_id;
        
                if (!sums[newDataID]) {
                    sums[newDataID] = {
                        total_pts_sum: 0,
                        total_2fgm_sum: 0,
                        total_2pts_sum: 0,
                        total_3fgm_sum: 0,
                        total_3pts_sum: 0,
                        total_ftm_sum: 0,
                        total_ftpts_sum: 0,
                        total_2fga_sum: 0,
                        total_3fga_sum: 0,
                        total_fta_sum: 0,
                        total_ass_sum: 0,
                        total_block_sum: 0,
                        total_steal_sum: 0,
                        total_ofreb_sum: 0,
                        total_defreb_sum: 0,
                        total_turn_sum: 0,
                        total_foul_sum: 0,
                        total_game_sum: 0
                    };
                }
        
                // Update sums for each column
                sums[newDataID].total_pts_sum += parseInt(newDataItem.total_pts || 0, 10);
                sums[newDataID].total_2fgm_sum += parseInt(newDataItem.total_2fgm || 0, 10);
                sums[newDataID].total_2pts_sum += parseInt(newDataItem.total_2pts || 0, 10);
                sums[newDataID].total_3fgm_sum += parseInt(newDataItem.total_3fgm || 0, 10);
                sums[newDataID].total_3pts_sum += parseInt(newDataItem.total_3pts || 0, 10);
                sums[newDataID].total_ftm_sum += parseInt(newDataItem.total_ftm || 0, 10);
                sums[newDataID].total_ftpts_sum += parseInt(newDataItem.total_ftpts || 0, 10);
                sums[newDataID].total_2fga_sum += parseInt(newDataItem.total_2fga || 0, 10);
                sums[newDataID].total_3fga_sum += parseInt(newDataItem.total_3fga || 0, 10);
                sums[newDataID].total_fta_sum += parseInt(newDataItem.total_fta || 0, 10);
                sums[newDataID].total_ass_sum += parseInt(newDataItem.total_ass || 0, 10);
                sums[newDataID].total_block_sum += parseInt(newDataItem.total_block || 0, 10);
                sums[newDataID].total_steal_sum += parseInt(newDataItem.total_steal || 0, 10);
                sums[newDataID].total_ofreb_sum += parseInt(newDataItem.total_ofreb || 0, 10);
                sums[newDataID].total_defreb_sum += parseInt(newDataItem.total_defreb || 0, 10);
                sums[newDataID].total_reb_sum += parseInt(newDataItem.total_reb || 0, 10);
                sums[newDataID].total_turn_sum += parseInt(newDataItem.total_turn || 0, 10);
                sums[newDataID].total_foul_sum += parseInt(newDataItem.total_foul || 0, 10);
                sums[newDataID].total_game_sum += parseInt(newDataItem.total_game || 0, 10);
            });
        
            // Step 2: Update secondTeamData with summed values
            secondTeamData.forEach(function(oldDataItem) {
                var oldDataID = oldDataItem.ath_id;
                
                if (sums[oldDataID]) {
                    // Update each column with the sum of old and new data

                    oldDataItem.shooting = ((sums[oldDataID].total_2fgm_sum + sums[oldDataID].total_3fgm_sum + sums[oldDataID].total_ftm_sum) / (sums[oldDataID].total_2fgm_sum + sums[oldDataID].total_3fgm_sum + sums[oldDataID].total_ftm_sum + sums[oldDataID].total_2fga_sum + sums[oldDataID].total_3fga_sum + sums[oldDataID].total_fta_sum)) * 40;

                // Calculate Individual Shooting Scores
                    oldDataItem.shooting_2 = (sums[oldDataID].total_2fgm_sum / (sums[oldDataID].total_2fgm_sum + sums[oldDataID].total_2fga_sum)) * 100;
                    oldDataItem.shooting_3 = (sums[oldDataID].total_3fgm_sum / (sums[oldDataID].total_3fgm_sum + sums[oldDataID].total_3fga_sum)) * 100;
                    oldDataItem.shooting_1 = (sums[oldDataID].total_ftm_sum / (sums[oldDataID].total_ftm_sum + sums[oldDataID].total_fta_sum)) * 100;

                    // Calculate Passing Score
                    oldDataItem.passing = (sums[oldDataID].total_ass_sum / (sums[oldDataID].total_ass_sum + sums[oldDataID].total_turn_sum)) * 15;

                    // Calculate Individual Rebound Scores
                    oldDataItem.of_reb = sums[oldDataID].total_ofreb_sum / sums[oldDataID].total_game_sum;
                    oldDataItem.def_reb = sums[oldDataID].total_defreb_sum / sums[oldDataID].total_game_sum;

                    // Calculate Rebounding Score and Normalize
                    oldDataItem.rebounding = ((sums[oldDataID].total_ofreb_sum + sums[oldDataID].total_defreb_sum) / sums[oldDataID].total_game_sum) * 15;
                    if (oldDataItem.rebounding > 15) {
                        oldDataItem.rebounding = 15;
                    }

                    // Calculate Individual Defending Scores
                    oldDataItem.blocking = sums[oldDataID].total_block_sum / sums[oldDataID].total_game_sum;
                    oldDataItem.stealing = sums[oldDataID].total_steal_sum / sums[oldDataID].total_game_sum;

                    // Calculate Defending Score and Normalize
                    oldDataItem.defending = ((sums[oldDataID].total_block_sum + sums[oldDataID].total_steal_sum) / sums[oldDataID].total_game_sum) * 30;
                    if (oldDataItem.defending > 30) {
                        oldDataItem.defending = 30;
                    }

                    oldDataItem.total_percentage = oldDataItem.defending + oldDataItem.rebounding + oldDataItem.passing + oldDataItem.shooting;

                    
                   
                    // Calculate total rebounds as the sum of defensive and offensive rebounds
                    
        
                    // Log the data being sent for debugging purposes
                    console.log('Sending data:', oldDataItem);
        
                    // Example: Send AJAX request to update the database with oldDataItem
                    $.ajax({
                        type: "POST",
                        url: "phpFile/buttonFunctions/updateAthletePercentage.php",
                        data: { updateData: oldDataItem },
                        dataType: 'json',
                        success: function(response) {
                            if (response.status === 'success') {
                                console.log('Match result updated successfully for player ID:', oldDataID);
                            } else {
                                console.error('Error updating match result for player ID:', oldDataID, response.message);
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error('AJAX Error updating match result:', xhr.responseText);
                        }
                    });
                }
            });
        
            // Log the updated secondTeamData (for debugging purposes)
            console.log('Updated secondTeamData:', secondTeamData);
        }

        
        
        // Fetch data for the first team
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchAthleteTotal.php",
            data: {game_number: gameNumber},
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    var athletesNewData = response.data;
        
                    // Fetch data for the second team
                    $.ajax({
                        type: "GET",
                        url: "phpFile/buttonFunctions/fetchPercentage.php",
                        data: {game_number: gameNumber},
                        dataType: 'json',
                        success: function(response) {
                            if (response.status === 'success') {
                                var athletesOldData = response.data;
        
                                // Now you have both athletesNewData and athletesOldData
                                // Process or use the data as needed
                                console.log('Athletes New Data:', athletesNewData);
                                console.log('Athletes Old Data:', athletesOldData);
        
                                // Example: Update UI or call a function with both datasets
                                updateAthleteInfoPercent(athletesNewData, athletesOldData);
                            } else {
                                console.error('Error fetching second team data:', response.message);
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error('AJAX Error fetching second team data:', xhr.responseText);
                        }
                    });
                } else {
                    console.error('Error fetching first team data:', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error fetching first team data:', xhr.responseText);
            }
        });
    }
    
    
    
    
    

    // Function to populate match name dropdown
    function populateMatchNameDropdown() {
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetch_teams.php",
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    var dropdown = $('#viewGameDropdown');
                    dropdown.empty(); // Clear existing options

                    // Iterate over match names and create options
                    response.matchNames.forEach(function(matchName) {
                        dropdown.append($('<option></option>').attr('value', matchName).text(matchName));
                    });
                } else {
                    console.error('Error fetching match names:', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    }

    // Call populateDropdown function when the page loads
    populateMatchNameDropdown();

    // Function to fetch team data for both teams
    function fetchTeamDatax(gameNumber, firstTeam, secondTeam) {
        function fetchData(team) {
            $.ajax({
                type: "GET",
                url: "phpFile/buttonFunctions/fetchTeamMatch.php",
                data: { game_number: gameNumber, team: team },
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'success') {
                        // Process data here


                        // Example: Process each quarter's data if needed
                        

                    } else {
                        console.error(`Error fetching data for`, response.message);
                        // Handle error case if needed
                    }
                },
                error: function(xhr, status, error) {
                    console.error(`AJAX Error fetching data for:`, error);
                    // Handle AJAX error
                }
            });
        }

        // Call fetchData function for both teams
        fetchData(firstTeam);
        fetchData(secondTeam);
    }
// asd

    function fetchTeamQuarterSum(gameNumber, firstTeam, secondTeam, quarter, match_id, gameTeam, gameQuarter) {


        function updateTeamQuarterSums(sum) {

            $.ajax({
                type: "POST",
                url: "phpFile/buttonFunctions/updateQuarterResult.php",
                data: { sum: sum, team: gameTeam, match_id: match_id, quarter: gameQuarter },
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'success') {

                    } else {
                        console.error(`Error updating Quarter for team: ${gameTeam}`, response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', error);
                }
            });
        }

        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/sumQuarter.php",
            data: { game_number: match_id, team: gameTeam, quarter: quarter },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {

                    updateTeamQuarterSums(response.sum);
                } else {
                    console.error("Error fetching sums for first team:", response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });

    }

    function fetchFinalPoints(gameNumber, firstTeam, secondTeam) {
;
    
        // AJAX request for first team
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchFinalPoints.php",
            data: { match_id: gameNumber, team: firstTeam },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {

                    updateScoreboard(response.data, 'first');
                } else {
                    console.error("Error fetching sums for first team:", response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    
        // AJAX request for second team
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchFinalPoints.php",
            data: { match_id: gameNumber, team: secondTeam },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {

                    updateScoreboard(response.data, 'second');
                } else {
                    console.error("Error fetching sums for second team:", response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    }
    
    // Function to update scoreboard with fetched points
    function updateScoreboard(points, team) {
        if (team === 'first') {
            $('#gamePointsTeamA').text(points);
        } else if (team === 'second') {
            $('#gamePointsTeamB').text(points);
        }
    }
    
    
    function fetchTeamQuarterTotal(gameNumber, firstTeam, secondTeam, quarter) {
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchQuarterTotal.php",
            data: { game_number: gameNumber, team: firstTeam, quarter: quarter },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    populateQuarterTotalTable('#firstTeamQuarterTable tbody', response.data);
                    $('#firstTeamQuarterMessage').hide();
                } else {
                    $('#firstTeamQuarterTable tbody').empty(); // Clear table body
                    $('#firstTeamQuarterMessage').text('No data available for this team.').show();
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
                $('#firstTeamQuarterTable tbody').empty(); // Clear table body on error
                $('#firstTeamQuarterMessage').text('Error fetching data.').show();
            }
        });

        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchQuarterTotal.php",
            data: { game_number: gameNumber, team: secondTeam, quarter: quarter },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    populateQuarterTotalTable('#secondTeamQuarterTable tbody', response.data);
                    $('#secondTeamQuarterMessage').hide();
                } else {
                    $('#secondTeamQuarterTable tbody').empty(); // Clear table body
                    $('#secondTeamQuarterMessage').text('No data available for this team.').show();
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
                $('#secondTeamQuarterTable tbody').empty(); // Clear table body on error
                $('#secondTeamQuarterMessage').text('Error fetching data.').show();
            }
        });
    }

    // Function to populate quarter total tables
    function populateQuarterTotalTable(tableBodySelector, data) {
        var tableBody = $(tableBodySelector);
        tableBody.empty(); // Clear existing table content

        if (data.length === 0) {
            tableBody.append('<tr><td colspan="18">No data available</td></tr>');
            return;
        }

        data.forEach(function(rowData) {
            var row = $('<tr>');

            // Adjust this based on your actual data structure returned from PHP

            // Assuming 'row' is your table row (<tr>) element

            row.append($('<td>').text(rowData['game_points']));
            row.append($('<td>').text(rowData['game_2fgm']));
            row.append($('<td>').text(rowData['game_3fgm']));
            row.append($('<td>').text(rowData['game_ftm']));
            row.append($('<td>').text(rowData['game_2pts']));
            row.append($('<td>').text(rowData['game_3pts']));
            row.append($('<td>').text(rowData['game_ftpts']));
            row.append($('<td>').text(rowData['game_2fga']));
            row.append($('<td>').text(rowData['game_3fga']));
            row.append($('<td>').text(rowData['game_fta']));
            row.append($('<td>').text(rowData['game_ass']));
            row.append($('<td>').text(rowData['game_block']));
            row.append($('<td>').text(rowData['game_steal']));
            row.append($('<td>').text(rowData['game_ofreb']));
            row.append($('<td>').text(rowData['game_defreb']));
            row.append($('<td>').text(rowData['game_turn']));
            row.append($('<td>').text(rowData['game_foul']));

           

            tableBody.append(row);
        });
    }

    function updateTeamStatus(gameNumber, firstTeam, secondTeam) {
        $.ajax({
            type: "POST",
            url: "phpFile/buttonFunctions/mainPlayers.php", // Adjust path as needed
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    console.log('Team status updated successfully');
                    // Optionally handle success case
                    
                } else {
                    console.error('Failed to update team status:', response.message);
                    // Optionally handle error case
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error updating team status:', error);
                // Handle AJAX error
            }
        });
    }

    function fetchAndUpdateTeamTotal (gameNumber, firstTeam, secondTeam, quarter, match_id, gameTeam, gameQuarter) {
        
        function updateTeamSums(sums) {

            $.ajax({
                type: "POST",
                url: "phpFile/buttonFunctions/updateMatchResult.php",
                data: { sums: sums, team: gameTeam, match_id: match_id },
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'success') {

                    } else {
                        console.error('Error updating sums for team:' + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', error);
                }
            });
        }
    
    
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/sumMatch.php",
            data: { game_number: match_id, team: gameTeam },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {

                    updateTeamSums(response.sums);
                } else {
                    console.error("Error fetching sums for second team:", response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    }
    
    
    // Function to fetch and populate team data for a specific game and quarter
    function fetchTeamData(gameNumber, firstTeam, secondTeam, quarter) {
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchTeamData.php",
            data: { game_number: gameNumber, team: firstTeam, quarter: quarter },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    populateTable('#firstTeamTable tbody', response.data);
                    $('#firstTeamTableMessage').hide();
                } else {
                    populateTable('#firstTeamTable tbody', []);
                    $('#firstTeamTableMessage').text('No players available for this team.').show();
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });

        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchTeamData.php",
            data: { game_number: gameNumber, team: secondTeam, quarter: quarter },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    populateTable('#secondTeamTable tbody', response.data);
                    $('#secondTeamTableMessage').hide();
                } else {
                    populateTable('#secondTeamTable tbody', []);
                    $('#secondTeamTableMessage').text('No players available for this team.').show();
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    }

    // Function to populate tables with player data
    var playerData = []; // Global variable to store player data

    function populateTable(tableBodySelector, data) {
        playerData = data; // Store data in global variable
    
        var tableBody = $(tableBodySelector);
        tableBody.empty(); // Clear existing table content
    
        if (data.length === 0) {
            tableBody.append('<tr><td colspan="18">No data available</td></tr>');
            return;
        }
    
        data.forEach(function(player) {
            var row = $('<tr>');
    
            // Loop through each property to create cells
            for (var key in player) {
                if (player.hasOwnProperty(key)) {
                    var cell = $('<td>').text(player[key]);
    
                    // Make cells editable on double-click except for specified columns
                    if (!['ath_bball_player_id', 'game_pts', 'game_2pts', 'game_3pts', 'game_ftpts', 'game_2fgm', 'game_3fgm', 'game_ftm', 'game_2fga', 'game_3fga', 'game_fta', 'game_ass', 'game_block', 'game_steal', 'game_ofreb', 'game_defreb', 'game_turn', 'game_foul'].includes(key)) {
                        cell.on('dblclick touchend', function(e) {
                            e.preventDefault();
                            var originalContent = $(this).text();
                            $(this).html('<input type="text" value="' + originalContent + '">');
                            $(this).children().first().focus();
    
                            // Blur event to finish editing and update database
                            $(this).children().first().on('blur', function() {
                                var newContent = $(this).val();
                                var parentCell = $(this).parent();
                                var columnIndex = parentCell.index(); // Column index
                                var columnName = Object.keys(player)[columnIndex]; // Column name
    
                                // Update UI with new content
                                parentCell.text(newContent);
    
                                // Update database via AJAX
                                updateDatabase(player, columnName, newContent);
                            });
                        });
                    }
    
                    // Add minus button before the cell content for specific columns
                    if (['game_2fgm', 'game_3fgm', 'game_ftm', 'game_2fga', 'game_3fga', 'game_fta', 'game_ass', 'game_block', 'game_steal', 'game_ofreb', 'game_defreb', 'game_turn', 'game_foul'].includes(key)) {
                        (function(key, player) { // Capture player data in closure
                            var minusButton = $('<button>')
                            .addClass('btn btn-danger mr-2')
                            .css({
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                padding: '0.3rem 0.5rem',
                                width: '4rem' // Adjust button width for responsiveness
                            })
                            .append($('<i>').addClass('bi bi-dash'));
                        
                        // bi-dash is a Bootstrap icon class for a dash icon
                        
    
                            // Minus button click handler
                            minusButton.on('click', function() {
                                var currentCell = $(this).parent();
                                var currentValue = parseInt(currentCell.contents().filter(function() { return this.nodeType == 3; }).first().text()) || 0;
                                var newValue = currentValue - 1;
                                currentCell.contents().filter(function() { return this.nodeType == 3; }).first().replaceWith(newValue);
    
                                // Update database immediately
                                updateDatabase(player, key, newValue);
    
                                // Handle dependent updates
                                handleDependentUpdates(player, key, newValue);
                                
                                // Retrieve specific player data

    
                            });
    
                            // Append minus button before cell content
                            cell.prepend(minusButton);
                        })(key, player);
                    }
    
                    // Add plus button after the cell content for specific columns
                    if (['game_2fgm', 'game_3fgm', 'game_ftm', 'game_2fga', 'game_3fga', 'game_fta', 'game_ass', 'game_block', 'game_steal', 'game_ofreb', 'game_defreb', 'game_turn', 'game_foul'].includes(key)) {
                        (function(key, player) { // Capture player data in closure
                            var plusButton = $('<button>')
                            .addClass('btn btn-success')
                            .css({
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                padding: '0.2rem 0.5rem',
                                width: '4rem' // Adjust button width for responsiveness
                            })
                            .append($('<i>').addClass('bi bi-plus'));
                        
                        // bi-plus is a Bootstrap icon class for a plus icon
                        
    
                            // Plus button click handler
                            plusButton.on('click', function() {
                                var currentCell = $(this).parent();
                                var currentValue = parseInt(currentCell.contents().filter(function() { return this.nodeType == 3; }).first().text()) || 0;
                                var newValue = currentValue + 1;
                                currentCell.contents().filter(function() { return this.nodeType == 3; }).first().replaceWith(newValue);
    
                                // Update database immediately
                                updateDatabase(player, key, newValue);
                                
                                // Handle dependent updates
                                handleDependentUpdates(player, key, newValue);
    
                                // Retrieve specific player data

    
                            });
    
                            // Append plus button after cell content
                            cell.append(plusButton);
                        })(key, player);
                    }
    
                    row.append(cell);
                }
            }
    
            tableBody.append(row);
        });
    }
    
    // Function to update database via AJAX
    function updateDatabase(player, columnName, newValue) {
        var gameNumber = $('#viewGameDropdown').val();
    
        // Fetch teams dynamically based on gameNumber
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchTeam12.php",
            data: { game_number: gameNumber },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    var firstTeam = response.data.team_1;
                    var secondTeam = response.data.team_2;
                    var quarter = $('#quarterDropdown').val(); // Get selected quarter
    
                    // Update database with fetched teams
                    $.ajax({
                        type: "POST",
                        url: "phpFile/buttonFunctions/updatePlayerData.php",
                        data: {
                            player_id: player.ath_bball_player_id,
                            column_name: columnName,
                            new_value: newValue,
                            player_team: player.game_team,
                            quarter: player.game_quarter,
                            match_id: player.match_id
                        },
                        dataType: 'json',
                        success: function(response) {
                            if (response.status === 'success') {

                                // Reload updated data
                                fetchTeamData(gameNumber, firstTeam, secondTeam, quarter);
                                fetchTeamQuarterTotal(gameNumber, firstTeam, secondTeam, quarter);
                                fetchTeamQuarterSum(gameNumber, firstTeam, secondTeam, quarter, player.match_id, player.game_team, player.game_quarter);
                                fetchAndUpdateTeamTotal(gameNumber, firstTeam, secondTeam, quarter, player.match_id, player.game_team, player.game_quarter);
                                fetchFinalPoints(gameNumber, firstTeam, secondTeam);
                                fetchTeamData(gameNumber, firstTeam, secondTeam, quarter);
                            } else {
                                console.error('Failed to update database:', response.message);
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error('AJAX Error:', error);
                        }
                    });
    
                } else {
                    console.error('Error fetching teams:', response.message);
                    
                    // Handle error case if needed
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error fetching teams:', error);
                
                // Handle AJAX error
            }
        });
    }
    
    // Function to handle dependent updates
    function handleDependentUpdates(player, columnName, newValue) {
        let dependentUpdates = [];
    
        switch (columnName) {
            case 'game_2fgm':
                dependentUpdates.push({ column: 'game_2pts', value: newValue * 2 });
                break;
            case 'game_3fgm':
                dependentUpdates.push({ column: 'game_3pts', value: newValue * 3 });
                break;
            case 'game_ftm':
                dependentUpdates.push({ column: 'game_ftpts', value: newValue * 1 });
                break;
            default:
                return; // No dependent column to update
        }
    
        // Calculate total points
        const totalPoints = (player.game_2pts + player.game_3pts + player.game_ftpts) +
                            (dependentUpdates.find(update => update.column === 'game_2pts') ? (newValue * 2) - player.game_2pts : 0) +
                            (dependentUpdates.find(update => update.column === 'game_3pts') ? (newValue * 3) - player.game_3pts : 0) +
                            (dependentUpdates.find(update => update.column === 'game_ftpts') ? (newValue * 1) - player.game_ftpts : 0);
    
        dependentUpdates.push({ column: 'game_pts', value: totalPoints });
    
        // Perform the dependent updates
        dependentUpdates.forEach(update => {
            updateDatabase(player, update.column, update.value);
        });
    }
    
    // Function to retrieve specific player data
    
    // VIEW DATAS ==================================================================================================================================================================


    function populateDropdowns() {
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchTeams.php",
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    const dropdown1 = $('#matchTeam1');
                    const dropdown2 = $('#matchTeam2');
                    dropdown1.empty();
                    dropdown2.empty();
    
                    // Populate dropdown options
                    response.teams.forEach(function(team) {
                        dropdown1.append(`<option value="${team}">${team}</option>`);
                        dropdown2.append(`<option value="${team}">${team}</option>`);
                    });
    
                    // Set default values and update options
                    if (response.teams.length > 1) {
                        dropdown1.val(response.teams[0]);
                        dropdown2.val(response.teams[1]);
                    }
    
                    updateDropdownOptions(dropdown2, response.teams[0]);
                    updateDropdownOptions(dropdown1, response.teams[1]);
    
                    // Dropdown change event handlers
                    dropdown1.off('change').on('change', function() {
                        updateDropdownOptions(dropdown2, $(this).val());
                        fetchTeamOneData();
                    });
    
                    dropdown2.off('change').on('change', function() {
                        updateDropdownOptions(dropdown1, $(this).val());
                        fetchTeamTwoData();
                    });
    
                    // Fetch initial data
                    fetchTeamOneData();
                    fetchTeamTwoData();
    
                    // Display retrieved data (example)
                    $('#teamDataContainer').empty();
                    response.teams.forEach(function(team) {
                        $('#teamDataContainer').append(`<div>${team}</div>`);
                    });
                } else {
                    console.error('Error fetching teams:', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    }
    

    // Function to update dropdown options based on the selected team
    function updateDropdownOptions(dropdown, selectedTeam) {
        dropdown.find('option').each(function() {
            $(this).prop('disabled', $(this).val() === selectedTeam);
        });
    }

    

    // Function to populate the athlete table
    function populateTableMatch(athleteTableBody, data) {
        athleteTableBody.empty();
    
        data.forEach(function(athlete) {
            var card = `
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" style="max-width: 100%; height: 100%;">
                        <img src="images/prof_pics/${athlete.ath_img}" class="card-img-top img-thumbnail" alt="Athlete Image" style="height: 250px; object-fit: cover;">
                        <div class="card-body" style="font-size: 1vw;">
                            <p class="card-title text-center h5">${athlete.ath_name}</h5>
                            <p class="card-text h6"><strong>Position:</strong> ${athlete.ath_position}</p>
                            <p class="card-text h6"><strong>ID:</strong> ${athlete.AthleteID}</p>
                            <p class="card-text h6   editable" data-ath-id="${athlete.AthleteID}" data-ath-team="${athlete.ath_team}">
                            <strong>Team:</strong> ${athlete.ath_team.trim()}</p>
                        </div>
                    </div>
                </div>`;
            var $card = $(card);
            athleteTableBody.append($card);
            if (athlete.disabled) {
                $card.addClass('disabled-card');
            }
        });
    
        // Attach double-click event to make the team name editable
        $('.editable').off('dblclick').on('dblclick', function() {
            var $this = $(this);
            var teamName = $this.text().replace('Team:', '').trim();
            var input = $(`<input type="text" class="edit-input" value="${teamName}" style="font-size: 1.5vw;" />`);
            $this.html(`<strong>Team:</strong> `).append(input);
            input.focus();
    
            // Attach focusout event to update the team name
            input.off('focusout').on('focusout', function() {
                var newTeamName = $(this).val().trim();
                var athId = $this.data('ath-id');
                var oldTeamName = $this.data('ath-team');
    
                $.ajax({
                    type: "POST",
                    url: "phpFile/buttonFunctions/updateTeam.php",
                    data: { ath_id: athId, ath_team: newTeamName, old_team: oldTeamName },
                    dataType: 'json',
                    success: function(response) {
                        if (response.status === 'success') {
                            $this.html(`<strong>Team:</strong> ${newTeamName}`);
                            $this.data('ath-team', newTeamName);
                            reloadAllFunctions();
                        } else {
                            alert(response.message || 'Unknown error');
                            $this.html(`<strong>Team:</strong> ${oldTeamName}`);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('AJAX Error:', error);
                        $this.html(`<strong>Team:</strong> ${oldTeamName}`);
                    }
                });
            });
        });
    }
    
    // Function to fetch team data and populate the respective table
    function fetchTeamDataCreate(dropdownId, tableId) {
        var team = $(dropdownId).val();
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchAthletesMatch.php",
            data: { team: team },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    populateTableMatch($(tableId), response.data);
                } else {
                    console.error('Error:', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    }

    // Function to fetch data for the first team
    function fetchTeamOneData() {
        fetchTeamDataCreate('#matchTeam1', '#teamOneTable');
    }

    // Function to fetch data for the second team
    function fetchTeamTwoData() {
        fetchTeamDataCreate('#matchTeam2', '#teamTwoTable');
    }

    // Function to reload all data and dropdowns
    function reloadAllFunctions() {
        populateDropdowns();
        fetchTeamOneData();
        fetchTeamTwoData();
    }

    // Function to fetch athletes for a specific team
    function fetchAthletes(team) {
        return $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchAthletesMatch.php",
            data: { team: team },
            dataType: 'json'
        });
    }

    // Function to create a new basketball match
    function createBasketballMatch() {
        var matchName = $('#matchName').val().trim();
        var team1 = $('#matchTeam1').val();
        var team2 = $('#matchTeam2').val();
        
        if (matchName && team1 && team2) {
            // Fetch athletes for both teams
            $.when(fetchAthletes(team1), fetchAthletes(team2)).done(function(response1, response2) {
                var team1Athletes = response1[0].data;
                var team2Athletes = response2[0].data;
                var allAthletes = team1Athletes.concat(team2Athletes);

                // Check for duplicate athletes in both teams
                var duplicateAthletes = [];
                var athleteIds = new Set();

                allAthletes.forEach(function(athlete) {
                    if (athleteIds.has(athlete.AthleteID)) {
                        duplicateAthletes.push(athlete);
                    } else {
                        athleteIds.add(athlete.AthleteID);
                    }
                });

                var proceed = true;
                if (duplicateAthletes.length > 0) {
                    var confirmMessage = duplicateAthletes.map(a => a.ath_name).join(', ') + " is on both teams. Do you still want to insert?";
                    proceed = confirm(confirmMessage);
                }

                if (proceed) {
                    $.ajax({
                        type: "POST",
                        url: "phpFile/buttonFunctions/createBasketballMatch.php",
                        data: {
                            match_name: matchName,
                            team1: team1,
                            team2: team2,
                            team1_score: 0,
                            team2_score: 0,
                            match_win: '--',
                            match_lose: '--',
                            athletes: allAthletes
                        },
                        dataType: 'json',
                        success: function(response) {
                            if (response.status === 'success') {
                                alert('Match created successfully');
                                
                                setTimeout(function() {
                                    window.location.reload();
                                }, 3000); // 3000 milliseconds = 3 seconds
                                
                            } else {
                                alert('Error creating match: ' + response.message);
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error('AJAX Error:', error);
                        }
                    });
                }
            }).fail(function(xhr, status, error) {
                console.error('AJAX Error:', error);
            });
        } else {
            alert('Please enter the match name and select both teams');
        }
    }

    // Event listener for the create match modal button
    $('#createMatchModalButton').click(function() {
        populateDropdowns();
        $('#createMatchModal').modal('show');
    });

    // Event listener for creating matches
    $('#createMatches').click(function() {
        createBasketballMatch();
    });

    // Initial population of the dropdowns
    populateDropdowns();
    
    });

// create match --------------------------------------------------------------------------------------------------------------
// jQuery function to handle click event on showMatchesButton
// jQuery function to handle click event on showMatchesButton
$(document).ready(function() {
    // Function to fetch and display game details
    function showGameDetails(matchId, team1, team2) {
        // First table (team 1)
        var firstTable = $('#firstTableBody');
        firstTable.empty(); // Clear previous content

        // Second table (team 2)
        var secondTable = $('#secondTableBody');
        secondTable.empty(); // Clear previous content

        // Fetch data for team 1
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchGameDetails.php",
            data: {
                match_id: matchId,
                team: team1
            },
            dataType: 'json',
            success: function(response1) {
                if (response1.status === 'success') {
                    var team1Data = response1.data;

                    // Populate first table
                    team1Data.forEach(function(row) {
                        var rowHtml = `
                            <tr>
                                <td>${row.game_quarter}</td>
                                <td>${row.game_points}</td>
                                <td>${row.game_2fgm}</td>
                                <td>${row.game_3fgm}</td>
                                <td>${row.game_ftm}</td>
                                <td>${row.game_2pts}</td>
                                <td>${row.game_3pts}</td>
                                <td>${row.game_ftpts}</td>
                                <td>${row.game_2fga}</td>
                                <td>${row.game_3fga}</td>
                                <td>${row.game_fta}</td>
                                <td>${row.game_ass}</td>
                                <td>${row.game_block}</td>
                                <td>${row.game_steal}</td>
                                <td>${row.game_ofreb}</td>
                                <td>${row.game_defreb}</td>
                                <td>${row.game_turn}</td>
                                <td>${row.game_foul}</td>
                            </tr>
                        `;
                        firstTable.append(rowHtml);
                    });
                } else {
                    console.error('Error fetching team 1 game details:', response1.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error fetching team 1 game details:', error);
            }
        });

        // Fetch data for team 2
        $.ajax({
            type: "GET",
            url: "phpFile/buttonFunctions/fetchGameDetails.php",
            data: {
                match_id: matchId,
                team: team2
            },
            dataType: 'json',
            success: function(response2) {
                if (response2.status === 'success') {
                    var team2Data = response2.data;

                    // Populate second table
                    team2Data.forEach(function(row) {
                        var rowHtml = `
                            <tr>
                                <td>${row.game_quarter}</td>
                                <td>${row.game_points}</td>
                                <td>${row.game_2fgm}</td>
                                <td>${row.game_3fgm}</td>
                                <td>${row.game_ftm}</td>
                                <td>${row.game_2pts}</td>
                                <td>${row.game_3pts}</td>
                                <td>${row.game_ftpts}</td>
                                <td>${row.game_2fga}</td>
                                <td>${row.game_3fga}</td>
                                <td>${row.game_fta}</td>
                                <td>${row.game_ass}</td>
                                <td>${row.game_block}</td>
                                <td>${row.game_steal}</td>
                                <td>${row.game_ofreb}</td>
                                <td>${row.game_defreb}</td>
                                <td>${row.game_turn}</td>
                                <td>${row.game_foul}</td>
                            </tr>
                        `;
                        secondTable.append(rowHtml);
                    });
                } else {
                    console.error('Error fetching team 2 game details:', response2.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error fetching team 2 game details:', error);
            }
        });
    }

    // Click event handler for each match result card
    $(document).on('click', '.match-card', function() {
        var matchId = $(this).data('match-id');
        var team1 = $(this).data('team1');
        var team2 = $(this).data('team2');

        // Show game details for this match
        showGameDetails(matchId, team1, team2);

        // Show/hide the game details tables
        $('#gameDetails').collapse('show');
    });

    // Function to fetch and display match results
$('#showMatchesButton').click(function() {
    $.ajax({
        type: "GET",
        url: "phpFile/buttonFunctions/fetchMatches.php",
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                var matches = response.data;
                var matchResultsContainer = $('#matchResultsContainer');
                matchResultsContainer.empty(); // Clear previous content

                // Loop through each match and create cards
                matches.forEach(function(match) {
                    var cardHtml = `
                        <div class="col-12 mb-4">
                            <div class="card gradient-bg match-card" 
                                 data-match-id="${match.bball_match_id}" 
                                 data-team1="${match.team_1}" 
                                 data-team2="${match.team_2}">
                                <div class="card-body">
                                    <div class="row">
                                        <!-- Left side (Winner) -->
                                        <div class="col-4 text-center">
                                            <p class="h1">W</p>
                                            <p class="h3">${match.match_win}</p>
                                            <p class="h3">${match.team_1_score}</p>
                                        </div>

                                        <!-- Middle (Match details) -->
                                        <div class="col-4 text-center">
                                            <p class="h3">${match.match_name}</p>
                                            <p class="h1">vs</p>
                                            <p class="h3">${match.bball_match_id}</p>
                                        </div>

                                        <!-- Right side (Loser) -->
                                        <div class="col-4 text-center">
                                            <p class="h1">L</p>
                                            <p class="h3">${match.match_lose}</p>
                                            <p class="h3">${match.team_2_score}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    matchResultsContainer.append(cardHtml);
                });

                // Show the modal
                $('#matchesModal').modal('show');

                // Add click event to match cards
                $('.match-card').click(function() {
                    var matchId = $(this).data('match-id');
                    fetchGameDetails(matchId);
                });
            } else {
                console.error('Error fetching match results:', response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error fetching match results:', error);
        }
    });
});

function fetchGameDetails(matchId) {
    $.ajax({
        type: "GET",
        url: "phpFile/buttonFunctions/fetchGameDetails.php",
        data: { match_id: matchId },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                var gameDetails = response.data;
                var gameDetailsContent = $('#gameDetailsContent');
                gameDetailsContent.empty(); // Clear previous content

                gameDetails.forEach(function(details, index) {
                    var activeClass = index === 0 ? 'active' : '';
                    var tableHtml = `
                        <div class="carousel-item ${activeClass}">
                            <div class="row">
                                <div class="col-md-6">
                                    <h5>Team 1 Game Details (Quarter ${details.quarter})</h5>
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Quarter</th>
                                                <th>Points</th>
                                                <th>2FGM</th>
                                                <th>3FGM</th>
                                                <th>FTM</th>
                                                <th>2PTS</th>
                                                <th>3PTS</th>
                                                <th>FTPTS</th>
                                                <th>2FGA</th>
                                                <th>3FGA</th>
                                                <th>FTA</th>
                                                <th>ASS</th>
                                                <th>BLOCK</th>
                                                <th>STEAL</th>
                                                <th>OFREB</th>
                                                <th>DEFREB</th>
                                                <th>TURN</th>
                                                <th>FOUL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>${details.quarter}</td>
                                                <td>${details.team1.points}</td>
                                                <td>${details.team1.fgm2}</td>
                                                <td>${details.team1.fgm3}</td>
                                                <td>${details.team1.ftm}</td>
                                                <td>${details.team1.pts2}</td>
                                                <td>${details.team1.pts3}</td>
                                                <td>${details.team1.ftpts}</td>
                                                <td>${details.team1.fga2}</td>
                                                <td>${details.team1.fga3}</td>
                                                <td>${details.team1.fta}</td>
                                                <td>${details.team1.ass}</td>
                                                <td>${details.team1.block}</td>
                                                <td>${details.team1.steal}</td>
                                                <td>${details.team1.ofreb}</td>
                                                <td>${details.team1.defreb}</td>
                                                <td>${details.team1.turn}</td>
                                                <td>${details.team1.foul}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="col-md-6">
                                    <h5>Team 2 Game Details (Quarter ${details.quarter})</h5>
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Quarter</th>
                                                <th>Points</th>
                                                <th>2FGM</th>
                                                <th>3FGM</th>
                                                <th>FTM</th>
                                                <th>2PTS</th>
                                                <th>3PTS</th>
                                                <th>FTPTS</th>
                                                <th>2FGA</th>
                                                <th>3FGA</th>
                                                <th>FTA</th>
                                                <th>ASS</th>
                                                <th>BLOCK</th>
                                                <th>STEAL</th>
                                                <th>OFREB</th>
                                                <th>DEFREB</th>
                                                <th>TURN</th>
                                                <th>FOUL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>${details.quarter}</td>
                                                <td>${details.team2.points}</td>
                                                <td>${details.team2.fgm2}</td>
                                                <td>${details.team2.fgm3}</td>
                                                <td>${details.team2.ftm}</td>
                                                <td>${details.team2.pts2}</td>
                                                <td>${details.team2.pts3}</td>
                                                <td>${details.team2.ftpts}</td>
                                                <td>${details.team2.fga2}</td>
                                                <td>${details.team2.fga3}</td>
                                                <td>${details.team2.fta}</td>
                                                <td>${details.team2.ass}</td>
                                                <td>${details.team2.block}</td>
                                                <td>${details.team2.steal}</td>
                                                <td>${details.team2.ofreb}</td>
                                                <td>${details.team2.defreb}</td>
                                                <td>${details.team2.turn}</td>
                                                <td>${details.team2.foul}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    `;
                    gameDetailsContent.append(tableHtml);
                });

                // Show the game details modal
                $('#gameDetailsModal').modal('show');
            } else {
                console.error('Error fetching game details:', response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error fetching game details:', error);
        }
    });
}

});