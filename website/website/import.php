<?php
global $_POST;
$email = isset( $_POST['email'] ) ? trim( $_POST['email'] ) : '';
if ( ! empty ( $email ) && filter_var( $email, FILTER_VALIDATE_EMAIL ) ) {
	$email   = str_replace( array( "\r", "\n", ";" ), '', $email ); // prevent CSV injection
	$file    = 'email.csv';
	$current = file_get_contents( $file );
	$current .= $email . ';' . PHP_EOL;
	file_put_contents( $file, $current );
}