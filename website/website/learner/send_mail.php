<?php
global $_POST;


$id=$_GET['id'];

 //id = 1 (about-us.html - Get trial version)
// id = 2 (header - Send a Message)
// id = 3 (contact-us.html - Send a Message)
// id = 4 (App Download)
// id = 5 (Subscribe )
// id = 6 (Sign Up)
$mail_to = 'sales@utobo.ai';

// if($id==1)
// {
// 	$mail_to = 'sales@utobo.ai';
// }
// else {
// 	$mail_to = 'sales@utobo.ai'; 
// }

// Required fields
$email = isset( $_POST['email'] ) ? strip_tags( trim( $_POST['email'] ) ) : '';
$name  = isset( $_POST['name'] ) ? strip_tags( trim( $_POST['name'] ) ) : '';
$text  = isset( $_POST['message'] ) ? strip_tags( trim( $_POST['message'] ) ) : '';
// Additional fields
$business_type   = isset( $_POST['business_type'] ) ? strip_tags( trim( $_POST['business_type'] ) ) : '';
$companyname   = isset( $_POST['companyname'] ) ? strip_tags( trim( $_POST['companyname'] ) ) : '';
$cityname   = isset( $_POST['cityname'] ) ? strip_tags( trim( $_POST['cityname'] ) ) : '';
$statename   = isset( $_POST['statename'] ) ? strip_tags( trim( $_POST['statename'] ) ) : '';
$countryname   = isset( $_POST['countryname'] ) ? strip_tags( trim( $_POST['countryname'] ) ) : '';
$hearabout   = isset( $_POST['hearabout'] ) ? strip_tags( trim( $_POST['hearabout'] ) ) : '';
$subject   = isset( $_POST['subject'] ) ? strip_tags( trim( $_POST['subject'] ) ) : '';
$permalink = isset( $_POST['permalink'] ) ? strip_tags( trim( $_POST['permalink'] ) ) : '';
$phone     = isset( $_POST['phone'] ) ? strip_tags( trim( $_POST['phone'] ) ) : '';
$company   = isset( $_POST['company'] ) ? strip_tags( trim( $_POST['company'] ) ) : '';
$mail_subject = $subject != '' ? $subject : 'From Contact form on website';

$message = '<h3>You got a mail from website:</h3>' . '<br/>';
if ( ! empty( $name ) ) {
$message .= '<b>Name:</b> ' . $name . '<br/>';
}
if ( ! empty( $email ) ) {
$message .= '<b>Email:</b> ' . $email . '<br/>';
}
if ( ! empty( $business_type ) ) {
$message .= '<b>Business Type:</b> ' . $business_type . '<br/>';
}
if ( ! empty( $companyname ) ) {
$message .= '<b>Company Name:</b> ' . $companyname . '<br/>';
}
if ( ! empty( $permalink ) ) {
	$message .= '<b>Website:</b> ' . $permalink . '<br/>';
}
if ( ! empty( $phone ) ) {
	$message .= '<b>Phone:</b> ' . $phone . '<br/>';
}
if ( ! empty( $cityname ) ) {
	$message .= '<b>City Name:</b> ' . $cityname . '<br/>';
}
if ( ! empty( $statename ) ) {
	$message .= '<b>State Name:</b> ' . $statename . '<br/>';
}
if ( ! empty( $countryname ) ) {
	$message .= '<b>Country Name:</b> ' . $countryname . '<br/>';
}
if ( ! empty( $hearabout ) ) {
	$message .= '<b>Hear About:</b> ' . $hearabout . '<br/>';
}
if ( ! empty( $company ) ) {
	$message .= '<b>Company:</b> ' . $company . '<br/>';
}
if($id==2 AND $text=="")
{
	if ( ! empty( $subject ) ) {
	$message .= '<b>Organization Name:</b> ' . $subject . '<br/>';
	}
}
else
{
	if ( ! empty( $subject ) ) {
	$message .= '<b>Subject:</b> ' . $subject . '<br/>';
	}
}
if ( ! empty( $text ) ) {
$message .= '<b>Message:</b> ' . $text . '<br/>';
}
$headers = array();
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=UTF-8';

// Additional headers
$headers[] = 'From:'.$name.' <' . $email . '>';

//mail( $mail_to, $mail_subject, $message, implode("\r\n", $headers) ); because of captcha here not work

echo "<script>window.location='be-a-partner.php'</script>";
