	/**
	 * Module Description
	 * 
	 * NSVersion    Date            		Author         
	 * 1.00       	2017-11-22 10:49:09   		Ankith 
	 *
	 * Remarks: To fix addresses that doesnt have Lat/Lng fields filled       
	 * 
	 * @Last Modified by:   Ankith
	 * @Last Modified time: 2020-03-16 10:46:53
	 *
	 */



	function scGeoCodeAddress() {

		var searched_fix_address = nlapiLoadSearch('customer', 'customsearch_smc_address_fixup');

		var resultSet = searched_fix_address.runSearch();

		resultSet.forEachResult(function(searchResult) {

			var mix = null;

			var customerID = searchResult.getValue('internalid');
			var companyname = searchResult.getValue('companyname');
			var addressID = searchResult.getValue("addressinternalid", "Address", null);
			var address1 = searchResult.getValue("address1", "Address", null);
			var address2 = searchResult.getValue("address2", "Address", null);
			var city = searchResult.getValue("city", "Address", null);
			var state = searchResult.getValue("state", "Address", null);
			var zip = searchResult.getValue("zipcode", "Address", null);
			var ncl = searchResult.getValue("custrecord_address_ncl", "Address", null);

			var customer_record = nlapiLoadRecord('customer', customerID, {
				recordmode: 'dynamic'
			});

			nlapiLogExecution('DEBUG', 'Customer ID', customerID)

			// if (!isNullorEmpty(address1) && !isNullorEmpty(address2)) {
			for (indexY = 1; indexY <= customer_record.getLineItemCount('addressbook'); indexY++) {
				if (addressID == parseInt(customer_record.getLineItemValue('addressbook', 'id', indexY))) {
					customer_record.selectLineItem('addressbook', indexY);
					customer_record.setCurrentLineItemValue('addressbook', 'country', 'AU');
					customer_record.setCurrentLineItemValue('addressbook', 'addressee', companyname);

					if (isNullorEmpty(ncl)) {
						if (!isNullorEmpty(address1) && isNullorEmpty(address2)) {
							var fullAddress = address1 + ',' + city + ',' + state + ',' + zip;
							mix = address1;
							// mix = mix.replace(/\s+/g, '');
						} else if (isNullorEmpty(address1) && !isNullorEmpty(address2)) {
							var fullAddress = address2 + ',' + city + ',' + state + ',' + zip;
							mix = address2;
							// mix = mix.replace(/\s+/g, '');
						} else if (!isNullorEmpty(address1) && !isNullorEmpty(address2)) {
							var fullAddress = address1 + ' ' + address2 + ',' + city + ',' + state + ',' + zip;
							mix = address1 + address2;
							// mix = mix.replace(/\s+/g, '');
						} else {
							var fullAddress = null;
						}


						nlapiLogExecution('DEBUG', 'Full Address', fullAddress);

						if (!isNullorEmpty(fullAddress)) {

							var result = nlapiRequestURL('https://maps.googleapis.com/maps/api/geocode/json?address=' + fullAddress + '&key=AIzaSyA92XGDo8rx11izPYT7z2L-YPMMJ6Ih1s0&libraries=places');


							var resultJSON = JSON.parse(result.getBody());
							nlapiLogExecution('DEBUG', 'result', resultJSON.status);
							if (resultJSON.results.length != 0) {

								var subrecord = customer_record.editCurrentLineItemSubrecord('addressbook', 'addressbookaddress');

								subrecord.setFieldValue('custrecord_address_lat', resultJSON.results[0].geometry.location.lat);
								subrecord.setFieldValue('custrecord_address_lon', resultJSON.results[0].geometry.location.lng);
								subrecord.setFieldValue('custrecord_addrsub_geocode', null);

								var addressComponent = "";
								var mixComponent = "";

								for (var i = 0; i < resultJSON.results[0].address_components.length; i++) {

									if (resultJSON.results[0].address_components[i].types[0] == 'street_number' || resultJSON.results[0].address_components[i].types[0] == 'route') {
										addressComponent += resultJSON.results[0].address_components[i]['short_name'] + " ";
										// mixComponent += resultJSON.results[0].address_components[i]['short_name'];
										// mixComponent = mixComponent.replace(/\s+/g, '');
										customer_record.setCurrentLineItemValue('addressbook', 'addr2', addressComponent);
									}
									if (resultJSON.results[0].address_components[i].types[0] == 'postal_code') {
										customer_record.setCurrentLineItemValue('addressbook', 'zip', resultJSON.results[0].address_components[i]['short_name']);
									}
									if (resultJSON.results[0].address_components[i].types[0] == 'administrative_area_level_1') {
										customer_record.setCurrentLineItemValue('addressbook', 'state', resultJSON.results[0].address_components[i]['short_name']);
									}
									if (resultJSON.results[0].address_components[i].types[0] == 'locality') {
										customer_record.setCurrentLineItemValue('addressbook', 'city', resultJSON.results[0].address_components[i]['short_name']);
									}
								}

								var mixCompResult = addressComponent.substring(0, 4);

								var res = mix.indexOf(mixCompResult);

								if (res == 0) {
									customer_record.setCurrentLineItemValue('addressbook', 'addr1', "");
								} else if (res != -1) {
									customer_record.setCurrentLineItemValue('addressbook', 'addr1', mix.substring(0, res));
								}

								customer_record.setCurrentLineItemValue('addressbook', 'override', 'F');
								subrecord.commit();
								customer_record.commitLineItem('addressbook');
							} else {
								var subrecord = customer_record.editCurrentLineItemSubrecord('addressbook', 'addressbookaddress');

								subrecord.setFieldValue('custrecord_addrsub_geocode', '');

								subrecord.commit();
								customer_record.commitLineItem('addressbook');
							}
						}

					} else {
						var corporate_office_internal_id = ncl;
						var noncust_lodgement_loc_record = nlapiLoadRecord('customrecord_ap_lodgment_location', corporate_office_internal_id);
						var dropdown_fields = ['custrecord_ap_lodgement_site_state'];
						var fields = ['custrecord_ap_lodgement_suburb', 'custrecord_ap_lodgement_postcode', 'custrecord_ap_lodgement_addr2', 'custrecord_ap_lodgement_site_name', 'custrecord_ap_lodgement_lat', 'custrecord_ap_lodgement_long'];
						var results_state = nlapiLookupField('customrecord_ap_lodgment_location', corporate_office_internal_id, dropdown_fields, true);
						var results = nlapiLookupField('customrecord_ap_lodgment_location', corporate_office_internal_id, fields);
						var state = (results_state.custrecord_ap_lodgement_site_state);

						var locality = (results.custrecord_ap_lodgement_suburb);

						var zipcode = (results.custrecord_ap_lodgement_postcode);

						var address2 = (results.custrecord_ap_lodgement_addr2);

						var app_addressee = results.custrecord_ap_lodgement_site_name;
						var lat = (results.custrecord_ap_lodgement_lat);
						var lng = (results.custrecord_ap_lodgement_long);
						var fullAddress = address2 + ',' + locality + ',' + state + ',' + zipcode;
						if (isNullorEmpty(lat) || isNullorEmpty(lng)) {
							var result = nlapiRequestURL('https://maps.googleapis.com/maps/api/geocode/json?address=' + fullAddress + '&key=AIzaSyCa0FrFI1Y4k8fkD-x-Q5D1mzT2gifItOg&libraries=places');


							var resultJSON = JSON.parse(result.getBody());

							var subrecord = customer_record.editCurrentLineItemSubrecord('addressbook', 'addressbookaddress');

							subrecord.setFieldValue('custrecord_address_lat', resultJSON.results[0].geometry.location.lat);
							subrecord.setFieldValue('custrecord_address_lon', resultJSON.results[0].geometry.location.lng);
						} else {
							var subrecord = customer_record.editCurrentLineItemSubrecord('addressbook', 'addressbookaddress');

							subrecord.setFieldValue('custrecord_address_lat', lat);
							subrecord.setFieldValue('custrecord_address_lon', lng);
						}

						customer_record.setCurrentLineItemValue('addressbook', 'state', state);
						customer_record.setCurrentLineItemValue('addressbook', 'city', locality);
						customer_record.setCurrentLineItemValue('addressbook', 'zip', zipcode);
						customer_record.setCurrentLineItemValue('addressbook', 'address2', address2);

						subrecord.commit();
						customer_record.commitLineItem('addressbook');
					}
				}
			}
			nlapiSubmitRecord(customer_record,false,true);
			// }


			return true;
		});
	}