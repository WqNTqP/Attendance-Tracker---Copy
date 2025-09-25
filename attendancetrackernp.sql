-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 22, 2025 at 08:37 AM
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
-- Table structure for table `interns_details`
--

CREATE TABLE `interns_details` (
  `INTERNS_ID` int(11) NOT NULL,
  `STUDENT_ID` int(11) NOT NULL,
  `NAME` varchar(30) NOT NULL,
  `SURNAME` varchar(100) DEFAULT NULL,
  `AGE` int(11) NOT NULL,
  `GENDER` varchar(10) NOT NULL,
  `EMAIL` varchar(30) NOT NULL,
  `PASSWORD` varchar(255) DEFAULT NULL,
  `CONTACT_NUMBER` varchar(15) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interns_details`
--

INSERT INTO `interns_details` (`INTERNS_ID`, `STUDENT_ID`, `NAME`, `SURNAME`, `AGE`, `GENDER`, `EMAIL`, `PASSWORD`, `CONTACT_NUMBER`, `profile_picture`) VALUES
(190, 59828881, 'Kim Charles', 'Emping', 23, 'Male', 'shadowd6163@gmail.com', '123456', '09513762404', '68b5486432a3f_190.jpg'),
(206, 59829532, 'JAMES', 'Smith', 21, 'MALE', 'james@hcdc.edu.ph', '123456', '\'09876523322\'', NULL),
(207, 59832315, 'Harold', 'Johnson', 22, 'MALE', 'Harold@hcdc.edu.ph', NULL, '\'09812654321\'', NULL),
(208, 59823526, 'Adriane', 'Brown', 23, 'MALE', 'Adriane@hcdc.edu.ph', NULL, '\'09526543212\'', NULL),
(209, 59829332, 'Urie', 'Garcia', 21, 'FEMALE', 'Urie@hcdc.edu,ph', NULL, '\'09476543212\'', NULL),
(210, 59832925, 'Joy', 'Lopez', 22, 'FEMALE', 'Joy@hcdc.edu.ph', NULL, '\'09813252615\'', NULL),
(211, 59823962, 'Emman', 'Miller', 22, 'MALE', 'Emman@hcdc.edu.ph', NULL, '\'09235157692\'', NULL),
(212, 59832356, 'Bob', 'Wilson', 22, 'MALE', 'Bob@hcdc.edu.ph', NULL, '\'09273679179\'', NULL),
(213, 59852427, 'Charles', 'Moore', 23, 'MALE', 'Charles@hcdc.edu.ph', NULL, '\'09283782367\'', NULL),
(214, 59834987, 'Kristine', 'Taylor', 22, 'FEMALE', 'Kristine@hcdc.edu.ph', NULL, '\'09382658121\'', NULL),
(215, 59829572, 'Robin', 'Anderson', 21, 'FEMALE', 'Robin@hcdc.edu.ph', NULL, '\'09237834612\'', NULL),
(216, 59823572, 'Kanye', 'Thomas', 23, 'MALE', 'Kanye@hcdc.edu.ph', NULL, '\'09823261716\'', NULL),
(217, 59823573, 'Sara', 'Jackson', 24, 'FEMALE', 'Sara@hcdc.edu.ph', NULL, '\'09823261717\'', NULL),
(218, 59823574, 'Ernest', 'White', 23, 'MALE', 'Ernest@hcdc.edu.ph', NULL, '\'09823261718\'', NULL),
(219, 59823575, 'Sophia', 'Harris', 21, 'FEMALE', 'Sophia@hdcc.edu.ph', NULL, '\'09823261719\'', NULL),
(220, 59823576, 'Mary', 'Martin', 22, 'FEMALE', 'mary@hcdc.edu.ph', NULL, '\'09823261720\'', NULL),
(221, 59823577, 'Lynn', 'Thompson', 23, 'FEMALE', 'Lynn@hcdc.edu.ph', NULL, '\'09823261721\'', NULL),
(222, 59823578, 'Christian', 'Martinez', 22, 'MALE', 'christian@hcdc.edu.ph', NULL, '\'09823261722\'', NULL),
(223, 59823579, 'John', 'Robinson', 23, 'MALE', 'John@hcdc.edu.ph', NULL, '\'09823261723\'', NULL),
(224, 59823580, 'Steve', 'Emping', 22, 'MALE', 'steve@hcdc.edu.ph', NULL, '\'09823261724\'', NULL),
(225, 59823581, 'Anita', 'Rodriguez', 21, 'FEMALE', 'anita@hcdc.edu.ph', NULL, '\'09823261725\'', NULL),
(226, 59823582, 'Jake', 'Lewis', 23, 'MALE', 'Jake@hcdc.edu.ph', NULL, '\'09823261726\'', NULL),
(227, 59823583, 'Joel', 'Lee', 23, 'MALE', 'Joel@hcdc.edu.ph', NULL, '\'09823261727\'', NULL),
(228, 59823584, 'Jane', 'Walker', 22, 'FEMALE', 'jane@hcdc.edu.ph', NULL, '\'09823261728\'', NULL),
(231, 59823587, 'Karl', 'Hall', 23, 'MALE', 'karl@hcdc.edu.ph', NULL, '\'09823261731\'', NULL),
(232, 59823588, 'Nicole', 'Allen', 22, 'FEMALE', 'nicole@hcdc.edu.ph', NULL, '\'09823261732\'', NULL),
(233, 59823589, 'Amy', 'Young', 21, 'FEMALE', 'Amy@hcdc.edu.ph', NULL, '\'09823261733\'', NULL),
(234, 59823590, 'Justin', 'Hernandez', 24, 'MALE', 'Justin@hcdc.edu.ph', NULL, '\'09823261734\'', NULL),
(235, 59823591, 'Stefan', 'King', 23, 'MALE', 'Stefan@hcdc.edu.ph', NULL, '\'09823261735\'', NULL),
(236, 59823592, 'Paul', 'Wright', 25, 'MALE', 'Paul@hcdc.edu.ph', NULL, '\'09823261736\'', NULL),
(237, 59823593, 'Hannah', 'Lopez', 23, 'FEMALE', 'Hannah@hcdc.edu.ph', NULL, '\'09823261737\'', NULL),
(238, 59823594, 'Joyce', 'Hill', 21, 'FEMALE', 'joyce@hcdc.edu.ph', NULL, '\'09823261738\'', NULL),
(239, 59823595, 'Mark', 'Scott', 22, 'MALE', 'mark@hdc.edu.ph', NULL, '\'09823261739\'', NULL),
(240, 59823596, 'Kate', 'Green', 23, 'FEMALE', 'kate@hcdc.edu.ph', NULL, '\'09823261740\'', NULL),
(241, 59823597, 'Jessica', 'Adams', 21, 'FEMALE', 'jessica@hcdc.edu.ph', NULL, '\'09823261741\'', NULL),
(242, 59823598, 'Tristan', 'Baker', 22, 'MALE', 'tristan@hcdc.edu.ph', NULL, '\'09823261742\'', NULL),
(243, 59823599, 'Emilie', 'Nelson', 21, 'FEMALE', 'emilie@hcdc.edu.ph', NULL, '\'09823261743\'', NULL),
(244, 59823600, 'Nate', 'Carter', 23, 'MALE', 'nate@hcdc.edu.ph', NULL, '\'09823261744\'', NULL),
(245, 59823601, 'Kimberly', 'Mitchell', 22, 'FEMALE', 'kimberly@hcdc.edu.ph', NULL, '\'09823261745\'', NULL),
(246, 59823602, 'Austin', 'Perez', 22, 'MALE', 'Austin@hcdc.edu.ph', NULL, '\'09823261746\'', NULL),
(247, 59823603, 'Prince', 'Roberts', 21, 'MALE', 'prince@hcdc.edu.ph', NULL, '\'09823261747\'', NULL),
(252, 59823608, 'Kylie', 'Campbell', 24, 'FEMALE', 'Kylie@hcdc.edu.ph', NULL, '\'09823261752\'', NULL),
(253, 59823609, 'Ken', 'Parker', 22, 'MALE', 'Ken@hcdc.edu.ph', NULL, '\'09823261753\'', NULL),
(254, 59823610, 'Maya', 'Evans', 23, 'FEMALE', 'Maya@hcdc.edu.ph', NULL, '\'09823261754\'', NULL),
(259, 598289964, 'Ako', 'Emping', 61, 'Male', 'kim69@gmail.com', '123456', '09513762404', NULL),
(263, 12345678, 'test', 'testing', 42, 'Male', 'kim69@gmail.com', NULL, '+63 951 376 240', NULL);

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

--
-- Indexes for dumped tables
--

--
-- Indexes for table `interns_details`
--
ALTER TABLE `interns_details`
  ADD PRIMARY KEY (`INTERNS_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `interns_details`
--
ALTER TABLE `interns_details`
  MODIFY `INTERNS_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=264;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
