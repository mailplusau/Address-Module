/**
 * Module Description
 * 
 * NSVersion    Date            		Author         
 * 1.00       	2018-02-12 16:42:04   		Ankith 
 *
 * Remarks: New Address Module (Client)         
 * 
 * @Last Modified by:   Ankith
 * @Last Modified time: 2020-04-08 10:11:37
 *
 */
var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
    baseURL = 'https://system.sandbox.netsuite.com';
}

$(function() {
    $('[data-toggle="tooltip"]').tooltip()
})

$(window).load(function() {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");;
});

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

    $('#lat').val(place.geometry.location.lat());
    $('#lng').val(place.geometry.location.lng());

    // Get each component of the address from the place details and fill the corresponding field on the form.
    var addressComponent = "";

    for (var i = 0; i < place.address_components.length; i++) {

        if (place.address_components[i].types[0] == 'street_number' || place.address_components[i].types[0] == 'route') {
            addressComponent += place.address_components[i]['short_name'] + " ";
            $('#address2').val(addressComponent);
        }
        if (place.address_components[i].types[0] == 'postal_code') {
            $('#postcode').val(place.address_components[i]['short_name']);
        }
        if (place.address_components[i].types[0] == 'administrative_area_level_1') {
            $('#state').val(place.address_components[i]['short_name']);
        }
        if (place.address_components[i].types[0] == 'locality') {
            $('#city').val(place.address_components[i]['short_name']);
        }
    }
}

function reset_all() {
    $('.row_address1_postal').addClass('hide');
    $('.row_address_info').addClass('hide');
    $('.row_button').addClass('hide');
    $('.row_address_checkbox').addClass('hide');
    $('#default_residential').prop('checked', false);
    $('#default_billing').prop('checked', false);
    $('#default_shipping').prop('checked', false);
    $('#default_out').prop('checked', false);
    $('.postal_location_section').addClass('hide');
    $('.postal_location_row').removeClass('form-group');
    $('.ncl_type_section').addClass('hide');
    $('.create_new_section').addClass('hide');
    $('.mailing_code_section').addClass('hide');
    $('.row_address2').addClass('hide');
    $('.row_address_type').addClass('hide');
    $('.create_new_address_button').removeClass('hide');
    $('.not_a_service').addClass('hide');
    $('#address_type').val(0);
    $('#add_id').val('');
    $('#address1').val('');
    $('#address2').val('');
    $('#postal_location').val(0);
    $('#city').val('');
    $('#state').val('');
    $('#postcode').val('');
    $('#lat').val('');
    $('#lng').val('');

    $('.add_address_section').addClass('hide');
    $('.edit_address_section').addClass('hide');
    $('.add_new_section').addClass('hide');

}

$(document).on('focus', '#address2', function(event) {
    // alert('onfocus')
    initAutocomplete();
});


$(document).on('change', '.address_type', function(e) {

    enable_all();
    if ($('option:selected', this).val() != 0) {
        $('.row_address1_postal').removeClass('hide');
        $('.row_address_info').removeClass('hide');
        $('.row_button').removeClass('hide');
        $('.row_address_checkbox').removeClass('hide');
        $('#default_residential').prop('checked', false);
        $('#default_billing').prop('checked', false);
        $('#default_shipping').prop('checked', false);
        $('#default_out').prop('checked', false);

        if (nlapiGetFieldValue('custpage_edit_address') == 'T') {
            $('.edit_address_section').removeClass('hide');
            $('.add_address_section').addClass('hide');
        } else {
            $('.edit_address_section').addClass('hide');
            $('.add_address_section').removeClass('hide');
        }

        $('.add_new_section').addClass('hide');
        if ($('option:selected', this).val() == 1 || $('option:selected', this).val() == 3) {
            $('.postal_location_section').addClass('hide');
            $('.postal_location_row').removeClass('form-group');
            $('.ncl_type_section').addClass('hide');
            $('.create_new_section').addClass('hide');
            $('.mailing_code_section').addClass('hide');
            $('.post_code_section').addClass('col-xs-6');
            $('.post_code_section').removeClass('col-xs-3');
            $('.row_address2').removeClass('hide');
            $('#address2').removeClass('hide');
            $('.address2_section').removeClass('hide');
            $('#default_shipping').prop('checked', true);
            $('#default_billing').prop('checked', true);
            $('#address1_text').html('LEVEL/UNIT/SUITE');
            // $('#default_residential').removeAttr('checked');
        } else {
            $('.postal_location_section').removeClass('hide');
            $('.postal_location_row').addClass('form-group');
            $('.row_address2').addClass('hide');
            $('.ncl_type_section').removeClass('hide');
            $('.create_new_section').removeClass('hide');
            $('.mailing_code_section').removeClass('hide');
            $('#default_residential').prop('checked', true);
            $('#default_billing').prop('checked', true);
            $('#address1_text').html('POSTAL BOX');
            $('.post_code_section').addClass('col-xs-3');
            $('.post_code_section').removeClass('col-xs-6');
            // $('#default_shipping').removeAttr('checked');
        }

    }

});

$(document).on('click', '#default_residential', function(e) {
    if ($('input.default_residential').is(':checked')) {
        $('.mailing_code_section').removeClass('hide');
    } else {
        $('.mailing_code_section').addClass('hide');
    }

});

$(document).on('click', '#create_new_address', function(e) {
    $('.row_address_type').removeClass('hide');
    $('.create_new_address_button').addClass('hide');
});

$(document).on('click', '#create_new', function(e) {

    nlapiSetFieldValue('custpage_add_new', 'T');

    // var result = updateAddress();

    // if (result == true) {
    // var params = {
    // 	custid: parseInt(nlapiGetFieldValue('custpage_customer_id')),
    // 	id: 'customscript_sl_new_address_module',
    // 	deploy: 'customdeploy_sl_new_address_module'
    // };
    // params = JSON.stringify(params);
    // var upload_url = baseURL + nlapiResolveURL('suitelet', 'customscript_sl_create_new_ncl', 'customdeploy_sl_create_new_ncl') + '&custparam_params=' + params;
    // alert(upload_url);
    // window.open(upload_url, "_self", "height=750,width=650,modal=yes,alwaysRaised=yes");
    // 
    $('#submitter').trigger('click');
    // }


});

$(document).on('change', '.postal_location', function(e) {
    if ($('option:selected', this).val() != 0) {
        var corporate_office_internal_id = ($('option:selected', this).val());
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
                url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + fullAddress + '&key=AIzaSyCa0FrFI1Y4k8fkD-x-Q5D1mzT2gifItOg&libraries=places',
                data: {},
                dataType: 'json',
                success: function(data) {

                    $('#lat').val(data.results[0].geometry.location.lat);
                    $('#lng').val(data.results[0].geometry.location.lng);

                    // nlapiSetCurrentLineItemValue('addresses', 'lat', data.results[0].geometry.location.lat);
                    // nlapiSetCurrentLineItemValue('addresses', 'lng', data.results[0].geometry.location.lng);

                },
                error: function() {
                    alert('Could not retrieve the Lat/Long for the selected Post Outlet');
                    return false;
                }
            });
        } else {
            $('#lat').val(lat);
            $('#lng').val(lng);
        }

        $('#state').val(state);
        $('#city').val(locality);
        $('#postcode').val(zipcode);
        $('#mailingcode').val(mailingcode);
    }
});

function disable_all() {

    $('#add_id').prop('disabled', true);
    $('#address1').prop('disabled', true);
    $('#address2').prop('disabled', true);
    $('#postal_location').prop('disabled', true);
    $('#default_shipping').prop('disabled', true);
    $('#default_billing').prop('disabled', true);
    $('#default_residential').prop('disabled', true);

    // $('.add_address_section').addClass('hide');
    // $('.edit_address_section').addClass('hide');
    // $('.add_new_section').addClass('hide');

}

function enable_all() {

    $('#add_id').prop('disabled', false);
    $('#address1').prop('disabled', false);
    $('#address2').prop('disabled', false);
    $('#postal_location').prop('disabled', false);
    $('#default_shipping').prop('disabled', false);
    $('#default_billing').prop('disabled', false);
    $('#default_residential').prop('disabled', false);


    // $('.add_address_section').addClass('hide');
    // $('.edit_address_section').addClass('hide');
    // $('.add_new_section').addClass('hide');

}

$(document).on('click', '#clear', function(event) {
    reset_all();
});

$(document).on('click', '.remove_class', function(event) {
    var addressid = $(this).attr('data-addressid');

    if (confirm("Are you sure you want to delete this address?\n\nThis action cannot be undone.")) {
        if (!isNullorEmpty(addressid)) {

            var recCustomer = nlapiLoadRecord('customer', parseInt(nlapiGetFieldValue('custpage_customer_id')));

            for (indexY = 1; indexY <= recCustomer.getLineItemCount('addressbook'); indexY++) {
                if (parseInt(addressid) == parseInt(recCustomer.getLineItemValue('addressbook', 'id', indexY))) {
                    recCustomer.removeLineItem('addressbook', indexY);
                }
            }

            nlapiSubmitRecord(recCustomer, false, true);

        }

        $(this).closest("tr").remove();
        return true;
    } else {
        $(this).closest("tr").remove();
        return false;
    }


});

$(document).on('click', '.edit_class', function(event) {

    reset_all();

    var disable_count = 0;

    $('.create_new_address_button').addClass('hide');
    $('.row_address_type').removeClass('hide');

    var addressid = $(this).attr('data-addressid');
    var post_location = $(this).closest('tr').find('.postal_location1').attr('data-postoutletid');
    var lat = $(this).closest('tr').find('.lat1').val();
    var lng = $(this).closest('tr').find('.lon1').val();
    var site = $(this).closest('tr').find('.site').val();
    var billing = $(this).closest('tr').find('.billing').val();
    var residential = $(this).closest('tr').find('.residential').val();
    var addr1 = $(this).closest('tr').find('.full_address').attr('data-addr1');
    var addr2 = $(this).closest('tr').find('.full_address').attr('data-addr2');
    var city = $(this).closest('tr').find('.full_address').attr('data-city');
    var state = $(this).closest('tr').find('.full_address').attr('data-state');
    var zip = $(this).closest('tr').find('.full_address').attr('data-postcode');
    var no_service_address = $(this).closest('tr').find('.no_service_address').attr('data-value');


    $('.row_address1_postal').removeClass('hide');
    $('.row_address_info').removeClass('hide');
    $('.row_button').removeClass('hide');
    $('.row_address_checkbox').removeClass('hide');
    $('.not_a_service').removeClass('hide');
    $('.row_ncl_name').addClass('hide');

    nlapiSetFieldValue('custpage_edit_address', 'T');


    if (residential == 'Yes') {
        $('#default_residential').prop('checked', true);
        $('#address_type').val(2);
        $('#address1_text').html('POSTAL BOX');
        enable_all();
    } else {
        $('#default_residential').prop('checked', false);
        disable_all();
        disable_count++;
    }
    if (billing == 'Yes') {
        $('#default_billing').prop('checked', true);
        disable_all();
        disable_count++;
    } else {
        $('#default_billing').prop('checked', false);
        disable_all();
        disable_count++;
    }
    if (site == 'Yes') {
        $('#default_shipping').prop('checked', true);
        $('#address_type').val(1);
        $('#address1_text').html('LEVEL/UNIT/SUITE');
        enable_all();
    } else {
        $('#default_shipping').prop('checked', false);
        if (disable_count == 0) {
            disable_all();
        }

    }

    if (residential == 'No' && billing == 'No' && site == 'No') {
        disable_all();
    }



    if (isNullorEmpty(post_location)) {
        $('.postal_location_section').addClass('hide');
        $('.postal_location_row').removeClass('form-group');
    } else {
        $('.postal_location_section').removeClass('hide');
        $('.postal_location_row').addClass('form-group');
        $('#postal_location').val(post_location);
    }

    $('.ncl_type_section').addClass('hide');
    $('.create_new_section').addClass('hide');
    $('.mailing_code_section').addClass('hide');
    $('.row_address2').removeClass('hide');
    $('#edit_address').removeClass('hide');
    $('.row_button').removeClass('hide');
    $('.add_address_section').addClass('hide');
    $('.add_address_section').addClass('hide');
    $('.edit_address_section').removeClass('hide');
    $('.add_new_section').addClass('hide');

    $('#address1').val(addr1);

    if (!isNullorEmpty(addr2)) {
        $('#address2').val(addr2);
        $('.address2_section').removeClass('hide');
    } else {
        if (site == 'No') {
            $('.address2_section').addClass('hide');
        }

    }

    if (no_service_address == '1') {
        $('#default_out').prop('checked', true);
        $('#address2').val(addr2);
        $('.address2_section').removeClass('hide');
    } else {
        $('#default_out').prop('checked', false);
    }


    $('#city').val(city);
    $('#state').val(state);
    $('#postcode').val(zip);
    $('#lat').val(lat);
    $('#lng').val(lng);
    $('#add_id').val(addressid);

});

$(document).on('click', '.default_out', function(e) {
    if ($('input.default_out').is(':checked')) {
        $('.postal_location_section').addClass('hide');
        $('.postal_location_row').removeClass('form-group');
        $('.create_new_section').addClass('hide');
        $('.row_address2').removeClass('hide');
        $('.ncl_type_section').addClass('hide');
    } else if ($('.address_type option:selected').val() == 2) {
        $('.postal_location_section').removeClass('hide');
        $('.postal_location_row').addClass('form-group');
        $('.create_new_section').removeClass('hide');
        $('.row_address2').addClass('hide');
    }
});

$(document).on('click', '#add_address', function(e) {
    // var recCustomer = nlapiLoadRecord('customer', parseInt(nlapiGetFieldValue('custpage_customer_id')));
    // var partner = recCustomer.getFieldValue('partner');

    // var zeeRecord = nlapiLoadRecord('partner', partner);

    // var partnerName = zeeRecord.getFieldValue('companyname');

    // var customerName = recCustomer.getFieldValue('companyname');
    // var entityid = recCustomer.getFieldValue('entityid');

    var address_type = $('#address_type').val();
    var address_id = $('#add_id').val();
    var address1 = $('#address1').val();
    var address2 = $('#address2').val();
    var postal_location = $('#postal_location option:selected').val();
    var postal_location_text = $('#postal_location option:selected').text();
    var city = $('#city').val();
    var state = $('#state').val();
    var zip = $('#postcode').val();
    var mailingcode = $('#mailingcode').val();
    var lat = $('#lat').val();
    var lng = $('#lng').val();

    nlapiSetFieldValue('custpage_edit_address', 'F');

    if ((isNullorEmpty(city)) || (isNullorEmpty(zip))) {
        alert('You will need to provide complete address details before proceeding.\n\nPlease review and provide complete address(es).');
        return false;

    } else if (($('input.default_shipping').is(':checked')) && (isNullorEmpty(address2))) {
        alert('You will need to provide "Street No. & Name" for Site Address.\n\nPlease review and provide complete address(es).');
        return false;
    }

    if (isNullorEmpty(lat) || isNullorEmpty(lng)) {
        if (!($('input.default_out').is(':checked'))) {
            alert('Address is not GeoCoded.\n\nPlease review and provide complete address(es).');
            return false;
        }
    }

    if (address_type == '2') {
        if ((isNullorEmpty(postal_location) && !($('input.default_shipping').is(':checked'))) || isNullorEmpty(address1)) {
            alert('Please provide and select Postal Box');
            return false;

        }
    }
    if ($('input.default_billing').is(':checked')) {
        if (confirm("You are attempting to edit a Billing address which is used for Invoices. Doing so will update how all future Invoices are addressed.\n\nAre you sure you want to continue editing the Billing address?")) {} else {
            return false;
        }

    }
    // 


    var full_address_elem = document.getElementsByClassName("full_address");
    var site_elem = document.getElementsByClassName("site");
    var billing_elem = document.getElementsByClassName("billing");
    var residential_elem = document.getElementsByClassName("residential");

    var full_address_array = [];
    var site_array = [];
    var billing_array = [];
    var residential_array = [];

    for (var i = 0; i < full_address_elem.length; ++i) {
        if ($('input.default_billing').is(':checked')) {
            if (billing_elem[i].value == 'Yes') {
                billing_elem[i].value = 'No';
            }
        }
        if ($('input.default_shipping').is(':checked')) {
            if (site_elem[i].value == 'Yes') {
                site_elem[i].value = 'No';
            }
        }


    }

    if (isNullorEmpty(address1) && isNullorEmpty(address2)) {
        var full_address = city + ', ' + state + ' - ' + zip;
    } else if (isNullorEmpty(address1) && !isNullorEmpty(address2)) {
        var full_address = address2 + ', ' + city + ', ' + state + ' - ' + zip;
    } else if (!isNullorEmpty(address1) && isNullorEmpty(address2)) {
        var full_address = address1 + ', ' + city + ', ' + state + ' - ' + zip;
    } else {
        var full_address = address1 + ', ' + address2 + ', ' + city + ', ' + state + ' - ' + zip;
    }

    var inlineQty = '';

    if (isNullorEmpty(address_id)) {
        inlineQty += '<tr><td class="first_col"><button class="btn btn-warning btn-sm edit_class glyphicon glyphicon-pencil" type="button" data-toggle="tooltip" data-addressid="' + null + '" data-placement="right" title="Edit"></button><br/><button class="btn btn-danger btn-sm remove_class glyphicon glyphicon-trash" type="button" data-toggle="tooltip" data-placement="right" data-addressid="' + id + '" title="Delete"></button></td>';

        // inlineQty += '<td><input type="text" class="form-control addr1" disabled value="' + addr1 + '"  /></td>';
        inlineQty += '<td><input disabled type="text" value="' + postal_location_text + '" class="form-control postal_location1" data-postoutletid="' + postal_location + '" />';


        inlineQty += '</td>';
        inlineQty += '<td>';
        if ($('input.default_out').is(':checked')) {
            inlineQty += '<input disabled type="text" class="form-control no_service_address" value="Yes" data-value="1" style="text-align: center;"/>';
        } else {
            inlineQty += '<input disabled type="text" class="form-control no_service_address" value="No" data-value="2" style="text-align: center;"/>';
        }
        inlineQty += '</td>';
        inlineQty += '<td><input type="text" class="form-control full_address" disabled value="' + full_address + '" data-addressid="' + null + '" data-addr1="' + address1 + '" data-addr2="' + address2 + '" data-city="' + city + '" data-state="' + state + '" data-postcode="' + zip + '" data-mailingcode="' + mailingcode + '"/></td>';
        // inlineQty += '<td><input type="text" class="form-control city" disabled value="' + city + '"  /></td>';
        // inlineQty += '<td><input type="text" class="form-control state" disabled value="' + state + '"  /></td>';
        // inlineQty += '<td><input type="text" class="form-control postcode" disabled value="' + zip + '"  /></td>';

        inlineQty += '<td>';
        if ($('input.default_shipping').is(':checked')) {
            inlineQty += '<input disabled type="text" class="form-control site" value="Yes" style="text-align: center;"/>';
        } else {
            inlineQty += '<input disabled type="text" class="form-control site" value="No" style="text-align: center;"/>';
        }
        inlineQty += '</td>';
        inlineQty += '<td>';
        if ($('input.default_billing').is(':checked')) {
            inlineQty += '<input disabled type="text" class="form-control billing" value="Yes" style="text-align: center;"/>';
        } else {
            inlineQty += '<input disabled type="text" class="form-control billing" value="No"style="text-align: center;"/>';
        }
        inlineQty += '</td>';
        inlineQty += '<td>';
        if ($('input.default_residential').is(':checked')) {
            inlineQty += '<input disabled type="text" class="form-control residential" value="Yes" style="text-align: center;"/>';
        } else {
            inlineQty += '<input disabled type="text" class="form-control residential" value="No" style="text-align: center;"/>';
        }
        inlineQty += '</td>';
        inlineQty += '<td><input type="text" class="form-control lat1" disabled value="' + lat + '"  /></td>';
        inlineQty += '<td><input type="text" class="form-control lon1" disabled value="' + lng + '"  /></td>';

        inlineQty += '</tr>';

        $('#address tr:last').after(inlineQty);
    }

    reset_all();
});



$(document).on('click', '#edit_address', function(e) {

    nlapiSetFieldValue('custpage_edit_address', 'F');

    var address_type = $('#address_type').val();
    var address_id = $('#add_id').val();
    var address1 = $('#address1').val();
    var address2 = $('#address2').val();
    var postal_location = $('#postal_location option:selected').val();
    var postal_location_text = $('#postal_location option:selected').text();
    var city = $('#city').val();
    var state = $('#state').val();
    var zip = $('#postcode').val();
    var lat = $('#lat').val();
    var lng = $('#lng').val();

    if ((isNullorEmpty(city)) || (isNullorEmpty(zip))) {
        alert('You will need to provide complete address details before proceeding.\n\nPlease review and provide complete address(es).');
        return false;

    } else if (($('input.default_shipping').is(':checked')) && (isNullorEmpty(address2))) {
        alert('You will need to provide "Street No. & Name" for Site Address.\n\nPlease review and provide complete address(es).');
        return false;
    }

    if (isNullorEmpty(lat) || isNullorEmpty(lng)) {
        if (!($('input.default_out').is(':checked'))) {
            alert('Address is not GeoCoded.\n\nPlease review and provide complete address(es).');
            return false;
        }
    }

    if ($('input.default_billing').is(':checked')) {
        if (confirm("You are attempting to edit a Billing address which is used for Invoices. Doing so will update how all future Invoices are addressed.\n\nAre you sure you want to continue editing the Billing address?")) {} else {
            return false;
        }

    }

    if (address_type == '2') {
        if ((isNullorEmpty(postal_location) && !($('input.default_shipping').is(':checked'))) || isNullorEmpty(address1)) {
            alert('Please provide and select Postal Box');
            return false;

        }
    }


    var full_address_elem = document.getElementsByClassName("full_address");
    var edit_class_elem = document.getElementsByClassName("edit_class");
    var postal_location_elem = document.getElementsByClassName("postal_location1");
    var site_elem = document.getElementsByClassName("site");
    var billing_elem = document.getElementsByClassName("billing");
    var residential_elem = document.getElementsByClassName("residential");
    var lat_elem = document.getElementsByClassName("lat1");
    var lng_elem = document.getElementsByClassName("lon1");
    var no_service_address_elem = document.getElementsByClassName("no_service_address");

    var full_address_array = [];
    var site_array = [];
    var billing_array = [];
    var residential_array = [];

    for (var i = 0; i < full_address_elem.length; ++i) {
        if ($('input.default_billing').is(':checked')) {
            if (billing_elem[i].value == 'Yes') {
                billing_elem[i].value = 'No';
            }
        }
        if ($('input.default_shipping').is(':checked')) {
            if (site_elem[i].value == 'Yes') {
                site_elem[i].value = 'No';
            }
        }


    }

    if (!isNullorEmpty(address_id)) {
        for (var i = 0; i < full_address_elem.length; ++i) {
            var row_address_id = edit_class_elem[i].getAttribute('data-addressid');
            if (address_id == row_address_id) {
                postal_location_elem[i].value = postal_location_text;
                postal_location_elem[i].setAttribute('data-postoutletid', postal_location);
                if ($('input.default_out').is(':checked')) {
                    no_service_address_elem[i].value = 'Yes';
                    no_service_address_elem[i].setAttribute('data-value', 1);
                } else {
                    no_service_address_elem[i].value = 'No';
                    no_service_address_elem[i].setAttribute('data-value', 2);
                }
                if (isNullorEmpty(address1) && isNullorEmpty(address2)) {
                    var full_address = city + ', ' + state + ' - ' + zip;
                } else if (isNullorEmpty(address1) && !isNullorEmpty(address2)) {
                    var full_address = address2 + ', ' + city + ', ' + state + ' - ' + zip;
                } else if (!isNullorEmpty(address1) && isNullorEmpty(address2)) {
                    var full_address = address1 + ', ' + city + ', ' + state + ' - ' + zip;
                } else {
                    var full_address = address1 + ', ' + address2 + ', ' + city + ', ' + state + ' - ' + zip;
                }

                full_address_elem[i].value = full_address;
                full_address_elem[i].setAttribute('data-addr1', address1);
                full_address_elem[i].setAttribute('data-addr2', address2);
                full_address_elem[i].setAttribute('data-city', city);
                full_address_elem[i].setAttribute('data-state', state);
                full_address_elem[i].setAttribute('data-postcode', zip);

                if ($('input.default_shipping').is(':checked')) {
                    site_elem[i].value = 'Yes';
                } else {
                    site_elem[i].value = 'No';
                }

                if ($('input.default_billing').is(':checked')) {
                    billing_elem[i].value = 'Yes';
                } else {
                    billing_elem[i].value = 'No';
                }

                if ($('input.default_residential').is(':checked')) {
                    residential_elem[i].value = 'Yes';
                } else {
                    residential_elem[i].value = 'No';
                }

                lat_elem[i].value = lat;
                lng_elem[i].value = lng;
            }
        }
    }
    reset_all();
});

$(document).on('click', '#add_new', function(e) {

    var address_type = $('#address_type').val();
    var address_id = $('#add_id').val();
    var address1 = $('#address1').val();
    var address2 = $('#address2').val();
    var postal_location = $('#postal_location option:selected').val();
    var postal_location_text = $('#postal_location option:selected').text();
    var city = $('#city').val();
    var state = $('#state').val();
    var zip = $('#postcode').val();
    var lat = $('#lat').val();
    var lng = $('#lng').val();
    var ncl_type = $('#ncl_type').val();

    if ((isNullorEmpty(city)) || (isNullorEmpty(zip))) {
        alert('You will need to provide complete address details before proceeding.\n\nPlease review and provide complete address(es).');
        return false;

    } else if (($('input.default_shipping').is(':checked')) && (isNullorEmpty(address2))) {
        alert('You will need to provide "Street No. & Name" for Site Address.\n\nPlease review and provide complete address(es).');
        return false;
    }

    if (isNullorEmpty(lat) || isNullorEmpty(lng)) {
        if (!($('input.default_out').is(':checked'))) {
            alert('Address is not GeoCoded.\n\nPlease review and provide complete address(es).');
            return false;
        }
    }

    if (address_type == '2') {
        if ((isNullorEmpty(postal_location) && !($('input.default_shipping').is(':checked'))) || isNullorEmpty(address1)) {
            alert('Please provide and select Postal Box');
            return false;

        }
    }


    /**
     * Description - Get all the AP Lodgement locations for this franchisee
     */

    var searched_ncl = nlapiLoadSearch('customrecord_ap_lodgment_location', 'customsearch_smc_noncust_location');

    var newFilters = new Array();

    //NCL Type: AusPost(1), Toll(2), StarTrack(7)
    newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_ap_lodgement_lat', null, 'equalto', lat);
    newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_ap_lodgement_long', null, 'equalto', lng);
    newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_noncust_location_type', null, 'is', ncl_type);

    searched_ncl.addFilters(newFilters);

    var resultSet_ncl = searched_ncl.runSearch();

    var nclResult = resultSet_ncl.getResults(0, 1);

    if (!isNullorEmpty(nclResult) && nclResult.length != 0) {

        $('.postal_location_section').removeClass('hide');
        $('.postal_location_row').addClass('form-group');
        var select = $('#postal_location');
        var options = select.find('option');
        resultSet_ncl.forEachResult(function(searchResult_ncl) {

            var ncl_id = searchResult_ncl.getValue("internalid", null, null);
            var ncl_name = searchResult_ncl.getValue("name", null, null);
            var ncl_address1 = searchResult_ncl.getValue("custrecord_ap_lodgement_addr1", null, null);
            var ncl_address2 = searchResult_ncl.getValue("custrecord_ap_lodgement_addr2", null, null);
            var ncl_city = searchResult_ncl.getValue("custrecord_ap_lodgement_suburb", null, null);
            var ncl_state = searchResult_ncl.getText("custrecord_ap_lodgement_site_state", null, null);
            var ncl_postcode = searchResult_ncl.getValue("custrecord_ap_lodgement_postcode", null, null);
            var ncl_lat = searchResult_ncl.getValue("custrecord_ap_lodgement_lat", null, null);
            var ncl_lng = searchResult_ncl.getValue("custrecord_ap_lodgement_long", null, null);

            options.hide().filter('[value="' + ncl_id + '"]').show();

            return true;
        });

        alert('The NCL already Exists');
        return false;
    } else {
        alert('Else part')
    }

});

function updateAddress(submit) {
    var recCustomer = nlapiLoadRecord('customer', parseInt(nlapiGetFieldValue('custpage_customer_id')));

    var partner = recCustomer.getFieldValue('partner');

    var zeeRecord = nlapiLoadRecord('partner', partner);

    var partnerName = zeeRecord.getFieldValue('companyname');

    var customerName = recCustomer.getFieldValue('companyname');
    var entityid = recCustomer.getFieldValue('entityid');

    var edit_class_elem = document.getElementsByClassName("edit_class");
    var full_address_elem = document.getElementsByClassName("full_address");
    var site_elem = document.getElementsByClassName("site");
    var billing_elem = document.getElementsByClassName("billing");
    var residential_elem = document.getElementsByClassName("residential");
    var postal_location_elem = document.getElementsByClassName("postal_location1");
    var no_service_address_elem = document.getElementsByClassName("no_service_address");
    var lat_elem = document.getElementsByClassName("lat1");
    var lon_elem = document.getElementsByClassName("lon1");

    var full_address_array = [];
    var site_array = [];
    var billing_array = [];
    var residential_array = [];

    var lat_array = [];
    var lon_array = [];
    var non_customer = [];
    var out_of_region = [];

    var ncl_id = [];
    var ncl_lat = [];
    var ncl_lng = [];
    var ncl_mailing = [];

    if (!isNullorEmpty(edit_class_elem)) {
        if (edit_class_elem.length > 0) {
            for (var i = 0; i < edit_class_elem.length; ++i) {
                var row_address_id = edit_class_elem[i].getAttribute('data-addressid');

                var addr1 = full_address_elem[i].getAttribute('data-addr1');
                var addr2 = full_address_elem[i].getAttribute('data-addr2');
                var city = full_address_elem[i].getAttribute('data-city');
                var state = full_address_elem[i].getAttribute('data-state');
                var zip = full_address_elem[i].getAttribute('data-postcode');
                var mailingcode = null;
                if ((full_address_elem[i].hasAttribute('data-mailingcode'))) {
                    mailingcode = full_address_elem[i].getAttribute('data-mailingcode');
                }


                if (isNullorEmpty(row_address_id)) {
                    recCustomer.selectNewLineItem('addressbook');
                } else {
                    var lineIndex = recCustomer.findLineItemValue('addressbook', 'internalid', row_address_id);
                    if (lineIndex > 0) {
                        recCustomer.selectLineItem('addressbook', lineIndex);
                    }
                }

                if (site_elem[i].value == 'Yes') {
                    recCustomer.setCurrentLineItemValue('addressbook', 'label', 'Site Address');
                } else if (billing_elem[i].value == 'Yes') {
                    recCustomer.setCurrentLineItemValue('addressbook', 'label', 'Billing Address');
                } else if (residential_elem[i].value == 'Yes') {
                    recCustomer.setCurrentLineItemValue('addressbook', 'label', 'Postal Address');
                } else {
                    recCustomer.setCurrentLineItemValue('addressbook', 'label', 'Other Address');
                }

                recCustomer.setCurrentLineItemValue('addressbook', 'country', 'AU');
                recCustomer.setCurrentLineItemValue('addressbook', 'addressee', recCustomer.getFieldValue('companyname'));
                recCustomer.setCurrentLineItemValue('addressbook', 'addr1', addr1);
                recCustomer.setCurrentLineItemValue('addressbook', 'addr2', addr2);
                recCustomer.setCurrentLineItemValue('addressbook', 'city', city);
                recCustomer.setCurrentLineItemValue('addressbook', 'state', state);
                if (!isNullorEmpty(mailingcode)) {
                    recCustomer.setCurrentLineItemValue('addressbook', 'zip', mailingcode);
                } else {
                    recCustomer.setCurrentLineItemValue('addressbook', 'zip', zip);
                }

                if (site_elem[i].value == 'Yes') {
                    recCustomer.setCurrentLineItemValue('addressbook', 'defaultshipping', 'T');
                } else {
                    recCustomer.setCurrentLineItemValue('addressbook', 'defaultshipping', 'F');
                }

                if (billing_elem[i].value == 'Yes') {
                    recCustomer.setCurrentLineItemValue('addressbook', 'defaultbilling', 'T');
                } else {
                    recCustomer.setCurrentLineItemValue('addressbook', 'defaultbilling', 'F');
                }

                if (residential_elem[i].value == 'Yes') {
                    recCustomer.setCurrentLineItemValue('addressbook', 'isresidential', 'T');
                } else {
                    recCustomer.setCurrentLineItemValue('addressbook', 'isresidential', 'F');
                }

                recCustomer.commitLineItem('addressbook');


                lat_array[(i + 1)] = lat_elem[i].value;
                lon_array[(i + 1)] = lon_elem[i].value;
                var outofstate = no_service_address_elem[i].value;
                var postal_location_id = postal_location_elem[i].getAttribute('data-postoutletid')
                if (outofstate == 'No') {
                    out_of_region[(i + 1)] = 2;
                } else {
                    out_of_region[(i + 1)] = 1;
                }
                if (residential_elem[i].value == 'Yes') {
                    if (!isNullorEmpty(postal_location_id)) {
                        non_customer[(i + 1)] = postal_location_id;
                    }

                }

                var corporate_office_internal_id = (postal_location_id);
                if (!isNullorEmpty(corporate_office_internal_id) && corporate_office_internal_id != 0) {
                    ncl_id[(i + 1)] = corporate_office_internal_id;
                    ncl_lat[(i + 1)] = lat_elem[i].value;
                    ncl_lng[(i + 1)] = lon_elem[i].value;
                    ncl_mailing[(i + 1)] = mailingcode;

                }

            }
        } else {
            alert('You will need to provide complete address details before submitting.\n\nPlease review and provide complete address(es). \n Please click Add /Edit to add the address before clicking Submit');
            return false;
        }
    } else {
        alert('You will need to provide complete address details before submitting.\n\nPlease review and provide complete address(es).\n Please click Add /Edit to add the address before clicking Submit');
        return false;
    }

    var new_customer_id = nlapiSubmitRecord(recCustomer, false, true);

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

function saveRecord() {

    var result = updateAddress();

    if (result == true) {
        return true;
    }

}

function onclick_back() {
    var params = {
        custid: parseInt(nlapiGetFieldValue('custpage_customer_id')),
        custId: parseInt(nlapiGetFieldValue('custpage_customer_id')),
        sales_record_id: parseInt(nlapiGetFieldValue('custpage_sales_record_id')),
        uploaded_file: nlapiGetFieldValue('custpage_uploaded'),
        custpage_uploaded_id: nlapiGetFieldValue('custpage_uploaded_id'),
        callcenter: nlapiGetFieldValue('callcenter'),
        type: nlapiGetFieldValue('custpage_type')
    }
    params = JSON.stringify(params);
    var upload_url = baseURL + nlapiResolveURL('SUITELET', nlapiGetFieldValue('custpage_suitlet'), nlapiGetFieldValue('custpage_deploy')) + '&unlayered=T&custparam_params=' + params;
    window.open(upload_url, "_self", "height=750,width=650,modal=yes,alwaysRaised=yes");
}