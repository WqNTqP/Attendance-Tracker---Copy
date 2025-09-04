function tryStudentLogin()
{
    let email = $("#txtEmail").val();
    let password = $("#txtStudentID").val();
    if(email.trim() !== "" && password.trim() !== "")
    {
        $.ajax({
            url: "ajaxhandler/studentLoginAjax.php",
            type: "POST",
            dataType: "json",
            data: { email: email, password: password, action: "verifyStudent" },
            beforeSend: function() {
                $("#diverror").removeClass("applyerrordiv");
                $("#lockscreen").addClass("applylockscreen");
            },
            success: function(rv) {
                $("#lockscreen").removeClass("applylockscreen");
                if(rv.status == "ALL OK")
                {
                    document.location.replace("student_dashboard.php");
                }
                else
                {
                    $("#diverror").addClass("applyerrordiv");
                    $("#diverror").text(rv.message);
                }
            },
            error: function(xhr, status, error) {
                $("#lockscreen").removeClass("applylockscreen");
                $("#diverror").addClass("applyerrordiv");
                $("#diverror").text("An error occurred: " + error);
            }
        });
    }
    else
    {
        $("#diverror").addClass("applyerrordiv");
        $("#diverror").text("Please enter both email and password.");
    }
}


$(document).ready(function() {
    $("#btnLogin").on("click", function(e) {
        e.preventDefault();
        tryStudentLogin();
    });

    // Also add this for enter key press in input fields
    $("input").keypress(function(e) {
        if(e.which == 13) { // Enter key
            tryStudentLogin();
        }
    });

    // Password visibility toggle removed
});
