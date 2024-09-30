/*
Para lang ni dili ko mag cge ug type

    $.ajax({
        url: "ajaxhandler/loginAjax.php",
        type: "POST",
        dataType: "json",
        data: { user_name: un, password: pw, action: "verifyUser" },
        beforeSend: function() {
            // para mo show ni siya loading

        },
        success: function(rv) {
            {
                

            }
        },
        error: function(xhr, status, error) {

        }
    });
*/
function getSessionHTML(rv)
{
    let x = ``;
    x=`<option value=-1>SELECT ONE</option>`;
    let i=0;
    for(i=0;i<rv.length;i++)
    {
        let cs = rv[i];
        x=x+ `<option value=${cs['ID']}>${cs['YEAR']+" "+cs['TERM']}</option>`;
    }

    return x;
}

function loadSeassions()
{
    $.ajax({
        url: "ajaxhandler/attendanceAJAX.php",
        type: "POST",
        dataType: "json",
        data: {action: "getSession" },
        beforeSend: function() {
            // para mo show ni siya loading

        },
        success: function(rv) {
            {
                //alert(JSON.stringify(rv));
                let x=getSessionHTML(rv);
                $("#ddlclass").html(x);

            }
        },
        error: function(xhr, status, error) {
            
            alert("OOPS!");
        }
    });
}

function getHTEHTML(classlist)
{
    let x = ``;
    x=``;
    let i=0;
    for(i=0;i<classlist.length;i++)
        {
            let cc = classlist[i];
            x=x+`<div class="classcard" data-building='${JSON.stringify(cc)}'>${cc['HTE_ID']}</div>`;
        }         
    return x;
}

function fetchTHE(cdrid,sessionid)
{
    //kuhaon tanan mga H.T.E nga gi handle sa current login coordinator
    //didto sa database gamit ang ajax call
    $.ajax({
        url: "ajaxhandler/attendanceAJAX.php",
        type: "POST",
        dataType: "json",
        data: {cdrid:cdrid,sessionid:sessionid,action:"getHTE"},
        beforeSend: function(e) {
            // para mo show ni siya loading

        },
        success: function(rv) {
            {
                // console.log(rv);
                // alert(JSON.stringify(rv));
                let  x=getHTEHTML(rv);
                $("#classlistarea").html(x);
            }
        },
        error: function(e) {
            alert("OOPS!");
        }
    });

}

 function getClassdetailsAreaHTML(building)
{
    let dobj=new Date();
    let ondate=`2024-09-11`;
    let year=dobj.getFullYear();//format ni sa data
    let month=dobj.getMonth()+1;//para sa 0-11 na months
    if(month<10)
    {
        month="0"+month;//para ma string siya
    }
    let day=dobj.getDate();//para sa 1-31 na days
    if(day<10)
        {
            day="0"+day;//para ma string siya
        }
    ondate=year+"-"+month+"-"+day;
    // alert(ondate);
    let x = `<div class="classdetails">
                <div class="code-area">${building['INDUSTRY']}</div>
                <div class="title-area">${building['NAME']}</div>
                <div class="ondate-area">
                    <input type="date" value='${ondate}' id='dtpondate'>
                </div>
            </div>`;
    return x;
}
//original
function getStudentListHTML(studentlist)
{
    let x = ` <div class="studentlist"><labe> STUDENT LIST</label></div>`;
        let i=0;
        for(i=0;i<studentlist.length;i++)
            {
                let cs = studentlist[i];
                let checkedState=``;
                if(cs['ispresent']=='YES')
                {
                    checkedState=`checked`;
                }
                x=x+`  <div class="studentdetails">
                            <div class="slno-area">${(i+1)}</div>
                            <div class="rollno-area">${cs['STUDENT_ID']}</div>       
                            <div class="name-area">${cs['NAME']}</div>
                            <div class="checkbox-area" data-studentid='${cs['INTERNS_ID']}'>
                                <input type="checkbox" class="cbpresent" data-studentid='${cs['INTERNS_ID']}' ${checkedState}>
                            </div>
                        </div>`;
            }        
    
    return x;
}

// function getStudentListHTML(students)
// {
//     console.log("getStudentListHTML called with students: " + JSON.stringify(students));
//     let html = '';
//     html += '<div class="studentlist"><label> STUDENT LIST</label></div>';
//     html += '<div class="studentdetails">';
//     html += '<div class="slno-area">INTERN ID</div>';
//     html += '<div class="rollno-area">STUDENT ID</div>';
//     html += '<div class="name-area">NAME</div>';
//     html += '<div class="checkbox-area">CHECKBOX</div>';
//     html += '</div>';
//     let i = 1;
//     for (let student of students) {
//         console.log("getStudentListHTML processing student: " + JSON.stringify(student));
//         html += '<div class="studentdetails">';
//         html += '<div class="slno-area">' + i + '</div>';
//         html += '<div class="rollno-area">' + student.STUDENT_ID + '</div>';
//         html += '<div class="name-area">' + student.NAME + '</div>';
//         html += '<div class="checkbox-area">';
//         html += '<input type="checkbox" class="cbpresent" data-studentid=" checked' + student.INTERNS_ID + '" ';
//         if (student.ispresent == "YES") {
//             html += 'checked ';
//         }
//         html += '>';
//         html += '</div>';
//         html += '</div>';
//         i++;
//     }
//     console.log("getStudentListHTML returning HTML: " + html);
//     return html;
// }


function fetchStudentList(sessionid,classid,cdrid,ondate)
{
    console.log("fetchStudentList called with sessionid: " + sessionid + ", classid: " + classid + ", cdrid: " + cdrid + ", ondate: " + ondate);
    $.ajax({
        url: "ajaxhandler/attendanceAJAX.php",
        type: "POST",
        dataType: "json",
        data: {cdrid:cdrid,ondate:ondate,sessionid:sessionid,classid:classid, action: "getStudentList" },
        beforeSend: function() {
            // para mo show ni siya loading

        },
        success: function(rv) {
            console.log("fetchStudentList success: " + JSON.stringify(rv));
            {
                // alert(JSON.stringify(rv))
                let x = getStudentListHTML(rv);
                $("#studentlistarea").html(x);
            }
        },
        error: function(xhr, status, error) {
            console.log("fetchStudentList error: " + error);
        }
    });
}

function  saveAttendance(studentid,hteid,coordinatorid,sessionid,ondate,ispresent)
{
    $.ajax({
        url: "ajaxhandler/attendanceAJAX.php",
        type: "POST",
        dataType: "json",
        data: {studentid:studentid,hteid:hteid,coordinatorid:coordinatorid,sessionid:sessionid,ondate:ondate,ispresent:ispresent, action: "saveattendance" },
        beforeSend: function() {
            // para mo show ni siya loading

        },
        success: function(rv) {
            {
                // alert(JSON.stringify(rv));
            }
        },
        error: function(xhr, status, error) {
            alert("OOPSIE FROM saveAttendance!")
        }
    });
}

// after sa  page mag loading kani na ang e call or e execute
$(function(e)
{
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
    loadSeassions();
    $(document).on("change","#ddlclass",function(e)
    {
        let si=$("#ddlclass").val();
        if(si!=-1)
        {
            //alert(si);
            let sessionid=si;
            let cdrid=$("#hiddencdrid").val();
            fetchTHE(cdrid,sessionid);
        }
    }); 
    $(document).on("click",".classcard",function(e){
        let building=$(this).data('building');
        //para ma save ang classid
        $("#hiddenSelectedHteID").val(building['HTE_ID']);
        //alert(JSON.stringify(building));
        let x = getClassdetailsAreaHTML(building);
        $("#classdetailsarea").html(x);
        let sessionid=$("#ddlclass").val();
        let classid=building['HTE_ID'];
        let cdrid=$("#hiddencdrid").val();
        let ondate=$("#dtpondate").val();
        if(sessionid!=-1)
        {
            //Diri kuhaon ang listhan sa student ana ng petsa
            fetchStudentList(sessionid,classid,cdrid,ondate);
        }
    });
    $(document).on("click",".cbpresent",function(e){
        // alert("ok");
        let ispresent=this.checked;
        //Ang ispresent kay e convert  sa boolean para ma himo ug YES or No
        if(ispresent)
        {
            ispresent="YES";
        }
        else
        {
            ispresent="NO";
        }

        // alert(ispresent);
        let studentid=$(this).data('studentid');
        let hteid=$("#hiddenSelectedHteID").val();
        let coordinatorid= $("#hiddencdrid").val();
        let sessionid=$("#ddlclass").val();
        let ondate=$("#dtpondate").val();
        // alert(studentid+"  "+hteid+" "+coordinatorid+" "+sessionid+" "+ondate);
        saveAttendance(studentid,hteid,coordinatorid,sessionid,ondate,ispresent);
    });
});