$(function () {
    const URLs = {
        logout: "ajaxhandler/adminLogout.php",
        attendance: "ajaxhandler/approveAttendanceAjax.php",
    };

    function handleAjaxError(xhr, status, error) {
        console.error("AJAX Error:", error);
        console.log("Response text:", xhr.responseText);
        alert(`An error occurred (${status}): ${xhr.statusText}. Please try again.`);
    }

    // Logout functionality
    $(document).on("click", "#btnlogout", function () {
        $.ajax({
            url: URLs.logout,
            type: "POST",
            dataType: "json",
            data: { id: 1 },
            beforeSend: function () {
                $("#btnlogout").prop("disabled", true);
            },
            complete: function () {
                $("#btnlogout").prop("disabled", false);
            },
            success: function (response) {
                document.location.replace("admin.php");
            },
            error: handleAjaxError,
        });
    });

    // Approve attendance functionality
    window.approveAttendance = function (recordId) {
        if (!recordId) {
            alert("Invalid record ID. Please try again.");
            return;
        }

        if (confirm("Are you sure you want to approve this attendance?")) {
            $.ajax({
                url: URLs.attendance,
                type: "POST",
                dataType: "json",
                data: { action: 'approveAttendance', id: recordId },
                beforeSend: function () {
                    console.log(`Sending approval request for record ID: ${recordId}`);
                },
                success: function (response) {
                    if (response.status === 'success') {
                        alert(response.message); // Display success message
                        location.reload(); // Reload the page to reflect changes
                    } else {
                        alert(`Error: ${response.message}`); // Display error message
                    }
                },
                error: handleAjaxError,
            });
        }
    };

    // Decline attendance functionality
    window.deletePendingAttendance = function (recordId) {
        if (!recordId) {
            alert("Invalid record ID. Please try again.");
            return;
        }

        if (confirm("Are you sure you want to decline this attendance?")) {
            $.ajax({
                url: "ajaxhandler/deletePendingAttendanceAjax.php",
                type: "POST",
                dataType: "json",
                data: { action: 'deletePendingAttendance', id: recordId },
                beforeSend: function () {
                    console.log(`Sending deletion request for record ID: ${recordId}`);
                },
                success: function (response) {
                    if (response.status === 'success') {
                        alert(response.message); // Display success message
                        location.reload(); // Reload the page to reflect changes
                    } else {
                        alert(`Error: ${response.message}`); // Display error message
                    }
                },
                error: function (xhr, status, error) {
                    console.error("AJAX Error:", error);
                    alert(`An error occurred: ${xhr.statusText}. Please try again.`);
                },
            });
        }
    };


});
