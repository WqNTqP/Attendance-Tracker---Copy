-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 08, 2025 at 02:33 PM
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
-- Table structure for table `assigned_questions`
--

CREATE TABLE `assigned_questions` (
  `id` int(11) NOT NULL,
  `student_id` varchar(20) NOT NULL,
  `question_id` int(11) NOT NULL,
  `assigned_by` varchar(20) NOT NULL,
  `assigned_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `PROFILE` varchar(255) DEFAULT NULL,
  `HTE_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coordinator`
--

INSERT INTO `coordinator` (`COORDINATOR_ID`, `NAME`, `EMAIL`, `CONTACT_NUMBER`, `DEPARTMENT`, `USERNAME`, `PASSWORD`, `ROLE`, `PROFILE`, `HTE_ID`) VALUES
(123, 'ch', 'kim69@gmail.com', '09513762404', 'it', 'test', 'test', 'COORDINATOR', NULL, NULL),
(59828992, 'charles', 'charles@hcdc.edu.ph', '09513762404', 'IT', 'charles', '123456', 'ADMIN', NULL, 2),
(59828994, 'Kim Charles', 'shadowd6163@gmail.com', '09513762404', 'IT', 'shadow', '123456', 'ADMIN', '68db8cd8ec14c_59828994.jpg', 1),
(59828996, 'KIM CHARLES', 'kimcharles.emping@hcdc.edu.ph', '09513762404', 'IT_DEPARTMENT', 'kimcharles', '123456', 'COORDINATOR', '68d37a0d05ca1_59828996.jpg', NULL),
(59828999, 'superadmin', 'superadmin@gmail.com', '09513762404', 'IT', 'super', 'admin', 'SUPERADMIN', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `coordinator_evaluation`
--

CREATE TABLE `coordinator_evaluation` (
  `id` int(11) NOT NULL,
  `student_evaluation_id` int(11) NOT NULL,
  `STUDENT_ID` int(11) DEFAULT NULL,
  `coordinator_id` varchar(20) NOT NULL,
  `rating` int(11) NOT NULL,
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coordinator_evaluation`
--

INSERT INTO `coordinator_evaluation` (`id`, `student_evaluation_id`, `STUDENT_ID`, `coordinator_id`, `rating`, `timestamp`) VALUES
(583, 444, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(584, 445, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(585, 446, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(586, 447, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(587, 448, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(588, 449, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(589, 450, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(590, 451, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(591, 452, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(592, 453, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(593, 454, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(594, 455, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(595, 456, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(596, 457, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(597, 458, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(598, 459, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(599, 460, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(600, 461, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(601, 462, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(602, 463, 59832315, '59828996', 5, '2025-10-06 21:51:28'),
(623, 84, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(624, 85, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(625, 86, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(626, 87, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(627, 88, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(628, 89, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(629, 90, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(630, 91, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(631, 92, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(632, 93, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(633, 94, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(634, 95, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(635, 96, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(636, 97, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(637, 98, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(638, 99, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(639, 100, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(640, 101, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(641, 102, 12345, '59828996', 5, '2025-10-06 22:06:05'),
(642, 103, 12345, '59828996', 5, '2025-10-06 22:06:05');

-- --------------------------------------------------------

--
-- Table structure for table `evaluation_questions`
--

CREATE TABLE `evaluation_questions` (
  `question_id` int(11) NOT NULL,
  `category` varchar(50) NOT NULL,
  `question_text` text NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `evaluation_questions`
--

INSERT INTO `evaluation_questions` (`question_id`, `category`, `question_text`, `status`) VALUES
(1, 'Soft Skills', 'Describe a time you worked effectively in a team.', 'active'),
(2, 'Soft Skills', 'How do you handle stressful situations at work or school?', 'active'),
(3, 'Soft Skills', 'Give an example of how you adapted to a major change.', 'active'),
(4, 'Soft Skills', 'How do you approach solving a difficult problem?', 'active'),
(5, 'Soft Skills', 'What motivates you to achieve your goals?', 'active'),
(6, 'Soft Skills', 'How do you manage your time when working on multiple tasks?', 'active'),
(7, 'Soft Skills', 'Describe a situation where you showed leadership.', 'active'),
(8, 'Soft Skills', 'How do you respond to constructive criticism?', 'active'),
(9, 'Soft Skills', 'What steps do you take to stay organized?', 'active'),
(10, 'Soft Skills', 'How do you maintain a positive attitude during setbacks?', 'active'),
(11, 'Communication Skills', 'Explain a technical concept to someone with no background in the subject.', 'active'),
(12, 'Communication Skills', 'How do you ensure your message is clearly understood?', 'active'),
(13, 'Communication Skills', 'Describe a time you resolved a misunderstanding.', 'active'),
(14, 'Communication Skills', 'How do you actively listen during conversations?', 'active'),
(15, 'Communication Skills', 'What strategies do you use to communicate in a group setting?', 'active'),
(16, 'Communication Skills', 'How do you handle feedback from others?', 'active'),
(17, 'Communication Skills', 'Describe a situation where you had to persuade someone.', 'active'),
(18, 'Communication Skills', 'How do you adjust your communication style for different audiences?', 'active'),
(19, 'Communication Skills', 'What role does non-verbal communication play in your interactions?', 'active'),
(20, 'Communication Skills', 'How do you clarify instructions or expectations when they are unclear?', 'active'),
(21, 'Personal and Interpersonal Skills', 'Demonstrated the ability to integrate theories learned in school and the practical work in your company.', 'active'),
(22, 'Personal and Interpersonal Skills', 'Demonstrated evidence of growth as a result of his apprenticeship.', 'active'),
(23, 'Personal and Interpersonal Skills', 'Demonstrated assertiveness and cleverness to new endeavors in the course of his/her training.', 'active'),
(24, 'Personal and Interpersonal Skills', 'Demonstrated adequate knowledge of work done.', 'active'),
(25, 'Personal and Interpersonal Skills', 'Demonstrated promptness and active attendance.', 'active'),
(26, 'Personal and Interpersonal Skills', 'Demonstrated skills in inter-personal relations.', 'active'),
(27, 'Personal and Interpersonal Skills', 'Demonstrated overall performance proficiency.', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `holidays`
--

CREATE TABLE `holidays` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `description` varchar(255) NOT NULL,
  `type` enum('regular','special') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `holidays`
--

INSERT INTO `holidays` (`id`, `date`, `description`, `type`, `created_at`) VALUES
(1, '2025-01-01', 'New Year\'s Day', 'regular', '2025-09-18 07:04:44'),
(2, '2025-04-09', 'Maundy Thursday', 'regular', '2025-09-18 07:04:44'),
(3, '2025-04-10', 'Good Friday', 'regular', '2025-09-18 07:04:44'),
(4, '2025-05-01', 'Labor Day', 'regular', '2025-09-18 07:04:44'),
(5, '2025-06-12', 'Independence Day', 'regular', '2025-09-18 07:04:44'),
(6, '2025-08-30', 'National Heroes Day', 'regular', '2025-09-18 07:04:44'),
(7, '2025-11-30', 'Bonifacio Day', 'regular', '2025-09-18 07:04:44'),
(8, '2025-12-25', 'Christmas Day', 'regular', '2025-09-18 07:04:44'),
(9, '2025-12-30', 'Rizal Day', 'regular', '2025-09-18 07:04:44'),
(10, '2025-02-25', 'EDSA People Power Revolution Anniversary', 'special', '2025-09-18 07:04:44'),
(11, '2025-04-11', 'Black Saturday', 'special', '2025-09-18 07:04:44'),
(12, '2025-08-21', 'Ninoy Aquino Day', 'special', '2025-09-18 07:04:44'),
(13, '2025-11-01', 'All Saints\' Day', 'special', '2025-09-18 07:04:44'),
(14, '2025-11-02', 'All Souls\' Day', 'special', '2025-09-18 07:04:44'),
(15, '2025-12-24', 'Christmas Eve', 'special', '2025-09-18 07:04:44'),
(16, '2025-12-31', 'New Year\'s Eve', 'special', '2025-09-18 07:04:44');

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
(59828996, 1, 1, 190, '2025-08-13', '12:04:00', '12:04:00'),
(59828996, 1, 1, 190, '2025-08-24', '17:51:00', '17:51:00'),
(59828996, 1, 1, 190, '2025-08-26', '10:52:00', '20:52:00'),
(59828996, 1, 1, 190, '2025-08-27', '11:02:00', '12:02:00'),
(59828996, 1, 1, 190, '2025-08-28', '08:00:00', '14:09:00'),
(59828996, 1, 1, 190, '2025-08-29', '08:16:00', '11:25:00'),
(59828996, 1, 1, 190, '2025-09-04', '12:52:00', '12:52:00'),
(59828996, 1, 1, 190, '2025-09-11', '14:03:00', '14:03:00'),
(59828996, 1, 1, 190, '2025-09-15', '08:00:00', '15:26:00'),
(59828996, 1, 1, 206, '2025-09-15', '15:25:00', '15:25:00');

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
(190, 59828881, 'Kim Charles', 'Emping', 23, 'Male', 'shadowd6163@gmail.com', '123456', '09513762404', '68db79d64cdc5_190.jpg'),
(206, 59829532, 'JAMES', 'Smith', 21, 'MALE', 'james@hcdc.edu.ph', '123456', '\'09876523322\'', '68db700345b4b_206.jpg'),
(207, 59832315, 'Harold', 'Johnson', 22, 'MALE', 'Harold@hcdc.edu.ph', '123456', '\'09812654321\'', NULL),
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
(278, 12345, 'John', 'Doe', 21, 'Male', 'johndoe@email.com', NULL, '09123456789', NULL),
(279, 67890, 'Jane', 'Smith', 22, 'Female', 'janesmith@email.com', NULL, '09987654321', NULL);

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
(259, 2, 3),
(278, 1, 2),
(279, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `receiver_type` enum('admin','student','coordinator') NOT NULL DEFAULT 'student',
  `sender_id` int(11) DEFAULT NULL,
  `sender_type` enum('admin','student','coordinator','system') DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0,
  `notification_type` varchar(50) DEFAULT 'report'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `receiver_id`, `receiver_type`, `sender_id`, `sender_type`, `title`, `message`, `reference_id`, `reference_type`, `created_at`, `is_read`, `notification_type`) VALUES
(23, 206, 'student', NULL, NULL, 'Report Returned', 'Your report has been returned for revision. Check report tab for details.', 7, 'report', '2025-09-19 08:05:27', 1, 'report_returned'),
(24, 206, 'student', NULL, NULL, 'Report Returned', 'Your report has been returned for revision. Check report tab for details.', 7, 'report', '2025-09-19 08:10:09', 1, 'report_returned'),
(25, 206, 'student', NULL, NULL, 'Report Returned', 'Your report has been returned for revision. Check report tab for details.', 7, 'report', '2025-09-19 08:25:21', 1, 'report_returned'),
(26, 206, 'student', NULL, NULL, 'Report Returned', 'Your report has been returned for revision. Check report tab for details.', 7, 'report', '2025-09-19 08:39:09', 1, 'report_returned'),
(27, 206, 'student', NULL, NULL, 'Report Returned', 'Your report has been returned for revision. Check report tab for details.', 7, 'report', '2025-09-19 08:44:03', 1, 'report_returned'),
(28, 206, 'student', NULL, NULL, 'Report Returned', 'Your report has been returned for revision. Check report tab for details.', 7, 'report', '2025-09-19 08:50:52', 1, 'report_returned'),
(29, 206, 'student', NULL, NULL, 'Report Returned', 'Your report has been returned for revision. Check report tab for details.', 7, 'report', '2025-09-19 09:00:41', 1, 'report_returned'),
(30, 206, 'student', NULL, NULL, 'Report Returned', 'Your report has been returned for revision. Check report tab for details.', 8, 'report', '2025-09-22 08:22:47', 1, 'report_returned'),
(31, 190, 'student', NULL, NULL, 'Report Returned', 'Your report has been returned for revision. Check report tab for details.', 9, 'report', '2025-09-22 10:27:57', 1, 'report_returned'),
(32, 206, 'student', NULL, NULL, 'Report Returned', 'Your report has been returned for revision. Check report tab for details.', 8, 'report', '2025-09-22 10:31:54', 1, 'report_returned'),
(33, 206, 'student', NULL, NULL, 'Report Returned', 'Your report has been returned for revision. Check report tab for details.', 8, 'report', '2025-09-22 10:37:07', 1, 'report_returned'),
(34, 206, 'student', NULL, NULL, 'Report Returned', 'Your report has been returned for revision. Check report tab for details.', 8, 'report', '2025-09-22 10:50:45', 1, 'report_returned'),
(35, 206, 'student', NULL, NULL, 'Report Returned', 'Your report has been returned for revision. Check report tab for details.', 8, 'report', '2025-09-22 10:57:12', 1, 'report_returned'),
(36, 206, 'student', NULL, NULL, 'Report Returned', 'Your report has been returned for revision. Check report tab for details.', 10, 'report', '2025-09-30 05:56:42', 0, 'report_returned'),
(37, 206, 'student', NULL, NULL, 'Report Returned', 'Your report has been returned for revision. Check report tab for details.', 10, 'report', '2025-09-30 06:37:06', 1, 'report_returned'),
(38, 190, 'student', NULL, NULL, 'Report Returned', 'Your report has been returned for revision. Check report tab for details.', 11, 'report', '2025-09-30 07:58:36', 1, 'report_returned');

-- --------------------------------------------------------

--
-- Table structure for table `past_data`
--

CREATE TABLE `past_data` (
  `id_number` varchar(20) DEFAULT NULL,
  `student_name` varchar(100) DEFAULT NULL,
  `year_graduated` varchar(20) DEFAULT NULL,
  `CC 102` int(11) DEFAULT NULL,
  `CC 103` int(11) DEFAULT NULL,
  `PF 101` int(11) DEFAULT NULL,
  `CC 104` int(11) DEFAULT NULL,
  `IPT 101` int(11) DEFAULT NULL,
  `IPT 102` int(11) DEFAULT NULL,
  `CC 106` int(11) DEFAULT NULL,
  `CC 105` int(11) DEFAULT NULL,
  `IM 101` int(11) DEFAULT NULL,
  `IM 102` int(11) DEFAULT NULL,
  `HCI 101` int(11) DEFAULT NULL,
  `HCI 102` int(11) DEFAULT NULL,
  `WS 101` int(11) DEFAULT NULL,
  `NET 101` int(11) DEFAULT NULL,
  `NET 102` int(11) DEFAULT NULL,
  `IAS 101` int(11) DEFAULT NULL,
  `IAS 102` int(11) DEFAULT NULL,
  `CAP 101` int(11) DEFAULT NULL,
  `CAP 102` int(11) DEFAULT NULL,
  `SP 101` int(11) DEFAULT NULL,
  `OJT Placement` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `past_data`
--

INSERT INTO `past_data` (`id_number`, `student_name`, `year_graduated`, `CC 102`, `CC 103`, `PF 101`, `CC 104`, `IPT 101`, `IPT 102`, `CC 106`, `CC 105`, `IM 101`, `IM 102`, `HCI 101`, `HCI 102`, `WS 101`, `NET 101`, `NET 102`, `IAS 101`, `IAS 102`, `CAP 101`, `CAP 102`, `SP 101`, `OJT Placement`) VALUES
('id_number', 'student_name', 'year_graduated', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'OJT Placement'),
('35917022', 'CASILAN, NOEL', '20122013_2', 81, 80, 76, 94, 86, 76, 83, 75, 75, 80, 80, 80, 78, 78, 78, 79, 78, 84, 83, 86, 'Technical Support'),
('40372041', 'HIDALGO, EVER PETER', '20142015_2', 81, 75, 78, 96, 94, 75, 80, 75, 82, 93, 89, 77, 99, 81, 78, 91, 79, 79, 94, 88, 'Business Operations'),
('42484051', 'ESCAMILLAN, VICTOR', '20142015_2', 83, 85, 87, 88, 89, 78, 94, 78, 88, 78, 94, 80, 86, 80, 83, 82, 78, 88, 86, 87, 'Systems Development'),
('44335051', 'BUENVIAJE, JOHN EMERSON', '20142015_2', 80, 82, 75, 94, 86, 80, 84, 78, 82, 98, 77, 75, 99, 75, 86, 79, 99, 89, 89, 88, 'Research'),
('45522061', 'RAMOS, JORDAN', '20132014_1', 83, 90, 75, 90, 99, 77, 84, 75, 86, 95, 92, 79, 98, 75, 75, 98, 80, 83, 97, 75, 'Research'),
('45545061', 'CASTILLO, RUPERT JHAN DOMINIC', '20142015_2', 77, 75, 75, 83, 77, 75, 81, 75, 78, 79, 77, 75, 98, 75, 75, 99, 99, 75, 93, 75, 'Systems Development'),
('45809061', 'HOYOHOY, FEMINI', '20132014_1', 77, 75, 88, 78, 88, 75, 80, 75, 80, 99, 88, 80, 84, 80, 75, 81, 97, 94, 83, 77, 'Research'),
('47157061', 'MENDEZ, SAMARTINO', '20132014_1', 75, 75, 82, 85, 94, 76, 87, 75, 89, 97, 83, 79, 89, 75, 77, 95, 95, 91, 90, 97, 'Business Operations'),
('47634061', 'EDQUILANG, JOEL', '20162017_2', 75, 79, 80, 92, 76, 75, 83, 75, 85, 93, 88, 79, 81, 88, 75, 94, 77, 96, 80, 87, 'Research'),
('48461456', 'PLAZA, RODEL', '20172018-1', 82, 79, 75, 81, 94, 75, 80, 75, 81, 87, 97, 76, 97, 83, 76, 90, 93, 92, 85, 81, 'Research'),
('48461958', 'BAUTISTA, ALDOUS EMIL', '20112012_2', 91, 78, 75, 92, 95, 77, 83, 85, 82, 95, 86, 78, 79, 77, 82, 98, 83, 93, 93, 85, 'Research'),
('48462331', 'MASANGUID, KEN', '20112012_2', 97, 87, 88, 88, 85, 82, 88, 86, 81, 99, 95, 75, 75, 75, 83, 87, 81, 82, 86, 83, 'Business Operations'),
('48462574', 'LOPEZ, JENNALYN', '20112012_2', 83, 81, 77, 80, 89, 76, 93, 80, 78, 81, 92, 75, 87, 85, 85, 83, 97, 89, 85, 99, 'Business Operations'),
('48462603', 'BAGA, JOEL', '20162017_2', 86, 86, 76, 83, 93, 77, 83, 78, 85, 76, 83, 79, 96, 76, 75, 86, 89, 86, 94, 90, 'Systems Development'),
('48462603', 'XXXXXBAGAXXXXX, XXXXJOELXXXXX', '20162017_2', 86, 86, 76, 85, 85, 77, 83, 78, 85, 96, 83, 79, 93, 76, 75, 83, 89, 85, 81, 81, 'Business Operations'),
('48462637', 'DINAGAT, ELEZAR', '20152016_2', 86, 79, 83, 76, 89, 75, 84, 75, 91, 92, 91, 83, 97, 81, 87, 76, 83, 86, 95, 84, 'Research'),
('48462739', 'MASCARIÑAS, AIKO MAE', '20142015_2', 75, 83, 75, 79, 89, 75, 88, 75, 69, 82, 84, 80, 99, 75, 81, 96, 89, 75, 77, 75, 'Systems Development'),
('48464412', 'VILLANUEVA, GLENN MICHAEL', '20142015_2', 83, 81, 83, 75, 82, 75, 90, 79, 85, 93, 86, 81, 95, 84, 82, 81, 79, 87, 92, 97, 'Business Operations'),
('48465762', 'YAP, SHAHANI', '20122013_1', 83, 80, 83, 84, 99, 79, 85, 75, 80, 92, 92, 75, 82, 76, 89, 75, 85, 92, 89, 77, 'Research'),
('48465884', 'TATOY, RYAN', '20112012_2', 83, 85, 77, 98, 94, 82, 94, 81, 77, 87, 91, 75, 78, 84, 82, 86, 87, 87, 96, 85, 'Technical Support'),
('48466175', 'BOK, RICHARD JR.', '20122013_1', 81, 80, 76, 80, 94, 78, 85, 76, 75, 93, 93, 83, 82, 76, 95, 88, 80, 85, 78, 89, 'Technical Support'),
('48466289', 'SILFAVAN, LEO RUPERT', '20152016_2', 87, 76, 76, 83, 78, 75, 77, 75, 78, 95, 92, 76, 98, 83, 75, 88, 88, 89, 88, 95, 'Business Operations'),
('48466348', 'ZOSA, GOPER LEO', '20142015_3', 75, 85, 83, 98, 86, 77, 88, 77, 87, 90, 84, 79, 99, 78, 82, 83, 90, 81, 76, 78, 'Systems Development'),
('48466368', 'LIM, ERIKA MAE', '20122013_2', 81, 87, 78, 93, 90, 82, 88, 75, 85, 87, 84, 82, 91, 81, 88, 75, 79, 87, 92, 85, 'Research'),
('48466419', 'MASCULINO, JOHN ELY ', '20112012_2', 82, 84, 79, 83, 79, 78, 84, 78, 79, 97, 88, 84, 77, 77, 82, 98, 90, 92, 80, 91, 'Business Operations'),
('48466569', 'BOLFANGO, MARC CYRIL', '20132014_2', 80, 81, 80, 84, 92, 75, 81, 75, 82, 97, 83, 82, 91, 86, 76, 97, 92, 88, 92, 85, 'Research'),
('48466679', 'GRADO, IVY ROSE ', '20112012_2', 85, 79, 77, 85, 83, 75, 92, 80, 78, 76, 89, 75, 83, 81, 79, 91, 80, 94, 76, 88, 'Systems Development'),
('48466759', 'TING, RALFH JADE', '20132014_1', 83, 78, 89, 79, 92, 75, 83, 75, 81, 96, 88, 79, 90, 75, 76, 89, 80, 84, 98, 97, 'Business Operations'),
('48466855', 'MATAGANAS, ARRIEN LLOYD', '20122013_2', 95, 92, 82, 82, 84, 81, 89, 77, 80, 91, 87, 75, 89, 80, 86, 84, 82, 85, 83, 99, 'Business Operations'),
('48467009', 'CAHILOG , VIRGILIO JR. ', '20142015_2', 79, 75, 75, 96, 76, 75, 75, 78, 76, 97, 78, 75, 84, 85, 86, 85, 80, 95, 97, 98, 'Research'),
('48467133', 'SAPANZA, JAKE', '20132014_1', 81, 77, 78, 86, 81, 75, 82, 75, 77, 84, 89, 81, 99, 75, 78, 92, 86, 81, 79, 94, 'Business Operations'),
('48467197', 'ADLAON, AL JUNE ', '20142015_2', 76, 80, 75, 90, 79, 75, 91, 75, 82, 98, 84, 77, 84, 75, 75, 81, 86, 87, 78, 82, 'Business Operations'),
('48467321', 'GUARDIAN, JAMES', '20112012_2', 78, 78, 75, 88, 89, 76, 82, 75, 77, 88, 90, 79, 76, 75, 76, 91, 84, 84, 88, 84, 'Research'),
('48467946', 'JAVIER, GLEND ', '20112012_2', 88, 87, 81, 77, 91, 78, 82, 77, 85, 90, 85, 76, 84, 76, 76, 99, 96, 93, 98, 91, 'Research'),
('48467951', 'GONZALES, PHILIP ', '20112012_2', 80, 77, 77, 93, 96, 75, 82, 80, 78, 78, 90, 75, 89, 69, 78, 96, 97, 99, 87, 93, 'Systems Development'),
('48468028', 'RAGAS, DOMINADOR JR.', '20132014_1', 84, 98, 83, 89, 81, 80, 88, 75, 92, 77, 85, 75, 90, 78, 76, 76, 75, 96, 89, 81, 'Systems Development'),
('48468244', 'TORRES, VIRGINIA', '20172018_2', 75, 75, 75, 80, 94, 75, 85, 75, 79, 98, 92, 75, 93, 75, 75, 97, 96, 81, 96, 85, 'Research'),
('48468266', 'ESCABILLAS, ALVIN', '20122013_1', 81, 82, 75, 92, 83, 77, 85, 78, 77, 80, 90, 80, 78, 75, 77, 81, 92, 86, 82, 86, 'Technical Support'),
('48468310', 'CABALUNA, JOVENCIO JESSIE I', '20122013_1', 75, 80, 76, 93, 82, 75, 81, 75, 75, 79, 91, 75, 80, 75, 88, 91, 80, 78, 87, 85, 'Technical Support'),
('48468511', 'PANDAY, JOHN SHEERWOOD', '20122013_1', 76, 78, 77, 91, 93, 81, 77, 75, 75, 77, 92, 75, 82, 75, 87, 88, 75, 78, 88, 84, 'Systems Development'),
('48468608', 'MARISCOTES, FERNADEL', '20112012_2', 78, 82, 75, 77, 94, 77, 93, 82, 78, 92, 91, 75, 75, 80, 85, 94, 85, 81, 98, 86, 'Research'),
('48469076', 'ITIL, KEITH MICHAEL', '20132014_2', 85, 75, 81, 97, 95, 75, 87, 76, 82, 81, 90, 78, 90, 84, 80, 99, 95, 82, 98, 88, 'Systems Development'),
('48469181', 'LUNA, CHIL', '20122013_2', 78, 78, 87, 90, 93, 75, 82, 75, 75, 94, 77, 75, 96, 75, 90, 97, 81, 90, 95, 77, 'Research'),
('48469200', 'MALIGAYA, FATIMA', '20112012_2', 79, 85, 82, 89, 80, 79, 88, 77, 78, 94, 91, 81, 96, 75, 79, 94, 85, 75, 80, 85, 'Business Operations'),
('48469244', 'PECAJAS, JOHN REL MON', '20132014_3', 76, 76, 75, 87, 84, 75, 83, 75, 75, 92, 75, 75, 84, 75, 90, 88, 95, 85, 94, 89, 'Research'),
('48469247', 'SEVARE, DARLEN', '20122013_2', 75, 77, 75, 78, 84, 78, 89, 77, 75, 93, 80, 82, 94, 75, 79, 91, 94, 89, 96, 96, 'Research'),
('48469258', 'MOISES, JOHN EDWARD', '20112012_3', 86, 77, 77, 81, 82, 75, 86, 76, 77, 86, 90, 80, 89, 72, 76, 79, 84, 90, 75, 75, 'Systems Development'),
('48469269', 'SIGATON, PATRICK JOHN', '20142015_1', 78, 80, 75, 77, 87, 75, 92, 75, 86, 77, 79, 76, 86, 75, 77, 95, 83, 85, 96, 97, 'Business Operations'),
('48469270', 'CUARTERON, ANTHONY', '20122013_2', 77, 81, 75, 85, 97, 75, 85, 75, 75, 97, 80, 75, 85, 75, 86, 93, 83, 87, 76, 87, 'Business Operations'),
('48469271', 'BEREY, CATHERINE', '20112012_2', 79, 85, 83, 91, 97, 77, 90, 82, 90, 92, 94, 82, 93, 80, 86, 85, 85, 83, 75, 75, 'Technical Support'),
('48469272', 'AGOD, APRIL MONIQUE', '20112012_3', 76, 82, 75, 86, 88, 78, 90, 76, 77, 78, 92, 83, 99, 77, 78, 77, 82, 75, 86, 87, 'Systems Development'),
('48469273', 'DIABORDO, CHRISTIAN RJ', '20112012_2', 81, 85, 75, 96, 82, 75, 89, 75, 77, 93, 90, 80, 86, 77, 79, 91, 83, 85, 75, 79, 'Systems Development'),
('48469275', 'PEDRAZA, ANNA MAE', '20122013_1', 80, 82, 87, 89, 82, 79, 88, 75, 79, 89, 92, 75, 87, 78, 87, 84, 89, 97, 94, 77, 'Research'),
('48469306', 'ETULLE, APRIL BETH ', '20122013_1', 77, 81, 75, 77, 86, 75, 88, 78, 76, 84, 93, 83, 93, 80, 84, 77, 92, 80, 77, 93, 'Business Operations'),
('48469322', 'LAVIÑA, DAVID RYAN', '20112012_2', 90, 91, 91, 97, 86, 80, 85, 86, 84, 75, 94, 83, 89, 80, 83, 77, 95, 80, 83, 88, 'Systems Development'),
('48469334', 'RIÑOS, JENNIFER', '20112012_3', 76, 76, 75, 93, 78, 75, 90, 75, 75, 99, 89, 80, 93, 75, 78, 87, 78, 85, 88, 97, 'Business Operations'),
('48469340', 'TAGOTONGAN, EMILIA ANTHONETTE JANE', '20122013_1', 75, 79, 82, 82, 88, 76, 91, 75, 75, 87, 92, 75, 92, 75, 87, 97, 98, 98, 92, 86, 'Research'),
('48469343', 'PATOS, JENNIFER', '20112012_2', 82, 85, 79, 91, 86, 75, 87, 79, 88, 99, 91, 82, 79, 75, 81, 96, 88, 99, 83, 95, 'Business Operations'),
('48469376', 'AMORES, LUIS ALLAINE', '20122013_1', 82, 81, 75, 94, 87, 75, 82, 76, 75, 82, 91, 83, 99, 77, 86, 95, 88, 92, 84, 97, 'Systems Development'),
('48469396', 'VOTACION, ROXANNE JOY', '20112012_2', 75, 76, 75, 98, 78, 75, 84, 77, 75, 85, 93, 77, 79, 75, 77, 90, 97, 97, 96, 96, 'Research'),
('48469401', 'REYES, FEBIN LLOYD', '20112012_3', 80, 82, 75, 90, 92, 78, 89, 78, 78, 86, 90, 82, 80, 76, 81, 80, 90, 75, 94, 80, 'Research'),
('48469408', 'SACRO, VINA', '20112012_2', 77, 85, 75, 80, 97, 75, 88, 77, 75, 85, 95, 79, 81, 75, 80, 92, 80, 79, 81, 94, 'Business Operations'),
('48469418', 'BASCO, LOIBONN KIN', '20142015_1', 93, 85, 75, 91, 99, 75, 82, 76, 82, 78, 77, 77, 98, 78, 75, 77, 92, 79, 82, 79, 'Systems Development'),
('48469422', 'CANDA, ROXAN', '20112012_2', 80, 77, 75, 87, 83, 80, 86, 82, 77, 87, 94, 75, 99, 77, 79, 98, 98, 95, 92, 79, 'Research'),
('48469427', 'ABUZO, ANGELOU ', '20112012_2', 80, 77, 75, 96, 83, 76, 83, 79, 76, 78, 92, 79, 96, 78, 81, 75, 78, 95, 84, 87, 'Systems Development'),
('48469453', 'GASCON, MELLAN FRITZIE', '20112012_2', 77, 85, 80, 76, 87, 77, 88, 75, 78, 78, 89, 75, 77, 80, 82, 87, 89, 83, 90, 78, 'Research'),
('48469483', 'VALLENTE, ARNOLD', '20112012_2', 87, 79, 84, 91, 91, 78, 89, 82, 79, 95, 90, 82, 81, 76, 77, 81, 95, 77, 82, 90, 'Business Operations'),
('48469494', 'ARANCON, BEATRIZ LUCIA', '20112012_3', 77, 80, 75, 77, 77, 78, 89, 75, 77, 89, 90, 75, 80, 76, 80, 78, 95, 75, 75, 78, 'Technical Support'),
('48469513', 'PUTIAN, JAYSON', '20112012_2', 79, 77, 76, 90, 82, 77, 88, 80, 82, 89, 90, 75, 85, 75, 79, 76, 76, 87, 95, 93, 'Research'),
('48469525', 'ZACAL, SHEILA MAE', '20132014_2', 75, 86, 75, 99, 83, 75, 88, 75, 82, 76, 87, 75, 80, 84, 85, 98, 96, 80, 76, 79, 'Technical Support'),
('48469557', 'PATAL, PATRIK', '20122013_1', 85, 78, 75, 90, 89, 78, 77, 79, 80, 78, 93, 83, 77, 75, 88, 95, 87, 93, 86, 82, 'Technical Support'),
('48469565', 'PIELAGO, GLEEN BLAIR', '20122013_1', 79, 75, 75, 78, 82, 75, 83, 75, 75, 88, 93, 76, 78, 93, 75, 90, 81, 98, 91, 85, 'Research'),
('48469592', 'SALINAS, CHERRIE ANN', '20122013_2', 82, 89, 75, 84, 89, 79, 87, 79, 85, 86, 83, 75, 88, 78, 78, 85, 98, 89, 88, 81, 'Research'),
('48469618', 'BARBADILLO, JOHN BOMEL', '20112012_2', 87, 88, 85, 98, 77, 82, 88, 81, 84, 94, 90, 82, 78, 76, 80, 88, 75, 95, 88, 97, 'Business Operations'),
('48469643', 'FACTURA, JADE ROMEO', '20112012_2', 75, 81, 77, 81, 75, 76, 84, 75, 79, 78, 95, 79, 89, 71, 79, 95, 95, 95, 77, 95, 'Business Operations'),
('48469650', 'RAMISO, JESSILOU', '20112012_2', 86, 85, 83, 80, 90, 76, 84, 78, 78, 78, 96, 81, 91, 76, 80, 83, 76, 86, 78, 75, 'Systems Development'),
('48469659', 'CABRERA, MA. VANESSA', '20112012_2', 75, 77, 75, 92, 96, 75, 89, 78, 75, 85, 92, 80, 92, 80, 78, 99, 94, 76, 86, 98, 'Business Operations'),
('48469672', 'ESTREBILLO, DYCHEN', '20122013_2', 75, 75, 81, 80, 90, 75, 87, 75, 75, 82, 81, 75, 96, 75, 75, 82, 81, 95, 94, 76, 'Research'),
('48469679', 'CABATUAN, REAH', '20122013_2', 75, 79, 75, 93, 82, 75, 80, 75, 75, 83, 83, 75, 77, 75, 89, 97, 97, 77, 90, 81, 'Technical Support'),
('48469681', 'CAINOY, RACHAEL', '20112012_2', 78, 88, 83, 76, 84, 76, 84, 76, 80, 78, 91, 75, 98, 82, 84, 78, 83, 83, 93, 88, 'Technical Support'),
('48469682', 'PASCUAL, BEVERLY', '20122013_1', 77, 75, 75, 96, 83, 75, 86, 75, 75, 75, 88, 75, 96, 72, 89, 93, 83, 94, 96, 81, 'Systems Development'),
('48469706', 'BALINO, TRISTAN RUZER', '20122013_2', 86, 78, 76, 88, 89, 76, 85, 75, 75, 79, 79, 81, 85, 81, 79, 88, 75, 91, 98, 81, 'Systems Development'),
('48469733', 'AGUILAR, RABONNI RUAH', '20112012_2', 87, 83, 83, 80, 77, 79, 85, 80, 78, 99, 89, 82, 77, 75, 76, 91, 80, 94, 80, 82, 'Research'),
('48469740', 'JARA, JAYSON', '20112012_2', 91, 77, 86, 77, 96, 77, 86, 81, 79, 95, 88, 86, 84, 75, 80, 81, 77, 91, 86, 86, 'Research'),
('48469767', 'VILLANUEVA, JUSTINE', '20112012_2', 83, 82, 75, 90, 82, 80, 87, 79, 83, 85, 89, 77, 94, 75, 82, 91, 87, 96, 75, 79, 'Systems Development'),
('48469792', 'LA ROSA, MIKEL KERVIN', '20112012_2', 83, 79, 81, 85, 84, 79, 88, 82, 80, 81, 92, 84, 87, 80, 82, 75, 93, 99, 78, 98, 'Business Operations'),
('48469793', 'AMORA, ILOHNA', '20122013_1', 81, 79, 75, 94, 81, 75, 86, 75, 76, 75, 88, 75, 96, 75, 89, 86, 86, 97, 84, 90, 'Systems Development'),
('48469931', 'CAVAN, DAN JEO', '20122013_1', 86, 86, 79, 83, 75, 77, 87, 80, 83, 89, 90, 75, 80, 80, 83, 92, 76, 89, 93, 91, 'Research'),
('48469936', 'TAROJA, LAARNIE', '20122013_1', 84, 77, 84, 77, 81, 78, 91, 75, 75, 98, 92, 75, 84, 75, 89, 94, 84, 84, 93, 77, 'Research'),
('48469971', 'DE CATALINA, NORWIN JOY', '20112012_2', 77, 80, 76, 94, 86, 75, 83, 77, 79, 86, 92, 79, 76, 78, 80, 87, 97, 98, 78, 96, 'Business Operations'),
('48469994', 'RODRIGUEZ, IVY GALE', '20112012_2', 81, 90, 81, 91, 83, 77, 87, 76, 81, 97, 90, 75, 80, 85, 84, 98, 95, 89, 94, 82, 'Research'),
('48469995', 'ASILUM, JODY', '20112012_2', 78, 80, 75, 96, 78, 77, 81, 75, 83, 87, 90, 75, 78, 79, 76, 96, 88, 83, 85, 77, 'Research'),
('48470088', 'VELOZ, KRISTA JANE', '20112012_2', 82, 83, 75, 77, 86, 76, 86, 82, 78, 86, 91, 75, 98, 80, 80, 97, 77, 79, 98, 80, 'Technical Support'),
('48470102', 'LOMA, RANNIEDAN MERV', '20122013_2', 89, 83, 88, 84, 80, 76, 88, 77, 83, 89, 84, 75, 84, 90, 84, 91, 76, 82, 96, 82, 'Technical Support'),
('48470132', 'TUMURAN, EARL BRYAN', '20112012_2', 75, 79, 75, 91, 95, 75, 89, 78, 75, 80, 87, 75, 88, 75, 79, 85, 98, 94, 89, 78, 'Systems Development'),
('48470153', 'GUINTO, MARY GRACE', '20112012_2', 82, 82, 79, 89, 87, 80, 90, 82, 82, 81, 90, 82, 90, 75, 80, 94, 81, 97, 90, 75, 'Research'),
('48470156', 'MAPANSA, HERON SALVADOR', '20122013_1', 76, 76, 81, 92, 85, 79, 89, 77, 77, 99, 93, 75, 84, 75, 89, 76, 81, 82, 80, 92, 'Business Operations'),
('48470159', 'BLASQUEZ, ARIANE', '20122013_1', 77, 78, 85, 78, 98, 76, 90, 75, 78, 93, 85, 75, 96, 75, 87, 84, 95, 82, 99, 88, 'Research'),
('48470194', 'COMISO, PRYNCE JUNAR JAKE', '20122013_1', 86, 89, 83, 94, 97, 75, 82, 85, 80, 92, 85, 88, 81, 90, 77, 92, 89, 98, 85, 88, 'Research'),
('48470199', 'MAMOLO, JESTONI', '20142015_2', 81, 84, 83, 87, 75, 83, 88, 81, 93, 89, 82, 87, 88, 83, 83, 90, 85, 82, 87, 82, 'Technical Support'),
('48470205', 'REGIS, REGINE MAY', '20112012_2', 81, 80, 75, 79, 76, 76, 88, 81, 75, 86, 89, 78, 79, 82, 82, 76, 86, 90, 80, 83, 'Technical Support'),
('48470210', 'FUENTES, FEBBY GRACE ', '20122013_2', 82, 77, 86, 91, 82, 75, 87, 75, 75, 75, 81, 75, 83, 78, 75, 82, 99, 80, 75, 93, 'Systems Development'),
('48470230', 'SILVANO, BENJI', '20112012_2', 75, 81, 76, 90, 82, 75, 91, 82, 75, 95, 93, 82, 75, 80, 80, 93, 75, 84, 86, 81, 'Research'),
('48470239', 'ACEDILLA, GENEVE JOY', '20112012_2', 80, 82, 76, 97, 84, 75, 89, 76, 79, 86, 87, 75, 87, 79, 79, 77, 84, 78, 76, 92, 'Business Operations'),
('48470275', 'BALANA, DELMAR', '20112012_2', 78, 82, 77, 76, 89, 75, 90, 82, 77, 94, 94, 83, 99, 80, 83, 79, 87, 84, 79, 86, 'Business Operations'),
('48470294', 'CRUZ, MARY ANTONETTE', '20142015_1', 75, 76, 83, 82, 76, 75, 91, 75, 78, 91, 75, 75, 78, 80, 86, 98, 93, 82, 93, 97, 'Business Operations'),
('48470295', 'LOPEZ JR., CHARITO  ROY', '20122013_2', 78, 77, 88, 89, 82, 80, 83, 78, 79, 94, 89, 75, 83, 75, 85, 99, 84, 97, 83, 98, 'Business Operations'),
('48470297', 'SALGUERO, RIOROSE', '20142015_2', 75, 75, 76, 83, 77, 75, 86, 75, 80, 86, 81, 78, 89, 75, 83, 87, 90, 80, 94, 78, 'Research'),
('48470336', 'RESTERIO, KRISIA MAXINE', '20122013_1', 75, 77, 85, 83, 90, 76, 90, 75, 80, 75, 92, 83, 90, 75, 90, 76, 98, 85, 99, 83, 'Systems Development'),
('48470359', 'ADOLFO, JEN ROSE', '20112012_2', 75, 78, 75, 80, 93, 76, 90, 79, 75, 93, 88, 78, 83, 77, 78, 88, 83, 92, 98, 99, 'Research'),
('48470380', 'BONTIA, ISAAC MEDEL', '20112012_2', 78, 75, 78, 92, 93, 78, 90, 80, 81, 96, 87, 75, 91, 85, 84, 91, 97, 92, 78, 79, 'Technical Support'),
('48470408', 'BURBANO, APOL JUN', '20112012_2', 90, 83, 87, 79, 85, 85, 89, 86, 88, 84, 93, 84, 85, 87, 87, 84, 79, 78, 89, 84, 'Technical Support'),
('48470414', 'BARBER, CHERRYL LOUISE', '20112012_2', 77, 77, 75, 93, 96, 75, 88, 77, 77, 84, 87, 78, 91, 75, 78, 99, 94, 97, 98, 90, 'Research'),
('48470417', 'DIGAL, JERRY', '20112012_2', 82, 79, 75, 89, 84, 75, 90, 82, 82, 91, 91, 78, 80, 77, 82, 92, 80, 99, 79, 93, 'Business Operations'),
('48470454', 'DAWAL, KAMILLE', '20112012_2', 83, 91, 78, 98, 81, 78, 90, 80, 80, 95, 92, 75, 98, 77, 82, 77, 81, 88, 84, 99, 'Business Operations'),
('48470457', 'ESPINOSA, PRINCESS APRIL', '20112012_2', 76, 77, 76, 75, 90, 77, 88, 78, 77, 94, 92, 75, 95, 80, 78, 78, 75, 84, 88, 76, 'Research'),
('48470458', 'GONZALES, HONEY GRACE', '20112012_2', 82, 83, 77, 86, 88, 75, 88, 81, 79, 94, 90, 79, 80, 84, 84, 85, 77, 99, 99, 98, 'Research'),
('48470471', 'DIGAMON, MAYELLA GRACE', '20132014_2', 77, 85, 86, 93, 95, 75, 86, 75, 79, 92, 86, 83, 98, 81, 75, 79, 86, 90, 75, 90, 'Business Operations'),
('48470548', 'HUMANGIT, CARYL MEA', '20112012_2', 77, 77, 75, 93, 92, 75, 89, 80, 79, 96, 91, 75, 84, 75, 76, 84, 83, 95, 88, 96, 'Business Operations'),
('48470575', 'DEMETERIO, FARRAH MAE', '20132014_1', 75, 75, 80, 82, 88, 78, 85, 75, 76, 89, 81, 76, 95, 75, 75, 97, 80, 98, 99, 88, 'Research'),
('48470592', 'MEDIANO, DEVINE MAE ', '20112012_2', 81, 81, 76, 95, 89, 75, 85, 77, 76, 98, 91, 81, 78, 75, 76, 84, 86, 91, 80, 92, 'Business Operations'),
('48470598', 'ALALAYIN, ROMEO RENZ', '20122013_2', 77, 75, 75, 89, 92, 79, 82, 75, 77, 97, 77, 75, 81, 75, 77, 92, 94, 79, 88, 95, 'Business Operations'),
('48470599', 'ROSALADA, JORDAN', '20142015_3', 91, 84, 75, 77, 87, 75, 91, 75, 75, 78, 84, 77, 89, 75, 80, 91, 93, 94, 76, 76, 'Systems Development'),
('48470632', 'DALAGAN, RAYMUND', '20112012_2', 83, 83, 85, 87, 91, 84, 91, 86, 83, 86, 86, 84, 83, 84, 82, 82, 75, 87, 80, 88, 'Technical Support'),
('48470675', 'SOLARTE, JACQUE LOUMAY', '20112012_2', 75, 80, 75, 96, 80, 75, 89, 79, 76, 88, 93, 75, 81, 77, 80, 84, 89, 77, 90, 98, 'Business Operations'),
('48470723', 'AGDAMAG, ACE', '20112012_2', 87, 77, 86, 78, 89, 82, 91, 86, 85, 86, 90, 84, 75, 80, 83, 86, 77, 95, 80, 91, 'Business Operations'),
('48470751', 'LACORTE, PAUL JOHN', '20112012_2', 84, 78, 75, 94, 85, 82, 85, 77, 82, 89, 88, 75, 95, 76, 77, 83, 78, 92, 97, 88, 'Research'),
('48470773', 'SUPREMO, JOHN MARK', '20112012_2', 79, 75, 78, 84, 83, 75, 92, 81, 83, 97, 87, 75, 78, 80, 80, 96, 86, 82, 81, 89, 'Business Operations'),
('48470820', 'GABAISEN, JENEVI', '20112012_2', 93, 89, 86, 85, 97, 84, 95, 85, 87, 94, 90, 86, 82, 85, 86, 79, 93, 77, 82, 88, 'Business Operations'),
('48470869', 'TAGUE, JULAIZA', '20122013_1', 80, 75, 75, 98, 85, 75, 83, 75, 76, 79, 90, 75, 89, 75, 88, 98, 82, 96, 87, 91, 'Systems Development'),
('48470909', 'CENTINO, RG', '20132014_2', 84, 86, 87, 93, 86, 80, 90, 75, 90, 77, 95, 75, 99, 80, 83, 93, 92, 77, 77, 78, 'Systems Development'),
('48471033', 'DELA PEÑA, RICA', '20132014_2', 79, 83, 77, 87, 84, 75, 85, 75, 84, 98, 79, 75, 75, 75, 80, 79, 75, 91, 92, 85, 'Research'),
('48471037', 'GULLE, RUSSELL', '20112012_2', 88, 96, 83, 88, 89, 80, 89, 83, 81, 88, 85, 75, 87, 77, 85, 91, 96, 99, 84, 92, 'Systems Development'),
('48471051', 'PERANTE, VERLEY GRACE', '20122013_1', 81, 88, 79, 91, 83, 81, 87, 79, 79, 78, 90, 75, 99, 76, 82, 76, 83, 99, 86, 91, 'Systems Development'),
('48471066', 'FERNANDEZ, JAMES', '20122013_2', 80, 78, 75, 86, 76, 75, 77, 75, 76, 91, 77, 75, 94, 75, 85, 86, 91, 87, 75, 93, 'Business Operations'),
('48471076', 'ROSALES, AIMEE LYN', '20122013_1', 75, 92, 75, 96, 89, 75, 85, 75, 82, 96, 85, 75, 76, 75, 77, 88, 79, 80, 88, 91, 'Business Operations'),
('48471147', 'ABLAZO, JAZELLE MAY', '20122013_2', 80, 75, 78, 96, 94, 75, 89, 75, 79, 99, 81, 75, 91, 80, 76, 93, 76, 94, 75, 83, 'Business Operations'),
('48471156', 'LEOPOLDO, SHEILA MAE', '20112012_2', 78, 81, 76, 79, 89, 79, 91, 81, 78, 78, 92, 75, 87, 80, 82, 81, 83, 93, 89, 95, 'Technical Support'),
('48471259', 'DADULLA, JAN LEA', '20112012_2', 82, 77, 75, 79, 94, 77, 84, 75, 78, 77, 92, 83, 91, 77, 77, 96, 76, 76, 91, 85, 'Systems Development'),
('48471266', 'UY, ELVIN', '20122013_1', 79, 77, 75, 94, 77, 79, 86, 76, 76, 81, 90, 75, 86, 72, 92, 80, 94, 94, 99, 75, 'Research'),
('48471423', 'LORO, MARLON DOMINIC', '20122013_1', 82, 75, 75, 84, 77, 81, 79, 80, 75, 76, 93, 83, 96, 69, 86, 95, 78, 92, 99, 78, 'Research'),
('48471441', 'MILCA, GLENN JUPITER', '20152016_2', 78, 75, 75, 83, 76, 75, 83, 78, 79, 90, 92, 75, 88, 79, 80, 76, 80, 89, 99, 97, 'Research'),
('48471459', 'GENERALAO, ALVIE', '20112012_2', 82, 76, 77, 88, 85, 78, 82, 77, 81, 90, 93, 84, 83, 78, 79, 98, 77, 79, 92, 98, 'Business Operations'),
('48471478', 'CONCON, JERRY', '20132014_2', 82, 75, 80, 86, 93, 75, 90, 75, 80, 99, 75, 75, 82, 75, 85, 81, 93, 97, 87, 83, 'Research'),
('48471521', 'LARA, EDROSE LORANNE', '20122013_1', 86, 75, 76, 96, 87, 78, 86, 75, 82, 90, 88, 75, 85, 76, 89, 83, 99, 76, 86, 87, 'Business Operations'),
('48471605', 'DIRAMPATEN, AMER HUSSIEN', '20112012_2', 86, 77, 77, 95, 94, 75, 85, 78, 78, 85, 86, 75, 92, 82, 81, 99, 84, 78, 88, 76, 'Systems Development'),
('48471652', 'DURO, GREG ARTHUR', '20132014_1', 76, 76, 76, 78, 76, 76, 76, 75, 77, 87, 84, 79, 95, 76, 75, 80, 95, 83, 94, 76, 'Research'),
('48471677', 'MANZANO, NORPHY ', '20112012_2', 89, 75, 78, 81, 84, 78, 89, 82, 75, 92, 93, 75, 75, 80, 84, 76, 83, 99, 86, 83, 'Research'),
('48471684', 'PUSOD, MARCO RICO ', '20112012_2', 99, 88, 90, 83, 95, 81, 90, 87, 83, 94, 89, 75, 86, 85, 85, 76, 83, 87, 91, 99, 'Business Operations'),
('48471768', 'CADANO, MONAH THESSE', '20132014_2', 80, 75, 75, 89, 95, 75, 89, 75, 91, 96, 91, 75, 97, 75, 81, 76, 94, 81, 83, 94, 'Business Operations'),
('48471775', 'ROSALES, KENNETH JOHN', '20112012_2', 84, 81, 77, 90, 84, 75, 84, 78, 82, 95, 86, 75, 88, 77, 77, 93, 84, 85, 77, 98, 'Business Operations'),
('48471788', 'GREGORY, CRISTALYN', '20132014_1', 76, 75, 84, 88, 83, 75, 75, 75, 75, 82, 88, 75, 96, 75, 75, 76, 93, 80, 93, 96, 'Business Operations'),
('48471821', 'TORREFIEL, GENBERT', '20112012_2', 84, 85, 81, 86, 88, 78, 84, 82, 77, 76, 85, 80, 94, 75, 80, 85, 82, 80, 81, 80, 'Systems Development'),
('48472011', 'LAWAS, SER IVAN KARL', '20112012_3', 82, 79, 76, 80, 77, 77, 87, 78, 82, 86, 91, 82, 95, 85, 82, 88, 84, 94, 88, 82, 'Research'),
('48472039', 'DINGCONG, AL BEN CHESSTER', '20142015_2', 76, 90, 86, 96, 91, 81, 83, 76, 84, 92, 83, 80, 83, 77, 76, 97, 86, 91, 97, 77, 'Research'),
('48472082', 'DUMAN-AG, RUSELL', '20172018_2', 80, 77, 82, 95, 94, 76, 81, 75, 79, 96, 93, 75, 86, 88, 75, 95, 83, 76, 82, 77, 'Business Operations'),
('48472100', 'BUBUTAN, SUZETTE', '20122013_2', 76, 79, 85, 94, 85, 75, 85, 76, 81, 88, 79, 75, 77, 77, 78, 76, 98, 87, 81, 83, 'Research'),
('48472131', 'BONALOS, ANDREW PETER', '20122013_1', 80, 94, 78, 75, 99, 77, 82, 76, 76, 81, 91, 75, 94, 88, 90, 90, 86, 83, 88, 77, 'Technical Support'),
('48472204', 'ADVINCULA, MARLON', '20112012_2', 93, 77, 76, 88, 97, 80, 83, 81, 75, 98, 90, 75, 86, 75, 84, 86, 80, 75, 82, 93, 'Business Operations'),
('48472215', 'DELA CRUZ, ALLAN FRANDY', '20132014_1', 86, 85, 75, 93, 82, 75, 77, 76, 87, 94, 85, 82, 90, 75, 84, 91, 89, 89, 94, 80, 'Research'),
('48472280', 'TANGONAN, MELVIN PAUL ', '20182019_1', 82, 78, 78, 95, 91, 75, 75, 75, 77, 75, 83, 75, 76, 83, 75, 77, 85, 82, 88, 95, 'Business Operations'),
('48472306', 'FERNANDEZ, IANN JEAN', '20132014_2', 77, 78, 75, 78, 85, 75, 80, 75, 85, 77, 84, 75, 91, 79, 75, 97, 91, 92, 84, 77, 'Research'),
('48472317', 'YBAÑEZ, EDGAR PHETE LEONARD', '20112012_2', 85, 81, 75, 81, 75, 85, 81, 79, 85, 80, 95, 75, 98, 99, 81, 98, 88, 76, 88, 98, 'Business Operations'),
('48472337', 'CORPUZ, KAREN', '20132014_1', 85, 80, 77, 93, 90, 75, 81, 75, 83, 98, 93, 75, 99, 81, 82, 96, 76, 95, 92, 97, 'Business Operations'),
('48472374', 'ESCUDERO, REINHARD JONH', '20182019_2', 86, 75, 75, 86, 89, 80, 82, 79, 82, 76, 97, 83, 91, 84, 83, 92, 94, 90, 91, 86, 'Technical Support'),
('48472377', 'GARCIA, FRITZ', '20132014_2', 75, 75, 75, 79, 91, 75, 76, 76, 87, 84, 75, 75, 93, 75, 88, 89, 90, 83, 80, 98, 'Business Operations'),
('48472405', 'LUMONTAD, RECHEL', '20122013_1', 85, 80, 78, 90, 90, 78, 90, 80, 78, 78, 95, 75, 79, 83, 91, 88, 84, 81, 91, 79, 'Technical Support'),
('48472525', 'VILLABER, JAMES PHIL', '20122013_2', 90, 92, 79, 95, 84, 82, 91, 80, 75, 86, 86, 84, 94, 84, 80, 76, 85, 95, 81, 77, 'Systems Development'),
('48472702', 'SALAS, ANNA FLOR', '20132014_1', 75, 75, 75, 96, 99, 80, 86, 75, 75, 93, 89, 75, 86, 76, 77, 81, 80, 99, 88, 98, 'Research'),
('48472708', 'DOMEGRACIA, CERRE CLYDE', '20132014_2', 80, 79, 75, 98, 92, 78, 86, 75, 89, 76, 81, 75, 93, 85, 82, 89, 91, 85, 81, 77, 'Systems Development'),
('48472723', 'LESTONES, AZILL JOECE', '20122013_2', 77, 83, 79, 91, 99, 80, 89, 77, 75, 80, 93, 81, 76, 76, 78, 91, 75, 95, 93, 78, 'Research'),
('48472731', 'PONIENTE, EDGAR ALLAN', '20132014_2', 77, 87, 79, 79, 93, 75, 85, 75, 87, 76, 80, 85, 83, 77, 75, 99, 81, 84, 92, 92, 'Business Operations'),
('48472744', 'BALANI, AIRENE', '20122013_2', 76, 79, 79, 90, 82, 75, 87, 75, 77, 92, 80, 79, 90, 78, 79, 97, 78, 84, 98, 86, 'Research'),
('48472757', 'GOMEZ, ADRIAN DIONNE', '20132014_2', 76, 75, 75, 87, 78, 75, 80, 76, 86, 78, 97, 82, 78, 87, 77, 88, 92, 89, 94, 94, 'Research'),
('48472817', 'CADAVAS, CLAIRE', '20122013_2', 81, 88, 82, 92, 96, 78, 91, 77, 86, 89, 84, 78, 97, 84, 80, 91, 87, 81, 80, 92, 'Business Operations'),
('48472824', 'CUBERO, GRACEL MARIE', '20132014_1', 77, 75, 75, 77, 75, 75, 87, 75, 75, 89, 85, 77, 84, 76, 76, 92, 99, 88, 94, 95, 'Research'),
('48472833', 'PEROS, EMIE JEAN', '20132014_1', 85, 75, 78, 93, 77, 75, 86, 75, 81, 87, 91, 78, 82, 79, 81, 82, 97, 91, 95, 85, 'Research'),
('48472834', 'GUMBA, IAN REY', '20132014_1', 89, 94, 85, 81, 96, 77, 83, 79, 92, 90, 89, 83, 82, 80, 81, 96, 98, 82, 80, 75, 'Research'),
('48472847', 'JOVEN, CAESAR KEVIN', '20122013_2', 80, 82, 75, 80, 81, 77, 87, 75, 75, 95, 80, 75, 77, 75, 84, 90, 89, 97, 77, 84, 'Research'),
('48472853', 'AMANCIO, ALVIN JAY', '20122013_2', 89, 81, 81, 98, 98, 80, 86, 75, 76, 77, 85, 75, 99, 75, 80, 98, 85, 85, 78, 85, 'Systems Development'),
('48472891', 'BLANCO JR., ROLANDO', '20132014_1', 79, 85, 82, 90, 79, 79, 80, 75, 80, 90, 91, 82, 99, 81, 80, 82, 93, 76, 81, 94, 'Business Operations'),
('48472918', 'MONTEJO, EUNICE ', '20122013_2', 86, 85, 84, 81, 84, 80, 85, 75, 77, 96, 80, 75, 88, 77, 81, 91, 85, 77, 98, 81, 'Research'),
('48472926', 'PACRES, PATRICK JOHN', '20152016_2', 90, 93, 81, 89, 89, 83, 88, 76, 83, 77, 78, 83, 81, 87, 89, 84, 95, 94, 82, 84, 'Systems Development'),
('48472952', 'BARCELONA, CHRISTINE JOY', '20142015_1', 76, 80, 75, 99, 82, 76, 89, 75, 80, 95, 86, 75, 79, 82, 75, 94, 97, 90, 84, 81, 'Research'),
('48473001', 'TUNGCALING, MARK ANTHONY ', '20122013_3', 75, 81, 75, 83, 89, 75, 86, 75, 78, 75, 84, 75, 86, 75, 79, 93, 98, 86, 90, 80, 'Technical Support'),
('48473012', 'JAMILLA, JOCELYN', '20152016_2', 81, 76, 75, 85, 94, 78, 91, 75, 75, 85, 93, 76, 82, 81, 79, 79, 86, 76, 82, 84, 'Technical Support'),
('48473042', 'ABRAHAN, AISAL ', '20132014_2', 80, 75, 75, 83, 83, 78, 77, 75, 79, 85, 80, 83, 93, 81, 81, 89, 98, 82, 93, 91, 'Business Operations'),
('48473070', 'AGUILON, BEAMIR', '20132014_2', 78, 78, 75, 89, 87, 76, 80, 75, 83, 78, 79, 75, 93, 81, 81, 78, 87, 97, 78, 94, 'Business Operations'),
('48473109', 'BAJENTING, BERNADETH', '20132014_2', 90, 82, 75, 75, 97, 77, 89, 75, 75, 80, 82, 75, 88, 81, 84, 76, 86, 77, 95, 99, 'Technical Support'),
('48473152', 'MABALHIN, RAFAEL JOSE', '20142015_2', 84, 75, 76, 75, 78, 75, 80, 75, 75, 85, 84, 75, 91, 83, 75, 85, 78, 90, 85, 86, 'Research'),
('48473163', 'ESPINOSA, DIANNE JOYCE ', '20122013_2', 80, 84, 80, 87, 95, 79, 95, 76, 83, 96, 85, 79, 94, 80, 80, 90, 85, 87, 84, 98, 'Business Operations'),
('48473165', 'NAVASCA, DARLIN JEAN', '20122013_2', 83, 90, 79, 76, 90, 75, 91, 76, 77, 98, 94, 82, 89, 77, 82, 99, 92, 83, 94, 85, 'Research'),
('48473167', 'FERRAREN, ALMA', '20182019_1', 76, 81, 75, 75, 85, 76, 89, 75, 80, 89, 90, 75, 90, 77, 77, 99, 79, 82, 78, 83, 'Business Operations'),
('48473189', 'ALINSUB, MISHELLE ANN', '20132014_2', 79, 78, 76, 87, 87, 79, 86, 75, 89, 88, 81, 75, 84, 85, 75, 78, 91, 91, 90, 95, 'Business Operations'),
('48473201', 'AMORA, FRITZIE', '20132014_1', 86, 82, 87, 78, 92, 80, 86, 76, 82, 94, 91, 79, 77, 80, 83, 75, 92, 88, 81, 86, 'Business Operations'),
('48473207', 'BALIO, RONNEL JUN', '20132014_2', 75, 83, 80, 98, 86, 77, 84, 75, 83, 97, 91, 82, 80, 78, 75, 85, 85, 90, 81, 96, 'Business Operations'),
('48473359', 'TIMA, JELAIKA', '20122013_2', 85, 84, 78, 76, 97, 75, 92, 78, 79, 96, 85, 75, 85, 75, 76, 99, 80, 83, 89, 97, 'Business Operations'),
('48473375', 'ELUMBARING, EUJENE', '20122013_2', 95, 99, 94, 75, 92, 86, 84, 87, 82, 82, 100, 89, 86, 85, 83, 87, 75, 84, 91, 87, 'Systems Development'),
('48473413', 'GURA, CHARLYN LOU', '20122013_1', 89, 79, 80, 78, 86, 77, 91, 75, 76, 96, 90, 75, 98, 75, 84, 98, 84, 89, 95, 98, 'Business Operations'),
('48473423', 'LORENZO, JHUN RYAN', '20122013_2', 82, 91, 85, 76, 89, 81, 87, 82, 75, 77, 87, 84, 90, 79, 81, 95, 79, 87, 80, 85, 'Systems Development'),
('48473425', 'LAWAS, JAKE MITCHELL', '20122013_2', 79, 85, 77, 85, 97, 76, 87, 80, 75, 85, 87, 84, 78, 80, 79, 77, 93, 77, 86, 85, 'Technical Support'),
('48473504', 'MACABINLAR, COLIN', '20132014_2', 83, 75, 83, 86, 75, 75, 87, 75, 81, 94, 83, 75, 98, 80, 75, 93, 92, 81, 75, 77, 'Business Operations'),
('48473575', 'BATULAN, RONNEL', '20152016_1', 77, 92, 75, 77, 92, 75, 91, 75, 78, 85, 85, 79, 78, 85, 86, 86, 88, 95, 77, 82, 'Research'),
('48473674', 'MAURING, NIÑO JESTONI', '20152016_2', 81, 75, 76, 83, 84, 75, 75, 75, 77, 95, 75, 75, 91, 79, 79, 77, 92, 86, 89, 88, 'Research'),
('48473695', 'AMPER, DEXTER', '20142015_2', 84, 80, 85, 78, 86, 75, 87, 75, 80, 82, 85, 82, 84, 75, 77, 95, 90, 82, 97, 75, 'Research'),
('48473701', 'PLANTAS, NELSWEET', '20132014_1', 75, 75, 75, 91, 78, 75, 91, 75, 75, 95, 92, 76, 83, 75, 79, 88, 84, 77, 91, 84, 'Business Operations'),
('48473717', 'PUNO, RONNEL', '20132014_1', 84, 83, 78, 98, 90, 75, 82, 75, 82, 85, 95, 75, 89, 75, 75, 88, 91, 93, 87, 98, 'Business Operations'),
('48473727', 'SOBRETODO, IRENE JOY', '20122013_2', 86, 76, 76, 77, 80, 78, 90, 75, 78, 88, 93, 75, 96, 75, 79, 87, 90, 98, 93, 78, 'Research'),
('48473752', 'CALSEÑA, KAREN JOY', '20142015_1', 87, 84, 88, 87, 87, 80, 91, 75, 94, 89, 77, 75, 99, 83, 78, 76, 80, 96, 79, 83, 'Research'),
('48473794', 'BADUA, ALONA MAE', '20122013_3', 77, 84, 77, 90, 79, 78, 80, 79, 79, 93, 94, 75, 75, 75, 82, 82, 90, 93, 93, 99, 'Business Operations'),
('48473815', 'MORENO, RAPUNZEL', '20122013_2', 81, 79, 79, 88, 78, 77, 88, 75, 82, 93, 84, 80, 94, 78, 81, 99, 95, 96, 82, 93, 'Business Operations'),
('48473845', 'TADLE, DELYNE JOY', '20132014_1', 81, 75, 81, 81, 84, 76, 85, 75, 80, 94, 89, 82, 85, 77, 77, 81, 75, 91, 99, 77, 'Research'),
('48473866', 'CAGULA, VINCENT', '20172018_2', 80, 78, 84, 78, 79, 75, 78, 75, 68, 89, 86, 75, 95, 76, 76, 80, 79, 92, 94, 84, 'Research'),
('48473918', 'POLIGRATES, ALYANNA JANE MAE', '20122013_2', 83, 76, 77, 95, 98, 77, 94, 76, 79, 76, 85, 80, 96, 78, 87, 78, 99, 93, 84, 81, 'Systems Development'),
('48474010', 'PEÑAROYO, NICO', '20132014_2', 75, 94, 76, 99, 96, 79, 90, 77, 82, 91, 87, 87, 77, 87, 76, 94, 99, 91, 98, 76, 'Research'),
('48474022', 'IBRAHIM, NORHAINA', '20132014_2', 83, 75, 75, 97, 87, 76, 89, 75, 80, 85, 88, 75, 85, 83, 81, 99, 78, 96, 84, 93, 'Technical Support'),
('48474027', 'QUIAMBAO, ROMYL', '20182019_1', 85, 78, 77, 91, 81, 80, 78, 75, 82, 76, 91, 75, 90, 80, 78, 83, 91, 94, 90, 78, 'Research'),
('48474092', 'POLINAR, CHAREN MAY', '20132014_2', 86, 83, 80, 93, 97, 76, 85, 75, 83, 92, 87, 75, 82, 81, 75, 98, 86, 81, 76, 86, 'Business Operations'),
('48474095', 'TORDICILLAS, WILHELMINA', '20132014_2', 83, 80, 77, 96, 98, 75, 85, 75, 88, 91, 90, 75, 83, 82, 75, 93, 85, 93, 77, 95, 'Business Operations'),
('48474127', 'SEREÑAS, JULES VINCENT', '20152016_2', 86, 86, 82, 82, 88, 75, 83, 75, 78, 76, 94, 85, 77, 78, 83, 77, 97, 94, 75, 96, 'Business Operations'),
('48474136', 'BOLOS, AURORA', '20122013_2', 95, 90, 76, 76, 83, 80, 91, 77, 90, 97, 84, 80, 82, 85, 80, 93, 76, 96, 79, 85, 'Business Operations'),
('48474156', 'DAWAL, JUDITH ANN', '20142015_2', 79, 81, 76, 88, 87, 75, 88, 75, 82, 75, 88, 78, 84, 75, 76, 98, 98, 84, 84, 75, 'Systems Development'),
('48474286', 'ACALA, THEA ANGEL LOU ', '20132014_1', 82, 83, 75, 98, 77, 77, 87, 75, 79, 83, 91, 80, 89, 75, 78, 87, 99, 77, 91, 78, 'Systems Development'),
('48474321', 'LIBRE, JULIET ', '20152016_1', 77, 76, 75, 77, 91, 75, 89, 75, 76, 89, 96, 75, 79, 80, 75, 80, 84, 82, 95, 97, 'Business Operations'),
('48474349', 'GALELA, MYSEL', '20132014_2', 79, 77, 76, 95, 93, 78, 84, 75, 89, 97, 85, 75, 99, 83, 83, 99, 98, 80, 95, 80, 'Research'),
('48474409', 'DIAZ, NORVELYN', '20132014_2', 82, 78, 77, 87, 75, 75, 88, 75, 78, 85, 90, 75, 79, 75, 76, 75, 99, 79, 92, 81, 'Research'),
('48474411', 'ALCOZAR, JOHN PAUL ', '20142015_2', 77, 84, 75, 81, 95, 75, 87, 75, 77, 90, 90, 76, 92, 75, 80, 98, 88, 94, 87, 77, 'Research'),
('48474491', 'PORTACION, GEMMARIZ', '20132014_2', 76, 77, 76, 94, 76, 75, 82, 75, 75, 84, 89, 75, 85, 75, 75, 87, 81, 81, 78, 93, 'Business Operations'),
('48474506', 'LEMOSNERO, LEAH MAE', '20142015_2', 75, 75, 75, 98, 81, 75, 87, 75, 77, 81, 80, 75, 85, 77, 75, 89, 86, 78, 94, 85, 'Systems Development'),
('48474546', 'ORTIZ, RIDDICK BOWE', '20172018-1', 75, 78, 88, 91, 76, 77, 84, 79, 75, 95, 87, 76, 84, 77, 81, 89, 81, 90, 95, 85, 'Research'),
('48474593', 'CABIJE, ANDREW', '20122013_2', 90, 98, 89, 77, 84, 83, 90, 85, 89, 99, 100, 84, 75, 80, 84, 99, 96, 98, 85, 93, 'Business Operations'),
('48474666', 'NOGADAS, STEVE CZYRUS', '20142015_2', 87, 83, 87, 92, 85, 77, 92, 75, 90, 80, 93, 81, 93, 79, 83, 83, 77, 94, 95, 93, 'Systems Development'),
('48474685', 'GELLA, GARRY KAY', '20122013_2', 75, 83, 76, 75, 86, 77, 89, 75, 86, 84, 92, 79, 84, 80, 77, 76, 83, 99, 83, 76, 'Research'),
('48474709', 'PAGALAN, RUBY ANGELA', '20122013_2', 78, 88, 76, 76, 88, 76, 88, 75, 75, 96, 77, 75, 85, 75, 77, 82, 89, 96, 96, 92, 'Research'),
('48474722', 'SAULDA, RYAN', '20132014_2', 88, 75, 85, 86, 76, 75, 86, 75, 94, 90, 83, 75, 97, 83, 75, 90, 80, 83, 89, 99, 'Business Operations'),
('48474752', 'JOSE, MARTIN LLOYD', '20122013_2', 80, 77, 81, 94, 91, 78, 88, 80, 76, 91, 84, 87, 92, 80, 78, 99, 79, 93, 78, 93, 'Business Operations'),
('48474847', 'PELIGRINO, MAR LLOYD', '20122013_2', 86, 83, 75, 85, 79, 77, 87, 75, 75, 75, 85, 83, 75, 75, 79, 85, 86, 86, 83, 90, 'Systems Development'),
('48474848', 'ALASTRA, JENECHELL', '20132014_2', 75, 75, 75, 88, 98, 75, 80, 75, 80, 91, 79, 75, 92, 75, 75, 81, 99, 86, 75, 75, 'Research'),
('48474886', 'PROSIANOS, BAZIL', '20132014_1', 75, 77, 75, 92, 85, 76, 88, 75, 82, 81, 83, 78, 88, 97, 78, 81, 97, 99, 77, 95, 'Technical Support'),
('48474913', 'DIANA, BLESSIE MARIE', '20132014_2', 82, 77, 78, 89, 81, 82, 75, 76, 75, 94, 81, 78, 84, 77, 76, 90, 78, 90, 88, 97, 'Business Operations'),
('48474918', 'OLARTE, KLEVELYN', '20132014_1', 81, 78, 78, 86, 95, 75, 80, 75, 83, 87, 75, 75, 93, 77, 75, 81, 88, 78, 95, 90, 'Business Operations'),
('48474940', 'MADRONERO, EDAN PAULO', '20122013_2', 88, 89, 79, 76, 99, 80, 85, 77, 76, 79, 88, 85, 86, 81, 81, 94, 89, 89, 76, 80, 'Systems Development'),
('48474993', 'LOPEZ, CHITO', '20152016_2', 78, 75, 75, 96, 86, 75, 84, 75, 79, 95, 81, 76, 87, 79, 78, 81, 92, 80, 99, 86, 'Research'),
('48475013', 'CHATTO, KURT JOY', '20132014_2', 79, 78, 76, 80, 94, 75, 77, 75, 78, 86, 86, 75, 98, 81, 78, 77, 76, 97, 90, 91, 'Research'),
('48475036', 'ANGUS, RACHELLE MAE', '20132014_1', 83, 75, 77, 97, 75, 75, 75, 75, 76, 99, 82, 75, 80, 77, 75, 75, 80, 86, 92, 93, 'Business Operations'),
('48475079', 'PATOS, DARWIN', '20182019_2', 77, 78, 80, 87, 81, 79, 75, 75, 76, 83, 95, 75, 92, 84, 77, 85, 97, 91, 81, 91, 'Technical Support'),
('48475102', 'LINGANAY, RAYMUND JAY-AR', '20122013_2', 86, 76, 84, 84, 98, 75, 89, 75, 75, 98, 80, 81, 81, 75, 80, 79, 79, 88, 95, 97, 'Business Operations'),
('48475126', 'LAURELES, RONNA LOU', '20132014_1', 90, 89, 93, 93, 93, 75, 82, 75, 76, 98, 89, 79, 76, 84, 76, 81, 96, 80, 75, 85, 'Business Operations'),
('48475141', 'LAGURA, ZERALD ', '20132014_2', 83, 79, 77, 91, 82, 79, 84, 78, 75, 78, 90, 79, 98, 91, 80, 98, 85, 85, 90, 91, 'Systems Development'),
('48475174', 'MOSE, EMELIZA', '20122013_2', 75, 77, 77, 81, 87, 75, 82, 75, 80, 87, 93, 75, 80, 80, 85, 93, 85, 85, 77, 84, 'Business Operations'),
('48475183', 'AMBATO, DEXTER', '20142015_2', 87, 86, 86, 95, 90, 75, 82, 76, 85, 92, 89, 77, 90, 80, 82, 96, 76, 78, 97, 82, 'Research'),
('48475242', 'SALAN, RICKY ', '20142015_1', 83, 75, 80, 76, 77, 75, 75, 75, 82, 86, 78, 75, 91, 81, 75, 98, 96, 92, 78, 91, 'Business Operations'),
('48475257', 'BO-O, ALDRICK KEVIN', '20122013_2', 83, 89, 89, 80, 90, 82, 88, 79, 78, 96, 85, 83, 96, 79, 83, 98, 98, 75, 93, 99, 'Business Operations'),
('48475347', 'EGUIA, EDGAR MIKAEL', '20172018_2', 75, 80, 76, 86, 85, 75, 82, 78, 75, 94, 93, 79, 98, 86, 85, 84, 84, 89, 82, 85, 'Technical Support'),
('48475422', 'YAMBAO, EARL FRITZ', '20142015_1', 75, 78, 75, 77, 76, 77, 75, 75, 84, 83, 79, 75, 85, 83, 78, 93, 79, 96, 82, 83, 'Research'),
('48475519', 'RAMOS, EZER JAY', '20172018-1', 88, 77, 78, 90, 79, 76, 79, 75, 85, 96, 86, 78, 83, 82, 84, 88, 89, 83, 90, 91, 'Business Operations'),
('48475520', 'LUGA, JANLORD', '20142015_2', 76, 76, 79, 97, 82, 79, 83, 80, 92, 91, 88, 84, 87, 89, 87, 76, 84, 96, 82, 85, 'Research'),
('48475527', 'CATIEMPO, OLIVER', '20192020_2', 77, 75, 76, 90, 88, 75, 81, 75, 80, 82, 95, 91, 98, 75, 75, 77, 80, 97, 78, 90, 'Research'),
('48475564', 'ORJALEZA, CHERRYL LOU', '20132014_2', 82, 79, 75, 93, 80, 76, 91, 75, 79, 81, 79, 75, 88, 81, 82, 82, 93, 97, 90, 86, 'Systems Development'),
('48475596', 'BRILLANTES, CLANDY LOU', '20132014_2', 95, 90, 87, 96, 88, 79, 91, 79, 90, 85, 77, 77, 91, 84, 80, 99, 85, 96, 83, 99, 'Business Operations'),
('48475666', 'SOSMEÑA, DIANNE HEIDY', '20142015_2', 85, 80, 78, 81, 89, 75, 90, 75, 82, 88, 86, 78, 99, 81, 81, 96, 84, 75, 99, 78, 'Research'),
('48475692', 'JAVIER, JAYSON', '20162017_2', 75, 76, 77, 90, 88, 75, 78, 76, 76, 96, 79, 81, 77, 75, 77, 83, 87, 89, 80, 81, 'Research'),
('48475862', 'ROSALES, JELLY', '20162017_2', 86, 81, 81, 75, 90, 80, 82, 81, 76, 76, 87, 83, 96, 81, 81, 82, 83, 93, 85, 84, 'Systems Development'),
('48475893', 'JAGUNOS, RAPHAEL', '20122013_2', 83, 81, 80, 77, 83, 75, 85, 75, 75, 96, 85, 83, 98, 79, 82, 82, 76, 98, 83, 93, 'Research'),
('48475946', 'SAA, AL BRYAN', '20162017_1', 99, 82, 75, 89, 92, 77, 79, 75, 79, 82, 78, 78, 84, 98, 75, 96, 83, 82, 92, 87, 'Systems Development'),
('48475995', 'CARTONEROS, JAY-R', '20162017_2', 77, 80, 75, 96, 97, 75, 84, 75, 75, 86, 75, 78, 77, 77, 76, 94, 81, 93, 85, 95, 'Business Operations'),
('48476102', 'LAMSEN, SHEILA MAE ', '20152016_2', 75, 86, 77, 97, 83, 77, 75, 75, 80, 77, 86, 76, 87, 79, 79, 75, 93, 94, 92, 99, 'Research'),
('48476105', 'ORAYLE, ALEXIS', '20182019_2', 78, 81, 80, 88, 97, 80, 76, 75, 76, 75, 86, 79, 98, 78, 80, 87, 81, 99, 79, 93, 'Systems Development'),
('48476264', 'UNABIA, GENESIS', '20132014_2', 75, 79, 77, 91, 99, 75, 85, 76, 75, 90, 80, 75, 91, 85, 76, 95, 84, 93, 77, 98, 'Business Operations'),
('48476329', 'ELEMENTO, JACOB JOHN', '20152016_1', 82, 88, 78, 94, 97, 81, 87, 77, 81, 97, 85, 86, 93, 83, 81, 76, 76, 79, 95, 87, 'Business Operations'),
('48476370', 'DEL CAMPO JR., EDUARDO', '20172018_2', 75, 86, 75, 75, 84, 76, 80, 75, 80, 96, 93, 75, 95, 77, 77, 75, 95, 95, 94, 99, 'Business Operations'),
('48476386', 'LILOC, KEVIN', '20142015_2', 89, 95, 87, 75, 91, 78, 87, 75, 86, 98, 84, 80, 86, 76, 80, 91, 83, 96, 98, 99, 'Research'),
('48476426', 'LUNAG, NIÑO RAY', '20132014_2', 86, 78, 84, 75, 84, 77, 79, 75, 90, 76, 96, 75, 77, 75, 76, 76, 89, 86, 81, 90, 'Business Operations'),
('48476427', 'CHAVEZ, FROILAN JOSEPH', '20122013_2', 87, 78, 75, 99, 90, 75, 83, 75, 75, 98, 80, 84, 77, 77, 75, 89, 93, 85, 96, 95, 'Business Operations'),
('48476429', 'TORINO, CERESA MAE', '20132014_1', 93, 88, 90, 87, 97, 85, 86, 81, 86, 88, 90, 80, 81, 92, 87, 78, 85, 82, 86, 78, 'Technical Support'),
('48476439', 'MACION, DAN JAYSON', '20142015_2', 83, 78, 77, 96, 94, 75, 91, 75, 78, 98, 86, 79, 97, 79, 75, 80, 81, 88, 76, 80, 'Systems Development'),
('48476448', 'ATENTO, LURAINE', '20122013_1', 92, 82, 87, 93, 87, 81, 87, 75, 88, 97, 90, 75, 84, 80, 98, 95, 99, 84, 96, 84, 'Technical Support'),
('48476472', 'DIZON, AL PATRICK', '20132014_2', 97, 75, 75, 83, 85, 75, 76, 75, 86, 82, 93, 75, 89, 78, 77, 90, 90, 87, 79, 83, 'Business Operations'),
('48476473', 'BUAL, JUNE VIC', '20132014_2', 82, 86, 77, 99, 84, 75, 80, 75, 92, 88, 97, 75, 94, 79, 77, 94, 90, 79, 84, 85, 'Business Operations'),
('48476484', 'ITEM, KEVIN RAY', '20152016_2', 76, 83, 78, 88, 82, 75, 75, 75, 79, 89, 75, 76, 99, 76, 75, 81, 78, 77, 81, 81, 'Business Operations'),
('48476499', 'ARNIBAL, JEFFREY', '20162017_2', 82, 81, 77, 77, 85, 75, 78, 75, 75, 97, 86, 83, 93, 78, 75, 86, 77, 91, 76, 99, 'Business Operations'),
('48476741', 'SALAZAR, ALFRED JOHN ', '20132014_2', 84, 82, 77, 92, 97, 76, 87, 78, 82, 90, 83, 75, 86, 81, 76, 85, 97, 84, 80, 89, 'Business Operations'),
('48476751', 'AMISCUA, CHRISTIAN JERICHO ', '20132014_2', 79, 85, 77, 77, 90, 81, 88, 76, 78, 76, 84, 75, 87, 82, 83, 75, 75, 83, 88, 91, 'Technical Support'),
('48476759', 'ARENDAIN, WARREN', '20142015_1', 78, 82, 80, 81, 97, 79, 90, 76, 82, 94, 78, 75, 75, 75, 75, 88, 95, 82, 99, 79, 'Research'),
('48476788', 'TAALA, JOSEPH BRIAN', '20132014_2', 81, 75, 80, 95, 85, 80, 88, 80, 78, 79, 90, 85, 82, 84, 77, 84, 78, 81, 99, 96, 'Systems Development'),
('48476883', 'FLORES, ANN MARIZ ABIGAIL', '20142015_2', 83, 86, 84, 78, 81, 80, 82, 81, 78, 96, 84, 79, 89, 88, 86, 78, 81, 88, 90, 75, 'Technical Support'),
('48476889', 'CARPIO, SHIELA MAE ', '20132014_2', 88, 88, 86, 83, 83, 83, 89, 81, 86, 86, 92, 86, 85, 92, 86, 79, 93, 80, 97, 96, 'Technical Support'),
('48476963', 'ALMERIA, HANNAH GRACE', '20132014_2', 91, 88, 90, 80, 90, 86, 88, 88, 95, 78, 94, 86, 76, 93, 90, 96, 97, 95, 86, 76, 'Technical Support'),
('48476988', 'LADERAS, ROBERT OLIVER', '20162017_2', 88, 99, 82, 79, 77, 77, 83, 83, 80, 93, 86, 85, 77, 81, 76, 88, 95, 92, 93, 88, 'Research'),
('48477023', 'OLIVEROS, JAY-ANN', '20142015_2', 75, 86, 76, 91, 76, 75, 92, 75, 80, 99, 92, 77, 92, 80, 75, 79, 91, 78, 95, 97, 'Business Operations'),
('48477026', 'DAVID, JON JON', '20142015_1', 75, 85, 81, 76, 88, 75, 87, 76, 87, 98, 83, 82, 94, 82, 85, 90, 95, 90, 91, 84, 'Research'),
('48477031', 'CABALLES, KIMBERLY KATE', '20142015_2', 80, 82, 77, 89, 99, 76, 92, 77, 94, 89, 86, 77, 96, 84, 79, 94, 98, 99, 92, 79, 'Research'),
('48477104', 'PEREZ, CHERIL ', '20122013_2', 91, 96, 76, 93, 82, 75, 82, 75, 98, 82, 90, 78, 99, 78, 75, 88, 88, 95, 80, 87, 'Systems Development'),
('48477107', 'CAGUIMBAL, MARY JANE', '20142015_2', 75, 75, 77, 76, 90, 75, 95, 75, 82, 95, 92, 75, 94, 80, 86, 96, 85, 77, 76, 83, 'Technical Support'),
('48477108', 'GOOC, JAYZON', '20122013_2', 76, 95, 77, 95, 76, 75, 82, 75, 78, 80, 88, 77, 82, 98, 77, 96, 95, 98, 97, 93, 'Technical Support'),
('48477160', 'MONTAJES, PETER PAUL', '20142015_2', 75, 87, 81, 94, 94, 78, 86, 75, 86, 94, 79, 76, 76, 85, 75, 83, 89, 85, 96, 76, 'Research'),
('48477166', 'TEJADILLO, SARAH JANE', '20142015_2', 75, 82, 78, 78, 84, 75, 90, 75, 92, 88, 93, 75, 86, 81, 75, 98, 76, 87, 94, 92, 'Business Operations'),
('48477176', 'RAMOS, BEA  MARIE', '20132014_2', 80, 84, 76, 79, 90, 81, 88, 75, 78, 82, 92, 75, 93, 84, 75, 85, 78, 77, 77, 99, 'Business Operations'),
('48477197', 'LAURENTE, PETER JOHN', '20142015_2', 75, 87, 75, 87, 96, 75, 89, 75, 88, 88, 86, 80, 80, 75, 75, 88, 82, 76, 87, 81, 'Business Operations'),
('48477221', 'PEREZ, ROSE ANN', '20132014_2', 77, 87, 77, 90, 85, 77, 88, 75, 78, 89, 95, 75, 99, 82, 75, 75, 87, 83, 84, 99, 'Business Operations'),
('48477226', 'CLAVECILLAS, JEMARIE', '20132014_2', 77, 88, 75, 79, 76, 76, 84, 75, 76, 94, 95, 75, 77, 89, 82, 79, 82, 86, 98, 95, 'Research'),
('48477267', 'MORA, JELLI LOMEL', '20142015_2', 90, 97, 86, 79, 83, 82, 92, 75, 90, 90, 76, 83, 96, 84, 86, 96, 78, 76, 87, 88, 'Business Operations'),
('48477296', 'SORIA, KIM DARELL ', '20152016_1', 75, 82, 78, 84, 97, 75, 91, 75, 79, 99, 86, 79, 92, 78, 81, 77, 87, 93, 91, 88, 'Research'),
('48477319', 'AGDAMAG, ALPHONSO CHRISTOPHER', '20132014_2', 86, 92, 84, 88, 89, 77, 87, 76, 81, 91, 95, 77, 76, 84, 80, 93, 87, 90, 83, 83, 'Research'),
('48477320', 'ODA, LOVELY', '20132014_2', 76, 88, 77, 79, 79, 76, 86, 75, 76, 90, 97, 75, 82, 87, 75, 86, 91, 84, 83, 93, 'Business Operations'),
('48477321', 'DELA TORRE, KRISTY ANN', '20132014_2', 82, 81, 82, 84, 98, 81, 87, 75, 78, 98, 98, 75, 75, 85, 77, 97, 91, 89, 83, 79, 'Research'),
('48477339', 'YARANON, EDRIANNE JOSE ', '20142015_2', 75, 87, 76, 77, 96, 77, 91, 75, 75, 95, 83, 79, 97, 77, 82, 77, 88, 89, 97, 98, 'Business Operations'),
('48477346', 'BANTAN, JAN DANIEL', '20132014_2', 81, 87, 77, 92, 79, 76, 84, 77, 79, 99, 91, 77, 85, 82, 76, 78, 90, 86, 82, 91, 'Business Operations'),
('48477371', 'SIALZA, BERNICE MARIE', '20132014_2', 78, 82, 78, 89, 84, 80, 87, 75, 79, 85, 96, 75, 81, 84, 77, 86, 98, 92, 96, 79, 'Research'),
('48477375', 'MAPALO, SHEENA BIANCA', '20152016_2', 77, 83, 75, 81, 98, 75, 91, 75, 82, 80, 75, 76, 98, 80, 75, 87, 83, 75, 84, 90, 'Business Operations'),
('48477378', 'CABALLES, CHRISTIAN JAMES', '20142015_2', 84, 79, 78, 95, 96, 81, 91, 76, 78, 80, 88, 87, 98, 76, 75, 95, 81, 95, 81, 98, 'Systems Development'),
('48477390', 'DIAZ, LEAH', '20132014_2', 77, 81, 77, 93, 75, 75, 88, 75, 85, 79, 94, 75, 85, 93, 75, 95, 83, 81, 84, 79, 'Technical Support'),
('48477413', 'ANGON, MARLO ROY', '20132014_2', 81, 82, 75, 88, 91, 78, 90, 77, 79, 75, 83, 83, 90, 89, 76, 82, 83, 92, 99, 91, 'Systems Development'),
('48477434', 'ALBARICO, GIAN', '20132014_2', 87, 81, 82, 94, 78, 78, 89, 78, 88, 95, 89, 84, 90, 76, 82, 89, 75, 86, 87, 99, 'Business Operations'),
('48477440', 'NAYRE, DAVY JOY', '20132014_2', 78, 82, 79, 89, 99, 79, 86, 75, 83, 85, 91, 82, 77, 87, 76, 87, 78, 87, 90, 98, 'Business Operations'),
('48477479', 'LORENZO, ROSEMARIE', '20132014_2', 93, 92, 85, 78, 83, 76, 82, 76, 88, 87, 84, 81, 98, 84, 77, 93, 91, 76, 84, 98, 'Business Operations'),
('48477498', 'PATAYON, OLIVER', '20142015_2', 90, 89, 83, 80, 82, 83, 91, 80, 93, 75, 82, 82, 78, 86, 82, 98, 92, 95, 99, 97, 'Research'),
('48477610', 'GUIÑARES, GOLDEEMAR', '20142015_2', 79, 87, 75, 95, 82, 75, 92, 75, 78, 96, 88, 78, 91, 75, 75, 88, 96, 97, 91, 82, 'Research'),
('48477614', 'DELOS SANTOS, EZRA', '20132014_2', 79, 88, 77, 78, 90, 81, 86, 75, 75, 76, 86, 75, 96, 92, 78, 89, 91, 80, 92, 91, 'Systems Development'),
('48477622', 'LUI, JOE MARIE', '20132014_2', 87, 95, 89, 84, 89, 83, 90, 83, 96, 82, 83, 89, 84, 91, 82, 93, 90, 88, 92, 85, 'Research'),
('48477642', 'SANTANDER, ROMELY GRACE', '20132014_2', 78, 86, 75, 99, 77, 75, 89, 75, 75, 85, 86, 75, 83, 86, 75, 82, 81, 82, 97, 93, 'Technical Support'),
('48477655', 'TANDOY, CINDY', '20152016_1', 83, 88, 77, 80, 90, 75, 79, 75, 75, 75, 89, 76, 86, 85, 81, 76, 87, 76, 94, 99, 'Technical Support'),
('48477699', 'WAYNO, REYMOND', '20142015_2', 75, 82, 75, 78, 86, 75, 82, 75, 78, 99, 86, 76, 79, 76, 80, 89, 84, 94, 91, 83, 'Research'),
('48477799', 'GARCIA, CARLO', '20162017_2', 83, 88, 75, 80, 84, 75, 85, 76, 75, 80, 77, 80, 78, 76, 77, 91, 97, 79, 99, 92, 'Systems Development'),
('48477832', 'RUALLO, REGINE', '20152016_1', 80, 84, 75, 80, 98, 75, 83, 75, 75, 79, 89, 78, 80, 83, 82, 92, 95, 85, 77, 76, 'Technical Support'),
('48477843', 'DUROPAN, LESLY ANN', '20132014_2', 91, 93, 83, 86, 98, 75, 90, 75, 83, 95, 93, 86, 95, 87, 77, 95, 79, 93, 83, 98, 'Business Operations'),
('48477887', 'ESCOTON, BENJIE JOHN', '20152016_2', 84, 84, 77, 96, 83, 77, 90, 75, 81, 93, 92, 77, 78, 82, 79, 85, 86, 98, 89, 92, 'Research'),
('48477897', 'NIEBLA, MARIVILLE', '20142015_2', 91, 92, 76, 80, 94, 78, 91, 75, 83, 98, 81, 75, 77, 75, 80, 92, 81, 94, 95, 95, 'Research'),
('48477908', 'BENERO, ABEGAIL', '20142015_2', 81, 85, 80, 76, 83, 75, 93, 76, 95, 98, 91, 75, 81, 85, 76, 96, 80, 87, 86, 83, 'Business Operations'),
('48477926', 'LINES, SHERYL', '20142015_2', 77, 84, 79, 86, 89, 75, 90, 75, 92, 78, 90, 75, 84, 80, 75, 77, 75, 76, 75, 76, 'Business Operations'),
('48477930', 'LATIP, WAFA', '20162017_2', 81, 83, 75, 81, 78, 75, 85, 75, 84, 79, 88, 75, 90, 85, 75, 95, 79, 83, 90, 78, 'Research'),
('48477946', 'MEJOS, AILEEN MAE', '20142015_2', 75, 87, 75, 79, 86, 75, 88, 75, 78, 81, 88, 75, 80, 91, 76, 76, 88, 83, 82, 81, 'Technical Support'),
('48478035', 'GEVERA, JERSON', '20152016_2', 79, 84, 75, 96, 90, 75, 80, 75, 75, 79, 76, 78, 79, 83, 81, 83, 78, 82, 90, 98, 'Business Operations'),
('48478126', 'NAZARIO, EFPHRAIM', '20132014_2', 84, 88, 76, 78, 97, 77, 82, 78, 92, 92, 93, 82, 89, 87, 80, 94, 99, 82, 96, 77, 'Research'),
('48478136', 'JADA-ONG, JOANA MARIE', '20142015_2', 75, 86, 75, 87, 82, 79, 90, 78, 77, 81, 88, 76, 77, 90, 76, 76, 95, 84, 94, 95, 'Business Operations'),
('48478141', 'DUERO, PAMELA ROSE', '20142015_2', 81, 84, 77, 94, 92, 75, 91, 75, 75, 92, 79, 80, 93, 85, 75, 92, 79, 82, 85, 95, 'Business Operations'),
('48478157', 'BOLIDO, MONIQUE CARRIZZA', '20142015_2', 75, 84, 82, 99, 82, 76, 87, 75, 78, 86, 87, 75, 96, 75, 86, 88, 77, 92, 89, 96, 'Systems Development');
INSERT INTO `past_data` (`id_number`, `student_name`, `year_graduated`, `CC 102`, `CC 103`, `PF 101`, `CC 104`, `IPT 101`, `IPT 102`, `CC 106`, `CC 105`, `IM 101`, `IM 102`, `HCI 101`, `HCI 102`, `WS 101`, `NET 101`, `NET 102`, `IAS 101`, `IAS 102`, `CAP 101`, `CAP 102`, `SP 101`, `OJT Placement`) VALUES
('48478162', 'GILOS, JEAN', '20142015_2', 77, 87, 75, 94, 99, 78, 85, 75, 75, 85, 89, 78, 98, 88, 75, 91, 98, 95, 78, 88, 'Systems Development'),
('48478217', 'FLORES, JESSICA MAUREEN', '20152016_2', 75, 78, 75, 78, 92, 75, 90, 77, 81, 99, 91, 77, 97, 79, 76, 86, 91, 84, 92, 94, 'Business Operations'),
('48478244', 'LEE, ANTHONY RHUNDELL', '20132014_2', 91, 98, 93, 79, 83, 86, 84, 86, 86, 75, 82, 83, 92, 92, 87, 97, 77, 96, 95, 78, 'Systems Development'),
('48478262', 'CASAN, JAMALIA', '20142015_2', 75, 78, 75, 85, 89, 78, 88, 75, 76, 79, 84, 76, 97, 75, 75, 91, 93, 89, 83, 92, 'Systems Development'),
('48478279', 'CAMBRONERO, BERNIE JAY', '20142015_2', 89, 89, 79, 82, 83, 75, 91, 78, 76, 78, 79, 82, 83, 76, 80, 87, 99, 90, 97, 94, 'Systems Development'),
('48478354', 'BALLOS, JEREMIAH', '20132014_2', 77, 75, 75, 80, 87, 79, 89, 75, 86, 76, 84, 81, 85, 81, 80, 79, 95, 98, 82, 84, 'Research'),
('48478424', 'LEDESMA, RALFH JAVE', '20142015_1', 87, 88, 85, 85, 86, 82, 82, 75, 94, 94, 89, 78, 97, 92, 83, 85, 75, 99, 98, 94, 'Research'),
('48478442', 'ONTONG, RYAN', '20152016_2', 79, 95, 78, 84, 95, 75, 82, 75, 76, 92, 80, 77, 87, 80, 75, 83, 76, 75, 78, 81, 'Business Operations'),
('48478484', 'CHAVEZ, MIL JULIENNE', '20142015_2', 86, 87, 78, 89, 99, 75, 93, 79, 86, 98, 83, 75, 77, 81, 77, 86, 89, 78, 89, 75, 'Research'),
('48478493', 'MOPAL, JERIC IVAN', '20132014_2', 94, 90, 85, 82, 94, 82, 85, 83, 95, 84, 75, 81, 95, 87, 87, 89, 92, 98, 81, 86, 'Research'),
('48478533', 'TORRALBA, JOHN FERDINAND', '20132014_3', 84, 80, 80, 98, 97, 77, 78, 76, 91, 89, 75, 77, 80, 85, 75, 98, 79, 83, 93, 99, 'Business Operations'),
('48478711', 'PARADO, JESON', '20142015_2', 79, 90, 75, 84, 77, 76, 87, 75, 76, 83, 76, 79, 91, 80, 82, 90, 95, 92, 76, 79, 'Technical Support'),
('48478727', 'IGLESIAS, CRISELLE', '20172018_2', 79, 84, 75, 99, 97, 75, 83, 75, 75, 98, 94, 75, 87, 85, 76, 92, 97, 86, 93, 80, 'Research'),
('48478728', 'PAGULONG, SHERLYN MAE', '20152016_2', 85, 80, 75, 86, 94, 75, 89, 75, 83, 89, 94, 75, 87, 79, 75, 75, 77, 79, 77, 88, 'Business Operations'),
('48478826', 'GROMETES, GINO ROY', '20132014_2', 86, 90, 77, 77, 85, 78, 83, 77, 96, 79, 75, 80, 89, 82, 78, 80, 87, 81, 89, 90, 'Business Operations'),
('48478845', 'DINIAY, MARICEL', '20142015_2', 87, 75, 77, 85, 89, 75, 94, 75, 89, 77, 90, 75, 93, 79, 75, 86, 79, 83, 93, 87, 'Systems Development'),
('48478868', 'BASALAN, MICHAEL JOSEPH', '20132014_2', 87, 87, 79, 93, 90, 83, 85, 79, 95, 82, 87, 85, 88, 85, 85, 98, 84, 84, 99, 93, 'Research'),
('48478893', 'CABASE, CARLO', '20152016_1', 77, 86, 75, 96, 98, 75, 85, 75, 75, 99, 79, 76, 86, 75, 80, 85, 80, 82, 78, 83, 'Business Operations'),
('48478955', 'CULANAG, MASTER CEDRICK ', '20132014_2', 92, 88, 80, 97, 93, 80, 83, 78, 97, 91, 90, 75, 87, 84, 82, 97, 93, 87, 81, 89, 'Business Operations'),
('48478964', 'NEROSA, JUNELD', '20142015_2', 89, 86, 76, 75, 75, 83, 87, 77, 90, 93, 78, 82, 82, 81, 79, 75, 84, 96, 76, 87, 'Business Operations'),
('48478986', 'LIAWAN, JO-NIKKO', '20142015_2', 81, 86, 78, 96, 77, 78, 88, 75, 92, 96, 91, 82, 77, 78, 75, 75, 84, 76, 97, 91, 'Business Operations'),
('48479220', 'CAÑADA, CARL ANTHONY', '20142015_2', 93, 84, 87, 85, 77, 79, 94, 75, 88, 83, 87, 84, 78, 87, 78, 95, 93, 82, 87, 77, 'Systems Development'),
('48479279', 'CHATTO, BLESSA NIÑA', '20132014_2', 78, 75, 78, 84, 76, 77, 86, 78, 80, 96, 91, 84, 80, 84, 78, 76, 75, 77, 83, 84, 'Business Operations'),
('48479298', 'GALARPE, RHEYEA KNIZZA', '20162017_2', 75, 75, 82, 98, 85, 75, 84, 77, 85, 91, 86, 80, 94, 83, 75, 94, 80, 76, 94, 97, 'Business Operations'),
('48479315', 'REYES, KENNETH JEANE', '20142015_1', 82, 86, 83, 98, 85, 76, 81, 77, 85, 89, 83, 75, 87, 80, 77, 98, 98, 91, 99, 94, 'Research'),
('48479338', 'CABAHUG, LOVELY GAY ', '20122013_2', 84, 90, 83, 88, 77, 77, 82, 75, 90, 90, 89, 75, 98, 91, 75, 96, 88, 91, 94, 79, 'Research'),
('48479423', 'TEVES, MENARD', '20132014_3', 79, 85, 84, 94, 80, 75, 89, 78, 82, 85, 83, 75, 89, 76, 81, 79, 89, 98, 98, 82, 'Research'),
('48479508', 'MIER, JOHN MICHAEL ', '20142015_2', 83, 84, 75, 80, 87, 79, 89, 75, 86, 92, 92, 75, 86, 83, 85, 94, 88, 81, 82, 83, 'Technical Support'),
('48479509', 'DAYAO, MIGUEL JOSHUA', '20142015_2', 85, 85, 83, 82, 81, 80, 86, 78, 86, 84, 80, 79, 87, 81, 82, 89, 75, 90, 76, 88, 'Business Operations'),
('48479511', 'PAGMANUA, AGAFEL', '20142015_2', 78, 76, 77, 80, 84, 77, 90, 75, 82, 82, 89, 78, 81, 77, 80, 88, 95, 94, 85, 99, 'Business Operations'),
('48479568', 'NAMALATA, PAUL JHON', '20142015_2', 84, 79, 75, 89, 82, 75, 91, 75, 84, 87, 89, 77, 97, 81, 85, 99, 82, 85, 97, 92, 'Research'),
('48479573', 'NAMARE, EDWARD', '20142015_3', 83, 84, 76, 78, 97, 75, 85, 75, 75, 91, 90, 78, 84, 76, 75, 80, 84, 99, 97, 97, 'Research'),
('48479647', 'PARAGUYA, ALJUN', '20132014_2', 77, 75, 77, 81, 95, 75, 85, 75, 91, 81, 88, 75, 93, 81, 76, 80, 95, 78, 82, 87, 'Business Operations'),
('48479676', 'ONLAYAO, DEXTER LAURENCE', '20142015_2', 84, 80, 75, 76, 88, 75, 91, 79, 83, 76, 89, 78, 82, 76, 75, 89, 75, 95, 84, 75, 'Research'),
('48479716', 'CASPILLO, BRANDON', '20132014_2', 95, 85, 84, 85, 88, 83, 88, 80, 84, 84, 96, 87, 99, 92, 80, 92, 75, 82, 90, 90, 'Systems Development'),
('48479723', 'CIMAFRANCA, JASON', '20142015_2', 99, 75, 77, 83, 78, 79, 79, 76, 87, 99, 85, 77, 79, 81, 81, 85, 76, 87, 89, 98, 'Business Operations'),
('48479726', 'BALBIRAN, HENRY JAKE', '20132014_2', 82, 90, 79, 93, 75, 75, 83, 75, 80, 97, 77, 75, 92, 85, 84, 77, 93, 81, 86, 83, 'Technical Support'),
('48479737', 'LIWAGON, HONEY JANE', '20142015_2', 75, 82, 75, 79, 94, 75, 89, 77, 81, 98, 83, 76, 78, 88, 75, 78, 98, 97, 94, 85, 'Research'),
('48479750', 'MAGHANOY, CHRISTIAN MARK', '20132014_1', 77, 79, 92, 82, 99, 86, 82, 81, 94, 88, 96, 79, 80, 86, 79, 81, 98, 82, 90, 76, 'Research'),
('48479757', 'GUILON, PABLITO, JR.', '20142015_2', 86, 85, 82, 78, 98, 78, 88, 75, 88, 80, 85, 75, 82, 78, 75, 88, 86, 94, 92, 94, 'Research'),
('48479779', 'GALLO JR., ROMEO', '20142015_2', 79, 84, 77, 82, 88, 75, 88, 75, 81, 88, 87, 75, 78, 76, 79, 77, 83, 84, 77, 82, 'Business Operations'),
('48479806', 'BABA, FERRE PEARL ', '20132014_1', 83, 75, 87, 79, 82, 78, 82, 75, 81, 79, 80, 76, 79, 93, 77, 86, 86, 77, 81, 92, 'Business Operations'),
('48479828', 'PALEC, JAMES ROEDER', '20132014_2', 80, 88, 83, 96, 77, 75, 82, 75, 89, 77, 83, 76, 99, 82, 75, 93, 88, 88, 99, 95, 'Systems Development'),
('48479937', 'FABIA, JUDE XARDAN', '20152016_2', 77, 78, 77, 86, 86, 75, 82, 78, 81, 77, 90, 75, 89, 76, 79, 78, 81, 92, 94, 87, 'Research'),
('48479951', 'SABAYTON, KRISTINE', '20132014_2', 79, 75, 76, 76, 77, 78, 88, 75, 75, 96, 94, 75, 96, 90, 83, 90, 86, 78, 95, 86, 'Research'),
('48479991', 'ESPINA, CEDIE', '20142015_2', 84, 83, 77, 86, 75, 75, 86, 75, 82, 93, 79, 75, 86, 75, 75, 94, 90, 83, 83, 77, 'Research'),
('48480226', 'ASUQUE, LEONARD JOHN', '20192020_2', 91, 85, 93, 90, 83, 79, 86, 84, 79, 87, 91, 90, 88, 85, 91, 93, 93, 86, 88, 82, 'Systems Development'),
('48480273', 'QUERO, NASSER JAN', '20132014_2', 96, 96, 88, 86, 94, 76, 92, 75, 89, 84, 87, 78, 88, 86, 78, 83, 89, 87, 85, 84, 'Systems Development'),
('48480285', 'TABIGUE, JEMMAR MAE', '20172018_2', 70, 75, 78, 93, 95, 82, 82, 75, 85, 99, 89, 76, 99, 81, 79, 97, 81, 76, 99, 89, 'Business Operations'),
('48480327', 'DELOSO, MARJURY', '20152016_2', 75, 88, 77, 80, 86, 77, 84, 75, 87, 93, 94, 76, 78, 83, 76, 95, 91, 90, 80, 99, 'Business Operations'),
('48480644', 'SILVOSA, JONATHAN EDWARD', '20142015_2', 86, 85, 83, 85, 93, 77, 91, 80, 89, 79, 95, 88, 95, 79, 88, 82, 83, 96, 83, 78, 'Systems Development'),
('48480687', 'AMBAYEC, WILMA', '20192020_2', 82, 84, 81, 84, 98, 75, 78, 75, 98, 93, 97, 84, 84, 81, 79, 94, 87, 98, 76, 84, 'Business Operations'),
('48480775', 'TIEMPO, AILENE', '20142015_2', 83, 83, 80, 99, 86, 75, 91, 75, 92, 80, 78, 75, 99, 85, 77, 83, 76, 81, 84, 75, 'Systems Development'),
('48480779', 'CALLAO, JAY', '20152016_2', 75, 78, 76, 76, 98, 75, 81, 77, 98, 95, 80, 75, 94, 76, 77, 98, 82, 99, 86, 79, 'Research'),
('48480836', 'BALTUNADO, JOHN BRYAN', '20172018_3', 78, 75, 75, 77, 78, 80, 80, 75, 97, 76, 97, 77, 94, 75, 79, 77, 83, 82, 87, 89, 'Business Operations'),
('48480852', 'TIMBAL, JAYSON', '20152016_2', 78, 78, 75, 86, 93, 81, 86, 75, 85, 98, 86, 81, 99, 81, 82, 85, 97, 96, 91, 82, 'Research'),
('48480864', 'YOUNG, KRETCHNER', '20142015_2', 80, 85, 75, 92, 75, 82, 87, 76, 84, 96, 85, 84, 82, 77, 76, 99, 76, 94, 98, 97, 'Research'),
('48480874', 'BULANO, RYAN', '20142015_2', 78, 87, 75, 83, 79, 77, 88, 75, 83, 84, 90, 76, 77, 82, 75, 95, 92, 91, 83, 94, 'Business Operations'),
('48480910', 'VIOS, JOHN BRYAN', '20152016_2', 83, 93, 82, 91, 83, 81, 90, 79, 84, 97, 94, 89, 76, 80, 87, 78, 84, 87, 94, 83, 'Research'),
('48480935', 'MALABOTE, ARMANDO JR.', '20152016_2', 75, 75, 75, 90, 76, 75, 83, 75, 77, 80, 75, 76, 97, 77, 78, 85, 84, 79, 81, 75, 'Systems Development'),
('48480961', 'GUMANID, ISAAC PAUL', '20142015_2', 82, 81, 79, 80, 84, 75, 91, 76, 82, 83, 86, 86, 80, 80, 76, 75, 86, 92, 92, 98, 'Business Operations'),
('48481009', 'FUENTESFINA, EDWIN JR.', '20142015_2', 82, 84, 78, 94, 96, 75, 90, 75, 84, 98, 89, 82, 76, 82, 75, 83, 95, 99, 95, 96, 'Research'),
('48481020', 'DIAZ, JANNALYN', '20142015_2', 87, 90, 75, 92, 86, 75, 80, 75, 86, 89, 88, 83, 81, 83, 79, 90, 75, 90, 97, 79, 'Research'),
('48481026', 'AGUILAR, JAN CARLO', '20162017_2', 81, 81, 75, 82, 84, 75, 79, 76, 79, 86, 85, 79, 96, 81, 78, 75, 95, 94, 99, 79, 'Research'),
('48481046', 'TIROL, DONALD', '20142015_2', 83, 90, 76, 86, 97, 80, 92, 75, 82, 89, 86, 78, 98, 75, 80, 95, 78, 89, 92, 79, 'Systems Development'),
('48481056', 'SALAS, JASON JONES', '20142015_2', 81, 84, 75, 99, 91, 75, 91, 75, 79, 79, 82, 86, 80, 75, 84, 75, 84, 98, 76, 85, 'Systems Development'),
('48481062', 'ORTIZ, DYLAN', '20142015_2', 80, 85, 75, 78, 95, 75, 85, 75, 83, 83, 86, 82, 96, 80, 75, 95, 92, 87, 83, 76, 'Research'),
('48481074', 'PAQUIBOT, ARVIN', '20172018_3', 85, 76, 83, 80, 89, 75, 83, 75, 76, 88, 94, 78, 85, 80, 76, 78, 80, 96, 96, 89, 'Research'),
('48481093', 'FELICITAS JR., WILFREDO', '20152016_2', 80, 86, 76, 75, 82, 75, 83, 75, 76, 89, 75, 81, 99, 78, 78, 79, 77, 92, 80, 90, 'Business Operations'),
('48482805', 'MORATIN, WARLA GIENE', '20142015_2', 81, 88, 85, 94, 92, 82, 94, 83, 93, 82, 92, 81, 89, 90, 85, 86, 78, 82, 80, 81, 'Technical Support'),
('48482838', 'BEROU, KRISTINE', '20142015_2', 79, 86, 82, 84, 82, 79, 94, 76, 87, 88, 95, 81, 76, 87, 84, 87, 77, 76, 85, 88, 'Business Operations'),
('48482849', 'POL, JAN PAULINE', '20142015_2', 90, 96, 87, 76, 80, 87, 92, 85, 92, 90, 94, 84, 89, 88, 90, 86, 97, 89, 79, 86, 'Business Operations'),
('48482871', 'CABANILLA, GAEA', '20162017_1', 75, 75, 75, 76, 89, 75, 85, 75, 81, 76, 83, 77, 92, 75, 82, 90, 91, 95, 94, 98, 'Research'),
('48482938', 'ATENTO, RENATO JR.', '20152016_2', 76, 83, 81, 77, 84, 75, 89, 75, 85, 91, 88, 78, 79, 80, 79, 78, 82, 79, 85, 84, 'Business Operations'),
('48482977', 'VILLAMOR, JAPETH', '20142015_2', 79, 75, 75, 94, 93, 75, 87, 76, 80, 79, 88, 81, 83, 76, 83, 82, 76, 82, 86, 82, 'Systems Development'),
('48483008', 'LUMARAN, CATHERINE', '20142015_2', 75, 87, 86, 84, 85, 80, 94, 82, 93, 90, 95, 81, 78, 85, 84, 75, 86, 76, 83, 76, 'Business Operations'),
('48483014', 'DELA GRACIA, JAY', '20152016_2', 75, 80, 75, 96, 81, 75, 89, 75, 77, 80, 85, 80, 98, 81, 80, 88, 95, 82, 78, 85, 'Systems Development'),
('48483031', 'BANGCAS, KEMVERLY', '20142015_2', 75, 85, 75, 82, 88, 76, 92, 75, 80, 87, 92, 76, 78, 81, 75, 88, 94, 95, 94, 80, 'Research'),
('48483040', 'MATEO, KYNE JUNEPH', '20152016_2', 80, 86, 81, 94, 88, 84, 84, 81, 79, 95, 81, 77, 76, 86, 82, 97, 78, 85, 81, 91, 'Business Operations'),
('48483060', 'CASTILLO, JOHN KAROL', '20212022_2', 68, 79, 88, 86, 85, 98, 90, 84, 80, 95, 90, 95, 93, 87, 82, 94, 95, 78, 75, 92, 'Business Operations'),
('48483083', 'SARDOVIA, YVONNIE', '20142015_2', 79, 79, 75, 91, 98, 76, 89, 76, 75, 81, 87, 77, 93, 81, 75, 85, 81, 97, 91, 86, 'Systems Development'),
('48483098', 'DIAZ, VINCENT JAKE', '20142015_2', 78, 78, 75, 85, 95, 75, 91, 76, 84, 77, 90, 76, 95, 77, 75, 76, 97, 94, 76, 96, 'Business Operations'),
('48483127', 'CAPILITAN, REIZEL', '20152016_2', 81, 80, 75, 80, 91, 75, 84, 75, 96, 84, 91, 75, 87, 81, 75, 99, 98, 99, 87, 85, 'Research'),
('48483167', 'PLAZA, CHRISTIANE JADE', '20152016_1', 79, 81, 76, 97, 85, 75, 89, 78, 88, 95, 88, 77, 79, 84, 78, 83, 75, 92, 80, 87, 'Business Operations'),
('48483170', 'ALHAMBRA, MARC FRANCIS', '20152016_2', 81, 86, 79, 77, 81, 75, 88, 75, 82, 99, 94, 82, 76, 80, 80, 95, 94, 82, 75, 93, 'Business Operations'),
('48483345', 'DORIA, MARK', '20152016_2', 85, 88, 83, 75, 77, 78, 85, 78, 86, 93, 94, 84, 96, 82, 86, 77, 80, 80, 95, 97, 'Business Operations'),
('48483357', 'ARREZA, NEIL PATRICK ', '20172018_2', 81, 76, 76, 77, 81, 78, 82, 75, 80, 79, 92, 76, 85, 84, 82, 87, 98, 96, 80, 97, 'Technical Support'),
('48483480', 'MESIONA, NERI', '20142015_2', 83, 85, 80, 89, 76, 83, 85, 76, 93, 87, 88, 77, 85, 82, 81, 75, 91, 84, 91, 99, 'Business Operations'),
('48483508', 'ICAMINA, ALLYSON JED', '20182019_1', 77, 75, 77, 92, 95, 75, 78, 75, 77, 78, 90, 75, 99, 78, 75, 75, 81, 88, 98, 76, 'Systems Development'),
('48483519', 'NEBREA, JOANNA MARIE', '20172018_2', 75, 79, 75, 96, 89, 78, 75, 75, 90, 98, 82, 78, 85, 75, 75, 78, 98, 97, 84, 89, 'Business Operations'),
('48483531', 'SARSONAS, BEN PAUL', '20162017_2', 76, 90, 75, 82, 95, 80, 83, 75, 75, 80, 81, 84, 84, 83, 77, 85, 88, 98, 76, 80, 'Technical Support'),
('48483536', 'MENDROS, RICHARD', '20182019_1', 81, 75, 75, 79, 85, 75, 80, 75, 75, 85, 93, 80, 97, 79, 76, 89, 91, 99, 75, 77, 'Research'),
('48483568', 'NANG, HAYDEE', '20142015_2', 77, 96, 85, 93, 85, 78, 92, 80, 82, 76, 91, 84, 80, 86, 86, 91, 84, 80, 91, 81, 'Systems Development'),
('48483617', 'LAO, ALEXANDER JR.', '20152016_2', 77, 81, 75, 79, 88, 75, 83, 75, 84, 97, 83, 75, 99, 81, 84, 87, 90, 85, 99, 86, 'Research'),
('48483619', 'ALVERO, GERALDINE', '20142015_2', 78, 76, 75, 94, 91, 81, 91, 75, 85, 89, 95, 81, 99, 82, 78, 88, 80, 81, 87, 75, 'Research'),
('48483645', 'ALCANTARA, GLEN', '20142015_2', 79, 86, 76, 88, 92, 75, 86, 76, 81, 85, 79, 78, 92, 78, 76, 90, 86, 76, 77, 87, 'Business Operations'),
('48483673', 'GOCELA, MARK LOU JAMES', '20152016_1', 81, 86, 75, 96, 95, 77, 90, 77, 82, 91, 83, 85, 77, 75, 82, 83, 85, 94, 78, 93, 'Business Operations'),
('48483697', 'BALURAN, ARCELY', '20152016_2', 77, 85, 79, 76, 78, 81, 83, 75, 75, 77, 80, 75, 93, 80, 80, 83, 78, 81, 90, 89, 'Systems Development'),
('48483842', 'CABONCE, HULBERT JOHN', '20142015_2', 79, 84, 79, 90, 81, 75, 86, 75, 88, 81, 83, 80, 80, 83, 76, 95, 90, 83, 88, 93, 'Business Operations'),
('48483878', 'BALANTE, RUBY JEAN', '20142015_2', 77, 88, 77, 75, 78, 75, 92, 78, 88, 85, 93, 82, 94, 86, 80, 79, 96, 86, 98, 81, 'Research'),
('48483882', 'VILLACAMPA, ARNIE', '20142015_2', 95, 97, 76, 91, 76, 75, 89, 75, 98, 99, 89, 79, 92, 81, 92, 96, 84, 76, 77, 93, 'Business Operations'),
('48483891', 'DAUGDAUG, JOHN CRIS', '20142015_2', 78, 81, 75, 79, 80, 78, 92, 76, 79, 88, 97, 81, 77, 78, 76, 88, 77, 79, 96, 99, 'Business Operations'),
('48483899', 'ESPAÑA, GELLI', '20152016_1', 79, 78, 75, 96, 91, 76, 85, 75, 80, 78, 84, 78, 78, 83, 84, 83, 79, 94, 96, 85, 'Research'),
('48483902', 'MONTES, JHONLY', '20162017_2', 77, 75, 75, 94, 98, 75, 85, 75, 68, 96, 85, 79, 92, 77, 75, 95, 83, 99, 75, 96, 'Business Operations'),
('48483906', 'AMPER, KENNY', '20142015_2', 77, 85, 75, 85, 78, 75, 95, 77, 80, 96, 95, 80, 82, 77, 77, 81, 97, 85, 86, 76, 'Research'),
('48483910', 'GALES, DELIO JR.', '20152016_2', 89, 84, 79, 99, 92, 76, 87, 76, 82, 96, 91, 76, 80, 83, 82, 87, 93, 99, 91, 89, 'Research'),
('48483930', 'ALLENA, TRISHA MAY', '20152016_1', 87, 87, 82, 90, 95, 84, 85, 76, 79, 89, 85, 78, 91, 85, 84, 77, 95, 81, 99, 85, 'Systems Development'),
('48484141', 'GONZAGA, KYONNO ALLENS', '20152016_2', 75, 76, 77, 95, 77, 77, 87, 77, 78, 82, 80, 86, 88, 80, 79, 95, 77, 97, 93, 80, 'Research'),
('48484147', 'MALUMBAGA, DARRYL', '20152016_1', 77, 79, 79, 80, 97, 80, 80, 78, 86, 85, 86, 84, 79, 77, 84, 92, 81, 76, 90, 94, 'Business Operations'),
('48484177', 'PUSOD, KIM SEAN', '20142015_2', 77, 87, 80, 78, 85, 77, 92, 78, 91, 81, 89, 83, 86, 78, 78, 93, 82, 80, 93, 94, 'Business Operations'),
('48484178', 'DIONISIO, PAULO', '20142015_2', 77, 81, 76, 88, 79, 75, 92, 76, 85, 83, 86, 84, 98, 83, 81, 89, 89, 80, 97, 79, 'Research'),
('48484267', 'MACASINDIL, JUNREY', '20152016_1', 77, 80, 75, 86, 97, 78, 80, 75, 83, 85, 80, 75, 79, 82, 82, 97, 90, 86, 90, 75, 'Research'),
('48484392', 'CORTES, CHRISTINE', '20152016_1', 77, 75, 76, 83, 93, 83, 80, 75, 78, 93, 85, 81, 87, 85, 83, 82, 86, 78, 94, 96, 'Business Operations'),
('48484442', 'ABAYAN, ANTHONY', '20152016_2', 87, 90, 75, 89, 87, 75, 82, 75, 75, 89, 81, 76, 93, 76, 79, 89, 78, 94, 90, 93, 'Systems Development'),
('48484494', 'SOLON, JANN DISSOH', '20162017_2', 83, 83, 86, 85, 98, 78, 78, 78, 75, 79, 91, 82, 88, 78, 81, 86, 96, 84, 86, 91, 'Systems Development'),
('48484529', 'DEOCAMPO, CARLO', '20182019_2', 77, 79, 76, 91, 96, 75, 75, 75, 80, 88, 91, 81, 96, 79, 77, 84, 99, 77, 84, 89, 'Business Operations'),
('48484582', 'PARDILLA, CLINT JAMES', '20142015_2', 80, 82, 80, 96, 98, 78, 92, 77, 88, 85, 93, 82, 82, 80, 79, 76, 84, 88, 93, 84, 'Research'),
('48484637', 'CURIBA, JOAN CHRISTIE', '20152016_2', 77, 75, 75, 85, 81, 75, 82, 75, 75, 97, 86, 82, 75, 78, 75, 97, 78, 82, 91, 97, 'Business Operations'),
('48484655', 'NEÑARIA, JUNENALYN', '20172018_2', 77, 78, 77, 77, 97, 75, 75, 75, 75, 83, 96, 75, 78, 80, 79, 80, 77, 83, 78, 92, 'Technical Support'),
('48484695', 'ARIATE, JIMMER', '20152016_1', 84, 79, 78, 83, 98, 76, 92, 75, 85, 87, 80, 81, 83, 75, 78, 84, 91, 79, 80, 89, 'Business Operations'),
('48484791', 'ANISTOSO, RAUMELYN JOY', '20142015_3', 75, 96, 75, 79, 82, 77, 89, 75, 82, 87, 82, 77, 95, 89, 75, 92, 87, 97, 94, 87, 'Research'),
('48484797', 'CASILDO, VANEZA JEAN', '20142015_2', 79, 82, 75, 82, 76, 75, 90, 80, 81, 92, 91, 75, 76, 79, 75, 78, 99, 94, 79, 87, 'Business Operations'),
('48484834', 'SALAZAR, GLAZY', '20172018_2', 86, 76, 75, 89, 84, 78, 75, 79, 83, 76, 83, 78, 75, 76, 75, 94, 78, 98, 96, 76, 'Research'),
('48484855', 'BRAZA, LORENZ GLENN', '20152016_2', 75, 82, 75, 85, 80, 75, 90, 75, 82, 94, 94, 79, 99, 77, 79, 98, 77, 82, 99, 91, 'Research'),
('48484866', 'PUNIO, LYRA', '20142015_2', 97, 99, 91, 87, 88, 89, 93, 86, 94, 81, 92, 85, 93, 94, 91, 75, 95, 83, 82, 85, 'Systems Development'),
('48484991', 'MATILDO, LORDELYN', '20152016_2', 77, 93, 88, 81, 94, 79, 86, 76, 88, 81, 77, 84, 77, 77, 88, 79, 79, 92, 75, 78, 'Research'),
('48485010', 'CALO, RICHARD JOHN', '20172018-1', 75, 77, 77, 95, 82, 77, 85, 75, 84, 75, 97, 76, 82, 88, 75, 94, 82, 92, 88, 81, 'Research'),
('48485012', 'PAMAYLAON, CAROL DAWN', '20152016_2', 77, 97, 92, 95, 87, 81, 86, 78, 89, 79, 93, 84, 88, 82, 88, 78, 91, 86, 89, 82, 'Systems Development'),
('48485067', 'ECHALICO, DEXTER', '20152016_2', 75, 76, 77, 75, 80, 75, 90, 75, 75, 97, 94, 77, 84, 75, 78, 99, 80, 91, 77, 96, 'Business Operations'),
('48485112', 'VILLEGAS, GWYN', '20152016_1', 90, 82, 75, 80, 85, 75, 83, 75, 75, 99, 85, 79, 79, 76, 85, 87, 90, 80, 79, 88, 'Business Operations'),
('48485127', 'PANIZA, PRINCESS GRACE', '20142015_2', 82, 86, 81, 93, 98, 77, 81, 76, 93, 81, 93, 77, 87, 83, 80, 92, 98, 77, 99, 91, 'Business Operations'),
('48485129', 'DACPANO, MARK KENN', '20152016_1', 82, 77, 75, 93, 93, 75, 83, 75, 80, 83, 83, 78, 79, 76, 76, 92, 79, 80, 84, 93, 'Business Operations'),
('48485146', 'BALINDONG, RAYYAN', '20152016_2', 75, 80, 75, 78, 88, 75, 84, 75, 89, 88, 77, 75, 78, 75, 75, 81, 77, 99, 83, 82, 'Research'),
('48485208', 'AMSAJIN, SHARIFA', '20152016_2', 80, 75, 75, 86, 93, 75, 87, 75, 78, 86, 92, 78, 81, 80, 75, 78, 99, 75, 80, 93, 'Business Operations'),
('48485212', 'REQUINA, KENNETH', '20162017_2', 94, 90, 94, 94, 80, 84, 85, 84, 83, 77, 85, 88, 89, 88, 88, 85, 75, 83, 99, 84, 'Systems Development'),
('48485223', 'BRETAÑA, VENIEL', '20142015_2', 80, 81, 82, 84, 98, 75, 92, 75, 79, 85, 79, 80, 90, 75, 79, 84, 83, 87, 95, 86, 'Research'),
('48485260', 'TOME, ARNOLD JR.', '20152016_2', 86, 81, 75, 86, 94, 77, 85, 75, 78, 89, 92, 81, 86, 78, 78, 89, 98, 86, 80, 76, 'Research'),
('48485276', 'MENDOZA, NIEL ALDRIN', '20162017_2', 84, 80, 82, 84, 88, 76, 83, 75, 92, 86, 79, 82, 96, 76, 75, 80, 94, 88, 75, 77, 'Research'),
('48485355', 'LLANTO, CAMILLE JEAN', '20172018-1', 75, 75, 75, 93, 97, 75, 78, 75, 90, 77, 94, 77, 92, 75, 75, 79, 93, 94, 91, 86, 'Research'),
('48485401', 'CASTRODES, CLAUDINE', '20152016_1', 76, 78, 75, 78, 76, 75, 84, 75, 77, 77, 80, 78, 92, 75, 86, 82, 84, 89, 94, 85, 'Technical Support'),
('48485533', 'CAJEGAS, GENER', '20152016_2', 94, 91, 90, 94, 89, 83, 89, 83, 89, 79, 96, 78, 96, 83, 88, 99, 94, 84, 92, 93, 'Systems Development'),
('48485546', 'CARATOL, JOYCE MAE', '20172018_2', 80, 88, 75, 80, 81, 75, 81, 75, 80, 94, 90, 80, 99, 75, 75, 92, 91, 97, 97, 98, 'Research'),
('48485552', 'RUBIN, MARY CHEENE', '20152016_1', 78, 75, 75, 94, 98, 80, 80, 75, 75, 79, 84, 78, 91, 82, 86, 92, 96, 95, 75, 87, 'Technical Support'),
('48485577', 'VALLANO, JANICE', '20152016_2', 80, 85, 77, 83, 84, 81, 80, 77, 77, 77, 84, 77, 90, 82, 84, 92, 98, 78, 96, 76, 'Technical Support'),
('48485585', 'ROA, JUSTINE JOY', '20142015_3', 78, 81, 75, 90, 77, 76, 89, 76, 92, 85, 81, 75, 92, 75, 84, 95, 78, 90, 90, 88, 'Research'),
('48485672', 'ESPERA, NERE JR.', '20142015_3', 75, 87, 79, 80, 85, 76, 91, 79, 84, 83, 93, 82, 97, 81, 81, 85, 93, 97, 80, 86, 'Research'),
('48485719', 'PARBA, LARRY', '20142015_2', 75, 95, 75, 92, 77, 75, 90, 75, 84, 96, 86, 82, 77, 77, 76, 92, 93, 78, 87, 75, 'Research'),
('48485741', 'VALIENTE, LOUIE EARL', '20152016_2', 84, 83, 75, 94, 91, 76, 85, 75, 78, 94, 93, 80, 75, 75, 79, 97, 77, 91, 91, 75, 'Research'),
('48485793', 'PEREZ, JOHN PAUL', '20152016_2', 81, 88, 76, 86, 77, 75, 88, 75, 85, 84, 84, 76, 85, 83, 76, 92, 75, 76, 87, 99, 'Business Operations'),
('48485799', 'JAMORA, CHRISTOPHER HENRY', '20182019_2', 81, 78, 75, 99, 97, 75, 82, 75, 82, 75, 91, 75, 93, 83, 75, 78, 81, 92, 77, 96, 'Systems Development'),
('48485858', 'FELASOL, MARY LAURENCE', '20152016_2', 91, 91, 84, 91, 98, 84, 90, 80, 89, 77, 90, 87, 88, 87, 87, 91, 98, 75, 90, 93, 'Systems Development'),
('48485895', 'SERENTAS, MARVELOUS', '20162017_2', 76, 78, 75, 85, 78, 75, 83, 76, 69, 87, 76, 82, 94, 87, 76, 78, 88, 99, 91, 92, 'Research'),
('48485957', 'SOLANO, ARGIE', '20142015_2', 88, 92, 76, 86, 92, 75, 90, 76, 87, 87, 80, 75, 90, 78, 79, 86, 94, 92, 90, 77, 'Research'),
('48486005', 'SEQUIÑA, HONEY RIZZA', '20172018-1', 75, 77, 81, 87, 96, 75, 84, 78, 86, 86, 97, 75, 99, 75, 75, 91, 89, 91, 99, 81, 'Research'),
('48486016', 'VALDEZ, JENNY', '20162017_2', 80, 81, 81, 92, 80, 75, 82, 79, 75, 76, 87, 81, 87, 82, 75, 91, 88, 77, 77, 77, 'Technical Support'),
('48486233', 'CAGAMPANG, MARY GRACE', '20162017_3', 75, 78, 75, 83, 78, 75, 83, 75, 75, 85, 81, 83, 94, 75, 75, 80, 93, 98, 97, 82, 'Research'),
('48486303', 'GABATO, JERRY', '20152016_2', 85, 84, 75, 80, 81, 75, 80, 75, 81, 85, 81, 78, 98, 79, 85, 80, 85, 87, 85, 91, 'Business Operations'),
('48486563', 'GALUPO, GRETCHEN', '20152016_2', 82, 84, 81, 89, 98, 78, 86, 75, 82, 77, 90, 81, 85, 85, 83, 80, 90, 94, 95, 99, 'Systems Development'),
('48486678', 'NOMBRADO, JORIZ', '20182019_1', 75, 89, 78, 92, 87, 75, 77, 75, 76, 76, 91, 75, 76, 75, 77, 79, 78, 82, 92, 94, 'Systems Development'),
('48486716', 'PITLO, ALAIN REY', '20152016_2', 90, 90, 79, 94, 86, 75, 86, 75, 93, 75, 85, 83, 81, 84, 82, 75, 78, 88, 76, 78, 'Systems Development'),
('48486743', 'GO, LAWRENCE', '20162017_3', 83, 80, 79, 84, 78, 75, 80, 75, 86, 96, 88, 79, 90, 82, 75, 78, 91, 80, 86, 78, 'Research'),
('48486748', 'MONCAL, JULIUS CAESAR', '20152016_1', 77, 83, 79, 97, 94, 78, 80, 75, 77, 82, 85, 83, 92, 80, 83, 81, 85, 94, 93, 78, 'Systems Development'),
('48486795', 'VILLAME, JOSHUA', '20152016_2', 85, 81, 76, 89, 88, 76, 91, 75, 91, 84, 82, 77, 97, 79, 82, 99, 90, 96, 79, 94, 'Business Operations'),
('48486811', 'VILLAR, HAROLD', '20172018_2', 79, 78, 75, 91, 82, 75, 82, 77, 82, 91, 91, 75, 85, 83, 78, 96, 97, 85, 75, 92, 'Business Operations'),
('48486847', 'INFIESTO, JANDEE BON', '20162017_2', 75, 78, 86, 83, 94, 75, 93, 75, 81, 91, 87, 80, 82, 81, 75, 90, 75, 95, 92, 80, 'Research'),
('48487314', 'ORTALLA, MAC KLEIN ', '20152016_2', 85, 91, 89, 92, 83, 75, 90, 76, 84, 93, 89, 82, 80, 81, 80, 91, 90, 80, 98, 99, 'Business Operations'),
('48487322', 'AUMADA, REYMARK', '20152016_2', 83, 80, 85, 91, 87, 75, 89, 75, 84, 82, 94, 80, 83, 81, 80, 86, 99, 86, 98, 99, 'Business Operations'),
('48487480', 'HABIBON, NASHRUDIN', '20152016_2', 78, 83, 81, 79, 89, 75, 87, 75, 83, 89, 85, 80, 82, 81, 76, 98, 98, 84, 90, 84, 'Research'),
('48487523', 'VALDEZ, FLORENZ PAUL', '20152016_3', 78, 85, 75, 87, 95, 75, 81, 75, 79, 75, 78, 76, 76, 79, 76, 88, 97, 92, 85, 95, 'Business Operations'),
('48487530', 'ABINAL, GABRIEL ', '20172018-1', 83, 76, 75, 91, 77, 75, 80, 75, 75, 78, 96, 76, 86, 78, 75, 98, 76, 84, 90, 89, 'Systems Development'),
('48487587', 'BALIONG, ALJON', '20152016_2', 82, 93, 90, 77, 90, 80, 88, 81, 90, 78, 94, 86, 83, 86, 85, 89, 94, 93, 92, 94, 'Research'),
('48487601', 'SANICO, JR., VIRGILIO ', '20182019_1', 82, 78, 79, 81, 89, 75, 83, 75, 80, 87, 84, 75, 90, 75, 79, 99, 97, 92, 97, 77, 'Research'),
('48487613', 'TADLA, JOSE MARI', '20152016_2', 93, 89, 84, 92, 76, 75, 94, 75, 84, 93, 89, 87, 75, 82, 80, 98, 88, 99, 78, 87, 'Research'),
('48487616', 'TADLA, JUSTIN MARK', '20152016_2', 85, 90, 87, 79, 82, 76, 89, 77, 83, 99, 89, 82, 88, 82, 82, 80, 76, 91, 89, 86, 'Research'),
('48487652', 'CADALZO, CLAIRE', '20172018-1', 89, 77, 79, 78, 88, 75, 76, 77, 82, 92, 92, 75, 89, 84, 75, 92, 76, 93, 96, 94, 'Research'),
('48487688', 'CABADONGA, JEHN', '20152016_2', 75, 78, 75, 99, 89, 75, 85, 75, 91, 82, 92, 76, 99, 82, 77, 90, 93, 92, 81, 85, 'Research'),
('48487704', 'JUALO, ZARAH ', '20152016_2', 83, 84, 80, 85, 88, 75, 90, 75, 96, 86, 96, 80, 77, 87, 81, 80, 88, 84, 91, 89, 'Business Operations'),
('48487743', 'BASINDANAN, LESTER', '20162017_2', 77, 77, 79, 92, 77, 75, 78, 80, 67, 83, 83, 82, 86, 81, 80, 85, 91, 80, 99, 94, 'Technical Support'),
('48487747', 'BISMONTE, PETER', '20152016_2', 90, 90, 90, 94, 80, 76, 85, 76, 92, 97, 85, 86, 86, 84, 81, 97, 88, 91, 99, 89, 'Research'),
('48487877', 'INDOYON, DAISY', '20182019_2', 89, 83, 75, 99, 97, 75, 75, 75, 78, 78, 90, 75, 97, 86, 79, 91, 82, 84, 94, 93, 'Systems Development'),
('48487991', 'CANLAS, EDISON', '20162017_2', 86, 80, 76, 98, 93, 75, 82, 75, 85, 77, 84, 85, 92, 75, 79, 92, 92, 76, 77, 83, 'Technical Support'),
('48488007', 'BIRONDO, RHIENO DALE ', '20162017_3', 79, 75, 75, 94, 85, 75, 78, 75, 83, 99, 85, 80, 83, 76, 75, 86, 81, 90, 78, 93, 'Business Operations'),
('48488134', 'FIEL, JOLINA JEAN', '20162017_2', 85, 75, 79, 82, 96, 75, 78, 76, 75, 98, 80, 83, 96, 83, 76, 76, 78, 83, 90, 98, 'Business Operations'),
('48488205', 'PARDILANAN, WENDY ', '20152016_2', 85, 81, 75, 88, 98, 75, 86, 75, 79, 78, 96, 75, 79, 83, 75, 80, 95, 99, 88, 78, 'Research'),
('48488250', 'HUISO, CHRISTY MAE', '20152016_2', 86, 79, 75, 79, 96, 75, 90, 75, 81, 79, 93, 83, 75, 85, 77, 86, 86, 93, 94, 92, 'Research'),
('48488282', 'RECTA, CHYZY JOYCE', '20162017_2', 83, 86, 84, 78, 84, 75, 90, 75, 87, 97, 86, 82, 92, 82, 80, 76, 81, 93, 98, 79, 'Research'),
('48488284', 'BAYO, PHILEXSON', '20152016_2', 88, 79, 75, 82, 81, 75, 86, 75, 87, 77, 91, 79, 88, 81, 75, 90, 89, 98, 80, 76, 'Research'),
('48488309', 'ACAS, ALVIN', '20152016_2', 80, 84, 79, 75, 99, 75, 87, 75, 76, 77, 85, 81, 76, 78, 80, 93, 79, 98, 83, 89, 'Research'),
('48488320', 'RAMOS, SHAWN', '20182019_1', 80, 76, 75, 75, 94, 75, 76, 79, 64, 93, 86, 76, 89, 75, 75, 92, 98, 94, 79, 92, 'Business Operations'),
('48488339', 'BACULNA, JAPETH', '20162017_2', 83, 78, 76, 82, 85, 75, 83, 76, 82, 86, 89, 75, 75, 81, 75, 94, 76, 88, 89, 98, 'Business Operations'),
('48488410', 'UY, MARY JUSTINE', '20152016_2', 90, 89, 83, 83, 92, 75, 88, 75, 77, 95, 93, 75, 93, 80, 78, 78, 92, 79, 86, 99, 'Business Operations'),
('48488433', 'ESGANA, MARY GOLD QUEEN', '20152016_2', 78, 81, 76, 87, 95, 76, 87, 75, 82, 98, 99, 81, 92, 87, 77, 89, 88, 96, 83, 77, 'Research'),
('48488488', 'DAHAB, IAN CHRISTOPHER', '20152016_2', 85, 78, 76, 86, 86, 75, 84, 75, 77, 77, 88, 76, 80, 82, 75, 96, 94, 89, 80, 78, 'Technical Support'),
('48488564', 'AGUILAR, ERIS JOHN', '20152016_2', 85, 84, 80, 99, 80, 75, 88, 76, 84, 96, 91, 82, 80, 80, 77, 86, 89, 88, 78, 81, 'Business Operations'),
('48488575', 'BERONGOY, NIEL', '20152016_2', 88, 86, 84, 97, 86, 76, 85, 76, 85, 86, 93, 79, 91, 81, 93, 81, 95, 79, 86, 79, 'Systems Development'),
('48488652', 'ZASPA, DEXTER', '20172018-1', 80, 78, 75, 75, 86, 75, 75, 78, 83, 90, 98, 75, 89, 80, 78, 77, 83, 89, 90, 85, 'Research'),
('48488657', 'ORTIZ, MARIENEL', '20152016_2', 79, 84, 82, 93, 76, 75, 86, 75, 77, 84, 97, 77, 94, 82, 77, 95, 83, 83, 85, 89, 'Systems Development'),
('48488661', 'NGOHO, DANIEL JOSHUA', '20182019_2', 81, 81, 76, 96, 87, 75, 78, 78, 79, 99, 93, 75, 98, 84, 77, 94, 87, 82, 90, 84, 'Research'),
('48488697', 'NARTE, KENJI', '20152016_2', 85, 76, 77, 97, 98, 75, 84, 78, 83, 94, 95, 83, 98, 83, 80, 75, 81, 85, 98, 77, 'Research'),
('48488703', 'CAIÑA, JOHN PAUL', '20162017_2', 78, 82, 75, 86, 91, 75, 90, 78, 75, 88, 84, 81, 96, 81, 79, 75, 76, 98, 91, 89, 'Research'),
('48488752', 'NOCEDA, DAINA LOUISE GILLYN', '20152016_2', 90, 85, 82, 79, 90, 78, 87, 75, 80, 76, 98, 82, 99, 87, 79, 93, 86, 78, 84, 98, 'Systems Development'),
('48488762', 'LEGASPI, HIPOLITO, JR.', '20162017_2', 95, 81, 81, 78, 80, 79, 78, 78, 75, 97, 86, 83, 88, 79, 79, 83, 75, 82, 81, 81, 'Technical Support'),
('48488788', 'LUMAPAS, REYNALDO, JR.', '20152016_2', 76, 85, 83, 80, 88, 79, 93, 79, 82, 92, 81, 85, 76, 82, 83, 75, 82, 87, 79, 75, 'Research'),
('48488812', 'GIRAY, CASSELYN', '20152016_2', 83, 85, 77, 92, 91, 75, 88, 75, 81, 97, 95, 83, 82, 82, 77, 91, 94, 78, 84, 84, 'Business Operations'),
('48488878', 'MONTEROLA, MICHAEL DAVE', '20162017_2', 94, 83, 81, 95, 88, 79, 78, 75, 76, 77, 81, 83, 86, 78, 78, 79, 99, 79, 75, 82, 'Systems Development'),
('48488880', 'BUMANLAG, MALCOLM KENNETH', '20172018_2', 78, 77, 81, 86, 77, 75, 82, 75, 84, 83, 94, 81, 75, 85, 82, 92, 87, 83, 94, 91, 'Research'),
('48488885', 'ARQUIOLA, JAIY', '20152016_2', 80, 81, 79, 78, 91, 75, 88, 75, 78, 91, 95, 77, 87, 80, 76, 92, 97, 98, 79, 82, 'Research'),
('48488892', 'GONZAGA, MARY ANN', '20172018_2', 88, 85, 75, 94, 86, 78, 83, 81, 79, 94, 88, 75, 83, 82, 77, 93, 85, 91, 94, 90, 'Research'),
('48488949', 'DESCALSOTA, ROBBY JAYCE', '20172018_2', 84, 78, 82, 89, 96, 75, 78, 79, 83, 80, 91, 75, 97, 83, 80, 96, 83, 87, 80, 83, 'Systems Development'),
('48488975', 'ROSARIO, ZITA MAE', '20162017_2', 93, 83, 75, 98, 97, 75, 80, 76, 80, 90, 84, 79, 91, 79, 80, 93, 97, 92, 81, 76, 'Systems Development'),
('48488976', 'GONZAGA, JEREMIAH', '20172018_2', 76, 76, 75, 77, 88, 75, 84, 75, 76, 77, 95, 80, 90, 76, 75, 78, 90, 93, 90, 86, 'Research'),
('48488977', 'TIYANES, SHEILA MARIE', '20162017_2', 87, 75, 75, 88, 77, 75, 83, 75, 76, 99, 89, 81, 90, 78, 75, 80, 82, 75, 83, 78, 'Business Operations'),
('48489058', 'CAHARIAN, CESAR NIKKO III', '20162017_2', 91, 80, 87, 99, 75, 76, 80, 76, 75, 77, 85, 84, 94, 79, 80, 81, 80, 96, 77, 85, 'Systems Development'),
('48489140', 'AHMAD, ALI', '20152016_2', 85, 80, 80, 89, 82, 75, 85, 75, 84, 75, 83, 83, 92, 81, 75, 95, 76, 87, 92, 84, 'Systems Development'),
('48489235', 'OÑEZ, KIMBERLEE ANNE', '20152016_2', 80, 85, 82, 91, 89, 77, 90, 80, 83, 85, 97, 76, 80, 83, 81, 92, 83, 94, 77, 92, 'Business Operations'),
('48489340', 'ASTILLA, CARL LORENZ', '20182019_1', 77, 85, 77, 75, 84, 78, 82, 82, 84, 79, 91, 78, 89, 82, 79, 81, 94, 75, 97, 96, 'Business Operations'),
('48489391', 'OLINDO, HOMER ALEXIS', '20152016_2', 85, 76, 80, 78, 75, 75, 90, 75, 77, 90, 98, 84, 83, 84, 85, 76, 78, 97, 89, 94, 'Technical Support'),
('48489450', 'ROCITA, JOHN RAYL', '20162017_2', 80, 81, 76, 78, 98, 75, 83, 76, 77, 78, 79, 79, 80, 80, 86, 78, 76, 92, 96, 87, 'Technical Support'),
('48489512', 'YOUNG, MARK SHARWIN', '20152016_2', 80, 90, 89, 79, 90, 79, 94, 75, 87, 75, 93, 87, 94, 84, 82, 99, 96, 94, 88, 89, 'Systems Development'),
('48489517', 'BUSCATO, MICHAEL JHON', '20162017_2', 77, 75, 75, 87, 75, 77, 83, 76, 76, 90, 85, 80, 88, 83, 75, 77, 90, 92, 79, 96, 'Business Operations'),
('48489585', 'CALAPE, DANMARK', '20152016_2', 84, 80, 76, 81, 93, 75, 83, 75, 82, 92, 93, 77, 99, 84, 86, 84, 89, 83, 99, 82, 'Research'),
('48489623', 'PENORIA, MEG', '20152016_2', 85, 92, 84, 82, 99, 81, 91, 80, 88, 75, 90, 88, 90, 88, 91, 79, 95, 83, 86, 77, 'Systems Development'),
('48489626', 'EBARDO, MYAMAR', '20172018-1', 80, 78, 77, 95, 97, 75, 75, 75, 82, 88, 88, 80, 76, 75, 77, 97, 89, 89, 75, 88, 'Business Operations'),
('48489628', 'SANICO, CAMILLE', '20182019_2', 85, 86, 79, 92, 96, 75, 78, 75, 77, 94, 98, 79, 88, 81, 81, 77, 80, 90, 83, 83, 'Technical Support'),
('48489673', 'CASILDO, REGGIE', '20162017_2', 75, 75, 75, 80, 75, 75, 83, 75, 81, 94, 90, 79, 86, 82, 75, 75, 93, 90, 83, 98, 'Business Operations'),
('48489701', 'LIM, SULIMAR', '20152016_2', 77, 80, 75, 95, 92, 75, 83, 75, 80, 84, 87, 82, 80, 82, 82, 84, 97, 97, 83, 97, 'Technical Support'),
('48489782', 'ZAMORA, MILDRED', '20152016_2', 89, 92, 85, 83, 91, 80, 89, 80, 90, 76, 93, 78, 92, 90, 84, 96, 80, 78, 88, 78, 'Systems Development'),
('48489814', 'OAMIL, MARC PAUL ELDRIN', '20162017_2', 75, 82, 75, 83, 76, 75, 75, 75, 85, 95, 87, 80, 79, 79, 78, 80, 77, 97, 93, 98, 'Business Operations'),
('48489874', 'PACATANG, JEREMIAH', '20162017_1', 76, 76, 78, 76, 83, 75, 84, 75, 82, 87, 85, 82, 79, 81, 79, 99, 78, 87, 94, 98, 'Business Operations'),
('48490001', 'LUCEÑO, LOU CEDDAR', '20152016_2', 78, 81, 75, 98, 96, 75, 80, 75, 77, 94, 85, 78, 79, 79, 78, 96, 91, 81, 87, 87, 'Business Operations'),
('48490061', 'AMORING, SAINT ELENOLD', '20162017_2', 83, 81, 80, 81, 87, 75, 80, 80, 94, 89, 82, 75, 83, 87, 85, 91, 80, 90, 83, 90, 'Business Operations'),
('48490077', 'GAMBONG, DIANNE', '20172018-1', 79, 83, 75, 95, 84, 75, 82, 75, 75, 90, 97, 75, 84, 83, 78, 77, 81, 99, 86, 80, 'Research'),
('48490091', 'SARIO, DAVEANCHIEN', '20152016_2', 92, 87, 87, 96, 99, 75, 85, 79, 88, 90, 88, 79, 82, 83, 83, 80, 90, 85, 84, 77, 'Systems Development'),
('48490119', 'HINLOG, RAYMUND', '20152016_2', 79, 81, 77, 81, 98, 75, 92, 75, 82, 92, 86, 82, 92, 80, 75, 78, 85, 80, 77, 82, 'Business Operations'),
('48490122', 'LUNETA, GERALD DAVE', '20152016_2', 80, 87, 80, 93, 88, 80, 83, 80, 90, 92, 91, 75, 96, 82, 79, 90, 83, 75, 89, 75, 'Research'),
('48490154', 'DACILLO, RANELLA ESTER', '20152016_2', 81, 82, 76, 94, 81, 76, 89, 78, 80, 81, 95, 77, 87, 83, 79, 75, 89, 93, 79, 81, 'Systems Development'),
('48490157', 'GEMENTIZA, JOHN PAUL ', '20162017_2', 80, 80, 79, 93, 89, 75, 79, 75, 75, 90, 91, 82, 94, 75, 75, 94, 85, 86, 91, 97, 'Business Operations'),
('48490195', 'DABALOS, EVA JEAN', '20182019_1', 81, 79, 75, 86, 94, 75, 81, 75, 87, 78, 96, 75, 85, 80, 78, 88, 91, 82, 95, 75, 'Research'),
('48490270', 'MUKARA, KRISTIAN ', '20222023_2', 66, 79, 81, 76, 80, 81, 78, 82, 75, 95, 86, 82, 91, 76, 82, 85, 93, 98, 78, 84, 'Research'),
('48490278', 'SAJONIA, HERALD', '20172018_2', 78, 84, 75, 76, 77, 75, 81, 79, 81, 78, 94, 75, 75, 75, 80, 80, 87, 80, 81, 88, 'Technical Support'),
('48490414', 'LARDERA, JASPER JOHN', '20172018-1', 75, 75, 75, 85, 81, 77, 76, 77, 75, 82, 92, 80, 79, 75, 83, 87, 77, 89, 81, 94, 'Technical Support'),
('48490497', 'ALIH, BERNARD JAYSON', '20172018_2', 88, 80, 76, 91, 91, 75, 82, 75, 85, 93, 96, 83, 90, 80, 86, 98, 75, 80, 84, 97, 'Business Operations'),
('48490531', 'RACOSALEM, KING ARTHUR VEL', '20172018-1', 83, 75, 75, 81, 95, 75, 82, 75, 83, 99, 99, 77, 98, 89, 77, 93, 90, 87, 87, 99, 'Business Operations'),
('48490776', 'MANAGAD, JAMES RONALD', '20142015_2', 86, 80, 84, 93, 98, 94, 88, 75, 82, 76, 86, 80, 91, 82, 88, 83, 99, 77, 86, 82, 'Systems Development'),
('48490807', 'DACUNO, ANGEL', '20162017_2', 80, 77, 75, 94, 89, 77, 85, 75, 75, 83, 83, 79, 76, 80, 77, 75, 82, 99, 77, 96, 'Business Operations'),
('48490808', 'TESADO, RYAN', '20162017_2', 78, 82, 75, 81, 78, 76, 84, 79, 92, 80, 93, 79, 84, 79, 75, 82, 99, 94, 87, 85, 'Research'),
('48490926', 'BARCELONA, BENZ ALRIC', '20182019_1', 83, 75, 78, 83, 89, 75, 79, 75, 85, 98, 91, 78, 89, 83, 82, 88, 75, 88, 99, 99, 'Business Operations'),
('48491028', 'ALCOVERES, JOEL JR.', '20162017_2', 76, 79, 75, 97, 90, 75, 84, 75, 82, 89, 89, 76, 91, 85, 78, 82, 75, 91, 84, 75, 'Research'),
('48491077', 'LOPEZ, ERNESTO II', '20172018_2', 92, 81, 77, 86, 94, 75, 75, 76, 82, 78, 93, 76, 76, 83, 77, 83, 80, 93, 85, 86, 'Technical Support'),
('48491228', 'AVILA, JON ELMER DHAN', '20182019_2', 75, 81, 75, 80, 75, 75, 77, 75, 87, 82, 85, 75, 83, 80, 85, 99, 88, 80, 77, 83, 'Business Operations'),
('48491261', 'VALENCIA, JEFFREY', '20162017_2', 92, 83, 92, 79, 79, 75, 78, 78, 91, 97, 83, 80, 97, 75, 79, 99, 76, 82, 82, 91, 'Business Operations'),
('48491429', 'LAO, ROY JONATHAN', '20162017_2', 82, 89, 76, 77, 92, 75, 81, 75, 75, 77, 94, 80, 98, 81, 75, 77, 78, 99, 79, 89, 'Systems Development'),
('48491431', 'BUENAVISTA, ARGIE', '20162017_2', 86, 91, 79, 84, 80, 76, 86, 75, 75, 81, 92, 86, 93, 81, 78, 77, 88, 80, 86, 86, 'Systems Development'),
('48491454', 'PADAYAO, JARVIS', '20162017_2', 91, 90, 83, 76, 85, 79, 82, 78, 78, 88, 85, 86, 89, 81, 83, 87, 79, 77, 80, 97, 'Business Operations'),
('48491539', 'SUMALINOG, CARLO', '20162017_2', 87, 91, 77, 94, 80, 75, 83, 75, 75, 83, 84, 82, 97, 82, 81, 83, 96, 85, 75, 75, 'Systems Development'),
('48491541', 'GOMEZ, KURT', '20162017_2', 83, 91, 75, 81, 79, 75, 81, 77, 81, 98, 89, 80, 89, 75, 78, 96, 98, 78, 86, 87, 'Business Operations'),
('48491569', 'CAPIDOS, GLORDEL', '20162017_2', 84, 93, 82, 96, 75, 75, 86, 75, 78, 98, 90, 83, 86, 83, 78, 99, 87, 91, 84, 91, 'Business Operations'),
('48491581', 'HUERTAS, LOIS JOYCE', '20162017_2', 93, 94, 86, 87, 86, 80, 86, 80, 83, 99, 93, 87, 90, 87, 83, 90, 99, 75, 93, 92, 'Business Operations'),
('48491620', 'GONZALES, ISOBELLE KREIS', '20172018-1', 81, 87, 75, 95, 77, 76, 85, 78, 79, 89, 97, 75, 87, 86, 77, 91, 90, 90, 84, 97, 'Business Operations'),
('48491637', 'DAHUNOG, RENZO', '20162017_2', 88, 93, 87, 96, 80, 81, 87, 82, 82, 79, 93, 88, 89, 85, 86, 93, 79, 93, 77, 85, 'Systems Development'),
('48491684', 'PASTORIN, JASPER ADRIAN', '20172018_2', 83, 81, 78, 92, 78, 76, 80, 77, 84, 93, 94, 75, 86, 80, 82, 83, 75, 93, 79, 78, 'Research'),
('48491723', 'REJABA, JOHNFRITS', '20162017_2', 90, 95, 87, 82, 85, 81, 83, 83, 75, 78, 89, 84, 85, 82, 83, 77, 82, 75, 89, 75, 'Systems Development'),
('48491804', 'SIMILATAN, SYNDY', '20162017_2', 80, 87, 79, 78, 92, 75, 86, 75, 78, 83, 94, 86, 93, 82, 79, 79, 90, 81, 93, 91, 'Technical Support'),
('48491886', 'FEROLINO, MELVIN JAMES', '20182019_1', 76, 77, 76, 75, 93, 76, 81, 75, 95, 85, 91, 79, 77, 79, 79, 89, 76, 90, 89, 82, 'Research'),
('48492042', 'TUNOD, DANNICA MAE', '20182019_2', 87, 78, 80, 98, 97, 75, 80, 81, 89, 76, 98, 84, 94, 81, 76, 80, 98, 89, 78, 86, 'Systems Development'),
('48492170', 'SALVAÑA, JADE ARCHIE', '20172018-1', 82, 76, 78, 90, 89, 80, 77, 75, 76, 94, 95, 75, 88, 77, 76, 96, 94, 80, 98, 76, 'Research'),
('48492174', 'VARGAS, EDWIN JR.', '20162017_2', 94, 82, 82, 76, 96, 76, 86, 75, 75, 81, 84, 81, 82, 83, 80, 83, 96, 83, 83, 90, 'Systems Development'),
('48492182', 'AMANCIO, FELLAINE ANDREA', '20162017_2', 86, 75, 78, 94, 95, 75, 85, 75, 77, 88, 87, 83, 85, 80, 78, 82, 93, 94, 79, 94, 'Business Operations'),
('48492264', 'MONTA, EMMANUEL JOSHUA', '20162017_3', 81, 88, 79, 88, 95, 78, 75, 76, 88, 85, 89, 80, 91, 81, 81, 85, 90, 90, 82, 90, 'Business Operations'),
('48492411', 'TOÑACAO, FERNAND KARL', '20172018-1', 85, 76, 75, 84, 87, 80, 81, 78, 78, 83, 95, 75, 95, 81, 75, 76, 94, 91, 84, 79, 'Technical Support'),
('48492483', 'PABILAN, SHAIRA MAE', '20182019_1', 87, 75, 82, 93, 88, 75, 81, 77, 79, 76, 90, 80, 83, 79, 81, 83, 90, 82, 86, 80, 'Technical Support'),
('48492556', 'ALCANTARA, LOUISE ANTOINE', '20172018-1', 86, 79, 76, 91, 79, 75, 85, 75, 80, 99, 93, 75, 95, 80, 80, 95, 95, 92, 90, 92, 'Business Operations'),
('48492665', 'TAN, KENNY CLINT', '20172018_2', 89, 80, 81, 95, 85, 77, 80, 75, 81, 84, 93, 75, 94, 77, 76, 96, 99, 87, 90, 96, 'Systems Development'),
('48492693', 'CASTILLO, JHON REX', '20182019_2', 79, 79, 80, 80, 95, 75, 77, 75, 80, 91, 88, 75, 91, 85, 77, 85, 89, 85, 94, 82, 'Research'),
('48492821', 'IBARRA, CHRISTIAN JAY', '20172018-1', 80, 82, 82, 81, 82, 78, 83, 75, 77, 95, 94, 77, 85, 79, 80, 88, 79, 94, 84, 94, 'Business Operations'),
('48492995', 'LACANG, WARREN', '20182019_1', 88, 86, 80, 76, 79, 81, 87, 78, 83, 81, 96, 81, 75, 94, 87, 78, 78, 77, 79, 90, 'Technical Support'),
('48493051', 'NONES, RIANNE', '20162017_2', 91, 89, 83, 99, 94, 75, 85, 76, 77, 95, 89, 83, 99, 75, 81, 89, 96, 98, 78, 83, 'Systems Development'),
('48493057', 'TIZON, RENATO, JR.', '20162017_2', 90, 80, 79, 94, 88, 75, 83, 75, 75, 87, 90, 82, 82, 78, 81, 96, 76, 99, 86, 87, 'Research'),
('48493060', 'EROJA, FRANCES DENNIS', '20182019_2', 77, 81, 75, 91, 91, 75, 75, 75, 78, 77, 89, 75, 91, 83, 75, 86, 90, 85, 93, 93, 'Systems Development'),
('48493098', 'BANOSAN, NADYNE', '20172018_2', 78, 86, 75, 77, 97, 75, 76, 75, 75, 96, 95, 81, 81, 75, 75, 80, 80, 92, 75, 95, 'Business Operations'),
('48493099', 'ALDEA, MARIA RAIKA', '20162017_2', 89, 90, 79, 98, 99, 75, 82, 75, 75, 94, 87, 81, 82, 80, 80, 87, 98, 77, 77, 80, 'Technical Support'),
('48493240', 'DOGUILES, GIMELLE JOY', '20162017_2', 88, 92, 79, 97, 94, 75, 84, 76, 80, 98, 85, 83, 81, 75, 79, 87, 91, 79, 84, 97, 'Business Operations'),
('48493521', 'DALIGDIG, KRISTOFFER', '20172018-1', 77, 77, 77, 75, 88, 75, 82, 77, 76, 98, 91, 75, 77, 81, 77, 81, 89, 96, 77, 90, 'Business Operations'),
('48493638', 'MALIC, JOPALI', '20172018_2', 83, 75, 75, 90, 84, 75, 79, 78, 86, 96, 93, 75, 82, 76, 80, 88, 79, 83, 85, 81, 'Business Operations'),
('48493647', 'GUERZON, CHARYS', '20162017_2', 83, 75, 79, 87, 95, 75, 83, 82, 75, 97, 89, 83, 82, 85, 79, 94, 81, 81, 97, 99, 'Business Operations'),
('48493663', 'PELAYRE, LOUIE JAY', '20172018-1', 76, 78, 75, 79, 96, 78, 80, 77, 75, 82, 90, 75, 90, 78, 78, 95, 78, 76, 84, 77, 'Systems Development'),
('48493670', 'SIONG, KENT PRIME', '20182019_1', 82, 82, 82, 94, 97, 81, 86, 75, 80, 76, 97, 75, 89, 87, 82, 98, 93, 77, 98, 85, 'Technical Support'),
('48493689', 'ACAPULCO, JOHANNES JAN', '20162017_2', 89, 98, 87, 95, 79, 77, 83, 84, 84, 79, 87, 84, 84, 90, 85, 97, 88, 98, 92, 94, 'Systems Development'),
('48493739', 'TIANCHON, KINNETH', '20162017_2', 83, 75, 78, 86, 88, 75, 78, 76, 75, 85, 83, 83, 94, 76, 76, 92, 89, 98, 87, 99, 'Business Operations'),
('48493807', 'PIQUERO, GERALD', '20172018-1', 93, 84, 75, 76, 96, 76, 83, 77, 77, 96, 96, 77, 95, 78, 77, 86, 81, 77, 98, 83, 'Research'),
('48493811', 'ANISLAGON, REDEEMER', '20192020_2', 97, 81, 84, 76, 93, 75, 84, 75, 86, 94, 95, 91, 79, 77, 76, 79, 90, 88, 95, 88, 'Research'),
('48493834', 'LAVARIÑO, GERARD OLIVER', '20182019_2', 83, 75, 77, 86, 91, 75, 77, 79, 80, 78, 94, 75, 81, 81, 79, 90, 98, 80, 91, 92, 'Business Operations'),
('48493923', 'TIONGSON, STEPHANIE', '20162017_2', 86, 75, 75, 94, 89, 75, 83, 75, 75, 85, 89, 80, 78, 75, 76, 81, 80, 77, 87, 88, 'Business Operations'),
('48493934', 'YBAÑEZ, MARIANNE', '20182019_1', 78, 77, 75, 89, 75, 76, 80, 75, 75, 96, 88, 75, 89, 77, 75, 99, 79, 92, 97, 96, 'Research'),
('48493982', 'PELEGRINO, JULIUS GLOA', '20172018_2', 83, 75, 79, 78, 84, 78, 75, 78, 84, 81, 96, 75, 78, 81, 75, 81, 89, 81, 88, 88, 'Business Operations'),
('48494031', 'JIMENEZ, ALJON', '20172018-1', 84, 79, 76, 90, 99, 79, 81, 75, 84, 82, 92, 75, 84, 79, 81, 94, 96, 81, 97, 76, 'Research'),
('48494159', 'LOMOLJO, MARISOL', '20182019_1', 80, 78, 76, 91, 90, 77, 79, 75, 80, 80, 95, 75, 97, 91, 80, 77, 99, 77, 94, 77, 'Technical Support'),
('48494351', 'BATISLAON, JOMARIE', '20182019_2', 84, 76, 81, 78, 99, 75, 75, 75, 78, 86, 90, 75, 92, 75, 80, 85, 90, 80, 92, 90, 'Business Operations'),
('48494461', 'ABDURAJAK, ADZMIL', '20182019_2', 75, 76, 78, 89, 82, 75, 80, 80, 80, 77, 92, 82, 80, 79, 75, 81, 86, 79, 91, 96, 'Business Operations'),
('48494545', 'AMPONG, RANULFO, JR.', '20182019_1', 75, 79, 78, 79, 83, 75, 78, 75, 83, 90, 92, 75, 98, 76, 75, 96, 93, 99, 88, 78, 'Research'),
('48494550', 'SUAYBAGUIO, JUNELLE', '20172018_2', 90, 75, 82, 89, 93, 79, 75, 76, 83, 75, 93, 78, 89, 83, 75, 81, 84, 97, 84, 77, 'Systems Development'),
('48494555', 'DOY, CHERRY JOY ', '20172018-1', 76, 83, 77, 79, 84, 75, 80, 75, 77, 97, 81, 75, 78, 80, 75, 81, 83, 77, 75, 95, 'Business Operations'),
('48494582', 'DOMINGO, MICHAEL ANGELO', '20202021_1', 75, 82, 75, 80, 89, 75, 75, 75, 75, 82, 89, 88, 84, 63, 75, 97, 89, 84, 79, 83, 'Research'),
('48494692', 'ARANGURIN, DAN VINCENT', '20162017_2', 83, 76, 79, 81, 94, 75, 80, 75, 83, 87, 91, 82, 78, 81, 82, 78, 94, 94, 94, 94, 'Research'),
('48494868', 'HOBAYAN, MIRIAM', '20182019_2', 81, 86, 75, 79, 97, 75, 79, 75, 78, 83, 96, 75, 75, 79, 79, 95, 98, 97, 80, 88, 'Research'),
('48494911', 'ABELIS, APRIL KATLYN MARIE', '20172018_2', 80, 79, 76, 90, 95, 75, 76, 75, 86, 87, 96, 75, 89, 83, 78, 79, 95, 89, 86, 88, 'Research'),
('48494968', 'LIGTAS, JOHN NIEL', '20172018_2', 88, 82, 82, 97, 80, 75, 80, 75, 87, 90, 87, 75, 81, 83, 76, 80, 92, 75, 99, 84, 'Research'),
('48495077', 'SOTTO, SID CESAR', '20182019_2', 89, 87, 75, 85, 81, 79, 79, 75, 75, 82, 90, 75, 98, 84, 80, 86, 94, 77, 84, 89, 'Systems Development'),
('48495234', 'PORIA, NELJONH ALESTER', '20172018-1', 80, 82, 75, 79, 85, 75, 80, 75, 86, 97, 85, 82, 86, 79, 77, 78, 87, 77, 89, 92, 'Business Operations'),
('48495326', 'POTESTAD, DAINICA JOY', '20182019_2', 81, 76, 77, 89, 84, 80, 79, 75, 76, 93, 80, 75, 78, 78, 81, 85, 96, 86, 99, 95, 'Research'),
('48495363', 'HERNAEZ, KRYSNER', '20172018_2', 80, 77, 76, 85, 84, 75, 81, 76, 86, 96, 93, 75, 93, 80, 77, 97, 77, 97, 96, 94, 'Research'),
('48495371', 'TAN, JEREMY SHAWN', '20172018_2', 81, 78, 78, 92, 95, 80, 85, 78, 83, 80, 93, 77, 79, 82, 80, 80, 98, 85, 89, 82, 'Research'),
('48495399', 'IRANON, RUBY ANNE', '20172018_2', 92, 87, 88, 93, 96, 84, 85, 77, 93, 86, 100, 82, 81, 89, 91, 77, 91, 93, 80, 85, 'Technical Support'),
('48495401', 'FLORES, JAYSON REY', '20182019_1', 81, 76, 75, 88, 85, 77, 84, 75, 80, 88, 89, 75, 93, 77, 86, 85, 99, 92, 85, 98, 'Business Operations'),
('48495429', 'TORINO, REYNALDO, JR.', '20172018_2', 75, 77, 79, 96, 91, 76, 83, 75, 86, 85, 98, 76, 95, 84, 80, 94, 77, 90, 82, 76, 'Technical Support'),
('48495461', 'ALONZO, ROGEL', '20172018_2', 77, 77, 85, 88, 85, 75, 83, 75, 84, 89, 100, 83, 78, 80, 81, 75, 98, 88, 87, 92, 'Business Operations'),
('48495468', 'CORITAO, ROLANDO, JR.', '20172018_2', 75, 79, 80, 78, 88, 76, 85, 77, 86, 89, 100, 75, 92, 81, 89, 96, 86, 81, 94, 75, 'Research'),
('48495528', 'DY, JOHN MARK', '20182019_2', 85, 82, 78, 75, 95, 79, 85, 75, 99, 96, 77, 75, 96, 84, 78, 92, 75, 85, 90, 92, 'Business Operations'),
('48495553', 'SAMIJON, DARWIN', '20182019_2', 80, 76, 76, 75, 94, 75, 75, 75, 90, 76, 89, 75, 79, 79, 75, 93, 95, 91, 84, 91, 'Business Operations'),
('48495565', 'CATAO, BAYANI, JR.', '20182019_2', 75, 83, 77, 98, 93, 75, 75, 75, 85, 88, 91, 75, 81, 84, 76, 98, 82, 76, 85, 93, 'Business Operations'),
('48495592', 'LUCEÑO, JHON LIEVE', '20172018_2', 75, 76, 83, 86, 99, 78, 83, 77, 84, 94, 97, 75, 76, 82, 83, 87, 76, 77, 87, 80, 'Technical Support'),
('48495645', 'AMATONG, PATRICK JASON', '20172018_2', 85, 81, 81, 91, 82, 80, 83, 77, 88, 94, 89, 75, 76, 84, 85, 81, 76, 79, 80, 84, 'Business Operations'),
('48495663', 'NAKILA, HANNIE FIELH', '20172018_2', 80, 77, 75, 82, 93, 75, 83, 75, 83, 92, 93, 77, 86, 81, 83, 92, 94, 99, 98, 76, 'Research'),
('48495683', 'FUENTES, JOSHUA NISSI', '20172018_2', 81, 77, 75, 93, 99, 75, 82, 75, 86, 98, 95, 75, 75, 80, 81, 85, 88, 98, 86, 90, 'Research'),
('48495720', 'CIRUNAY, JOHN LYNDON', '20182019_2', 82, 76, 76, 82, 89, 75, 76, 75, 75, 84, 83, 75, 95, 75, 76, 79, 96, 88, 82, 98, 'Business Operations'),
('48495811', 'JIMENEZ JR., JUSTIN LIBRADO', '20182019_1', 86, 79, 84, 82, 95, 76, 81, 75, 89, 81, 96, 75, 78, 84, 85, 81, 78, 90, 94, 88, 'Research'),
('48495839', 'BLASON, JOHN OLIVER', '20192020_2', 93, 90, 94, 91, 90, 77, 87, 79, 81, 76, 93, 88, 83, 97, 89, 80, 76, 89, 91, 82, 'Technical Support'),
('48495953', 'RANARIO, VEAH', '20172018_2', 77, 83, 79, 94, 97, 75, 83, 75, 88, 96, 93, 82, 86, 83, 82, 99, 94, 82, 77, 97, 'Business Operations'),
('48495961', 'CURACHA, MARJUN', '20172018_2', 80, 77, 75, 98, 96, 75, 83, 75, 88, 85, 92, 75, 86, 80, 81, 76, 98, 82, 88, 89, 'Business Operations'),
('48496020', 'BELTRAN, JOHN MICHAEL', '20172018_2', 90, 89, 86, 76, 90, 78, 85, 77, 88, 77, 90, 82, 78, 85, 87, 91, 87, 79, 98, 83, 'Technical Support'),
('48496130', 'DAGAMI, JOSHUA', '20182019_1', 75, 80, 76, 81, 99, 82, 81, 77, 82, 88, 90, 75, 98, 89, 86, 87, 81, 84, 93, 83, 'Technical Support'),
('48496171', 'GARINGO, ADONIS', '20182019_2', 76, 75, 76, 97, 76, 75, 77, 75, 77, 96, 92, 75, 89, 77, 75, 82, 89, 81, 83, 87, 'Business Operations'),
('48496191', 'ANG, DENISE STEPHANIE JOY', '20172018_2', 77, 77, 75, 77, 83, 75, 84, 76, 76, 85, 97, 75, 87, 82, 80, 88, 96, 91, 86, 95, 'Business Operations'),
('48496212', 'ENRIQUEZ, JENY', '20182019_1', 82, 82, 79, 98, 93, 79, 76, 75, 81, 87, 96, 75, 98, 91, 82, 78, 81, 84, 76, 96, 'Technical Support'),
('48496273', 'BEJEL, ALVIN KYLE', '20182019_2', 78, 87, 76, 83, 98, 76, 75, 76, 76, 88, 96, 85, 76, 86, 77, 76, 97, 90, 81, 95, 'Business Operations'),
('48496415', 'ANGCON, IAN ARVIN', '20182019_1', 75, 78, 75, 89, 99, 75, 80, 75, 76, 95, 97, 79, 95, 81, 79, 99, 96, 87, 94, 92, 'Research'),
('48496421', 'DIONIO, JUSTICE KARMELA ', '20182019_1', 79, 75, 75, 80, 81, 75, 79, 75, 79, 89, 96, 75, 77, 89, 75, 85, 95, 96, 81, 78, 'Technical Support'),
('48496493', 'PARDILLO, JOHN CALVIN', '20172018_2', 79, 80, 75, 86, 87, 76, 82, 77, 87, 93, 99, 83, 94, 81, 85, 79, 92, 89, 90, 85, 'Research');
INSERT INTO `past_data` (`id_number`, `student_name`, `year_graduated`, `CC 102`, `CC 103`, `PF 101`, `CC 104`, `IPT 101`, `IPT 102`, `CC 106`, `CC 105`, `IM 101`, `IM 102`, `HCI 101`, `HCI 102`, `WS 101`, `NET 101`, `NET 102`, `IAS 101`, `IAS 102`, `CAP 101`, `CAP 102`, `SP 101`, `OJT Placement`) VALUES
('48496504', 'ASTRONOMO, ARIANNE MAE', '20172018_2', 75, 75, 75, 90, 92, 75, 80, 75, 84, 79, 97, 75, 75, 80, 81, 92, 94, 77, 95, 78, 'Research'),
('48496509', 'DINAGAT, REYMON', '20172018_2', 83, 79, 85, 94, 84, 75, 83, 79, 83, 89, 90, 75, 77, 81, 84, 75, 91, 80, 92, 79, 'Research'),
('48496515', 'MABANGIS, LAILA FAITH', '20172018_2', 83, 81, 80, 86, 92, 75, 85, 77, 89, 75, 99, 79, 83, 84, 85, 75, 77, 87, 86, 95, 'Business Operations'),
('48496565', 'COLLANTES, KARL WINSTON', '20222023_2', 75, 77, 82, 93, 95, 78, 79, 71, 76, 98, 90, 94, 79, 94, 100, 62, 97, 84, 89, 99, 'Technical Support'),
('48496598', 'LAGATIERA, BYRON', '20182019_1', 77, 81, 76, 84, 80, 81, 75, 75, 77, 92, 80, 75, 95, 75, 80, 89, 98, 94, 87, 90, 'Research'),
('48496638', 'GUITGUITIN, ARVIE CLAIRE', '20182019_2', 81, 88, 75, 78, 77, 78, 79, 75, 80, 92, 95, 75, 98, 91, 82, 83, 97, 98, 94, 93, 'Research'),
('48496811', 'EMPREMIADO, KYN JUPILOU', '20182019_1', 75, 75, 75, 84, 94, 75, 87, 75, 76, 81, 96, 75, 95, 86, 80, 78, 82, 98, 75, 90, 'Technical Support'),
('48496893', 'DE LA CRUZ, PRAISEY', '20182019_1', 85, 87, 79, 75, 85, 79, 86, 75, 80, 93, 92, 80, 77, 91, 81, 93, 85, 75, 85, 76, 'Technical Support'),
('48496903', 'PELIGRO, RICA JAMIE ', '20182019_2', 78, 76, 75, 76, 99, 75, 75, 75, 80, 96, 98, 75, 94, 92, 76, 90, 91, 98, 87, 96, 'Business Operations'),
('48497057', 'TUASON, VIA MAE ', '20182019_1', 78, 75, 79, 76, 98, 75, 80, 76, 79, 85, 92, 75, 82, 83, 82, 94, 94, 95, 76, 91, 'Technical Support'),
('48497090', 'UY, MIKHAELLA RIAN', '20172018_2', 82, 78, 79, 92, 83, 77, 84, 75, 87, 75, 91, 78, 85, 81, 83, 84, 80, 82, 97, 89, 'Research'),
('48497286', 'GORRE, ANGELICA MAE', '20182019_1', 75, 75, 78, 99, 96, 78, 88, 77, 81, 85, 96, 78, 79, 87, 82, 75, 79, 98, 83, 84, 'Research'),
('48497311', 'CARREDO, FERNAN, JR.', '20192020_2', 77, 77, 78, 84, 85, 75, 75, 75, 81, 87, 93, 81, 84, 84, 76, 99, 86, 79, 81, 86, 'Business Operations'),
('48497340', 'DUCO, IVY', '20182019_1', 78, 75, 75, 76, 93, 79, 76, 76, 80, 77, 97, 77, 90, 89, 85, 87, 80, 90, 84, 77, 'Technical Support'),
('48497348', 'VARONA, JOMELVIC', '20192020_2', 77, 78, 85, 90, 82, 75, 79, 75, 94, 89, 96, 82, 78, 95, 83, 79, 82, 86, 94, 78, 'Research'),
('48497356', 'SANTIA, SHEEN', '20192020_2', 75, 75, 75, 91, 81, 75, 75, 75, 78, 95, 98, 80, 90, 83, 76, 87, 89, 90, 97, 93, 'Research'),
('48497368', 'ALIMES, LATRYLL', '20172018_2', 78, 77, 82, 77, 95, 75, 81, 78, 85, 75, 93, 78, 81, 81, 81, 78, 77, 89, 88, 81, 'Research'),
('48497410', 'MANATO, JAMES MARK', '20182019_1', 82, 83, 82, 98, 99, 79, 80, 75, 85, 80, 97, 75, 86, 86, 82, 97, 76, 81, 81, 89, 'Technical Support'),
('48497433', 'PEREZ, ASHLEY MAE', '20182019_1', 81, 77, 77, 83, 97, 78, 84, 75, 84, 75, 95, 78, 79, 91, 83, 98, 86, 85, 91, 89, 'Technical Support'),
('48497486', 'LINGAYEN, JIZA', '20172018_2', 79, 87, 85, 86, 87, 80, 85, 75, 87, 85, 90, 80, 97, 86, 86, 94, 87, 76, 90, 98, 'Business Operations'),
('48497597', 'PANTINOPLE, REZELLE', '20182019_2', 79, 77, 75, 94, 85, 75, 77, 75, 82, 86, 94, 75, 77, 75, 75, 95, 84, 84, 81, 83, 'Business Operations'),
('48497619', 'MONTINOLA, ALLEM', '20182019_1', 81, 82, 75, 78, 78, 75, 81, 75, 76, 84, 93, 80, 94, 86, 85, 93, 82, 99, 99, 96, 'Research'),
('48497660', 'DOLOGUIN, HERNAND JAY', '20182019_1', 77, 76, 75, 76, 87, 75, 79, 79, 84, 88, 99, 75, 94, 84, 81, 82, 79, 84, 96, 92, 'Research'),
('48497679', 'CAABAY, ABEL JOHN', '20172018_2', 89, 86, 79, 81, 90, 83, 84, 75, 91, 88, 88, 80, 91, 85, 87, 86, 96, 75, 81, 78, 'Business Operations'),
('48497736', 'CASILAD, IAN CARLO', '20172018_2', 98, 97, 75, 84, 89, 76, 78, 81, 86, 77, 96, 75, 78, 76, 79, 75, 78, 88, 91, 89, 'Systems Development'),
('48497747', 'JUAREZ, JAYFRED MARK', '20212022_2', 80, 64, 83, 75, 79, 88, 75, 75, 75, 90, 75, 80, 93, 80, 78, 81, 80, 89, 76, 89, 'Business Operations'),
('48497778', 'NONONG, MYLINE', '20172018_2', 90, 76, 75, 95, 90, 81, 84, 75, 79, 93, 96, 75, 90, 80, 78, 86, 85, 88, 77, 97, 'Business Operations'),
('48497790', 'SABATIN, ROBERT', '20172018_2', 83, 82, 82, 96, 76, 75, 82, 75, 82, 92, 99, 75, 96, 81, 82, 84, 94, 99, 93, 97, 'Research'),
('48497808', 'DOLOGUIN, LORRY ANN ', '20182019_2', 89, 92, 78, 85, 98, 75, 79, 75, 80, 85, 93, 86, 93, 83, 92, 97, 81, 94, 75, 97, 'Technical Support'),
('48497947', 'QUERIDO, LEONARD', '20182019_1', 81, 87, 80, 78, 90, 82, 80, 81, 75, 80, 96, 75, 77, 89, 84, 89, 89, 95, 94, 90, 'Technical Support'),
('48497951', 'PALELE, JOHN KYRO', '20172018_2', 89, 87, 86, 86, 99, 79, 83, 81, 87, 97, 88, 75, 83, 80, 87, 92, 95, 81, 86, 81, 'Business Operations'),
('48498073', 'ALIH, MARIA BERNADETTE', '20162017_2', 96, 88, 83, 76, 81, 75, 85, 76, 75, 83, 90, 82, 96, 75, 80, 77, 95, 92, 75, 87, 'Systems Development'),
('48498122', 'TUDAS, JEFFERSON', '20192020_2', 79, 81, 84, 79, 84, 77, 76, 75, 84, 82, 90, 75, 86, 91, 78, 99, 97, 80, 91, 87, 'Business Operations'),
('48498371', 'RIZON, ERVIN JR.', '20182019_2', 92, 80, 75, 93, 93, 75, 75, 75, 75, 80, 81, 75, 97, 75, 77, 91, 91, 93, 84, 77, 'Systems Development'),
('48498582', 'IBAO, JAYPEE BRIAN', '20172018_2', 85, 76, 84, 78, 88, 75, 85, 78, 82, 97, 100, 75, 81, 79, 80, 83, 80, 79, 79, 92, 'Business Operations'),
('48498681', 'TULOD, LOUISE REY ', '20182019_2', 79, 94, 76, 97, 89, 75, 81, 75, 75, 76, 93, 84, 98, 80, 80, 88, 94, 87, 98, 91, 'Systems Development'),
('48498711', 'CAUMBAN, JYNEEVIEVE', '20172018_2', 80, 75, 76, 91, 96, 76, 84, 75, 84, 97, 89, 78, 89, 80, 80, 99, 94, 91, 91, 91, 'Research'),
('48498723', 'NEBREJA, SEAN PAUL', '20182019_2', 78, 76, 81, 78, 90, 75, 78, 75, 82, 83, 91, 75, 92, 80, 80, 97, 81, 95, 95, 87, 'Research'),
('48498755', 'TUBIANO, JAMES', '20182019_1', 89, 75, 85, 84, 79, 78, 82, 82, 76, 79, 95, 85, 79, 82, 89, 90, 81, 89, 77, 81, 'Technical Support'),
('48498909', 'MAMA, ZAINER', '20222023_2', 83, 87, 80, 83, 83, 82, 82, 75, 75, 81, 75, 88, 75, 76, 84, 80, 86, 98, 75, 75, 'Technical Support'),
('48499130', 'SUMATRA, MAREE ELAIZA', '20182019_2', 86, 92, 88, 84, 97, 84, 87, 86, 95, 85, 99, 88, 88, 93, 87, 89, 91, 89, 93, 86, 'Technical Support'),
('48499195', 'DE CLARO, CHRISTIAN PAUL', '20182019_2', 84, 82, 81, 83, 82, 75, 77, 80, 80, 91, 95, 85, 97, 92, 83, 78, 80, 94, 91, 96, 'Research'),
('48499220', 'LARENO, MAY ANN', '20182019_2', 84, 92, 83, 97, 94, 80, 81, 76, 80, 88, 98, 80, 77, 90, 80, 82, 98, 78, 79, 84, 'Technical Support'),
('48499231', 'OLARTE, MELANIE', '20182019_2', 80, 90, 76, 91, 88, 75, 78, 75, 82, 82, 99, 79, 97, 86, 76, 88, 93, 78, 95, 90, 'Systems Development'),
('59614177', 'PELIGOR, LORENCE', '20182019_2', 79, 82, 76, 93, 95, 75, 81, 75, 81, 78, 96, 88, 93, 84, 77, 95, 98, 87, 91, 83, 'Technical Support'),
('59614181', 'BUSTILLO, HENDRIK', '20182019_2', 88, 87, 83, 95, 87, 77, 79, 75, 87, 85, 95, 86, 82, 93, 80, 99, 76, 85, 93, 83, 'Research'),
('59614183', 'ACURIN, JEFF', '20182019_2', 83, 80, 81, 77, 91, 75, 75, 75, 76, 92, 92, 75, 88, 87, 76, 92, 96, 98, 91, 97, 'Research'),
('59614188', 'MANGARON, ANGELIE', '20192020_2', 81, 75, 77, 75, 84, 76, 75, 75, 89, 84, 98, 75, 95, 86, 76, 90, 95, 87, 93, 90, 'Research'),
('59614246', 'CHAVEZ, ERNESTO, JR.', '20182019_2', 85, 84, 85, 88, 82, 79, 79, 80, 80, 97, 95, 85, 78, 89, 83, 77, 80, 92, 93, 90, 'Research'),
('59614272', 'DULOS, ZAMANTHA', '20182019_2', 89, 93, 87, 88, 79, 84, 86, 81, 91, 91, 99, 93, 83, 93, 85, 92, 85, 96, 82, 85, 'Research'),
('59614293', 'BANDOY, IVY JOY', '20192020_2', 82, 88, 76, 84, 80, 76, 75, 75, 76, 87, 98, 75, 89, 90, 78, 90, 79, 96, 95, 76, 'Research'),
('59614408', 'FELISCO, JANZEN', '20192020_1', 75, 75, 75, 93, 77, 75, 87, 75, 78, 75, 96, 76, 77, 81, 77, 88, 95, 94, 87, 79, 'Research'),
('59614426', 'SUMAMPONG, DAVE', '20182019_2', 75, 76, 75, 82, 88, 75, 75, 75, 82, 92, 96, 83, 92, 76, 77, 95, 90, 92, 94, 90, 'Research'),
('59614429', 'REYES, JR., REY', '20192020_2', 80, 79, 82, 82, 98, 75, 80, 75, 80, 80, 98, 84, 79, 92, 79, 93, 94, 76, 77, 99, 'Technical Support'),
('59614434', 'BALAGULAN, IAN JAY ', '20202021_3', 75, 75, 75, 91, 89, 75, 75, 75, 75, 93, 90, 75, 91, 88, 75, 93, 86, 88, 87, 81, 'Research'),
('59614449', 'SENIAGAN, KIM EVERLY', '20182019_2', 75, 83, 79, 97, 75, 77, 75, 76, 82, 92, 96, 82, 75, 85, 79, 94, 85, 79, 84, 80, 'Business Operations'),
('59614457', 'BARCELITA, JAN-ANDRE', '20202021_3', 75, 77, 75, 82, 84, 75, 75, 75, 78, 82, 91, 75, 89, 75, 77, 76, 81, 83, 83, 75, 'Technical Support'),
('59614468', 'SUMAGANG, MARY GRACE', '20182019_2', 75, 82, 80, 91, 92, 78, 75, 76, 83, 76, 89, 80, 79, 85, 79, 82, 86, 79, 96, 94, 'Business Operations'),
('59614494', 'REVILLA, ELLA', '20202021_2', 79, 75, 79, 75, 84, 77, 85, 75, 75, 75, 87, 83, 86, 78, 75, 82, 75, 89, 77, 75, 'Technical Support'),
('59614527', 'ROSALES, EDELBERT', '20192020_1', 83, 87, 83, 76, 84, 75, 78, 78, 80, 99, 94, 75, 96, 83, 77, 92, 81, 77, 83, 76, 'Business Operations'),
('59614535', 'REDILLAS, GLENN', '20192020_2', 84, 80, 82, 81, 86, 77, 85, 77, 80, 91, 92, 84, 83, 94, 80, 93, 98, 90, 89, 96, 'Technical Support'),
('59614557', 'CANDIDO, NEIL JAROD', '20212022_2', 76, 76, 78, 80, 79, 78, 79, 76, 85, 75, 90, 77, 75, 89, 87, 83, 99, 87, 90, 98, 'Business Operations'),
('59614570', 'MARGATE, ARTHEL JANE', '20182019_3', 75, 75, 79, 76, 94, 77, 78, 75, 83, 88, 94, 80, 83, 87, 78, 76, 93, 98, 89, 93, 'Research'),
('59614629', 'OLAPE, ADRIAN JEFFERSON', '20192020_2', 83, 82, 81, 82, 93, 75, 75, 75, 92, 79, 86, 82, 93, 83, 79, 92, 86, 83, 81, 75, 'Technical Support'),
('59614643', 'ESTRELLA, KRISTINE MAE', '20182019_2', 75, 84, 80, 80, 91, 78, 78, 76, 80, 90, 97, 83, 79, 89, 80, 78, 75, 79, 76, 84, 'Business Operations'),
('59614691', 'AUDITOR, ELLIZA', '20182019_2', 75, 84, 81, 95, 92, 76, 78, 76, 75, 95, 94, 80, 78, 86, 78, 87, 83, 88, 97, 85, 'Research'),
('59614706', 'BAGUIO, PIERRE CHRISTIAN', '20192020_1', 75, 76, 79, 88, 96, 75, 75, 75, 82, 89, 95, 76, 81, 83, 75, 78, 89, 79, 79, 82, 'Business Operations'),
('59614724', 'URSABIA, CRISA MAE', '20192020_2', 75, 75, 78, 80, 82, 75, 79, 75, 78, 84, 92, 76, 86, 77, 75, 85, 76, 76, 85, 76, 'Research'),
('59614756', 'AUXILLAN, JOHN ENRICO', '20192020_1', 78, 79, 80, 75, 93, 75, 75, 76, 85, 99, 95, 75, 79, 75, 76, 99, 79, 84, 81, 99, 'Business Operations'),
('59614779', 'MADERA, NEZA JANE', '20192020_1', 75, 78, 75, 88, 81, 75, 91, 75, 76, 79, 99, 76, 87, 82, 77, 98, 78, 75, 82, 91, 'Business Operations'),
('59614843', 'VILLASECA, CHRISTINE JOY', '20182019_2', 75, 84, 79, 75, 90, 75, 79, 75, 82, 90, 96, 78, 92, 81, 79, 94, 99, 78, 75, 80, 'Business Operations'),
('59614875', 'ESTALILLA, FROILAN RAY', '20182019_2', 82, 87, 82, 82, 94, 78, 85, 79, 82, 90, 99, 87, 80, 89, 82, 76, 92, 77, 75, 91, 'Business Operations'),
('59614879', 'CORDOVA, IAN REY', '20192020_1', 75, 80, 75, 83, 80, 75, 75, 75, 96, 97, 95, 75, 91, 78, 75, 87, 94, 98, 77, 87, 'Business Operations'),
('59614904', 'MERCADO, JOHN MARWELL', '20192020_2', 75, 77, 84, 85, 93, 75, 84, 75, 98, 93, 94, 83, 96, 86, 84, 86, 81, 75, 89, 89, 'Business Operations'),
('59614911', 'BANQUE, ARA', '20182019_2', 75, 80, 80, 94, 86, 75, 75, 77, 86, 97, 98, 75, 76, 91, 79, 80, 75, 90, 75, 78, 'Technical Support'),
('59614912', 'BETONIO, MARC ANDREW', '20182019_2', 75, 81, 76, 77, 75, 76, 78, 75, 78, 80, 96, 79, 80, 82, 77, 90, 77, 96, 90, 76, 'Research'),
('59614932', 'DESIERTO, JOHN MARK', '20192020_1', 75, 85, 78, 76, 75, 75, 79, 75, 81, 97, 94, 75, 92, 84, 76, 75, 95, 86, 96, 91, 'Research'),
('59614971', 'OJENDRAS, SHERAMIE', '20182019_2', 75, 85, 80, 77, 99, 76, 75, 75, 95, 78, 98, 75, 75, 91, 77, 94, 82, 78, 81, 94, 'Business Operations'),
('59615022', 'ALBARACIN, PATRICK JAY', '20182019_2', 75, 83, 79, 75, 87, 75, 78, 75, 75, 92, 94, 85, 90, 81, 75, 93, 98, 83, 82, 88, 'Business Operations'),
('59615034', 'MERCADO, JOHN PATRICK', '20192020_2', 79, 75, 75, 80, 75, 75, 75, 75, 79, 89, 97, 88, 76, 84, 82, 94, 75, 79, 88, 93, 'Business Operations'),
('59615075', 'TORRES, MARK ANGELO', '20192020_1', 76, 79, 76, 75, 89, 75, 75, 75, 83, 81, 98, 75, 88, 82, 75, 75, 85, 87, 79, 81, 'Research'),
('59615135', 'RENDON, MARK NODNER', '20192020_1', 75, 77, 75, 83, 91, 75, 77, 75, 79, 78, 98, 76, 80, 75, 75, 93, 82, 92, 88, 82, 'Research'),
('59615147', 'ANTIPUESTO, ALLEN RAVEN', '20182019_2', 83, 89, 89, 75, 82, 75, 75, 79, 80, 93, 93, 91, 82, 86, 80, 98, 79, 83, 82, 83, 'Business Operations'),
('59615160', 'ABERTE, GABRIEL TROY', '20182019_2', 78, 86, 81, 82, 93, 75, 81, 75, 80, 97, 91, 75, 98, 86, 78, 79, 93, 93, 84, 94, 'Business Operations'),
('59615197', 'GUZMAN, NOREJEN', '20182019_2', 79, 87, 77, 78, 84, 75, 82, 75, 78, 92, 91, 75, 96, 84, 77, 78, 98, 88, 77, 91, 'Business Operations'),
('59615234', 'SUMILI, HOLDEN JAY', '20182019_2', 75, 79, 75, 75, 86, 75, 75, 75, 98, 78, 97, 88, 83, 85, 78, 95, 94, 78, 91, 96, 'Business Operations'),
('59615284', 'PELIGRO, ROBBIE', '20192020_1', 77, 77, 82, 81, 86, 75, 79, 75, 82, 83, 93, 75, 82, 83, 75, 80, 84, 86, 79, 81, 'Research'),
('59615292', 'DEL CASTILLO, LORIE ANNE', '20182019_2', 80, 84, 81, 82, 82, 75, 79, 75, 80, 86, 95, 83, 90, 84, 76, 83, 88, 85, 79, 86, 'Business Operations'),
('59615301', 'DOLOIRAS, JUSTINE TOBITHE', '20182019_2', 79, 78, 77, 80, 90, 76, 75, 75, 86, 86, 94, 83, 97, 82, 76, 87, 87, 95, 75, 90, 'Business Operations'),
('59615309', 'LOZADA, WENDY', '20182019_2', 75, 83, 79, 75, 97, 75, 79, 75, 82, 98, 94, 79, 88, 81, 78, 86, 88, 96, 98, 85, 'Research'),
('59615321', 'LUI, LOUIGIE', '20182019_2', 90, 90, 85, 76, 80, 76, 77, 81, 89, 97, 97, 75, 85, 92, 81, 78, 89, 82, 87, 79, 'Research'),
('59615327', 'PINEDA, JOHN BENEDICT', '20192020_2', 75, 76, 75, 96, 94, 75, 79, 75, 80, 89, 93, 79, 86, 81, 76, 95, 80, 91, 94, 92, 'Research'),
('59615356', 'MACION, JOMEL', '20182019_2', 88, 87, 87, 79, 78, 84, 81, 78, 83, 95, 98, 86, 99, 93, 84, 75, 87, 76, 96, 95, 'Business Operations'),
('59615378', 'RABAJA, REX', '20182019_2', 78, 81, 79, 86, 85, 78, 81, 75, 80, 93, 90, 75, 91, 84, 77, 91, 83, 93, 75, 97, 'Business Operations'),
('59615385', 'TONZO, DENNIS JOHN', '20182019_2', 86, 86, 85, 87, 93, 75, 81, 75, 75, 82, 97, 88, 80, 83, 81, 99, 97, 86, 79, 97, 'Business Operations'),
('59615391', 'SANTOS, JUNRY', '20182019_2', 77, 86, 83, 80, 98, 78, 79, 77, 76, 93, 97, 85, 88, 94, 80, 88, 92, 78, 82, 94, 'Business Operations'),
('59615394', 'CABUG, JAYVEE', '20182019_2', 78, 80, 79, 75, 92, 78, 75, 75, 80, 85, 91, 75, 89, 87, 80, 77, 88, 91, 81, 76, 'Technical Support'),
('59615444', 'BAJAO, ALJOHN', '20192020_1', 75, 75, 77, 96, 98, 76, 77, 75, 79, 80, 92, 75, 86, 75, 75, 93, 85, 77, 81, 98, 'Business Operations'),
('59615481', 'BENARAO, MARIEL', '20182019_2', 79, 81, 78, 92, 90, 75, 77, 75, 82, 95, 91, 82, 91, 93, 82, 89, 97, 86, 76, 89, 'Technical Support'),
('59615528', 'ROSAUPAN, JOSHUA', '20182019_2', 80, 86, 82, 89, 75, 81, 81, 75, 80, 82, 95, 83, 95, 90, 84, 80, 82, 78, 93, 80, 'Technical Support'),
('59615545', 'BLASE, JOVVIC', '20182019_2', 75, 75, 80, 93, 91, 76, 80, 75, 80, 79, 95, 75, 83, 81, 75, 75, 82, 92, 83, 84, 'Research'),
('59615549', 'MOLINA, GER CHRISTIAN', '20182019_2', 76, 86, 77, 75, 84, 77, 81, 75, 80, 79, 92, 75, 89, 90, 77, 97, 94, 97, 82, 86, 'Research'),
('59615564', 'LOMA, JUNAVELLE', '20192020_1', 79, 84, 82, 86, 99, 77, 77, 77, 78, 84, 95, 75, 80, 91, 79, 78, 99, 80, 84, 76, 'Technical Support'),
('59615570', 'ESTELLOSO, GERIKO KENT', '20182019_2', 81, 86, 82, 80, 78, 77, 78, 80, 94, 81, 96, 75, 78, 89, 80, 82, 81, 76, 88, 99, 'Business Operations'),
('59615591', 'ALPUERTO, MAE ANGELICA', '20182019_2', 75, 85, 81, 80, 93, 78, 81, 75, 85, 99, 97, 75, 90, 89, 81, 75, 92, 85, 78, 90, 'Business Operations'),
('59615600', 'SUMULONG, MARK FRANCIS', '20182019_2', 81, 80, 79, 88, 89, 77, 76, 75, 81, 78, 88, 75, 97, 87, 80, 90, 99, 96, 96, 79, 'Technical Support'),
('59615620', 'BOLATETE, EARL', '20192020_2', 77, 75, 75, 79, 93, 75, 78, 75, 77, 96, 92, 76, 78, 82, 77, 82, 80, 95, 92, 94, 'Research'),
('59615659', 'BILIRAN, EARL', '20182019_2', 81, 88, 85, 95, 90, 77, 82, 81, 76, 99, 93, 75, 90, 91, 81, 92, 99, 88, 90, 91, 'Business Operations'),
('59615665', 'JUEVESANO, ZALDY MAR', '20182019_2', 79, 86, 82, 90, 78, 75, 79, 78, 77, 86, 97, 84, 87, 91, 80, 98, 79, 89, 87, 91, 'Technical Support'),
('59615675', 'BUGAY, NEÑA ROSE', '20192020_2', 77, 83, 79, 78, 77, 75, 76, 75, 85, 87, 94, 75, 91, 84, 76, 76, 93, 97, 77, 87, 'Research'),
('59615706', 'VALENZUELA, SERGEI RENE RIO', '20192020_2', 75, 80, 79, 80, 79, 78, 75, 77, 91, 78, 95, 81, 89, 80, 77, 91, 96, 77, 85, 95, 'Business Operations'),
('59615740', 'ALBITE, DENNIS KARL', '20232024_2', 82, 75, 85, 80, 77, 84, 75, 75, 87, 77, 85, 80, 94, 78, 81, 85, 85, 98, 75, 80, 'Technical Support'),
('59615764', 'BOQUIL, ALDREX JOHN', '20202021_1', 78, 79, 76, 80, 96, 75, 75, 75, 78, 97, 94, 88, 96, 86, 76, 97, 80, 97, 95, 82, 'Research'),
('59615833', 'LAMANILAO, GEM JASON', '20192020_2', 80, 85, 81, 80, 82, 75, 78, 75, 95, 78, 93, 82, 86, 86, 75, 90, 88, 96, 79, 83, 'Research'),
('59615845', 'DANDAL, JONMARI', '20182019_2', 90, 89, 86, 97, 79, 83, 85, 85, 88, 84, 98, 93, 80, 92, 86, 76, 87, 92, 82, 81, 'Systems Development'),
('59615859', 'ESCARTIN, JOSHUA CARLO', '20182019_2', 76, 81, 80, 91, 89, 81, 79, 77, 79, 87, 95, 88, 77, 87, 79, 93, 84, 87, 76, 90, 'Business Operations'),
('59615872', 'LANCHITA, VINCENT', '20212022_1', 77, 79, 86, 91, 85, 75, 78, 75, 91, 85, 96, 79, 94, 84, 78, 77, 81, 99, 89, 83, 'Research'),
('59615998', 'REBUTA, REYLAR', '20202021_2', 75, 80, 83, 88, 92, 75, 80, 75, 82, 86, 90, 80, 87, 80, 82, 91, 97, 94, 96, 98, 'Research'),
('59616104', 'TROPICO, ALJHON', '20192020_2', 77, 77, 80, 80, 95, 75, 75, 75, 94, 75, 93, 75, 83, 86, 75, 96, 77, 92, 88, 85, 'Research'),
('59616163', 'SANIEL, JON ALEC', '20192020_2', 75, 79, 75, 80, 87, 75, 81, 75, 95, 89, 93, 78, 85, 76, 75, 89, 99, 86, 90, 83, 'Research'),
('59616165', 'LOZANO, DANCEL JOY', '20182019_2', 85, 92, 88, 80, 97, 83, 84, 84, 92, 96, 96, 90, 75, 90, 87, 80, 81, 88, 84, 91, 'Business Operations'),
('59616220', 'JUANILLAS, CHRISTOPHER FLOYD', '20202021_3', 75, 81, 76, 93, 90, 75, 75, 75, 76, 99, 92, 75, 83, 86, 75, 91, 82, 84, 77, 98, 'Business Operations'),
('59616292', 'CUNANAN, JESSTHEL MAE', '20192020_1', 89, 75, 75, 91, 88, 75, 77, 79, 81, 99, 93, 75, 76, 85, 75, 88, 80, 90, 84, 75, 'Research'),
('59616351', 'VILLAFLOR, JERARD', '20182019_2', 91, 86, 79, 98, 88, 75, 75, 75, 85, 75, 97, 75, 82, 91, 79, 76, 77, 81, 86, 81, 'Technical Support'),
('59616358', 'GELLICA, JHON LLOYD', '20192020_2', 84, 84, 80, 85, 80, 80, 75, 75, 86, 80, 93, 85, 90, 85, 78, 79, 77, 86, 95, 98, 'Business Operations'),
('59616377', 'FRANCISCO, HAROLD KENT', '20192020_2', 85, 81, 79, 80, 78, 75, 75, 75, 89, 89, 88, 79, 95, 83, 77, 97, 98, 86, 90, 80, 'Research'),
('59616393', 'LORENZO, JOHN MAR', '20192020_1', 91, 90, 76, 85, 97, 77, 80, 75, 80, 84, 100, 76, 77, 85, 82, 76, 88, 78, 86, 84, 'Systems Development'),
('59616396', 'UGAY, SHEINA MAE', '20182019_2', 92, 82, 78, 89, 80, 75, 81, 76, 82, 84, 96, 75, 94, 83, 75, 82, 91, 88, 94, 92, 'Systems Development'),
('59616450', 'ABUDA, FERNANDO', '20182019_2', 85, 87, 80, 81, 85, 78, 78, 77, 81, 97, 99, 85, 79, 86, 80, 75, 83, 97, 98, 98, 'Research'),
('59616465', 'ONGCOY, ANABELLE', '20182019_2', 86, 82, 76, 91, 85, 75, 81, 75, 76, 96, 88, 75, 96, 85, 77, 85, 95, 96, 84, 92, 'Research'),
('59616483', 'PILOTON, DAVEN JAY', '20182019_2', 82, 85, 81, 86, 89, 77, 84, 77, 80, 92, 97, 85, 90, 89, 78, 95, 86, 78, 90, 86, 'Business Operations'),
('59616484', 'DARVIN, DARIO JR.', '20182019_1', 91, 75, 91, 97, 83, 75, 85, 79, 92, 92, 88, 75, 78, 75, 86, 78, 94, 78, 80, 90, 'Business Operations'),
('59616597', 'AVILA, CALVIN KYLE', '20182019_1', 76, 83, 80, 92, 76, 81, 84, 78, 80, 99, 92, 78, 79, 90, 80, 77, 91, 98, 77, 77, 'Research'),
('59616604', 'ABENION, RODNIE', '20172018_2', 97, 88, 87, 87, 91, 80, 83, 78, 86, 91, 91, 75, 82, 86, 90, 76, 95, 79, 96, 80, 'Research'),
('59616626', 'CUA, JAY MARK', '20192020_1', 81, 79, 86, 84, 94, 77, 76, 77, 80, 91, 98, 76, 85, 87, 76, 88, 75, 83, 91, 87, 'Research'),
('59616674', 'ALLOSO, DAPHNY JEE', '20192020_2', 75, 78, 81, 88, 76, 75, 82, 75, 79, 78, 90, 75, 93, 88, 78, 91, 94, 94, 96, 90, 'Technical Support'),
('59616745', 'OLIMBA, ROCEZENIE', '20172018_2', 95, 96, 77, 82, 78, 78, 82, 75, 83, 97, 91, 76, 75, 82, 75, 98, 86, 93, 84, 85, 'Research'),
('59616903', 'ALIPA, ASNALIAH', '20212022_2', 82, 68, 97, 85, 77, 91, 82, 77, 84, 80, 76, 90, 89, 82, 82, 87, 80, 87, 77, 95, 'Business Operations'),
('59616914', 'FUENTEVILLA, JESSA MARIE', '20182019_2', 87, 77, 75, 81, 90, 75, 78, 75, 75, 95, 93, 77, 76, 94, 76, 76, 87, 94, 95, 85, 'Research'),
('59617009', 'BUSTILLOS, FRANCIS RHOMAR', '20182019_2', 79, 92, 75, 76, 84, 75, 75, 75, 80, 78, 85, 75, 86, 83, 79, 94, 77, 90, 86, 78, 'Research'),
('59617111', 'MARTINITO, MARK GREGOR', '20222023_2', 86, 75, 95, 80, 85, 91, 78, 83, 75, 75, 84, 88, 91, 81, 85, 91, 94, 98, 75, 81, 'Technical Support'),
('59617115', 'CONSUEGRA, MARIAN GRACE', '20182019_2', 92, 85, 79, 77, 90, 75, 81, 76, 80, 75, 95, 75, 83, 93, 76, 86, 98, 82, 81, 94, 'Business Operations'),
('59617203', 'DIVA, KING AL JOHN', '20192020_2', 75, 75, 87, 80, 86, 75, 81, 75, 82, 85, 97, 83, 77, 92, 76, 87, 91, 82, 95, 90, 'Technical Support'),
('59617220', 'LASUTA, REUFEB', '20182019_2', 86, 96, 75, 79, 98, 75, 75, 76, 89, 82, 89, 85, 85, 94, 79, 78, 82, 78, 78, 82, 'Business Operations'),
('59617252', 'LEE, KEVIN RYAN', '20192020_2', 75, 77, 82, 82, 89, 75, 81, 75, 82, 89, 98, 82, 79, 85, 75, 79, 99, 80, 80, 83, 'Technical Support'),
('59617314', 'ESCOVILLA, REZEL', '20192020_2', 75, 81, 85, 82, 98, 75, 82, 78, 92, 76, 97, 77, 98, 87, 85, 90, 92, 90, 80, 75, 'Research'),
('59617318', 'LESIGUES, JAY', '20182019_2', 83, 80, 76, 78, 94, 75, 75, 75, 79, 75, 89, 75, 83, 75, 75, 96, 93, 89, 86, 95, 'Business Operations'),
('59617375', 'TORRES, GLENN MARC', '20182019_1', 90, 98, 75, 75, 75, 82, 75, 75, 87, 98, 87, 81, 94, 87, 76, 76, 75, 90, 91, 97, 'Business Operations'),
('59617432', 'ZAIDE, NORO DDIEN', '20172018_2', 90, 75, 80, 96, 88, 75, 83, 75, 87, 77, 93, 77, 86, 81, 82, 76, 87, 77, 94, 83, 'Systems Development'),
('59715221', 'CORIAS, GRAVEN NIEL', '20192020_2', 85, 91, 95, 93, 92, 82, 91, 84, 95, 76, 98, 89, 88, 97, 90, 95, 79, 87, 86, 75, 'Technical Support'),
('59715222', 'BANAC, RUEL', '20192020_2', 83, 94, 85, 85, 84, 77, 77, 77, 78, 83, 97, 90, 80, 87, 79, 77, 99, 88, 95, 92, 'Research'),
('59815259', 'LIM, CARINA ALIZA', '20192020_2', 80, 82, 85, 90, 79, 80, 83, 81, 91, 77, 90, 85, 91, 95, 83, 85, 87, 80, 76, 95, 'Technical Support'),
('59815319', 'INGENTE, GHIRLIE MAE', '20212022_2', 78, 75, 91, 75, 94, 91, 80, 75, 75, 75, 84, 79, 76, 84, 81, 81, 80, 88, 80, 90, 'Technical Support'),
('59815332', 'CORTEZ, CENDY JOY', '20212022_1', 75, 75, 84, 75, 80, 91, 78, 75, 75, 88, 75, 97, 99, 75, 75, 91, 76, 91, 78, 86, 'Research'),
('59815609', 'ATIS, JIMWEL II', '20192020_2', 83, 78, 77, 86, 87, 87, 81, 82, 77, 99, 87, 83, 81, 81, 78, 90, 79, 96, 83, 87, 'Research'),
('59815622', 'ODAN, CHRISTOPHER', '20192020_2', 77, 80, 85, 89, 89, 75, 79, 75, 86, 75, 95, 75, 79, 89, 77, 88, 95, 85, 89, 87, 'Research'),
('59815628', 'MAMUGAY, ARIEL JHON', '20192020_2', 85, 75, 99, 86, 80, 75, 76, 75, 75, 82, 89, 95, 99, 75, 75, 85, 75, 88, 81, 77, 'Systems Development'),
('59815634', 'IDOROT, MARK JOSE', '20192020_2', 93, 85, 89, 90, 97, 75, 78, 76, 95, 76, 94, 75, 86, 89, 79, 84, 93, 82, 89, 92, 'Business Operations'),
('59815663', 'OLAJAY, BRENMAR', '20212022_2', 75, 67, 89, 75, 75, 90, 75, 75, 75, 93, 79, 86, 93, 78, 77, 83, 80, 87, 75, 88, 'Business Operations'),
('59815799', 'FERNANDEZ, JOHN LOUIE', '20192020_2', 88, 77, 82, 83, 86, 76, 80, 79, 78, 76, 92, 87, 95, 83, 78, 85, 78, 88, 86, 83, 'Systems Development'),
('59815855', 'BUSTAMANTE, RAMON, JR.', '20192020_2', 78, 81, 86, 83, 76, 75, 86, 77, 82, 98, 94, 83, 92, 93, 85, 97, 83, 81, 82, 77, 'Technical Support'),
('59815858', 'VILLAMERO, GLENDYL JAY', '20212022_2', 86, 75, 77, 76, 80, 78, 75, 79, 75, 93, 80, 80, 97, 79, 76, 90, 76, 82, 75, 88, 'Business Operations'),
('59815897', 'LAWAS, LIAM', '20222023_2', 83, 75, 90, 78, 84, 86, 75, 82, 78, 94, 85, 85, 90, 78, 76, 76, 87, 77, 84, 81, 'Business Operations'),
('59815913', 'CALCEÑA, HARLEY JEFFERSON', '20232024_1', 89, 75, 84, 78, 78, 84, 80, 75, 82, 97, 84, 80, 90, 76, 87, 81, 79, 78, 75, 83, 'Business Operations'),
('59816051', 'GANLOY, LENIE', '20192020_2', 96, 78, 76, 80, 99, 80, 86, 75, 87, 79, 98, 75, 90, 92, 79, 97, 98, 76, 84, 82, 'Technical Support'),
('59816082', 'BALAGUER, JOHN CEDRICK', '20172018_2', 75, 84, 83, 87, 84, 81, 79, 76, 90, 89, 82, 79, 83, 82, 98, 93, 96, 93, 81, 97, 'Technical Support'),
('59816096', 'TAJALA, VANESSA', '20212022_2', 82, 75, 94, 85, 89, 78, 84, 76, 76, 97, 92, 78, 94, 83, 88, 92, 80, 91, 81, 95, 'Business Operations'),
('59816129', 'ZEQUERRA, JOSE MOHSE', '20192020_2', 82, 87, 87, 90, 96, 75, 84, 75, 89, 99, 97, 77, 76, 93, 80, 87, 83, 98, 76, 91, 'Business Operations'),
('59817425', 'PASCUA, VIC MARTIN', '20192020_3', 83, 84, 84, 80, 96, 81, 75, 75, 95, 80, 96, 75, 76, 84, 75, 82, 85, 92, 99, 88, 'Research'),
('59817476', 'VARONA, DIANA ROSE', '20212022_2', 83, 75, 88, 80, 88, 87, 85, 78, 85, 91, 87, 87, 91, 82, 86, 80, 88, 82, 84, 86, 'Technical Support'),
('59817479', 'LUCEÑO, JHON PAUL', '20212022_2', 85, 85, 91, 75, 86, 89, 88, 78, 89, 95, 91, 93, 87, 83, 89, 94, 94, 84, 91, 98, 'Business Operations'),
('59817512', 'MAPUTE, JOPET', '20222023_1', 82, 77, 89, 77, 88, 88, 87, 75, 84, 93, 89, 90, 90, 85, 87, 91, 84, 79, 78, 91, 'Business Operations'),
('59817601', 'ESTRADA, ABEGAIL', '20222023_2', 85, 75, 86, 75, 82, 89, 83, 82, 82, 84, 80, 93, 87, 78, 85, 88, 80, 98, 75, 81, 'Technical Support'),
('59817604', 'YUSON, KIZEN', '20222023_1', 85, 75, 83, 75, 87, 90, 89, 81, 89, 97, 90, 94, 90, 84, 88, 93, 95, 79, 78, 96, 'Business Operations'),
('59817611', 'LUYAO, MICO', '20212022_2', 80, 75, 87, 79, 87, 90, 85, 75, 88, 89, 86, 91, 93, 78, 86, 84, 87, 82, 80, 79, 'Technical Support'),
('59817721', 'DUGHO, JULIANNE MAE', '20212022_2', 75, 79, 85, 75, 84, 87, 75, 89, 84, 81, 85, 87, 91, 75, 85, 87, 85, 81, 77, 83, 'Business Operations'),
('59817724', 'PEREZ, JOAH CYRUS', '20212022_2', 83, 79, 90, 84, 78, 89, 89, 82, 91, 96, 91, 92, 88, 86, 88, 92, 93, 82, 89, 96, 'Business Operations'),
('59817725', 'VILLADORES, PATRICK JASON', '20212022_2', 85, 78, 90, 81, 88, 90, 90, 84, 89, 98, 93, 94, 90, 87, 90, 96, 87, 86, 91, 94, 'Business Operations'),
('59817748', 'PANTALLON, RALPH LAURENCE ', '20222023_2', 82, 75, 89, 80, 86, 89, 94, 75, 87, 96, 87, 91, 87, 82, 88, 90, 94, 98, 80, 84, 'Research'),
('59817769', 'NIEPES, JHON LLOYD', '20242025_2', 80, 75, 85, 92, 83, 78, 92, 77, 75, 89, 81, 93, 86, 79, 79, 88, 94, 81, 81, 84, 'Systems Development'),
('59817822', 'LOGRONIO, KENNETH', '20232024_2', 80, 75, 86, 75, 78, 80, 85, 76, 75, 92, 82, 77, 83, 75, 76, 86, 82, 87, 80, 92, 'Business Operations'),
('59817844', 'RAPERAP, SUSMHITA CLAIRE', '20212022_2', 84, 80, 86, 76, 87, 92, 90, 87, 85, 96, 91, 94, 91, 87, 82, 95, 95, 78, 87, 93, 'Business Operations'),
('59817850', 'BITANGCOL, MICHAEL JAN', '20222023_2', 85, 75, 85, 75, 82, 89, 85, 81, 75, 88, 81, 88, 91, 75, 85, 92, 87, 75, 75, 78, 'Technical Support'),
('59817863', 'LILOC, KENT JOHN', '20232024_2', 93, 89, 96, 94, 87, 88, 98, 81, 83, 95, 88, 93, 87, 96, 84, 91, 90, 93, 90, 93, 'Systems Development'),
('59817884', 'MATILLANO, HARVEY', '20232024_2', 82, 82, 81, 78, 79, 77, 85, 86, 75, 90, 79, 89, 84, 78, 80, 90, 92, 76, 75, 94, 'Business Operations'),
('59817951', 'Angco, Alan Jed', '20232024_2', 80, 86, 81, 75, 85, 86, 83, 75, 82, 90, 77, 75, 85, 79, 81, 78, 84, 76, 75, 92, 'Business Operations'),
('59817974', 'AMBA, BLEASSY FAYE', '20212022_2', 80, 83, 88, 85, 89, 99, 91, 86, 80, 96, 91, 95, 92, 88, 86, 95, 96, 84, 75, 94, 'Technical Support'),
('59817994', 'CABALES, THOM BERNARD', '20212022_2', 85, 86, 89, 75, 87, 91, 87, 76, 75, 93, 86, 90, 91, 81, 82, 95, 96, 88, 92, 85, 'Research'),
('59818024', 'PATILLA, ERICKA', '20212022_2', 80, 75, 86, 78, 82, 87, 86, 75, 87, 92, 83, 87, 88, 80, 84, 87, 90, 82, 84, 91, 'Business Operations'),
('59818055', 'WABINGGA, ALDRIN PAULO', '20222023_2', 75, 87, 83, 80, 80, 85, 83, 75, 75, 89, 84, 81, 90, 79, 75, 80, 78, 98, 80, 77, 'Research'),
('59818059', 'BULACO, RAYLAR J', '20222023_2', 85, 75, 88, 81, 82, 97, 83, 79, 76, 87, 85, 90, 84, 80, 86, 89, 92, 98, 75, 91, 'Technical Support'),
('59818130', 'BILLANES, CRISTIAN', '20222023_1', 80, 80, 89, 86, 84, 96, 90, 82, 77, 92, 88, 91, 87, 90, 84, 94, 93, 80, 90, 97, 'Business Operations'),
('59818185', 'NAMOCA, MARK ANTHONY', '20212022_2', 85, 77, 84, 88, 86, 85, 88, 77, 91, 96, 88, 92, 92, 84, 85, 92, 88, 77, 75, 95, 'Business Operations'),
('59818250', 'CHUA, JOHN MICHAEL', '20222023_3', 80, 75, 75, 83, 76, 94, 82, 75, 83, 86, 80, 79, 87, 82, 77, 81, 86, 78, 84, 86, 'Business Operations'),
('59818253', 'SALVAÑA, ADRIAN', '20212022_2', 87, 75, 82, 86, 83, 84, 88, 77, 87, 93, 86, 87, 87, 85, 86, 86, 91, 76, 75, 92, 'Business Operations'),
('59818261', 'CALIGNER, MICHAEL JOHN', '20212022_2', 85, 75, 86, 87, 89, 98, 88, 80, 88, 95, 86, 89, 93, 87, 88, 90, 92, 84, 75, 94, 'Business Operations'),
('59818336', 'DESABILLE, ROMAR', '20212022_2', 84, 83, 94, 89, 94, 90, 94, 86, 84, 90, 87, 88, 95, 87, 83, 85, 90, 81, 91, 92, 'Systems Development'),
('59818338', 'PATOC, JERIC MAR', '20222023_2', 90, 77, 75, 75, 85, 94, 75, 75, 78, 76, 88, 79, 91, 84, 75, 90, 80, 98, 78, 78, 'Technical Support'),
('59818339', 'MERCADO, RICHARD, JR.', '20212022_2', 88, 78, 87, 93, 92, 98, 90, 80, 90, 92, 90, 89, 89, 86, 86, 91, 93, 84, 75, 95, 'Business Operations'),
('59818340', 'GIRON, KEANA CERELA', '20212022_2', 92, 79, 84, 87, 86, 96, 86, 83, 88, 95, 84, 91, 92, 87, 82, 86, 96, 84, 75, 88, 'Business Operations'),
('59818360', 'ALCASID, RUDGE', '20222023_2', 88, 75, 75, 80, 80, 82, 86, 75, 77, 97, 81, 91, 87, 82, 77, 87, 85, 98, 80, 81, 'Research'),
('59818372', 'HAMO-AY, TRISHIA', '20212022_2', 88, 80, 87, 88, 87, 96, 88, 84, 90, 91, 85, 89, 89, 90, 85, 95, 92, 85, 82, 94, 'Business Operations'),
('59818379', 'PINEDA, JAMES RYAN', '20212022_2', 88, 75, 83, 87, 83, 83, 84, 76, 86, 97, 87, 93, 90, 78, 85, 91, 95, 76, 75, 96, 'Business Operations'),
('59818412', 'AGUNOD, BRYAN CARL', '20212022_2', 75, 83, 88, 75, 81, 87, 88, 84, 84, 95, 80, 91, 92, 80, 84, 93, 95, 75, 83, 91, 'Business Operations'),
('59818415', 'MISAJON, JERITO, JR.', '20212022_2', 85, 75, 89, 75, 89, 92, 75, 79, 82, 95, 84, 90, 90, 79, 80, 89, 91, 84, 89, 89, 'Business Operations'),
('59818428', 'MANTILLA, JOANA MAE', '20212022_2', 82, 75, 83, 82, 77, 86, 87, 75, 86, 93, 79, 89, 89, 81, 83, 89, 92, 83, 75, 93, 'Business Operations'),
('59818432', 'ROJAS, JULIET', '20212022_2', 83, 75, 85, 83, 81, 89, 86, 75, 88, 95, 80, 89, 91, 83, 85, 92, 92, 81, 75, 96, 'Business Operations'),
('59818448', 'BALAOD, JOSHUA', '20232024_2', 85, 75, 75, 77, 78, 85, 83, 75, 76, 83, 83, 87, 91, 75, 85, 80, 89, 98, 80, 83, 'Technical Support'),
('59818541', 'Lamberte, Alexis Dave', '20232024_2', 83, 83, 84, 85, 82, 79, 85, 78, 75, 91, 77, 87, 85, 75, 79, 89, 89, 75, 75, 89, 'Business Operations'),
('59818561', 'LABOR, FRANK VINCENT', '20212022_2', 83, 75, 87, 84, 81, 97, 88, 75, 84, 91, 76, 89, 92, 79, 83, 88, 95, 80, 75, 92, 'Business Operations'),
('59818578', 'DONOR, JESSA', '20212022_2', 80, 75, 86, 83, 82, 97, 87, 75, 87, 98, 82, 91, 90, 80, 84, 94, 95, 79, 77, 93, 'Business Operations'),
('59818593', 'ALGAR, KENT JOSEPH', '20212022_2', 86, 75, 78, 79, 78, 98, 81, 80, 85, 95, 82, 93, 92, 79, 86, 95, 96, 78, 75, 95, 'Business Operations'),
('59818602', 'CEDEÑO, ROSSELYN', '20212022_2', 92, 88, 87, 93, 93, 98, 87, 79, 92, 96, 89, 92, 95, 89, 85, 93, 93, 81, 82, 84, 'Business Operations'),
('59818651', 'AUSTRIA, REYNALDO JR.', '20212022_2', 80, 75, 86, 85, 84, 98, 83, 77, 88, 94, 81, 90, 87, 78, 84, 93, 88, 84, 75, 90, 'Business Operations'),
('59818675', 'OPPUS, CHRISTINE PEARL ', '20212022_2', 75, 75, 87, 85, 79, 98, 91, 82, 88, 98, 76, 93, 91, 75, 87, 92, 95, 77, 75, 96, 'Business Operations'),
('59818690', 'LAGUINDAB, ALWIN', '20212022_2', 87, 75, 86, 81, 85, 95, 88, 75, 85, 91, 82, 94, 92, 83, 84, 92, 94, 84, 80, 92, 'Business Operations'),
('59818754', 'BALUNOS, ROY NOEL', '20212022_2', 77, 75, 81, 83, 76, 97, 85, 77, 81, 92, 85, 91, 92, 85, 82, 90, 90, 83, 89, 93, 'Business Operations'),
('59818763', 'PIELAGO, DENISE DIANNE AUDREY', '20212022_2', 85, 82, 86, 81, 86, 94, 93, 90, 82, 99, 91, 94, 90, 91, 82, 94, 95, 77, 88, 82, 'Technical Support'),
('59818955', 'BATERBONIA, REY KRYSLER', '20212022_2', 80, 75, 84, 81, 79, 97, 89, 79, 82, 94, 86, 89, 93, 87, 84, 92, 92, 83, 86, 94, 'Business Operations'),
('59818989', 'CURAN, HENRY', '20212022_2', 85, 75, 83, 78, 80, 86, 78, 80, 75, 89, 78, 89, 90, 88, 76, 80, 88, 82, 92, 81, 'Technical Support'),
('59819029', 'CAYETANO, CHRISTIAN', '20212022_2', 85, 75, 85, 84, 84, 92, 87, 83, 75, 96, 89, 94, 91, 87, 80, 93, 94, 83, 88, 87, 'Technical Support'),
('59819050', 'LANUGON, JAYMALYN', '20212022_2', 85, 75, 84, 84, 79, 88, 88, 78, 87, 92, 84, 93, 90, 77, 85, 94, 95, 82, 75, 96, 'Business Operations'),
('59819063', 'DELFINO, ARCHEE KHENT FRANKLIN', '20212022_2', 85, 86, 93, 92, 92, 97, 88, 85, 86, 97, 90, 91, 97, 92, 82, 91, 91, 82, 94, 93, 'Business Operations'),
('59819095', 'FERNANDEZ, LIANRINO', '20232024_2', 80, 80, 79, 87, 87, 78, 83, 83, 76, 94, 89, 92, 92, 88, 79, 88, 88, 75, 90, 79, 'Technical Support'),
('59819134', 'VILLANUEVA, JASZMEINE ABIGAILLE', '20232024_2', 81, 80, 79, 84, 84, 98, 92, 80, 75, 93, 82, 91, 79, 87, 78, 85, 90, 85, 75, 75, 'Technical Support'),
('59819142', 'TRUYA, JULIUS BERNABE', '20212022_2', 84, 78, 89, 82, 85, 98, 92, 82, 83, 97, 89, 95, 92, 88, 86, 94, 93, 85, 89, 95, 'Business Operations'),
('59819263', 'ESTRADA, DARYL', '20212022_2', 88, 76, 88, 82, 83, 82, 91, 76, 79, 92, 85, 91, 93, 84, 84, 94, 87, 81, 89, 87, 'Technical Support'),
('59819271', 'CERVANTES, HAVEVIA', '20212022_2', 85, 75, 85, 84, 82, 78, 88, 75, 78, 96, 82, 94, 87, 87, 82, 89, 96, 76, 84, 96, 'Business Operations'),
('59819438', 'DOMINGO, JEANLYN ROSE', '20212022_2', 83, 80, 84, 77, 81, 79, 90, 75, 76, 92, 83, 90, 87, 85, 79, 90, 95, 82, 86, 93, 'Business Operations'),
('59819491', 'PASTOR, VANNA SHANE', '20222023_2', 79, 77, 94, 80, 75, 86, 90, 80, 77, 83, 83, 91, 89, 78, 82, 92, 93, 98, 79, 91, 'Technical Support'),
('59819681', 'AGOL, ROGIENALD PHILIP', '20212022_2', 89, 81, 86, 86, 87, 84, 88, 86, 79, 87, 87, 83, 89, 85, 84, 80, 88, 83, 91, 90, 'Technical Support'),
('59819813', 'LOZANO, CHRISTIAN', '20222023_2', 82, 79, 96, 91, 75, 87, 83, 84, 76, 84, 79, 93, 92, 81, 86, 89, 95, 98, 79, 81, 'Technical Support'),
('59819899', 'ABDULBAKI, ADAM OMAR, JR.', '20242025_2', 92, 87, 91, 77, 84, 91, 94, 83, 76, 92, 85, 95, 91, 79, 84, 91, 94, 91, 75, 91, 'Systems Development'),
('59819958', 'SARIEGO, IVAN', '20242025_2', 92, 79, 89, 85, 81, 90, 90, 81, 79, 87, 84, 85, 90, 78, 81, 87, 94, 89, 75, 88, 'Systems Development'),
('59819983', 'PAGARAN, MARIELLE JOY', '20222023_2', 76, 82, 94, 86, 88, 83, 88, 81, 75, 90, 82, 89, 86, 78, 78, 90, 94, 98, 80, 87, 'Systems Development'),
('59820169', 'REYES, FRANZ JULIUS ', '20232024_2', 75, 83, 75, 85, 90, 78, 89, 82, 75, 90, 80, 75, 84, 80, 75, 76, 80, 84, 77, 92, 'Business Operations'),
('59820232', 'PAMAT, RICO', '20222023_2', 75, 86, 95, 89, 90, 91, 93, 86, 79, 96, 87, 95, 96, 89, 83, 94, 95, 98, 90, 89, 'Research'),
('59820295', 'LUBAO, JEO CARLO', '20222023_2', 80, 97, 97, 90, 95, 96, 97, 93, 84, 96, 88, 95, 94, 89, 88, 94, 95, 98, 90, 94, 'Systems Development'),
('59820315', 'POSADAS, RAFFY', '20242025_2', 83, 76, 90, 93, 87, 93, 95, 81, 78, 93, 84, 94, 93, 84, 83, 91, 93, 86, 76, 90, 'Technical Support'),
('59820355', 'LIBONG, Jn. ANDY', '20232024_2', 80, 86, 83, 88, 90, 89, 90, 80, 75, 90, 80, 95, 88, 81, 83, 90, 89, 84, 78, 93, 'Technical Support'),
('59820399', 'HONORARIO, CEDRICK JOHN', '20232024_2', 83, 78, 85, 82, 91, 77, 88, 79, 75, 92, 87, 94, 86, 79, 82, 86, 89, 84, 78, 90, 'Business Operations'),
('59820424', 'GELBOLINGO, JOHN ARIEL ', '20222023_2', 81, 82, 94, 80, 90, 78, 83, 79, 75, 84, 85, 92, 84, 84, 82, 86, 92, 98, 78, 87, 'Technical Support'),
('59820527', 'COMANDA, HOLDEN', '20222023_2', 78, 85, 91, 82, 90, 84, 88, 76, 75, 84, 83, 86, 91, 85, 92, 89, 92, 98, 75, 80, 'Technical Support'),
('59820690', 'LINGATONG, EUGENE', '20232024_2', 75, 77, 83, 79, 82, 80, 92, 78, 75, 93, 84, 82, 89, 83, 86, 89, 84, 91, 80, 92, 'Technical Support'),
('59820746', 'ASENIA, ANIE ROSE', '20222023_2', 75, 78, 86, 80, 79, 78, 75, 78, 75, 92, 84, 91, 88, 78, 84, 81, 83, 98, 75, 90, 'Technical Support'),
('59820840', 'CRUZADA, ALLYSSA MAE', '20232024_2', 86, 75, 86, 75, 89, 81, 90, 82, 75, 82, 79, 96, 96, 82, 83, 86, 78, 85, 82, 90, 'Technical Support'),
('59820864', 'PALERMO, KING DAVE', '20232024_2', 83, 83, 86, 88, 79, 92, 85, 90, 75, 89, 78, 91, 92, 82, 82, 92, 89, 85, 82, 91, 'Technical Support'),
('59820865', 'CACHUELA, REX', '20242025_2', 80, 80, 75, 82, 96, 87, 86, 84, 75, 89, 82, 75, 87, 80, 77, 86, 76, 78, 75, 81, 'Technical Support'),
('59820873', 'PALMES, QUEEN GIANNA CLAIRE', '20222023_2', 80, 83, 98, 91, 89, 88, 87, 88, 78, 86, 87, 94, 94, 88, 84, 93, 93, 98, 75, 95, 'Technical Support'),
('59820888', 'DESIERTO, JERSON RAY', '20232024_2', 82, 82, 95, 88, 87, 86, 97, 92, 79, 91, 82, 98, 90, 94, 81, 91, 93, 92, 87, 93, 'Technical Support'),
('59820890', 'MANCAO, ROJIEN', '20232024_2', 81, 83, 75, 80, 84, 75, 83, 84, 75, 87, 78, 84, 93, 77, 89, 83, 85, 80, 75, 80, 'Technical Support'),
('59820910', 'GONZALES, THERESA', '20232024_2', 84, 78, 94, 92, 83, 87, 92, 96, 80, 89, 85, 89, 94, 96, 82, 89, 92, 86, 81, 92, 'Technical Support'),
('59820967', 'DIGNOS, REE JOHNDAVE', '20232024_2', 80, 75, 84, 86, 91, 80, 86, 86, 75, 81, 80, 88, 86, 83, 83, 90, 81, 85, 82, 75, 'Technical Support'),
('59820971', 'DELA TORRE, JAZZY', '20232024_2', 80, 85, 93, 97, 95, 84, 95, 81, 76, 91, 88, 94, 91, 94, 85, 92, 92, 82, 78, 93, 'Technical Support'),
('59821027', 'BUGAWISAN, HANNAH ISABEL', '20222023_2', 77, 75, 93, 81, 79, 77, 76, 78, 77, 90, 86, 96, 91, 84, 86, 91, 91, 98, 80, 91, 'Technical Support'),
('59821042', 'OLALO, ROMELA', '20222023_2', 79, 78, 95, 80, 85, 82, 85, 83, 77, 87, 87, 93, 85, 83, 89, 92, 94, 98, 75, 93, 'Technical Support'),
('59821050', 'MAANDIG, GERICKO', '20222023_2', 87, 84, 95, 87, 94, 92, 91, 86, 75, 89, 83, 87, 99, 86, 92, 92, 95, 98, 78, 88, 'Technical Support'),
('59821204', 'MUÑEZ, HAZEL MAE', '20222023_2', 83, 82, 95, 89, 89, 90, 95, 83, 77, 90, 81, 94, 94, 85, 87, 92, 97, 98, 80, 93, 'Technical Support'),
('59821207', 'ENDRIGA, JAZEL', '20242025_2', 83, 85, 85, 91, 76, 95, 93, 77, 75, 93, 91, 91, 91, 84, 87, 94, 94, 81, 75, 92, 'Technical Support'),
('59821241', 'CEPE, PRECIOUS ENICA', '20222023_2', 87, 80, 93, 83, 91, 81, 94, 82, 76, 87, 77, 86, 96, 84, 84, 89, 95, 98, 81, 90, 'Systems Development'),
('59821295', 'YANA, IKE LLOYD', '20222023_2', 89, 83, 96, 83, 88, 83, 90, 80, 77, 91, 88, 85, 94, 83, 84, 90, 96, 98, 78, 86, 'Systems Development'),
('59821301', 'ALGABRE, JAYMARK', '20222023_2', 86, 80, 93, 87, 88, 90, 96, 85, 78, 92, 85, 92, 89, 85, 81, 91, 94, 98, 89, 91, 'Systems Development'),
('59821302', 'GALICIA, NOLLAN JAY', '20222023_2', 84, 85, 97, 87, 92, 96, 95, 91, 84, 96, 85, 98, 94, 89, 90, 96, 98, 98, 89, 91, 'Technical Support'),
('59821314', 'BARRIENTOS, JONEL', '20232024_2', 77, 79, 86, 94, 82, 85, 87, 89, 75, 86, 81, 85, 92, 92, 81, 91, 90, 90, 77, 88, 'Technical Support'),
('59821315', 'BIYO, REMUEL', '20232024_2', 79, 82, 80, 86, 84, 81, 86, 87, 76, 83, 81, 80, 75, 92, 76, 82, 75, 88, 77, 77, 'Technical Support'),
('59821322', 'VIGONTE, APRIL JANE', '20222023_2', 79, 83, 96, 86, 87, 87, 89, 84, 75, 90, 81, 90, 88, 86, 81, 92, 93, 98, 80, 87, 'Technical Support'),
('59821335', 'ARSENAL, ANDREI NICOLE ', '20232024_1', 84, 81, 85, 84, 89, 89, 76, 94, 75, 86, 84, 90, 90, 91, 77, 88, 90, 98, 87, 82, 'Technical Support'),
('59821377', 'SEVILLA, JOHN PAUL', '20242025_2', 77, 86, 79, 99, 89, 76, 86, 75, 75, 91, 85, 86, 84, 86, 81, 87, 90, 82, 75, 86, 'Technical Support'),
('59821392', 'ONTOLAN, RICO', '20222023_2', 89, 84, 98, 88, 90, 85, 82, 89, 83, 92, 88, 90, 97, 90, 84, 96, 96, 98, 88, 93, 'Technical Support'),
('59821442', 'LAMOSA, REDEN', '20222023_2', 82, 92, 87, 86, 80, 88, 82, 88, 80, 88, 85, 93, 93, 84, 82, 91, 94, 98, 87, 83, 'Systems Development'),
('59821452', 'GARCIA, FRITZ JAY ', '20232024_2', 82, 84, 82, 87, 80, 80, 89, 87, 77, 87, 88, 95, 94, 89, 77, 87, 84, 86, 80, 91, 'Technical Support'),
('59821555', 'ALQUIZAR, MIYA VALERI ', '20222023_2', 77, 83, 98, 86, 86, 83, 81, 89, 78, 92, 87, 93, 99, 88, 87, 94, 93, 98, 87, 95, 'Technical Support'),
('59821775', 'TAPIA, EARL PATRICK', '20222023_2', 77, 79, 96, 81, 92, 86, 87, 85, 77, 88, 82, 91, 92, 81, 81, 92, 90, 98, 80, 93, 'Technical Support'),
('59821781', 'BULA, JOHN ALVIN', '20222023_2', 80, 88, 96, 88, 91, 86, 89, 89, 80, 88, 88, 95, 99, 87, 81, 93, 94, 98, 81, 94, 'Systems Development'),
('59821783', 'CUIZON, CYREX JOSHUA', '20222023_2', 79, 87, 91, 88, 90, 92, 93, 88, 80, 89, 84, 94, 94, 87, 81, 92, 96, 98, 83, 89, 'Systems Development'),
('59821785', 'MAMARIL, LEAH MAE', '20222023_2', 76, 82, 94, 90, 89, 84, 80, 83, 75, 83, 86, 86, 94, 84, 79, 89, 93, 98, 75, 92, 'Technical Support'),
('59821786', 'MONTERA, JOHN HENLY', '20222023_2', 80, 88, 98, 87, 91, 94, 97, 90, 81, 94, 84, 97, 99, 91, 87, 96, 96, 98, 86, 98, 'Technical Support'),
('59821787', 'LINAO, RICARDO JOSE', '20222023_2', 75, 75, 87, 87, 91, 83, 87, 87, 75, 93, 81, 93, 92, 84, 75, 89, 91, 98, 80, 91, 'Research'),
('59821800', 'ABILAR, ALDRIN', '20232024_2', 82, 89, 91, 100, 91, 83, 92, 78, 75, 93, 83, 93, 89, 96, 80, 91, 92, 89, 84, 90, 'Technical Support'),
('59821831', 'RUFANO, PETER PAULO', '20222023_2', 89, 80, 92, 88, 89, 85, 84, 85, 76, 83, 84, 89, 88, 85, 80, 88, 92, 98, 75, 78, 'Technical Support'),
('59821921', 'GONZALES, PRINCE AL ', '20222023_2', 75, 79, 97, 83, 92, 83, 89, 87, 76, 88, 84, 94, 99, 89, 79, 93, 93, 98, 80, 92, 'Technical Support'),
('59822008', 'PILLETERO, HONNIE MAE', '20242025_2', 88, 83, 94, 91, 95, 94, 94, 88, 81, 92, 92, 91, 92, 85, 80, 93, 94, 85, 83, 91, 'Systems Development'),
('59822094', 'GALLANA, JOHN HENDRIX', '20242025_2', 83, 78, 93, 79, 87, 78, 88, 82, 76, 85, 81, 86, 85, 79, 81, 85, 88, 98, 80, 84, 'Systems Development'),
('59822098', 'OLMOGUEZ, MARK', '20232024_2', 75, 82, 84, 90, 82, 85, 83, 90, 75, 84, 80, 85, 86, 91, 76, 87, 84, 88, 75, 82, 'Technical Support'),
('59822314', 'TRUZ, ED NICOLE', '20232024_2', 75, 82, 95, 94, 93, 82, 90, 84, 75, 91, 85, 96, 89, 95, 80, 92, 94, 83, 81, 92, 'Technical Support'),
('59822344', 'Maruhom, Norhassan', '20242025_2', 85, 86, 82, 81, 78, 75, 94, 77, 75, 91, 88, 94, 86, 82, 84, 93, 93, 85, 80, 88, 'Technical Support'),
('59822509', 'MAESTRE, RODNEY', '20242025_2', 81, 85, 89, 77, 79, 79, 77, 78, 75, 90, 86, 77, 75, 79, 77, 88, 90, 80, 75, 92, 'Business Operations'),
('59822559', 'PACLIBAR, CHERRIE ANNE', '20242025_2', 81, 82, 80, 86, 84, 95, 92, 78, 75, 89, 81, 89, 92, 80, 78, 88, 94, 78, 75, 88, 'Business Operations'),
('59822598', 'Maturan, Jespher Jhems', '20242025_2', 83, 85, 85, 87, 84, 77, 89, 75, 75, 90, 84, 83, 84, 83, 76, 87, 85, 84, 75, 90, 'Business Operations'),
('59822603', 'de Leon, Mikko', '20232024_2', 91, 85, 83, 86, 80, 85, 89, 94, 75, 90, 80, 96, 87, 85, 81, 90, 91, 83, 83, 94, 'Technical Support'),
('59822734', 'LUCHAVEZ, JOSHUA', '20232024_2', 79, 84, 98, 75, 93, 80, 91, 87, 79, 93, 91, 87, 85, 83, 91, 90, 83, 83, 82, 76, 'Technical Support'),
('59822756', 'ALEGADO, JOSEPH GERARD PAUL', '20232024_2', 88, 87, 87, 90, 78, 80, 89, 82, 75, 92, 86, 86, 89, 82, 84, 87, 88, 85, 78, 87, 'Technical Support'),
('59823032', 'Villegas, Steve Julian', '20242025_2', 75, 75, 78, 76, 88, 90, 92, 76, 75, 93, 80, 75, 81, 75, 79, 86, 81, 78, 75, 81, 'Business Operations'),
('59823106', 'ELARCOSA, FLORENZ', '20242025_2', 81, 77, 90, 75, 79, 77, 78, 78, 75, 89, 80, 87, 78, 95, 78, 91, 82, 83, 75, 91, 'Technical Support'),
('59823578', 'Cinco, Allen Iverson', '20242025_2', 78, 84, 87, 84, 84, 78, 89, 76, 75, 92, 79, 89, 87, 87, 78, 91, 83, 79, 75, 91, 'Business Operations'),
('59823607', 'PALMA GIL, FRANCHESKA MONIQUE', '20232024_2', 95, 92, 95, 96, 92, 94, 97, 88, 86, 99, 80, 99, 91, 97, 93, 93, 95, 90, 85, 95, 'Technical Support'),
('59823621', 'MONTAJES, HOLDEN', '20232024_2', 87, 91, 95, 91, 87, 88, 89, 75, 75, 91, 80, 90, 91, 96, 81, 93, 85, 86, 82, 92, 'Technical Support'),
('59823660', 'SERDAN, ARVIE GRACE', '20232024_2', 85, 92, 93, 97, 88, 85, 96, 80, 75, 93, 81, 98, 84, 96, 81, 90, 90, 83, 80, 93, 'Technical Support'),
('59823681', 'LAMELA, PAMELA MAY', '20232024_2', 84, 88, 91, 90, 88, 94, 92, 80, 75, 91, 80, 87, 88, 94, 79, 90, 84, 87, 78, 93, 'Technical Support'),
('59823813', 'CORCIEGA, JAKE ANDY', '20242025_2', 79, 89, 89, 82, 96, 90, 90, 81, 82, 87, 80, 94, 95, 84, 80, 86, 95, 86, 77, 94, 'Business Operations'),
('59823851', 'GABUYA, NATE KIZZER', '20232024_2', 91, 90, 89, 83, 92, 83, 93, 81, 75, 97, 86, 93, 87, 90, 80, 90, 91, 85, 75, 94, 'Business Operations'),
('59824102', 'SAYSON, RICHARD', '20232024_2', 94, 94, 95, 98, 92, 87, 91, 80, 75, 94, 82, 88, 89, 93, 84, 94, 94, 83, 79, 93, 'Technical Support'),
('59824111', 'NOBELA, ODLANYER', '20232024_2', 88, 88, 90, 83, 91, 86, 85, 76, 75, 92, 82, 95, 86, 91, 81, 88, 90, 80, 79, 94, 'Technical Support'),
('59824141', 'MAYNAGCOT, JAY ARE', '20222023_2', 95, 92, 87, 81, 80, 75, 98, 90, 79, 100, 77, 91, 98, 81, 77, 75, 80, 75, 86, 75, 'Systems Development'),
('59824156', 'DIAZ, JAMES CEE', '20232024_2', 88, 92, 95, 89, 88, 79, 91, 83, 75, 91, 88, 93, 85, 94, 81, 91, 86, 84, 80, 91, 'Technical Support'),
('59824194', 'UYANGUREN, CHLOE ANN ', '20232024_2', 87, 92, 80, 90, 88, 80, 89, 75, 75, 93, 82, 88, 88, 94, 78, 89, 91, 82, 77, 93, 'Technical Support'),
('59824290', 'CANDIA, KENNETH', '20232024_2', 87, 87, 93, 100, 91, 86, 92, 81, 79, 93, 80, 94, 90, 93, 88, 91, 90, 93, 82, 94, 'Technical Support'),
('59824329', 'SARILE, JR., JOSEPH', '20242025_2', 81, 75, 79, 91, 85, 92, 93, 80, 80, 89, 76, 97, 94, 79, 82, 92, 92, 85, 76, 93, 'Business Operations'),
('59824361', 'CARALOS, DANIEL', '20232024_2', 83, 84, 88, 97, 88, 83, 92, 76, 75, 91, 80, 88, 89, 93, 78, 92, 86, 82, 78, 91, 'Technical Support'),
('59824388', 'ALEMANZA, ADRIAN JAKE', '20232024_2', 87, 90, 80, 98, 91, 77, 86, 81, 75, 94, 88, 92, 89, 87, 78, 90, 89, 80, 78, 92, 'Business Operations'),
('59824422', 'TIANCHON, CHARLES BENCH', '20232024_2', 77, 82, 85, 90, 84, 82, 87, 77, 75, 88, 75, 96, 86, 96, 82, 90, 88, 88, 75, 93, 'Technical Support'),
('59824463', 'ROSAL, SHAN JUERNET', '20232024_2', 94, 91, 84, 91, 91, 77, 81, 75, 75, 91, 82, 93, 86, 94, 76, 89, 91, 80, 76, 92, 'Technical Support'),
('59824579', 'SARSALEJO, KENT VINCENT', '20232024_2', 89, 87, 87, 87, 93, 85, 92, 82, 75, 90, 80, 90, 87, 91, 79, 91, 84, 85, 80, 90, 'Technical Support'),
('59824692', 'ROQUE, LOUIS ANDREW ', '20232024_2', 90, 87, 91, 83, 85, 82, 86, 76, 75, 90, 80, 95, 84, 95, 81, 85, 88, 86, 78, 94, 'Technical Support'),
('59824718', 'Sarillana, Mar Nichol ', '20232024_2', 75, 84, 90, 89, 90, 83, 89, 80, 75, 91, 76, 94, 87, 96, 82, 93, 89, 82, 76, 92, 'Technical Support'),
('59824832', 'NIEZ, JONATHAN JR.', '20232024_2', 87, 85, 91, 100, 89, 83, 89, 78, 75, 90, 80, 95, 86, 94, 82, 93, 88, 86, 78, 94, 'Technical Support'),
('59825027', 'PADILLA, AARON MARC', '20232024_2', 90, 90, 94, 100, 89, 82, 88, 82, 75, 94, 80, 91, 86, 94, 83, 89, 94, 80, 79, 92, 'Technical Support'),
('59825195', 'TION, JEFF CLARENCE', '20242025_2', 79, 84, 78, 88, 86, 76, 91, 75, 75, 92, 75, 94, 75, 89, 76, 89, 87, 78, 78, 90, 'Business Operations'),
('59825255', 'SANIEL, KENNETH', '20242025_2', 93, 87, 90, 90, 87, 92, 92, 79, 78, 91, 89, 88, 93, 86, 88, 95, 94, 85, 75, 88, 'Technical Support'),
('59825398', 'PIASTRO, JAMES ANTHONY', '20242025_2', 80, 86, 88, 92, 95, 93, 92, 80, 77, 92, 86, 83, 85, 85, 82, 84, 96, 88, 76, 80, 'Technical Support'),
('59825497', 'NEMENZO, KRISTINA KARYLLE', '20242025_2', 88, 88, 90, 92, 94, 95, 93, 85, 79, 93, 88, 91, 92, 81, 80, 88, 91, 85, 83, 95, 'Business Operations'),
('59825548', 'MELECIO, ROLAND, JR.', '20242025_2', 93, 86, 94, 93, 94, 95, 94, 90, 83, 87, 88, 93, 90, 87, 84, 92, 94, 88, 78, 89, 'Systems Development'),
('59825552', 'ANDAMON, JOEL', '20242025_2', 89, 84, 88, 86, 92, 93, 93, 76, 80, 91, 85, 88, 94, 83, 81, 93, 88, 82, 75, 91, 'Business Operations'),
('59825553', 'ESTIPONA, KARL JOSEPH', '20242025_2', 92, 88, 86, 93, 87, 96, 92, 80, 75, 88, 91, 88, 91, 85, 79, 87, 93, 80, 78, 86, 'Systems Development'),
('59825572', 'ROJAS, EDGARDO, JR. ', '20242025_2', 94, 89, 95, 94, 90, 92, 93, 85, 86, 90, 93, 89, 96, 89, 85, 89, 96, 82, 78, 95, 'Business Operations'),
('59825607', 'BONGBONG, FIONA', '20242025_2', 90, 90, 90, 95, 91, 93, 94, 83, 75, 94, 92, 90, 94, 84, 82, 95, 95, 86, 82, 91, 'Systems Development'),
('59825643', 'DOMINGO, ART JUNNEL', '20242025_2', 89, 88, 84, 92, 93, 89, 88, 76, 76, 84, 91, 88, 90, 80, 78, 89, 95, 83, 75, 88, 'Systems Development'),
('59825659', 'MUYCO, CARL JOSHUA', '20242025_2', 89, 84, 85, 90, 93, 88, 89, 78, 75, 86, 88, 88, 92, 81, 76, 95, 95, 84, 75, 84, 'Systems Development'),
('59825662', 'Natino, Leden', '20242025_2', 84, 86, 87, 90, 92, 92, 88, 84, 76, 91, 85, 89, 86, 78, 78, 86, 94, 84, 81, 85, 'Systems Development'),
('59825688', 'CANTOS, CRIS JHON', '20242025_2', 93, 89, 95, 93, 96, 95, 94, 79, 80, 91, 91, 91, 96, 86, 86, 93, 85, 87, 81, 92, 'Systems Development'),
('59825696', 'SILVERIO, JOHN REY ', '20242025_2', 93, 90, 85, 93, 95, 94, 95, 81, 84, 89, 85, 95, 95, 84, 91, 92, 92, 88, 85, 95, 'Technical Support'),
('59825743', 'MELLA, JOHN SMILE', '20242025_2', 98, 95, 94, 95, 96, 98, 96, 90, 85, 95, 96, 97, 97, 90, 93, 96, 94, 88, 85, 96, 'Systems Development'),
('59825873', 'CAGATA, KRISTINE JOY ', '20242025_2', 88, 85, 90, 92, 96, 96, 93, 84, 83, 91, 93, 88, 95, 84, 77, 93, 93, 81, 80, 88, 'Systems Development'),
('59825877', 'Lorejo, Clarence James', '20242025_2', 86, 84, 91, 92, 93, 87, 94, 85, 77, 89, 88, 90, 87, 85, 81, 91, 94, 82, 78, 92, 'Systems Development'),
('59825924', 'REQUILLO, EDGAR, JR. ', '20242025_2', 90, 79, 89, 96, 88, 95, 95, 81, 81, 91, 87, 92, 95, 87, 84, 94, 90, 88, 76, 94, 'Business Operations');
INSERT INTO `past_data` (`id_number`, `student_name`, `year_graduated`, `CC 102`, `CC 103`, `PF 101`, `CC 104`, `IPT 101`, `IPT 102`, `CC 106`, `CC 105`, `IM 101`, `IM 102`, `HCI 101`, `HCI 102`, `WS 101`, `NET 101`, `NET 102`, `IAS 101`, `IAS 102`, `CAP 101`, `CAP 102`, `SP 101`, `OJT Placement`) VALUES
('59825950', 'Cuario, Christian Louise', '20242025_2', 94, 77, 90, 93, 95, 88, 94, 80, 75, 90, 88, 90, 92, 83, 83, 85, 83, 85, 76, 91, 'Systems Development'),
('59826015', 'PENDO, JOHN PAUL', '20242025_2', 92, 93, 95, 97, 94, 95, 94, 89, 85, 95, 92, 96, 97, 92, 86, 97, 91, 88, 85, 98, 'Business Operations'),
('59826017', 'PAR, MARK ANGELO ', '20242025_2', 90, 90, 87, 84, 93, 86, 93, 75, 76, 86, 87, 90, 93, 81, 85, 95, 94, 81, 75, 92, 'Systems Development'),
('59826096', 'SARUCAM, RENZ CARLJANSEN', '20242025_2', 87, 92, 91, 94, 91, 96, 93, 83, 77, 93, 90, 88, 95, 86, 89, 95, 94, 83, 75, 92, 'Technical Support'),
('59826167', 'ACOSTA, JESMAR', '20242025_2', 89, 90, 87, 87, 92, 86, 93, 78, 77, 94, 85, 91, 88, 86, 81, 84, 95, 80, 76, 85, 'Systems Development'),
('59826214', 'Lazaga, Christopher Jr.', '20242025_2', 94, 92, 89, 96, 96, 96, 94, 78, 75, 87, 91, 93, 93, 89, 87, 90, 83, 82, 75, 90, 'Systems Development'),
('59826396', 'LADROMA, ROD RIVEN', '20242025_2', 94, 93, 93, 97, 97, 98, 94, 92, 77, 95, 94, 95, 95, 89, 81, 98, 97, 84, 78, 93, 'Systems Development'),
('59826418', 'QUIANZON, GLADYS', '20242025_2', 95, 92, 93, 98, 95, 94, 94, 87, 83, 94, 93, 91, 94, 87, 82, 96, 96, 84, 80, 92, 'Systems Development'),
('59826479', 'VILLARMIA, JOHN ALBERT', '20242025_2', 90, 88, 91, 91, 95, 93, 94, 81, 78, 93, 86, 93, 93, 83, 86, 90, 93, 85, 75, 95, 'Technical Support'),
('59826507', 'PAMPILO, ED LAWRENCE', '20242025_2', 78, 77, 82, 81, 92, 94, 88, 75, 75, 89, 81, 83, 84, 80, 78, 92, 76, 81, 75, 84, 'Technical Support'),
('59826545', 'SALVILLA, ORVILLE', '20242025_2', 93, 86, 91, 95, 91, 98, 90, 87, 80, 93, 87, 92, 91, 87, 85, 92, 96, 88, 78, 91, 'Technical Support'),
('59826582', 'Peliño, Jumel Ivan', '20242025_2', 90, 88, 91, 91, 94, 93, 91, 86, 81, 93, 89, 89, 94, 83, 80, 94, 95, 83, 78, 90, 'Systems Development'),
('59826646', 'DELA CRUZ, ART III', '20242025_2', 95, 93, 96, 99, 95, 96, 94, 88, 87, 94, 93, 97, 96, 89, 85, 97, 98, 86, 86, 95, 'Systems Development'),
('59826853', 'BISTO, KRISTIAN  BRIELLE', '20242025_2', 91, 75, 86, 86, 91, 86, 92, 75, 77, 84, 81, 86, 89, 79, 77, 90, 91, 83, 75, 89, 'Systems Development'),
('59826920', 'COLIPANO, JERWIN', '20242025_2', 94, 90, 94, 96, 95, 95, 93, 88, 79, 92, 92, 96, 95, 85, 85, 96, 98, 84, 76, 95, 'Systems Development'),
('59826945', 'ESTACIONES, DAZZLE', '20242025_2', 92, 91, 95, 95, 95, 95, 94, 89, 82, 95, 92, 92, 95, 91, 83, 96, 97, 84, 82, 94, 'Systems Development'),
('59826989', 'TAN, BAZLEY', '20242025_2', 92, 75, 85, 86, 90, 91, 89, 78, 75, 91, 81, 86, 85, 82, 83, 81, 86, 79, 77, 83, 'Technical Support'),
('59826991', 'MORILLO, JOHN MATTHEW', '20242025_2', 89, 75, 84, 83, 92, 87, 92, 75, 75, 94, 81, 88, 83, 78, 82, 86, 87, 84, 75, 86, 'Business Operations'),
('59827040', 'WONG, CLEEVE PHILIP ', '20242025_2', 93, 90, 86, 95, 91, 94, 94, 81, 80, 94, 90, 96, 97, 82, 87, 92, 94, 87, 84, 92, 'Systems Development'),
('59827065', 'LLANES, KYLA', '20242025_2', 81, 75, 83, 78, 92, 95, 88, 78, 75, 82, 86, 87, 87, 84, 83, 82, 89, 82, 75, 89, 'Technical Support'),
('59827082', 'EVANGELIO, STEVE FRANCIS', '20242025_2', 95, 92, 96, 94, 96, 98, 94, 89, 75, 95, 93, 91, 92, 88, 87, 98, 97, 85, 80, 98, 'Technical Support'),
('59827091', 'GARGOLES, MARK ANGELO', '20242025_2', 79, 76, 85, 91, 94, 97, 93, 85, 80, 85, 75, 92, 95, 80, 78, 95, 93, 85, 82, 97, 'Business Operations'),
('59827112', 'Radores, Jayson', '20242025_2', 90, 90, 90, 92, 92, 93, 95, 80, 76, 91, 86, 92, 89, 81, 82, 89, 92, 81, 75, 92, 'Systems Development'),
('59827170', 'GUILLENA, JAMES RYAN ', '20242025_2', 86, 91, 83, 92, 92, 93, 92, 75, 76, 88, 81, 86, 86, 84, 85, 86, 92, 75, 82, 80, 'Technical Support'),
('59827508', 'BASA, WYSLIE VAN', '20242025_2', 88, 76, 89, 86, 94, 94, 93, 77, 77, 92, 88, 90, 84, 83, 88, 83, 93, 75, 81, 85, 'Technical Support'),
('59827530', 'ANCHETA, HELBERT ADRIAN', '20242025_2', 90, 87, 88, 90, 93, 92, 91, 81, 81, 92, 90, 90, 89, 83, 78, 94, 80, 75, 79, 90, 'Business Operations'),
('59827606', 'SCALERCIO, JOSHUA VERGEL', '20242025_2', 94, 91, 95, 89, 94, 96, 94, 87, 75, 92, 88, 90, 89, 85, 84, 83, 92, 84, 76, 92, 'Systems Development'),
('59827676', 'CURAMBAO, ARVIN KLENT', '20242025_2', 86, 80, 86, 90, 93, 91, 94, 84, 77, 88, 89, 87, 94, 80, 82, 94, 92, 82, 79, 92, 'Systems Development'),
('59827763', 'GREGORY, JOSHUA', '20242025_2', 83, 87, 87, 83, 85, 87, 91, 75, 75, 90, 82, 89, 88, 80, 81, 96, 87, 81, 75, 86, 'Systems Development'),
('59827825', 'SORIANO, NICOSE JOHN', '20242025_2', 77, 80, 90, 91, 89, 97, 93, 78, 84, 92, 86, 93, 96, 86, 82, 85, 94, 88, 84, 88, 'Technical Support'),
('59827923', 'DEUNA, RICHARD EDRIELL', '20242025_2', 90, 92, 87, 83, 82, 87, 91, 76, 79, 86, 83, 83, 80, 84, 84, 87, 94, 80, 78, 77, 'Technical Support'),
('59830640', 'ALMERO, XURHIEL MAY', '20242025_2', 89, 96, 84, 84, 92, 88, 91, 77, 75, 89, 92, 88, 87, 79, 78, 90, 94, 84, 75, 91, 'Systems Development');

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
  `STATUS` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pending_attendance`
--

INSERT INTO `pending_attendance` (`ID`, `INTERNS_ID`, `HTE_ID`, `ON_DATE`, `TIMEIN`, `TIMEOUT`, `STATUS`, `created_at`, `updated_at`) VALUES
(17, 190, 1, '2024-11-26', '15:54:00', '15:54:00', 'approved', '2025-09-05 08:28:03', '2025-09-05 08:28:03'),
(22, 190, 1, '2024-12-04', '17:27:00', '17:27:00', 'approved', '2025-09-05 08:28:03', '2025-09-05 08:28:03'),
(28, 190, 1, '2025-06-30', '23:43:00', '23:48:00', 'approved', '2025-09-05 08:28:03', '2025-09-05 08:28:03'),
(36, 190, 1, '2025-07-01', '23:43:00', '23:43:00', 'approved', '2025-09-05 08:28:03', '2025-09-05 08:28:03'),
(38, 190, 1, '2025-07-02', '10:09:00', '10:09:00', 'approved', '2025-09-05 08:28:03', '2025-09-05 08:28:03'),
(40, 190, 1, '2025-08-13', '12:04:00', '12:04:00', 'approved', '2025-09-05 08:28:03', '2025-09-05 08:28:03'),
(44, 190, 1, '2025-08-24', '17:51:00', '17:51:00', 'approved', '2025-09-05 08:28:03', '2025-09-05 08:28:03'),
(45, 190, 1, '2025-08-26', '10:52:00', '10:52:00', 'approved', '2025-09-05 08:28:03', '2025-09-05 08:28:03'),
(46, 190, 1, '2025-08-27', '11:02:00', '11:02:00', 'approved', '2025-09-05 08:28:03', '2025-09-05 08:28:03'),
(50, 190, 1, '2025-08-28', '14:09:00', '14:09:00', 'approved', '2025-09-05 08:28:03', '2025-09-05 08:28:03'),
(51, 190, 1, '2025-08-29', '11:25:00', '11:25:00', 'approved', '2025-09-05 08:28:03', '2025-09-05 08:28:03'),
(54, 190, 1, '2025-09-04', '12:52:00', '12:52:00', 'approved', '2025-09-05 08:28:03', '2025-09-05 08:28:03'),
(62, 190, 1, '2025-09-11', '14:03:00', '14:03:00', 'approved', '2025-09-11 06:03:38', '2025-09-11 06:04:03'),
(63, 206, 1, '2025-09-15', '15:25:00', '15:25:00', 'approved', '2025-09-15 07:25:09', '2025-09-15 07:25:44'),
(64, 190, 1, '2025-09-15', '15:26:00', '15:26:00', 'approved', '2025-09-15 07:26:10', '2025-09-15 07:26:19'),
(66, 190, 1, '2025-10-06', '02:48:00', NULL, 'pending', '2025-10-05 18:48:02', '2025-10-05 18:48:02');

-- --------------------------------------------------------

--
-- Table structure for table `post_assessment`
--

CREATE TABLE `post_assessment` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `self_rating` int(11) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `supervisor_id` int(11) DEFAULT NULL,
  `supervisor_rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post_assessment`
--

INSERT INTO `post_assessment` (`id`, `student_id`, `question_id`, `self_rating`, `category`, `supervisor_id`, `supervisor_rating`, `comment`, `created_at`) VALUES
(808, 190, 1, 5, 'System Development', NULL, 5, 'test', '2025-10-07 07:52:06'),
(809, 190, 2, 4, 'System Development', NULL, 4, 'test', '2025-10-07 07:52:06'),
(810, 190, 57, 3, 'System Development', NULL, 3, 'test', '2025-10-07 07:52:06'),
(811, 190, 58, 2, 'System Development', NULL, 2, 'test', '2025-10-07 07:52:06'),
(812, 190, 59, 1, 'System Development', NULL, 1, 'test', '2025-10-07 07:52:06'),
(813, 190, 3, 1, 'Research', NULL, 1, 'test', '2025-10-07 07:52:06'),
(814, 190, 4, 2, 'Research', NULL, 2, 'test', '2025-10-07 07:52:06'),
(815, 190, 60, 3, 'Research', NULL, 3, 'test', '2025-10-07 07:52:06'),
(816, 190, 61, 4, 'Research', NULL, 4, 'test', '2025-10-07 07:52:06'),
(817, 190, 62, 5, 'Research', NULL, 5, 'test', '2025-10-07 07:52:06'),
(818, 190, 5, 5, 'Technical Support', NULL, 5, 'test', '2025-10-07 07:52:06'),
(819, 190, 6, 4, 'Technical Support', NULL, 4, 'test', '2025-10-07 07:52:06'),
(820, 190, 63, 3, 'Technical Support', NULL, 3, 'test', '2025-10-07 07:52:06'),
(821, 190, 64, 2, 'Technical Support', NULL, 2, 'test', '2025-10-07 07:52:06'),
(822, 190, 65, 1, 'Technical Support', NULL, 1, 'test', '2025-10-07 07:52:06'),
(823, 190, 7, 1, 'Business Operation', NULL, 1, 'test', '2025-10-07 07:52:06'),
(824, 190, 8, 2, 'Business Operation', NULL, 2, 'test', '2025-10-07 07:52:06'),
(825, 190, 66, 3, 'Business Operation', NULL, 3, 'test', '2025-10-07 07:52:06'),
(826, 190, 67, 4, 'Business Operation', NULL, 4, 'test', '2025-10-07 07:52:06'),
(827, 190, 68, 5, 'Business Operation', NULL, 5, 'test', '2025-10-07 07:52:06'),
(828, 190, 121, 5, 'Personal and Interpersonal Skills', NULL, 5, 'test', '2025-10-07 07:52:06'),
(829, 190, 122, 4, 'Personal and Interpersonal Skills', NULL, 4, 'test', '2025-10-07 07:52:06'),
(830, 190, 123, 3, 'Personal and Interpersonal Skills', NULL, 3, 'test', '2025-10-07 07:52:06'),
(831, 190, 124, 2, 'Personal and Interpersonal Skills', NULL, 2, 'test', '2025-10-07 07:52:06'),
(832, 190, 125, 1, 'Personal and Interpersonal Skills', NULL, 1, 'test', '2025-10-07 07:52:06'),
(833, 190, 131, 2, 'Personal and Interpersonal Skills', NULL, 2, 'test', '2025-10-07 07:52:06'),
(834, 190, 132, 3, 'Personal and Interpersonal Skills', NULL, 3, 'test', '2025-10-07 07:52:06'),
(835, 278, 81, 5, 'System Development', NULL, 1, 'charles', '2025-10-07 09:49:16'),
(836, 278, 82, 4, 'System Development', NULL, 2, 'charles', '2025-10-07 09:49:16'),
(837, 278, 83, 3, 'System Development', NULL, 3, 'charles', '2025-10-07 09:49:16'),
(838, 278, 84, 2, 'System Development', NULL, 4, 'charles', '2025-10-07 09:49:16'),
(839, 278, 85, 1, 'System Development', NULL, 5, 'charles', '2025-10-07 09:49:16'),
(840, 278, 86, 1, 'Research', NULL, 4, 'charles', '2025-10-07 09:49:16'),
(841, 278, 87, 2, 'Research', NULL, 4, 'charles', '2025-10-07 09:49:16'),
(842, 278, 88, 3, 'Research', NULL, 4, 'charles', '2025-10-07 09:49:16'),
(843, 278, 89, 4, 'Research', NULL, 4, 'charles', '2025-10-07 09:49:16'),
(844, 278, 90, 5, 'Research', NULL, 5, 'charles', '2025-10-07 09:49:16'),
(845, 278, 91, 5, 'Technical Support', NULL, 5, 'charles', '2025-10-07 09:49:16'),
(846, 278, 92, 4, 'Technical Support', NULL, 5, 'charles', '2025-10-07 09:49:16'),
(847, 278, 93, 3, 'Technical Support', NULL, 5, 'charles', '2025-10-07 09:49:16'),
(848, 278, 94, 2, 'Technical Support', NULL, 5, 'charles', '2025-10-07 09:49:16'),
(849, 278, 95, 1, 'Technical Support', NULL, 5, 'charles', '2025-10-07 09:49:16'),
(850, 278, 96, 1, 'Business Operation', NULL, 5, 'charles', '2025-10-07 09:49:17'),
(851, 278, 97, 2, 'Business Operation', NULL, 4, 'charles', '2025-10-07 09:49:17'),
(852, 278, 98, 3, 'Business Operation', NULL, 3, 'charles', '2025-10-07 09:49:17'),
(853, 278, 99, 4, 'Business Operation', NULL, 2, 'charles', '2025-10-07 09:49:17'),
(854, 278, 100, 5, 'Business Operation', NULL, 1, 'charles', '2025-10-07 09:49:17'),
(855, 278, 126, 5, 'Personal and Interpersonal Skills', NULL, 1, 'charles', '2025-10-07 09:49:17'),
(856, 278, 127, 4, 'Personal and Interpersonal Skills', NULL, 2, 'charles', '2025-10-07 09:49:17'),
(857, 278, 128, 3, 'Personal and Interpersonal Skills', NULL, 3, 'charles', '2025-10-07 09:49:17'),
(858, 278, 129, 2, 'Personal and Interpersonal Skills', NULL, 4, 'charles', '2025-10-07 09:49:17'),
(859, 278, 130, 1, 'Personal and Interpersonal Skills', NULL, 5, 'charles', '2025-10-07 09:49:17'),
(860, 278, 133, 2, 'Personal and Interpersonal Skills', NULL, 4, 'charles', '2025-10-07 09:49:17'),
(861, 278, 134, 3, 'Personal and Interpersonal Skills', NULL, 3, 'charles', '2025-10-07 09:49:17'),
(862, 207, 101, 5, 'System Development', NULL, 5, '', '2025-10-07 09:50:05'),
(863, 207, 102, 4, 'System Development', NULL, 4, '', '2025-10-07 09:50:05'),
(864, 207, 103, 3, 'System Development', NULL, 3, '', '2025-10-07 09:50:05'),
(865, 207, 104, 2, 'System Development', NULL, 2, '', '2025-10-07 09:50:05'),
(866, 207, 105, 1, 'System Development', NULL, 1, '', '2025-10-07 09:50:05'),
(867, 207, 106, 1, 'Research', NULL, 1, '', '2025-10-07 09:50:05'),
(868, 207, 107, 2, 'Research', NULL, 2, '', '2025-10-07 09:50:05'),
(869, 207, 108, 3, 'Research', NULL, 3, '', '2025-10-07 09:50:05'),
(870, 207, 109, 4, 'Research', NULL, 4, '', '2025-10-07 09:50:05'),
(871, 207, 110, 5, 'Research', NULL, 5, '', '2025-10-07 09:50:05'),
(872, 207, 111, 5, 'Technical Support', NULL, 5, '', '2025-10-07 09:50:05'),
(873, 207, 112, 4, 'Technical Support', NULL, 4, '', '2025-10-07 09:50:05'),
(874, 207, 113, 3, 'Technical Support', NULL, 3, '', '2025-10-07 09:50:05'),
(875, 207, 114, 2, 'Technical Support', NULL, 2, '', '2025-10-07 09:50:05'),
(876, 207, 115, 1, 'Technical Support', NULL, 1, '', '2025-10-07 09:50:05'),
(877, 207, 116, 1, 'Business Operation', NULL, 1, '', '2025-10-07 09:50:05'),
(878, 207, 117, 2, 'Business Operation', NULL, 2, '', '2025-10-07 09:50:05'),
(879, 207, 118, 3, 'Business Operation', NULL, 3, '', '2025-10-07 09:50:05'),
(880, 207, 119, 4, 'Business Operation', NULL, 4, '', '2025-10-07 09:50:05'),
(881, 207, 120, 5, 'Business Operation', NULL, 5, '', '2025-10-07 09:50:05'),
(882, 207, 135, 5, 'Personal and Interpersonal Skills', NULL, 5, '', '2025-10-07 09:50:05'),
(883, 207, 136, 4, 'Personal and Interpersonal Skills', NULL, 4, '', '2025-10-07 09:50:05'),
(884, 207, 137, 3, 'Personal and Interpersonal Skills', NULL, 3, '', '2025-10-07 09:50:05'),
(885, 207, 138, 2, 'Personal and Interpersonal Skills', NULL, 2, '', '2025-10-07 09:50:05'),
(886, 207, 139, 1, 'Personal and Interpersonal Skills', NULL, 1, '', '2025-10-07 09:50:05'),
(887, 207, 140, 2, 'Personal and Interpersonal Skills', NULL, 2, '', '2025-10-07 09:50:05'),
(888, 207, 141, 3, 'Personal and Interpersonal Skills', NULL, 3, '', '2025-10-07 09:50:05');

-- --------------------------------------------------------

--
-- Table structure for table `pre_assessment`
--

CREATE TABLE `pre_assessment` (
  `id` int(11) NOT NULL,
  `STUDENT_ID` int(11) NOT NULL,
  `CC 102` int(11) DEFAULT NULL,
  `CC 103` int(11) DEFAULT NULL,
  `PF 101` int(11) DEFAULT NULL,
  `CC 104` int(11) DEFAULT NULL,
  `IPT 101` int(11) DEFAULT NULL,
  `IPT 102` int(11) DEFAULT NULL,
  `CC 106` int(11) DEFAULT NULL,
  `CC 105` int(11) DEFAULT NULL,
  `IM 101` int(11) DEFAULT NULL,
  `IM 102` int(11) DEFAULT NULL,
  `HCI 101` int(11) DEFAULT NULL,
  `HCI 102` int(11) DEFAULT NULL,
  `WS 101` int(11) DEFAULT NULL,
  `NET 101` int(11) DEFAULT NULL,
  `NET 102` int(11) DEFAULT NULL,
  `IAS 101` int(11) DEFAULT NULL,
  `IAS 102` int(11) DEFAULT NULL,
  `CAP 101` int(11) DEFAULT NULL,
  `CAP 102` int(11) DEFAULT NULL,
  `SP 101` int(11) DEFAULT NULL,
  `soft_skill` float DEFAULT NULL,
  `communication_skill` float DEFAULT NULL,
  `ojt_placement` varchar(255) DEFAULT NULL,
  `prediction_reasoning` text DEFAULT NULL,
  `prediction_probabilities` text DEFAULT NULL,
  `post_systems_development_avg` float DEFAULT NULL,
  `post_research_avg` float DEFAULT NULL,
  `post_business_operations_avg` float DEFAULT NULL,
  `post_technical_support_avg` float DEFAULT NULL,
  `self_systems_development_avg` float DEFAULT NULL,
  `self_research_avg` float DEFAULT NULL,
  `self_business_operations_avg` float DEFAULT NULL,
  `self_technical_support_avg` float DEFAULT NULL,
  `supervisor_comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pre_assessment`
--

INSERT INTO `pre_assessment` (`id`, `STUDENT_ID`, `CC 102`, `CC 103`, `PF 101`, `CC 104`, `IPT 101`, `IPT 102`, `CC 106`, `CC 105`, `IM 101`, `IM 102`, `HCI 101`, `HCI 102`, `WS 101`, `NET 101`, `NET 102`, `IAS 101`, `IAS 102`, `CAP 101`, `CAP 102`, `SP 101`, `soft_skill`, `communication_skill`, `ojt_placement`, `prediction_reasoning`, `prediction_probabilities`, `post_systems_development_avg`, `post_research_avg`, `post_business_operations_avg`, `post_technical_support_avg`, `self_systems_development_avg`, `self_research_avg`, `self_business_operations_avg`, `self_technical_support_avg`, `supervisor_comment`) VALUES
(15, 12345, 85, 88, 90, 87, 92, 89, 91, 86, 90, 88, 87, 85, 90, 92, 88, 91, 89, 90, 87, 90, 5, 5, 'Systems Development', 'Recommended for Systems Development due to strong performance in: IPT 101: 92.0, CC 106: 91.0, PF 101: 90.0 (average: 88.64).\n\nBoth soft skill and communication skill ratings reinforce the suitability of this placement.', '{\"Business Operations\":15,\"OJT Placement\":7,\"Research\":18,\"Systems Development\":60}', 3, 4.2, 3, 5, 3, 3, 3, 3, 'charles'),
(16, 67890, 90, 92, 88, 91, 87, 90, 89, 92, 91, 90, 88, 89, 92, 91, 90, 88, 89, 92, 91, 92, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `report_images`
--

CREATE TABLE `report_images` (
  `image_id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `image_filename` varchar(255) NOT NULL,
  `day_of_week` enum('monday','tuesday','wednesday','thursday','friday') DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `report_images`
--

INSERT INTO `report_images` (`image_id`, `report_id`, `image_filename`, `day_of_week`, `uploaded_at`) VALUES
(156, 6, '68c7ac4c35d04_1757916236_monday.jpg', 'monday', '2025-09-15 06:16:07'),
(157, 6, '68c7ac4c360fc_1757916236_tuesday.jpg', 'tuesday', '2025-09-15 06:16:07'),
(158, 6, '68c7ac4c3651b_1757916236_wednesday.jpg', 'wednesday', '2025-09-15 06:16:07'),
(159, 6, '68c7ac4c3690b_1757916236_thursday.jpg', 'thursday', '2025-09-15 06:16:07'),
(160, 6, '68c7ac4c36d50_1757916236_friday.jpg', 'friday', '2025-09-15 06:16:07'),
(324, 7, '68cbba545488f_1758181972_monday.jpg', 'monday', '2025-09-19 09:00:31'),
(325, 7, '68cbba81e9fb8_1758182017_tuesday.jpg', 'tuesday', '2025-09-19 09:00:31'),
(326, 7, '68cbba81ea3dd_1758182017_wednesday.jpg', 'wednesday', '2025-09-19 09:00:31'),
(327, 7, '68cbba81ea848_1758182017_thursday.jpg', 'thursday', '2025-09-19 09:00:31'),
(328, 7, '68cbba81eadc1_1758182017_friday.jpg', 'friday', '2025-09-19 09:00:31'),
(374, 8, '68d0cda71635c_1758514599_monday.jpg', 'monday', '2025-09-22 10:57:49'),
(375, 8, '68d12baa0c60b_1758538666_tuesday.jpg', 'tuesday', '2025-09-22 10:57:49'),
(376, 8, '68d0cda717d6e_1758514599_wednesday.jpg', 'wednesday', '2025-09-22 10:57:49'),
(377, 8, '68d0cda7186c1_1758514599_thursday.jpg', 'thursday', '2025-09-22 10:57:49'),
(378, 8, '68d0cda718e2f_1758514599_friday.jpg', 'friday', '2025-09-22 10:57:49'),
(379, 9, '68d12491891b6_1758536849_monday.jpg', 'monday', '2025-09-23 07:19:11'),
(380, 9, '68d12491898df_1758536849_tuesday.jpg', 'tuesday', '2025-09-23 07:19:11'),
(381, 9, '68d124918a183_1758536849_wednesday.jpg', 'wednesday', '2025-09-23 07:19:11'),
(382, 9, '68d124918a9fe_1758536849_thursday.jpg', 'thursday', '2025-09-23 07:19:11'),
(383, 9, '68d124918b130_1758536849_friday.jpg', 'friday', '2025-09-23 07:19:11'),
(403, 10, '68db79fd77ac1_1759214077_monday.png', 'monday', '2025-09-30 06:37:32'),
(404, 10, '68db70f9ebd6f_1759211769_tuesday.jpg', 'tuesday', '2025-09-30 06:37:32'),
(405, 10, '68db70f9ec960_1759211769_wednesday.jpg', 'wednesday', '2025-09-30 06:37:32'),
(406, 10, '68db70f9ed57c_1759211769_thursday.jpg', 'thursday', '2025-09-30 06:37:32'),
(407, 10, '68db70f9ee21f_1759211769_friday.jpg', 'friday', '2025-09-30 06:37:32'),
(417, 11, '68db770dee958_1759213325_monday.jpg', 'monday', '2025-09-30 07:59:00'),
(418, 11, '68db8d4b3c55d_1759219019_tuesday.jpg', 'tuesday', '2025-09-30 07:59:00'),
(419, 11, '68db8d9923951_1759219097_wednesday.jpg', 'wednesday', '2025-09-30 07:59:00'),
(420, 11, '68db8d9923f6f_1759219097_thursday.jpg', 'thursday', '2025-09-30 07:59:00'),
(421, 11, '68db8d99245b5_1759219097_friday.jpg', 'friday', '2025-09-30 07:59:00'),
(422, 12, '68db91e4e82df_1759220196_monday.jpg', 'monday', '2025-09-30 08:16:36');

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
(13, 256, '598289111', 'Kim', '2025-07-02 00:26:39', NULL),
(14, 258, '59828110', 'Kim', '2025-08-22 18:42:30', NULL),
(15, 255, '59828996', 'Kim', '2025-08-22 18:55:44', NULL),
(16, 249, '59823605', 'Carlo', '2025-08-24 14:06:16', NULL),
(17, 248, '59823604', 'Jin', '2025-08-24 14:06:53', NULL),
(18, 260, '12345678', 'test', '2025-09-10 14:28:04', NULL),
(19, 261, '12345678', 'tset', '2025-09-10 19:00:45', NULL),
(20, 262, '12345678', 'test', '2025-09-10 19:29:36', NULL),
(21, 263, '12345678', 'test', '2025-09-24 14:09:33', NULL),
(22, 264, '12345', 'John Doe', '2025-10-03 14:01:20', NULL),
(23, 265, '67890', 'Jane Smith', '2025-10-03 14:01:20', NULL),
(24, 266, '12345', 'John Doe', '2025-10-03 14:07:15', NULL),
(25, 267, '67890', 'Jane Smith', '2025-10-03 14:07:15', NULL),
(26, 268, '12345', 'John Doe', '2025-10-03 14:17:31', NULL),
(27, 269, '67890', 'Jane Smith', '2025-10-03 14:17:31', NULL),
(28, 270, '12345', 'John Doe', '2025-10-03 14:29:36', NULL),
(29, 271, '67890', 'Jane Smith', '2025-10-03 14:29:36', NULL),
(30, 272, '12345', 'John', '2025-10-03 14:44:52', NULL),
(31, 273, '67890', 'Jane', '2025-10-03 14:44:52', NULL),
(32, 274, '12345', 'John', '2025-10-03 15:00:15', NULL),
(33, 275, '67890', 'Jane', '2025-10-03 15:00:15', NULL),
(34, 276, '12345', 'John', '2025-10-03 15:06:39', NULL),
(35, 277, '67890', 'Jane', '2025-10-03 15:06:39', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student_evaluation`
--

CREATE TABLE `student_evaluation` (
  `id` int(11) NOT NULL,
  `STUDENT_ID` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer` text NOT NULL,
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_evaluation`
--

INSERT INTO `student_evaluation` (`id`, `STUDENT_ID`, `question_id`, `answer`, `timestamp`) VALUES
(84, 12345, 1, '1', '2025-10-03 16:32:39'),
(85, 12345, 2, '2', '2025-10-03 16:32:39'),
(86, 12345, 3, '3', '2025-10-03 16:32:39'),
(87, 12345, 4, '4', '2025-10-03 16:32:39'),
(88, 12345, 5, '5', '2025-10-03 16:32:39'),
(89, 12345, 6, '6', '2025-10-03 16:32:39'),
(90, 12345, 7, '7', '2025-10-03 16:32:39'),
(91, 12345, 8, '8', '2025-10-03 16:32:39'),
(92, 12345, 9, '9', '2025-10-03 16:32:39'),
(93, 12345, 10, '0', '2025-10-03 16:32:39'),
(94, 12345, 11, '1', '2025-10-03 16:32:39'),
(95, 12345, 12, '2', '2025-10-03 16:32:39'),
(96, 12345, 13, '3', '2025-10-03 16:32:39'),
(97, 12345, 14, '4', '2025-10-03 16:32:39'),
(98, 12345, 15, '5', '2025-10-03 16:32:39'),
(99, 12345, 16, '6', '2025-10-03 16:32:39'),
(100, 12345, 17, '7', '2025-10-03 16:32:39'),
(101, 12345, 18, '8', '2025-10-03 16:32:39'),
(102, 12345, 19, '9', '2025-10-03 16:32:39'),
(103, 12345, 20, '0', '2025-10-03 16:32:39'),
(404, 59828881, 1, '1', '2025-10-03 21:46:28'),
(405, 59828881, 2, '1', '2025-10-03 21:46:28'),
(406, 59828881, 3, '1', '2025-10-03 21:46:28'),
(407, 59828881, 4, '1', '2025-10-03 21:46:28'),
(408, 59828881, 5, '1', '2025-10-03 21:46:28'),
(409, 59828881, 6, '1', '2025-10-03 21:46:28'),
(410, 59828881, 7, '1', '2025-10-03 21:46:28'),
(411, 59828881, 8, '1', '2025-10-03 21:46:28'),
(412, 59828881, 9, '1', '2025-10-03 21:46:28'),
(413, 59828881, 10, '1', '2025-10-03 21:46:28'),
(414, 59828881, 11, '1', '2025-10-03 21:46:28'),
(415, 59828881, 12, '1', '2025-10-03 21:46:28'),
(416, 59828881, 13, '1', '2025-10-03 21:46:28'),
(417, 59828881, 14, '1', '2025-10-03 21:46:28'),
(418, 59828881, 15, '1', '2025-10-03 21:46:28'),
(419, 59828881, 16, '1', '2025-10-03 21:46:28'),
(420, 59828881, 17, '1', '2025-10-03 21:46:28'),
(421, 59828881, 18, '1', '2025-10-03 21:46:28'),
(422, 59828881, 19, '1', '2025-10-03 21:46:28'),
(423, 59828881, 20, '1', '2025-10-03 21:46:28'),
(424, 59829532, 1, '1', '2025-10-06 18:38:16'),
(425, 59829532, 2, '1', '2025-10-06 18:38:16'),
(426, 59829532, 3, '1', '2025-10-06 18:38:16'),
(427, 59829532, 4, '1', '2025-10-06 18:38:16'),
(428, 59829532, 5, '1', '2025-10-06 18:38:16'),
(429, 59829532, 6, '1', '2025-10-06 18:38:16'),
(430, 59829532, 7, '1', '2025-10-06 18:38:16'),
(431, 59829532, 8, '1', '2025-10-06 18:38:16'),
(432, 59829532, 9, '1', '2025-10-06 18:38:16'),
(433, 59829532, 10, '1', '2025-10-06 18:38:16'),
(434, 59829532, 11, '1', '2025-10-06 18:38:16'),
(435, 59829532, 12, '1', '2025-10-06 18:38:16'),
(436, 59829532, 13, '1', '2025-10-06 18:38:16'),
(437, 59829532, 14, '1', '2025-10-06 18:38:16'),
(438, 59829532, 15, '1', '2025-10-06 18:38:16'),
(439, 59829532, 16, '1', '2025-10-06 18:38:16'),
(440, 59829532, 17, '1', '2025-10-06 18:38:16'),
(441, 59829532, 18, '1', '2025-10-06 18:38:16'),
(442, 59829532, 19, '1', '2025-10-06 18:38:16'),
(443, 59829532, 20, '1', '2025-10-06 18:38:16'),
(444, 59832315, 1, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(445, 59832315, 2, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(446, 59832315, 3, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(447, 59832315, 4, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(448, 59832315, 5, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(449, 59832315, 6, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(450, 59832315, 7, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(451, 59832315, 8, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(452, 59832315, 9, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(453, 59832315, 10, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(454, 59832315, 11, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(455, 59832315, 12, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(456, 59832315, 13, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(457, 59832315, 14, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(458, 59832315, 15, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(459, 59832315, 16, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(460, 59832315, 17, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(461, 59832315, 18, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(462, 59832315, 19, 'Welcome back, Harold!', '2025-10-06 18:58:31'),
(463, 59832315, 20, 'Welcome back, Harold!', '2025-10-06 18:58:31');

-- --------------------------------------------------------

--
-- Table structure for table `student_questions`
--

CREATE TABLE `student_questions` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `category` varchar(50) NOT NULL,
  `question_text` text NOT NULL,
  `question_number` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_questions`
--

INSERT INTO `student_questions` (`id`, `student_id`, `category`, `question_text`, `question_number`, `created_at`) VALUES
(1, 190, 'System Development', 'System Development', 1, '2025-10-04 18:22:47'),
(2, 190, 'System Development', 'System Development', 2, '2025-10-04 18:22:47'),
(3, 190, 'Research', 'Research', 1, '2025-10-04 18:22:47'),
(4, 190, 'Research', 'Research', 2, '2025-10-04 18:22:47'),
(5, 190, 'Technical Support', 'Technical Support', 1, '2025-10-04 18:22:47'),
(6, 190, 'Technical Support', 'Technical Support', 2, '2025-10-04 18:22:47'),
(7, 190, 'Business Operation', 'Business Operation', 1, '2025-10-04 18:22:47'),
(8, 190, 'Business Operation', 'Business Operation', 2, '2025-10-04 18:22:47'),
(49, 206, 'System Development', 'aweaweaweaweaweaweawe', 1, '2025-10-05 07:34:46'),
(50, 206, 'System Development', 'aweaweaweaweaweaweawe', 2, '2025-10-05 07:34:46'),
(51, 206, 'Research', 'awe', 1, '2025-10-05 07:34:46'),
(52, 206, 'Research', 'awe', 2, '2025-10-05 07:34:46'),
(53, 206, 'Technical Support', 'awe', 1, '2025-10-05 07:34:46'),
(54, 206, 'Technical Support', 'awe', 2, '2025-10-05 07:34:46'),
(55, 206, 'Business Operation', 'awe', 1, '2025-10-05 07:34:46'),
(56, 206, 'Business Operation', 'awe', 2, '2025-10-05 07:34:46'),
(57, 190, 'System Development', 'System Development', 3, '2025-10-05 10:17:44'),
(58, 190, 'System Development', 'System Development', 4, '2025-10-05 10:17:44'),
(59, 190, 'System Development', 'System Development', 5, '2025-10-05 10:17:44'),
(60, 190, 'Research', 'Research', 3, '2025-10-05 10:17:44'),
(61, 190, 'Research', 'Research', 4, '2025-10-05 10:17:44'),
(62, 190, 'Research', 'Research', 5, '2025-10-05 10:17:44'),
(63, 190, 'Technical Support', 'Technical Support', 3, '2025-10-05 10:17:44'),
(64, 190, 'Technical Support', 'Technical Support', 4, '2025-10-05 10:17:44'),
(65, 190, 'Technical Support', 'Technical Support', 5, '2025-10-05 10:17:44'),
(66, 190, 'Business Operation', 'Business Operation', 3, '2025-10-05 10:17:44'),
(67, 190, 'Business Operation', 'Business Operation', 4, '2025-10-05 10:17:44'),
(68, 190, 'Business Operation', 'Business Operation', 5, '2025-10-05 10:17:44'),
(69, 206, 'System Development', 'System Development', 3, '2025-10-05 15:26:41'),
(70, 206, 'System Development', 'System Development', 4, '2025-10-05 15:26:41'),
(71, 206, 'System Development', 'System Development', 5, '2025-10-05 15:26:41'),
(72, 206, 'Research', 'Research', 3, '2025-10-05 15:26:41'),
(73, 206, 'Research', 'Research', 4, '2025-10-05 15:26:41'),
(74, 206, 'Research', 'Research', 5, '2025-10-05 15:26:41'),
(75, 206, 'Technical Support', 'Technical Support', 3, '2025-10-05 15:26:41'),
(76, 206, 'Technical Support', 'Technical Support', 4, '2025-10-05 15:26:41'),
(77, 206, 'Technical Support', 'Technical Support', 5, '2025-10-05 15:26:41'),
(78, 206, 'Business Operation', 'Business Operation', 3, '2025-10-05 15:26:41'),
(79, 206, 'Business Operation', 'Business Operation', 4, '2025-10-05 15:26:41'),
(80, 206, 'Business Operation', 'Business Operation', 5, '2025-10-05 15:26:41'),
(81, 278, 'System Development', 'Welcome back, John!', 1, '2025-10-06 10:55:28'),
(82, 278, 'System Development', 'Welcome back, John!', 2, '2025-10-06 10:55:28'),
(83, 278, 'System Development', 'Welcome back, John!', 3, '2025-10-06 10:55:28'),
(84, 278, 'System Development', 'Welcome back, John!', 4, '2025-10-06 10:55:28'),
(85, 278, 'System Development', 'Welcome back, John!', 5, '2025-10-06 10:55:28'),
(86, 278, 'Research', 'Welcome back, John!', 1, '2025-10-06 10:55:28'),
(87, 278, 'Research', 'Welcome back, John!', 2, '2025-10-06 10:55:28'),
(88, 278, 'Research', 'Welcome back, John!', 3, '2025-10-06 10:55:28'),
(89, 278, 'Research', 'Welcome back, John!', 4, '2025-10-06 10:55:28'),
(90, 278, 'Research', 'Welcome back, John!', 5, '2025-10-06 10:55:28'),
(91, 278, 'Technical Support', 'Welcome back, John!', 1, '2025-10-06 10:55:28'),
(92, 278, 'Technical Support', 'Welcome back, John!', 2, '2025-10-06 10:55:28'),
(93, 278, 'Technical Support', 'Welcome back, John!', 3, '2025-10-06 10:55:28'),
(94, 278, 'Technical Support', 'Welcome back, John!', 4, '2025-10-06 10:55:28'),
(95, 278, 'Technical Support', 'Welcome back, John!', 5, '2025-10-06 10:55:28'),
(96, 278, 'Business Operation', 'Welcome back, John!', 1, '2025-10-06 10:55:28'),
(97, 278, 'Business Operation', 'Welcome back, John!', 2, '2025-10-06 10:55:28'),
(98, 278, 'Business Operation', 'Welcome back, John!', 3, '2025-10-06 10:55:28'),
(99, 278, 'Business Operation', 'Welcome back, John!', 4, '2025-10-06 10:55:28'),
(100, 278, 'Business Operation', 'Welcome back, John!', 5, '2025-10-06 10:55:29'),
(101, 207, 'System Development', 'Welcome back, Harold!', 1, '2025-10-06 10:58:59'),
(102, 207, 'System Development', 'Welcome back, Harold!', 2, '2025-10-06 10:58:59'),
(103, 207, 'System Development', 'Welcome back, Harold!', 3, '2025-10-06 10:58:59'),
(104, 207, 'System Development', 'Welcome back, Harold!', 4, '2025-10-06 10:58:59'),
(105, 207, 'System Development', 'Welcome back, Harold!', 5, '2025-10-06 10:58:59'),
(106, 207, 'Research', 'Welcome back, Harold!', 1, '2025-10-06 10:58:59'),
(107, 207, 'Research', 'Welcome back, Harold!', 2, '2025-10-06 10:58:59'),
(108, 207, 'Research', 'Welcome back, Harold!', 3, '2025-10-06 10:58:59'),
(109, 207, 'Research', 'Welcome back, Harold!', 4, '2025-10-06 10:58:59'),
(110, 207, 'Research', 'Welcome back, Harold!', 5, '2025-10-06 10:58:59'),
(111, 207, 'Technical Support', 'Welcome back, Harold!', 1, '2025-10-06 10:58:59'),
(112, 207, 'Technical Support', 'Welcome back, Harold!', 2, '2025-10-06 10:58:59'),
(113, 207, 'Technical Support', 'Welcome back, Harold!', 3, '2025-10-06 10:58:59'),
(114, 207, 'Technical Support', 'Welcome back, Harold!', 4, '2025-10-06 10:58:59'),
(115, 207, 'Technical Support', 'Welcome back, Harold!', 5, '2025-10-06 10:58:59'),
(116, 207, 'Business Operation', 'Welcome back, Harold!', 1, '2025-10-06 10:58:59'),
(117, 207, 'Business Operation', 'Welcome back, Harold!', 2, '2025-10-06 10:58:59'),
(118, 207, 'Business Operation', 'Welcome back, Harold!', 3, '2025-10-06 10:58:59'),
(119, 207, 'Business Operation', 'Welcome back, Harold!', 4, '2025-10-06 10:58:59'),
(120, 207, 'Business Operation', 'Welcome back, Harold!', 5, '2025-10-06 10:58:59'),
(121, 190, 'Personal and Interpersonal Skills', 'Demonstrated the ability to integrate theories learned in school and the practical work in your company.', 1, '2025-10-06 18:11:10'),
(122, 190, 'Personal and Interpersonal Skills', 'Demonstrated evidence of growth as a result of his apprenticeship.', 2, '2025-10-06 18:11:10'),
(123, 190, 'Personal and Interpersonal Skills', 'Demonstrated assertiveness and cleverness to new endeavors in the course of his/her training.', 3, '2025-10-06 18:11:10'),
(124, 190, 'Personal and Interpersonal Skills', 'Demonstrated adequate knowledge of work done.', 4, '2025-10-06 18:11:10'),
(125, 190, 'Personal and Interpersonal Skills', 'Demonstrated promptness and active attendance.', 5, '2025-10-06 18:11:10'),
(126, 278, 'Personal and Interpersonal Skills', 'Demonstrated the ability to integrate theories learned in school and the practical work in your company.', 1, '2025-10-06 19:26:51'),
(127, 278, 'Personal and Interpersonal Skills', 'Demonstrated evidence of growth as a result of his apprenticeship.', 2, '2025-10-06 19:26:51'),
(128, 278, 'Personal and Interpersonal Skills', 'Demonstrated assertiveness and cleverness to new endeavors in the course of his/her training.', 3, '2025-10-06 19:26:51'),
(129, 278, 'Personal and Interpersonal Skills', 'Demonstrated adequate knowledge of work done.', 4, '2025-10-06 19:26:51'),
(130, 278, 'Personal and Interpersonal Skills', 'Demonstrated promptness and active attendance.', 5, '2025-10-06 19:26:51'),
(131, 190, 'Personal and Interpersonal Skills', 'Demonstrated skills in inter-personal relations.', 6, '2025-10-07 06:10:31'),
(132, 190, 'Personal and Interpersonal Skills', 'Demonstrated overall performance proficiency.', 7, '2025-10-07 06:10:31'),
(133, 278, 'Personal and Interpersonal Skills', 'Demonstrated skills in inter-personal relations.', 6, '2025-10-07 09:49:17'),
(134, 278, 'Personal and Interpersonal Skills', 'Demonstrated overall performance proficiency.', 7, '2025-10-07 09:49:17'),
(135, 207, 'Personal and Interpersonal Skills', 'Demonstrated the ability to integrate theories learned in school and the practical work in your company.', 1, '2025-10-07 09:50:05'),
(136, 207, 'Personal and Interpersonal Skills', 'Demonstrated evidence of growth as a result of his apprenticeship.', 2, '2025-10-07 09:50:05'),
(137, 207, 'Personal and Interpersonal Skills', 'Demonstrated assertiveness and cleverness to new endeavors in the course of his/her training.', 3, '2025-10-07 09:50:05'),
(138, 207, 'Personal and Interpersonal Skills', 'Demonstrated adequate knowledge of work done.', 4, '2025-10-07 09:50:05'),
(139, 207, 'Personal and Interpersonal Skills', 'Demonstrated promptness and active attendance.', 5, '2025-10-07 09:50:05'),
(140, 207, 'Personal and Interpersonal Skills', 'Demonstrated skills in inter-personal relations.', 6, '2025-10-07 09:50:05'),
(141, 207, 'Personal and Interpersonal Skills', 'Demonstrated overall performance proficiency.', 7, '2025-10-07 09:50:05');

-- --------------------------------------------------------

--
-- Table structure for table `weekly_reports`
--

CREATE TABLE `weekly_reports` (
  `report_id` int(11) NOT NULL,
  `interns_id` int(11) NOT NULL,
  `week_start` date NOT NULL,
  `week_end` date NOT NULL,
  `report_content` text DEFAULT NULL,
  `status` enum('draft','submitted') DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `monday_description` text DEFAULT NULL,
  `tuesday_description` text DEFAULT NULL,
  `wednesday_description` text DEFAULT NULL,
  `thursday_description` text DEFAULT NULL,
  `friday_description` text DEFAULT NULL,
  `approval_status` enum('pending','approved','returned') DEFAULT 'pending',
  `approved_at` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `return_reason` text DEFAULT NULL,
  `notification_sent` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `weekly_reports`
--

INSERT INTO `weekly_reports` (`report_id`, `interns_id`, `week_start`, `week_end`, `report_content`, `status`, `created_at`, `updated_at`, `monday_description`, `tuesday_description`, `wednesday_description`, `thursday_description`, `friday_description`, `approval_status`, `approved_at`, `approved_by`, `return_reason`, `notification_sent`) VALUES
(6, 190, '2025-09-15', '2025-09-21', '[]', 'submitted', '2025-09-15 06:03:56', '2025-10-05 18:04:39', 'Monday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nMonday Description:\r\nvMonday Description:', 'Tuesday Description:', 'Wednesday Description:', 'Thursday Description:', 'Friday Description:', 'pending', NULL, NULL, NULL, 0),
(7, 206, '2025-09-15', '2025-09-21', '[]', 'submitted', '2025-09-15 08:14:24', '2025-09-22 10:05:46', 'dawdawd', 'awda', 'asg', 'fgfgd', 'dfgtqeta', 'approved', NULL, NULL, 'adawdawd', 0),
(8, 206, '2025-09-22', '2025-09-28', '[]', 'submitted', '2025-09-22 04:16:39', '2025-09-22 10:57:58', 'awe', 'awe', 'awe', 'aew', 'awe', 'approved', '2025-09-22 18:57:58', 59828994, 'aweaweawe', 0),
(9, 190, '2025-09-22', '2025-09-28', '[]', 'submitted', '2025-09-22 10:27:29', '2025-09-25 02:51:07', 'aweaweawe', 'aweawe', 'aweawrtasd', 'fasfasf', 'ehwerhsdf', 'approved', '2025-09-25 10:51:07', 59828994, 'awr', 0),
(10, 206, '2025-09-29', '2025-10-05', '[]', 'submitted', '2025-09-30 05:56:09', '2025-09-30 06:37:42', 'tung', 'tung', 'Tung', 'Tung', 'Sahur', 'approved', '2025-09-30 14:37:42', 59828994, 'SEGSEGSEGS', 0),
(11, 190, '2025-09-29', '2025-10-05', '[]', 'submitted', '2025-09-30 06:22:05', '2025-09-30 07:59:05', 'HTHCG', 'adawdawdawdawdawd', 'wadawdaw', 'dawdawd', 'aggag', 'approved', '2025-09-30 15:59:05', 59828994, 'awdawdawd', 0),
(12, 207, '2025-09-29', '2025-10-05', '[]', 'draft', '2025-09-30 08:16:36', '2025-09-30 08:16:36', 'waeaweawergdrgdg', '', '', '', '', NULL, NULL, NULL, NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assigned_questions`
--
ALTER TABLE `assigned_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coordinator`
--
ALTER TABLE `coordinator`
  ADD PRIMARY KEY (`COORDINATOR_ID`),
  ADD KEY `coordinator_ibfk_1` (`HTE_ID`);

--
-- Indexes for table `coordinator_evaluation`
--
ALTER TABLE `coordinator_evaluation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_student_evaluation` (`student_evaluation_id`),
  ADD KEY `fk_coordinator_eval_student` (`STUDENT_ID`);

--
-- Indexes for table `evaluation_questions`
--
ALTER TABLE `evaluation_questions`
  ADD PRIMARY KEY (`question_id`);

--
-- Indexes for table `holidays`
--
ALTER TABLE `holidays`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_date` (`date`);

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
  ADD PRIMARY KEY (`INTERNS_ID`),
  ADD UNIQUE KEY `STUDENT_ID` (`STUDENT_ID`);

--
-- Indexes for table `intern_details`
--
ALTER TABLE `intern_details`
  ADD PRIMARY KEY (`INTERNS_ID`,`SESSION_ID`,`HTE_ID`),
  ADD KEY `ID` (`SESSION_ID`),
  ADD KEY `HTE_ID` (`HTE_ID`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `student_id` (`receiver_id`),
  ADD KEY `reference_id` (`reference_id`);

--
-- Indexes for table `pending_attendance`
--
ALTER TABLE `pending_attendance`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `intern_id` (`INTERNS_ID`),
  ADD KEY `hte_id` (`HTE_ID`);

--
-- Indexes for table `post_assessment`
--
ALTER TABLE `post_assessment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_question_id` (`question_id`);

--
-- Indexes for table `pre_assessment`
--
ALTER TABLE `pre_assessment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_preassess_student` (`STUDENT_ID`);

--
-- Indexes for table `report_images`
--
ALTER TABLE `report_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `report_id` (`report_id`);

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
-- Indexes for table `student_evaluation`
--
ALTER TABLE `student_evaluation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_student_eval_student` (`STUDENT_ID`);

--
-- Indexes for table `student_questions`
--
ALTER TABLE `student_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `weekly_reports`
--
ALTER TABLE `weekly_reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `interns_id` (`interns_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assigned_questions`
--
ALTER TABLE `assigned_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coordinator`
--
ALTER TABLE `coordinator`
  MODIFY `COORDINATOR_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123456791;

--
-- AUTO_INCREMENT for table `coordinator_evaluation`
--
ALTER TABLE `coordinator_evaluation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=643;

--
-- AUTO_INCREMENT for table `evaluation_questions`
--
ALTER TABLE `evaluation_questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `holidays`
--
ALTER TABLE `holidays`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `host_training_establishment`
--
ALTER TABLE `host_training_establishment`
  MODIFY `HTE_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `interns_details`
--
ALTER TABLE `interns_details`
  MODIFY `INTERNS_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=280;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `pending_attendance`
--
ALTER TABLE `pending_attendance`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `post_assessment`
--
ALTER TABLE `post_assessment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=889;

--
-- AUTO_INCREMENT for table `pre_assessment`
--
ALTER TABLE `pre_assessment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `report_images`
--
ALTER TABLE `report_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=423;

--
-- AUTO_INCREMENT for table `session_details`
--
ALTER TABLE `session_details`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `student_deletion_log`
--
ALTER TABLE `student_deletion_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `student_evaluation`
--
ALTER TABLE `student_evaluation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=464;

--
-- AUTO_INCREMENT for table `student_questions`
--
ALTER TABLE `student_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;

--
-- AUTO_INCREMENT for table `weekly_reports`
--
ALTER TABLE `weekly_reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `coordinator`
--
ALTER TABLE `coordinator`
  ADD CONSTRAINT `coordinator_ibfk_1` FOREIGN KEY (`HTE_ID`) REFERENCES `host_training_establishment` (`HTE_ID`) ON DELETE CASCADE;

--
-- Constraints for table `coordinator_evaluation`
--
ALTER TABLE `coordinator_evaluation`
  ADD CONSTRAINT `fk_coordinator_eval_student` FOREIGN KEY (`STUDENT_ID`) REFERENCES `interns_details` (`STUDENT_ID`),
  ADD CONSTRAINT `fk_student_evaluation` FOREIGN KEY (`student_evaluation_id`) REFERENCES `student_evaluation` (`id`);

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
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`receiver_id`) REFERENCES `interns_details` (`INTERNS_ID`),
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`reference_id`) REFERENCES `weekly_reports` (`report_id`),
  ADD CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`reference_id`) REFERENCES `weekly_reports` (`report_id`) ON DELETE SET NULL;

--
-- Constraints for table `pending_attendance`
--
ALTER TABLE `pending_attendance`
  ADD CONSTRAINT `pending_attendance_ibfk_1` FOREIGN KEY (`INTERNS_ID`) REFERENCES `interns_details` (`INTERNS_ID`),
  ADD CONSTRAINT `pending_attendance_ibfk_2` FOREIGN KEY (`hte_id`) REFERENCES `host_training_establishment` (`HTE_ID`);

--
-- Constraints for table `post_assessment`
--
ALTER TABLE `post_assessment`
  ADD CONSTRAINT `fk_question_id` FOREIGN KEY (`question_id`) REFERENCES `student_questions` (`id`),
  ADD CONSTRAINT `post_assessment_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `student_questions` (`id`);

--
-- Constraints for table `pre_assessment`
--
ALTER TABLE `pre_assessment`
  ADD CONSTRAINT `fk_preassess_student` FOREIGN KEY (`STUDENT_ID`) REFERENCES `interns_details` (`STUDENT_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pre_assessment_ibfk_1` FOREIGN KEY (`STUDENT_ID`) REFERENCES `interns_details` (`STUDENT_ID`);

--
-- Constraints for table `report_images`
--
ALTER TABLE `report_images`
  ADD CONSTRAINT `report_images_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `weekly_reports` (`report_id`) ON DELETE CASCADE;

--
-- Constraints for table `student_evaluation`
--
ALTER TABLE `student_evaluation`
  ADD CONSTRAINT `fk_student_eval_student` FOREIGN KEY (`STUDENT_ID`) REFERENCES `interns_details` (`STUDENT_ID`);

--
-- Constraints for table `weekly_reports`
--
ALTER TABLE `weekly_reports`
  ADD CONSTRAINT `weekly_reports_ibfk_1` FOREIGN KEY (`interns_id`) REFERENCES `interns_details` (`INTERNS_ID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
