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

	var SQLCode = input.SQLCode;
	var Cron = input.Cron;
	var TFolder = input.TFolder;
	var TFile = input.TFile;
	var Functional = input.Function;
	var SchID = input.SchID;
	var OutCols = input.OutCols;
	
	  var sql = "CALL \"DA.PUBLISH::InsertSQL_H\"(?,?,?,?,?,?,?)";
	  var conn = $.db.getConnection();
	  var pstmt = conn.prepareCall(sql);
	  
	  pstmt.setString(1, SQLCode);
	  pstmt.setString(2, Cron);
	  pstmt.setString(3, TFolder);
	  pstmt.setString(4, TFile);	  
	  pstmt.setString(5, Functional);	  
	  pstmt.setString(6, SchID);	  
	  pstmt.setString(7, OutCols);	
	  pstmt.execute();
		
      conn.commit();
	
	 $.response.setBody(JSON.stringify('Sucessful'));
    $.response.status = $.net.http.OK;
}

//map input parameter to input structure
var input = getInput();
	
processRequest(input);
	

