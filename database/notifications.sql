ALTER TABLE attendancetrackernp.weekly_reports
ADD COLUMN notification_sent TINYINT(1) DEFAULT 0;

-- First, rename existing columns to preserve data
ALTER TABLE attendancetrackernp.notifications
    CHANGE student_id receiver_id INT NOT NULL,
    ADD COLUMN receiver_type ENUM('admin', 'student', 'coordinator') NOT NULL DEFAULT 'student' AFTER receiver_id,
    ADD COLUMN sender_id INT NULL AFTER receiver_type,
    ADD COLUMN sender_type ENUM('admin', 'student', 'coordinator', 'system') NULL AFTER sender_id,
    CHANGE report_id reference_id INT NULL,
    ADD COLUMN reference_type VARCHAR(50) NULL AFTER reference_id;

-- Update existing records
UPDATE attendancetrackernp.notifications 
SET reference_type = 'report' 
WHERE reference_id IS NOT NULL;

-- Add foreign key after data is updated
ALTER TABLE attendancetrackernp.notifications
    ADD FOREIGN KEY (reference_id) REFERENCES weekly_reports(report_id) ON DELETE SET NULL;