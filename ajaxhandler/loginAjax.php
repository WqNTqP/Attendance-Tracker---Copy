<?php
$path=$_SERVER['DOCUMENT_ROOT'];
require_once $path."/Attendance Tracker/database/database.php";
require_once $path."/Attendance Tracker/database/coordinator.php";
$action=$_REQUEST["action"];
if(!empty($action))
{
    if($action=="verifyUser")
    {
        //kuhaon kung unsa tong gi type
        $un=$_POST["user_name"];
        $pw=$_POST["password"];
        //$rv=["un"=>$un,"pw"=>$pw];
        //echo json_encode($rv);
        //awon ug naa ba sa database
        $dbo=new Database();
        $fdo=new coordinator();
        $rv=$fdo->verifyUser($dbo, $un, $pw);
        if($rv['status']=="ALL OK")
        {
            session_start();
            $_SESSION['current_user']=$rv['id'];
        }

        for($i=0;$i<100000;$i++)
          {
            for($j=0;$j<2000;$j++)
            {
              
            }
          }
        // kani mao ni ang response kung unsa ang status
        echo json_encode($rv);

    }
}
?>