<?php
	
	$name     			= $_POST["name"];
	$email    			= $_POST["email"];
	$phone    			= $_POST["phone"];
	$organization   	= $_POST["organization"];
	$domain   			= $_POST["domain"];
	$message  			= $_POST["message"];
	$checkbox 			= $_POST["checkbox"];
	$gRecaptchaResponse = $_POST["gRecaptchaResponse"];

	if($name=="") {
		
		echo "Enter Name";
		
	} else if($email=="") {
		
		echo "Enter Email";
		
	} else if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
		
		echo $email."is an invalid Email, please correct it.";
		
	} else if($phone=="") {
		
		echo "Enter Phone Number";
		
	} else if($checkbox==0) {
		
		echo "Select tutor terms & condition";
		
	} else if($gRecaptchaResponse=="") {
		
		echo "Select Captcha";
		
	} else {
		
		$response=file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=6LfFjtUUAAAAANlrsSf1ohlO-s6kJMVKgQTivjsA&response=".$gRecaptchaResponse."&remoteip=".$_SERVER['REMOTE_ADDR']);	

		$responseKeys = json_decode($response,true);
		if(!$responseKeys["success"]) {
			
			echo "Captcha Validation Required!";
			
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
									<span style='font-size:25px;'>User Details</span>
									
									<br><br>
									
									Term : Yearly <br>
									Plan : Free <br>
									Email : $email<br>
									Phone : $phone<br>
									Organization : $organization<br>
									Domain : $domain<br>
									Message : $message
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

			$postdata = array("sender" => array("name" => $name, "email" => $email),"to" => array(array("name" => "utobo","email" =>"sales@utobo.com")),"htmlContent" => $htmlContent, "textContent" => "Sales Inquiry", "subject" =>"Inquiry From Website");	

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

			echo "Hi ".$name .", thank you for the comments. We will get back to you shortly.##1";
		}
		
	}
?>