<?php
$name = "Haresh";
$email = "poriyaharesh@gmail";
$phone = "9000000000";
$message = "Mail Message Testing";

$htmlContent = "
	<html>
		<head>
			<meta charset='utf-8'>
			<meta http-equiv='x-ua-compatible' content='ie=edge'>
			<title>utobo</title>
			<meta name='viewport' content='width=device-width, initial-scale=1'>
		</head>
		<body style='background-color: #e9ecef;padding: 0% 5%;'>
			<table width='100%'>
				<tr>
					<td>
						<img src='http://utobo.ai/img/logo/logo.png' style='height: 50px;'>
					</td>
					<td style='float:right;'>
						Email  : support@utobo.ai
						<br>
						Mobile : +91 769 74 39 839
					</td>
				</tr>
				<tr style='background: #FFFF;'>
					<td colspan='2' style='padding: 2% !important;border-top: 10px solid grey;'>
						<span style='font-size:25px;'>
							New inquiry
						</span>
						
						<br><br>
						
						User Name:$name <br>
						User Email: $email<br>
						User Phone: $phone<br>
						User Subject: $subject<br>
						User Message: $message
						<br><br>
						Thank you.!
						
						<br><br><br>
					</td>
				</tr>
				<tr>
					<td colspan='2' align='center'>
						<h4>
							© 2019 <a href='utobo.ai' target='_blank'>utobo.ai</a>
						</h4>
					</td>
				</tr>
			</table>
		</body>
	</html>";
	
	
	/* Send an email campaign */
	
		$postdata = array("sender" => array("name" => "utobo", "email" => "sales@utobo.ai"),"to" => array(array("name" => "Haresh","email" =>"developer@example.com")),"htmlContent" => $htmlContent, "textContent" => "Sales Inquiry", "subject" =>"Inquiry From Website");

		$curl = curl_init();

		curl_setopt_array($curl, array(
			CURLOPT_URL => "https://api.sendinblue.com/v3/smtp/email",
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "POST",
			CURLOPT_POSTFIELDS => json_encode($postdata),
			CURLOPT_HTTPHEADER => array(
			"Content-Type: application/json",
			"api-key: YOUR_SENDINBLUE_API_KEY"
			),
		));

		$campaignresponse = curl_exec($curl);
		$campaignresponsemodify = json_decode($campaignresponse,0);
		echo $campaignid = $campaignresponsemodify->messageId;
	/* Send an email campaign */

?>