/**
 * Module Description
 * 
 * NSVersion    Date            		Author         
 * 1.00       	2018-02-12 16:42:05   	Ankith 
 *
 * Remarks: New Address Module        
 * 
 * @Last Modified by:   mailplusar
 * @Last Modified time: 2018-05-23 15:56:09
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

function address_creation(request, response) {

	if (request.getMethod() === "GET") {

		var params = request.getParameter('params');

		if (isNullorEmpty(params)) {
			var params = request.getParameter('custparam_params');
		}

		entryParamsString = params;

		params = JSON.parse(params);

		var recCustomer = nlapiLoadRecord('customer', params.custid);

		var form = nlapiCreateForm('Address Review: <a href="' + baseURL + '/app/common/entity/custjob.nl?id=' + params.custid + '">' + recCustomer.getFieldValue('entityid') + '</a> ' + recCustomer.getFieldValue('companyname'));

		form.addField('custpage_customer_id', 'integer', 'Customer ID').setDisplayType('hidden').setDefaultValue(params.custid);
		form.addField('custpage_edit_address', 'text', 'Edit Address').setDisplayType('hidden').setDefaultValue('F');
		form.addField('lon_array', 'textarea', 'Longitude').setDisplayType('hidden');
		form.addField('lat_array', 'textarea', 'Latitude').setDisplayType('hidden');
		form.addField('callcenter', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(params.callcenter);
		form.addField('out_of_region', 'textarea', 'Out of Region').setDisplayType('hidden');
		form.addField('ncl_id', 'integer', 'ncl_id').setDisplayType('hidden');
		form.addField('ncl_lat', 'textarea', 'ncl_lat').setDisplayType('hidden');
		form.addField('ncl_lng', 'textarea', 'ncl_lng').setDisplayType('hidden');
		form.addField('ncl_mailing', 'textarea', 'ncl_mailing').setDisplayType('hidden');
		form.addField('custpage_add_new', 'text', 'Add New').setDisplayType('hidden').setDefaultValue('F');
		form.addField('non_customer', 'textarea', 'Latitude').setDisplayType('hidden');
		form.addField('entry_string', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(entryParamsString);
		form.addField('custpage_suitlet', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(params.id);
		form.addField('custpage_deploy', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(params.deploy);
		form.addField('custpage_sales_record_id', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(params.sales_record_id);
		form.addField('custpage_uploaded', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(params.uploaded_file);
		form.addField('custpage_uploaded_id', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(params.custpage_uploaded_id);
		form.addField('custpage_type', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(params.type);


		var inlineQty = '';

		var inlinehtml2 = '<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA92XGDo8rx11izPYT7z2L-YPMMJ6Ih1s0&libraries=places"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link type="text/css" rel="stylesheet" href="https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css"><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css">';

		/**
		 * Description - Get all the AP Lodgement locations for this franchisee
		 */

		var searched_ncl = nlapiLoadSearch('customrecord_ap_lodgment_location', 'customsearch_smc_noncust_location');

		var newFilters = new Array();
		if (nlapiLoadRecord('partner', recCustomer.getFieldValue('partner')).getFieldValue('location') == 6) {
			newFilters[0] = new nlobjSearchFilter('custrecord_ap_lodgement_site_state', null, 'anyof', [1, 6]);

		} else {
			newFilters[0] = new nlobjSearchFilter('custrecord_ap_lodgement_site_state', null, 'is', nlapiLoadRecord('partner', recCustomer.getFieldValue('partner')).getFieldValue('location'));
		}
		//NCL Type: AusPost(1), Toll(2), StarTrack(7)
		newFilters[1] = new nlobjSearchFilter('custrecord_noncust_location_type', null, 'anyof', [1, 2, 7]);

		searched_ncl.addFilters(newFilters);

		var resultSet_ncl = searched_ncl.runSearch();


		/**
		 * [searched_jobs description] - Load all the Addresses related to this customer
		 */
		var searched_address = nlapiLoadSearch('customer', 'customsearch_smc_address');

		var newFilters_addresses = new Array();
		newFilters_addresses[0] = new nlobjSearchFilter('internalid', null, 'is', params.custid);

		searched_address.addFilters(newFilters_addresses);

		var resultSet_addresses = searched_address.runSearch();

		var addressResult = resultSet_addresses.getResults(0, 1);

		inlinehtml2 += '<div class="se-pre-con"></div><div style=\"background-color: #cfeefc !important;border: 1px solid #417ed9;padding: 10px 10px 10px 20px;width:96%;position:absolute\"><b><u>Important Instructions:</u></b><ul><li><b><u>Site Address</u></b>: Physical Address of the company</li><li><b><u>Postal Address</u>: PO Box or any other addresses where services are being performed</b></li><li><b><u>Billing Address</u></b>: Address where the invoices are mailed to. Default PO Box / Head Office of Company</li><li>There can be only <b>ONE Billing</b> and <b>ONE Site</b> Address for each customer</li><li><b><u>GeoCoding Address</u></b>: Please make sure that all the addresses have the <b><u>LAT/LNG</u></b> filled.</li><li>Use <b><u>Clear</u></b> to cancel selected/entered address</li></ul></div><br/><br/><br><br><br><br><br><br><br><br><br>';

		inlineQty += '<form id="myForm">'

		inlineQty += '<div class="form-group container create_new_address_button">';
		inlineQty += '<div class="row">';
		inlineQty += '<div class="create_new_address_section col-xs-3"><input type="button" value="CREATE ADDRESS" class="form-control btn btn-primary" id="create_new_address" /></div>'
		inlineQty += '</div>';
		inlineQty += '</div>';

		inlineQty += '<div class="form-group container row_address_type hide">';
		inlineQty += '<div class="row">'

		inlineQty += '<div class="col-xs-6 address_type_section"><div class="input-group"><span class="input-group-addon">ADDRESS TYPE</span><input type="hidden" id="add_id" value="" /><select class="form-control address_type" id="address_type">';
		inlineQty += '<option value="0"></option>';
		inlineQty += '<option value="1">Street Address</option>';
		inlineQty += '<option value="2">Postal Address</option>';
		inlineQty += '<option value="3" class="not_a_service hide">Not a Service Address</option>';
		inlineQty += '</select></div></div>';

		inlineQty += '</div>';
		inlineQty += '</div>';

		// inlineQty += '<div class="form-group container row_ncl_name hide">';
		// inlineQty += '<div class="row">'

		// inlineQty += '<div class="col-xs-6 new_ncl_name_section"><div class="input-group"><span class="input-group-addon">LOCATION NAME</span><input type="text" id="new_ncl_name" class="form-control new_ncl_name" /></div></div>';

		// inlineQty += '</div>';
		// inlineQty += '</div>';



		inlineQty += '<div class=" container row_address1_postal hide">'
		inlineQty += '<div class="form-group row">';

		inlineQty += '<div class="col-xs-6 address1_section"><div class="input-group"><span class="input-group-addon" id="address1_text">LEVEL/UNIT/SUITE</span><input id="address1" class="form-control address1" /></div></div>';

		inlineQty += '</div>';
		inlineQty += '<div class="form-group row postal_location_row">';


		inlineQty += '<div class="col-xs-5 postal_location_section"><div class="input-group"><span class="input-group-addon">POSTAL LOCATION</span><select id="postal_location" class="form-control postal_location">';
		inlineQty += '<option value="0"></option>';
		resultSet_ncl.forEachResult(function(searchResult_ncl) {

			var internal_id = searchResult_ncl.getValue('internalid');
			var name = searchResult_ncl.getValue('name');
			var post_code = searchResult_ncl.getValue('custrecord_ap_lodgement_postcode');


			inlineQty += '<option value="' + internal_id + '">' + name + '</option>';


			return true;
		});

		inlineQty += '</select></div></div>';

		inlineQty += '<div class="col-xs-1 create_new_section has-success"><input type="button" id="create_new" class="form-control btn btn-default glyphicon glyphicon-plus create_new" value="+" style="color: green;" data-toggle="tooltip" data-placement="right" title="CREATE NEW LOCATION" /></div>';

		inlineQty += '</div>';
		inlineQty += '</div>';

		inlineQty += '<div class="form-group container row_address2 hide">'
		inlineQty += '<div class="row">';

		inlineQty += '<div class="col-xs-6 address2_section"><div class="input-group"><span class="input-group-addon">STREET NO. & NAME</span><input id="address2" class="form-control address2" /></div></div>';

		inlineQty += '<div class="col-xs-6 ncl_type_section"><div class="input-group"><span class="input-group-addon">NON CUSTOMER LOCATION TYPE</span><select class="form-control ncl_type" id="ncl_type">';
		inlineQty += '<option value="0"></option>';
		inlineQty += '<option value="1">AusPost</option>';
		inlineQty += '<option value="2">Toll</option>';
		// inlineQty += '<option value="3">Bank</option>';
		// inlineQty += '<option value="4">Newsagency</option>';
		// inlineQty += '<option value="5">Petrol Station</option>';
		// inlineQty += '<option value="6">Supermarket</option>';
		inlineQty += '<option value="7">StarTrack</option>';
		// inlineQty += '<option value="8">Carpark</option>';
		// inlineQty += '<option value="9">Storage Facility</option>';
		// inlineQty += '<option value="10">Pharmacy</option>';
		// inlineQty += '<option value="11">Court</option>';
		inlineQty += '</select></div></div>';

		inlineQty += '</div>';
		inlineQty += '</div>';

		inlineQty += '<div class=" container row_address_info hide">'
		inlineQty += '<div class="form-group row">';

		inlineQty += '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">CITY</span><input id="city" readonly class="form-control city" /></div></div>';
		inlineQty += '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">STATE</span><input id="state" readonly class="form-control state" /></div></div>';

		inlineQty += '</div>';
		inlineQty += '<div class="form-group row">';
		inlineQty += '<div class="col-xs-3 post_code_section"><div class="input-group"><span class="input-group-addon">POSTCODE</span><input id="postcode" readonly class="form-control postcode" /></div></div>';

		inlineQty += '<div class="col-xs-3 mailing_code_section"><div class="input-group"><span class="input-group-addon">MAILING CODE</span><input id="mailingcode"  class="form-control mailingcode" /></div></div>';

		inlineQty += '</div>';
		inlineQty += '<div class="form-group row">';

		inlineQty += '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">LAT</span><input id="lat" readonly class="form-control lat" /></div></div>';

		inlineQty += '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">LNG</span><input id="lng" readonly class="form-control lng" /></div></div>';

		inlineQty += '</div>';
		inlineQty += '</div>';

		inlineQty += '<div class="form-group container row_address_checkbox hide">'
		inlineQty += '<div class="row">';

		inlineQty += '<div class="col-xs-2 site_checkbox_section"><div class="input-group"><input type="text" readonly value="SITE ADDRESS" class="form-control input-group-addon" /> <span class="input-group-addon"><input type="checkbox" id="default_shipping" class=" default_shipping" /></span></div></div>';

		inlineQty += '<div class="col-xs-2 bill_checkbox_section"><div class="input-group"><input type="text" readonly value="BILLING ADDRESS" class="form-control input-group-addon"/> <span class="input-group-addon"><input type="checkbox" id="default_billing" class=" default_billing" /></span></div></div>';

		inlineQty += '<div class="col-xs-2 postal_checkbox_section"><div class="input-group"><input type="text" readonly value="POSTAL ADDRESS" class="form-control input-group-addon"/> <span class="input-group-addon"><input type="checkbox" id="default_residential" class=" default_residential" /></span></div></div>';

		// inlineQty += '<div class="col-xs-3 out_checkbox_section"><div class="input-group"><input type="text" readonly value="NOT A SERVICE ADDRESS" class="form-control"/> <span class="input-group-addon"><input type="checkbox" id="default_out" class=" default_out" /></span></div></div>';

		inlineQty += '</div>';
		inlineQty += '</div>';


		inlineQty += '<div class="form-group container row_button hide">'
		inlineQty += '<div class="row">';

		inlineQty += '<div class="add_address_section col-xs-3"><input type="button" value="ADD / EDIT" class="form-control btn btn-primary" id="add_address" /></div><div class="col-xs-3 edit_address_section"><input type="button" value="ADD / EDIT" class="form-control btn btn-primary hide" id="edit_address" /></div><div class="add_new_section col-xs-3"><input type="button" value="ADD NEW LOCATION" class="form-control btn btn-primary" id="add_new" /></div><div class="clear_section col-xs-3"><input type="button" value="CANCEL" class="form-control btn btn-default" id="clear" /></div>';

		inlineQty += '</div>';
		inlineQty += '</div>';

		// End of Container
		inlineQty += '</div>';
		inlineQty += '</form>';

		/**
		 * Description - To create the table and colums assiocted with the page.
		 */
		inlineQty += '<br><br><style>table#address {font-size:12px; text-align:center; border-color: #24385b}</style><div class="form-group container-fluid"><div><div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm" role="document"><div class="modal-content" style="width: max-content;"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title panel panel-info" id="exampleModalLabel">Information</h4><br> </div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div><div ng-app="myApp" ng-controller="myCtrl"><table border="0" cellpadding="15" id="address" class="table table-responsive table-striped customer tablesorter" cellspacing="0" style="width: 100%;"><thead style="color: white;background-color: #607799;"><tr class="text-center">';
		/**
		 * ACTION ROW
		 */
		inlineQty += '<th style="vertical-align: middle;text-align: center;"><b>ACTION</b></th>';
		/**
		 * BUILDING/LEVEL/UNIT/SUITE - OR - POSTAL BOX
		 */
		// inlineQty += '<th style="vertical-align: middle;text-align: center;" class=""><b>LEVEL/UNIT/SUITE - OR - POSTAL BOX<span class="modal_display glyphicon glyphicon-info-sign" style="padding: 3px 3px 3px 3px;color: orange;cursor: pointer;" data-whatever=""></span></b></th>';
		/**
		 * POSTAL LOCATION
		 */

		inlineQty += '<th style="vertical-align: middle;text-align: center;" class=""><b>POSTAL LOCATION</b></th>';
		/**
		 * OUT OF STATE POSTAL LOCATION?
		 */
		inlineQty += '<th style="vertical-align: middle;text-align: center;" class="col-xs-1"><b>NOT A SERVICE ADDRESS</b></th>';
		/**
		 * STREET NO. & NAME
		 */
		inlineQty += '<th style="vertical-align: middle;text-align: center;" class="col-xs-4"><b>ADDRESS</b></th>';

		// /**
		//  * CITY
		//  */
		// inlineQty += '<th style="vertical-align: middle;text-align: center;" class="col-xs-1"><b>CITY<span class="modal_display btn-sm glyphicon glyphicon-info-sign" style="color: orange;padding: 3px 3px 3px 3px;cursor: pointer;" data-whatever=""></span></b></th>';
		// /**
		//  * STATE
		//  */
		// inlineQty += '<th style="vertical-align: middle;text-align: center;" class=""><b>STATE<span class="modal_display btn-sm glyphicon glyphicon-info-sign" style="color: orange;padding: 3px 3px 3px 3px;cursor: pointer;" data-whatever=""></span></b></th>';
		// /**
		//  * POSTCODE
		//  */
		// inlineQty += '<th style="vertical-align: middle;text-align: center;" class=""><b>POSTCODE<span class="modal_display btn-sm glyphicon glyphicon-info-sign" style="cursor: pointer;color: orange;padding: 3px 3px 3px 3px;" data-whatever=""></span></b></th>';
		/**
		 * SITE ADDRESS
		 */
		inlineQty += '<th style="vertical-align: middle;text-align: center;" class="col-xs-1"><b>SITE ADDRESS</b></th>';
		/**
		 * BILLING ADDRESS
		 */
		inlineQty += '<th style="vertical-align: middle;text-align: center;" class="col-xs-1" ><b>BILLING ADDRESS</b></th>';
		/**
		 * POSTAL ADDRESS
		 */
		inlineQty += '<th style="vertical-align: middle;text-align: center;" class="col-xs-1"><b>POSTAL ADDRESS</b></th>';

		/** 
		 * LAT 
		 */
		inlineQty += '<th style="vertical-align: middle;text-align: center;" class=""><b>LAT</b></th>';

		/** 
		 * LNG 
		 */
		inlineQty += '<th style="vertical-align: middle;text-align: center;" class=""><b>LNG</b></th></tr></thead><tbody>';

		if (addressResult.length != 0) {
			resultSet_addresses.forEachResult(function(searchResult_address) {

				var id = searchResult_address.getValue('addressinternalid', 'Address', null);
				var addr1 = searchResult_address.getValue('address1', 'Address', null);
				var addr2 = searchResult_address.getValue('address2', 'Address', null);
				var city = searchResult_address.getValue('city', 'Address', null);
				var state = searchResult_address.getValue('state', 'Address', null);
				var zip = searchResult_address.getValue('zipcode', 'Address', null);
				var lat = searchResult_address.getValue('custrecord_address_lat', 'Address', null);
				var lon = searchResult_address.getValue('custrecord_address_lon', 'Address', null);
				var default_shipping = searchResult_address.getValue('isdefaultshipping', 'Address', null);
				var default_billing = searchResult_address.getValue('isdefaultbilling', 'Address', null);
				var default_residential = searchResult_address.getValue('isresidential', 'Address', null);
				var post_outlet = searchResult_address.getValue('custrecord_address_ncl', 'Address', null);
				var not_service_address = searchResult_address.getValue("custrecord_not_a_service_address", "Address", null);
				var post_outlet_text = searchResult_address.getText('custrecord_address_ncl', 'Address', null);

				if (isNullorEmpty(addr1) && isNullorEmpty(addr2)) {
					var full_address = city + ', ' + state + ' - ' + zip;
				} else if (isNullorEmpty(addr1) && !isNullorEmpty(addr2)) {
					var full_address = addr2 + ', ' + city + ', ' + state + ' - ' + zip;
				} else if (!isNullorEmpty(addr1) && isNullorEmpty(addr2)) {
					var full_address = addr1 + ', ' + city + ', ' + state + ' - ' + zip;
				} else {
					var full_address = addr1 + ', ' + addr2 + ', ' + city + ', ' + state + ' - ' + zip;
				}


				inlineQty += '<tr class="text-center"><td class="first_col"><button class="btn btn-warning btn-sm edit_class glyphicon glyphicon-pencil" type="button" data-toggle="tooltip" data-addressid="' + id + '" data-placement="right" title="Edit"></button><br/><button class="btn btn-danger btn-sm remove_class glyphicon glyphicon-trash" type="button" data-toggle="tooltip" data-placement="right" data-addressid="' + id + '" title="Delete"></button></td>';

				// inlineQty += '<td><input type="text" class="form-control addr1" disabled value="' + addr1 + '"  /></td>';
				inlineQty += '<td><input disabled type="text" value="' + post_outlet_text + '" class="form-control postal_location1" data-postoutletid="' + post_outlet + '" />';


				inlineQty += '</td>';
				inlineQty += '<td>';
				if (not_service_address == 1) {
					inlineQty += '<input disabled type="text" class="form-control no_service_address" value="Yes" data-value="1" style="text-align: center;" />';
				} else {
					inlineQty += '<input disabled type="text" class="form-control no_service_address" value="No" data-value="2" style="text-align: center;"/>';
				}
				inlineQty += '</td>';
				inlineQty += '<td><input type="text" class="form-control full_address" disabled value="' + full_address + '" data-addressid="' + id + '" data-addr1="' + addr1 + '" data-addr2="' + addr2 + '" data-city="' + city + '" data-state="' + state + '" data-postcode="' + zip + '"/></td>';
				// inlineQty += '<td><input type="text" class="form-control city" disabled value="' + city + '"  /></td>';
				// inlineQty += '<td><input type="text" class="form-control state" disabled value="' + state + '"  /></td>';
				// inlineQty += '<td><input type="text" class="form-control postcode" disabled value="' + zip + '"  /></td>';

				inlineQty += '<td>';
				if (default_shipping == 'T') {
					inlineQty += '<input disabled type="text" class="form-control site" value="Yes" style="text-align: center;" />';
				} else {
					inlineQty += '<input disabled type="text" class="form-control site" value="No" style="text-align: center;"/>';
				}
				inlineQty += '</td>';
				inlineQty += '<td>';
				if (default_billing == 'T') {
					inlineQty += '<input disabled type="text" class="form-control billing" value="Yes" style="text-align: center;"/>';
				} else {
					inlineQty += '<input disabled type="text" class="form-control billing" value="No"style="text-align: center;"/>';
				}
				inlineQty += '</td>';
				inlineQty += '<td>';
				if (default_residential == 'T') {
					inlineQty += '<input disabled type="text" class="form-control residential" value="Yes" style="text-align: center;"/>';
				} else {
					inlineQty += '<input disabled type="text" class="form-control residential" value="No" style="text-align: center;"/>';
				}
				inlineQty += '</td>';
				inlineQty += '<td><input type="text" class="form-control lat1" disabled value="' + lat + '"  style="text-align: center;"/></td>';
				inlineQty += '<td><input type="text" class="form-control lon1" disabled value="' + lon + '"  style="text-align: center;"/></td>';

				inlineQty += '</tr>';

				return true;
			});
		} else {
			inlineQty += '<tr></tr>'
		}


		inlineQty += '</tbody>';
		inlineQty += '</table></div></div></div></form><br/>';

		form.addField('preview_table', 'inlinehtml', '').setLayoutType('outsidebelow', 'startrow').setDefaultValue(inlineQty);

		form.addField('custpage_html2', 'inlinehtml').setPadding(1).setLayoutType('outsideabove').setDefaultValue(inlinehtml2);

		form.setScript('customscript_cl_new_address_module');

		form.addSubmitButton('Submit');
		form.addButton('back', 'Back', 'onclick_back()');
		form.addButton('back', 'Reset', 'onclick_reset()');

		response.writePage(form);

	} else {

		var customer = request.getParameter('custpage_customer_id');
		var lat_array = request.getParameter('lat_array');
		var lon_array = request.getParameter('lon_array');
		var non_customer = request.getParameter('non_customer');
		var out_of_region = request.getParameter('out_of_region');
		var ncl_id = request.getParameter('ncl_id');
		var ncl_lat = request.getParameter('ncl_lat');
		var ncl_lng = request.getParameter('ncl_lng');
		var ncl_mailing = request.getParameter('ncl_mailing');
		var add_new = request.getParameter('custpage_add_new');
		var callcenter = request.getParameter('callcenter');

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
			custparam_params: request.getParameter('entry_string'),
		}

		nlapiSetRedirectURL('SUITELET', 'customscript_sl_geocode_address', 'customdeploy_sl_geocode_address', null, params);
	}
}