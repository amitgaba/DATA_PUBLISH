function getInput() {
	var input = {};
	// first check whether input is supplied via a GET request, i.e. via URL parameter
	// the following assumption holds for the request: (key:value) => ("input": (valid) JSON model)
	var inputViaGet = $.request.parameters.get("SearchTerm");
	if (inputViaGet) {
		// if input is supplied
		// first decode the body content to get special characters {,[,... in case these are encoded
		var decodedInputViaGet = decodeURIComponent(inputViaGet);
		// ... afterwards parse it as JSON
		input = JSON.parse(decodedInputViaGet);  
	}else {
		// secondly check whether input is supplied via a POST request, i.e. via request body
		// the following assumption holds for the request: request body => (valid) JSON model
		var inputViaPost = $.request.body;
		if (inputViaPost) {
			// if input is supplied
			// first decode the body content to get special characters {,[,... in case these are encoded
			var decodedInputViaPost = decodeURIComponent(inputViaPost.asString());
			// ... afterwards parse it as JSON
			input = (JSON.parse(decodedInputViaPost));
		}
	}
	return input;
}

function processRequest(input) {

	var ID = input.ID;
	var ItemID = input.ITEMID;
	var VID =  input.VID;
	var Cron = input.Cron;
	var Filter = input.Filter;
	var TFolder = input.TFolder;
	var TFile = input.TFile;
	var OutCol = input.OutCol;
	var PlHold = input.PlHold;
	var SchID = input.Schid;
	var ToAccess = input.ToAccess;
	
	  var sql = "CALL \"DA.PUBLISH::UpdateView_H\"(?,?,?,?,?,?,?,?,?,?,?)";
	  var conn = $.db.getConnection();
	  var pstmt = conn.prepareCall(sql);
	  
	  pstmt.setInt(1, ID);
	  pstmt.setInt(2, ItemID);
	  pstmt.setInt(3, VID);
	  pstmt.setString(4, Filter);
	  pstmt.setString(5, Cron);
	  pstmt.setString(6, TFolder);
	  pstmt.setString(7, TFile);	  
	  pstmt.setString(8, OutCol);	  
	  pstmt.setString(9, PlHold);	  
	  pstmt.setString(10, SchID);
	  pstmt.setString(11, ToAccess);
	  pstmt.execute();
		
      conn.commit();

    $.response.setBody(JSON.stringify('Sucessful'));
    $.response.status = $.net.http.OK;
}

//map input parameter to input structure
var input = getInput();
	
processRequest(input);
	

