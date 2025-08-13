-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 13, 2025 at 06:03 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `attendancetrackernp`
--

-- --------------------------------------------------------

--
-- Table structure for table `coordinator`
--

CREATE TABLE `coordinator` (
  `COORDINATOR_ID` int(11) NOT NULL,
  `NAME` varchar(30) NOT NULL,
  `EMAIL` varchar(30) NOT NULL,
  `CONTACT_NUMBER` varchar(30) NOT NULL,
  `DEPARTMENT` varchar(30) NOT NULL,
  `USERNAME` varchar(255) DEFAULT NULL,
  `PASSWORD` varchar(255) DEFAULT NULL,
  `ROLE` enum('COORDINATOR','ADMIN','SUPERADMIN') NOT NULL DEFAULT 'COORDINATOR',
  `HTE_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coordinator`
--

INSERT INTO `coordinator` (`COORDINATOR_ID`, `NAME`, `EMAIL`, `CONTACT_NUMBER`, `DEPARTMENT`, `USERNAME`, `PASSWORD`, `ROLE`, `HTE_ID`) VALUES
(59828994, 'Kim Charles', 'shadowd6163@gmail.com', '09513762404', 'IT', 'shadow', 'test', 'ADMIN', 1),
(59828996, 'KIM CHARLES', 'kimcharles.emping@hcdc.edu.ph', '09513762404', 'IT_DEPARTMENT', 'kimcharles', 'test1', 'COORDINATOR', NULL),
(59828999, 'superadmin', 'superadmin@gmail.com', '09513762404', 'IT', 'super', 'admin', 'SUPERADMIN', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `host_training_establishment`
--

CREATE TABLE `host_training_establishment` (
  `HTE_ID` int(11) NOT NULL,
  `NAME` varchar(30) NOT NULL,
  `INDUSTRY` varchar(30) NOT NULL,
  `ADDRESS` varchar(100) NOT NULL,
  `CONTACT_EMAIL` varchar(50) NOT NULL,
  `CONTACT_PERSON` varchar(50) NOT NULL,
  `CONTACT_NUMBER` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `host_training_establishment`
--

INSERT INTO `host_training_establishment` (`HTE_ID`, `NAME`, `INDUSTRY`, `ADDRESS`, `CONTACT_EMAIL`, `CONTACT_PERSON`, `CONTACT_NUMBER`) VALUES
(1, 'McDo', 'CET', 'UNAHAN SA AGDAO', 'RASTAMAN@GMAIL.COM', 'RASTAMAN', '09513762404'),
(2, 'jollibee', 'CET', 'UNAHAN SA AGDAO', 'RASTAMAN@GMAIL.COM', 'RASTAMAN', '09513762404'),
(3, 'G-Mall', 'CET', 'UNAHAN SA AGDAO', 'RASTAMAN@GMAIL.COM', 'RASTAMAN', '09513762404'),
(6, 'Victoria', 'Mall', 'Obrero', 'Victoria@gmail.com', 'rastaman', '09876543212'),
(21, 'Kim Charles', 'Mall', 'veloso st.', 'SPH@gmail.com', 'Kim Charles', '09513762404');

-- --------------------------------------------------------

--
-- Table structure for table `internship_needs`
--

CREATE TABLE `internship_needs` (
  `HTE_ID` int(11) NOT NULL,
  `COORDINATOR_ID` int(11) NOT NULL,
  `SESSION_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `internship_needs`
--

INSERT INTO `internship_needs` (`HTE_ID`, `COORDINATOR_ID`, `SESSION_ID`) VALUES
(1, 59828996, 1),
(2, 59828996, 1),
(3, 59828996, 2),
(6, 59828996, 1);

-- --------------------------------------------------------

--
-- Table structure for table `interns_attendance`
--

CREATE TABLE `interns_attendance` (
  `COORDINATOR_ID` int(11) NOT NULL,
  `HTE_ID` int(11) NOT NULL,
  `ID` int(11) NOT NULL,
  `INTERNS_ID` int(11) NOT NULL,
  `ON_DATE` date NOT NULL,
  `TIMEIN` time DEFAULT NULL,
  `TIMEOUT` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interns_attendance`
--

INSERT INTO `interns_attendance` (`COORDINATOR_ID`, `HTE_ID`, `ID`, `INTERNS_ID`, `ON_DATE`, `TIMEIN`, `TIMEOUT`) VALUES
(59828996, 1, 1, 190, '2024-11-22', '16:11:00', '16:11:00'),
(59828996, 1, 1, 190, '2024-11-23', '16:50:00', '16:50:00'),
(59828996, 1, 1, 190, '2024-11-24', '13:34:00', '13:34:00'),
(59828996, 1, 1, 190, '2024-11-25', '22:35:00', '00:10:00'),
(59828996, 1, 1, 190, '2024-11-26', '15:54:00', '15:54:00'),
(59828996, 1, 1, 190, '2024-12-04', '17:27:00', '17:27:00'),
(59828996, 1, 1, 190, '2025-07-01', '23:43:00', '23:43:00'),
(59828996, 1, 1, 190, '2025-07-02', '10:09:00', '10:09:00'),
(59828996, 1, 1, 190, '2025-08-13', '12:01:00', '12:01:00');

-- --------------------------------------------------------

--
-- Table structure for table `interns_details`
--

CREATE TABLE `interns_details` (
  `INTERNS_ID` int(11) NOT NULL,
  `STUDENT_ID` int(11) NOT NULL,
  `NAME` varchar(30) NOT NULL,
  `AGE` int(11) NOT NULL,
  `GENDER` varchar(10) NOT NULL,
  `EMAIL` varchar(30) NOT NULL,
  `CONTACT_NUMBER` varchar(15) NOT NULL,
  `GPA` float DEFAULT NULL,
  `performance_score` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interns_details`
--

INSERT INTO `interns_details` (`INTERNS_ID`, `STUDENT_ID`, `NAME`, `AGE`, `GENDER`, `EMAIL`, `CONTACT_NUMBER`, `GPA`, `performance_score`) VALUES
(190, 59828881, 'Kim Charles', 23, 'Male', 'shadowd6163@gmail.com', '09513762404', 1.1, 5),
(206, 59829532, 'JAMES', 21, 'MALE', 'james@hcdc.edu.ph', '\'09876523322\'', 1.2, 4),
(207, 59832315, 'Harold', 22, 'MALE', 'Harold@hcdc.edu.ph', '\'09812654321\'', 1.3, 3),
(208, 59823526, 'Adriane', 23, 'MALE', 'Adriane@hcdc.edu.ph', '\'09526543212\'', 1.4, 2),
(209, 59829332, 'Urie', 21, 'FEMALE', 'Urie@hcdc.edu,ph', '\'09476543212\'', 1.5, 1),
(210, 59832925, 'Joy', 22, 'FEMALE', 'Joy@hcdc.edu.ph', '\'09813252615\'', 1.6, 5),
(211, 59823962, 'Emman', 22, 'MALE', 'Emman@hcdc.edu.ph', '\'09235157692\'', 1.7, 4),
(212, 59832356, 'Bob', 22, 'MALE', 'Bob@hcdc.edu.ph', '\'09273679179\'', 1.8, 3),
(213, 59852427, 'Charles', 23, 'MALE', 'Charles@hcdc.edu.ph', '\'09283782367\'', 1.9, 2),
(214, 59834987, 'Kristine', 22, 'FEMALE', 'Kristine@hcdc.edu.ph', '\'09382658121\'', 2, 1),
(215, 59829572, 'Robin', 21, 'FEMALE', 'Robin@hcdc.edu.ph', '\'09237834612\'', 2.1, 5),
(216, 59823572, 'Kanye', 23, 'MALE', 'Kanye@hcdc.edu.ph', '\'09823261716\'', 2.2, 4),
(217, 59823573, 'Sara', 24, 'FEMALE', 'Sara@hcdc.edu.ph', '\'09823261717\'', 2.3, 3),
(218, 59823574, 'Ernest', 23, 'MALE', 'Ernest@hcdc.edu.ph', '\'09823261718\'', 2.4, 2),
(219, 59823575, 'Sophia', 21, 'FEMALE', 'Sophia@hdcc.edu.ph', '\'09823261719\'', 2.5, 1),
(220, 59823576, 'Mary', 22, 'FEMALE', 'mary@hcdc.edu.ph', '\'09823261720\'', 2.6, 5),
(221, 59823577, 'Lynn', 23, 'FEMALE', 'Lynn@hcdc.edu.ph', '\'09823261721\'', 2.7, 4),
(222, 59823578, 'Christian', 22, 'MALE', 'christian@hcdc.edu.ph', '\'09823261722\'', 2.8, 3),
(223, 59823579, 'John', 23, 'MALE', 'John@hcdc.edu.ph', '\'09823261723\'', 2.9, 2),
(224, 59823580, 'Steve', 22, 'MALE', 'steve@hcdc.edu.ph', '\'09823261724\'', 3, 1),
(225, 59823581, 'Anita', 21, 'FEMALE', 'anita@hcdc.edu.ph', '\'09823261725\'', 3.1, 5),
(226, 59823582, 'Jake', 23, 'MALE', 'Jake@hcdc.edu.ph', '\'09823261726\'', 3.2, 4),
(227, 59823583, 'Joel', 23, 'MALE', 'Joel@hcdc.edu.ph', '\'09823261727\'', 3.3, 3),
(228, 59823584, 'Jane', 22, 'FEMALE', 'jane@hcdc.edu.ph', '\'09823261728\'', 3.4, 2),
(231, 59823587, 'Karl', 23, 'MALE', 'karl@hcdc.edu.ph', '\'09823261731\'', NULL, NULL),
(232, 59823588, 'Nicole', 22, 'FEMALE', 'nicole@hcdc.edu.ph', '\'09823261732\'', NULL, NULL),
(233, 59823589, 'Amy', 21, 'FEMALE', 'Amy@hcdc.edu.ph', '\'09823261733\'', NULL, NULL),
(234, 59823590, 'Justin', 24, 'MALE', 'Justin@hcdc.edu.ph', '\'09823261734\'', NULL, NULL),
(235, 59823591, 'Stefan', 23, 'MALE', 'Stefan@hcdc.edu.ph', '\'09823261735\'', NULL, NULL),
(236, 59823592, 'Paul', 25, 'MALE', 'Paul@hcdc.edu.ph', '\'09823261736\'', NULL, NULL),
(237, 59823593, 'Hannah', 23, 'FEMALE', 'Hannah@hcdc.edu.ph', '\'09823261737\'', NULL, NULL),
(238, 59823594, 'Joyce', 21, 'FEMALE', 'joyce@hcdc.edu.ph', '\'09823261738\'', NULL, NULL),
(239, 59823595, 'Mark', 22, 'MALE', 'mark@hdc.edu.ph', '\'09823261739\'', NULL, NULL),
(240, 59823596, 'Kate', 23, 'FEMALE', 'kate@hcdc.edu.ph', '\'09823261740\'', NULL, NULL),
(241, 59823597, 'Jessica', 21, 'FEMALE', 'jessica@hcdc.edu.ph', '\'09823261741\'', NULL, NULL),
(242, 59823598, 'Tristan', 22, 'MALE', 'tristan@hcdc.edu.ph', '\'09823261742\'', NULL, NULL),
(243, 59823599, 'Emilie', 21, 'FEMALE', 'emilie@hcdc.edu.ph', '\'09823261743\'', NULL, NULL),
(244, 59823600, 'Nate', 23, 'MALE', 'nate@hcdc.edu.ph', '\'09823261744\'', NULL, NULL),
(245, 59823601, 'Kimberly', 22, 'FEMALE', 'kimberly@hcdc.edu.ph', '\'09823261745\'', NULL, NULL),
(246, 59823602, 'Austin', 22, 'MALE', 'Austin@hcdc.edu.ph', '\'09823261746\'', NULL, NULL),
(247, 59823603, 'Prince', 21, 'MALE', 'prince@hcdc.edu.ph', '\'09823261747\'', NULL, NULL),
(248, 59823604, 'Jin', 22, 'MALE', 'Jin@hcdc.edu.ph', '\'09823261748\'', NULL, NULL),
(249, 59823605, 'Carlo', 23, 'MALE', 'Carlo@hcdc.edu.ph', '\'09823261749\'', NULL, NULL),
(252, 59823608, 'Kylie', 24, 'FEMALE', 'Kylie@hcdc.edu.ph', '\'09823261752\'', NULL, NULL),
(253, 59823609, 'Ken', 22, 'MALE', 'Ken@hcdc.edu.ph', '\'09823261753\'', NULL, NULL),
(254, 59823610, 'Maya', 23, 'FEMALE', 'Maya@hcdc.edu.ph', '\'09823261754\'', NULL, NULL),
(255, 59828996, 'Kim', 69, 'Male', 'kim69@gmail.com', '09513762404', NULL, NULL),
(258, 59828110, 'Kim', 51, 'Male', 'kim69@gmail.com', '09513762404', NULL, NULL);

--
-- Triggers `interns_details`
--
DELIMITER $$
CREATE TRIGGER `log_student_deletion` AFTER DELETE ON `interns_details` FOR EACH ROW BEGIN
    INSERT INTO student_deletion_log (intern_id, student_id, name, deleted_at)
    VALUES (OLD.INTERNS_ID, OLD.STUDENT_ID, OLD.NAME, NOW());
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `intern_details`
--

CREATE TABLE `intern_details` (
  `INTERNS_ID` int(11) NOT NULL,
  `SESSION_ID` int(11) NOT NULL,
  `HTE_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `intern_details`
--

INSERT INTO `intern_details` (`INTERNS_ID`, `SESSION_ID`, `HTE_ID`) VALUES
(190, 1, 1),
(206, 1, 1),
(207, 1, 1),
(208, 1, 1),
(209, 1, 1),
(210, 1, 1),
(211, 1, 1),
(212, 1, 1),
(213, 1, 1),
(214, 1, 1),
(215, 1, 1),
(217, 1, 1),
(218, 1, 1),
(219, 1, 1),
(220, 1, 1),
(221, 1, 1),
(222, 1, 1),
(223, 1, 1),
(224, 1, 1),
(225, 1, 1),
(226, 1, 1),
(227, 1, 1),
(228, 1, 1),
(231, 1, 1),
(232, 1, 1),
(233, 1, 1),
(234, 1, 1),
(235, 1, 1),
(236, 1, 1),
(237, 1, 1),
(238, 1, 1),
(239, 1, 1),
(240, 1, 1),
(241, 1, 1),
(242, 1, 1),
(243, 1, 1),
(244, 1, 1),
(245, 1, 1),
(246, 1, 1),
(247, 1, 1),
(248, 1, 1),
(249, 1, 1),
(255, 1, 1),
(258, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `pending_attendance`
--

CREATE TABLE `pending_attendance` (
  `ID` int(11) NOT NULL,
  `INTERNS_ID` int(11) DEFAULT NULL,
  `HTE_ID` int(11) DEFAULT NULL,
  `ON_DATE` date DEFAULT NULL,
  `TIMEIN` time DEFAULT NULL,
  `TIMEOUT` time DEFAULT NULL,
  `STATUS` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pending_attendance`
--

INSERT INTO `pending_attendance` (`ID`, `INTERNS_ID`, `HTE_ID`, `ON_DATE`, `TIMEIN`, `TIMEOUT`, `STATUS`) VALUES
(17, 190, 1, '2024-11-26', '15:54:00', '15:54:00', 'approved'),
(22, 190, 1, '2024-12-04', '17:27:00', '17:27:00', 'approved'),
(28, 190, 1, '2025-06-30', '23:43:00', '23:48:00', 'approved'),
(36, 190, 1, '2025-07-01', '23:43:00', '23:43:00', 'approved'),
(38, 190, 1, '2025-07-02', '10:09:00', '10:09:00', 'approved'),
(39, 190, 1, '2025-08-13', '12:01:00', '12:01:00', 'approved');

-- --------------------------------------------------------

--
-- Table structure for table `session_details`
--

CREATE TABLE `session_details` (
  `ID` int(11) NOT NULL,
  `YEAR` int(11) NOT NULL,
  `TERM` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `session_details`
--

INSERT INTO `session_details` (`ID`, `YEAR`, `TERM`) VALUES
(1, 2024, 'FIRST SEMESTER'),
(2, 2024, 'SECOND SEMESTER');

-- --------------------------------------------------------

--
-- Table structure for table `student_deletion_log`
--

CREATE TABLE `student_deletion_log` (
  `log_id` int(11) NOT NULL,
  `intern_id` int(11) DEFAULT NULL,
  `student_id` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `deleted_at` datetime DEFAULT current_timestamp(),
  `reason` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_deletion_log`
--

INSERT INTO `student_deletion_log` (`log_id`, `intern_id`, `student_id`, `name`, `deleted_at`, `reason`) VALUES
(1, 199, '59828887', 'GEMEL', '2024-11-27 00:36:57', NULL),
(2, 200, '59828841', 'DADONG', '2024-11-27 00:37:01', NULL),
(3, 201, '59828887', 'GEMEL', '2024-11-27 10:54:55', NULL),
(4, 202, '59828841', 'DADONG', '2024-11-27 10:55:22', NULL),
(5, 204, '59828841', 'DADONG', '2024-11-29 02:02:47', NULL),
(6, 203, '59828887', 'GEMEL', '2024-11-29 02:03:04', NULL),
(7, 205, '59828887', 'GEMEL', '2024-11-30 23:38:43', NULL),
(8, 251, '59823607', 'Anna', '2025-07-01 14:25:03', NULL),
(9, 229, '59823585', 'Alteia', '2025-07-01 14:26:56', NULL),
(10, 230, '59823586', 'Eugene', '2025-07-01 14:27:33', NULL),
(11, 250, '59823606', 'Karen', '2025-07-01 14:28:20', NULL),
(12, 257, '59828110', 'ch', '2025-07-01 23:19:43', NULL),
(13, 256, '598289111', 'Kim', '2025-07-02 00:26:39', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `coordinator`
--
ALTER TABLE `coordinator`
  ADD PRIMARY KEY (`COORDINATOR_ID`),
  ADD KEY `coordinator_ibfk_1` (`HTE_ID`);

--
-- Indexes for table `host_training_establishment`
--
ALTER TABLE `host_training_establishment`
  ADD PRIMARY KEY (`HTE_ID`);

--
-- Indexes for table `internship_needs`
--
ALTER TABLE `internship_needs`
  ADD KEY `fk_coordinator` (`COORDINATOR_ID`),
  ADD KEY `fk_host_training_establishment` (`HTE_ID`),
  ADD KEY `fk_session_id` (`SESSION_ID`);

--
-- Indexes for table `interns_attendance`
--
ALTER TABLE `interns_attendance`
  ADD PRIMARY KEY (`ON_DATE`,`COORDINATOR_ID`,`HTE_ID`,`ID`,`INTERNS_ID`),
  ADD KEY `COORDINATOR_ID` (`COORDINATOR_ID`),
  ADD KEY `HTE_ID` (`HTE_ID`),
  ADD KEY `ID` (`ID`),
  ADD KEY `interns_attendance_ibfk_4` (`INTERNS_ID`);

--
-- Indexes for table `interns_details`
--
ALTER TABLE `interns_details`
  ADD PRIMARY KEY (`INTERNS_ID`);

--
-- Indexes for table `intern_details`
--
ALTER TABLE `intern_details`
  ADD PRIMARY KEY (`INTERNS_ID`,`SESSION_ID`,`HTE_ID`),
  ADD KEY `ID` (`SESSION_ID`),
  ADD KEY `HTE_ID` (`HTE_ID`);

--
-- Indexes for table `pending_attendance`
--
ALTER TABLE `pending_attendance`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `intern_id` (`INTERNS_ID`),
  ADD KEY `hte_id` (`HTE_ID`);

--
-- Indexes for table `session_details`
--
ALTER TABLE `session_details`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `YEAR` (`YEAR`,`TERM`);

--
-- Indexes for table `student_deletion_log`
--
ALTER TABLE `student_deletion_log`
  ADD PRIMARY KEY (`log_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `coordinator`
--
ALTER TABLE `coordinator`
  MODIFY `COORDINATOR_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59829000;

--
-- AUTO_INCREMENT for table `host_training_establishment`
--
ALTER TABLE `host_training_establishment`
  MODIFY `HTE_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `interns_details`
--
ALTER TABLE `interns_details`
  MODIFY `INTERNS_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=259;

--
-- AUTO_INCREMENT for table `pending_attendance`
--
ALTER TABLE `pending_attendance`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `session_details`
--
ALTER TABLE `session_details`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `student_deletion_log`
--
ALTER TABLE `student_deletion_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `coordinator`
--
ALTER TABLE `coordinator`
  ADD CONSTRAINT `coordinator_ibfk_1` FOREIGN KEY (`HTE_ID`) REFERENCES `host_training_establishment` (`HTE_ID`) ON DELETE CASCADE;

--
-- Constraints for table `internship_needs`
--
ALTER TABLE `internship_needs`
  ADD CONSTRAINT `fk_coordinator` FOREIGN KEY (`COORDINATOR_ID`) REFERENCES `coordinator` (`COORDINATOR_ID`),
  ADD CONSTRAINT `fk_host_training_establishment` FOREIGN KEY (`HTE_ID`) REFERENCES `host_training_establishment` (`HTE_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_session_id` FOREIGN KEY (`SESSION_ID`) REFERENCES `session_details` (`ID`);

--
-- Constraints for table `interns_attendance`
--
ALTER TABLE `interns_attendance`
  ADD CONSTRAINT `interns_attendance_ibfk_1` FOREIGN KEY (`COORDINATOR_ID`) REFERENCES `coordinator` (`COORDINATOR_ID`),
  ADD CONSTRAINT `interns_attendance_ibfk_2` FOREIGN KEY (`HTE_ID`) REFERENCES `host_training_establishment` (`HTE_ID`),
  ADD CONSTRAINT `interns_attendance_ibfk_3` FOREIGN KEY (`ID`) REFERENCES `session_details` (`ID`),
  ADD CONSTRAINT `interns_attendance_ibfk_4` FOREIGN KEY (`INTERNS_ID`) REFERENCES `interns_details` (`INTERNS_ID`) ON DELETE CASCADE;

--
-- Constraints for table `intern_details`
--
ALTER TABLE `intern_details`
  ADD CONSTRAINT `intern_details_ibfk_1` FOREIGN KEY (`INTERNS_ID`) REFERENCES `interns_details` (`INTERNS_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `intern_details_ibfk_2` FOREIGN KEY (`SESSION_ID`) REFERENCES `session_details` (`ID`),
  ADD CONSTRAINT `intern_details_ibfk_3` FOREIGN KEY (`HTE_ID`) REFERENCES `host_training_establishment` (`HTE_ID`) ON DELETE CASCADE;

--
-- Constraints for table `pending_attendance`
--
ALTER TABLE `pending_attendance`
  ADD CONSTRAINT `pending_attendance_ibfk_1` FOREIGN KEY (`INTERNS_ID`) REFERENCES `interns_details` (`INTERNS_ID`),
  ADD CONSTRAINT `pending_attendance_ibfk_2` FOREIGN KEY (`hte_id`) REFERENCES `host_training_establishment` (`HTE_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
