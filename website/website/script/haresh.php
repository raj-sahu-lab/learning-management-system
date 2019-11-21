<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<button id="rzp-button1">Pay</button>

<script>
var options = {
	"key": "rzp_test_XXXXXXXXXXXXXX",
	"amount": 2000, // For current payment
	//"subscription_id": "sub_ELmPOK7HYxEhw6", //For subscription
	"name": "utobo",
	"currency": "INR",
	"bank": 'HDFC',
	"description": "Monthly Premium Package",
	"image": "http://student.learnonapp.in/assets/img/utobo.png",
	"handler": function (response) {
		console.log(response);
	},
	"prefill": {
		"name": "Test User",
		"email": 'developer@example.com',
		"contact": '9000000000'
	},
	"theme": {
		"color": "#0F6BAC"
	}
};

var rzp1 = new Razorpay(options);
	document.getElementById('rzp-button1').onclick = function(e){
	rzp1.open();
	e.preventDefault();
}

/* console.log(options);
var propay = new Razorpay(options);
propay.open(); */
</script>