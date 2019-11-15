var ctx = nlapiGetContext();

function geocode_address() {

	var customer_id = ctx.getSetting('SCRIPT', 'custscriptcustomerid');
	var lat = ctx.getSetting('SCRIPT', 'custscript_latitude');
	var lon = ctx.getSetting('SCRIPT', 'custscript_longitude');
	var non_customer = ctx.getSetting('SCRIPT', 'custscript_non_customer');


	if (isNullorEmpty(customer_id) || isNullorEmpty(lat) || isNullorEmpty(lon)) {
		var body = 'Null customer id/lat/lon passed through to the Schedule script for address geocode';

		nlapiSendEmail(112209, ['ankith.ravindran@mailplus.com.au', 'willian.suryadharma@mailplus.com.au'], 'Empty Linked Services', body, null);
		return false;
	} else {
		var lat_array = lat.split(',');
		var lon_array = lon.split(',');
		var non_customer_array;
		if (!isNullorEmpty(non_customer)) {
			non_customer_array = non_customer.split(',');
		}


		var customer_record = nlapiLoadRecord('customer', customer_id, {
			recordmode: 'dynamic'
		});


		for (var y = 1; y < lat_array.length; y++) {

			nlapiLogExecution('DEBUG', 'lat_array', lat_array[y]);
			nlapiLogExecution('DEBUG', 'lon_array', lon_array[y]);

			if (!isNullorEmpty(lat_array[y]) || !isNullorEmpty(lon_array[y])) {

				customer_record.selectLineItem('addressbook', y);
				var subrecord = customer_record.editCurrentLineItemSubrecord('addressbook', 'addressbookaddress');

				subrecord.setFieldValue('custrecord_address_lat', lat_array[y]);
				subrecord.setFieldValue('custrecord_address_lon', lon_array[y]);

				if (!isNullorEmpty(non_customer_array)) {
					if (!isNullorEmpty(non_customer_array[y]) && non_customer_array[y] != 0) {
						subrecord.setFieldValue('custrecord_address_ncl', non_customer_array[y]);
					}
				}


				subrecord.commit();
				customer_record.commitLineItem('addressbook');
			}
		}

		nlapiSubmitRecord(customer_record);
	}


}