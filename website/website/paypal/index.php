<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Paypal Integration Test</title>
</head>
<body onload="load()">
	<div>
		<strong>Please Wait ...</strong>
	</div>
	<?php
	$id=(int)$_GET['id'];
	$country=(int)$_GET['country'];
	$amount=(float)$_GET['amount'];
	if($country==0)
	{
		$lc='IN';
		$code='INR';
	}
	else
	{
		$lc='USA';
		$code='USD';
	}
	
	if($id==1)
	{
		$productinfo='STANDARD';
	}
	else if($id==2)
	{
		$productinfo='PREMIUM';
	}
	else
	{
		$productinfo='ULTIMATE';
	}
	
	$firstname=$_POST['firstname'];
	$phone=$_POST['phone'];
	$email=$_POST['email'];
	$country=$_POST['country'];
	$state=$_POST['state'];
	$city=$_POST['city'];
	$zipcode=$_POST['zipcode'];
	$address1=$_POST['address1'];
	?>
	<form class="paypal" action="payments.php" method="post" id="paypal_form">
		<input type="hidden" name="cmd" value="_xclick" />
		<input type="hidden" name="no_note" value="1" />
		<input type="hidden" name="lc" value="<?php echo $lc;?>" />
		<input type="hidden" name="currency_code" value="<?php echo $code;?>" />
		<input type="hidden" name="bn" value="PP-BuyNowBF:btn_buynow_LG.gif:NonHostedGuest" />
		<input type="hidden" name="first_name" value="<?php echo $firstname;?>"  />
		<input type="hidden" name="last_name" value="<?php echo $firstname;?>"  />
		<input type="hidden" name="payer_email" value="<?php echo $email;?>"  />
		<input type="hidden" name="item_number" value="<?php echo $productinfo;?>" />
		<input type="hidden" name="item_name" value="<?php echo $productinfo;?>" />
		<input type="hidden" name="item_amount" value="<?php echo $amount;?>" />
		<!--<input type="submit" name="submit" value="Submit Payment"/>-->
	</form>
	<script>
		document.getElementById("paypal_form").submit();
	</script>
</body>
</html>