<?php 

//kani na code kay condition ni siya 
//para if wala naka login mo balik raka sa login page
session_start();
    if(isset($_SESSION["current_user"]))
        {
            $cdrid=$_SESSION["current_user"];
        }
    else{
        header("location:index.php");
        die();
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/attendance.css">
    <link rel="icon" type="image/x-icon" href="icon/favicon.ico">
    <title>Document</title>
</head>
<body>


    <!--<h1>Hello</h1>
    <button id="btnLogout">LOGOUT</button>-->

    <div class="page">
        <div class="header-area">
           <div class="logo-area"> <h2 class="logo">ATTENDANCE APP</h2> </div>
           <div class="logout-area">  <button class="btnlogout" id="btnLogout">LOGOUT</button> </div>
        </div>

        <div class="session-area">
            <div class="label-area"><label>SESSION</label></div>
            <div class="dropdown-area">
                <select class="ddlclass" id="ddlclass">
                    <!--<option>SELECT ONE</option>
                    <option>2023 AUTUMN</option>
                    <option>2023 SPRING</option>-->
                </select>
            </div>
        </div>

        <div class="classlist-area" id="classlistarea">
            <!--<div class="classcard">CS101</div>
            <div class="classcard">CS102</div>
            <div class="classcard">CS103</div>
            <div class="classcard">CS104</div>
            <div class="classcard">CS105</div>
            <div class="classcard">CS106</div>-->
        </div>

        <div class="classdetails-area" id="classdetailsarea">
           <!-- <div class="classdetails">
                <div class="code-area">CS101</div>
                <div class="title-area">INFORMATION TECHNOLOGY</div>
                <div class="ondate-area">
                    <input type="date">
                </div>
            </div>-->
        </div>

        <div class="studentlist-area" id="studentlistarea">

        <!--
            <div class="studentlist"><labe> STUDENT LIST</label></div>
                
                <div class="studentdetails">
                    <div class="slno-area">001</div>
                    <div class="rollno-area">CSB21001</div>
                    <div class="name-area">KIM CHARLES</div>
                    <div class="checkbox-area">
                        <input type="checkbox">
                    </div>
                </div>
                <div class="studentdetails">
                    <div class="slno-area">001</div>
                    <div class="rollno-area">CSB21001</div>
                    <div class="name-area">KIM CHARLES</div>
                    <div class="checkbox-area">
                        <input type="checkbox">
                    </div>
                </div>
                <div class="studentdetails">
                    <div class="slno-area">001</div>
                    <div class="rollno-area">CSB21001</div>
                    <div class="name-area">KIM CHARLES</div>
                    <div class="checkbox-area">
                        <input type="checkbox">
                    </div>
                </div>
                <div class="studentdetails">
                    <div class="slno-area">001</div>
                    <div class="rollno-area">CSB21001</div>
                    <div class="name-area">KIM CHARLES</div>
                    <div class="checkbox-area">
                        <input type="checkbox">
                    </div>
                </div>
                <div class="studentdetails">
                    <div class="slno-area">001</div>
                    <div class="rollno-area">CSB21001</div>
                    <div class="name-area">KIM CHARLES</div>
                    <div class="checkbox-area">
                        <input type="checkbox">
                    </div>
                </div>
                <div class="studentdetails">
                    <div class="slno-area">001</div>
                    <div class="rollno-area">CSB21001</div>
                    <div class="name-area">KIM CHARLES</div>
                    <div class="checkbox-area">
                        <input type="checkbox">
                    </div>
                </div>
                <div class="studentdetails">
                    <div class="slno-area">001</div>
                    <div class="rollno-area">CSB21001</div>
                    <div class="name-area">KIM CHARLES</div>
                    <div class="checkbox-area">
                        <input type="checkbox">
                    </div>
                </div>
                <div class="studentdetails">
                    <div class="slno-area">001</div>
                    <div class="rollno-area">CSB21001</div>
                    <div class="name-area">KIM CHARLES</div>
                    <div class="checkbox-area">
                        <input type="checkbox">
                    </div>
                </div>
                <div class="studentdetails">
                    <div class="slno-area">001</div>
                    <div class="rollno-area">CSB21001</div>
                    <div class="name-area">KIM CHARLES</div>
                    <div class="checkbox-area">
                        <input type="checkbox">
                    </div>
                </div>
                <div class="studentdetails">
                    <div class="slno-area">001</div>
                    <div class="rollno-area">CSB21001</div>
                    <div class="name-area">KIM CHARLES</div>
                    <div class="checkbox-area">
                        <input type="checkbox">
                    </div>
                </div>
                <div class="studentdetails">
                    <div class="slno-area">001</div>
                    <div class="rollno-area">CSB21001</div>
                    <div class="name-area">KIM CHARLES</div>
                    <div class="checkbox-area">
                        <input type="checkbox">
                    </div>
                </div>
                -->
        </div>
        
    </div>
    <input type="hidden" id="hiddencdrid" value="<?php echo($cdrid)?>">
    <input type="hidden" id="hiddenSelectedHteID" value="-1">

    <script src="js/jquery.js"></script>
    <script src="js/attendance.js"></script>
</body>
</html>