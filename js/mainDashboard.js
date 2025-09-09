
let currentHteId;
let currentSessionId;

// Tab switching functionality
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all sidebar items
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(tabName + 'Content').classList.add('active');

    // Add active class to selected sidebar item
    document.getElementById(tabName + 'Tab').classList.add('active');
}

$(document).ready(function() {
    // Toggle user dropdown
    $('#userProfile').on('click', function() {
        $('#userDropdown').toggle();
    });

    // Hide dropdown when clicking outside
    $(document).on('click', function(event) {
        if (!$(event.target).closest('#userProfile').length) {
            $('#userDropdown').hide();
        }
    });

    // Logout button click handler moved to dropdown logout button
    $(document).on('click', '#logoutBtn', function() {
        $.ajax({
            url: "ajaxhandler/logoutAjax.php",
            type: "POST",
            dataType: "json",
            data: {id:1},
            success: function(rv) {
                document.location.replace("index.php");
            },
            error: function(xhr, status, error) {
                alert("Logout failed! Please try again.");
            }
        });
    });

    // Profile button click handler
    $(document).on('click', '#btnProfile', function() {
        let cdrid = $("#hiddencdrid").val();

        if (!cdrid) {
            alert("Coordinator ID not found.");
            return;
        }

        $.ajax({
            url: "ajaxhandler/attendanceAJAX.php",
            type: "POST",
            dataType: "json",
            data: {cdrid: cdrid, action: "getCoordinatorDetails"},
            success: function(response) {
                if (response.success) {
                    displayCoordinatorDetails(response.data);
                } else {
                    alert("Error: " + (response.message || "Unknown error occurred."));
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX error:", status, error);
                alert("Error fetching coordinator details. Please check the console for more information.");
            }
        });
    });

    // Function to display coordinator details modal with Edit Profile and Change Password buttons
    function displayCoordinatorDetails(coordinatorData) {
        let html = `
            <div class="modal-overlay">
                <div id="coordinatorDetailsModal" class="modal" style="display: flex;">
                    <div class="modal-content" style="max-width: 600px;">
                        <div class="modal-header">
                            <h2>Coordinator Details</h2>
                            <button class="modal-close" id="closeCoordinatorDetailsModal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Coordinator ID:</label>
                                <span>${coordinatorData.COORDINATOR_ID}</span>
                            </div>
                            <div class="form-group">
                                <label>Name:</label>
                                <span>${coordinatorData.NAME}</span>
                            </div>
                            <div class="form-group">
                                <label>Email:</label>
                                <span>${coordinatorData.EMAIL}</span>
                            </div>
                            <div class="form-group">
                                <label>Contact Number:</label>
                                <span>${coordinatorData.CONTACT_NUMBER}</span>
                            </div>
                            <div class="form-group">
                                <label>Department:</label>
                                <span>${coordinatorData.DEPARTMENT}</span>
                            </div>
                            <div class="form-actions">
                                <button type="button" id="btnEditProfile" class="btn-submit">Edit Profile</button>
                                <button type="button" id="btnChangePassword" class="btn-secondary">Change Password</button>
                                <button type="button" id="btnCloseCoordinatorDetails" class="btn-cancel">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('body').append(html);
        $("#coordinatorDetailsModal").hide().fadeIn();
    }

    // Close coordinator details modal
    $(document).on('click', '#closeCoordinatorDetailsModal, #btnCloseCoordinatorDetails', function() {
        $('#coordinatorDetailsModal').fadeOut(function() {
            $(this).remove();
        });
    });

    // Edit Profile button click handler inside coordinator details modal
    $(document).on('click', '#btnEditProfile', function() {
        $('#coordinatorDetailsModal').fadeOut(function() {
            $(this).remove();
        });
        loadEditableProfile();
    });

    // Change Password button click handler inside coordinator details modal
    $(document).on('click', '#btnChangePassword', function() {
        $('#coordinatorDetailsModal').fadeOut(function() {
            $(this).remove();
        });
        showChangePasswordModal();
    });

    // Function to load editable profile modal
    function loadEditableProfile() {
        let cdrid = $("#hiddencdrid").val();

        if (!cdrid) {
            alert("Coordinator ID not found.");
            return;
        }

        $.ajax({
            url: "ajaxhandler/attendanceAJAX.php",
            type: "POST",
            dataType: "json",
            data: {cdrid: cdrid, action: "getCoordinatorDetails"},
            success: function(response) {
                if (response.success) {
                    displayEditableProfileModal(response.data);
                } else {
                    alert("Error: " + (response.message || "Unknown error occurred."));
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX error:", status, error);
                alert("Error fetching coordinator details. Please check the console for more information.");
            }
        });
    }

    // Function to display editable profile modal
    function displayEditableProfileModal(coordinatorData) {
        let html = `
            <div id="editableProfileModal" class="modal" style="display: flex;">
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header">
                        <h2>Edit Profile</h2>
                        <button class="modal-close" id="closeEditableProfileModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="editProfileForm">
                            <div class="form-group">
                                <label for="profileCoordinatorId">Coordinator ID:</label>
                                <input type="text" id="profileCoordinatorId" value="${coordinatorData.COORDINATOR_ID}" readonly>
                            </div>
                            <div class="form-group">
                                <label for="profileName">Name:</label>
                                <input type="text" id="profileName" name="name" value="${coordinatorData.NAME || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="profileEmail">Email:</label>
                                <input type="email" id="profileEmail" name="email" value="${coordinatorData.EMAIL || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="profileContact">Contact Number:</label>
                                <input type="tel" id="profileContact" name="contact_number" value="${coordinatorData.CONTACT_NUMBER || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="profileDepartment">Department:</label>
                                <input type="text" id="profileDepartment" name="department" value="${coordinatorData.DEPARTMENT || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="profilePicture">Profile Picture:</label>
                                <input type="file" id="profilePicture" name="profile_picture" accept="image/*">
                                <small style="color: #666;">Leave empty to keep current picture</small>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn-submit">Update Profile</button>
                                <button type="button" id="changePasswordBtn" class="btn-secondary">Change Password</button>
                                <button type="button" id="cancelProfileEdit" class="btn-cancel">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        $('body').append(html);
        $("#editableProfileModal").hide().fadeIn();
    }

    // Close editable profile modal
    $(document).on('click', '#closeEditableProfileModal, #cancelProfileEdit', function() {
        $('#editableProfileModal').fadeOut(function() {
            $(this).remove();
        });
    });

    // Close modal when clicking outside
    $(document).on('click', function(event) {
        if ($(event.target).is('#editableProfileModal')) {
            $('#editableProfileModal').fadeOut(function() {
                $(this).remove();
            });
        }
    });

    // Handle profile form submission
    $(document).on('submit', '#editProfileForm', function(e) {
        e.preventDefault();

        let formData = new FormData(this);
        formData.append('action', 'updateCoordinatorDetails');
        formData.append('coordinator_id', $('#profileCoordinatorId').val());

        // Handle profile picture upload
        let profilePicture = $('#profilePicture')[0].files[0];
        if (profilePicture) {
            formData.append('profile_picture', profilePicture);
        }

        $.ajax({
            url: "ajaxhandler/attendanceAJAX.php",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    alert("Profile updated successfully!");
                    $('#editableProfileModal').fadeOut(function() {
                        $(this).remove();
                    });
                } else {
                    alert("Error updating profile: " + (response.message || "Unknown error"));
                }
            },
            error: function(xhr, status, error) {
                console.error("Error updating profile:", error);
                alert("Error updating profile. Please try again.");
            }
        });
    });

    // Change password button handler
    $(document).on('click', '#changePasswordBtn', function() {
        showChangePasswordModal();
    });

    // Function to show change password modal
    function showChangePasswordModal() {
        let html = `
            <div id="changePasswordModal" class="modal" style="display: flex;">
                <div class="modal-content" style="max-width: 400px;">
                    <div class="modal-header">
                        <h2>Change Password</h2>
                        <button class="modal-close" id="closeChangePasswordModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="changePasswordForm">
                            <div class="form-group">
                                <label for="currentPassword">Current Password:</label>
                                <input type="password" id="currentPassword" name="current_password" required>
                            </div>
                            <div class="form-group">
                                <label for="newPassword">New Password:</label>
                                <input type="password" id="newPassword" name="new_password" required>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirm New Password:</label>
                                <input type="password" id="confirmPassword" name="confirm_password" required>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn-submit">Change Password</button>
                                <button type="button" id="cancelPasswordChange" class="btn-cancel">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        $('body').append(html);
        $("#changePasswordModal").hide().fadeIn();
    }

    // Close change password modal
    $(document).on('click', '#closeChangePasswordModal, #cancelPasswordChange', function() {
        $('#changePasswordModal').fadeOut(function() {
            $(this).remove();
        });
    });

    // Handle change password form submission
    $(document).on('submit', '#changePasswordForm', function(e) {
        e.preventDefault();

        let currentPassword = $('#currentPassword').val();
        let newPassword = $('#newPassword').val();
        let confirmPassword = $('#confirmPassword').val();

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        if (newPassword.length < 6) {
            alert("New password must be at least 6 characters long!");
            return;
        }

        let coordinatorId = $('#hiddencdrid').val();

        $.ajax({
            url: "ajaxhandler/attendanceAJAX.php",
            type: "POST",
            dataType: "json",
            data: {
                action: 'verifyCoordinatorPassword',
                coordinator_id: coordinatorId,
                password: currentPassword
            },
            success: function(response) {
                if (response.success) {
                    // Password verified, now update it
                    $.ajax({
                        url: "ajaxhandler/attendanceAJAX.php",
                        type: "POST",
                        dataType: "json",
                        data: {
                            action: 'updateCoordinatorPassword',
                            coordinator_id: coordinatorId,
                            new_password: newPassword
                        },
                        success: function(updateResponse) {
                            if (updateResponse.success) {
                                alert("Password changed successfully!");
                                $('#changePasswordModal').fadeOut(function() {
                                    $(this).remove();
                                });
                            } else {
                                alert("Error changing password: " + (updateResponse.message || "Unknown error"));
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error("Error changing password:", error);
                            alert("Error changing password. Please try again.");
                        }
                    });
                } else {
                    alert("Current password is incorrect!");
                }
            },
            error: function(xhr, status, error) {
                console.error("Error verifying password:", error);
                alert("Error verifying current password. Please try again.");
            }
        });
    });

    // Sidebar toggle button click handler
    $('#sidebarToggle').on('click', function() {
        $('.sidebar').toggleClass('sidebar-open');
    });

    // Click outside to close modals and sidebar
    $(document).on('click', function(event) {
        // Close coordinator details modal
        if (!$(event.target).closest('#coordinatorDetailsModal .modal-content').length && !$(event.target).is('#btnProfile')) {
            $('#coordinatorDetailsModal').fadeOut(function() {
                $(this).remove();
            });
        }

        // Close add student form
        if (!$(event.target).closest('#addStudentForm').length && !$(event.target).is('.btnAdd')) {
            $('#addStudentForm').fadeOut(function() {
                $('#studentForm')[0].reset();
                $('#studentForm input, #studentForm select').prop('disabled', false);
            });
        }

        // Close add HTE form
        if (!$(event.target).closest('#addHTEForm').length && !$(event.target).is('.btnAddHTE')) {
            $('#addHTEForm').fadeOut();
        }

        // Close sidebar when clicking outside
        if (!$(event.target).closest('.sidebar').length && !$(event.target).is('#sidebarToggle')) {
            $('.sidebar').removeClass('sidebar-open');
        }
    });

    // View All Students button click handler
    $(document).on('click', '#btnViewAllStudents', function() {
        let cdrid = $("#hiddencdrid").val();

        if (!cdrid) {
            alert("Coordinator ID not found.");
            return;
        }

        $.ajax({
            url: "ajaxhandler/attendanceAJAX.php",
            type: "POST",
            dataType: "json",
            data: {cdrid: cdrid, action: "getAllStudentsUnderCoordinator"},
            success: function(response) {
                if (response.success) {
                    displayAllStudents(response.data);
                } else {
                    alert("Error: " + (response.message || "Unknown error occurred."));
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX error:", status, error);
                alert("Error fetching students. Please check the console for more information.");
            }
        });
    });

    // Function to display all students under coordinator
    function displayAllStudents(students) {
        let tbodyHtml = '';

        if (students && students.length > 0) {
            students.forEach(student => {
                tbodyHtml += `
                    <tr>
                        <td>${student.STUDENT_ID || ''}</td>
                        <td>${student.NAME || ''}</td>
                        <td>${student.AGE || ''}</td>
                        <td>${student.GENDER || ''}</td>
                        <td>${student.EMAIL || ''}</td>
                        <td>${student.CONTACT_NUMBER || ''}</td>
                        <td>${student.HTE_NAME || 'Not Assigned'}</td>
                        <td>${student.SESSION_NAME || 'Not Assigned'}</td>
                    </tr>
                `;
            });
        } else {
            tbodyHtml = `<tr><td colspan="8">No students found under this coordinator.</td></tr>`;
        }

        $('#allStudentsTableBody').html(tbodyHtml);
        $('#allStudentsContainer').show();
    }

    // Close all students container
    $(document).on('click', '#closeAllStudents', function() {
        $('#allStudentsContainer').hide();
    });
});



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

                // Auto-select the first session if available
                if (rv && rv.length > 0) {
                    $("#ddlclass").val(rv[0].ID);
                    // Trigger the change event to load HTEs for the selected session
                    $("#ddlclass").trigger("change");
                }

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
        // Removed checkbox column header
        // x += `<div class="select-area"><input type="checkbox" id="selectAll"></div>`;
        x += `<div class="rollno-area">Student ID</div>`;
        x += `<div class="name-area">Name</div>`;
        x += `<div class="delete-area"></div>`;
        x += `<div class="timein-area">Time In</div>`;
        x += `<div class="timeout-area">Time Out</div>`;
        x += `</div>`; // close header-row div

        studentList.forEach((cs, index) => {
            x += `<div class="studentdetails">`;
            // Removed checkbox column for each student
            // x += `<div class="select-area"><input type="checkbox" class="student-checkbox" data-studentid="${cs['INTERNS_ID']}"></div>`;
            x += `<div class="rollno-area">${cs['STUDENT_ID']}</div>`;
            x += `<div class="name-area">${cs['SURNAME']}</div>`;

            // Delete button in separate column
            x += `<div class="delete-area">`;
            x += `<button class="btnDelete" data-studentid="${cs['INTERNS_ID']}">Delete</button>`;
            x += `</div>`;

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
        // Create the report button only, removed assign button
        x += `<div class="reportsection">`;
        // x += `<button id="btnAssign" class="common-button btnAssign">ASSIGN</button>`;
        x += `</div>`; // close reportsection div

    return x;
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
                $("#addStudentForm").fadeOut(function() {
                    $("#studentForm")[0].reset();
                    $("#studentForm input, #studentForm select").prop("disabled", false);
                });
            }
        });
    
        $(document).on("change", "#csvFile", function() {
            $("#studentForm input[type='text'], #studentForm input[type='number'], #studentForm input[type='email'], #studentForm select").prop("disabled", $(this).get(0).files.length > 0);
        });
    });
    
    


    
    $(document).ready(function() {

        $(document).on("click", ".btnAddHTE", function(e) {
            e.preventDefault();
            $("#addHTEForm").css("display", "flex").hide().fadeIn();
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
            $("#addHTEForm").fadeOut();
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

// Select all checkboxes functionality
$(document).on("change", "#selectAll", function() {
    const isChecked = $(this).is(":checked");
    $(".student-checkbox").prop("checked", isChecked);
});

// Assign button click handler
$(document).on("click", "#btnAssign", function() {
    const selectedStudents = [];
    $(".student-checkbox:checked").each(function() {
        selectedStudents.push($(this).data("studentid"));
    });

    if (selectedStudents.length === 0) {
        alert("Please select at least one student to assign.");
        return;
    }

    showAssignModal(selectedStudents);
});

// Function to show assign modal
function showAssignModal(selectedStudents) {
    const modalHTML = `
        <div id="assignModal" class="modal" style="display:flex;">
            <div class="modal-content">
                <h3>Assign Students to Session and HTE</h3>
                <form id="assignForm">
                    <div class="form-group">
                        <label for="assignSessionSelect">Select Session:</label>
                        <select id="assignSessionSelect" name="sessionId" required>
                            <option value="">Select Session</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="assignHTESelect">Select HTE:</label>
                        <select id="assignHTESelect" name="hteId" required>
                            <option value="">Select HTE</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-submit">Assign</button>
                        <button type="button" id="closeAssignModal" class="btn-cancel">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    $('body').append(modalHTML);
    loadAssignSessionOptions();
}

// Load session options for assign modal
function loadAssignSessionOptions() {
    $.ajax({
        url: "ajaxhandler/attendanceAJAX.php",
        type: "POST",
        dataType: "json",
        data: {action: "getSession"},
        success: function(response) {
            if (response && response.length > 0) {
                let options = '<option value="">Select Session</option>';
                response.forEach(function(session) {
                    const sessionId = session.ID;
                    const sessionName = session.YEAR + " " + session.TERM;
                    options += `<option value="${sessionId}">${sessionName}</option>`;
                });
                $('#assignSessionSelect').html(options);
            } else {
                alert("No sessions found. Please add a session first.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error loading sessions:", error);
            alert("Error loading sessions. Please try again.");
        }
    });
}

// Load HTE options based on selected session for assign modal
$(document).on("change", "#assignSessionSelect", function() {
    const sessionId = $(this).val();
    if (!sessionId) {
        $('#assignHTESelect').html('<option value="">Select HTE</option>');
        return;
    }

    const cdrid = $('#hiddencdrid').val();
    $.ajax({
        url: "ajaxhandler/attendanceAJAX.php",
        type: "POST",
        dataType: "json",
        data: {cdrid: cdrid, sessionid: sessionId, action: "getHTE"},
        success: function(response) {
            if (response && response.length > 0) {
                let options = '<option value="">Select HTE</option>';
                response.forEach(function(hte) {
                    options += `<option value="${hte.HTE_ID}">${hte.NAME} (${hte.INDUSTRY})</option>`;
                });
                $('#assignHTESelect').html(options);
            } else {
                $('#assignHTESelect').html('<option value="">No HTEs found for this session</option>');
            }
        },
        error: function(xhr, status, error) {
            console.error("Error loading HTEs:", error);
            alert("Error loading HTEs. Please try again.");
        }
    });
});

// Assign form submission
$(document).on("submit", "#assignForm", function(e) {
    e.preventDefault();

    const sessionId = $('#assignSessionSelect').val();
    const hteId = $('#assignHTESelect').val();
    const selectedStudents = [];

    $(".student-checkbox:checked").each(function() {
        selectedStudents.push($(this).data("studentid"));
    });

    if (!sessionId || !hteId) {
        alert("Please select both session and HTE.");
        return;
    }

    if (selectedStudents.length === 0) {
        alert("No students selected.");
        return;
    }

    // Send assignment request
    $.ajax({
        url: "ajaxhandler/attendanceAJAX.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "assignStudents",
            studentIds: selectedStudents,
            sessionId: sessionId,
            hteId: hteId
        },
        success: function(response) {
            if (response.success) {
                alert("Students assigned successfully!");
                $('#assignModal').remove();
                // Refresh the student list
                const cdrid = $('#hiddencdrid').val();
                const ondate = $("#dtpondate").val();
                fetchStudentList(currentSessionId, currentHteId, cdrid, ondate);
            } else {
                alert("Error assigning students: " + (response.message || "Unknown error"));
            }
        },
        error: function(xhr, status, error) {
            console.error("Error assigning students:", error);
            alert("Error assigning students. Please try again.");
        }
    });
});

// Close assign modal
$(document).on("click", "#closeAssignModal", function() {
    $('#assignModal').remove();
});

// Close modal when clicking outside
$(document).on("click", function(event) {
    if ($(event.target).is('#assignModal')) {
        $('#assignModal').remove();
    }
});

});

});