-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 19, 2026 at 02:55 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `growlab_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password_hash`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', 'admin@growlab.test', '$2y$10$QCYDUPrAyYGj4F3XqZACCuFj1ABbQeOwhP7LMnQWM8rXeNpEMgTjC', '2026-09-28 19:27:33', '2026-09-28 19:27:33');

-- --------------------------------------------------------

--
-- Table structure for table `admin_tokens`
--

CREATE TABLE `admin_tokens` (
  `id` int(10) UNSIGNED NOT NULL,
  `admin_id` int(10) UNSIGNED NOT NULL,
  `token` char(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_tokens`
--

INSERT INTO `admin_tokens` (`id`, `admin_id`, `token`, `expires_at`, `created_at`) VALUES
(1, 1, 'c0d69f351657f8ca57da6f9cf3682b49b854f2c4b2bc02a8b9437f3eb5e23a39', '2026-10-09 18:48:19', '2026-10-02 18:48:19'),
(2, 1, '9bea458e782383b945d0bedf98c7aa9ad88e2ae4cb80467d1b3a47c8508d4734', '2026-10-10 05:32:21', '2026-10-03 05:32:21'),
(3, 1, '525c6e307bc5b5555d5e8eb0be7cd4bd4ebc972dc7587b2cecebb48050f98ba9', '2026-10-10 17:23:25', '2026-10-03 17:23:25'),
(4, 1, '4c1e81d56afa3b9f6ba15a839a13bb17dc0fce488e3f7f26e37890e319e5eb3a', '2026-10-12 00:19:12', '2026-10-05 00:19:12'),
(5, 1, '95dde554d00fd615cf87ec7cb4ba3cd5ba7e29d15dc8137a1ce98256fa49c1c5', '2026-10-13 01:36:21', '2026-10-06 01:36:21'),
(6, 1, '9c6c1541c65323a3f1dc2228aebfabfe45c8aacdd4a86f00771265deb539f241', '2026-10-13 08:11:57', '2026-10-06 08:11:57'),
(7, 1, '15e2054eca5c7866151bf17502c45367c9049b71e77d79d23ce85d2774d2a61e', '2026-10-26 07:51:48', '2026-10-19 07:51:48');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Pupuk', 'pupuk', 'NPK, organik, hingga pupuk cair', 'active', '2026-01-15 08:00:00', '2026-08-01 10:00:00'),
(2, 'Nutrisi Tanaman', 'nutrisi', 'Vitamin & suplemen pertumbuhan', 'active', '2026-01-15 08:00:00', '2026-08-02 10:00:00'),
(3, 'Obat Tanaman', 'obat-tanaman', 'Pestisida, fungisida, herbisida', 'active', '2026-01-15 08:00:00', '2026-08-03 10:00:00'),
(4, 'Benih', 'benih', 'Sayur, buah, dan bunga pilihan', 'active', '2026-01-15 08:00:00', '2026-08-04 10:00:00'),
(5, 'Media Tanam', 'media-tanam', 'Tanah, sekam, cocopeat, kompos', 'inactive', '2026-01-15 08:00:00', '2026-10-02 18:49:58'),
(6, 'Perawatan Tanaman', 'perawatan', 'Alat & aksesoris berkebun', 'active', '2026-01-15 08:00:00', '2026-08-06 10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `status` enum('active','suspended') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `email`, `password_hash`, `phone`, `city`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Dewi Anjani', 'dewi.anjani@mail.com', '$2y$10$ZsJPTT33x1XOihLkez0jnesbBDjq1235yB7F5ZkHupcBHmJlLKa0m', '0812-3456-7890', 'Tangerang, Banten', 'active', '2026-04-10 09:00:00', '2026-09-28 19:27:33'),
(2, 'Budi Santoso', 'budi.santoso@mail.com', '$2y$10$ZsJPTT33x1XOihLkez0jnesbBDjq1235yB7F5ZkHupcBHmJlLKa0m', '0813-2211-4455', 'Bandung, Jawa Barat', 'active', '2026-01-10 09:00:00', '2026-09-28 19:27:33'),
(3, 'Siti Rahmawati', 'siti.rahmawati@mail.com', '$2y$10$ZsJPTT33x1XOihLkez0jnesbBDjq1235yB7F5ZkHupcBHmJlLKa0m', '0857-6633-1298', 'Yogyakarta', 'active', '2026-06-10 09:00:00', '2026-09-28 19:27:33'),
(4, 'Agus Prasetyo', 'agus.prasetyo@mail.com', '$2y$10$ZsJPTT33x1XOihLkez0jnesbBDjq1235yB7F5ZkHupcBHmJlLKa0m', '0821-9987-6541', 'Surabaya, Jawa Timur', 'active', '2025-10-10 09:00:00', '2026-09-28 19:27:33'),
(5, 'Rina Kusuma', 'rina.kusuma@mail.com', '$2y$10$ZsJPTT33x1XOihLkez0jnesbBDjq1235yB7F5ZkHupcBHmJlLKa0m', '0838-1122-3344', 'Semarang, Jawa Tengah', 'active', '2026-07-10 09:00:00', '2026-09-28 19:27:33'),
(6, 'Hendra Wijaya', 'hendra.wijaya@mail.com', '$2y$10$ZsJPTT33x1XOihLkez0jnesbBDjq1235yB7F5ZkHupcBHmJlLKa0m', '0812-7788-9900', 'Bekasi, Jawa Barat', 'suspended', '2026-03-10 09:00:00', '2026-09-28 19:27:33'),
(7, 'Putri Lestari', 'putri.lestari@mail.com', '$2y$10$ZsJPTT33x1XOihLkez0jnesbBDjq1235yB7F5ZkHupcBHmJlLKa0m', '0856-4433-2211', 'Depok, Jawa Barat', 'active', '2026-08-10 09:00:00', '2026-09-28 19:27:33'),
(8, 'Fajar Nugroho', 'fajar.nugroho@mail.com', '$2y$10$ZsJPTT33x1XOihLkez0jnesbBDjq1235yB7F5ZkHupcBHmJlLKa0m', '0819-5566-7788', 'Malang, Jawa Timur', 'active', '2025-12-10 09:00:00', '2026-09-28 19:27:33'),
(9, 'Ayu Wulandari', 'ayu.wulandari@mail.com', '$2y$10$ZsJPTT33x1XOihLkez0jnesbBDjq1235yB7F5ZkHupcBHmJlLKa0m', '0877-2233-4455', 'Bogor, Jawa Barat', 'active', '2026-05-10 09:00:00', '2026-09-28 19:27:33'),
(10, 'Dian Permata', 'dian.permata@mail.com', '$2y$10$ZsJPTT33x1XOihLkez0jnesbBDjq1235yB7F5ZkHupcBHmJlLKa0m', '0813-8899-0011', 'Solo, Jawa Tengah', 'active', '2026-02-10 09:00:00', '2026-09-28 19:27:33'),
(11, 'Rudi Hartono', 'rudi.hartono@mail.com', '$2y$10$ZsJPTT33x1XOihLkez0jnesbBDjq1235yB7F5ZkHupcBHmJlLKa0m', '0852-3344-5566', 'Denpasar, Bali', 'suspended', '2025-09-10 09:00:00', '2026-09-28 19:27:33'),
(12, 'Maya Sari', 'maya.sari@mail.com', '$2y$10$ZsJPTT33x1XOihLkez0jnesbBDjq1235yB7F5ZkHupcBHmJlLKa0m', '0878-6677-8899', 'Medan, Sumatera Utara', 'active', '2026-07-10 09:00:00', '2026-09-28 19:27:33'),
(13, 'Yusuf Ibrahim', 'yusuf.ibrahim@mail.com', '$2y$10$ZsJPTT33x1XOihLkez0jnesbBDjq1235yB7F5ZkHupcBHmJlLKa0m', '0821-1122-3300', 'Makassar, Sulawesi Selatan', 'active', '2026-04-10 09:00:00', '2026-09-28 19:27:33'),
(14, 'Nina Anggraini', 'nina.anggraini@mail.com', '$2y$10$ZsJPTT33x1XOihLkez0jnesbBDjq1235yB7F5ZkHupcBHmJlLKa0m', '0812-9900-1122', 'Palembang, Sumatera Selatan', 'active', '2026-08-10 09:00:00', '2026-09-28 19:27:33'),
(15, 'Wawan Setiawan', 'wawan.setiawan@mail.com', '$2y$10$ZsJPTT33x1XOihLkez0jnesbBDjq1235yB7F5ZkHupcBHmJlLKa0m', '0856-7788-9911', 'Tangerang, Banten', 'active', '2025-11-10 09:00:00', '2026-09-28 19:27:33'),
(16, 'Muh. Asrul Mulis', 'asrul@unpam.com', '$2y$10$FdmiUIkDeiwxikk0vM3kt.74MOZXfOeQWFDuPM2ugP4tN5XODj.cm', '086723189027', NULL, 'active', '2026-10-05 00:30:02', '2026-10-05 00:30:02');

-- --------------------------------------------------------

--
-- Table structure for table `customer_addresses`
--

CREATE TABLE `customer_addresses` (
  `id` int(10) UNSIGNED NOT NULL,
  `customer_id` int(10) UNSIGNED NOT NULL,
  `recipient_name` varchar(100) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `address_line` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customer_addresses`
--

INSERT INTO `customer_addresses` (`id`, `customer_id`, `recipient_name`, `phone`, `address_line`, `city`, `postal_code`, `is_default`, `created_at`) VALUES
(1, 1, 'Dewi Anjani', '0812-3456-7890', 'Jl. Kenanga No. 12, Cikupa', 'Tangerang, Banten', '15710', 1, '2026-09-28 19:27:33');

-- --------------------------------------------------------

--
-- Table structure for table `customer_tokens`
--

CREATE TABLE `customer_tokens` (
  `id` int(10) UNSIGNED NOT NULL,
  `customer_id` int(10) UNSIGNED NOT NULL,
  `token` char(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customer_tokens`
--

INSERT INTO `customer_tokens` (`id`, `customer_id`, `token`, `expires_at`, `created_at`) VALUES
(1, 1, '279b9f7cb09cb0466a1361fab708fbd976b2d92832851734ad3590571148b4fe', '2026-10-10 17:24:19', '2026-10-03 17:24:19'),
(7, 16, '068313569dfa2354ec2f9f0194284e4abad646d787c90394a89f9154e9dd31f3', '2026-10-13 01:37:19', '2026-10-06 01:37:19');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_number` varchar(30) NOT NULL,
  `customer_id` int(10) UNSIGNED NOT NULL,
  `subtotal` int(10) UNSIGNED NOT NULL,
  `shipping_cost` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `discount` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `total` int(10) UNSIGNED NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `payment_status` enum('pending','paid','refunded') NOT NULL DEFAULT 'pending',
  `status` enum('PENDING_PAYMENT','PROCESSING','READY_TO_SHIP','SHIPPED','IN_TRANSIT','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING_PAYMENT',
  `courier` varchar(100) DEFAULT NULL,
  `tracking_number` varchar(60) DEFAULT NULL,
  `estimated_departure` date DEFAULT NULL,
  `estimated_arrival_start` date DEFAULT NULL,
  `estimated_arrival_end` date DEFAULT NULL,
  `shipping_name` varchar(100) NOT NULL,
  `shipping_phone` varchar(30) NOT NULL,
  `shipping_address` varchar(255) NOT NULL,
  `shipping_city` varchar(100) NOT NULL,
  `shipping_postal_code` varchar(10) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `subtotal`, `shipping_cost`, `discount`, `total`, `payment_method`, `payment_status`, `status`, `courier`, `tracking_number`, `estimated_departure`, `estimated_arrival_start`, `estimated_arrival_end`, `shipping_name`, `shipping_phone`, `shipping_address`, `shipping_city`, `shipping_postal_code`, `created_at`, `updated_at`) VALUES
(1, 'GL-20260910-001', 1, 198000, 15000, 13000, 200000, 'Transfer Bank', 'paid', 'PROCESSING', 'JNE Reguler', 'JNE0098231455', '2026-09-11', '2026-09-13', '2026-09-15', 'Dewi Anjani', '0812-3456-7890', 'Jl. Kenanga No. 12, Cikupa', 'Tangerang, Banten', '15710', '2026-09-10 10:32:00', '2026-09-28 19:27:33'),
(2, 'GL-20260905-004', 1, 54000, 12000, 0, 66000, 'Virtual Account', 'paid', 'DELIVERED', 'SiCepat Reguler', 'SC77281940', '2026-09-06', '2026-09-08', '2026-09-09', 'Dewi Anjani', '0812-3456-7890', 'Jl. Kenanga No. 12, Cikupa', 'Tangerang, Banten', '15710', '2026-09-05 09:12:00', '2026-09-28 19:27:33'),
(3, 'GL-20260901-002', 1, 95000, 10000, 5000, 100000, 'E-Wallet (OVO/GoPay/Dana)', 'refunded', 'CANCELLED', 'J&T Express', 'JT55019283', '2026-09-02', '2026-09-04', '2026-09-05', 'Dewi Anjani', '0812-3456-7890', 'Jl. Kenanga No. 12, Cikupa', 'Tangerang, Banten', '15710', '2026-09-01 15:47:00', '2026-09-28 19:27:33'),
(4, 'GL-20261003-001', 1, 85000, 32000, 0, 117000, 'Bayar di Tempat (COD)', 'paid', 'IN_TRANSIT', 'JNE YES (Express)', 'TRK1133513', '2026-10-04', '2026-10-06', '2026-10-08', 'Dewi Anjani', '0812-3456-7890', 'GG. Assalam I', 'Tangerang, Banten', '1234', '2026-10-03 17:24:55', '2026-10-03 17:27:32'),
(5, 'GL-20261003-002', 1, 62000, 15000, 0, 77000, 'Transfer Bank', 'paid', 'READY_TO_SHIP', 'JNE Reguler', 'TRK9559806', '2026-10-04', '2026-10-06', '2026-10-08', 'Dewi Anjani', '0812-3456-7890', 'GG. Assalam I', 'Tangerang, Banten', '1234', '2026-10-03 17:50:23', '2026-10-03 21:28:30'),
(6, 'GL-20261003-003', 1, 45000, 32000, 4500, 72500, 'E-Wallet (OVO/GoPay/Dana)', 'paid', 'SHIPPED', 'JNE YES (Express)', 'TRK6904757', '2026-10-04', '2026-10-06', '2026-10-08', 'Dewi Anjani', '0812-3456-7890', 'jl. palmebang', 'Tangerang, Banten', '2341', '2026-10-03 21:27:39', '2026-10-03 21:28:13'),
(7, 'GL-20261003-004', 1, 32000, 32000, 0, 64000, 'Virtual Account', 'paid', 'PROCESSING', 'JNE YES (Express)', 'TRK9014594', '2026-10-04', '2026-10-06', '2026-10-08', 'Dewi Anjani', '0812-3456-7890', 'maluku', 'Tangerang, Banten', '2222', '2026-10-03 21:35:54', '2026-10-03 21:35:54'),
(8, 'GL-20261005-001', 1, 32000, 32000, 0, 64000, 'Bayar di Tempat (COD)', 'pending', 'PROCESSING', 'JNE YES (Express)', 'TRK8788805', '2026-10-06', '2026-10-08', '2026-10-10', 'Dewi Anjani', '0812-3456-7890', 'maluku', 'Tangerang, Banten', '2222', '2026-10-05 00:20:41', '2026-10-05 00:20:41');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED DEFAULT NULL,
  `product_name` varchar(150) NOT NULL,
  `product_image` varchar(500) DEFAULT NULL,
  `qty` int(10) UNSIGNED NOT NULL,
  `price` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `product_image`, `qty`, `price`) VALUES
(1, 1, 1, 'Pupuk NPK GrowMax 16-16-16', 'https://placehold.co/200x200/8BE62E/111111?text=NPK', 2, 85000),
(2, 1, 4, 'Vitamin B1 Perangsang Akar', 'https://placehold.co/200x200/3B82F6/111111?text=B1', 1, 28000),
(3, 2, 10, 'Benih Cabai Rawit Super F1', 'https://placehold.co/200x200/FF7A00/111111?text=Cabai', 3, 18000),
(4, 3, 16, 'Gunting Stek Tanaman Stainless', 'https://placehold.co/200x200/111111/FFFDF2?text=Gunting', 1, 35000),
(5, 3, 18, 'Pot Plastik Bulat 20cm', 'https://placehold.co/200x200/FFD21F/111111?text=Pot', 4, 15000),
(6, 4, 1, 'Pupuk NPK GrowMax 16-16-16', 'https://placehold.co/600x600/8BE62E/111111?font=roboto&text=NPK%2016-16-16', 1, 85000),
(7, 5, 20, 'Pupuk Slow Release Granul 1kg', 'https://placehold.co/600x600/FFD21F/111111?font=roboto&text=Slow%20Release', 1, 62000),
(8, 6, 2, 'Pupuk Organik Cair Daun Hijau', 'https://placehold.co/600x600/3F8F1B/111111?font=roboto&text=Organik%20Cair', 1, 45000),
(9, 7, 3, 'Pupuk Kandang Fermentasi Premium', 'https://placehold.co/600x600/D9F7B0/111111?font=roboto&text=Kandang%20Fermentasi', 1, 32000),
(10, 8, 3, 'Pupuk Kandang Fermentasi Premium', 'https://placehold.co/600x600/D9F7B0/111111?font=roboto&text=Kandang%20Fermentasi', 1, 32000);

-- --------------------------------------------------------

--
-- Table structure for table `order_status_history`
--

CREATE TABLE `order_status_history` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `status` varchar(30) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `changed_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_status_history`
--

INSERT INTO `order_status_history` (`id`, `order_id`, `status`, `note`, `changed_at`) VALUES
(1, 1, 'PENDING_PAYMENT', NULL, '2026-09-10 10:32:00'),
(2, 1, 'PROCESSING', NULL, '2026-09-10 10:35:00'),
(3, 2, 'PENDING_PAYMENT', NULL, '2026-09-05 09:12:00'),
(4, 2, 'PROCESSING', NULL, '2026-09-05 09:15:00'),
(5, 2, 'READY_TO_SHIP', NULL, '2026-09-06 09:15:00'),
(6, 2, 'IN_TRANSIT', NULL, '2026-09-07 09:15:00'),
(7, 2, 'DELIVERED', NULL, '2026-09-08 09:15:00'),
(8, 3, 'PENDING_PAYMENT', NULL, '2026-09-01 15:47:00'),
(9, 3, 'CANCELLED', NULL, '2026-09-01 15:50:00'),
(10, 4, 'PENDING_PAYMENT', NULL, '2026-10-03 17:24:55'),
(11, 4, 'PROCESSING', NULL, '2026-10-03 17:24:55'),
(12, 4, 'READY_TO_SHIP', NULL, '2026-10-03 17:25:55'),
(13, 4, 'CANCELLED', NULL, '2026-10-03 17:26:40'),
(14, 4, 'DELIVERED', NULL, '2026-10-03 17:27:20'),
(15, 4, 'IN_TRANSIT', NULL, '2026-10-03 17:27:32'),
(16, 5, 'PENDING_PAYMENT', NULL, '2026-10-03 17:50:23'),
(17, 5, 'PROCESSING', NULL, '2026-10-03 17:50:23'),
(18, 6, 'PENDING_PAYMENT', NULL, '2026-10-03 21:27:39'),
(19, 6, 'PROCESSING', NULL, '2026-10-03 21:27:39'),
(20, 6, 'SHIPPED', NULL, '2026-10-03 21:28:13'),
(21, 5, 'READY_TO_SHIP', NULL, '2026-10-03 21:28:30'),
(22, 7, 'PENDING_PAYMENT', NULL, '2026-10-03 21:35:54'),
(23, 7, 'PROCESSING', NULL, '2026-10-03 21:35:54'),
(24, 8, 'PENDING_PAYMENT', NULL, '2026-10-05 00:20:41'),
(25, 8, 'PROCESSING', NULL, '2026-10-05 00:20:41');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `sku` varchar(40) NOT NULL,
  `category_id` int(10) UNSIGNED NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `price` int(10) UNSIGNED NOT NULL,
  `original_price` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `discount` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `stock` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `minimum_stock` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `unit` varchar(20) NOT NULL DEFAULT 'pcs',
  `rating` decimal(2,1) NOT NULL DEFAULT 0.0,
  `sold` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `short_description` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `usage_instructions` text DEFAULT NULL,
  `composition` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `sku`, `category_id`, `brand`, `price`, `original_price`, `discount`, `stock`, `minimum_stock`, `unit`, `rating`, `sold`, `status`, `short_description`, `description`, `usage_instructions`, `composition`, `created_at`, `updated_at`) VALUES
(1, 'Pupuk NPK GrowMax 16-16-16', 'pupuk-npk-growmax-16-16-16', 'PUP-001', 1, 'GrowMax', 85000, 100000, 15, 86, 20, 'kg', 4.9, 1241, 'active', 'Pupuk majemuk NPK dengan komposisi seimbang untuk mendukung pertumbuhan akar, daun, dan buah pada berbagai jenis tanaman.', 'Pupuk majemuk NPK dengan komposisi seimbang untuk mendukung pertumbuhan akar, daun, dan buah pada berbagai jenis tanaman.', 'Taburkan di sekitar akar tanaman setiap 2 minggu. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-07-25 09:00:00', '2026-10-03 17:24:55'),
(2, 'Pupuk Organik Cair Daun Hijau', 'pupuk-organik-cair-daun-hijau', 'PUP-002', 1, 'TaniPro', 45000, 55000, 18, 119, 20, 'liter', 4.8, 893, 'active', 'Pupuk organik cair berbahan dasar kompos alami, membantu menyuburkan tanah tanpa merusak struktur mikroba.', 'Pupuk organik cair berbahan dasar kompos alami, membantu menyuburkan tanah tanpa merusak struktur mikroba.', 'Larutkan 1 tutup botol ke 1 liter air, siram ke media tanam. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-07-26 09:00:00', '2026-10-06 08:26:03'),
(3, 'Pupuk Kandang Fermentasi Premium', 'pupuk-kandang-fermentasi-premium', 'PUP-003', 1, 'HijauSubur', 32000, 32000, 0, 63, 20, 'kg', 4.7, 458, 'active', 'Pupuk kandang yang sudah difermentasi sempurna sehingga siap pakai dan bebas bau menyengat.', 'Pupuk kandang yang sudah difermentasi sempurna sehingga siap pakai dan bebas bau menyengat.', 'Campurkan dengan media tanam dengan perbandingan 1:3. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-07-27 09:00:00', '2026-10-05 00:20:41'),
(4, 'Vitamin B1 Perangsang Akar', 'vitamin-b1-perangsang-akar', 'NUT-004', 2, 'AgroCare', 28000, 35000, 20, 200, 20, 'ml', 4.9, 2103, 'active', 'Vitamin B1 untuk merangsang pertumbuhan akar baru, cocok digunakan pasca repotting atau stek.', 'Vitamin B1 untuk merangsang pertumbuhan akar baru, cocok digunakan pasca repotting atau stek.', 'Semprotkan atau siramkan larutan sesuai takaran pada label. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-07-28 09:00:00', '2026-09-20 09:00:00'),
(5, 'Nutrisi Hidroponik AB Mix', 'nutrisi-hidroponik-ab-mix', 'NUT-005', 2, 'KebunKita', 65000, 75000, 13, 90, 20, 'ml', 4.8, 734, 'active', 'Paket nutrisi A dan B untuk sistem hidroponik, diformulasikan untuk sayuran daun.', 'Paket nutrisi A dan B untuk sistem hidroponik, diformulasikan untuk sayuran daun.', 'Larutkan sesuai dosis pada kemasan sebelum digunakan. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-07-29 09:00:00', '2026-09-19 09:00:00'),
(6, 'Suplemen Booster Bunga & Buah', 'suplemen-booster-bunga-buah', 'NUT-006', 2, 'GrowMax', 39000, 39000, 0, 48, 20, 'ml', 4.6, 312, 'active', 'Suplemen tambahan untuk mendorong pembungaan dan pembuahan yang lebih lebat.', 'Suplemen tambahan untuk mendorong pembungaan dan pembuahan yang lebih lebat.', 'Semprotkan pada daun setiap 10 hari sekali. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-07-30 09:00:00', '2026-09-18 09:00:00'),
(7, 'Fungisida Anti Jamur Daun', 'fungisida-anti-jamur-daun', 'OBA-007', 3, 'TaniPro', 52000, 60000, 13, 76, 15, 'ml', 4.7, 588, 'active', 'Fungisida untuk mengendalikan pertumbuhan jamur dan bercak daun pada tanaman hias maupun sayuran.', 'Fungisida untuk mengendalikan pertumbuhan jamur dan bercak daun pada tanaman hias maupun sayuran.', 'Semprotkan merata pada bagian yang terinfeksi. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-07-31 09:00:00', '2026-09-17 09:00:00'),
(8, 'Insektisida Nabati Ramah Lingkungan', 'insektisida-nabati-ramah-lingkungan', 'OBA-008', 3, 'HijauSubur', 47000, 47000, 0, 110, 15, 'ml', 4.8, 967, 'active', 'Insektisida berbahan dasar ekstrak nabati untuk mengurangi populasi hama pengganggu tanaman.', 'Insektisida berbahan dasar ekstrak nabati untuk mengurangi populasi hama pengganggu tanaman.', 'Semprotkan pada sore hari untuk hasil optimal. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-01 09:00:00', '2026-09-16 09:00:00'),
(9, 'Herbisida Pengendali Gulma', 'herbisida-pengendali-gulma', 'OBA-009', 3, 'AgroCare', 58000, 68000, 15, 34, 15, 'ml', 4.5, 201, 'active', 'Herbisida untuk membantu mengendalikan pertumbuhan gulma di sekitar area tanam.', 'Herbisida untuk membantu mengendalikan pertumbuhan gulma di sekitar area tanam.', 'Gunakan alat pelindung diri saat aplikasi. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-02 09:00:00', '2026-09-15 09:00:00'),
(10, 'Benih Cabai Rawit Super F1', 'benih-cabai-rawit-super-f1', 'BEN-010', 4, 'KebunKita', 18000, 22000, 18, 300, 30, 'pack', 4.9, 1876, 'inactive', 'Benih cabai rawit hibrida F1 dengan daya kecambah tinggi dan produktivitas baik.', 'Benih cabai rawit hibrida F1 dengan daya kecambah tinggi dan produktivitas baik.', 'Semai benih pada media tanam lembab. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-03 09:00:00', '2026-09-14 09:00:00'),
(11, 'Benih Sayur Bayam Hijau', 'benih-sayur-bayam-hijau', 'BEN-011', 4, 'GrowMax', 9000, 9000, 0, 20, 30, 'pack', 4.7, 654, 'active', 'Benih bayam hijau pilihan dengan masa panen singkat, cocok untuk pekarangan rumah.', 'Benih bayam hijau pilihan dengan masa panen singkat, cocok untuk pekarangan rumah.', 'Tabur benih tipis-tipis di atas media tanam. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-04 09:00:00', '2026-10-06 08:19:35'),
(12, 'Benih Tomat Cherry Merah', 'benih-tomat-cherry-merah', 'BEN-012', 4, 'TaniPro', 16000, 20000, 20, 180, 30, 'pack', 4.8, 543, 'active', 'Benih tomat cherry dengan rasa manis segar, ideal untuk ditanam dalam pot maupun kebun.', 'Benih tomat cherry dengan rasa manis segar, ideal untuk ditanam dalam pot maupun kebun.', 'Semai di persemaian sebelum dipindah ke pot. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-05 09:00:00', '2026-09-22 09:00:00'),
(13, 'Media Tanam Sekam Bakar 5kg', 'media-tanam-sekam-bakar-5kg', 'MED-013', 5, 'HijauSubur', 22000, 22000, 0, 140, 20, 'kg', 4.8, 789, 'active', 'Sekam bakar berkualitas untuk memperbaiki aerasi dan drainase media tanam.', 'Sekam bakar berkualitas untuk memperbaiki aerasi dan drainase media tanam.', 'Campurkan dengan tanah dan kompos sesuai kebutuhan. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-06 09:00:00', '2026-09-21 09:00:00'),
(14, 'Cocopeat Premium Bebas Garam', 'cocopeat-premium-bebas-garam', 'MED-014', 5, 'AgroCare', 27000, 32000, 16, 95, 20, 'kg', 4.7, 412, 'active', 'Cocopeat yang telah dicuci bersih dan bebas garam, siap digunakan sebagai media tanam.', 'Cocopeat yang telah dicuci bersih dan bebas garam, siap digunakan sebagai media tanam.', 'Rendam terlebih dahulu sebelum digunakan sebagai media tanam. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-07 09:00:00', '2026-09-20 09:00:00'),
(15, 'Tanah Humus Subur 10kg', 'tanah-humus-subur-10kg', 'MED-015', 5, 'KebunKita', 30000, 30000, 0, 60, 20, 'kg', 4.6, 267, 'active', 'Tanah humus dengan kandungan bahan organik tinggi, siap pakai untuk berbagai jenis tanaman.', 'Tanah humus dengan kandungan bahan organik tinggi, siap pakai untuk berbagai jenis tanaman.', 'Gunakan langsung atau campurkan dengan media tanam lain. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-08 09:00:00', '2026-09-19 09:00:00'),
(16, 'Gunting Stek Tanaman Stainless', 'gunting-stek-tanaman-stainless', 'PER-016', 6, 'GrowMax', 35000, 42000, 17, 210, 20, 'pcs', 4.9, 1450, 'inactive', 'Gunting stek berbahan stainless steel, tajam dan tahan karat untuk pemangkasan presisi.', 'Gunting stek berbahan stainless steel, tajam dan tahan karat untuk pemangkasan presisi.', 'Bersihkan sebelum dan sesudah digunakan. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-09 09:00:00', '2026-09-18 09:00:00'),
(17, 'Sprayer Manual 1.5 Liter', 'sprayer-manual-1-5-liter', 'PER-017', 6, 'TaniPro', 48000, 48000, 0, 88, 20, 'pcs', 4.7, 678, 'inactive', 'Sprayer manual dengan pompa tekan untuk menyemprotkan nutrisi atau obat tanaman secara merata.', 'Sprayer manual dengan pompa tekan untuk menyemprotkan nutrisi atau obat tanaman secara merata.', 'Isi sesuai batas maksimal dan pompa secukupnya. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-10 09:00:00', '2026-10-02 18:48:39'),
(18, 'Pot Plastik Bulat 20cm', 'pot-plastik-bulat-20cm', 'PER-018', 6, 'HijauSubur', 15000, 18000, 17, 0, 20, 'pcs', 4.6, 934, 'active', 'Pot plastik dengan lubang drainase optimal, tersedia dalam berbagai warna cerah.', 'Pot plastik dengan lubang drainase optimal, tersedia dalam berbagai warna cerah.', 'Pastikan lubang drainase tidak tersumbat. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-11 09:00:00', '2026-10-05 00:28:53'),
(19, 'Sarung Tangan Berkebun Anti Duri', 'sarung-tangan-berkebun-anti-duri', 'PER-019', 6, 'AgroCare', 25000, 25000, 0, 150, 20, 'pcs', 4.8, 512, 'active', 'Sarung tangan berbahan tebal yang melindungi tangan saat memangkas atau menanam.', 'Sarung tangan berbahan tebal yang melindungi tangan saat memangkas atau menanam.', 'Cuci setelah digunakan dan simpan di tempat kering. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-12 09:00:00', '2026-09-15 09:00:00'),
(20, 'Pupuk Slow Release Granul 1kg', 'pupuk-slow-release-granul-1kg', 'PUP-020', 1, 'KebunKita', 62000, 72000, 14, 20, 20, 'kg', 4.8, 824, 'inactive', 'Pupuk granul dengan pelepasan nutrisi bertahap, praktis untuk perawatan jangka panjang.', 'Pupuk granul dengan pelepasan nutrisi bertahap, praktis untuk perawatan jangka panjang.', 'Taburkan di permukaan media tanam sesuai dosis. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-13 09:00:00', '2026-10-05 00:28:03'),
(21, 'Pupuk Urea Prill 1kg', 'pupuk-urea-prill-1kg', 'PUP-021', 1, 'TaniPro', 18000, 22000, 18, 260, 20, 'kg', 4.7, 1520, 'active', 'Pupuk urea berkadar nitrogen tinggi untuk memacu pertumbuhan daun dan batang yang hijau dan subur.', 'Pupuk urea berkadar nitrogen tinggi untuk memacu pertumbuhan daun dan batang yang hijau dan subur.', 'Taburkan di sekitar tanaman lalu siram, hindari kontak langsung dengan batang. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-14 09:00:00', '2026-09-24 09:00:00'),
(22, 'Pupuk ZA Amonium Sulfat 1kg', 'pupuk-za-amonium-sulfat-1kg', 'PUP-022', 1, 'HijauSubur', 15000, 15000, 0, 180, 20, 'kg', 4.6, 640, 'active', 'Pupuk amonium sulfat yang menyediakan nitrogen dan sulfur, cocok untuk tanah yang kekurangan unsur belerang.', 'Pupuk amonium sulfat yang menyediakan nitrogen dan sulfur, cocok untuk tanah yang kekurangan unsur belerang.', 'Larutkan atau taburkan tipis di sekitar tanaman sesuai dosis. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-15 09:00:00', '2026-09-25 09:00:00'),
(23, 'Pupuk TSP Fosfat 1kg', 'pupuk-tsp-fosfat-1kg', 'PUP-023', 1, 'AgroCare', 24000, 28000, 14, 95, 20, 'kg', 4.7, 388, 'active', 'Pupuk fosfat tinggi untuk memperkuat perakaran dan merangsang pembungaan awal.', 'Pupuk fosfat tinggi untuk memperkuat perakaran dan merangsang pembungaan awal.', 'Benamkan di sekitar lubang tanam sebelum penanaman. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-16 09:00:00', '2026-09-26 09:00:00'),
(24, 'Pupuk KCl Kalium 1kg', 'pupuk-kcl-kalium-1kg', 'PUP-024', 1, 'GrowMax', 26000, 30000, 13, 70, 20, 'kg', 4.6, 295, 'active', 'Pupuk kalium untuk meningkatkan ketahanan tanaman dan kualitas rasa buah.', 'Pupuk kalium untuk meningkatkan ketahanan tanaman dan kualitas rasa buah.', 'Taburkan melingkar di sekitar tanaman saat fase pembuahan. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-17 09:00:00', '2026-09-27 09:00:00'),
(25, 'Pupuk Organik Granul Kotoran Ayam', 'pupuk-organik-granul-kotoran-ayam', 'PUP-025', 1, 'KebunKita', 29000, 35000, 17, 130, 20, 'kg', 4.8, 710, 'active', 'Pupuk organik granul dari kotoran ayam yang sudah diolah, praktis ditabur dan minim bau.', 'Pupuk organik granul dari kotoran ayam yang sudah diolah, praktis ditabur dan minim bau.', 'Taburkan 1 genggam per tanaman setiap 3 minggu. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-18 09:00:00', '2026-09-28 09:00:00'),
(26, 'ZPT Giberelin Pemacu Tumbuh', 'zpt-giberelin-pemacu-tumbuh', 'NUT-026', 2, 'AgroCare', 33000, 40000, 18, 85, 20, 'ml', 4.7, 276, 'active', 'Zat pengatur tumbuh giberelin untuk membantu memacu pertumbuhan tunas dan pemanjangan batang.', 'Zat pengatur tumbuh giberelin untuk membantu memacu pertumbuhan tunas dan pemanjangan batang.', 'Larutkan sesuai takaran lalu semprotkan pada pucuk tanaman. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-19 09:00:00', '2026-09-29 09:00:00'),
(27, 'Pupuk Daun Super Hijau', 'pupuk-daun-super-hijau', 'NUT-027', 2, 'TaniPro', 31000, 31000, 0, 160, 20, 'ml', 4.8, 905, 'active', 'Pupuk daun majemuk yang diserap langsung melalui stomata untuk daun lebih hijau dan segar.', 'Pupuk daun majemuk yang diserap langsung melalui stomata untuk daun lebih hijau dan segar.', 'Semprotkan pada permukaan daun pagi atau sore hari. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-20 09:00:00', '2026-09-30 09:00:00'),
(28, 'Kalsium Pencegah Rontok Bunga', 'kalsium-pencegah-rontok-bunga', 'NUT-028', 2, 'GrowMax', 42000, 50000, 16, 55, 20, 'ml', 4.6, 187, 'inactive', 'Suplemen kalsium cair untuk membantu mengurangi bunga dan buah rontok serta ujung buah busuk.', 'Suplemen kalsium cair untuk membantu mengurangi bunga dan buah rontok serta ujung buah busuk.', 'Semprotkan pada bunga dan buah muda setiap 7 hari. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-21 09:00:00', '2026-10-01 09:00:00'),
(29, 'Biostimulan Ekstrak Rumput Laut', 'biostimulan-ekstrak-rumput-laut', 'NUT-029', 2, 'KebunKita', 47000, 55000, 15, 72, 20, 'ml', 4.8, 342, 'active', 'Biostimulan ekstrak rumput laut untuk membantu tanaman tahan stres cuaca dan pulih lebih cepat.', 'Biostimulan ekstrak rumput laut untuk membantu tanaman tahan stres cuaca dan pulih lebih cepat.', 'Larutkan dalam air lalu siramkan atau semprotkan. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-22 09:00:00', '2026-10-02 09:00:00'),
(30, 'Nutrisi Tanaman Hias & Anggrek', 'nutrisi-tanaman-hias-anggrek', 'NUT-030', 2, 'HijauSubur', 36000, 36000, 0, 98, 20, 'ml', 4.7, 421, 'active', 'Nutrisi khusus tanaman hias dan anggrek untuk daun lebih mengilap dan bunga lebih tahan lama.', 'Nutrisi khusus tanaman hias dan anggrek untuk daun lebih mengilap dan bunga lebih tahan lama.', 'Semprotkan tipis pada daun dan akar udara seminggu sekali. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-23 09:00:00', '2026-10-03 09:00:00'),
(31, 'Pestisida Nabati Neem Oil', 'pestisida-nabati-neem-oil', 'OBA-031', 3, 'HijauSubur', 54000, 65000, 17, 64, 15, 'ml', 4.8, 512, 'active', 'Minyak neem alami untuk membantu mengendalikan kutu putih, kutu daun, dan hama lunak lainnya.', 'Minyak neem alami untuk membantu mengendalikan kutu putih, kutu daun, dan hama lunak lainnya.', 'Campurkan dengan air dan sedikit sabun, semprotkan pada sore hari. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-24 09:00:00', '2026-10-04 09:00:00'),
(32, 'Fungisida Sistemik Antraknosa', 'fungisida-sistemik-antraknosa', 'OBA-032', 3, 'TaniPro', 61000, 70000, 13, 44, 15, 'ml', 4.6, 233, 'active', 'Fungisida sistemik untuk membantu mengendalikan antraknosa dan busuk buah pada cabai dan tomat.', 'Fungisida sistemik untuk membantu mengendalikan antraknosa dan busuk buah pada cabai dan tomat.', 'Semprotkan merata pada tanaman saat gejala awal muncul. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-25 09:00:00', '2026-10-05 09:00:00'),
(33, 'Akarisida Pembasmi Tungau', 'akarisida-pembasmi-tungau', 'OBA-033', 3, 'AgroCare', 56000, 56000, 0, 52, 15, 'ml', 4.5, 164, 'active', 'Akarisida untuk membantu mengendalikan tungau merah dan tungau laba-laba pada tanaman hias dan sayuran.', 'Akarisida untuk membantu mengendalikan tungau merah dan tungau laba-laba pada tanaman hias dan sayuran.', 'Semprotkan hingga bagian bawah daun terkena larutan. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-26 09:00:00', '2026-09-24 09:00:00'),
(34, 'Moluskisida Pembasmi Keong', 'moluskisida-pembasmi-keong', 'OBA-034', 3, 'KebunKita', 38000, 45000, 16, 83, 15, 'ml', 4.4, 129, 'active', 'Moluskisida untuk membantu mengendalikan keong dan siput yang merusak bibit dan daun muda.', 'Moluskisida untuk membantu mengendalikan keong dan siput yang merusak bibit dan daun muda.', 'Tebarkan di sekitar tanaman pada sore hari, jauhkan dari hewan peliharaan. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-27 09:00:00', '2026-09-25 09:00:00'),
(35, 'Perekat Perata Pestisida', 'perekat-perata-pestisida', 'OBA-035', 3, 'GrowMax', 24000, 28000, 14, 140, 15, 'ml', 4.7, 358, 'active', 'Bahan perekat dan perata agar larutan pestisida menempel lebih lama dan merata pada daun.', 'Bahan perekat dan perata agar larutan pestisida menempel lebih lama dan merata pada daun.', 'Tambahkan beberapa tetes ke larutan semprot sebelum aplikasi. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-28 09:00:00', '2026-09-26 09:00:00'),
(36, 'Benih Kangkung Darat', 'benih-kangkung-darat', 'BEN-036', 4, 'KebunKita', 8000, 8000, 0, 3, 30, 'pack', 4.7, 1120, 'active', 'Benih kangkung darat dengan daya tumbuh cepat dan panen dalam sekitar satu bulan.', 'Benih kangkung darat dengan daya tumbuh cepat dan panen dalam sekitar satu bulan.', 'Tabur benih rapat pada bedengan atau pot dan jaga kelembapan. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-29 09:00:00', '2026-10-06 08:18:57'),
(37, 'Benih Terong Ungu Hibrida', 'benih-terong-ungu-hibrida', 'BEN-037', 4, 'TaniPro', 17000, 21000, 19, 210, 30, 'pack', 4.8, 489, 'active', 'Benih terong ungu hibrida dengan buah panjang, mengkilap, dan produktif.', 'Benih terong ungu hibrida dengan buah panjang, mengkilap, dan produktif.', 'Semai benih selama 3 minggu sebelum dipindah ke lahan. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-30 09:00:00', '2026-09-28 09:00:00'),
(38, 'Benih Selada Keriting Hijau', 'benih-selada-keriting-hijau', 'BEN-038', 4, 'GrowMax', 12000, 15000, 20, 240, 30, 'pack', 4.8, 702, 'active', 'Benih selada keriting hijau yang renyah, cocok untuk tanam hidroponik maupun tanah.', 'Benih selada keriting hijau yang renyah, cocok untuk tanam hidroponik maupun tanah.', 'Semai di rockwool atau media lembab, panen pada 30-40 hari. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-08-31 09:00:00', '2026-09-29 09:00:00'),
(39, 'Benih Timun Jepang', 'benih-timun-jepang', 'BEN-039', 4, 'HijauSubur', 15000, 15000, 0, 190, 30, 'pack', 4.7, 415, 'active', 'Benih timun jepang dengan buah ramping, renyah, dan sedikit biji.', 'Benih timun jepang dengan buah ramping, renyah, dan sedikit biji.', 'Tanam langsung dan beri ajir rambatan saat tanaman mulai merambat. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-09-01 09:00:00', '2026-09-30 09:00:00'),
(40, 'Benih Bunga Marigold', 'benih-bunga-marigold', 'BEN-040', 4, 'AgroCare', 11000, 14000, 21, 170, 30, 'pack', 4.6, 268, 'active', 'Benih bunga marigold berwarna cerah yang juga berguna sebagai tanaman pendamping pengusir hama.', 'Benih bunga marigold berwarna cerah yang juga berguna sebagai tanaman pendamping pengusir hama.', 'Taburkan benih di media tanam lembab dan letakkan di tempat terkena sinar matahari. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-09-02 09:00:00', '2026-10-01 09:00:00'),
(41, 'Perlite Pertanian 1kg', 'perlite-pertanian-1kg', 'MED-041', 5, 'AgroCare', 28000, 33000, 15, 75, 20, 'kg', 4.7, 198, 'active', 'Perlite ringan untuk meningkatkan aerasi dan drainase media tanam, cocok untuk tanaman pot dan stek.', 'Perlite ringan untuk meningkatkan aerasi dan drainase media tanam, cocok untuk tanaman pot dan stek.', 'Campurkan 20-30% dari total media tanam. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-09-03 09:00:00', '2026-10-02 09:00:00'),
(42, 'Vermiculit Media Semai 1kg', 'vermiculit-media-semai-1kg', 'MED-042', 5, 'KebunKita', 32000, 38000, 16, 58, 20, 'kg', 4.6, 142, 'active', 'Vermiculit yang menyimpan air dan nutrisi, ideal untuk media semai dan perkecambahan benih.', 'Vermiculit yang menyimpan air dan nutrisi, ideal untuk media semai dan perkecambahan benih.', 'Campurkan dengan cocopeat atau gunakan langsung sebagai media semai. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-09-04 09:00:00', '2026-10-03 09:00:00'),
(43, 'Kompos Daun Organik 5kg', 'kompos-daun-organik-5kg', 'MED-043', 5, 'HijauSubur', 25000, 25000, 0, 120, 20, 'kg', 4.7, 336, 'active', 'Kompos dari daun dan sisa organik yang sudah matang, memperkaya tanah dengan bahan organik.', 'Kompos dari daun dan sisa organik yang sudah matang, memperkaya tanah dengan bahan organik.', 'Campurkan dengan tanah perbandingan 1:2 atau taburkan sebagai mulsa. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-09-05 09:00:00', '2026-10-04 09:00:00'),
(44, 'Zeolit Pertanian 1kg', 'zeolit-pertanian-1kg', 'MED-044', 5, 'TaniPro', 19000, 23000, 17, 90, 20, 'kg', 4.5, 121, 'active', 'Zeolit pertanian untuk membantu menahan unsur hara dan memperbaiki kualitas tanah.', 'Zeolit pertanian untuk membantu menahan unsur hara dan memperbaiki kualitas tanah.', 'Campurkan dengan tanah sebelum tanam sesuai kebutuhan. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-09-06 09:00:00', '2026-10-06 08:13:33'),
(45, 'Campuran Tanah Siap Tanam 5kg', 'campuran-tanah-siap-tanam-5kg', 'MED-045', 5, 'GrowMax', 34000, 40000, 15, 105, 20, 'kg', 4.8, 584, 'active', 'Campuran tanah, sekam, dan kompos siap pakai untuk pot dan polybag tanpa perlu meracik.', 'Campuran tanah, sekam, dan kompos siap pakai untuk pot dan polybag tanpa perlu meracik.', 'Isi pot langsung dan tanam, siram secukupnya. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-09-07 09:00:00', '2026-09-24 09:00:00'),
(46, 'Selang Air Taman 10 Meter', 'selang-air-taman-10-meter', 'PER-046', 6, 'TaniPro', 55000, 65000, 15, 20, 20, 'pcs', 4.6, 247, 'active', 'Selang air taman fleksibel 10 meter dengan bahan tebal yang tidak mudah kusut.', 'Selang air taman fleksibel 10 meter dengan bahan tebal yang tidak mudah kusut.', 'Sambungkan ke keran dan gulung kembali setelah digunakan. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-09-08 09:00:00', '2026-10-06 08:15:39'),
(47, 'Sekop Tangan Stainless', 'sekop-tangan-stainless', 'PER-047', 6, 'GrowMax', 22000, 22000, 0, 175, 20, 'pcs', 4.7, 631, 'active', 'Sekop tangan berbahan stainless dengan gagang ergonomis untuk menggali, memindahkan, dan menanam.', 'Sekop tangan berbahan stainless dengan gagang ergonomis untuk menggali, memindahkan, dan menanam.', 'Bersihkan dan keringkan setelah digunakan. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-09-09 09:00:00', '2026-09-26 09:00:00'),
(48, 'Label Tanaman Plastik isi 50', 'label-tanaman-plastik-isi-50', 'PER-048', 6, 'HijauSubur', 12000, 15000, 20, 300, 20, 'pack', 4.6, 389, 'active', 'Label tanaman plastik isi 50 pcs untuk menandai jenis tanaman, tanggal semai, atau varietas.', 'Label tanaman plastik isi 50 pcs untuk menandai jenis tanaman, tanggal semai, atau varietas.', 'Tancapkan di media tanam dan tulis dengan spidol permanen. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-09-10 09:00:00', '2026-09-27 09:00:00'),
(49, 'Tali Rafia Pengikat Tanaman', 'tali-rafia-pengikat-tanaman', 'PER-049', 6, 'AgroCare', 9000, 9000, 0, 11, 20, 'pcs', 4.5, 305, 'active', 'Tali rafia kuat untuk mengikat dan menopang tanaman merambat pada ajir.', 'Tali rafia kuat untuk mengikat dan menopang tanaman merambat pada ajir.', 'Ikat longgar pada batang agar tidak menekan pertumbuhan. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-09-11 09:00:00', '2026-10-06 08:14:41'),
(50, 'Alat Ukur pH Tanah Digital', 'alat-ukur-ph-tanah-digital', 'PER-050', 6, 'KebunKita', 89000, 110000, 19, 38, 10, 'pcs', 4.8, 276, 'active', 'Alat ukur pH tanah digital untuk memantau keasaman media tanam dengan cepat.', 'Alat ukur pH tanah digital untuk memantau keasaman media tanam dengan cepat.', 'Tancapkan probe ke tanah lembab dan baca hasilnya setelah stabil. Ikuti petunjuk penggunaan pada label produk.', 'Komposisi lengkap tertera pada label kemasan produk.', '2026-09-12 09:00:00', '2026-09-29 09:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `product_benefits`
--

CREATE TABLE `product_benefits` (
  `id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `benefit_text` varchar(255) NOT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_benefits`
--

INSERT INTO `product_benefits` (`id`, `product_id`, `benefit_text`, `sort_order`) VALUES
(1, 1, 'Menyeimbangkan unsur hara N, P, dan K', 0),
(2, 1, 'Mendukung pertumbuhan akar lebih kuat', 1),
(3, 1, 'Cocok untuk tanaman sayur dan buah', 2),
(7, 3, 'Bebas bau menyengat', 0),
(8, 3, 'Siap pakai langsung', 1),
(9, 3, 'Menyuburkan tanah secara alami', 2),
(10, 4, 'Merangsang pertumbuhan akar baru', 0),
(11, 4, 'Mengurangi stres pasca tanam', 1),
(12, 4, 'Mudah diaplikasikan', 2),
(13, 5, 'Formulasi khusus sayuran daun', 0),
(14, 5, 'Larut sempurna dalam air', 1),
(15, 5, 'Hasil panen lebih konsisten', 2),
(16, 6, 'Mendorong pembungaan lebih lebat', 0),
(17, 6, 'Meningkatkan kualitas buah', 1),
(18, 6, 'Mudah larut dalam air', 2),
(19, 7, 'Mengendalikan jamur dan bercak daun', 0),
(20, 7, 'Formula ramah tanaman', 1),
(21, 7, 'Cepat menyerap', 2),
(22, 8, 'Berbahan dasar ekstrak nabati', 0),
(23, 8, 'Membantu mengurangi hama', 1),
(24, 8, 'Residu rendah', 2),
(25, 9, 'Membantu mengendalikan gulma', 0),
(26, 9, 'Aplikasi mudah', 1),
(27, 9, 'Kemasan tahan lama', 2),
(28, 10, 'Daya kecambah tinggi', 0),
(29, 10, 'Tahan terhadap cuaca panas', 1),
(30, 10, 'Hasil panen melimpah', 2),
(34, 12, 'Rasa manis segar', 0),
(35, 12, 'Cocok ditanam dalam pot', 1),
(36, 12, 'Produktif sepanjang musim', 2),
(37, 13, 'Memperbaiki aerasi media tanam', 0),
(38, 13, 'Menjaga kelembapan optimal', 1),
(39, 13, 'Bebas dari patogen', 2),
(40, 14, 'Bebas garam berlebih', 0),
(41, 14, 'Daya serap air tinggi', 1),
(42, 14, 'Ramah lingkungan', 2),
(43, 15, 'Kandungan bahan organik tinggi', 0),
(44, 15, 'Siap pakai', 1),
(45, 15, 'Cocok untuk berbagai tanaman', 2),
(46, 16, 'Tajam dan presisi', 0),
(47, 16, 'Tahan karat', 1),
(48, 16, 'Nyaman digenggam', 2),
(55, 19, 'Melindungi dari duri dan goresan', 0),
(56, 19, 'Nyaman digunakan lama', 1),
(57, 19, 'Bahan tebal dan kuat', 2),
(61, 17, 'Semprotan merata dan halus', 0),
(62, 17, 'Tangki tembus pandang', 1),
(63, 17, 'Mudah diisi ulang', 2),
(67, 20, 'Nutrisi terlepas bertahap', 0),
(68, 20, 'Praktis, jarang perlu diulang', 1),
(69, 20, 'Cocok untuk tanaman pot', 2),
(73, 18, 'Drainase optimal', 0),
(74, 18, 'Ringan dan tahan lama', 1),
(75, 18, 'Tersedia banyak warna', 2),
(76, 21, 'Kaya nitrogen untuk daun hijau', 0),
(77, 21, 'Memacu pertumbuhan vegetatif', 1),
(78, 21, 'Mudah larut dalam air', 2),
(79, 22, 'Menyediakan nitrogen dan sulfur', 0),
(80, 22, 'Cocok untuk sayuran dan padi', 1),
(81, 22, 'Mudah diserap tanaman', 2),
(82, 23, 'Memperkuat sistem perakaran', 0),
(83, 23, 'Merangsang pembungaan', 1),
(84, 23, 'Cocok untuk tanaman buah', 2),
(85, 24, 'Meningkatkan kualitas buah', 0),
(86, 24, 'Memperkuat batang dan daun', 1),
(87, 24, 'Meningkatkan ketahanan tanaman', 2),
(88, 25, 'Praktis dan minim bau', 0),
(89, 25, 'Menyuburkan tanah', 1),
(90, 25, 'Kaya bahan organik', 2),
(91, 26, 'Memacu pertumbuhan tunas', 0),
(92, 26, 'Membantu pemanjangan batang', 1),
(93, 26, 'Mudah diaplikasikan', 2),
(94, 27, 'Diserap cepat melalui daun', 0),
(95, 27, 'Daun lebih hijau dan segar', 1),
(96, 27, 'Cocok untuk tanaman hias', 2),
(97, 28, 'Mengurangi bunga rontok', 0),
(98, 28, 'Mencegah busuk ujung buah', 1),
(99, 28, 'Memperkuat dinding sel', 2),
(100, 29, 'Membantu tanaman tahan stres', 0),
(101, 29, 'Mempercepat pemulihan', 1),
(102, 29, 'Kaya unsur mikro alami', 2),
(103, 30, 'Daun lebih mengilap', 0),
(104, 30, 'Bunga lebih tahan lama', 1),
(105, 30, 'Aman untuk tanaman hias dalam ruangan', 2),
(106, 31, 'Berbahan dasar neem alami', 0),
(107, 31, 'Efektif untuk kutu daun', 1),
(108, 31, 'Residu rendah', 2),
(109, 32, 'Mengendalikan antraknosa', 0),
(110, 32, 'Bekerja sistemik', 1),
(111, 32, 'Melindungi buah dari busuk', 2),
(112, 33, 'Mengendalikan tungau', 0),
(113, 33, 'Menjangkau bagian bawah daun', 1),
(114, 33, 'Aplikasi mudah', 2),
(115, 34, 'Mengurangi serangan keong', 0),
(116, 34, 'Melindungi bibit muda', 1),
(117, 34, 'Praktis ditebar', 2),
(118, 35, 'Larutan menempel lebih lama', 0),
(119, 35, 'Penyemprotan lebih merata', 1),
(120, 35, 'Tidak mudah luntur saat hujan ringan', 2),
(124, 37, 'Buah mengkilap dan seragam', 0),
(125, 37, 'Produktivitas tinggi', 1),
(126, 37, 'Tahan cuaca panas', 2),
(127, 38, 'Daun renyah dan segar', 0),
(128, 38, 'Cocok untuk hidroponik', 1),
(129, 38, 'Masa panen singkat', 2),
(130, 39, 'Buah renyah dan manis', 0),
(131, 39, 'Cocok untuk sistem rambat', 1),
(132, 39, 'Produktif', 2),
(133, 40, 'Bunga berwarna cerah', 0),
(134, 40, 'Membantu mengusir hama', 1),
(135, 40, 'Mudah tumbuh', 2),
(136, 41, 'Meningkatkan aerasi', 0),
(137, 41, 'Drainase lebih lancar', 1),
(138, 41, 'Ringan dan steril', 2),
(139, 42, 'Menyimpan air dan nutrisi', 0),
(140, 42, 'Ideal untuk semai', 1),
(141, 42, 'Ringan dan steril', 2),
(142, 43, 'Matang sempurna', 0),
(143, 43, 'Memperkaya bahan organik', 1),
(144, 43, 'Memperbaiki struktur tanah', 2),
(148, 45, 'Siap pakai', 0),
(149, 45, 'Porositas seimbang', 1),
(150, 45, 'Cocok untuk tanaman pot', 2),
(154, 47, 'Stainless tahan karat', 0),
(155, 47, 'Gagang nyaman', 1),
(156, 47, 'Cocok untuk tanaman pot', 2),
(157, 48, 'Isi 50 pcs', 0),
(158, 48, 'Tahan air dan cuaca', 1),
(159, 48, 'Mudah ditulis', 2),
(163, 50, 'Pembacaan cepat', 0),
(164, 50, 'Layar digital mudah dibaca', 1),
(165, 50, 'Membantu menentukan pemupukan', 2),
(166, 44, 'Menahan unsur hara', 0),
(167, 44, 'Memperbaiki kualitas tanah', 1),
(168, 44, 'Mengurangi kehilangan pupuk', 2),
(169, 49, 'Kuat dan elastis', 0),
(170, 49, 'Tidak melukai batang', 1),
(171, 49, 'Serbaguna', 2),
(172, 46, 'Fleksibel dan tidak mudah kusut', 0),
(173, 46, 'Bahan tebal tahan lama', 1),
(174, 46, 'Panjang 10 meter', 2),
(175, 36, 'Panen cepat', 0),
(176, 36, 'Mudah ditanam pemula', 1),
(177, 36, 'Daya tumbuh tinggi', 2),
(178, 11, 'Masa panen singkat', 0),
(179, 11, 'Cocok untuk pekarangan rumah', 1),
(180, 11, 'Daya tumbuh tinggi', 2),
(181, 2, '100% bahan organik', 0),
(182, 2, 'Aman untuk tanaman rumahan', 1),
(183, 2, 'Memperbaiki struktur tanah', 2);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `is_main` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `is_main`, `sort_order`) VALUES
(1, 1, 'https://placehold.co/600x600/8BE62E/111111?font=roboto&text=NPK%2016-16-16', 1, 0),
(2, 1, 'https://placehold.co/600x600/111111/111111?font=roboto&text=GrowMax', 0, 1),
(3, 1, 'https://placehold.co/600x600/FFD21F/111111?font=roboto&text=1kg', 0, 2),
(6, 3, 'https://placehold.co/600x600/D9F7B0/111111?font=roboto&text=Kandang%20Fermentasi', 1, 0),
(7, 4, 'https://placehold.co/600x600/3B82F6/111111?font=roboto&text=Vitamin%20B1', 1, 0),
(8, 4, 'https://placehold.co/600x600/CFE0FF/111111?font=roboto&text=100ml', 0, 1),
(9, 5, 'https://placehold.co/600x600/CFE0FF/111111?font=roboto&text=AB%20Mix', 1, 0),
(10, 5, 'https://placehold.co/600x600/3B82F6/111111?font=roboto&text=Hidroponik', 0, 1),
(11, 6, 'https://placehold.co/600x600/FFD21F/111111?font=roboto&text=Booster%20Bunga', 1, 0),
(12, 7, 'https://placehold.co/600x600/FF7A00/111111?font=roboto&text=Fungisida', 1, 0),
(13, 7, 'https://placehold.co/600x600/FFDCB8/111111?font=roboto&text=250ml', 0, 1),
(14, 8, 'https://placehold.co/600x600/8BE62E/111111?font=roboto&text=Insektisida%20Nabati', 1, 0),
(15, 9, 'https://placehold.co/600x600/111111/111111?font=roboto&text=Herbisida', 1, 0),
(16, 10, 'https://placehold.co/600x600/FF7A00/111111?font=roboto&text=Benih%20Cabai', 1, 0),
(17, 10, 'https://placehold.co/600x600/FFDCB8/111111?font=roboto&text=F1%20Hybrid', 0, 1),
(19, 12, 'https://placehold.co/600x600/FF7A00/111111?font=roboto&text=Tomat%20Cherry', 1, 0),
(20, 13, 'https://placehold.co/600x600/111111/111111?font=roboto&text=Sekam%20Bakar', 1, 0),
(21, 14, 'https://placehold.co/600x600/8BE62E/111111?font=roboto&text=Cocopeat', 1, 0),
(22, 15, 'https://placehold.co/600x600/3F8F1B/111111?font=roboto&text=Tanah%20Humus', 1, 0),
(23, 16, 'https://placehold.co/600x600/111111/111111?font=roboto&text=Gunting%20Stek', 1, 0),
(24, 16, 'https://placehold.co/600x600/8BE62E/111111?font=roboto&text=Stainless', 0, 1),
(27, 19, 'https://placehold.co/600x600/8BE62E/111111?font=roboto&text=Sarung%20Tangan', 1, 0),
(29, 17, 'https://placehold.co/600x600/3B82F6/111111?font=roboto&text=Sprayer', 1, 0),
(31, 20, 'https://placehold.co/600x600/FFD21F/111111?font=roboto&text=Slow%20Release', 1, 0),
(33, 18, 'https://placehold.co/600x600/FFD21F/111111?font=roboto&text=Pot%2020cm', 1, 0),
(34, 21, 'https://placehold.co/600x600/FFD21F/111111?font=roboto&text=Urea%20Prill', 1, 0),
(35, 21, 'https://placehold.co/600x600/FFDCB8/111111?font=roboto&text=1kg', 0, 1),
(36, 22, 'https://placehold.co/600x600/D9F7B0/111111?font=roboto&text=Pupuk%20ZA', 1, 0),
(37, 23, 'https://placehold.co/600x600/FF7A00/111111?font=roboto&text=TSP%20Fosfat', 1, 0),
(38, 23, 'https://placehold.co/600x600/FFDCB8/111111?font=roboto&text=1kg', 0, 1),
(39, 24, 'https://placehold.co/600x600/3B82F6/111111?font=roboto&text=KCl%20Kalium', 1, 0),
(40, 25, 'https://placehold.co/600x600/3F8F1B/111111?font=roboto&text=Granul%20Ayam', 1, 0),
(41, 25, 'https://placehold.co/600x600/D9F7B0/111111?font=roboto&text=Organik', 0, 1),
(42, 26, 'https://placehold.co/600x600/8BE62E/111111?font=roboto&text=ZPT%20Giberelin', 1, 0),
(43, 27, 'https://placehold.co/600x600/3F8F1B/111111?font=roboto&text=Pupuk%20Daun', 1, 0),
(44, 27, 'https://placehold.co/600x600/D9F7B0/111111?font=roboto&text=250ml', 0, 1),
(45, 28, 'https://placehold.co/600x600/CFE0FF/111111?font=roboto&text=Kalsium', 1, 0),
(46, 29, 'https://placehold.co/600x600/3B82F6/111111?font=roboto&text=Rumput%20Laut', 1, 0),
(47, 29, 'https://placehold.co/600x600/CFE0FF/111111?font=roboto&text=Biostimulan', 0, 1),
(48, 30, 'https://placehold.co/600x600/FFD21F/111111?font=roboto&text=Nutrisi%20Hias', 1, 0),
(49, 31, 'https://placehold.co/600x600/8BE62E/111111?font=roboto&text=Neem%20Oil', 1, 0),
(50, 31, 'https://placehold.co/600x600/D9F7B0/111111?font=roboto&text=250ml', 0, 1),
(51, 32, 'https://placehold.co/600x600/FF7A00/111111?font=roboto&text=Fungisida%20Sistemik', 1, 0),
(52, 33, 'https://placehold.co/600x600/FFD21F/111111?font=roboto&text=Akarisida', 1, 0),
(53, 34, 'https://placehold.co/600x600/3F8F1B/111111?font=roboto&text=Moluskisida', 1, 0),
(54, 35, 'https://placehold.co/600x600/CFE0FF/111111?font=roboto&text=Perekat', 1, 0),
(55, 35, 'https://placehold.co/600x600/3B82F6/111111?font=roboto&text=Perata', 0, 1),
(57, 37, 'https://placehold.co/600x600/CFE0FF/111111?font=roboto&text=Benih%20Terong', 1, 0),
(58, 37, 'https://placehold.co/600x600/3B82F6/111111?font=roboto&text=F1%20Hybrid', 0, 1),
(59, 38, 'https://placehold.co/600x600/8BE62E/111111?font=roboto&text=Benih%20Selada', 1, 0),
(60, 39, 'https://placehold.co/600x600/D9F7B0/111111?font=roboto&text=Timun%20Jepang', 1, 0),
(61, 40, 'https://placehold.co/600x600/FFD21F/111111?font=roboto&text=Marigold', 1, 0),
(62, 40, 'https://placehold.co/600x600/FF7A00/111111?font=roboto&text=Bunga', 0, 1),
(63, 41, 'https://placehold.co/600x600/CFE0FF/111111?font=roboto&text=Perlite', 1, 0),
(64, 42, 'https://placehold.co/600x600/FFDCB8/111111?font=roboto&text=Vermiculit', 1, 0),
(65, 43, 'https://placehold.co/600x600/3F8F1B/111111?font=roboto&text=Kompos%20Daun', 1, 0),
(66, 43, 'https://placehold.co/600x600/D9F7B0/111111?font=roboto&text=5kg', 0, 1),
(68, 45, 'https://placehold.co/600x600/8BE62E/111111?font=roboto&text=Tanah%20Siap%20Tanam', 1, 0),
(69, 45, 'https://placehold.co/600x600/D9F7B0/111111?font=roboto&text=5kg', 0, 1),
(71, 47, 'https://placehold.co/600x600/FFD21F/111111?font=roboto&text=Sekop%20Tangan', 1, 0),
(72, 48, 'https://placehold.co/600x600/8BE62E/111111?font=roboto&text=Label%20Tanaman', 1, 0),
(73, 48, 'https://placehold.co/600x600/D9F7B0/111111?font=roboto&text=isi%2050', 0, 1),
(75, 50, 'https://placehold.co/600x600/3F8F1B/111111?font=roboto&text=pH%20Meter', 1, 0),
(76, 50, 'https://placehold.co/600x600/CFE0FF/111111?font=roboto&text=Digital', 0, 1),
(77, 44, 'https://placehold.co/600x600/FFDCB8/111111?font=roboto&text=Zeolit', 1, 0),
(78, 49, 'https://placehold.co/600x600/FFDCB8/111111?font=roboto&text=Tali%20Rafia', 1, 0),
(79, 46, 'https://placehold.co/600x600/3B82F6/111111?font=roboto&text=Selang%2010m', 1, 0),
(80, 36, 'https://placehold.co/600x600/3F8F1B/111111?font=roboto&text=Benih%20Kangkung', 1, 0),
(81, 11, 'https://placehold.co/600x600/3F8F1B/111111?font=roboto&text=Benih%20Bayam', 1, 0),
(82, 2, 'https://placehold.co/600x600/3F8F1B/111111?font=roboto&text=Organik%20Cair', 1, 0),
(83, 2, 'https://placehold.co/600x600/FFDCB8/111111?font=roboto&text=500ml', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` int(10) UNSIGNED NOT NULL,
  `customer_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`id`, `customer_id`, `product_id`, `created_at`) VALUES
(1, 1, 1, '2026-10-05 00:19:23'),
(2, 1, 2, '2026-10-05 00:19:24'),
(3, 16, 4, '2026-10-05 00:30:17'),
(4, 16, 2, '2026-10-05 00:30:18'),
(5, 16, 1, '2026-10-05 00:30:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `admin_tokens`
--
ALTER TABLE `admin_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `customer_addresses`
--
ALTER TABLE `customer_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `customer_tokens`
--
ALTER TABLE `customer_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `idx_orders_customer` (`customer_id`),
  ADD KEY `idx_orders_status` (`status`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_order_items_order` (`order_id`);

--
-- Indexes for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status_history_order` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_products_category` (`category_id`),
  ADD KEY `idx_products_status` (`status`);
ALTER TABLE `products` ADD FULLTEXT KEY `ft_products_name` (`name`);

--
-- Indexes for table `product_benefits`
--
ALTER TABLE `product_benefits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_benefits_product` (`product_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_images_product` (`product_id`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_wishlist` (`customer_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admin_tokens`
--
ALTER TABLE `admin_tokens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `customer_addresses`
--
ALTER TABLE `customer_addresses`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customer_tokens`
--
ALTER TABLE `customer_tokens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `order_status_history`
--
ALTER TABLE `order_status_history`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `product_benefits`
--
ALTER TABLE `product_benefits`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=184;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_tokens`
--
ALTER TABLE `admin_tokens`
  ADD CONSTRAINT `admin_tokens_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customer_addresses`
--
ALTER TABLE `customer_addresses`
  ADD CONSTRAINT `customer_addresses_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customer_tokens`
--
ALTER TABLE `customer_tokens`
  ADD CONSTRAINT `customer_tokens_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD CONSTRAINT `order_status_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `product_benefits`
--
ALTER TABLE `product_benefits`
  ADD CONSTRAINT `product_benefits_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
