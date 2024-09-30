<?php
$path=$_SERVER['DOCUMENT_ROOT'];
require_once $path."/Attendance Tracker/database/database.php";
require_once $path."/Attendance Tracker/database/sessionDetails.php";
require_once $path."/Attendance Tracker/database/coordinator.php";
require_once $path."/Attendance Tracker/database/buildingRegistrationDetails.php";
require_once $path."/Attendance Tracker/database/attendanceDetails.php";

  if(isset($_REQUEST['action']))
  {
    $action = $_REQUEST['action'];
    if($action=="getSession")
    {
        //mao ni ang mag kuha ug information sa database
        $dbo=new Database();
        $sobj=new SessionDetails();
        $rv=$sobj->getSession($dbo);

        //$rv=["2023 SPRING","2023 AUTUMN"];
        echo json_encode($rv);
    }
    // data: {cdrid:cdrid,sessionid:sessionid,action:"getHTE"},
    if($action=="getHTE")
    {
        //mao ni ang mag kuha ug mga HTE list sa current coordinator didto sa database
        
        $cdrid=$_POST['cdrid'];
        $sessionid=$_POST['sessionid'];
        $dbo=new Database();
        $fo=new coordinator();
        $rv=$fo->getHTEInASession($dbo,$sessionid,$cdrid);
        // $rv=[];
        echo json_encode($rv);
    }
    //   data: {cdrid:cdrid,ondate:ondate,sessionid:sessionid,classid:classid, action: "getStudentList" },
    if($action=="getStudentList")
    {
        //mao ni ang mag kuha ug mga HTE list sa current coordinator didto sa database
            
        $classid=$_POST['classid'];
        $sessionid=$_POST['sessionid'];
        $cdrid=$_POST['cdrid'];
        $ondate=$_POST['ondate'];
        $dbo=new Database();
        $crgo=new BuildingRegistrationDetails();
        $allStudents=$crgo->getRegisteredStudents($dbo,$sessionid,$classid);
        //Kuhaon ang attendance sa interns para sa current nga coordinator 
        $ado=new attendanceDetails();
        $presentStudents=$ado->getPresentListOfAClassByACDROnDate($dbo,$sessionid,$classid,$cdrid,$ondate);
        // e iterate  ang mga students ug e mark as present if naa sa presentlist
        foreach($allStudents as &$student)
        {
            $student['ispresent']='NO';// default value
            foreach($presentStudents as $presentStudent)
            {
                if($student['INTERNS_ID']==$presentStudent['INTERNS_ID'])
                {
                    $student['ispresent']='YES';
                    break;
                }
            }
        }
        // $rv=[];//para mo test
        
        echo json_encode($allStudents);
    }
    // data: {studentid:studentid,hteid:hteid,coordinatorid:coordinatorid,sessionid:sessionid,ondate:ondate, action: "saveattendance" },
    if($action=="saveattendance")
    {
        //mao ni ang mag kuha ug mga HTE list sa current coordinator didto sa database
        
        $hteid=$_POST['hteid'];
        $sessionid=$_POST['sessionid'];
        $coordinatorid=$_POST['coordinatorid'];
        $studentid=$_POST['studentid'];
        $ondate=$_POST['ondate'];
        $status=$_POST['ispresent'];
        $dbo=new Database();
        $ado=new attendanceDetails();
        $rv=$ado->saveAttendance($dbo,$sessionid,$hteid,$coordinatorid,$studentid,$ondate,$status);
        // $rv=[];
        echo json_encode($rv);
    }


  }
?>