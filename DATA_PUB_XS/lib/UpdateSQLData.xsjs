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
	var Cron = input.Cron;
	var Scode = input.Scode;
	var TFolder = input.TFolder;
	var TFile = input.TFile;
	var OutCol = input.OutCol;
	var Function = input.Function;
	var SchID = input.Schid;

	
	  var sql = "CALL \"DA.PUBLISH::UpdateSQL\"(?,?,?,?,?,?,?,?)";
	  var conn = $.db.getConnection();
	  var pstmt = conn.prepareCall(sql);
	  
	  pstmt.setInt(1, ID);
	  pstmt.setString(2, Scode);
	  pstmt.setString(3, Cron);
	  pstmt.setString(4, TFolder);
	  pstmt.setString(5, TFile);	  
	  pstmt.setString(6, OutCol);	  
	  pstmt.setString(7, SchID);
	  pstmt.setString(8, Function);
	  pstmt.execute();
		
      conn.commit();

    $.response.setBody(JSON.stringify('Sucessful'));
    $.response.status = $.net.http.OK;
}

//map input parameter to input structure
var input = getInput();
	
processRequest(input);
	

