function tryLogin() {
    let un = $("#txtUsername").val(); // Get username input
    let pw = $("#txtPassword").val(); // Get password input
    
    // Check if username and password are not empty
    if (un.trim() !== "" && pw.trim() !== "") {
        $.ajax({
            url: "ajaxhandler/loginAjax.php", // Adjust path if needed
            type: "POST",
            dataType: "json",
            data: { user_name: un, password: pw, action: "verifyUser" }, // Send username, password, and action
            beforeSend: function() {
                $("#diverror").removeClass("applyerrordiv");
                $("#lockscreen").addClass("applylockscreen");
            },
            success: function(rv) {
                $("#lockscreen").removeClass("applylockscreen");
                console.log(rv);
                // Check response status for login validation
                if (rv.status === "ALL OK") {
                    // Redirect based on user role
                    if (rv.data.role === 'SUPERADMIN') {
                        document.location.replace("superadmin_dashboard.php"); // For Coordinator
                    } else if (rv.data.role === 'COORDINATOR') {
                        document.location.replace("mainDashboard.php");
                    }
                } else {
                    $("#diverror").addClass("applyerrordiv");
                    $("#diverror").text(rv.status); // Show the error message from the server
                }
            },
            error: function(xhr, status, error) {
                $("#lockscreen").removeClass("applylockscreen");
                $("#diverror").addClass("applyerrordiv");
                $("#diverror").text("An error occurred: " + error); // General error message
            }
        });
    } else {
        // Show error if either username or password is empty
        $("#diverror").addClass("applyerrordiv");
        $("#diverror").text("Please enter both username and password.");
    }
}

$(document).ready(function() {
    // Trigger login on button click
    $("#btnLogin").on("click", function(e) {
        e.preventDefault(); // Prevent the default form submission behavior
        tryLogin(); // Call the login function
    });

    // Trigger login on Enter key press in input fields
    $("input").keypress(function(e) {
        if (e.which === 13) { // If Enter key is pressed
            tryLogin(); // Call the login function
        }
    });
});
