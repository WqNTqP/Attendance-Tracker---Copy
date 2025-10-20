<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href ="css/login.css">
    <link rel="stylesheet" href ="css/loader.css">
    <link rel="icon" type="image/x-icon" href="icon/favicon.ico">
    <title>Coordinator Login</title>
</head>
<body>
    <div class="loginform topmarginlarge">
        <div class="inputgroup">
            <input type="text" id="txtUsername" required>
            <label for= "txtUsername" id="lblUsername">USER NAME</label>
        </div>

        <div class="inputgroup topmarginlarge">
            <input type="password" id="txtPassword" required>
            <label for= "txtPassword" id="lblPassword">PASSWORD</label>
        </div>

        <div class="divcallfroaction topmarginlarge">
            <button class = "btnlogin inactivecolor" id="btnLogin">
                LOGIN
            </button>
        </div>

        <div class="diverror topmarginlarge" id="diverror">
            <label class="errormessage" id="errormessage">ERROR GOES HERE</label>
        </div>

        <div class="login-options">
            <div class="login-row">
                <span>Login as:</span>
                <a href="admin.php" class="login-link">Admin</a>
                <a href="student_login.php" class="login-link">Student</a>
            </div>
        </div>

    </div>
    <div class="lockscreen" id="lockscreen">
        <div class="spinner" id="spinner">

        </div>
        <label class="lblwait" id="lblwait">PLEASE WAIT...</label>
    </div>
        <script src="js/jquery.js"></script>
        <script src="js/login.js"></script>
</body>
</html>