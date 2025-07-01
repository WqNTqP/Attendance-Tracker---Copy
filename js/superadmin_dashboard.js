$(document).ready(function() {
    // Show the modal when the "Add New Coordinator/Admin" button is clicked
    $('#btnAddCoordinator').on('click', function() {
        $('#addCoordinatorModal').show(); // Display the modal
    });

    // Handle form submission for adding a coordinator/admin
    $('#addCoordinatorForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = $(this).serialize(); // Serialize form data

        $.ajax({
            type: 'POST',
            url: 'ajaxhandler/addCoordinatorAjax.php', // Call the existing addCoordinatorAjax.php
            data: formData,
            dataType: "json", // Expect JSON response
            success: function(response) {
                if (response.success) {
                    alert(response.message); // Show success message
                    location.reload(); // Reload the page to see the updated list
                } else {
                    alert("Error: " + response.message); // Show error message
                }
            },
            error: function() {
                alert('Error adding coordinator. Please try again.'); // Show error message
            }
        });
    });

    // Handle deletion of a coordinator
    window.deleteCoordinator = function(coordinatorId) {
        if (confirm('Are you sure you want to delete this coordinator?')) {
            $.ajax({
                url: "ajaxhandler/delete_coordinatorAjax.php",
                type: "POST",
                data: { id: coordinatorId },
                success: function(response) {
                    console.log("Response:", JSON.stringify(response, null, 2)); // Log the response object
                    if (response.success) {
                        alert("Coordinator deleted successfully!");
                        location.reload(); // Reload the page to see the updated list
                    } else {
                        alert("Error: " + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error("Error:", error);
                    alert("An error occurred while deleting the coordinator.");
                }
            });
        }
    };

    // Close modal functionality
    $('#closeModal').on('click', function() {
        $('#addCoordinatorModal').hide(); // Hide the modal
        $('#addCoordinatorForm')[0].reset(); // Reset the form
        $("#hteDropdownContainer").hide(); // Hide HTE dropdown on modal close
    });

    // Event listener for role change to show/hide HTE dropdown
    $(document).on("change", "#role", function() {
        const selectedRole = $(this).val();
        if (selectedRole === "ADMIN") {
            $("#hteDropdownContainer").show(); // Show HTE dropdown
            fetchHTEOptions(); // Fetch and populate HTE options
        } else {
            $("#hteDropdownContainer").hide(); // Hide HTE dropdown
        }
    });

    // Function to fetch HTE options
    function fetchHTEOptions() {
        $.ajax({
            url: "ajaxhandler/addCoordinatorAjax.php", // Adjust the URL as needed
            type: "POST",
            dataType: "json",
            data: { action: "getHTEs" }, // Specify the action to fetch HTEs
            success: function(response) {
                if (response.success) {
                    const hteSelect = $("#hteSelect");
                    hteSelect.empty(); // Clear existing options
                    response.htes.forEach(hte => {
                        hteSelect.append(`<option value="${hte.HTE_ID}">${hte.NAME}</option>`); // Populate HTE options
                    });
                } else {
                    alert("Error fetching HTEs: " + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error("Error fetching HTEs:", error);
                alert("An error occurred while fetching HTEs. Please check the console for more details.");
            }
        });
    }

    $(document).on("click","#btnLogout",function(ee)
    {
            $.ajax(
            {
                // para mo connect ni siya sa logoutAjac.php
                url: "ajaxhandler/logoutAjax.php",
                type: "POST",
                dataType: "json",
                data: {id:1 },
                beforeSend: function(e) {
                    
                },
                success: function(rv) {
                    document.location.replace("index.php");
                },
                error: function(xhr, status, error) {
                    alert("Something went wrong!")
                }
            }
        );

    });
});