var countryCityArray = [];
var cityArray = [];

var selectedCountryId = null;
var selectedCountryCode = null;
var selectedCityId = null;

var generateOTP = null;

var offerApply = 0; // 1-Yea,0-No
var couponResponse = {};

function myPlan() {
	
	var selectedCurrency = document.getElementById("selectedCurrency").value;
	var switchSelected = document.getElementById("selectedSwitch").value;
	
	document.getElementById("selectedTerm").value = switchSelected;
	
	if(switchSelected == 0) {
		
		document.getElementById("selectedSwitch").value=1;
		
		document.getElementById("tagline1").innerHTML = "per month";
		document.getElementById("tagline2").innerHTML = "per month";		
		document.getElementById("tagline3").innerHTML = "per month";

		if(selectedCurrency == 1)
		{
			document.getElementById("title1").innerHTML = "1,999";
			document.getElementById("title2").innerHTML = "4,999";
			document.getElementById("title3").innerHTML = "9,999";

		} else {
			
			document.getElementById("title1").innerHTML = "29";
			document.getElementById("title2").innerHTML = "69";
			document.getElementById("title3").innerHTML = "129";
		}
		
	} else {
		
		document.getElementById("selectedSwitch").value=0;
		
		document.getElementById("tagline1").innerHTML = "per month when billed annually";		
		document.getElementById("tagline2").innerHTML = "per month when billed annually";		
		document.getElementById("tagline3").innerHTML = "per month when billed annually";

		if(selectedCurrency == 1)
		{
			document.getElementById("title1").innerHTML = "1,599";
			document.getElementById("title2").innerHTML = "3,999";
			document.getElementById("title3").innerHTML = "7,999";		

		} else {
			document.getElementById("title1").innerHTML = "23";
			document.getElementById("title2").innerHTML = "55";
			document.getElementById("title3").innerHTML = "103";
		}
		
	}
}

function paymentType(selectedPlan) {

	offerApply = 0;
	//offerCodeMsg
	document.getElementById('offerCodeMsg').style.display = 'none';
	
	document.getElementById("openPaymentTypePopup").click();
	document.getElementById("selectedPlan").value = selectedPlan;
}

function paymentTypeOption(optionGet) {
	
	document.getElementById("paymentOption").value = optionGet;
}

function buttonPay() {

	if(offerApply == 1){

		couponResponse = JSON.parse(couponResponse);
		couponResponseId = couponResponse.id;

	} else {
		couponResponseId = 0;
	}
	
	document.getElementById("closePaymentTypePopup").click();

	var selectedCurrency = document.getElementById("selectedCurrency").value;
	var selectedTerm = document.getElementById("selectedTerm").value;	
	var selectedPlan = document.getElementById("selectedPlan").value;
	var paymentOption = document.getElementById("paymentOption").value;

	if(selectedCurrency==1){
		
		currency= "INR";

	} else {
		currency= "USD";
	}
	
	if(selectedTerm == 0) { // Monthly
		
		term = 'Monthly';
		termId = 1;
		
		if(selectedPlan==1) {
			
			planId = 6;

			if(selectedCurrency==1) {

				//amount = (1999+359.82)*100;
				plan = 'Basic Plan + 18% GST';
				planNetAmt = 1999;

				if(offerApply == 1){

					discountAmt = planNetAmt * couponResponse.discount/100;
					if(discountAmt>couponResponse.maxAmount)
					{
						discountAmt = couponResponse.maxAmount;
					}
					
					gstAmt = (planNetAmt - discountAmt) * 18 / 100;
					total = Math.ceil((planNetAmt - discountAmt + gstAmt) * 100)/100;

					amount = total*100;

				} else {
					amount = 235882;
				}

			} else {

				plan = 'Basic Plan';
				planNetAmt = 29;

				if(offerApply == 1){

					discountAmt = planNetAmt * couponResponse.discount/100;
					if(discountAmt>couponResponse.maxDollerAmount)
					{
						discountAmt = couponResponse.maxDollerAmount;
					}
					
					total = Math.ceil((planNetAmt - discountAmt) * 100)/100;

					amount = total*100;

				} else {
					amount = 29*100;
				}
			}
			
		} else if(selectedPlan==2) {
			
			planId = 4;

			if(selectedCurrency==1) {

				//amount = (4999+899.82)*100;
				plan = 'Premium Plan + 18% GST';
				planNetAmt = 4999;

				if(offerApply == 1){

					discountAmt = planNetAmt * couponResponse.discount/100;
					if(discountAmt>couponResponse.maxAmount)
					{
						discountAmt = couponResponse.maxAmount;
					}
					
					gstAmt = (planNetAmt - discountAmt) * 18 / 100;
					total = Math.ceil((planNetAmt - discountAmt + gstAmt) * 100)/100;

					amount = total*100;

				} else {
					amount = 589882;
				}

			} else {

				plan = 'Premium Plan';
				planNetAmt = 69;

				if(offerApply == 1){

					discountAmt = planNetAmt * couponResponse.discount/100;
					if(discountAmt>couponResponse.maxDollerAmount)
					{
						discountAmt = couponResponse.maxDollerAmount;
					}
					
					total = Math.ceil((planNetAmt - discountAmt) * 100)/100;

					amount = total*100;

				} else {
					amount = 69*100;
				}
			}
			
		} else if(selectedPlan==3) {
			
			planId = 5;
			
			if(selectedCurrency==1) {

				//amount = (9999+1799.82)*100;
				plan = 'Ultimate Plan + 18% GST';
				planNetAmt = 9999;

				if(offerApply == 1){

					discountAmt = planNetAmt * couponResponse.discount/100;
					if(discountAmt>couponResponse.maxAmount)
					{
						discountAmt = couponResponse.maxAmount;
					}
					
					gstAmt = (planNetAmt - discountAmt) * 18 / 100;
					total = Math.ceil((planNetAmt - discountAmt + gstAmt) * 100)/100;

					amount = total*100;

				} else {
					amount = 1179882;
				}

			} else {

				plan = 'Ultimate Plan';
				planNetAmt = 129;

				if(offerApply == 1){

					discountAmt = planNetAmt * couponResponse.discount/100;
					if(discountAmt>couponResponse.maxDollerAmount)
					{
						discountAmt = couponResponse.maxDollerAmount;
					}
					
					total = Math.ceil((planNetAmt - discountAmt) * 100)/100;

					amount = total*100;

				} else {
					amount = 129*100;
				}
				
			}
			
		}
		
	} else { // Yearly

		term = 'Yearly';
		termId = 2;

		if(selectedPlan==1) {

			planId = 1;
			
			if(selectedCurrency==1) {

				//amount = 12*(1599+287.82)*100;
				plan = 'Basic Plan + 18% GST';
				planNetAmt = 1599*12;

				if(offerApply == 1){

					discountAmt = planNetAmt * couponResponse.discount/100;
					if(discountAmt>couponResponse.maxAmount)
					{
						discountAmt = couponResponse.maxAmount;
					} else {

						discountAmt = discountAmt;
					}
					
					gstAmt = (planNetAmt - discountAmt) * 18 / 100;
					total = Math.ceil((planNetAmt - discountAmt + gstAmt) * 100)/100;

					amount = total*100;

				} else {
					amount = 2264184;
				}

			} else {

				plan = 'Basic Plan';
				planNetAmt = 276;

				if(offerApply == 1){

					discountAmt = planNetAmt * couponResponse.discount/100;
					if(discountAmt>couponResponse.maxDollerAmount)
					{
						discountAmt = couponResponse.maxDollerAmount;
					}
					
					total = Math.ceil((planNetAmt - discountAmt) * 100)/100;

					amount = total*100;

				} else {
					amount = 276*100;
				}
			}			
			
		} else if(selectedPlan==2) {

			planId = 2;

			if(selectedCurrency==1) {

				//amount = 12*(3999+719.82)*100;
				plan = 'Premium Plan + 18% GST';
				planNetAmt = 3999*12;

				if(offerApply == 1){

					discountAmt = planNetAmt * couponResponse.discount/100;
					if(discountAmt>couponResponse.maxAmount)
					{
						discountAmt = couponResponse.maxAmount;
					}
					
					gstAmt = (planNetAmt - discountAmt) * 18 / 100;
					total = Math.ceil((planNetAmt - discountAmt + gstAmt) * 100)/100;

					amount = total*100;

				} else {
					amount = 5662584;
				}				

			} else {

				plan = 'Premium Plan';
				planNetAmt = 660;

				if(offerApply == 1){

					discountAmt = planNetAmt * couponResponse.discount/100;
					if(discountAmt>couponResponse.maxDollerAmount)
					{
						discountAmt = couponResponse.maxDollerAmount;
					}
					
					total = Math.ceil((planNetAmt - discountAmt) * 100)/100;

					amount = total*100;

				} else {
					amount = 660*100;
				}
			}			
			
		} else if(selectedPlan==3) {

			planId = 3;
			
			if(selectedCurrency==1) {

				//amount = 12*(7999+1439.82)*100;
				plan = 'Ultimate Plan + 18% GST';
				planNetAmt = 7999*12;

				if(offerApply == 1){

					discountAmt = planNetAmt * couponResponse.discount/100;
					if(discountAmt>couponResponse.maxAmount)
					{
						discountAmt = couponResponse.maxAmount;
					}
					
					gstAmt = (planNetAmt - discountAmt) * 18 / 100;
					total = Math.ceil((planNetAmt - discountAmt + gstAmt) * 100)/100;

					amount = total*100;

				} else {
					amount = 11326584;
				}
				

			} else {

				plan = 'Ultimate Plan';
				planNetAmt = 1236;

				if(offerApply == 1){

					discountAmt = planNetAmt * couponResponse.discount/100;
					if(discountAmt>couponResponse.maxDollerAmount)
					{
						discountAmt = couponResponse.maxDollerAmount;
					}
					
					total = Math.ceil((planNetAmt - discountAmt) * 100)/100;

					amount = total*100;

				} else {
					amount = 1236*100;
				}
			}
			
		}
	}
	
	if(paymentOption == 1)
	{

		postData = {"planId":planId};
		jQuery.ajax({
			type:"POST",
			url:"https://api.example.com/v1/getSubscription", //:3000
			data: JSON.stringify(postData),
			contentType: "application/json",
			success:function(response)
			{
				subscriptionId = response.data.id;
				
				var options = 
				{
					"key": "rzp_live_XXXXXXXXXXXXXX", //Live
					//"key": "rzp_test_XXXXXXXXXXXXXX", //Test
					"currency": currency,
					//"amount": amount, // For current payment
					"subscription_id": subscriptionId, //For subscription
					"name": "company",
					"description": plan,
					"image": "https://example.com/script/logo.png",
					"handler": function (response) {
						
						var razorpay_payment_id = response.razorpay_payment_id;
						window.location = '/institute.php?pay='+razorpay_payment_id+'&termId='+termId+'&planId='+planId+'&curId='+selectedCurrency+'&subscription='+subscriptionId;
						
						//console.log(response);
					},
					"theme": {
						"color": "#0F6BAC"
					}
				};
				
				var propay = new Razorpay(options);
				propay.open();
				
				
			},error: function (response) {

				console.log(response);
			},
		});

	} else {

		// Stripe Payment Gatway
		var handler = StripeCheckout.configure({

			// Also change secret key in strip/payment.php
			// key: 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX', // Test publisher key
			key: 'pk_live_XXXXXXXXXXXXXXXXXXXXXXXX', // Live publisher key
			locale: 'auto',
			token: function (token) {
	   
			  $.ajax({
				url:"../stripe/payment.php",
				method: 'post',
				data: { tokenId: token.id, amount: amount },
				dataType: "json",
				success: function( response ) {
				  window.location = './institute.php?pay='+response.data.id+'&termId='+termId+'&planId='+planId+'&curId='+selectedCurrency+'&offerId='+couponResponseId;
				}
			  })
			}
		  });
		
		  handler.open({
			name: 'company',
			description: plan,
			amount: amount
		  });


		// RazorPay Payment Gatway
		
		// var options = 
		// {
		// 	"key": "rzp_live_XXXXXXXXXXXXXX", //Live/
		// 	//"key": "rzp_test_XXXXXXXXXXXXXX", //Test
		// 	"currency": currency,
		// 	"amount": amount, // For current payment
		// 	//"subscription_id": subscriptionId, //For subscription
		// 	"name": "company",
		// 	"description": plan,
		// 	"image": "https://example.com/script/logo.png",
		// 	"handler": function (response) {
				
		// 		var razorpay_payment_id = response.razorpay_payment_id;
		// 		//window.location = '/institute.php?pay='+razorpay_payment_id+'&termId='+termId+'&planId='+planId+'&curId='+selectedCurrency+'&offerId='+couponResponseId+'&subscription='+subscriptionId;
		// 		window.location = '/institute.php?pay='+razorpay_payment_id+'&termId='+termId+'&planId='+planId+'&curId='+selectedCurrency+'&offerId='+couponResponseId;
								
		// 		//console.log(response);
		// 	},
		// 	"theme": {
		// 		"color": "#0F6BAC"
		// 	}
		// };
		
		// var propay = new Razorpay(options);
		// propay.open();

	}
}

function checkOfferCode() {
	
	var offerCode = document.getElementById("offerCode").value;

	if(offerCode=="") {

		alert("Please enter coupon code");
		document.getElementById("offerCode").focus();
		return false;

	} else {
		
		termId = document.getElementById('selectedTerm').value;
		if(termId == 0) {

			termId = 1;

		} else if(termId == 1) {

			termId = 2;
		}

		formData = new FormData();	
		formData.append("offerCode", offerCode);
		formData.append("termId",termId);
		
		jQuery.ajax({
			type:"POST",
			url:"https://api.example.com/v1/institute/user/checkOffer", //:3000
			data: formData,
			cache:false,
			processData: false,
			contentType: false,
			success:function(response)
			{
				document.getElementById('normalPayment').click(); // for normal offer auto selection
				document.getElementById("offerCode").value = '';
				document.getElementById("offerCodeMsg").style.display = "block";
				offerApply = 1;
				couponResponse = JSON.stringify(response.data);

			},error: function (response) {

				offerApply = 0;
				alert(response.responseJSON.error);
            },
		});
		
	}

}

function countryList() {
	
	$.ajax({
		type: "GET",
		url: "https://api.example.com/v1/countryCityList",
		dataType: "json",
		success: function(response) 
		{
			countryCityArray = response.data;
			
			var countrySelection = '<select name="country" id="selectCountry" onchange="cityList(this.value)"><option value="">Select Country</option>';
			
			for(var i=0;i<response.data.length;i++){
				
				countryId = response.data[i].id;
				countryName = response.data[i].title;	
			
				countrySelection += '<option value="'+i+'">'+countryName+'</option>';
			}
			countrySelection += '</select>'; 
			
			jQuery('#country').replaceWith(countrySelection);
		}
	});
}

function cityList(countryIndex) {
	
	selectedCountryId  = countryCityArray[countryIndex].id;
	document.getElementById("countryId").value = selectedCountryId;

	selectedCountryCode  = countryCityArray[countryIndex].code;
	document.getElementById("countryCode").value = selectedCountryCode;

	cityArray = countryCityArray[countryIndex].citys;

	var citySelection = '<select name="city" id="city" onchange="selectedCity(this.value)"><option value="">Select City *</option>';
			
	for(var i=0;i<cityArray.length;i++){
			
		citySelection += '<option value="'+i+'">'+cityArray[i].title+'</option>';
	}
	citySelection += '</select>'; 
	
	jQuery('#city').replaceWith(citySelection);
	
}

function selectedCity(cityIndex){

	selectedCityId = cityArray[cityIndex].id;
	document.getElementById("cityId").value = selectedCityId;
}

function createInstitute() {
	
	//image=document.getElementById("image");
	var name = document.getElementById("name").value;
	var countryId = document.getElementById("countryId").value;
	var cityId = document.getElementById("cityId").value;
	var countryCode = document.getElementById("countryCode").value;
	var phone = document.getElementById("phone").value;
	var email = document.getElementById("email").value;
	var pincode = document.getElementById("pincode").value;
	var domain = document.getElementById("domain").value;
	var password = document.getElementById("password").value;
	var getFreeTrialcheckbox = document.getElementById("getFreeTrialcheckbox").value;
	
	var atposition=email.indexOf("@");  
	var dotposition=email.lastIndexOf(".");

	 
	// else if(countryId=="") {

	// 	alert("Please select country");
	// 	document.getElementById("selectCountry").focus();
	// 	return false;

	// } else if(cityId=="") {
		
	// 	alert("Please select city");
	// 	document.getElementById("city").focus();
	// 	return false;

	// } 
	
	if(name=="") {

		alert("Please enter institute name");
		document.getElementById("name").focus();
		return false;

	} else if(email=="") {
		
		alert("Please enter email address");
		document.getElementById("email").focus();
		return false;

	} else if (atposition<1 || dotposition<atposition+2 || dotposition+2>=email.length) {
		
	  alert("Please enter a valid e-mail address");
	  document.getElementById("email").focus();
	  return false;
	  
	} else if(domain=="") {
		
		alert("Enter domain name");
		document.getElementById("domain").focus();
		return false;

	} else if(password=="") {
		
		alert("Please enter password");
		document.getElementById("password").focus();
		return false;

	} else if (password.length < 6 || password.length > 16) {
      
		alert("Please enter password between 6 to 16 characters.");
		document.getElementById("password").focus();
		return false;

    } else if (password.search(/\d/) == -1) {

		alert("Password must contain number.");
		document.getElementById("password").focus();
		return false;
      
    } else if (password.search(/[a-zA-Z]/) == -1) {

		alert("Password must contain letter.");
		document.getElementById("password").focus();
		return false;
        
    } else if (password.search(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) == -1) {

		alert("Password must contain special character.");
		document.getElementById("password").focus();
		return false;
        
    } else if(getFreeTrialcheckbox == 0) {
		
		alert("Please select terms of service");
		return false;

	} else {
		
		document.getElementById("instituteCreation").style.display = "none";
		document.getElementById("instituteCreationMSG").style.display = "block";

		formData = new FormData();	
		//formData.append("image", image.files[0]);
		formData.append("title", name);
		formData.append("email", email);
		formData.append("password", password);

		if(countryId){
			formData.append("countryId", countryId);
		}

		if(cityId) {
			formData.append("cityId", cityId);
		}

		if(countryCode){
			formData.append("countryCode", countryCode);
		}

		if(phone) {
			formData.append("phone", phone);
		}
		
		if(pincode) {
			formData.append("pincode", pincode);
		}

		if(domain) {
			formData.append("domain", domain);
		}

		formData.append("currencyId", 2);
		formData.append("isMarketplaceEnable", 0);
		
		jQuery.ajax({
			type:"POST",
			url:"https://api.example.com/v1/institute",
			crossDomain: true,
			data: formData,
			cache:false,
			processData: false,
			contentType: false,
			success:function(response)
			{
				bearer_token = response.data.bearer_token;
				purchasePlan(bearer_token,email,'plan');

			},error: function (response) {

				alert(response.responseJSON.error);
				document.getElementById("instituteCreation").style.display = "block";
				document.getElementById("instituteCreationMSG").style.display = "none";
				//purchasePlan('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyNiwiaWF0IjoxNTgyOTg2NzI2LCJleHAiOjE1ODMwNzMxMjZ9.cLTCDwbq32UKBncMhxlc4mpi7B321lhQAoETl3ea5xc');
				
            },
		});
		
	}

}

function purchasePlan(token,email,planType){
	
	var transactionId = document.getElementById("transactionId").value;
	var termId = document.getElementById("termId").value;
	var planId = document.getElementById("planId").value;
	var curId = document.getElementById("curId").value;
	var offerId = offerApply == 1 ? document.getElementById("offerId").value : null;
	var gst = curId == 1 ? 18 : 0; 
	
	if(planType=='plan')
	{
		var subscriptionId = document.getElementById("subscriptionId").value;
		
	} else {
		
		var subscriptionId = '';
	}
	
	postData = {"termId":termId,"planId":planId,"gst":gst,"gatewayId":2,"transactionId":transactionId,"currencyType":curId,"subScriptionId":subscriptionId,"offerId":offerId};
	
	jQuery.ajax({
		type:"POST",
		url:"https://api.example.com/v1/institute/user/purchasePlan",
		crossDomain: true,
		data: JSON.stringify(postData),
		contentType: "application/json",
		async: false,
		headers: {
			"Authorization": "Bearer " + token
		},
		success:function(response)
		{
			window.location = 'https://example.com/thank-you.php?email='+email+'&planId='+planId;

		},error: function (response) {

			document.getElementById("instituteCreation").style.display = "block";
			document.getElementById("instituteCreationMSG").style.display = "none";
			alert(response.responseJSON.error);
		},
	});

}

function checkboxClick(){
	
	var checkboxvalue = document.getElementById("getFreeTrialcheckbox").value;
	
	if(checkboxvalue == 0){
		
		document.getElementById("getFreeTrialcheckbox").value = 1;
		
	} else {
		
		document.getElementById("getFreeTrialcheckbox").value = 0;
		
	}
}

function freeInquiry() {

	getFreeTrialname=document.getElementsByName("getFreeTrialname")[0].value;
	getFreeTrialemail=document.getElementsByName("getFreeTrialemail")[0].value;
	getFreeTrialphone=document.getElementsByName("getFreeTrialphone")[0].value;
	getFreeTrialorganization=document.getElementsByName("getFreeTrialorganization")[0].value;
	getFreeTrialdomain=document.getElementsByName("getFreeTrialdomain")[0].value;
	getFreeTrialmessage=document.getElementsByName("getFreeTrialmessage")[0].value;
	getFreeTrialcheckbox=document.getElementById("getFreeTrialcheckbox").value,
	gRecaptchaResponse=document.getElementById("g-recaptcha-response").value,
	
	formData = new FormData();	
	formData.append("name", getFreeTrialname);
	formData.append("email", getFreeTrialemail);
	formData.append("phone", getFreeTrialphone);
	formData.append("organization", getFreeTrialorganization);
	formData.append("domain", getFreeTrialdomain);
	formData.append("message", getFreeTrialmessage);
	formData.append("checkbox", getFreeTrialcheckbox);
	formData.append("gRecaptchaResponse", gRecaptchaResponse);
	
	jQuery.ajax({
		url: "script/get-free-trial.php",
		type: "POST",
		data: formData,
		processData: false,
		contentType: false,
		success: function(response){
	
			var responseUpdate = response.split("##");
			
			var msg=responseUpdate[0];
			var styleUpdate=responseUpdate[1];

			$("#getFreeTrialMsg").html(msg);
			
			if(styleUpdate == 1) {
				
				$("#getFreeTrialMsg").attr("class","c-primary");
				$('#getFreeTrial').hide();
				
			}
			else {
				
				$("#getFreeTrialMsg").attr("class","timeline-year c-red");
				
			}
			
		},
		error: function(){}
		
	});
}

function reSendOTP(){
	
	var generateOTP = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
	var countryCode = document.getElementById("countryCode").value;
	var phone = document.getElementById("enteredPhone").value;
	postData = {"phone":phone,"textMessage":"Hi! Thanks for signing-up for example.com 7 days free trial. Please use "+ generateOTP +" to validate your account."};
	
	jQuery.ajax({
		type:"POST",
		url:"https://api.example.com/v1/sendTextMessage",
		data: JSON.stringify(postData),
		contentType: "application/json",
		headers: {
			"accounttype": "PLATFORM2020"
		},
		success:function(response)
		{
			//alert("DONE");
			console.log(response);

		},error: function (response) {
			
			//alert(response.responseJSON.error);
		},
	});
}

function myDomain(domain) {

	document.getElementById("domain").value = domain;

	var trimDomain = (domain).replace(' ','');
	if(trimDomain) {
		document.getElementById("createdDomain").innerHTML = trimDomain+".example.com";
	} else {
		document.getElementById("createdDomain").innerHTML = "";
	}
}

function createFreeInstitute() {
	
	//image=document.getElementById("image");
	var name = document.getElementById("name").value;
	var countryId = document.getElementById("countryId").value;
	var cityId = document.getElementById("cityId").value;
	var countryCode = document.getElementById("countryCode").value;
	var phone = document.getElementById("phone").value;
	var email = document.getElementById("email").value;
	var pincode = document.getElementById("pincode").value;
	var domain = document.getElementById("domain").value;
	var password = document.getElementById("password").value;
	var getFreeTrialcheckbox = document.getElementById("getFreeTrialcheckbox").value;
	var enteredOTP = document.getElementById("enteredOTP").value;
	
	var atposition=email.indexOf("@");  
	var dotposition=email.lastIndexOf(".");
	// if(!countryId)
	// {
	// 	console.log("country->undefined");
	// 	countryId = undefined;
	// }
	
	// if(!cityId)
	// {
	// 	console.log("country->undefined");
	// 	cityId = undefined;
	// }

	if(name=="") {

		alert("Please enter institute name");
		document.getElementById("name").focus();
		return false;

	} else if(email=="") {
		
		alert("Please enter email address");
		document.getElementById("email").focus();
		return false;

	}  else if(domain=="") {
		
		alert("Please enter domain name");
		document.getElementById("domain").focus();
		return false;

	} else if (atposition<1 || dotposition<atposition+2 || dotposition+2>=email.length) {
		
	  alert("Please enter a valid e-mail address");
	  document.getElementById("email").focus();
	  return false;
	  
	} else if(password=="") {
		
		alert("Please enter password");
		document.getElementById("password").focus();
		return false;

	} else if (password.length < 6 || password.length > 16) {
      
		alert("Please enter password between 6 to 16 characters.");
		document.getElementById("password").focus();
		return false;

    } else if (password.search(/\d/) == -1) {

		alert("Password must contain number.");
		document.getElementById("password").focus();
		return false;
      
    } else if (password.search(/[a-zA-Z]/) == -1) {

		alert("Password must contain letter.");
		document.getElementById("password").focus();
		return false;
        
    } else if (password.search(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) == -1) {

		alert("Password must contain special character.");
		document.getElementById("password").focus();
		return false;
        
    } else if(getFreeTrialcheckbox == 0) {
		
		alert("Please select terms of service");
		//document.getElementById("password").focus();
		return false;

	} else if (generateOTP == null) {

		generateOTP = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
		
		//postData = {"phone":countryCode+phone,"textMessage":"Hi! Thanks for signing-up for example.com 7 days free trial. Please use "+ generateOTP +" to validate your account."};
		postData = {"phone":email,"textMessage":"Hi! Thanks for signing-up for example.com 7 days free trial. Please use "+ generateOTP +" to validate your account."};
		
		jQuery.ajax({
			type:"POST",
			url:"https://api.example.com/v1/sendTextMessage",
			data: JSON.stringify(postData),
			contentType: "application/json",
			headers: {
				"accounttype": "PLATFORM2020"
			},
			success:function(response)
			{
				//alert("DONE");

			},error: function (response) {
				
				//alert(response.responseJSON.error);
			},
		});
		
		document.getElementById("enteredPhone").value = email;
		document.getElementById("openOTPPopup").click();
		
		document.getElementById("enteredOTP").focus();
		return false;
        
    } else if (enteredOTP != generateOTP) {

		alert("Please enter valid OTP");
		document.getElementById("enteredOTP").focus();
		return false;
        
    } else {

		$("#phone").prop("readonly", true);
		document.getElementById("closeOTPPopup").click();
		
		document.getElementById("instituteCreation").style.display = "none";
		document.getElementById("instituteCreationMSG").style.display = "block";

		
		var trimDomain = (domain).replace(' ','');
		domain = trimDomain+".example.com";

		formData = new FormData();	
		//formData.append("image", image.files[0]);
		formData.append("title", name);
		formData.append("email", email);
		formData.append("password", password);
		formData.append("domain", domain);

		if(countryId){
			formData.append("countryId", countryId);
		}

		if(cityId) {
			formData.append("cityId", cityId);
		}

		if(countryCode){
			formData.append("countryCode", countryCode);
		}

		if(phone) {
			formData.append("phone", phone);
		}
		
		if(pincode) {
			formData.append("pincode", pincode);
		}
		
		formData.append("currencyId", 2);
		formData.append("isMarketplaceEnable", 0);
		
		jQuery.ajax({
			type:"POST",
			url:"https://api.example.com/v1/institute",
			crossDomain: true,
			data: formData,
			cache:false,
			processData: false,
			contentType: false,
			success:function(response)
			{
				bearer_token = response.data.bearer_token;
				purchasePlan(bearer_token,email,'free');

			},error: function (response) {

				alert(response.responseJSON.error);
				document.getElementById("instituteCreation").style.display = "block";
				document.getElementById("instituteCreationMSG").style.display = "none";
				//purchasePlan('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyNiwiaWF0IjoxNTgyOTg2NzI2LCJleHAiOjE1ODMwNzMxMjZ9.cLTCDwbq32UKBncMhxlc4mpi7B321lhQAoETl3ea5xc');
				
            },
		});
		
	}

}

function emailSubscribe() {
	
	var subscribeEmailGet = document.getElementById("subscribeEmailGet").value;
	
	formData = new FormData();
	formData.append("email", subscribeEmailGet);
	
	jQuery.ajax({
		url: "script/email-subscribe.php",
		type: "POST",
		data: formData,
		processData: false,
		contentType: false,
		success: function(response){
	
			var responseUpdate = response.split("##");
			
			var msg=responseUpdate[0];
			var styleUpdate=responseUpdate[1];

			$("#responseMsg").html(msg);
			
			if(styleUpdate == 1) {
				
				$("#responseMsg").attr("class","c-primary");
				$('#inputFields').hide();
				
			}
			else {
				
				$("#responseMsg").attr("class","timeline-year c-red");
				
			}
			
		},
		error: function(){}
		
	});
}

function beAPartner() {

	partnerName=document.getElementsByName("partnerName")[0].value;
	partnerEmail=document.getElementsByName("partnerEmail")[0].value;
	partnerPhone=document.getElementsByName("partnerPhone")[0].value;
	partnerBusiness=document.getElementsByName("partnerBusiness")[0].value;
	partnerCompany=document.getElementsByName("partnerCompany")[0].value;
	partnerCity=document.getElementsByName("partnerCity")[0].value;
	partnerState=document.getElementsByName("partnerState")[0].value;
	partnerCountry=document.getElementsByName("partnerCountry")[0].value;
	partnerHearAbout=document.getElementsByName("partnerHearAbout")[0].value;
	partnerMessage=document.getElementsByName("partnerMessage")[0].value;
	getFreeTrialcheckbox=document.getElementById("getFreeTrialcheckbox").value,
	gRecaptchaResponse=document.getElementById("g-recaptcha-response").value,
	
	formData = new FormData();	
	formData.append("name", partnerName);
	formData.append("email", partnerEmail);
	formData.append("phone", partnerPhone);
	formData.append("business", partnerBusiness);
	formData.append("company", partnerCompany);
	formData.append("city", partnerCity);
	formData.append("state", partnerState);
	formData.append("country", partnerCountry);
	formData.append("HearAbout", partnerHearAbout);
	formData.append("message", partnerMessage);
	formData.append("checkbox", getFreeTrialcheckbox);
	formData.append("gRecaptchaResponse", gRecaptchaResponse);
	
	jQuery.ajax({
		url: "script/be-a-partner.php",
		type: "POST",
		data: formData,
		processData: false,
		contentType: false,
		success: function(response){
	
			var responseUpdate = response.split("##");
			
			var msg=responseUpdate[0];
			var styleUpdate=responseUpdate[1];

			$("#responseMsg").html(msg);
			
			if(styleUpdate == 1) {
				
				$("#responseMsg").attr("class","c-primary");
				$('#getFreeTrial').hide();
				
			}
			else {
				
				$("#responseMsg").attr("class","timeline-year c-red");
				
			}
			
		},
		error: function(){}
		
	});
}

/****************************************************************** 
	New Code
******************************************************************/ 
var baseURL = 'http://api.learnonapp.in:5000/v1/';  //Dev
// var baseURL = 'https://api.example.com/v1/'; //Live

function sendOTP() {

	var email = document.getElementById("email").value;
	postData = {"email":email};
		
	jQuery.ajax({
		type:"POST",
		url:baseURL+"sendRegistrationOTP",
		data: JSON.stringify(postData),
		contentType: "application/json",
		headers: {
			"accounttype": "PLATFORM2020"
		},
		success:function(response)
		{
			alert("DONE");
			otpSent = true;

		},error: function (response) {
			
			alert(response.responseJSON.error);
			otpSent = false;
		},
	});
}

function sevenDaysFreeTrial() {
	
	var name = document.getElementById("name").value;
	var email = document.getElementById("email").value;
	var domain = document.getElementById("domain").value;
	var password = document.getElementById("password").value;
	var getFreeTrialcheckbox = document.getElementById("getFreeTrialcheckbox").value;
	
	var atposition=email.indexOf("@");  
	var dotposition=email.lastIndexOf(".");
	if(name=="") {

		alert("Please enter institute name");
		document.getElementById("name").focus();
		return false;

	} else if(email=="") {
		
		alert("Please enter email address");
		document.getElementById("email").focus();
		return false;

	}  else if (atposition<1 || dotposition<atposition+2 || dotposition+2>=email.length) {
		
	  alert("Please enter a valid e-mail address");
	  document.getElementById("email").focus();
	  return false;
	  
	} else if(domain=="") {
		
		alert("Please enter domain name");
		document.getElementById("domain").focus();
		return false;

	} else if(password=="") {
		
		alert("Please enter password");
		document.getElementById("password").focus();
		return false;

	} else if (password.length < 6 || password.length > 16) {
      
		alert("Please enter password between 6 to 16 characters.");
		document.getElementById("password").focus();
		return false;

    } else if (password.search(/\d/) == -1) {

		alert("Password must contain number.");
		document.getElementById("password").focus();
		return false;
      
    } else if (password.search(/[a-zA-Z]/) == -1) {

		alert("Password must contain letter.");
		document.getElementById("password").focus();
		return false;
        
    } else if (password.search(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) == -1) {

		alert("Password must contain special character.");
		document.getElementById("password").focus();
		return false;
        
    } else if(getFreeTrialcheckbox == 0) {
		
		alert("Please select terms of service");
		return false;

	} else if (otpSent) {
		
		document.getElementById("enteredPhone").value = email;
		document.getElementById("openOTPPopup").click();
		
		document.getElementById("enteredOTP").focus();
		return false;
        
    } else if (enteredOTP != generateOTP) {

		alert("Please enter valid OTP");
		document.getElementById("enteredOTP").focus();
		return false;
        
    } else {

		$("#phone").prop("readonly", true);
		document.getElementById("closeOTPPopup").click();
		
		document.getElementById("instituteCreation").style.display = "none";
		document.getElementById("instituteCreationMSG").style.display = "block";

		
		var trimDomain = (domain).replace(' ','');
		domain = trimDomain+".example.com";

		formData = new FormData();	
		//formData.append("image", image.files[0]);
		formData.append("title", name);
		formData.append("email", email);
		formData.append("password", password);
		formData.append("domain", domain);

		if(countryId){
			formData.append("countryId", countryId);
		}

		if(cityId) {
			formData.append("cityId", cityId);
		}

		if(countryCode){
			formData.append("countryCode", countryCode);
		}

		if(phone) {
			formData.append("phone", phone);
		}
		
		if(pincode) {
			formData.append("pincode", pincode);
		}
		
		formData.append("currencyId", 2);
		formData.append("isMarketplaceEnable", 0);
		
		jQuery.ajax({
			type:"POST",
			url:"https://api.example.com/v1/institute",
			crossDomain: true,
			data: formData,
			cache:false,
			processData: false,
			contentType: false,
			success:function(response)
			{
				bearer_token = response.data.bearer_token;
				purchasePlan(bearer_token,email,'free');

			},error: function (response) {

				alert(response.responseJSON.error);
				document.getElementById("instituteCreation").style.display = "block";
				document.getElementById("instituteCreationMSG").style.display = "none";
				//purchasePlan('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyNiwiaWF0IjoxNTgyOTg2NzI2LCJleHAiOjE1ODMwNzMxMjZ9.cLTCDwbq32UKBncMhxlc4mpi7B321lhQAoETl3ea5xc');
				
            },
		});
		
	}

}
