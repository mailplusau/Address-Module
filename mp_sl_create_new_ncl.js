/**
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2020-08-07T09:16:36+10:00
 * @Filename: mp_sl_create_new_ncl.js
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-05-06T17:26:15+10:00
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


function create_ncl(request, response) {

  if (request.getMethod() === "GET") {

    var params = request.getParameter('custparam_params');


    var form = nlapiCreateForm('Create New Non Customer Location');

    if (!isNullorEmpty(params)) {
      params = JSON.parse(params);
      var custid = parseInt(params.custid);
      form.addField('custpage_suitlet_id', 'text', 'Customer ID').setDisplayType(
        'hidden').setDefaultValue(params.id);
      form.addField('custpage_deploy_id', 'text', 'Customer ID').setDisplayType(
        'hidden').setDefaultValue(params.deploy);
      form.addField('custpage_customer_id', 'text', 'Customer ID').setDisplayType(
        'hidden').setDefaultValue(custid);
    } else {
      params = null;
      form.addField('custpage_suitlet_id', 'text', 'Customer ID').setDisplayType(
        'hidden').setDefaultValue(null);
      form.addField('custpage_deploy_id', 'text', 'Customer ID').setDisplayType(
        'hidden').setDefaultValue(null);
      form.addField('custpage_customer_id', 'text', 'Customer ID').setDisplayType(
        'hidden').setDefaultValue(null);
    }



    form.addField('custpage_ncl_exists', 'text', 'NCL Exists').setDisplayType(
      'hidden');

    var inlineQty = '';

    var inlinehtml2 =
      '<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA92XGDo8rx11izPYT7z2L-YPMMJ6Ih1s0&libraries=places"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link type="text/css" rel="stylesheet" href="https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css"><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://1048144.app.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css">';

    inlineQty += '<form id="myForm">'

    inlineQty += '<div class="form-group container row_ncl_type">';
    inlineQty += '<div class="row">'
    inlineQty +=
      '<div class="col-xs-6 ncl_type_section"><div class="input-group"><span class="input-group-addon">LOCATION TYPE</span><select class="form-control ncl_type" id="ncl_type">';
    inlineQty += '<option value="0"></option>';
    inlineQty += '<option value="1">AusPost</option>';
    inlineQty += '<option value="2">Toll</option>';
    inlineQty += '<option value="3">Bank</option>';
    inlineQty += '<option value="4">Newsagency</option>';
    inlineQty += '<option value="5">Petrol Station</option>';
    inlineQty += '<option value="6">Supermarket</option>';
    inlineQty += '<option value="7">StarTrack</option>';
    inlineQty += '<option value="8">Carpark</option>';
    inlineQty += '<option value="9">Storage Facility</option>';
    inlineQty += '<option value="10">Pharmacy</option>';
    inlineQty += '<option value="11">Court</option>';
    inlineQty += '<option value="12">Direct Delivery</option>';
    inlineQty += '<option value="13">Partner Location</option>';
    inlineQty += '<option value="14">Meeting Point</option>';
    inlineQty += '<option value="15">Sendle Hubbed Location</option>';
    inlineQty += '<option value="16">SendlePlus Locations</option>';
    inlineQty += '<option value="17">Courier\'s Please</option>';
    inlineQty += '<option value="18">Aramex</option>';
    inlineQty += '<option value="19">DHL</option>';
    inlineQty += '<option value="20">PFL</option>';
    inlineQty += '<option value="21">TOLL Depots</option>';
    inlineQty += '</select></div></div>';
    inlineQty += '</div>';
    inlineQty += '</div>';

    inlineQty += '<div class="form-group container row_ncl_name hide">';
    inlineQty += '<div class="row">'

    inlineQty +=
      '<div class="col-xs-6 new_ncl_name_section"><div class="input-group"><span class="input-group-addon">LOCATION NAME</span><input type="text" id="new_ncl_name" class="form-control new_ncl_name" /></div></div>';

    inlineQty += '</div>';
    inlineQty += '</div>';


    inlineQty += '<div class="form-group container row_address1_postal hide">'
    inlineQty += '<div class="row">';

    inlineQty +=
      '<div class="col-xs-6 address1_section"><div class="input-group"><span class="input-group-addon" id="address1_text">LEVEL/UNIT/SUITE</span><input id="address1" class="form-control address1" /></div></div>';

    inlineQty += '</div>';
    inlineQty += '</div>';

    inlineQty += '<div class="form-group container row_address2 hide">'
    inlineQty += '<div class="row">';

    inlineQty +=
      '<div class="col-xs-6 address2_section"><div class="input-group"><span class="input-group-addon">STREET NO. & NAME</span><input id="address2" class="form-control address2" /></div></div>';

    inlineQty += '</div>';
    inlineQty += '</div>';

    inlineQty += '<div class="form-group container row_address_info hide">'
    inlineQty += '<div class="row">';

    inlineQty +=
      '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">CITY</span><input id="city" readonly class="form-control city" /></div></div>';
    inlineQty +=
      '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">STATE</span><input id="state" readonly class="form-control state" /></div></div>';


    inlineQty += '</div>';
    inlineQty += '</div>';

    inlineQty += '<div class="form-group container row_code_info hide">'
    inlineQty += '<div class="row">';

    inlineQty +=
      '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">POSTCODE</span><input id="postcode" readonly class="form-control postcode" /></div></div>';

    inlineQty +=
      '<div class="col-xs-3 mailing_code_section"><div class="input-group"><span class="input-group-addon">MAILING CODE</span><input id="mailingcode"  class="form-control mailingcode" /></div></div>';

    inlineQty += '</div>';
    inlineQty += '</div>';

    inlineQty += '<div class="form-group container row_geocode_info hide">'
    inlineQty += '<div class="row">';


    inlineQty +=
      '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">LAT</span><input id="lat" readonly class="form-control lat" /></div></div>';

    inlineQty +=
      '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">LNG</span><input id="lng" readonly class="form-control lng" /></div></div>';

    inlineQty += '</div>';
    inlineQty += '</div>';

    inlineQty += '<div class="form-group container work_times hide">'
    inlineQty += '<div class="row">';


    inlineQty +=
      '<div class="col-xs-2"><div class="input-group"><span class="input-group-addon">MON</span><input id="mon"  class="form-control mon" /></div></div>';

    inlineQty +=
      '<div class="col-xs-2"><div class="input-group"><span class="input-group-addon">TUE</span><input id="tue"  class="form-control tue" /></div></div>';

    inlineQty +=
      '<div class="col-xs-2"><div class="input-group"><span class="input-group-addon">WED</span><input id="wed"  class="form-control wed" /></div></div>';

    inlineQty +=
      '<div class="col-xs-2"><div class="input-group"><span class="input-group-addon">THU</span><input id="thu"  class="form-control thu" /></div></div>';

    inlineQty +=
      '<div class="col-xs-2"><div class="input-group"><span class="input-group-addon">FRI</span><input id="fri"  class="form-control fri" /></div></div>';

    inlineQty += '</div>';
    inlineQty += '</div>';


    inlineQty += '<div class="form-group container row_button hide">'
    inlineQty += '<div class="row">';

    inlineQty +=
      '<div class="add_address_section col-xs-3"><input type="button" value="CHECK IF LOCATION EXISTS" class="form-control btn btn-primary" id="add_new" /></div><div class="address_exists_section col-xs-4"><input type="button" value="LOCATION EXISTS, GO BACK TO ADDRESS REVIEW" class="form-control btn btn-danger" id="add_exists" /></div><div class="new_address_section col-xs-4"><input type="button" value="LOCATION VERIFIED, CLICK SUBMIT TO SAVE" class="form-control btn btn-success" id="add_save" /></div>';

    inlineQty += '</div>';
    inlineQty += '</div>';

    // End of Container
    inlineQty += '</div>';
    inlineQty += '</form>';

    /**
     * Description - To create the table and colums assiocted with the page.
     */
    inlineQty +=
      '<br><br><style>table#address {font-size:12px; text-align:center; border-color: #24385b}</style><div class="form-group container-fluid"><div><div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm" role="document"><div class="modal-content" style="width: max-content;"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title panel panel-info" id="exampleModalLabel">Information</h4><br> </div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div><div ng-app="myApp" ng-controller="myCtrl"><table border="0" cellpadding="15" id="address" class="table table-responsive table-striped customer tablesorter hide" cellspacing="0" style="width: 100%;"><thead style="color: white;background-color: #607799;"><tr class="text-center">';

    /**
     * POSTAL LOCATION
     */

    inlineQty +=
      '<th style="vertical-align: middle;text-align: center;" class=""><b>LOCATION NAME</b></th>';

    /**
     * BUILDING/LEVEL/UNIT/SUITE - OR - POSTAL BOX
     */
    inlineQty +=
      '<th style="vertical-align: middle;text-align: center;" class=""><b>LEVEL/UNIT/SUITE</b></th>';

    /**
     * STREET NO. & NAME
     */
    inlineQty +=
      '<th style="vertical-align: middle;text-align: center;" class=""><b>STREET NO. & NAME</b></th>';

    // /**
    //  * CITY
    //  */
    inlineQty +=
      '<th style="vertical-align: middle;text-align: center;" class=""><b>CITY</b></th>';
    // /**
    //  * STATE
    //  */
    inlineQty +=
      '<th style="vertical-align: middle;text-align: center;" class=""><b>STATE</b></th>';
    // /**
    //  * POSTCODE
    //  */
    inlineQty +=
      '<th style="vertical-align: middle;text-align: center;" class=""><b>POSTCODE</b></th>';

    /**
     * LAT
     */
    inlineQty +=
      '<th style="vertical-align: middle;text-align: center;" class=""><b>LAT</b></th>';

    /**
     * LNG
     */
    inlineQty +=
      '<th style="vertical-align: middle;text-align: center;" class=""><b>LNG</b></th></tr></thead><tbody>';

    inlineQty += '<tr></tr></tbody>';
    inlineQty += '</table></div></div></div></form><br/>';

    form.addField('preview_table', 'inlinehtml', '').setLayoutType(
      'outsidebelow', 'startrow').setDefaultValue(inlineQty);

    form.addField('custpage_html2', 'inlinehtml').setPadding(1).setLayoutType(
      'outsideabove').setDefaultValue(inlinehtml2);

    form.setScript('customscript_cl_create_new_ncl');

    form.addSubmitButton('Submit');
    form.addButton('back', 'Back', 'onclick_back()');
    form.addButton('back', 'Reset', 'onclick_reset()');

    response.writePage(form);

  } else {

    if (!isNullorEmpty(request.getParameter('custpage_customer_id'))) {
      var params = {
        custid: parseInt(request.getParameter('custpage_customer_id')),
        id: 'customscript_sl_smc_main',
        deploy: 'customdeploy_sl_smc_main'
      }
      params = JSON.stringify(params);
      var params2 = {
        custparam_params: params
      }
      nlapiSetRedirectURL('SUITELET', request.getParameter(
          'custpage_suitlet_id'), request.getParameter('custpage_deploy_id'),
        null, params2);
    } else {
      nlapiSetRedirectURL('SUITELET', 'customscript_sl_create_new_ncl',
        'customdeploy_sl_create_new_ncl', null, null);
    }

  }

}
