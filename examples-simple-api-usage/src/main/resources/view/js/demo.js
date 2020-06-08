/*
 * (c) 2018 HAWKORE, S.L. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * A copy of the license terms has been included with this distribution in the LICENSE.md file.
 * ---
 * Derechos de Autor (C) 2018 HAWKORE, S.L. - Todos los derechos reservados
 * Se prohibe estrictamente la copia sin autorización de este fichero por cualquier medio
 * Propietario y confidencial
 *
 * Se incluye una copia de los términos de la licencia en el archivo LICENSE.md en esta distribución.
 */
/**
 * Bootstrap modal to show error messages
 */
var errorMessage = function(header, body) {
	var modal = $("#errorModal");
	var modalHeader;
	var modalBody;
	if (modal.length==0) {
		modal = $("<div></div>").attr({ id: "errorModal", role : "dialog" })
			.addClass("modal fade");
		var dialog = $("<div></div>").addClass("modal-dialog");
		var content = $("<div></div>").addClass("modal-content");
		modalHeader = $("<div></div>").attr({ id: "errorModalHeader", style:"color:red" }).addClass("modal-header");
		modalBody = $("<div></div>").attr({ id: "errorModalBody" }).addClass("modal-body");
		var modalFooter = $("<div></div>").addClass("modal-footer");
		var closeBtn = $("<button></button>").attr({ type: "button", "data-dismiss":"modal" }).addClass("btn btn-default").html("Close");
		modal.append(
				dialog.append(
						content.append(modalHeader)
						   .append(modalBody)
						   .append(modalFooter.append(closeBtn))
						)
		);
		$("body").append(modal);
	}
	else {
		modalHeader = $("#errorModalHeader");
		modalBody = $("#errorModalBody");
	}
	modalHeader.text(header);
	modalBody.text(body);
	modal.modal();
}

function getFormDataAsJson($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return JSON.stringify(indexed_array);
}

/**
 * Submit form to execute an operation
 */
var genericSubmit = function(operation, event) {
    var url = operation.url;
    var form = operation.form;
    var btn = operation.btn;
    event.preventDefault();                     // Prevent default function
    $.ajax({
        type: 'POST',                           // Submit an HTTP POST request
        url: url,                               // The URL where your endpoint is listening
        data: getFormDataAsJson(form),          // Serialized form as JSON
        processData: false,                     // Data already serialized
        headers : {
            "Content-Type" : "application/json" // Send as text
        },
        success: function(data, status, xhr) {               // Success function called if request succeeds
        	// Autofill data in the next workflow step as needed
        	var ct = xhr.getResponseHeader("content-type") || "";
        	var pre = form.find('pre');
        	if (pre.length>0) {
        		pre.jsonViewer(ct.indexOf('json') > -1?data:(data+""), {collapsed: false, withQuotes: false});
        	}
        	else {
            	var input = form.find('input[name=message]');
            	input.val(ct.indexOf('json') > -1?JSON.stringify(data):data);
        	}
        },
        error: function(request, status, error){// Error function is executed if an exception occurs in the flow
        	// Alert the user of any errors
        	errorMessage("Error executing operation! " + 
        			"(Status: " + status + ", Error: " + error + ")",
        			request.responseText);          
        },
        complete: function() {
          btn.button('reset');  
        }
    });
    return false;
};

/**
 * Create a test panel. Called from #getTest when panel definition is given.
 */
var createTestPanel = function(operation, pd, operation2, pd2) {
    var title = pd.title;
    var description = pd.description;
    var action = pd.action;
    var params = pd.params;
    var defPanel = pd.defPanel;

    var collapsableDivName = operation + "Div";
    // Panel
    var testPanel = $("<div></div>").addClass("panel panel-default");
	// Create header
	testPanel.append(
		$("<div></div>").addClass("panel-heading").append(
			$("<h2></h2>").addClass("panel-title demo-heading").append(
				$("<a></a>").text(title).attr({
					"data-toggle" : "collapse", "data-parent" : "#accordion", href : "#" + collapsableDivName
				})
			)
		)
	);
	// Create body <div id="filesystemAppendDiv" class="">
	var testBodyPanel = $("<div></div>").addClass("panel-collapse collapse").attr(
			{ id : collapsableDivName });
	if (defPanel) testBodyPanel.addClass("in");
    var testForm = $("<form></form>").addClass("demo-form").attr({id : operation + "Form", role:"form"});
	testPanel.append(testBodyPanel.append($("<div></div>").addClass("panel-body").append(testForm)));
	// Fill form
	testForm.append($("<label></label>").text(description)).append($("<hr></hr>"));
	if (params) {
		for (var i=0;i<params.length;++i) {
			var param = params[i];
            testForm.append($("<label></label>").text(param.label).attr( { for : param.id } ) );
            testForm.append($("<input></input>").addClass("form-control").attr({ 
            	name : param.id, type: "text", value : param.defaultValue, required : "required"
            }));
            testForm.append($("<br></br>"));
		}
	}        	
    testForm.append($("<label></label>").text("Response").attr( { for : "message" } ) );
    testForm.append($("<pre></pre>").attr( { name : "message" } ) );
    testForm.append($("<br></br>"));
    testForm.append($("<button></button>").addClass("btn btn-lg btn-primary btn-block").attr({
    	type : "submit", 
    	"data-loading-text" : "<img src='http://i.giphy.com/lijuimVKUcwRa.gif' height=16 width=16 /> Processing..."
    }).text(action));
    // Is there a second form?
    if (operation2) {
        var testForm2 = $("<form></form>").addClass("demo-form").attr({id : operation2 + "Form", role:"form"});
        testPanel.append(testBodyPanel.append($("<div></div>").addClass("panel-body").append(testForm2)));
        // Fill form
        testForm2.append($("<label></label>").text(pd2.description)).append($("<hr></hr>"));
        if (params) {
            for (var i=0;i<pd2.params.length;++i) {
                var param = pd2.params[i];
                testForm2.append($("<label></label>").text(param.label).attr( { for : param.id } ) );
                testForm2.append($("<input></input>").addClass("form-control").attr({
                    name : param.id, type: "text", value : param.defaultValue, required : "required"
                }));
                testForm2.append($("<br></br>"));
            }
        }
        testForm2.append($("<label></label>").text("Response").attr( { for : "message" } ) );
        testForm2.append($("<pre></pre>").attr( { name : "message" } ) );
        testForm2.append($("<br></br>"));
        testForm2.append($("<button></button>").addClass("btn btn-lg btn-primary btn-block").attr({
            type : "submit",
            "data-loading-text" : "<img src='http://i.giphy.com/lijuimVKUcwRa.gif' height=16 width=16 /> Processing..."
        }).text(pd2.action));
    }
	// Done
	$("#accordion").append(testPanel);
}

/**
 * Initialize a test (a form that shall be submitted to run an operation).
 * @param name the name of the operation to test
 * @param handler alternative handler for default form submission (#genericSubmit).
 */
var getTest = function(name, handler, pd, name2, pd2) {
	if (pd) {
		createTestPanel(name, pd, name2, pd2);
	}
	var form = $('#' + name + 'Form');
	var test = {
        form : form,
        btn : form.find('button[type="submit"]'),
        url  : '/' + name
	};
	form.submit(function(event) {
		if (handler)
			handler(test, event);
		else 
		    return genericSubmit(test, event);
    });
    if (name2) {
        // There is a second form
        var form2 = $('#' + name2 + 'Form');
        var test2 = {
            form : form2,
            btn : form2.find('button[type="submit"]'),
            url  : '/' + name2
        };
        form2.submit(function(event) {
            if (handler)
                handler(test2, event);
            else
                return genericSubmit(test2, event);
        });
    }
	return test;
};

/**
 * Alternate handler that just show a not implemented error message
 */
var notImplementedHandler = function(test, event) {
	errorMessage("Not implemented!", "Test " + test.url + " is not implemented!");
	event.preventDefault();
	test.btn.button('reset');  
	return false;
}

/**
 * Method to initialize page and load required dependencies.
 */
var _initialize = function() {
    // Import Twitter bootstrap libs + css
	$("<link/>", {
		   rel: "stylesheet",
		   type: "text/css",
		   href: "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/css/bootstrap.css"
		}).appendTo("head");
	$.getScript("https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/js/bootstrap.js");

    // Json Viewer
	$("<link/>", {
		   rel: "stylesheet",
		   type: "text/css",
		   href: "json-viewer/jquery.json-viewer.css"
		}).appendTo("head");
	$.getScript("json-viewer/jquery.json-viewer.js");
}

_initialize();

/**
 * Initialization once the document has been loaded
 */
$(document).ready( function() {

    $('button').click(function(){   
    	// Triggers the loading spinner for every button that is clicked
    	// It will be reset after ajax response
        $(this).button('loading');  
    });         

}); 
