
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
///////

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
            x += `<div class="name-area">`;
            x += `${cs['NAME']} `;
            // x += `<button class="btnEdit" data-studentid="${cs['INTERNS_ID']}">Edit</button>`;
            x += `<button class="btnDelete" data-studentid="${cs['INTERNS_ID']}">Delete</button>`;
            x += `</div>`; // close name-area div
            
            // Convert time to AM/PM format for timein and timeout, or display '--:-- --' if empty
            const formatTime = (time) => {
                if (!time) return '--:-- --'; // Return '--:-- --' if time is empty
        
                let [hours, minutes] = time.split(':');
                let suffix = 'AM';
                hours = parseInt(hours);
        
                if (hours >= 12) {
                    suffix = 'PM';
                    if (hours > 12) hours -= 12; // Convert to 12-hour format
                } else if (hours === 0) {
                    hours = 12; // Midnight case
                }
        
                return `${hours}:${minutes} ${suffix}`;
            };
        
            x += `<div class="timein-area" data-studentid='${cs['INTERNS_ID']}'>`;
            x += `<span class="cbtimein">${formatTime(cs['timein'])}</span>`;
            x += `</div>`;
            
            x += `<div class="timeout-area" data-studentid='${cs['INTERNS_ID']}'>`;
            x += `<span class="cbtimeout">${formatTime(cs['timeout'])}</span>`;
            x += `</div>`;
            
            x += `</div>`; // close studentdetails div
        });
        
    } else {
        x += `<p>No students found.</p>`;
    }
    // Create the report and add buttons
    x += `<div class="reportsection">`;
    x += `<button id="btnReport" class="common-button btnReport">REPORT</button>`;
    x += `</div>`; // close report-buttons div
    x += `</div>`; // close reportsection div

    x += `<div class="reportsection">`;
    x += `<button id="btnAdd" class="common-button btnAdd">STUDENT</button>`; // ADD button
    x += `</div>`; // close reportsection div

    // Add HTE button
    x += `<div class="reportsection">`;
    x += `<button id="btnAddHTE" class="common-button btnAddHTE">ADD HTE</button>`; // ADD HTE button
    x += `</div>`; // close reportsection div

    x += `<div class="reportsection">`;
    x += `<button id="btnDeleteHTE" class="common-button btnDeleteHTE" data-hteid="${currentHteId}" data-sessionid="${currentSessionId}">DELETE</button>`; // DELETE HTE button
    x += `</div>`; // close reportsection div

    // Add Student Form
    x += generateAddStudentForm();

    // Add HTE Form
    x += generateAddHTEForm();

    x += generateAddCoordinatorForm();

    return x;
}


function generateAddStudentForm() {
    return `
        <div id="addStudentForm" class="modal" style="display:none;">
            <form id="studentForm" method="POST" enctype="multipart/form-data">
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

                <!-- New Section for CSV Upload -->
                <div class="form-group">
                    <label for="csvFile">Upload CSV File:</label>
                    <input type="file" id="csvFile" name="csvFile" accept=".csv">
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
                <button type="button" id="btnAddCoordinator" class="common-button">Add New Coordinator/Admin</button>
                <button type="button" id="closeCoordinatorDetails">Close</button>
            </div>
        </div>
    `;
}


function generateAddCoordinatorForm() {
    return `
        <div id="addCoordinatorForm" class="modal" style="display:none;">
            <form id="coordinatorForm">
                <h2>Add New Coordinator/Admin</h2>
                <div class="form-group">
                    <label for="coordinatorId">Coordinator ID:</label>
                    <input type="text" id="coordinatorId" name="coordinatorId" placeholder="Enter Coordinator ID" required>
                </div>

                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name1" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email1" name="email" required>
                </div>
                <div class="form-group">
                    <label for="contactNumber">Contact Number:</label>
                    <input type="text" id="contactNumber1" name="contactNumber" required>
                </div>
                <div class="form-group">
                    <label for="department">Department:</label>
                    <input type="text" id="department" name="department" required>
                </div>
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-group">
                    <label for="role">Role:</label>
                    <select id="role" name="role" required>
                        <option value="COORDINATOR">Coordinator</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>

                <!-- HTE Dropdown Container -->
                <div id="hteDropdownContainer" style="display:none;">
                    <label for="hteSelect">Select HTE:</label>
                    <select id="hteSelect" name="hteId">
                        <!-- HTE options will be populated here -->
                    </select>
                </div>

                <button type="submit">ADD</button>
                <button type="button" id="closeCoordinatorForm">Close</button>
            </form>
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
            // console.log("fetchStudentList success: " + JSON.stringify(rv));
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
  
    $(document).on("change", "#ddlclass", function(e) {
        currentSessionId = $(this).val();
        $("#hiddenSelectedSessionId").val(currentSessionId);
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

        let sessionid=$("#ddlclass").val();
        let classid= $("#hiddenSelectedHteID").val();
        let cdrid=$("#hiddencdrid").val();
        let ondate=$("#dtpondate").val();
        if(sessionid!=-1)
        {
        
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
        $(document).on("click", ".btnAdd", function(e) {
            e.preventDefault();
            let hteId = $("#hiddenSelectedHteID").val();
    
            if (!hteId || hteId === "") {
                alert("Please Select HTE Before Adding Student");
                return;
            }
            $("#addStudentForm").show();
        });
    


        // $(document).on("submit", "#studentEditForm", function(e) {
        //     e.preventDefault(); // Prevent the default form submission
        
        //     // Get the student ID from the form (should be populated)
        //     var studentId = $("#editStudentId").val();
        //     console.log("Student ID before submission:", studentId); // Debug: Check if studentId is populated
        
        //     // Ensure studentId is not empty
        //     if (!studentId) {
        //         alert("Student ID is required!");
        //         return; // Stop the submission if the student ID is missing
        //     }
        
        //     // Serialize the form data, including the studentId
        //     var formData = $(this).serialize();
        //     console.log("Serialized Form Data:", formData); // Debug: Check serialized form data
        
        //     // Ensure the action is appended to the form data
        //     formData += "&action=updateStudent"; 
        
        //     // Log the final form data before sending the request
        //     console.log("Final Form Data:", formData); 
        
        //     // Send AJAX request to update student details
        //     $.ajax({
        //         url: 'ajaxhandler/coordinatorEditStudentAjax.php',
        //         type: 'POST',
        //         data: formData,
        //         dataType: 'json',
        //         success: function(response) {
        //             if (response.status === 'success') {
        //                 alert("Student details updated successfully!");
        //                 $("#editStudentForm").hide(); // Hide the modal after successful update
        //                 loadStudentDetails(studentId); // Optionally refresh the student details
        //             } else {
        //                 alert("Error: " + response.message);
        //             }
        //         },
        //         error: function(xhr, status, error) {
        //             alert("An error occurred: " + error);
        //         }
        //     });
        // });
        
        
        
        $(document).on("submit", "#studentForm", function(e) {
            e.preventDefault(); // Prevent the default form submission
        
            let studentId = $("#studentId").val();  // Ensure this is correctly populated
            let action = studentId ? "updateStudent" : "addStudent"; // Determine action based on studentId
        
            var formData = new FormData(this);
            formData.append('hte_id', $("#hiddenSelectedHteID").val());
            formData.append('session_id', $("#hiddenSelectedSessionId").val());
            formData.append('action', action);  // Append action to FormData
            formData.append('student_id', studentId); // Append studentId for update
        
            // Check if a CSV file is selected
            if ($("#csvFile").get(0).files.length > 0) {
                console.log($("#csvFile").get(0).files); // Log selected files
                $("#studentForm input, #studentForm select").prop("disabled", true); // Disable form inputs during submission
        
                // AJAX request to upload CSV
                $.ajax({
                    url: "ajaxhandler/uploadCSV.php",
                    type: "POST",
                    data: formData,
                    contentType: false, // Important for file uploads
                    processData: false, // Important for file uploads
                    success: function(response) {
                        if (response.success) {
                            alert("Students added successfully from CSV!");
                            $("#addStudentForm").hide(); // Hide the form after success
                            let cdrid = $("#hiddencdrid").val();
                            let ondate = $("#dtpondate").val();
                            fetchStudentList(currentSessionId, currentHteId, cdrid, ondate); // Refresh the student list
                        } else {
                            alert(response.message); // Show error message
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("Error uploading CSV:", error);
                        alert("An error occurred while uploading the CSV file. Please check the console for details.");
                    }
                });
            } else {
                // Check if HTE and Session are selected
                // Handle single student addition
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
                        
                            let cdrid = $("#hiddencdrid").val();
                            let ondate = $("#dtpondate").val();
                            fetchStudentList(currentSessionId, currentHteId, cdrid, ondate);
             
                            $("#studentForm")[0].reset();
                        } else {
                            console.error(response.message);
                            alert(response.message);
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
            }
        });      

        $(document).on("click", "#closeForm", function() {
            if ($("#addStudentForm").is(":visible")) {
                $("#addStudentForm").hide();
                $("#studentForm")[0].reset();
                $("#studentForm input, #studentForm select").prop("disabled", false);
            }
        });
    
        $(document).on("change", "#csvFile", function() {
            $("#studentForm input[type='text'], #studentForm input[type='number'], #studentForm input[type='email'], #studentForm select").prop("disabled", $(this).get(0).files.length > 0);
        });
    });
    
    


    
    $(document).ready(function() {

        $(document).on("click", ".btnAddHTE", function(e) {
            e.preventDefault();
            $("#addHTEForm").show();
        });
    

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
                    console.log("Server Response:", response); // Log the raw response
                    if (response.success) {
                        alert("HTE added successfully! ");
                        $("#addHTEForm").hide();
                    } else {
                        alert("Error adding HTE: " + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error("AJAX error:", status, error);
                    console.log("Response text:", xhr.responseText); // Log the response text for debugging
                    alert("Error adding HTE: " + error + "\nCheck console for more details.");
                }
            });
        });
    
    
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
            
          
            $('body').append(generateCoordinatorDetailsHTML(coordinatorData));
            
        
            $("#coordinatorDetailsModal").show();
        }
    
    
        $(document).on("click", "#closeCoordinatorDetails", function() {
            $("#coordinatorDetailsModal").remove();
        });
    });


    $(document).on("click", ".btnDelete", function() {
        let studentId = $(this).data('studentid'); 
        if (confirm("Are you sure you want to delete this student?")) { 
            deleteStudent(studentId); 
        }
    });

    function deleteStudent(studentId) {
        $.ajax({
            url: "ajaxhandler/attendanceAJAX.php", // URL to your AJAX handler
            type: "POST",
            dataType: "json",
            data: {
                studentId: studentId,
                action: "deleteStudent" // Specify the action to be performed
            },
            success: function(response) {
                if (response.success) {
                    alert("Student deleted successfully!");
                    // Automatically refresh the list after successful deletion
                    fetchStudentList(currentSessionId, currentHteId, cdrid, ondate); // Refresh the list
                } else {
                    alert("Error deleting student: " + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error("Error deleting student:", error);
                alert("An error occurred while deleting the student.");
            }
        });
    }

///////////////////////////////////

$(document).on("click", ".btnDeleteHTE", function () {
    const hteId = $(this).data("hteid");
    const sessionId = $(this).data("sessionid");

    // Log to verify the values of hteId and sessionId
    console.log("HTE ID:", hteId);
    console.log("Session ID:", sessionId);

    if (!hteId || !sessionId) {
        alert("HTE ID or Session ID not found!");
        return;
    }

    // Proceed with the AJAX request if both values are valid
    $('#hiddenSelectedHteID').val(hteId);
    $('#hiddenSelectedSessionId').val(sessionId);

    if (confirm("Are you sure you want to delete this HTE and all associated students?")) {
        $.ajax({
            url: "ajaxhandler/attendanceAJAX.php",
            type: "POST",
            data: {
                action: "deleteHTE",
                hteId: hteId,
                sessionId: sessionId,
            },
            success: function(response) {
                console.log("Server Response: ", response);  // Log the response to check what it contains

                if (typeof response === 'string') {
                    try {
                        const result = JSON.parse(response);  // Parse if it's a string
                        handleResponse(result);
                    } catch (e) {
                        console.error('Error parsing response:', e);
                        alert('Error: Unable to parse server response');
                    }
                } else {
                    // If it's already an object, just pass it to the handler
                    handleResponse(response);
                }
            },
            error: function (xhr, status, error) {
                // alert("AJAX Error: " + error);
            },
        });

        function handleResponse(result) {
            if (result.success) {
                alert(result.message); // Success message

                // Remove HTE row from the frontend
                // Assuming the HTML structure has an element with id `hteRow_${hteId}`
                $('#hteRow_' + hteId).remove(); // Adjust the selector based on your HTML structure

                // Optionally, fetch and update the student list to ensure data is in sync
                fetchUpdatedStudentList();
            } else {
                alert("Error: " + result.message);
            }
        }

        function fetchUpdatedStudentList() {
            // Assuming you have a function to fetch and update the student list
            $.ajax({
                url: "ajaxhandler/attendanceAJAX.php",
                type: "POST",
                data: {
                    action: "fetchStudentList",
                    sessionId: sessionId,
                    classId: $("#classId").val(),  // Assuming classId is available
                    cdrid: $("#cdrid").val(),  // Assuming cdrid is available
                    ondate: $("#ondate").val(),  // Assuming ondate is available
                },
                success: function(response) {
                    if (response && response.success) {
                        // Update the student list UI based on the new data
                        $('#studentListContainer').html(getStudentListHTML(response.studentList));
                    } else {
                        alert("Error fetching updated student list.");
                    }
                },
                error: function(xhr, status, error) {
                    // alert("AJAX Error: " + error);
                }
            });
        }
    }
});

$(document).ready(function() {
    // Append the add coordinator form to the body
    $('body').append(generateAddCoordinatorForm());

    // Show the form when the button is clicked
    $(document).on("click", "#btnAddCoordinator", function() {
        $("#addCoordinatorForm").show();
        $("#coordinatorDetailsModal").hide(); // Hide the modal
        $("#coordinatorForm")[0].reset(); // Use native DOM reset method on the form
    });

    // Close the modal when the close button is clicked
    $(document).on("click", "#closeCoordinatorForm", function() {
        $("#addCoordinatorForm").hide(); // Hide the form
        $("#coordinatorForm")[0].reset(); // Reset the form using native DOM reset
    });
});




$(document).on("submit", "#coordinatorForm", function(e) {
    e.preventDefault(); // Prevent the default form submission

    // Serialize the form data
    var formData = $(this).serialize();

    $.ajax({
        url: "ajaxhandler/addCoordinatorAjax.php", // Your server-side script to handle the addition
        type: "POST",
        data: formData,
        dataType: "json",
        success: function(response) {
            if (response.success) {
                alert("Coordinator/Admin added successfully!");
                $("#addCoordinatorForm").hide(); // Hide the form after success
                // Optionally refresh the coordinator list or do something else
            } else {
                alert("Error: " + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error adding coordinator/admin:", error);
            alert("An error occurred while adding the coordinator/admin.");
        }
    });
});



// Role-based HTE dropdown logic
$(document).on("change", "#role", function() {
    const selectedRole = $(this).val();
    if (selectedRole === "ADMIN") {
        $("#hteDropdownContainer").show();
        fetchHTEOptions(); // Fetch and populate HTE options
    } else {
        $("#hteDropdownContainer").hide();
    }
});

// Fetch HTE options based on role
function fetchHTEOptions() {
    $.ajax({
        url: "ajaxhandler/addCoordinatorAjax.php", // Adjust the URL as needed
        type: "POST",
        dataType: "json",
        data: { action: "getHTEs" }, // Specify the action to fetch HTEs
        success: function(response) {
            console.log("HTE Fetch Response:", response); // Debugging line
            if (response.success) {
                const hteSelect = $("#hteSelect");
                hteSelect.empty(); // Clear existing options
                response.htes.forEach(hte => {
                    hteSelect.append(`<option value="${hte.HTE_ID}">${hte.NAME}</option>`);
                });
            } else {
                alert("Error fetching HTEs: " + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error fetching HTEs:", error); // Log the error
            alert("An error occurred while fetching HTEs. Please check the console for more details.");
        }
    });
}

});