// Function to submit return report
function submitReturnReport() {
    if (!currentReportId) return;

    const reason = $('#returnReason').val().trim();
    if (!reason) {
        alert('Please provide a reason for returning the report.');
        return;
    }

    $.ajax({
        url: URLs.reports,
        type: 'POST',
        data: {
            action: 'returnReport',
            reportId: currentReportId,
            returnReason: reason
        },
        success: function(response) {
            if (response.status === 'success') {
                closeReturnModal();
                // Load reports only once
                loadWeeklyReports($('#studentFilter').val(), window.currentWeekNumber);
            } else {
                alert('Error: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            alert('Error returning report: ' + error);
            console.error('Ajax error:', xhr, status, error);
        }
    });
}