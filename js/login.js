
function tryLogin()
{
    let un=$("#txtUsername").val();
    let pw=$("#txtPassword").val();
    if(un.trim()!=="" && pw.trim()!="")
    {
        // para mo connect ni siya sa loginAjac.php
        //alert("can connect");
        $.ajax({
            url: "ajaxhandler/loginAjax.php",
            type: "POST",
            dataType: "json",
            data: { user_name: un, password: pw, action: "verifyUser" },
            beforeSend: function() {
                // para mo show ni siya loading

                $("#diverror").removeClass("applyerrordiv");
                $("#lockscreen").addClass("applylockscreen");
                
                //$("#errormessage").text("");
            },
            success: function(rv) {
                //alert(JSON.stringify(rv));
                $("#lockscreen").removeClass("applylockscreen");
                if(rv['status']=="ALL OK")
                {
                    document.location.replace("attendance.php")
                }
                else{
                    //alert(rv['status']);
                    $("#diverror").addClass("applyerrordiv");
                    $("#errormessage").text(rv['status']);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error: Status: " + status + ", Error: " + error);
                console.error("Response: " + xhr.responseText);
                alert("Oops something went wrong: " + error);
            }
        });
        
    }
}

// para ni sa nag load na nga document
$(function(e)
{
    $(document).on("keyup","input",function(e){
        $("#diverror").removeClass("applyerrordiv");
        //$("#errormessage").text("");
        let un=$("#txtUsername").val();
        let pw=$("#txtPassword").val();
        if(un.trim()!=="" && pw.trim()!=="")
        {
            $("#btnLogin").removeClass("inactivecolor");
            $("#btnLogin").addClass("activecolor");
        }
        else
        {
            $("#btnLogin").removeClass("activecolor");
            $("#btnLogin").addClass("inactivecolor");
        }
    });
    $(document).on("click","#btnLogin",function(e)
    {
        tryLogin();
    });
});