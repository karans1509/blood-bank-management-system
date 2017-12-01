-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 30, 2017 at 08:06 PM
-- Server version: 5.7.14
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bloodbankmanagement`
--

-- --------------------------------------------------------

--
-- Table structure for table `blood`
--

CREATE TABLE `blood` (
  `bloodCode` int(5) NOT NULL,
  `bloodType` varchar(5) NOT NULL,
  `cost` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `blood`
--

INSERT INTO `blood` (`bloodCode`, `bloodType`, `cost`) VALUES
(1, 'A+', 10),
(2, 'A-', 10),
(3, 'B+', 10),
(4, 'B-', 10),
(5, 'AB+', 10),
(6, 'AB-', 10),
(7, 'O+', 0),
(8, 'O-', 10);

-- --------------------------------------------------------

--
-- Table structure for table `bloodbank`
--

CREATE TABLE `bloodbank` (
  `bno` int(10) NOT NULL,
  `b_name` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bloodbank`
--

INSERT INTO `bloodbank` (`bno`, `b_name`) VALUES
(1, 'Langara');

-- --------------------------------------------------------

--
-- Table structure for table `donation`
--

CREATE TABLE `donation` (
  `donorId` int(10) NOT NULL,
  `donationDate` date NOT NULL,
  `bloodType` varchar(10) NOT NULL,
  `units` int(5) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `donation`
--

INSERT INTO `donation` (`donorId`, `donationDate`, `bloodType`, `units`) VALUES
(1, '2017-11-19', 'A+', 1),
(5, '2017-11-19', 'O+', 1),
(3, '2017-11-19', 'B+', 1),
(7, '2017-11-19', 'B-', 1),
(1, '2017-11-20', 'A+', 1),
(3, '2017-11-20', 'B+', 1),
(7, '2017-11-20', 'B-', 2),
(5, '2017-11-20', 'O+', 1),
(3, '2017-11-21', 'B+', 1),
(1, '2017-11-22', 'A+', 1),
(1, '2017-11-27', 'A+', 1);

-- --------------------------------------------------------

--
-- Table structure for table `donor`
--

CREATE TABLE `donor` (
  `donorId` int(10) NOT NULL,
  `d_name` varchar(30) NOT NULL,
  `d_address` varchar(50) NOT NULL,
  `d_gender` varchar(20) NOT NULL,
  `bloodType` varchar(10) NOT NULL,
  `d_age` int(5) NOT NULL,
  `d_phone` varchar(20) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `donor`
--

INSERT INTO `donor` (`donorId`, `d_name`, `d_address`, `d_gender`, `bloodType`, `d_age`, `d_phone`) VALUES
(1, 'karan', 'stamford st', 'Male', 'A+', 25, '9876543210'),
(3, 'Dilpreet', 'clinton street', 'Female', 'B+', 23, '12347586758'),
(7, 'Adam', 'fraser street', 'Male', 'B-', 24, '1445553'),
(8, 'Mike', 'fraser st', 'Male', 'AB-', 20, '9876543210'),
(10, 'jon', 'winterfell', 'Male', 'A+', 25, '2222222');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `empId` int(11) NOT NULL,
  `empName` varchar(30) NOT NULL,
  `position` varchar(100) NOT NULL,
  `empAddress` varchar(30) NOT NULL,
  `empPhone` int(10) NOT NULL,
  `empEmail` varchar(30) NOT NULL,
  `bno` int(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`empId`, `empName`, `position`, `empAddress`, `empPhone`, `empEmail`, `bno`) VALUES
(1, 'Karan Saini', 'manager', 'Stamford Street', 1234567890, 'ksaini02@langara.ca', 1),
(2, 'Dilpreet Kaur', 'receptionist', '49 Street, Burnaby', 1234567890, 'dsanghera00@langara.ca', 1);

-- --------------------------------------------------------

--
-- Table structure for table `hospital`
--

CREATE TABLE `hospital` (
  `h_name` varchar(50) NOT NULL,
  `h_address` varchar(50) NOT NULL,
  `h_phone` int(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `hospital`
--

INSERT INTO `hospital` (`h_name`, `h_address`, `h_phone`) VALUES
('Hospital A', '41 Avenue ', 987654321);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `bno` int(10) NOT NULL,
  `requestedBy` varchar(50) NOT NULL,
  `requestedBloodType` varchar(5) NOT NULL,
  `orderDate` date NOT NULL,
  `issued` text NOT NULL,
  `issuedOn` date DEFAULT NULL,
  `requestedUnits` int(5) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`bno`, `requestedBy`, `requestedBloodType`, `orderDate`, `issued`, `issuedOn`, `requestedUnits`) VALUES
(1, 'Hospital A', 'A+', '2017-11-21', 'Yes', '2017-11-21', 1),
(1, 'Hospital A', 'AB+', '2017-11-22', 'Yes', '2017-11-22', 1),
(1, 'Hospital A', 'O-', '2017-11-22', 'Pending', NULL, 3),
(1, 'Hospital A', 'A+', '2017-11-22', 'Yes', '2017-11-22', 2),
(1, 'Hospital A', 'B-', '2017-11-27', 'Yes', '2017-11-27', 1);

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `bno` int(10) NOT NULL,
  `bloodType` varchar(10) NOT NULL,
  `units` int(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`bno`, `bloodType`, `units`) VALUES
(1, 'A+', 5),
(1, 'A-', 0),
(1, 'B+', 3),
(1, 'B-', 3),
(1, 'O-', 0),
(1, 'O+', 2),
(1, 'AB+', 0),
(1, 'AB-', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blood`
--
ALTER TABLE `blood`
  ADD PRIMARY KEY (`bloodCode`);

--
-- Indexes for table `bloodbank`
--
ALTER TABLE `bloodbank`
  ADD PRIMARY KEY (`bno`);

--
-- Indexes for table `donation`
--
ALTER TABLE `donation`
  ADD PRIMARY KEY (`donorId`,`donationDate`);

--
-- Indexes for table `donor`
--
ALTER TABLE `donor`
  ADD PRIMARY KEY (`donorId`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`empId`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`bno`,`bloodType`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blood`
--
ALTER TABLE `blood`
  MODIFY `bloodCode` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `bloodbank`
--
ALTER TABLE `bloodbank`
  MODIFY `bno` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `donor`
--
ALTER TABLE `donor`
  MODIFY `donorId` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `empId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
