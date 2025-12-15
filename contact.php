<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Capture and sanitize form data
    $name = $_POST['name'] ?? 'N/A';
    $designation = $_POST['designation'] ?? 'N/A';
    $orgname = $_POST['orgname'] ?? 'N/A';
    $email = $_POST['email'] ?? 'N/A';
    $sb253 = $_POST['sb253'] ?? 'N/A';
    $sb261 = $_POST['sb261'] ?? 'N/A';
    $doingCA = $_POST['doingCA'] ?? 'N/A';
    $message = $_POST['message'] ?? 'N/A';

    // Capture UTM parameters
    $utm_source   = $_POST['utm_source']   ?? 'N/A';
    $utm_medium   = $_POST['utm_medium']   ?? 'N/A';
    $utm_campaign = $_POST['utm_campaign'] ?? 'N/A';
    $utm_term     = $_POST['utm_term']     ?? 'N/A';
    $utm_content  = $_POST['utm_content']  ?? 'N/A';

    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'agp7005@gmail.com';
        $mail->Password   = 'yfbpnmvhdtksyaqq'; // Gmail app password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Recipients
        $mail->setFrom('agp7005@gmail.com', 'Uniqus Quiz');
        $mail->addBCC('agp7005@gmail.com', 'Uniqus Team');
        $mail->addReplyTo($email, $name);

        // Email body (plain text)
        $mail->isHTML(false);
        $mail->Subject = "New Quiz Submission from $name";
        $mail->Body = "Name: $name" . PHP_EOL .
              "Designation: $designation" . PHP_EOL .
              "Organization: $orgname" . PHP_EOL .
              "Email: $email" . PHP_EOL . PHP_EOL .

              "Results" . PHP_EOL .
              "SB 253: $sb253" . PHP_EOL .
              "SB 261: $sb261" . PHP_EOL .
              "Doing Business in CA: $doingCA" . PHP_EOL . PHP_EOL .

              "UTM Tracking" . PHP_EOL .
              "Source: $utm_source" . PHP_EOL .
              "Medium: $utm_medium" . PHP_EOL .
              "Campaign: $utm_campaign" . PHP_EOL .
              "Term: $utm_term" . PHP_EOL .
              "Content: $utm_content" . PHP_EOL . PHP_EOL .

              "Message:" . PHP_EOL .
              "$message";

        $mail->send();

        // Confirmation email to user
        $mail->clearAllRecipients();
        $mail->addAddress($email, $name);
        $mail->Subject = "Your Uniqus Quiz Results";
        $mail->Body = "Dear $name,\n\nThank you for completing the Uniqus Preliminary California Climate Law Applicability Assessment. Based on your responses:\n\nSB 253: $sb253\nSB 261: $sb261\nDoing Business in CA: $doingCA\n\n$message\n\nSincerely,\nUniqus Team";
        $mail->send();

        header("Location: thank-you.html");
        exit;

    } catch (Exception $e) {
        http_response_code(500);
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        exit;
    }

} else {
    http_response_code(405);
    echo "Method Not Allowed.";
    exit;
}
?> 