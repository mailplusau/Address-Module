/**
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2020-03-25T07:47:28+11:00
 * @Filename: mp_cl_create_new_ncl.js
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-05-06T11:01:16+10:00
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

$(window).load(function() {
  // Animate loader off screen
  $(".se-pre-con").fadeOut("slow");;
});

function pageInit() {
  document.getElementById('tr_submitter').style.display = 'none';
}

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical location types.
  // types is empty to get all places, not only address. Previously it was types: ['geocode']
  var options = {
    types: [],
    componentRestrictions: {
      country: 'au'
    }
  }
  autocomplete = new google.maps.places.Autocomplete((document.getElementById(
    'address2')), options);

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

    if (place.address_components[i].types[0] == 'street_number' || place.address_components[
        i].types[0] == 'route') {
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

$(document).on('focus', '#address2', function(event) {
  // alert('onfocus')
  //

  initAutocomplete();
});

$(document).on('change', '.ncl_type', function(e) {

  $('.row_address1_postal').removeClass('hide');
  $('.row_address_info').removeClass('hide');
  $('.row_geocode_info').removeClass('hide');
  $('.row_code_info').removeClass('hide');
  $('.row_button').removeClass('hide');
  $('.address_exists_section').addClass('hide');
  $('.new_address_section').addClass('hide');
  $('.add_new_section').addClass('hide');
  $('.row_address2').removeClass('hide');
  $('.row_ncl_name').removeClass('hide');
  $('.work_times').removeClass('hide');


});
//
$(document).on('click', '#add_new', function(e) {



  var ncl_type = $('#ncl_type').val();
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
  var ncl_name = $('#new_ncl_name').val();


  if ((isNullorEmpty(city)) || (isNullorEmpty(zip))) {
    alert(
      'You will need to provide complete address details before proceeding.\n\nPlease review and provide complete address(es).'
    );
    return false;

  } else if (($('input.default_shipping').is(':checked')) && (isNullorEmpty(
      address2))) {
    alert(
      'You will need to provide "Street No. & Name" for Site Address.\n\nPlease review and provide complete address(es).'
    );
    return false;
  }

  if (isNullorEmpty(lat) || isNullorEmpty(lng)) {
    if (!($('input.default_out').is(':checked'))) {
      alert(
        'Address is not GeoCoded.\n\nPlease review and provide complete address(es).'
      );
      return false;
    }
  }

  /**
   * Description - Get all the AP Lodgement locations for this franchisee
   */

  var searched_ncl = nlapiLoadSearch('customrecord_ap_lodgment_location',
    'customsearch_smc_noncust_location');

  // var newFilters = new Array();

  var newFiltersExpression = [
    ["formulanumeric: ROUND({custrecord_ap_lodgement_lat},3)", "equalto", (
      parseFloat(lat)).toFixed(3)], "AND", [
      "formulanumeric: ROUND({custrecord_ap_lodgement_long},3)",
      "equalto", (parseFloat(lng)).toFixed(3)
    ], "AND", ["custrecord_noncust_location_type", "is", ncl_type]
  ];

  //NCL Type: AusPost(1), Toll(2), StarTrack(7)
  // newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_ap_lodgement_lat', null, 'equalto', lat);
  // newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_ap_lodgement_long', null, 'equalto', lng);
  // newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_noncust_location_type', null, 'is', ncl_type);

  // searched_ncl.addFilters(newFilters);
  searched_ncl.setFilterExpression(newFiltersExpression);

  var resultSet_ncl = searched_ncl.runSearch();

  var nclResult = resultSet_ncl.getResults(0, 1);

  // alert(nclResult.length);

  if (!isNullorEmpty(nclResult) && nclResult.length != 0) {
    nlapiSetFieldValue('custpage_ncl_exists', 'T');
    $('.address_exists_section').removeClass('hide');
    $('#address').removeClass('hide');

    var inlineQty = '';

    resultSet_ncl.forEachResult(function(searchResult_ncl) {

      var ncl_name = searchResult_ncl.getValue("name", null, null);
      var ncl_address1 = searchResult_ncl.getValue(
        "custrecord_ap_lodgement_addr1", null, null);
      var ncl_address2 = searchResult_ncl.getValue(
        "custrecord_ap_lodgement_addr2", null, null);
      var ncl_city = searchResult_ncl.getValue(
        "custrecord_ap_lodgement_suburb", null, null);
      var ncl_state = searchResult_ncl.getText(
        "custrecord_ap_lodgement_site_state", null, null);
      var ncl_postcode = searchResult_ncl.getValue(
        "custrecord_ap_lodgement_postcode", null, null);
      var ncl_lat = searchResult_ncl.getValue(
        "custrecord_ap_lodgement_lat", null, null);
      var ncl_lng = searchResult_ncl.getValue(
        "custrecord_ap_lodgement_long", null, null);

      inlineQty += '<tr>';
      /**
       * POSTAL LOCATION
       */

      inlineQty += '<td>' + ncl_name + '</td>';

      /**
       * BUILDING/LEVEL/UNIT/SUITE - OR - POSTAL BOX
       */
      inlineQty += '<td>' + ncl_address1 + '</td>';

      /**
       * STREET NO. & NAME
       */
      inlineQty += '<td>' + ncl_address2 + '</td>';

      // /**
      //  * CITY
      //  */
      inlineQty += '<td>' + ncl_city + '</td>';
      // /**
      //  * STATE
      //  */
      inlineQty += '<td>' + ncl_state + '</td>';
      // /**
      //  * POSTCODE
      //  */
      inlineQty += '<td>' + ncl_postcode + '</td>';

      /**
       * LAT
       */
      inlineQty += '<td>' + ncl_lat + '</td>';

      /**
       * LNG
       */
      inlineQty += '<td>' + ncl_lng + '</td></tr>';

    });

    $('#address tr:last').after(inlineQty);

    $('.new_address_section').addClass('hide');
    $('.add_address_section').addClass('hide');
    return false;
  } else {
    nlapiSetFieldValue('custpage_ncl_exists', 'F');
    document.getElementById('tr_submitter').style.display = '';
    $('.address_exists_section').addClass('hide');
    $('.new_address_section').removeClass('hide');
    $('.add_address_section').addClass('hide');
  }

});

function reset_all() {
  $('.row_address1_postal').addClass('hide');
  $('.row_address_info').addClass('hide');
  $('.row_geocode_info').addClass('hide');
  $('.row_code_info').addClass('hide');
  $('.row_button').addClass('hide');
  $('.add_address_section').addClass('hide');
  $('.row_address2').addClass('hide');
  $('#ncl_type').val(0);
  $('#address1').val('');
  $('#address2').val('');
  $('#city').val('');
  $('#state').val('');
  $('#postcode').val('');
  $('#lat').val('');
  $('#lng').val('');

}

function saveRecord() {

  var ncl_exists = nlapiGetFieldValue('custpage_ncl_exists');

  if (ncl_exists == 'F') {

    var ncl_type = $('#ncl_type').val();
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
    var mon = $('#mon').val();
    var tue = $('#tue').val();
    var wed = $('#wed').val();
    var thu = $('#thu').val();
    var fri = $('#fri').val();
    var ncl_name = $('#new_ncl_name').val();
    var mailingcode = $('#mailingcode').val();

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

    if (isNullorEmpty(ncl_name)) {
      alert('Please Enter a Name for the Non Customer Location');
      return false;
    } else {
      ncl_name = ncl_name.toUpperCase();
    }

    if ((isNullorEmpty(city)) || (isNullorEmpty(zip))) {
      alert(
        'You will need to provide complete address details before proceeding.\n\nPlease review and provide complete address(es).'
      );
      return false;

    } else if (($('input.default_shipping').is(':checked')) && (isNullorEmpty(
        address2))) {
      alert(
        'You will need to provide "Street No. & Name" for Site Address.\n\nPlease review and provide complete address(es).'
      );
      return false;
    }

    if (isNullorEmpty(lat) || isNullorEmpty(lng)) {
      if (!($('input.default_out').is(':checked'))) {
        alert(
          'Address is not GeoCoded.\n\nPlease review and provide complete address(es).'
        );
        return false;
      }
    }

    var ncl_record = nlapiCreateRecord('customrecord_ap_lodgment_location');

    ncl_record.setFieldValue('name', ncl_name);
    ncl_record.setFieldValue('custrecord_ap_lodgement_site_name', ncl_name);
    ncl_record.setFieldValue('custrecord_ap_lodgement_site_state', state_id);
    ncl_record.setFieldValue('custrecord_ap_lodgement_addr1', address1);
    ncl_record.setFieldValue('custrecord_ap_lodgement_addr2', address2);
    ncl_record.setFieldValue('custrecord_ap_lodgement_suburb', city);
    ncl_record.setFieldValue('custrecord_ap_lodgement_postcode', zip);
    ncl_record.setFieldValue('custrecord_ap_lodgement_lat', lat);
    ncl_record.setFieldValue('custrecord_ap_lodgement_long', lng);
    ncl_record.setFieldValue('custrecord_noncust_location_type', ncl_type);
    ncl_record.setFieldValue('custrecord_ncl_mailing_postcode', mailingcode);
    ncl_record.setFieldValue('custrecord_ap_lodgement_hrs_mon', mon);
    ncl_record.setFieldValue('custrecord_ap_lodgement_hrs_tue', tue);
    ncl_record.setFieldValue('custrecord_ap_lodgement_hrs_wed', wed);
    ncl_record.setFieldValue('custrecord_ap_lodgement_hrs_thu', thu);
    ncl_record.setFieldValue('custrecord_ap_lodgement_hrs_fri', fri);

    nlapiSubmitRecord(ncl_record);

    return true;
  }
}

$(document).on('click', '#add_exists', function(e) {
  var params = {
    custid: parseInt(nlapiGetFieldValue('custpage_customer_id')),
    id: 'customscript_sl_smc_main',
    deploy: 'customdeploy_sl_smc_main'
  }
  params = JSON.stringify(params);
  var upload_url = baseURL + nlapiResolveURL('suitelet', nlapiGetFieldValue(
      'custpage_suitlet_id'), nlapiGetFieldValue('custpage_deploy_id')) +
    '&params=' + params;
  window.open(upload_url, "_self",
    "height=750,width=650,modal=yes,alwaysRaised=yes");
});

$(document).on('click', '#add_save', function(e) {
  $('#submitter').trigger('click');
});

function onclick_back() {
  var params = {
    custid: parseInt(nlapiGetFieldValue('custpage_customer_id')),
    id: 'customscript_sl_smc_main',
    deploy: 'customdeploy_sl_smc_main'
  }
  params = JSON.stringify(params);
  var upload_url = baseURL + nlapiResolveURL('suitelet', nlapiGetFieldValue(
      'custpage_suitlet_id'), nlapiGetFieldValue('custpage_deploy_id')) +
    '&params=' + params;
  window.open(upload_url, "_self",
    "height=750,width=650,modal=yes,alwaysRaised=yes");
}
