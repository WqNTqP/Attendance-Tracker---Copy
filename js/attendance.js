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
let currentHteId;
let currentSessionId;



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
            x=x+`<div class="classcard" data-building='${JSON.stringify(cc)}'>${cc['NAME']}</div>`;
        }         
    return x;
}

function fetchTHE(cdrid,sessionid)
{   console.log("Fetching THE for session:", sessionid);
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
            console.error("Error fetching THE:", e);
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



// function getStudentListHTML(studentList) {
//     let x = `<div class="studentlist"><label>STUDENT LIST</label></div>`;
//     x += `<div class="studentdetails header-row">`;
//     x += `<div class="slno-area">INT.NO.</div>`;
//     x += `<div class="rollno-area">Student ID</div>`;
//     x += `<div class="name-area">Name</div>`;
//     x += `<div class="timein-area">Time In</div>`;
//     x += `<div class="timeout-area">Time Out</div>`;
//     x += `</div>`; // close header-row div

//     for (let i = 0; i < studentList.length; i++) {
//         let cs = studentList[i];
//         x += `<div class="studentdetails">`;
//         x += `<div class="slno-area">${(i + 1)}</div>`;
//         x += `<div class="rollno-area">${cs['STUDENT_ID']}</div>`;
//         x += `<div class="name-area">${cs['NAME']}</div>`;
//         x += `<div class="timein-area" data-studentid='${cs['INTERNS_ID']}'>`;
//         x += `<input type="time" class="cbtimein" data-studentid='${cs['INTERNS_ID']}' value='${cs['timein']}'>`;
//         x += `</div>`;
//         x += `<div class="timeout-area" data-studentid='${cs['INTERNS_ID']}'>`;
//         x += `<input type="time" class="cbtimeout" data-studentid='${cs['INTERNS_ID']}' value='${cs['timeout']}'>`;
//         x += `</div>`;
//         x += `</div>`; // close studentdetails div
//     }

//     // Create the report and add buttons
//     // REPORT button section
//     x += `<div class="reportsection">`;
//     x += `<div id="btnReport" class="report-buttons">`;
//     x += `<button>REPORT</button>`;
//     x += `</div>`; // close report-buttons div
//     x += `</div>`; // close reportsection div

//     // ADD button section
//     x += `<div class="reportsection">`;
//     x += `<button id="btnAdd" class="btnAdd">ADD STUDENT</button>`; // ADD button
//     x += `</div>`; // close reportsection div

//     // ADD HTE button section
//     x += `<div class="reportsection">`;
//     x += `<button id="btnAddHTE" class="btnAddHTE">ADD NEW HTE</button>`; // ADD HTE button
//     x += `</div>`; // close reportsection div

//     // Add Student Form
//     x += `<div id="addStudentForm" class="modal" style="display:none;">`; // Initially hidden
//     x += `<form id="studentForm">`;
//     x += `<h2>Add Student</h2>`;
//     x += `<label for="internId">Intern ID:</label>`;
//     x += `<input type="number" id="internId" name="internId" required>`; // New field for Intern ID
//     x += `<label for="studentId">Student ID:</label>`;
//     x += `<input type="text" id="studentId" name="studentId" required>`;
//     x += `<label for="name">Name:</label>`;
//     x += `<input type="text" id="name" name="name" required>`;
//     x += `<label for="age">Age:</label>`;
//     x += `<input type="number" id="age" name="age" required>`;
//     x += `<label for="gender">Gender:</label>`;
//     x += `<select id="gender" name="gender" required>`;
//     x += `<option value="Male">Male</option>`;
//     x += `<option value="Female">Female</option>`;
//     x += `</select>`;
//     x += `<label for="email">Email:</label>`;
//     x += `<input type="email" id="email" name="email" required>`;
//     x += `<label for="contactNumber">Contact Number:</label>`;
//     x += `<input type="text" id="contactNumber" name="contactNumber" required>`;
//     x += `<button type="submit">Submit</button>`;
//     x += `<button type="button" id="closeForm">Close</button>`;
//     x += `</form>`;
//     x += `</div>`; // Close addStudentForm div
    
//     // Add HTE Form
//     x += `<div id="addHTEForm" class="modal" style="display:none;">`;
//     x += `<form id="hteForm">`;
//     x += `<h2>Add New HTE</h2>`;
//     x += `<label for="hteName">Name:</label>`;
//     x += `<input type="text" id="hteName" name="hteName" required>`;
//     x += `<label for="hteIndustry">Industry:</label>`;
//     x += `<input type="text" id="hteIndustry" name="hteIndustry" required>`;
//     x += `<label for="hteAddress">Address:</label>`;
//     x += `<input type="text" id="hteAddress" name="hteAddress" required>`;
//     x += `<label for="hteEmail">Contact Email:</label>`;
//     x += `<input type="email" id="hteEmail" name="hteEmail" required>`;
//     x += `<label for="hteContactPerson">Contact Person:</label>`;
//     x += `<input type="text" id="hteContactPerson" name="hteContactPerson" required>`;
//     x += `<label for="hteContactNumber">Contact Number:</label>`;
//     x += `<input type="text" id="hteContactNumber" name="hteContactNumber" required>`;
//     x += `<button type="submit">Submit</button>`;
//     x += `<button type="button" id="closeHTEForm">Close</button>`;
//     x += `</form>`;
//     x += `</div>`; // Close addHTEForm div

//     return x;
// }



///////////////////////////

function getStudentListHTML(studentList) {
    let x = `<div class="studentlist"><label>STUDENT LIST</label></div>`;
    if (studentList && studentList.length > 0) {
        x += `<div class="studentdetails header-row">`;
        x += `<div class="slno-area">INT.NO.</div>`;
        x += `<div class="rollno-area">Student ID</div>`;
        x += `<div class="name-area">Name</div>`;
        x += `<div class="timein-area">Time In</div>`;
        x += `<div class="timeout-area">Time Out</div>`;
        x += `</div>`; // close header-row div

        studentList.forEach((cs, index) => {
            x += `<div class="studentdetails">`;
            x += `<div class="slno-area">${index + 1}</div>`;
            x += `<div class="rollno-area">${cs['STUDENT_ID']}</div>`;
            x += `<div class="name-area">${cs['NAME']}</div>`;
            x += `<div class="timein-area" data-studentid='${cs['INTERNS_ID']}'>`;
            x += `<input type="time" class="cbtimein" data-studentid='${cs['INTERNS_ID']}' value='${cs['timein']}'>`;
            x += `</div>`;
            x += `<div class="timeout-area" data-studentid='${cs['INTERNS_ID']}'>`;
            x += `<input type="time" class="cbtimeout" data-studentid='${cs['INTERNS_ID']}' value='${cs['timeout']}'>`;
            x += `</div>`;
            x += `</div>`; // close studentdetails div
        });
    } else {
        x += `<p>No students found.</p>`;
    }

    // Create the report and add buttons
    x += `<div class="reportsection">`;
    x += `<div id="btnReport" class="report-buttons">`;
    x += `<button>REPORT</button>`;
    x += `</div>`; // close report-buttons div
    x += `</div>`; // close reportsection div

    x += `<div class="reportsection">`;
    x += `<button id="btnAdd" class="btnAdd">ADD STUDENT</button>`; // ADD button
    x += `</div>`; // close reportsection div

    // Add HTE button
    x += `<div class="reportsection">`;
    x += `<button id="btnAddHTE" class="btnAddHTE">ADD NEW HTE</button>`; // ADD HTE button
    x += `</div>`; // close reportsection div

    // Add Student Form
    x += generateAddStudentForm();
    
    // Add HTE Form
    x += generateAddHTEForm();

    // x += generateCoordinatorDetailsHTML();

    return x;
}

function generateAddStudentForm() {
    return `
        <div id="addStudentForm" class="modal" style="display:none;">
            <form id="studentForm">
                <h2>Add Student</h2>

                <div class="form-group">
                    <label for="studentId">Student ID:</label>
                    <input type="text" id="studentId" name="studentId" required>
                </div>
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="age">Age:</label>
                    <input type="number" id="age" name="age" required>
                </div>
                <div class="form-group">
                    <label for="gender">Gender:</label>
                    <select id="gender" name="gender" required>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="contactNumber">Contact Number:</label>
                    <input type="text" id="contactNumber" name="contactNumber" required>
                </div>
                <button type="submit">Submit</button>
                <button type="button" id="closeForm">Close</button>
            </form>
        </div>
    `;
}


function generateAddHTEForm() {
    return `
        <div id="addHTEForm" class="modal" style="display:none;">
            <form id="hteForm">
                <h2>Add New HTE</h2>
                <div class="form-group">
                    <label for="hteName">Name:</label>
                    <input type="text" id="hteName" name="NAME" required> <!-- Updated -->
                </div>
                <div class="form-group">
                    <label for="hteIndustry">Industry:</label>
                    <input type="text" id="hteIndustry" name="INDUSTRY" required> <!-- Updated -->
                </div>
                <div class="form-group">
                    <label for="hteAddress">Address:</label>
                    <input type="text" id="hteAddress" name="ADDRESS" required> <!-- Updated -->
                </div>
                <div class="form-group">
                    <label for="hteEmail">Contact Email:</label>
                    <input type="email" id="hteEmail" name="CONTACT_EMAIL" required> <!-- Updated -->
                </div>
                <div class="form-group">
                    <label for="hteContactPerson">Contact Person:</label>
                    <input type="text" id="hteContactPerson" name="CONTACT_PERSON" required> <!-- Updated -->
                </div>
                <div class="form-group">
                    <label for="hteContactNumber">Contact Number:</label>
                    <input type="text" id="hteContactNumber" name="CONTACT_NUMBER" required> <!-- Updated -->
                </div>
                <button type="submit">Submit</button>
                <button type="button" id="closeHTEForm">Close</button>
            </form>
        </div>
    `;
}

function generateCoordinatorDetailsHTML(data) {
    return `
        <div id="coordinatorDetailsModal" class="modal" style="display:block;">
            <div class="modal-content">
                <h2>Coordinator Details</h2>
                <div class="form-group">
                    <label>COORDINATOR ID:</label>
                    <span>${data.COORDINATOR_ID}</span>
                </div>
                <div class="form-group">
                    <label>Name:</label>
                    <span>${data.NAME}</span>
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <span>${data.EMAIL}</span>
                </div>
                <div class="form-group">
                    <label>Contact Number:</label>
                    <span>${data.CONTACT_NUMBER}</span>
                </div>
                <div class="form-group">
                    <label>Department:</label>
                    <span>${data.DEPARTMENT}</span>
                </div>
                <button type="button" id="closeCoordinatorDetails">Close</button>
            </div>
        </div>
    `;
}


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

// function  saveAttendance(studentid,hteid,coordinatorid,sessionid,ondate,ispresent)
// {
//     $.ajax({
//         url: "ajaxhandler/attendanceAJAX.php",
//         type: "POST",
//         dataType: "json",
//         data: {studentid:studentid,hteid:hteid,coordinatorid:coordinatorid,sessionid:sessionid,ondate:ondate,ispresent:ispresent, action: "saveattendance" },
//         beforeSend: function() {
//             // para mo show ni siya loading

//         },
//         success: function(rv) {
//             {
//                 // alert(JSON.stringify(rv));
//             }
//         },
//         error: function(xhr, status, error) {
//             alert("OOPSIE FROM saveAttendance!")
//         }
//     });
// }

// function downloadCSV(sessionid,classid,cdrid)
// {
//     $.ajax({
//         url: "ajaxhandler/attendanceAJAX.php",
//         type: "POST",
//         dataType: "json",
//         data: { sessionid:sessionid,classid:classid,cdrid:cdrid,action: "downloadReport" },
//         beforeSend: function() {
//             // para mo show ni siya loading
//         },
//         success: function(rv) 
//         {
//             var a = document.createElement('a');
//             a.href = rv['filename'];
//             a.download = 'attendance_report.csv';
//             a.click();
//         },
//         error: function(xhr, status, error) {
//             console.log("Error: " + error);
//             alert("OOOPS FROM  downloadCSV!")
//         }
//     });
// }

// after sa  page mag loading kani na ang e call or e execute

function  saveAttendance(studentid,hteid,coordinatorid,sessionid,ondate,timein,timeout)
{
    $.ajax({
        url: "ajaxhandler/attendanceAJAX.php",
        type: "POST",
        dataType: "json",
        data: {studentid:studentid,hteid:hteid,coordinatorid:coordinatorid,sessionid:sessionid,ondate:ondate,timein:timein,timeout:timeout, action: "saveattendance" },
        beforeSend: function() {
            // para mo show ni siya loading
        },
        success: function(rv) {
            if(rv[0] == 1) {
                alert("Attendance saved successfully!");
            } else {
                alert("Error saving attendance: " + rv[0]);
            }
        },
        error: function(xhr, status, error) {
            alert("OOPSIE FROM saveAttendance! " + error);
        }
    });
}


function downloadPDF(sessionid, classid, cdrid) {
    $.ajax({
        url: "ajaxhandler/attendanceAJAX.php",
        type: "POST",
        dataType: "json",
        data: { 
            sessionid: sessionid, 
            classid: classid, 
            cdrid: cdrid, 
            ondate: $("#dtpondate").val(), 
            action: "downloadReport" 
        },
        beforeSend: function() {
            console.log("Downloading PDF...");
        },
        success: function(rv) {
            console.log(rv);
            if (rv.filename) {
                var a = document.createElement('a');
                a.href = "ajaxhandler/" + rv.filename;
                a.download = 'attendance_report.pdf';
                a.click();
            } else {
                console.log("Error: No filename returned");
            }
        },
        error: function(xhr, status, error) {
            console.log("Error: " + error);
        }
    });
}

// function downloadPDF(sessionid, classid, cdrid) {
//     $.ajax({
//         url: "ajaxhandler/attendanceAJAX.php",
//         type: "POST",
//         dataType: "json",
//         data: { 
//             sessionid: sessionid, 
//             classid: classid, 
//             cdrid: cdrid, 
//             ondate: $("#dtpondate").val(), 
//             action: "downloadReport" 
//         },
//         beforeSend: function() {
//             console.log("Downloading PDF...");
//         },
//         success: function(rv) {
//             console.log(rv);
//             if (rv.filename) {
//                 var a = document.createElement('a');
//                 a.href = "ajaxhandler/" + rv.filename; // Ensure this returns a PDF
//                 a.download = 'attendance_report.pdf'; // Update the filename extension to .pdf
//                 a.click();
//             } else {
//                 console.log("Error: No filename returned");
//             }
//         },
//         error: function(xhr, status, error) {
//             console.log("Error: " + error);
//         }
//     });
// }


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
    // $(document).on("change", "#ddlclass", function(e) {
    //     currentSessionId = $(this).val();
    //     $("#classlistarea").html(``);
    //     $("#classdetailsarea").html(``);
    //     $("#studentlistarea").html(``);
    //     if (currentSessionId != -1) {
    //         let cdrid = $("#hiddencdrid").val();
    //         fetchTHE(cdrid, currentSessionId);
    //     }
    // });


    // $(document).on("click",".classcard",function(e){
    //     let building=$(this).data('building');
    //     //para ma save ang classid
    //     $("#hiddenSelectedHteID").val(building['HTE_ID']);
    //     //alert(JSON.stringify(building));
    //     let x = getClassdetailsAreaHTML(building);
    //     $("#classdetailsarea").html(x);
    //     let sessionid=$("#ddlclass").val();
    //     let classid=building['HTE_ID'];
    //     let cdrid=$("#hiddencdrid").val();
    //     let ondate=$("#dtpondate").val();
    //     if(sessionid!=-1)
    //     {
    //         //Diri kuhaon ang listhan sa student ana ng petsa
    //         fetchStudentList(sessionid,classid,cdrid,ondate);
    //     }
    // });
    
    $(document).on("change", "#ddlclass", function(e) {
        currentSessionId = $(this).val();
        $("#classlistarea").html(``);
        $("#classdetailsarea").html(``);
        if (currentSessionId != -1) {
            let cdrid = $("#hiddencdrid").val();
            fetchTHE(cdrid, currentSessionId); // Fetch HTEs for the selected session
            // Display student list area with only Add HTE button enabled
            $("#studentlistarea").html(getStudentListHTML([]));
        } else {
            $("#studentlistarea").html(``);
        }
    });

    $(document).on("click", ".classcard", function(e ) {
        let building = $(this).data('building');
        currentHteId = building['HTE_ID'];
        $("#hiddenSelectedHteID").val(currentHteId);
        let x = getClassdetailsAreaHTML(building);
        $("#classdetailsarea").html(x);
        let cdrid = $("#hiddencdrid").val();
        let ondate = $("#dtpondate").val();
        if (currentSessionId != -1) {
            fetchStudentList(currentSessionId, currentHteId, cdrid, ondate);
        }
    });


    // $(document).on("click", ".classcard", function(e) {
    //     let building = $(this).data('building');
    //     currentHteId = building['HTE_ID'];
    //     $("#hiddenSelectedHteID").val(currentHteId);
    //     let x = getClassdetailsAreaHTML(building);
    //     $("#classdetailsarea").html(x);
    //     let cdrid = $("#hiddencdrid").val();
    //     let ondate = $("#dtpondate").val();
    //     if (currentSessionId != -1) {
    //         fetchStudentList(currentSessionId, currentHteId, cdrid, ondate);
    //     }
    // });


    $(document).on("click",".cbpresent",function(e){
        let studentid=$(this).data('studentid');
        let hteid=$("#hiddenSelectedHteID").val();
        let coordinatorid= $("#hiddencdrid").val();
        let sessionid=$("#ddlclass").val();
        let ondate=$("#dtpondate").val();
        let timein = $(this).closest(".studentdetails").find(".cbtimein").val();
        let timeout = $(this).closest(".studentdetails").find(".cbtimeout").val();
        if(timein === undefined || timein === null || timein === ""){
            timein = "";
        }
        if(timeout === undefined || timeout === null || timeout === ""){
            timeout = "";
        }
        saveAttendance(studentid, hteid, coordinatorid, sessionid, ondate, timein, timeout);
    });

    $(document).on("change", ".cbtimein", function() {
        let studentid = $(this).data('studentid');
        let hteid = $("#hiddenSelectedHteID").val();
        let coordinatorid = $("#hiddencdrid").val();
        let sessionid = $("#ddlclass").val();
        let ondate = $("#dtpondate").val();
        let timein = $(this).val();
        let timeout = $(this).closest(".studentdetails").find(".cbtimeout").val();
    
        saveAttendance(studentid, hteid, coordinatorid, sessionid, ondate, timein, timeout);
    });
    
    $(document).on("change", ".cbtimeout", function() {
        let studentid = $(this).data('studentid');
        let hteid = $("#hiddenSelectedHteID").val();
        let coordinatorid = $("#hiddencdrid").val();
        let sessionid = $("#ddlclass").val();
        let ondate = $("#dtpondate").val();
        let timein = $(this).closest(".studentdetails").find(".cbtimein").val();
        let timeout = $(this).val();
    
        saveAttendance(studentid, hteid, coordinatorid, sessionid, ondate, timein, timeout);
    });

    $(document).on("change","#dtpondate",function(e){
        // alert($("#dtpondate").val());
        // para ni sa status sa student ana nga date present or absent
        let sessionid=$("#ddlclass").val();
        let classid= $("#hiddenSelectedHteID").val();
        let cdrid=$("#hiddencdrid").val();
        let ondate=$("#dtpondate").val();
        if(sessionid!=-1)
        {
            //Diri kuhaon ang listhan sa student ana ng petsa
            fetchStudentList(sessionid,classid,cdrid,ondate);
        }
    });
    $(document).on("click", "#btnReport", function() {
        if (currentSessionId != -1 && currentHteId) {
            let cdrid = $("#hiddencdrid").val();
            downloadPDF(currentSessionId, currentHteId, cdrid);
        } else {
            alert("Please select an HTE first.");
        }
    });
    


    $(document).ready(function() {
        // Show add student form when "ADD" button is clicked
        $(document).on("click", ".btnAdd", function(e) {
            e.preventDefault();
            let hteId = $("#hiddenSelectedHteID").val();
            
            if (!hteId || hteId === "") {
                alert("Please Select HTE Before Adding Student");
                return;
            }
            
            // If HTE is selected, show the add student form
            $("#addStudentForm").show();
        });

        // Handle the form submission
        $(document).on("submit", "#studentForm", function(e) {
            e.preventDefault();
        
            if (!currentHteId || currentHteId === "") {
                alert("Please select an HTE before adding a student.");
                return;
            }
        
            if (!currentSessionId || currentSessionId === "-1") {
                alert("Please select a session before adding a student.");
                return;
            }
        
            let formData = $(this).serialize();
            formData += "&action=addStudent&hteId=" + currentHteId + "&sessionId=" + currentSessionId;
        
            console.log("Form data being sent:", formData);
        
            $.ajax({
                url: "ajaxhandler/attendanceAJAX.php",
                type: "POST",
                data: formData,
                dataType: "json",
                success: function(response) {
                    console.log("Server response:", response);
                    if (response.success) {
                        alert("Student added successfully!");
                        $("#addStudentForm").hide();
                        // Refresh the student list
                        let cdrid = $("#hiddencdrid").val();
                        let ondate = $("#dtpondate").val();
                        fetchStudentList(currentSessionId, currentHteId, cdrid, ondate);
                        // Clear the form
                        $("#studentForm")[0].reset();
                    } else {
                        console.error( response.message);
                        alert( response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error("AJAX error:", status, error);
                    console.log("Response text:", xhr.responseText);
                    let errorMessage = "An error occurred while adding the student.";
                    try {
                        let errorResponse = JSON.parse(xhr.responseText);
                        if (errorResponse.message) {
                            errorMessage = errorResponse.message;
                        }
                    } catch (e) {
                        console.error("Error parsing error response:", e);
                    }
                    alert("Error: " + errorMessage + "\nPlease check the console for more details.");
                }
            });
        });
        
        // Close form when "Close" button is clicked
        $(document).on("click", "#closeForm", function(e) {
            $("#addStudentForm").hide();
            // Clear the form
            $("#studentForm")[0].reset();
        });
    });
    

    
    $(document).ready(function() {
        // Show add HTE form when "ADD" button is clicked
        $(document).on("click", ".btnAddHTE", function(e) {
            e.preventDefault();
            $("#addHTEForm").show();
        });
    
        // Handle the form submission
        $(document).on("submit", "#hteForm", function(e) {
            e.preventDefault();
            let formData = $(this).serialize();
            formData += "&action=addHTE&sessionId=" + currentSessionId;
        
            console.log("Form data being sent:", formData);
        
            $.ajax({
                url: "ajaxhandler/attendanceAJAX.php",
                type: "POST",
                data: formData,
                dataType: "json",
                success: function(response) {
                    console.log("Server response:", response);
                    if (response.success) {
                        alert("HTE added successfully!");
                        $("#addHTEForm").hide();
                        // Refresh the HTE list if needed
                        // You might want to call a function like fetchHTEList() here
                    } else {
                        console.error("Error adding HTE:", response.message);
                        alert(response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error("AJAX error:", status, error);
                    console.log("Response text:", xhr.responseText);
                    alert("Error adding HTE: " + error + "\nCheck console for more details.");
                }
            });
        });
    
        // Close form when "Close" button is clicked
        $(document).on("click", "#closeHTEForm", function(e) {
            $("#addHTEForm").hide();
        });
    });
    
    



    $(document).ready(function() {
        $(document).on("click", "#btnShowCoordinator", function() {
            console.log("Button clicked");
            let cdrid = $("#hiddencdrid").val();
            console.log("CDRID:", cdrid);
            
            if (!cdrid) {
                console.log("No CDRID found");
                alert("Coordinator ID not found.");
                return;
            }
    
            $.ajax({
                url: "ajaxhandler/attendanceAJAX.php",
                type: "POST",
                dataType: "json",
                data: {cdrid: cdrid, action: "getCoordinatorDetails"},
                success: function(response) {
                    console.log("AJAX Success:", response);
                    if (response.success) {
                        displayCoordinatorDetails(response.data);
                    } else {
                        console.error("Error in response:", response.message);
                        alert("Error: " + (response.message || "Unknown error occurred."));
                    }
                },
                error: function(xhr, status, error) {
                    console.error("AJAX error:", status, error);
                    console.log("Response Text:", xhr.responseText);
                    alert("Error fetching coordinator details. Please check the console for more information.");
                }
            });
        });
    
        function displayCoordinatorDetails(coordinatorData) {
            console.log("Displaying coordinator details:", coordinatorData);
            
            // Generate and append the modal HTML
            $('body').append(generateCoordinatorDetailsHTML(coordinatorData));
            
            // Show the modal
            $("#coordinatorDetailsModal").show();
        }
    
        // Event delegation for closing the coordinator details modal
        $(document).on("click", "#closeCoordinatorDetails", function() {
            $("#coordinatorDetailsModal").remove();
        });
    });





});