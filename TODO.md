# TODO: Implement Philippine Mobile Number Format (+63 951 3762 404)

## Information Gathered
- Contact number inputs are in mainDashboard.php for Add Student and Add HTE forms.
- Backend processing in ajaxhandler/attendanceAJAX.php for actions "addStudent" and "addHTE".
- No current formatting applied; stored as string in database.
- Profile modal in js/mainDashboard.js displays contact number.

## Plan
1. Add JavaScript formatting function in js/mainDashboard.js to format contact number on blur/before submission.
2. Add server-side validation in ajaxhandler/attendanceAJAX.php to ensure correct format.
3. Update profile modal display to show formatted number.

## Dependent Files to Edit
- js/mainDashboard.js: Add formatting logic.
- ajaxhandler/attendanceAJAX.php: Add validation for contact number format.

## Followup Steps
- Test form submission with new format.
- Verify formatted number display in UI and database.
- Ensure backward compatibility with existing data.

## Progress
- [ ] Add formatting function to js/mainDashboard.js
- [ ] Add validation to ajaxhandler/attendanceAJAX.php
- [ ] Test changes
