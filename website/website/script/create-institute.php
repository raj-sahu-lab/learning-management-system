<?php
    $name = $_POST['name'];
    $countryId = $_POST['countryId'];
    $cityId = $_POST['cityId'];
    $countryCode = $_POST['countryCode'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $domain = $_POST['domain'];
    $pinCode = $_POST['pinCode'];

	$postdata = array(
        "title" => $name,
        "countryId" => $countryId,
        "cityId" => $cityId,
        "countryCode" => $countryCode,
        "phone" => $phone,
        "email" => $email,
        "password" => $password,
        "domain" => $domain,
        "pinCode" => $pinCode,
        "image" => "",
        "isMarketplaceEnable" => 0
    );

	$curl = curl_init();
	curl_setopt_array($curl, array(
		CURLOPT_URL => "https://api.utobo.com:3000/v1/institute",
		CURLOPT_CUSTOMREQUEST => "POST",
		CURLOPT_POSTFIELDS => json_encode($postdata),
		CURLOPT_HTTPHEADER => array("Content-Type: application/json"),
	));

	$response = curl_exec($curl);
	echo $responsemodify = json_decode($response,0);
	//$subscriptionId = $responsemodify->id;
?>