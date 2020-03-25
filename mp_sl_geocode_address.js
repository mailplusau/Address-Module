/**
 * Module Description
 * 
 * NSVersion    Date            Author         Remarks
 * 1.00       2017-10-17 11:20:36   Ankith         Suitelet to set the GeoCode of addresses
 * 
 * @Last Modified by:   Ankith
 * @Last Modified time: 2020-03-12 11:24:52
 *
 */


var zee = 0;
var role = nlapiGetRole();

if (role == 1000) {
	zee = nlapiGetUser();
} else if (role == 3) { //Administrator
	zee = 6; //test
} else if (role == 1032) { // System Support
	zee = 425904; //test-AR
}

function geoCodeAddress() {

	var params = request.getParameter('custparam_params');

	var params2 = {
		custparam_params: params
	}

	params = JSON.parse(params);

	var custid = parseInt(params.custid);
	var script_id = (params.id);
	var deploy_id = (params.deploy);
	var customer_id = request.getParameter('custscriptcustomerid');
	var lat = request.getParameter('custscript_latitude');
	var lon = request.getParameter('custscript_longitude');
	var non_customer = request.getParameter('custscript_non_customer');
	var out_of_region = request.getParameter('custscript_out_of_region');
	var add_new = request.getParameter('custscript_add_new');
	var ncl_id = request.getParameter('custscript_ncl_id');
	var ncl_lat = request.getParameter('custscript_ncl_lat');
	var ncl_lng = request.getParameter('custscript_ncl_lng');
	var ncl_mailing = request.getParameter('custscript_ncl_mailing');

	var form = nlapiCreateForm('');
	// if (role == 1000 || role == 3 || role == 1032) {


	var inlinehtml2 = '';

	inlinehtml2 += '<div class="se-pre-con"></div>';

	// form.addField('custid', 'text', 'Customer ID').setDisplayType('hidden').setDefaultValue(custid);
	// form.addField('latitude', 'text', 'latitude').setDisplayType('hidden').setDefaultValue(latitude);
	// form.addField('longitude', 'text', 'longitude').setDisplayType('hidden').setDefaultValue(longitude);
	// form.addField('non_customer', 'text', 'Non Customer').setDisplayType('hidden').setDefaultValue(non_customer);

	if (isNullorEmpty(customer_id) || isNullorEmpty(lat) || isNullorEmpty(lon)) {
		var body = 'Null customer id/lat/lon passed through to the Schedule script for address geocode';

		nlapiSendEmail(112209, ['ankith.ravindran@mailplus.com.au', 'willian.suryadharma@mailplus.com.au'], 'Module - Address Geocode (Suitlet) - Empty Linked Services', body, null);
		// return false;
	} else {
		var lat_array = lat.split(',');
		var lon_array = lon.split(',');
		var non_customer_array;
		if (!isNullorEmpty(non_customer)) {
			non_customer_array = non_customer.split(',');
		}
		var out_of_region_array;
		if (!isNullorEmpty(out_of_region)) {
			out_of_region_array = out_of_region.split(',');
		}


		var customer_record = nlapiLoadRecord('customer', customer_id, {
			recordmode: 'dynamic'
		});


		for (var y = 1; y < lat_array.length; y++) {

			nlapiLogExecution('DEBUG', 'lat_array', lat_array[y]);
			nlapiLogExecution('DEBUG', 'lon_array', lon_array[y]);
			nlapiLogExecution('DEBUG', 'out_of_region', out_of_region_array[y]);

			customer_record.selectLineItem('addressbook', y);
			var subrecord = customer_record.editCurrentLineItemSubrecord('addressbook', 'addressbookaddress');

			if (!isNullorEmpty(lat_array[y]) || !isNullorEmpty(lon_array[y])) {



				subrecord.setFieldValue('custrecord_address_lat', lat_array[y]);
				subrecord.setFieldValue('custrecord_address_lon', lon_array[y]);

				if (!isNullorEmpty(non_customer_array)) {
					if (!isNullorEmpty(non_customer_array[y]) && non_customer_array[y] != 0) {
						subrecord.setFieldValue('custrecord_address_ncl', non_customer_array[y]);
					}
				}

			}
			if (!isNullorEmpty(out_of_region_array)) {
				if (!isNullorEmpty(out_of_region_array[y]) && out_of_region_array[y] != 0) {
					subrecord.setFieldValue('custrecord_not_a_service_address', out_of_region_array[y]);
				}
			}
			subrecord.commit();
			customer_record.commitLineItem('addressbook');

		}

		nlapiSubmitRecord(customer_record);
	}

	var ncl_id_array;
	var ncl_lat_array;
	var ncl_lng_array;
	var ncl_mailing_array;

	var ncl_fields = new Array();
	ncl_fields[ncl_fields.length] = 'custrecord_ncl_mailing_postcode';
	ncl_fields[ncl_fields.length] = 'custrecord_ap_lodgement_lat';
	ncl_fields[ncl_fields.length] = 'custrecord_ap_lodgement_long';

	nlapiLogExecution('DEBUG', 'custscript_latitude', ncl_id);

	if (!isNullorEmpty(ncl_id)) {
		ncl_id_array = ncl_id.split(',');

		if (!isNullorEmpty(ncl_lat)) {
			ncl_lat_array = ncl_lat.split(',');
		}
		if (!isNullorEmpty(ncl_lng)) {
			ncl_lng_array = ncl_lng.split(',');
		}
		if (!isNullorEmpty(ncl_mailing)) {
			ncl_mailing_array = ncl_mailing.split(',');
		}

		for (var y = 1; y < ncl_id_array.length; y++) {
			if (ncl_id_array[y] != 0 && !isNullorEmpty(ncl_id_array[y])) {
				var ncl_values = new Array();

				ncl_values[ncl_values.length] = ncl_mailing_array[y];
				ncl_values[ncl_values.length] = ncl_lat_array[y];
				ncl_values[ncl_values.length] = ncl_lng_array[y];
				// var ncl_record = nlapiLoadRecord('customrecord_ap_lodgment_location', ncl_id_array[y]);
				// ncl_record.setFieldValue('custrecord_ncl_mailing_postcode', ncl_mailing_array[y]);
				// ncl_record.setFieldValue('custrecord_ap_lodgement_lat', ncl_lat_array[y]);
				// ncl_record.setFieldValue('custrecord_ap_lodgement_long', ncl_lng_array[y]);
				// nlapiSubmitRecord(ncl_record);
				// 
				nlapiSubmitField('customrecord_ap_lodgment_location', ncl_id_array[y], ncl_fields, ncl_values);
			}

		}
	}
	// }



	if (add_new == 'T') {
		var params = {
			custid: custid,
			id: 'customscript_sl_new_address_module',
			deploy: 'customdeploy_sl_new_address_module'
		};
		params = JSON.stringify(params);
		var params2 = {
			custparam_params: params
		}
		nlapiSetRedirectURL('SUITELET', 'customscript_sl_create_new_ncl', 'customdeploy_sl_create_new_ncl', null, params2);
	} else {
		nlapiLogExecution('DEBUG', 'script_id', script_id)
		nlapiSetRedirectURL('SUITELET', script_id, deploy_id, null, params2);
	}


	response.writePage(form);

}