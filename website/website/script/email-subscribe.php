<?php
	$email= $_POST["email"];

	if($email=="") {
		
		echo "Enter Email";
		
	} else {
			
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
								<img src='https://utobo.com/img/logo/logo.png' style='height: 50px;'>
							</td>
							<td style='float:right;'>
								Email  : sales@utobo.com
								<br>
								Mobile : +91 769 74 39 839
							</td>
						</tr>
						<tr style='background: #FFFF;'>
							<td colspan='2' style='padding: 2% !important;border-top: 10px solid grey;'>
								<span style='font-size:25px;'>User email subscribe</span>
								
								<br><br>
								
								Email : $email<br>
								<br><br>
								Thank you.!
								
								<br><br><br>
							</td>
						</tr>
						<tr>
							<td colspan='2' align='center'>
								<h4>
									© 2020 <a href='utobo.com' target='_blank'>utobo.com</a>
								</h4>
							</td>
						</tr>
					</table>
				</body>
			</html>";
		
		
		$postdata = array("sender" => array("name" =>"User subscribe", "email" => $email),"to" => array(array("name" => "utobo","email" =>"sales@utobo.com")),"htmlContent" => $htmlContent, "textContent" => "Email Subscribe", "subject" =>"Subscribe From Website");	

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
		$campaignid = $campaignresponsemodify->messageId;
		
		echo "Thank you for the subscribe. We promise, we will never spam your email.##1";		
		
	}
?>