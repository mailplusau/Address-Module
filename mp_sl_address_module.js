/**
 * Module Description
 * 
 * NSVersion    Date            		Author         
 * 1.00       	2018-01-11 10:17:31   		Ankith 
 *
 * Remarks:         
 * 
 * @Last Modified by:   mailplusar
 * @Last Modified time: 2019-05-07 10:21:36
 *
 */

var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
	baseURL = 'https://system.sandbox.netsuite.com';
}
var zee = 0;
var role = nlapiGetRole();

if (role == 1000) {
	zee = nlapiGetUser();
} else if (role == 3) { //Administrator
	zee = 6; //test
} else if (role == 1032) { // System Support
	zee = 425904; //test-AR
}

var entryParamsString = '';

function addressModule(request, response) {
	if (request.getMethod() == 'GET') {

		var params = request.getParameter('params');

		if (isNullorEmpty(params)) {
			var params = request.getParameter('custparam_params');
		}
		entryParamsString = params;
		params = JSON.parse(params);
		var recCustomer = nlapiLoadRecord('customer', params.custid);
		var parameter_customerid = params.custid;
		var parameter_id = params.id;
		var parameter_deploy = params.deploy;



		nlapiLogExecution('DEBUG', 'entryParamsString1', entryParamsString);



		var form = nlapiCreateForm('Address Review: <a href="' + baseURL + '/app/common/entity/custjob.nl?id=' + parameter_customerid + '">' + recCustomer.getFieldValue('entityid') + '</a> ' + recCustomer.getFieldValue('companyname'));

		var content = '';
		content += '<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA92XGDo8rx11izPYT7z2L-YPMMJ6Ih1s0&libraries=places"></script><link type="text/css" rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css">';
		var fld = form.addField('mainfield', 'inlinehtml');
		fld.setDefaultValue(content);
		var inlinehtml2 = '';
		inlinehtml2 += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js">';
		inlinehtml2 += '<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>';
		inlinehtml2 += '<link type="text/css" rel="stylesheet" href="https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css">';
		inlinehtml2 += '<link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet">';
		inlinehtml2 += '<script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>';
		inlinehtml2 += '<div style=\"background-color: #cfeefc !important;border: 1px solid #417ed9;padding: 10px 10px 10px 20px;width:96%;position:absolute\"><b><u>Important Instructions:</u></b><ul><li><b><u>Site Address</u></b>: Physical Address of the company</li><li><b><u>Postal Address</u>: PO Box or any other addresses where services are being performed</b></li><li><b><u>Billing Address</u></b>: Address where the invoices are mailed to. Default PO Box / Head Office of Company</li><li>There can be only <b>ONE Billing</b> and <b>ONE Site</b> Address for each customer</li><li><b><u>GeoCoding Address</u></b>: Please make sure that all the addresses have the <b><u>LAT/LNG</u></b> filled.</li><li>Use <b><u>Clear</u></b> to cancel selected/entered address</li></ul></div><br/><br/><div class="se-pre-con"></div><br><br><br><br><br><br><br><br><br>';

		form.addField('custpage_html2', 'inlinehtml').setPadding(1).setLayoutType('outsideabove').setDefaultValue(inlinehtml2);

		form.addFieldGroup('custtab_main', 'Main').setShowBorder(false).setCollapsible(false);
		form.addTab('custpage_addresses', 'Addresses'); //Tab for Addresses

		form.addField('customer', 'integer', 'Customer').setDisplayType('hidden').setDefaultValue(parameter_customerid);
		form.addField('suitlet', 'text', 'suitlet_id').setDisplayType('hidden').setDefaultValue(parameter_id);
		form.addField('deployid', 'text', 'deploy_id').setDisplayType('hidden').setDefaultValue(parameter_deploy);
		form.addField('lon_array', 'textarea', 'Longitude').setDisplayType('hidden');
		form.addField('lat_array', 'textarea', 'Latitude').setDisplayType('hidden');
		form.addField('out_of_region', 'textarea', 'Out of Region').setDisplayType('hidden');
		form.addField('ncl_id', 'textarea', 'ncl_id').setDisplayType('hidden');
		form.addField('ncl_lat', 'textarea', 'ncl_lat').setDisplayType('hidden');
		form.addField('ncl_lng', 'textarea', 'ncl_lng').setDisplayType('hidden');
		form.addField('ncl_mailing', 'textarea', 'ncl_mailing').setDisplayType('hidden');
		form.addField('add_new', 'text', 'Add New').setDisplayType('hidden').setDefaultValue('F');
		form.addField('non_customer', 'textarea', 'Latitude').setDisplayType('hidden');
		form.addField('entry_string', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(entryParamsString);

		/**
		 * Description - Get all the addresses related to this customer
		 */
		var sublistAdd = form.addSubList('addresses', 'editor', 'Addresses', 'custpage_addresses');
		sublistAdd.addField('street_address', 'checkbox', 'Street Address').setLayoutType('startrow').setDefaultValue('F');
		sublistAdd.addField('postal_address', 'checkbox', 'Postal Address').setLayoutType('endrow').setDefaultValue('F');


		sublistAdd.addField('addressinternalid', 'integer', 'InternalID').setDisplayType('hidden');


		sublistAdd.addField('address1', 'text', 'Building/Level/Unit/Suite - OR - Postal Box').setLayoutType('startrow').setDisplaySize(40).setDisplayType('disabled');
		var corppo = sublistAdd.addField('address3', 'select', 'Postal Location').setLayoutType('midrow').setDisplaySize(250).setDisplayType('disabled');
		sublistAdd.addField('outsidestate', 'checkbox', 'Not a Service Address').setLayoutType('midrow').setDisplayType('disabled');


		/**
		 * Description - Get all the AP Lodgement locations for this franchisee
		 */

		var searched_jobs = nlapiLoadSearch('customrecord_ap_lodgment_location', 'customsearch_smc_noncust_location');

		var newFilters = new Array();
		if (nlapiLoadRecord('partner', recCustomer.getFieldValue('partner')).getFieldValue('location') == 6) {
			newFilters[0] = new nlobjSearchFilter('custrecord_ap_lodgement_site_state', null, 'anyof', [1, 6]);

		} else {
			newFilters[0] = new nlobjSearchFilter('custrecord_ap_lodgement_site_state', null, 'is', nlapiLoadRecord('partner', recCustomer.getFieldValue('partner')).getFieldValue('location'));
		}
		//NCL Type: AusPost(1), Toll(2), StarTrack(7)
		newFilters[1] = new nlobjSearchFilter('custrecord_noncust_location_type', null, 'anyof', [1, 2, 7]);

		searched_jobs.addFilters(newFilters);

		var resultSet = searched_jobs.runSearch();


		corppo.addSelectOption('', '');
		// corppo.addSelectOption(0, 'New Post/DX Outlet');

		resultSet.forEachResult(function(searchResult) {
			var internal_id = searchResult.getValue('internalid');
			var name = searchResult.getValue('name');
			var post_code = searchResult.getValue('custrecord_ap_lodgement_postcode');

			corppo.addSelectOption(internal_id, name + ' | ' + post_code);


			return true;
		});

		sublistAdd.addField('address2', 'text', 'Street No. & Name').setLayoutType('startrow').setDisplaySize(40).setDisplayType('disabled');
		sublistAdd.addField('city', 'text', 'City').setLayoutType('midrow').setDisplaySize(20).setDisplayType('disabled');
		var fldState = sublistAdd.addField('state', 'text', 'State').setLayoutType('midrow').setDisplayType('disabled').setDisplaySize(10);
		var fldState = sublistAdd.addField('country', 'text', 'Country').setDisplayType('hidden');
		sublistAdd.addField('zipcode', 'text', 'Postcode').setLayoutType('midrow').setDisplaySize(10).setDisplayType('disabled');
		sublistAdd.addField('mailingcode', 'text', 'Mailing Post Code').setLayoutType('midrow').setDisplaySize(10).setDisplayType('disabled');
		sublistAdd.addField('dontvalidate_add', 'checkbox', 'Dont Validate').setDisplayType('hidden').setDefaultValue('F');

		sublistAdd.addField('isdefaultbilling', 'checkbox', 'Billing Address').setLayoutType('startrow').setDisplayType('disabled');
		sublistAdd.addField('isresidential', 'checkbox', 'Postal Address').setDisplayType('disabled');
		sublistAdd.addField('isdefaultshipping', 'checkbox', 'Site Address').setLayoutType('endrow').setDisplayType('disabled');

		sublistAdd.addField('deletedaddresses', 'text', 'Deleted Addresses').setDisplayType('hidden');
		sublistAdd.addField('lat', 'text', 'Lat').setLayoutType('startrow').setDisplayType('disabled');
		sublistAdd.addField('lng', 'text', 'Lng').setLayoutType('endrow').setDisplayType('disabled');


		form.addField('deletedaddresses', 'text', 'Deleted Addresses').setDisplayType('hidden');


		form.addField('billing_address_error', 'text', 'Billing Address Error').setDisplayType('hidden');
		form.addSubmitButton('Submit');
		form.addButton('back', 'Back', 'onclick_back()');
		form.addButton('back', 'Reset', 'onclick_reset()');
		form.addButton('new_create', 'Create New Location', 'onclick_addnew()');
		form.setScript('customscript_cl_mod_address');
		response.writePage(form);
	} else {
		var customer = request.getParameter('customer');
		var lat_array = request.getParameter('lat_array');
		var lon_array = request.getParameter('lon_array');
		var non_customer = request.getParameter('non_customer');
		var out_of_region = request.getParameter('out_of_region');
		var ncl_id = request.getParameter('ncl_id');
		var ncl_lat = request.getParameter('ncl_lat');
		var ncl_lng = request.getParameter('ncl_lng');
		var ncl_mailing = request.getParameter('ncl_mailing');
		var add_new = request.getParameter('add_new');

		// var ncl_id_array;
		// var ncl_lat_array;
		// var ncl_lng_array;
		// var ncl_mailing_array;

		// nlapiLogExecution('DEBUG', 'custscript_latitude', ncl_id);

		// if (!isNullorEmpty(ncl_id)) {
		// 	ncl_id_array = ncl_id.split(',');

		// 	if (!isNullorEmpty(ncl_lat)) {
		// 		ncl_lat_array = ncl_lat.split(',');
		// 	}
		// 	if (!isNullorEmpty(ncl_lng)) {
		// 		ncl_lng_array = ncl_lng.split(',');
		// 	}
		// 	if (!isNullorEmpty(ncl_mailing)) {
		// 		ncl_mailing_array = ncl_mailing.split(',');
		// 	}

		// 	for (var y = 1; y < ncl_id_array.length; y++) {
		// 		if (ncl_id_array[y] != 0 && !isNullorEmpty(ncl_id_array[y])) {
		// 			var ncl_record = nlapiLoadRecord('customrecord_ap_lodgment_location', ncl_id_array[y]);
		// 			ncl_record.setFieldValue('custrecord_ncl_mailing_postcode', ncl_mailing_array[y]);
		// 			ncl_record.setFieldValue('custrecord_ap_lodgement_lat', ncl_lat_array[y]);
		// 			ncl_record.setFieldValue('custrecord_ap_lodgement_long', ncl_lng_array[y]);
		// 			nlapiSubmitRecord(ncl_record);
		// 		}

		// 	}


		// }

		var params = {
			custscriptcustomerid: customer,
			custscript_latitude: lat_array.toString(),
			custscript_longitude: lon_array.toString(),
			custscript_non_customer: non_customer.toString(),
			custscript_out_of_region: out_of_region.toString(),
			custscript_ncl_id: ncl_id.toString(),
			custscript_ncl_lat: ncl_lat.toString(),
			custscript_ncl_lng: ncl_lng.toString(),
			custscript_ncl_mailing: ncl_mailing.toString(),
			custscript_add_new: add_new.toString(),
			custparam_params: request.getParameter('entry_string')
		}

		nlapiSetRedirectURL('SUITELET', 'customscript_sl_geocode_address', 'customdeploy_sl_geocode_address', null, params);

		/**
		 * [params description] - Params passed to set the geocode of the billing address
		 */
		// var params = {
		// 	custscriptcustomerid: customer,
		// 	custscript_latitude: lat_array.toString(),
		// 	custscript_longitude: lon_array.toString(),
		// 	custscript_non_customer: non_customer.toString()
		// }

		// nlapiLogExecution('DEBUG', 'custscript_latitude', lat_array.toString());
		// nlapiLogExecution('DEBUG', 'custscript_longitude', lon_array.toString());
		// nlapiLogExecution('DEBUG', 'custscript_longitude', non_customer.toString());

		// /**
		//  * Description - Schedule Script to the set the geocode of the billing address provided.
		//  */
		// var status = nlapiScheduleScript('customscript_sc_mod_geocode_address', 'customdeploy1', params);
		// if (status == 'QUEUED') {

		// 	// var params = [];

		// 	// params['custid'] = parseInt(customer);
		// 	// // 	custid: customer
		// 	// // };
		// 	// 
		// 	nlapiLogExecution('DEBUG', 'entryParamsString', request.getParameter('entry_string'));

		// 	var params = {
		// 		custparam_params: request.getParameter('entry_string')
		// 	}

		// 	// params = JSON.stringify(params);
		// 	// // params['custid'] = customer;
		// 	// // 
		// 	nlapiSetRedirectURL('SUITELET', request.getParameter('suitlet'), request.getParameter('deployid'), null, params);
		// 	// var upload_url = baseURL + nlapiResolveURL('SUITELET', request.getParameter('suitlet'), request.getParameter('deployid')) + '&params=' + params;
		// 	// nlapiLogExecution('DEBUG', 'url', upload_url);
		// 	// nlapiRequestURL(upload_url);
		// 	return false;
		// }

	}
}