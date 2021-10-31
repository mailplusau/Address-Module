/**
 * Module Description
 Test
 * 
 * NSVersion    Date            		Author         
 * 1.00       	2018-01-11 10:17:31   		Ankith 
 *
 * Remarks:         
 * 
 * @Last Modified by:   ankithravindran
 * @Last Modified time: 2021-11-01 07:42:55
 *
 */


var baseURL = 'https://system.na2.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
	baseURL = 'https://system.sandbox.netsuite.com';
}

$(window).load(function() {
	// Animate loader off screen
	$(".se-pre-con").fadeOut("slow");;
});

//Show Fields
function showFields() {
	$('#addresses_address1_fs_lbl_uir_label').show();
	$('#addresses_address2_fs_lbl_uir_label').show();
	$('#addresses_address3_fs_lbl_uir_label').show();
	$('#addresses_city_fs_lbl_uir_label').show();
	$('#addresses_state_fs_lbl_uir_label').show();
	$('#addresses_zipcode_fs_lbl_uir_label').show();
	$('#addresses_isdefaultshipping_fs_lbl_uir_label').show();
	$('#addresses_isdefaultbilling_fs_lbl_uir_label').show();
	$('#addresses_isresidential_fs_lbl_uir_label').show();
	$('#addresses_street_address_fs_lbl_uir_label').show();
	$('#addresses_postal_address_fs_lbl_uir_label').show();
	$('#addresses_outsidestate_fs_lbl_uir_label').show();
	$('#address1').show();
	$('#address2').show();
	$('#addresses_address3_fs').show();
	$('#city').show();
	$('#state').show();
	$('#zipcode').show();
	$('#addresses_isdefaultshipping_fs').show();
	$('#addresses_isdefaultbilling_fs').show();
	$('#addresses_isresidential_fs').show();
	$('#addresses_street_address_fs').show();
	$('#addresses_postal_address_fs').show();
	$('#addresses_outsidestate_fs').show();
}

//Hide Fields
function hideFields() {
	$('#addresses_address1_fs_lbl_uir_label').hide();
	$('#addresses_address2_fs_lbl_uir_label').hide();
	$('#addresses_address3_fs_lbl_uir_label').hide();
	$('#addresses_city_fs_lbl_uir_label').hide();
	$('#addresses_state_fs_lbl_uir_label').hide();
	$('#addresses_zipcode_fs_lbl_uir_label').hide();
	$('#addresses_isdefaultshipping_fs_lbl_uir_label').hide();
	$('#addresses_isdefaultbilling_fs_lbl_uir_label').hide();
	$('#addresses_isresidential_fs_lbl_uir_label').hide();
	$('#addresses_outsidestate_fs_lbl_uir_label').hide();
	// $('#addresses_street_address_fs_lbl_uir_label').hide();
	// $('#addresses_postal_address_fs_lbl_uir_label').hide();
	$('#address1').hide();
	$('#address2').hide();
	$('#addresses_address3_fs').hide();
	$('#city').hide();
	$('#state').hide();
	$('#zipcode').hide();
	$('#addresses_isdefaultshipping_fs').hide();
	$('#addresses_isdefaultbilling_fs').hide();
	$('#addresses_isresidential_fs').hide();
	$('#addresses_outsidestate_fs').hide();
	// $('#addresses_street_address_fs').hide();
	// $('#addresses_postal_address_fs').hide();
}

//Disable Fields
function disableFields(clear) {
	nlapiSetCurrentLineItemValue('addresses', 'postal_address', 'F');
	document.getElementById('address1').setAttribute('disabled', true);
	document.getElementById('address2').setAttribute('disabled', true);
	nlapiDisableLineItemField('addresses', 'isdefaultshipping', true);
	nlapiDisableLineItemField('addresses', 'outsidestate', true);
	nlapiDisableLineItemField('addresses', 'isdefaultbilling', true);
	nlapiDisableLineItemField('addresses', 'isresidential', true);
	nlapiSetCurrentLineItemValue('addresses', 'street_address', 'F');
	nlapiDisableLineItemField('addresses', 'isdefaultshipping', true);
	nlapiDisableLineItemField('addresses', 'isdefaultbilling', true);
	nlapiDisableLineItemField('addresses', 'isresidential', true);
	// nlapiSetCurrentLineItemValue('addresses', 'isdefaultbilling', 'F');
	// nlapiSetCurrentLineItemValue('addresses', 'isdefaultshipping', 'F');
	// nlapiSetCurrentLineItemValue('addresses', 'isresidential', 'F');
	nlapiDisableLineItemField('addresses', 'address3', true);
	nlapiDisableLineItemField('addresses', 'mailingcode', true);
	// nlapiDisableLineItemField('addresses', 'zipcode', true);

	$('#addresses_street_address_fs_lbl_uir_label').hide();
	$('#addresses_street_address_fs').hide();
	$('#addresses_postal_address_fs_lbl_uir_label').hide();
	$('#addresses_postal_address_fs').hide()

	nlapiDisableLineItemField('addresses', 'postal_address', false);
	nlapiDisableLineItemField('addresses', 'street_address', false);

	if (isNullorEmpty(clear)) {
		addresses_machine.clearline(true);
	}


}

var billingAddress = [];

/**
 * [pageInit description] - On page initialization, load the addresses for this customer and create the array to make sure the Services entereed are unique. 
 */
function pageInit() {

	var customer_id = nlapiGetFieldValue('customer');

	var customer_record = nlapiLoadRecord('customer', customer_id);

	var zeeLocation = nlapiLoadRecord('partner', customer_record.getFieldValue('partner')).getFieldValue('location')

	/**
	 * [searched_jobs description] - Load all the Addresses related to this customer
	 */
	var searched_jobs = nlapiLoadSearch('customer', 'customsearch_smc_address');

	var newFilters = new Array();
	newFilters[0] = new nlobjSearchFilter('internalid', null, 'is', nlapiGetFieldValue('customer'));

	searched_jobs.addFilters(newFilters);

	var resultSet = searched_jobs.runSearch();

	resultSet.forEachResult(function(searchResult) {

		var id = searchResult.getValue('addressinternalid', 'Address', null);
		var addr1 = searchResult.getValue('address1', 'Address', null);
		var addr2 = searchResult.getValue('address2', 'Address', null);
		var city = searchResult.getValue('city', 'Address', null);
		var state = searchResult.getValue('state', 'Address', null);
		var zip = searchResult.getValue('zipcode', 'Address', null);
		var lat = searchResult.getValue('custrecord_address_lat', 'Address', null);
		var lon = searchResult.getValue('custrecord_address_lon', 'Address', null);
		var default_shipping = searchResult.getValue('isdefaultshipping', 'Address', null);
		var default_billing = searchResult.getValue('isdefaultbilling', 'Address', null);
		var default_residential = searchResult.getValue('isresidential', 'Address', null);
		var post_outlet = searchResult.getValue('custrecord_address_ncl', 'Address', null);

		nlapiSelectNewLineItem('addresses');
		nlapiSetCurrentLineItemValue('addresses', 'addressinternalid', id);
		nlapiSetCurrentLineItemValue('addresses', 'address1', addr1);
		nlapiSetCurrentLineItemValue('addresses', 'address2', addr2);
		nlapiSetCurrentLineItemValue('addresses', 'city', city);
		nlapiSetCurrentLineItemValue('addresses', 'state', state);
		nlapiSetCurrentLineItemValue('addresses', 'zipcode', zip);
		nlapiSetCurrentLineItemValue('addresses', 'address3', post_outlet);
		nlapiSetCurrentLineItemValue('addresses', 'isdefaultbilling', default_billing);
		nlapiSetCurrentLineItemValue('addresses', 'isdefaultshipping', default_shipping);

		for (indexY = 1; indexY <= customer_record.getLineItemCount('addressbook'); indexY++) {
			if (parseInt(id) == parseInt(customer_record.getLineItemValue('addressbook', 'id', indexY))) {
				nlapiSetCurrentLineItemValue('addresses', 'isresidential', customer_record.getLineItemValue('addressbook', 'isresidential', indexY));
			}
		}
		var state_id;
		switch (state) {
			case 'NSW':
				state_id = 1;
				break;
			case 'QLD':
				state_id = 2;
				break;
			case 'VIC':
				state_id = 3;
				break;
			case 'SA':
				state_id = 4;
				break;
			case 'TAS':
				state_id = 5;
				break;
			case 'ACT':
				state_id = 6;
				break;
			case 'WA':
				state_id = 7;
				break;
			case 'NT':
				state_id = 8;
				break;
			case 'NZ':
				state_id = 9;
				break;
		}

		if (state_id != zeeLocation) {
			nlapiSetCurrentLineItemValue('addresses', 'outsidestate', 'T');
		}
		nlapiSetCurrentLineItemValue('addresses', 'lat', lat);
		nlapiSetCurrentLineItemValue('addresses', 'lng', lon);
		nlapiSetCurrentLineItemValue('addresses', 'dontvalidate_add', 'T');
		nlapiCommitLineItem('addresses');

		if (default_billing == 'T' && state_id == zeeLocation) {
			if (isNullorEmpty(lon) || isNullorEmpty(lat)) {
				nlapiSetFieldValue('billing_address_error', 'F');

				billingAddress[billingAddress.length] = addr1;
				billingAddress[billingAddress.length] = addr2;
				billingAddress[billingAddress.length] = city;
				billingAddress[billingAddress.length] = state;
				billingAddress[billingAddress.length] = zip;

			}


		}

		return true;
	});

	nlapiSetFieldDisplay('custpage_html3', false);

	var error_status = nlapiGetFieldValue('custpage_error');
	if (error_status == 'T') {
		nlapiSetFieldDisplay('custpage_html3', true);
	}

	// var result_street = $('#addresses_street_address_fs').hasClass('checkbox_unck');
	// var result_postal = $('#addresses_postal_address_fs').hasClass('checkbox_unck');

	// if (result_street && result_postal) {
	// 	hideFields();
	// }
	// 
	$('.uir-insert').hide();
	$('#addresses_clear').val('Cancel');

}

function validateDelete(type) {
	if (type == 'addresses') {
		if (confirm("Are you sure you want to delete this address?\n\nThis action cannot be undone.")) {


			if (!isNullorEmpty(nlapiGetCurrentLineItemValue(type, 'addressinternalid'))) {
				//nlapiSetFieldValue('deletedaddresses', nlapiGetFieldValue('deletedaddresses') + nlapiGetCurrentLineItemValue(type, 'addressinternalid') + ',');
				var recCustomer = nlapiLoadRecord('customer', nlapiGetFieldValue('customer'));

				for (indexY = 1; indexY <= recCustomer.getLineItemCount('addressbook'); indexY++) {
					if (parseInt(nlapiGetCurrentLineItemValue(type, 'addressinternalid')) == parseInt(recCustomer.getLineItemValue('addressbook', 'id', indexY))) {
						recCustomer.removeLineItem('addressbook', indexY);
					}
				}

				nlapiSubmitRecord(recCustomer);

			}
			return true;
		} else {
			return false;
		}
	}
}

document.getElementById("addresses_clear").onclick = function() {
	disableFields();
};

// If Street Address is ticked, the following function is called
document.getElementById("addresses_street_address_fs").onclick = function() {

	var postal_address_check = nlapiGetCurrentLineItemValue('addresses', 'postal_address');
	var street_address_check = nlapiGetCurrentLineItemValue('addresses', 'street_address');

	if (street_address_check == 'F') {
		nlapiSetCurrentLineItemValue('addresses', 'street_address', 'T');
		nlapiSetCurrentLineItemValue('addresses', 'postal_address', 'F');
		// nlapiDisableLineItemField('addresses', 'postal_address', true);
		// $('#addresses_postal_address_fs_lbl_uir_label').hide();
		// $('#addresses_postal_address_fs').hide();
		nlapiDisableLineItemField('addresses', 'isdefaultshipping', false);
		nlapiDisableLineItemField('addresses', 'isdefaultbilling', false);
		nlapiDisableLineItemField('addresses', 'isresidential', false);
		nlapiDisableLineItemField('addresses', 'outsidestate', false);
		nlapiSetCurrentLineItemValue('addresses', 'isdefaultbilling', 'T');
		nlapiSetCurrentLineItemValue('addresses', 'isdefaultshipping', 'T');
		document.getElementById('address1').removeAttribute('disabled');
		document.getElementById('address2').removeAttribute('disabled');
		nlapiDisableLineItemField('addresses', 'address3', true);
		nlapiSetCurrentLineItemValue('addresses', 'isresidential', 'F');
		nlapiDisableLineItemField('addresses', 'mailingcode', true);

	} else {
		disableFields();
	}


};

function lineInit(type) {
	if (type == 'addresses') {
		$('#addresses_street_address_fs_lbl_uir_label').show();
		$('#addresses_postal_address_fs_lbl_uir_label').show();
		$('#addresses_street_address_fs').show();
		$('#addresses_postal_address_fs').show();
		nlapiSetCurrentLineItemValue('addresses', 'postal_address', 'F');
		nlapiSetCurrentLineItemValue('addresses', 'street_address', 'F');
		showFields();
	}
}


$(document).on("blur", "#inpt_address31", function(e) {

	if (nlapiGetCurrentLineItemValue('addresses', 'address3') != 0) {
		nlapiSetCurrentLineItemValue('addresses', 'outsidestate', 'F');
		$('#address2').val('');
		$('#city').val('');
		$('#state').val('');
		// $('#mailingcode').val('');
		$('#zipcode').val('');
		nlapiDisableLineItemField('addresses', 'address2', true);
		// nlapiDisableLineItemField('addresses', 'address3', false);
		var corporate_office_internal_id = (nlapiGetCurrentLineItemValue('addresses', 'address3'));
		var noncust_lodgement_loc_record = nlapiLoadRecord('customrecord_ap_lodgment_location', corporate_office_internal_id);
		var dropdown_fields = ['custrecord_ap_lodgement_site_state'];
		var fields = ['custrecord_ap_lodgement_suburb', 'custrecord_ap_lodgement_postcode', 'custrecord_ap_lodgement_addr2', 'custrecord_ap_lodgement_site_name', 'custrecord_ap_lodgement_lat', 'custrecord_ap_lodgement_long', 'custrecord_ncl_mailing_postcode'];
		var results_state = nlapiLookupField('customrecord_ap_lodgment_location', corporate_office_internal_id, dropdown_fields, true);
		var results = nlapiLookupField('customrecord_ap_lodgment_location', corporate_office_internal_id, fields);
		var state = (results_state.custrecord_ap_lodgement_site_state);

		var locality = (results.custrecord_ap_lodgement_suburb);

		var zipcode = (results.custrecord_ap_lodgement_postcode);
		var mailingcode = (results.custrecord_ncl_mailing_postcode);

		var address2 = (results.custrecord_ap_lodgement_addr2);

		var app_addressee = results.custrecord_ap_lodgement_site_name;
		var lat = (results.custrecord_ap_lodgement_lat);
		var lng = (results.custrecord_ap_lodgement_long);
		var fullAddress = address2 + ',' + locality + ',' + state + ',' + zipcode;
		if (isNullorEmpty(lat) || isNullorEmpty(lng)) {
			$.ajax({
				type: 'POST',
				url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + fullAddress + '&key=AIzaSyA92XGDo8rx11izPYT7z2L-YPMMJ6Ih1s0&libraries=places',
				data: {},
				dataType: 'json',
				success: function(data) {

					// alert(data.geometry.location.lng());
					// 
					// var lat = (results.custrecord_ap_lodgement_lat);
					// var lng = (results.custrecord_ap_lodgement_long);
					nlapiSetCurrentLineItemValue('addresses', 'lat', data.results[0].geometry.location.lat);
					nlapiSetCurrentLineItemValue('addresses', 'lng', data.results[0].geometry.location.lng);


					// noncust_lodgement_loc_record.setFieldValue('custrecord_ap_lodgement_lat', data.results[0].geometry.location.lat);
					// noncust_lodgement_loc_record.setFieldValue('custrecord_ap_lodgement_long', data.results[0].geometry.location.lng);
				},
				error: function() {
					alert('Could not retrieve the Lat/Long for the selected Post Outlet');
					return false;
				}
			});
		} else {
			nlapiSetCurrentLineItemValue('addresses', 'lat', lat);
			nlapiSetCurrentLineItemValue('addresses', 'lng', lng);
		}

		nlapiSetCurrentLineItemValue('addresses', 'state', state);
		nlapiSetCurrentLineItemValue('addresses', 'city', locality);

		nlapiSetCurrentLineItemValue('addresses', 'zipcode', zipcode);

		nlapiSetCurrentLineItemValue('addresses', 'mailingcode', mailingcode);

		$('#addresses_address2_fs_lbl_uir_label').hide();
		$('#address2').hide();
		nlapiSetCurrentLineItemValue('addresses', 'address2', address2);

		// nlapiSubmitRecord(noncust_lodgement_loc_record);
		// nlapiSetCurrentLineItemValue('addresses', 'mailingcode', mailingcode);
	} else {
		$('#address2').val('');
		$('#city').val('');
		$('#state').val('');
		$('#zipcode').val('');
		// nlapiSetCurrentLineItemValue('addresses', 'outsidestate', 'T');
		// nlapiDisableLineItemField('addresses', 'address3', true);
		document.getElementById('address2').removeAttribute('disabled');
	}
});

// If Postal Address is ticked, the following function is called
document.getElementById("addresses_postal_address_fs").onclick = function() {

	if (nlapiGetCurrentLineItemValue('addresses', 'postal_address') == 'F') {
		nlapiSetCurrentLineItemValue('addresses', 'postal_address', 'T');
		nlapiSetCurrentLineItemValue('addresses', 'street_address', 'F');
		// nlapiDisableLineItemField('addresses', 'street_address', true);
		// $('#addresses_street_address_fs_lbl_uir_label').hide();
		// $('#addresses_street_address_fs').hide();
		nlapiDisableLineItemField('addresses', 'outsidestate', false);
		nlapiDisableLineItemField('addresses', 'isdefaultshipping', false);
		nlapiDisableLineItemField('addresses', 'isdefaultbilling', false);
		nlapiDisableLineItemField('addresses', 'isresidential', false);
		nlapiSetCurrentLineItemValue('addresses', 'isdefaultbilling', 'T');
		nlapiSetCurrentLineItemValue('addresses', 'isresidential', 'T');
		document.getElementById('address1').removeAttribute('disabled');
		if (nlapiGetCurrentLineItemValue('addresses', 'outsidestate') == 'F') {
			nlapiDisableLineItemField('addresses', 'address3', false);
		}
		nlapiDisableLineItemField('addresses', 'mailingcode', false);
		document.getElementById('address2').setAttribute('disabled', true);
		nlapiSetCurrentLineItemValue('addresses', 'isdefaultshipping', 'F');
	} else {
		// hideFields();
		disableFields();
	}

};

document.getElementById("addresses_outsidestate_fs").onclick = function() {

	if (nlapiGetCurrentLineItemValue('addresses', 'postal_address') == 'T') {
		if (nlapiGetCurrentLineItemValue('addresses', 'outsidestate') == 'F') {
			$('#inpt_address31').val('');
			$('#address2').val('');
			$('#city').val('');
			$('#state').val('');
			$('#zipcode').val('');
			nlapiSetCurrentLineItemValue('addresses', 'outsidestate', 'T');
			nlapiDisableLineItemField('addresses', 'address3', true);
			document.getElementById('address2').removeAttribute('disabled');

		} else {
			nlapiSetCurrentLineItemValue('addresses', 'outsidestate', 'F');
			$('#address2').val('');
			$('#city').val('');
			$('#state').val('');
			$('#zipcode').val('');
			nlapiDisableLineItemField('addresses', 'address2', true);
			nlapiDisableLineItemField('addresses', 'address3', false);
		}
	}

	if (nlapiGetCurrentLineItemValue('addresses', 'street_address') == 'T') {
		if (nlapiGetCurrentLineItemValue('addresses', 'outsidestate') == 'F') {
			nlapiSetCurrentLineItemValue('addresses', 'outsidestate', 'T');
			nlapiDisableLineItemField('addresses', 'address3', true);
		} else {
			nlapiSetCurrentLineItemValue('addresses', 'outsidestate', 'F');
		}
	}



};

function initAutocomplete() {
	// Create the autocomplete object, restricting the search to geographical location types.
	// types is empty to get all places, not only address. Previously it was types: ['geocode']
	var options = {
		types: [],
		componentRestrictions: {
			country: 'au'
		}
	}
	autocomplete = new google.maps.places.Autocomplete((document.getElementById('address2')), options);

	// When the user selects an address from the dropdown, populate the address fields in the form.
	autocomplete.addListener('place_changed', fillInAddress);
}

function setupClickListener(id, types) {
	// var radioButton = document.getElementById(id);
	// radioButton.addEventListener('click', function() {
	autocomplete.setTypes([]);
	// });
}


//Fill the Street No. & Street Name after selecting an address from the dropdown
function fillInAddress() {

	// Get the place details from the autocomplete object.
	var place = autocomplete.getPlace();

	nlapiSetCurrentLineItemValue('addresses', 'lat', place.geometry.location.lat());
	nlapiSetCurrentLineItemValue('addresses', 'lng', place.geometry.location.lng());

	// Enable the following fields once the address is selected from the dropdown. 
	// document.getElementById('city').removeAttribute('disabled');
	// document.getElementById('state').removeAttribute('disabled');
	// document.getElementById('zipcode').removeAttribute('disabled');

	// Get each component of the address from the place details and fill the corresponding field on the form.
	var addressComponent = "";

	for (var i = 0; i < place.address_components.length; i++) {

		if (place.address_components[i].types[0] == 'street_number' || place.address_components[i].types[0] == 'route') {
			addressComponent += place.address_components[i]['short_name'] + " ";
			nlapiSetCurrentLineItemValue('addresses', 'address2', addressComponent);
		}
		if (place.address_components[i].types[0] == 'postal_code') {
			nlapiSetCurrentLineItemValue('addresses', 'zipcode', place.address_components[i]['short_name']);
		}
		if (place.address_components[i].types[0] == 'administrative_area_level_1') {
			nlapiSetCurrentLineItemValue('addresses', 'state', place.address_components[i]['short_name']);
		}
		if (place.address_components[i].types[0] == 'locality') {
			nlapiSetCurrentLineItemValue('addresses', 'city', place.address_components[i]['short_name']);
		}
	}
}

document.getElementById("address2").onfocus = function() {
	initAutocomplete()
};

function validateInsert(type) {
	validateLine(type);
	showFields();
}

function validateLine(type) {

	if (type == 'addresses') {

		if (nlapiGetCurrentLineItemValue(type, 'dontvalidate_add') == 'F') {

			// default site and bill checkbox
			var currentIndex = nlapiGetCurrentLineItemIndex('addresses');

			var recCustomer = nlapiLoadRecord('customer', nlapiGetFieldValue('customer'));
			var partner = recCustomer.getFieldValue('partner');

			var zeeRecord = nlapiLoadRecord('partner', partner);

			var partnerName = zeeRecord.getFieldValue('companyname');

			var customerName = recCustomer.getFieldValue('companyname');
			var entityid = recCustomer.getFieldValue('entityid');

			var siteText = '';
			var billText = '';
			var resText = '';

			// Fill fields if Postal Address is checked
			if (nlapiGetCurrentLineItemValue(type, 'postal_address') == 'T') {
				if ((isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'address3')) && nlapiGetCurrentLineItemValue('addresses', 'outsidestate') == 'F') || isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'address1'))) {
					alert('Please provide and select Postal Box');
					return false;
				} else if (nlapiGetCurrentLineItemValue('addresses', 'outsidestate') == 'F') {

					var address1 = nlapiGetCurrentLineItemValue('addresses', 'address1');
					var address2 = nlapiGetCurrentLineItemValue('addresses', 'address2');
					var city = nlapiGetCurrentLineItemValue('addresses', 'city');
					var state = nlapiGetCurrentLineItemValue('addresses', 'state');
					var zipcode = nlapiGetCurrentLineItemValue('addresses', 'zipcode');
					var lat = nlapiGetCurrentLineItemValue('addresses', 'lat');
					var lng = nlapiGetCurrentLineItemValue('addresses', 'lng');

					if (!isNullorEmpty(address2) && !isNullorEmpty(city) && !isNullorEmpty(state) && !isNullorEmpty(zipcode)) {
						var fullAddress = address1 + ',' + address2 + ',' + city + ',' + state + ',' + zipcode;

						if (nlapiGetCurrentLineItemValue('addresses', 'address3') == 0) {
							var body = 'Non-Lodgement Location Request by Franchisee: ' + partnerName + ' for Customer: ' + entityid + ' ' + customerName + '. \nAddress: ' + fullAddress + '. \n Latitude: ' + lat + '. Longitude: ' + lng;

							nlapiSendEmail(112209, ['ankith.ravindran@mailplus.com.au', 'willian.suryadharma@mailplus.com.au'], 'Non-Lodgement Location Request', body, null);
						}
					}
				}
			}



			// check if required fields exists
			if ((isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'city'))) || (isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'zipcode')))) {
				alert('You will need to provide complete address details before proceeding.\n\nPlease review and provide complete address(es).');
				return false;

			} else if ((nlapiGetCurrentLineItemValue('addresses', 'isdefaultshipping') == 'T') && (isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'address2')))) {
				alert('You will need to provide "Street No. & Name" for Site Address.\n\nPlease review and provide complete address(es).');
				return false;

			} else {

				if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'addressinternalid'))) {
					if (nlapiGetCurrentLineItemValue(type, 'isdefaultbilling') == "T") {
						if (confirm("You are attempting to edit a Billing address which is used for Invoices. Doing so will update how all future Invoices are addressed.\n\nAre you sure you want to continue editing the Billing address?")) {} else {
							return false;
						}

					}
				}
				// set only 1 line item to be default shipping
				if (nlapiGetCurrentLineItemValue(type, 'isdefaultshipping') == "T") {
					for (indexC = 1; indexC <= nlapiGetLineItemCount('addresses'); indexC++) {
						if (parseInt(indexC) != parseInt(currentIndex)) {
							nlapiSetLineItemValue(type, 'isdefaultshipping', indexC, "F");
						}
					}
				}
				//set only 1 line item to be default billing
				if (nlapiGetCurrentLineItemValue(type, 'isdefaultbilling') == "T") {
					nlapiSetFieldValue('billing_address_error', 'T');
					for (indexC = 1; indexC <= nlapiGetLineItemCount('addresses'); indexC++) {
						if (parseInt(indexC) != parseInt(currentIndex)) {
							nlapiSetLineItemValue(type, 'isdefaultbilling', indexC, "F");
						}
					}
				}

				//set display text on address box = site address
				if (nlapiGetCurrentLineItemValue('addresses', 'isdefaultshipping') == 'T') {
					var addrtext = nlapiGetCurrentLineItemValue(type, 'address1') + '\n' + nlapiGetCurrentLineItemValue(type, 'address2') + '\n';
					addrtext += nlapiGetCurrentLineItemValue(type, 'city') + ' ' + nlapiGetCurrentLineItemValue(type, 'state') + ' ' + nlapiGetCurrentLineItemValue(type, 'zipcode');
					// nlapiSetFieldValue('addresstext', addrtext);
				}

				//create new line if no existing address selected
				if (isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'addressinternalid'))) {

					recCustomer.selectNewLineItem('addressbook');

					if (nlapiGetCurrentLineItemValue('addresses', 'isdefaultshipping') == "T") {
						recCustomer.setCurrentLineItemValue('addressbook', 'label', 'Site Address');
					} else if (nlapiGetCurrentLineItemValue('addresses', 'isdefaultbilling') == "T") {
						recCustomer.setCurrentLineItemValue('addressbook', 'label', 'Billing Address');
					} else if (nlapiGetCurrentLineItemValue('addresses', 'isresidential') == "T") {
						recCustomer.setCurrentLineItemValue('addressbook', 'label', 'Postal Address');
					} else {
						recCustomer.setCurrentLineItemValue('addressbook', 'label', 'Other Address');
					}

					recCustomer.setCurrentLineItemValue('addressbook', 'country', 'AU');
					// if(nlapiGetCurrentLineItemValue(type, 'postal_address') == 'F'){
					recCustomer.setCurrentLineItemValue('addressbook', 'addressee', recCustomer.getFieldValue('companyname'));
					// } else {
					//     recCustomer.setCurrentLineItemValue('addressbook', 'addressee', app_addressee);
					// }
					recCustomer.setCurrentLineItemValue('addressbook', 'addr1', nlapiGetCurrentLineItemValue('addresses', 'address1'));
					if (nlapiGetCurrentLineItemValue(type, 'postal_address') == 'F') {
						recCustomer.setCurrentLineItemValue('addressbook', 'addr2', nlapiGetCurrentLineItemValue('addresses', 'address2'));
					} else {

					}

					recCustomer.setCurrentLineItemValue('addressbook', 'city', nlapiGetCurrentLineItemValue('addresses', 'city'));
					recCustomer.setCurrentLineItemValue('addressbook', 'state', nlapiGetCurrentLineItemValue('addresses', 'state'));
					if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'mailingcode'))) {
						recCustomer.setCurrentLineItemValue('addressbook', 'zip', nlapiGetCurrentLineItemValue('addresses', 'mailingcode'));
					} else {
						recCustomer.setCurrentLineItemValue('addressbook', 'zip', nlapiGetCurrentLineItemValue('addresses', 'zipcode'));
					}


					if (nlapiGetCurrentLineItemValue('addresses', 'isdefaultshipping') == 'T') {
						recCustomer.setCurrentLineItemValue('addressbook', 'defaultshipping', 'T');

						if (isNullorEmpty(siteText)) {
							if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'address1'))) {
								siteText += nlapiGetCurrentLineItemValue('addresses', 'address1') + '<br>';
							}
							if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'address2'))) {
								siteText += nlapiGetCurrentLineItemValue('addresses', 'address2') + '<br>';
							}
							if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'city'))) {
								siteText += nlapiGetCurrentLineItemValue('addresses', 'city') + ' ';
							}
							if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'state'))) {
								siteText += nlapiGetCurrentLineItemValue('addresses', 'state') + ' ';
							}
							if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'zipcode'))) {
								siteText += nlapiGetCurrentLineItemValue('addresses', 'zipcode');
							}
						}

					} else {
						recCustomer.setCurrentLineItemValue('addressbook', 'defaultshipping', 'F');
					}

					if (nlapiGetCurrentLineItemValue('addresses', 'isdefaultbilling') == 'T') {
						recCustomer.setCurrentLineItemValue('addressbook', 'defaultbilling', 'T');
						nlapiSetFieldValue('billing_address_error', 'T');
						if (isNullorEmpty(billText)) {
							if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'address1'))) {
								billText += nlapiGetCurrentLineItemValue('addresses', 'address1') + '<br>';
							}
							if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'address2'))) {
								billText += nlapiGetCurrentLineItemValue('addresses', 'address2') + '<br>';
							}
							if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'city'))) {
								billText += nlapiGetCurrentLineItemValue('addresses', 'city') + ' ';
							}
							if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'state'))) {
								billText += nlapiGetCurrentLineItemValue('addresses', 'state') + ' ';
							}
							if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'zipcode'))) {
								billText += nlapiGetCurrentLineItemValue('addresses', 'zipcode');
							}
						}
					} else {
						recCustomer.setCurrentLineItemValue('addressbook', 'defaultbilling', 'F');
					}

					if (nlapiGetCurrentLineItemValue('addresses', 'isresidential') == 'T') {
						recCustomer.setCurrentLineItemValue('addressbook', 'isresidential', 'T');

						if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'address1'))) {
							resText += nlapiGetCurrentLineItemValue('addresses', 'address1') + '<br>';
						}
						if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'address2'))) {
							resText += nlapiGetCurrentLineItemValue('addresses', 'address2') + '<br>';
						}
						if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'city'))) {
							resText += nlapiGetCurrentLineItemValue('addresses', 'city') + ' ';
						}
						if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'state'))) {
							resText += nlapiGetCurrentLineItemValue('addresses', 'state') + ' ';
						}
						if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'zipcode'))) {
							resText += nlapiGetCurrentLineItemValue('addresses', 'zipcode') + '<br><br>';
						}
					} else {
						recCustomer.setCurrentLineItemValue('addressbook', 'isresidential', 'F');
					}

					recCustomer.commitLineItem('addressbook');
					var new_customer_id = nlapiSubmitRecord(recCustomer);


				} else {

					// if (nlapiGetCurrentLineItemValue(type, 'isdefaultbilling') == "T") {
					// 	if (confirm("You are attempting to edit a Billing address which is used for Invoices.Doing so will update how all future Invoices are addressed.\n\nAre you sure you want to continue editing the Billing address?")) {} else {
					// 		return false;
					// 	}

					// }

					//if an exisiting address line is selected

					var lineIndex = recCustomer.findLineItemValue('addressbook', 'internalid', nlapiGetCurrentLineItemValue('addresses', 'addressinternalid'));

					if (lineIndex > 0) {
						recCustomer.selectLineItem('addressbook', lineIndex);

						if (nlapiGetCurrentLineItemValue('addresses', 'isdefaultshipping') == "T") {
							recCustomer.setCurrentLineItemValue('addressbook', 'label', 'Site Address');
						} else if (nlapiGetCurrentLineItemValue('addresses', 'isdefaultbilling') == "T") {
							nlapiSetFieldValue('billing_address_error', 'T');
							recCustomer.setCurrentLineItemValue('addressbook', 'label', 'Billing Address');


						} else if (nlapiGetCurrentLineItemValue('addresses', 'isresidential') == "T") {
							recCustomer.setCurrentLineItemValue('addressbook', 'label', 'Postal Address');
						} else {
							recCustomer.setCurrentLineItemValue('addressbook', 'label', 'Other Address');
						}

						if (nlapiGetCurrentLineItemValue(type, 'country') != 'AU') {
							recCustomer.setCurrentLineItemValue('addressbook', 'country', 'AU');
						}
						// if(nlapiGetCurrentLineItemValue(type, 'postal_address') == 'F'){
						//     alert(123);
						recCustomer.setCurrentLineItemValue('addressbook', 'addressee', recCustomer.getFieldValue('companyname'));
						// } else {
						//     alert(333);
						//     recCustomer.setCurrentLineItemValue('addressbook', 'addressee', app_addressee);
						// }
						// recCustomer.setCurrentLineItemValue('addressbook', 'addressee', recCustomer.getFieldValue('companyname'));
						recCustomer.setCurrentLineItemValue('addressbook', 'addr1', nlapiGetCurrentLineItemValue('addresses', 'address1'));
						if (nlapiGetCurrentLineItemValue(type, 'postal_address') == 'F') {
							recCustomer.setCurrentLineItemValue('addressbook', 'addr2', nlapiGetCurrentLineItemValue('addresses', 'address2'));
						} else {
							recCustomer.setCurrentLineItemValue('addressbook', 'addr2', '');
						}
						recCustomer.setCurrentLineItemValue('addressbook', 'city', nlapiGetCurrentLineItemValue('addresses', 'city'));
						recCustomer.setCurrentLineItemValue('addressbook', 'state', nlapiGetCurrentLineItemValue('addresses', 'state'));
						if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'mailingcode'))) {
							recCustomer.setCurrentLineItemValue('addressbook', 'zip', nlapiGetCurrentLineItemValue('addresses', 'mailingcode'));
						} else {
							recCustomer.setCurrentLineItemValue('addressbook', 'zip', nlapiGetCurrentLineItemValue('addresses', 'zipcode'));
						}



						if (nlapiGetCurrentLineItemValue('addresses', 'isdefaultshipping') == 'T') {
							recCustomer.setCurrentLineItemValue('addressbook', 'defaultshipping', 'T');

							if (isNullorEmpty(siteText)) {
								if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'address1'))) {
									siteText += nlapiGetCurrentLineItemValue('addresses', 'address1') + '<br>';
								}
								if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'address2'))) {
									siteText += nlapiGetCurrentLineItemValue('addresses', 'address2') + '<br>';
								}
								if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'city'))) {
									siteText += nlapiGetCurrentLineItemValue('addresses', 'city') + ' ';
								}
								if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'state'))) {
									siteText += nlapiGetCurrentLineItemValue('addresses', 'state') + ' ';
								}
								if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'zipcode'))) {
									siteText += nlapiGetCurrentLineItemValue('addresses', 'zipcode');
								}
							}
						} else {
							recCustomer.setCurrentLineItemValue('addressbook', 'defaultshipping', 'F');
						}

						if (nlapiGetCurrentLineItemValue('addresses', 'isdefaultbilling') == 'T') {
							recCustomer.setCurrentLineItemValue('addressbook', 'defaultbilling', 'T');

							if (isNullorEmpty(billText)) {
								if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'address1'))) {
									billText += nlapiGetCurrentLineItemValue('addresses', 'address1') + '<br>';
								}
								if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'address2'))) {
									billText += nlapiGetCurrentLineItemValue('addresses', 'address2') + '<br>';
								}
								if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'city'))) {
									billText += nlapiGetCurrentLineItemValue('addresses', 'city') + ' ';
								}
								if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'state'))) {
									billText += nlapiGetCurrentLineItemValue('addresses', 'state') + ' ';
								}
								if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'zipcode'))) {
									billText += nlapiGetCurrentLineItemValue('addresses', 'zipcode');
								}
							}
						} else {
							recCustomer.setCurrentLineItemValue('addressbook', 'defaultbilling', 'F');
						}

						if (nlapiGetCurrentLineItemValue('addresses', 'isresidential') == 'T') {
							recCustomer.setCurrentLineItemValue('addressbook', 'isresidential', 'T');

							if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'address1'))) {
								resText += nlapiGetCurrentLineItemValue('addresses', 'address1') + '<br>';
							}
							if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'address2'))) {
								resText += nlapiGetCurrentLineItemValue('addresses', 'address2') + '<br>';
							}
							if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'city'))) {
								resText += nlapiGetCurrentLineItemValue('addresses', 'city') + ' ';
							}
							if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'state'))) {
								resText += nlapiGetCurrentLineItemValue('addresses', 'state') + ' ';
							}
							if (!isNullorEmpty(nlapiGetCurrentLineItemValue('addresses', 'zipcode'))) {
								resText += nlapiGetCurrentLineItemValue('addresses', 'zipcode') + '<br><br>';
							}
						} else {
							recCustomer.setCurrentLineItemValue('addressbook', 'isresidential', 'F');
						}

						recCustomer.commitLineItem('addressbook');
					}
					nlapiSubmitRecord(recCustomer);
				}
			}
			if (nlapiGetCurrentLineItemValue(type, 'postal_address') == 'T') {
				nlapiSetCurrentLineItemValue(type, 'address2', '');
			}
			disableFields('No');
		} else {
			// alert('sets dont validate');
			nlapiSetCurrentLineItemValue(type, 'dontvalidate_add', 'F');
		}
		hideFields();
		return true;
	} else {
		return true;
	}

	return true;
}
// 


function saveRecord() {

	var result = true;

	if (nlapiGetFieldValue('billing_address_error') == 'F') {
		alert('Please Review Billing Address: \n' + billingAddress[0] + ', ' + billingAddress[1] + ', ' + billingAddress[2] + ', ' + billingAddress[3] + ', ' + billingAddress[4] + ' \n\n If the address is correct, please click on it and reconfigure the address to set the geocode');
		return false;
	}

	var lat_array = [];
	var lon_array = [];
	var non_customer = [];
	var out_of_region = [];

	var ncl_id = [];
	var ncl_lat = [];
	var ncl_lng = [];
	var ncl_mailing = [];

	var ncl_fields = new Array();
	ncl_fields[ncl_fields.length] = 'custrecord_ncl_mailing_postcode';
	ncl_fields[ncl_fields.length] = 'custrecord_ap_lodgement_lat';
	ncl_fields[ncl_fields.length] = 'custrecord_ap_lodgement_long';

	for (y = 1; y <= nlapiGetLineItemCount('addresses'); y++) {
		var billing = nlapiGetLineItemValue('addresses', 'isdefaultbilling', y);
		lat_array[y] = nlapiGetLineItemValue('addresses', 'lat', y);
		lon_array[y] = nlapiGetLineItemValue('addresses', 'lng', y);
		var outofstate = nlapiGetLineItemValue('addresses', 'outsidestate', y);
		if (outofstate == 'F') {
			out_of_region[y] = 2;
		} else {
			out_of_region[y] = 1;
		}
		if (nlapiGetLineItemValue('addresses', 'isresidential', y) == 'T') {
			if (!isNullorEmpty(nlapiGetLineItemValue('addresses', 'address3', y))) {
				non_customer[y] = nlapiGetLineItemValue('addresses', 'address3', y);
			}

		}

		var corporate_office_internal_id = (nlapiGetLineItemValue('addresses', 'address3', y));
		if (!isNullorEmpty(corporate_office_internal_id) && corporate_office_internal_id != 0) {
			var ncl_values = new Array();
			ncl_id[y] = corporate_office_internal_id;
			ncl_lat[y] = nlapiGetLineItemValue('addresses', 'lat', y);
			ncl_lng[y] = nlapiGetLineItemValue('addresses', 'lng', y);
			ncl_mailing[y] = nlapiGetLineItemValue('addresses', 'mailingcode', y);

		}

	}

	nlapiSetFieldValue('lat_array', lat_array.toString());
	nlapiSetFieldValue('lon_array', lon_array.toString());
	nlapiSetFieldValue('non_customer', non_customer.toString());
	nlapiSetFieldValue('out_of_region', out_of_region.toString());
	nlapiSetFieldValue('ncl_id', ncl_id.toString());
	nlapiSetFieldValue('ncl_lat', ncl_lat.toString());
	nlapiSetFieldValue('ncl_lng', ncl_lng.toString());
	nlapiSetFieldValue('ncl_mailing', ncl_mailing.toString());
	return true;
}

function onclick_back() {
	var params = {
		custid: nlapiGetFieldValue('customer'),
	}
	params = JSON.stringify(params);
	var upload_url = baseURL + nlapiResolveURL('SUITELET', nlapiGetFieldValue('suitlet'), nlapiGetFieldValue('deployid')) + '&unlayered=T&custparam_params=' + params;
	window.open(upload_url, "_self", "height=750,width=650,modal=yes,alwaysRaised=yes");
}

function onclick_addnew() {
	nlapiSetFieldValue('add_new', 'T');
	$('#submitter').trigger('click');
}