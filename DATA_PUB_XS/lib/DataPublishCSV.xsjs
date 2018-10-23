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

function processRequest() {


	 //var oConnetion = $.hdb.getConnection();
	var conn = $.db.getConnection();	 
	// var oProcedure;
	var tabularInput = input;
	// var tables = [];
	// var outcol;
	var sql;
	var pstmt;
	var i = 0;
	// for each input value insert a tuple
	for (i = 0; i < tabularInput.length; i++) {
		if (tabularInput[i].VIEWNAME != undefined )  {
			if ( tabularInput[i].VIEWNAME != "") {
			// if (tabularInput[i].ID != '' )  {
			// // if ( i == 0) {
			// // oProcedure = oConnetion.loadProcedure("DA.PUBLISH::DataPublishUPDCSV");	
			// // }
			// tables.push({
			// 	ID:tabularInput[i].ID,
			// 	ITEM:tabularInput[i].ITEM,
			// 	VIEWNAME: tabularInput[i].VIEWNAME,
			// 	SCHEMANAME: tabularInput[i].SCHEMANAME,
			// 	FILTER: tabularInput[i].FILTER,
			// 	CRON: tabularInput[i].CRON,
			// 	TFOLDER: tabularInput[i].TFOLDER,
			// 	TFILE: tabularInput[i].TFILE,		
			// 	FUNCTIONAL: tabularInput[i].FUNCTIONAL,		
			// 	OUTCOL: tabularInput[i].OUTCOL,	
			// 	PLHOLD: tabularInput[i].PLHOLD,	
			// 	SCHID: tabularInput[i].SCHID,	
			// 	ACCESS: tabularInput[i].ACCESS
		 //   });
			// }	
			// else {
			// if ( i == 0) {
			// oProcedure = oConnetion.loadProcedure("DA.PUBLISH::DataPublishCSV");	
			// }
			// outcol = tabularInput[i].OUTCOL;
			// tables.push({
			// 	VIEWNAME: tabularInput[i].VIEWNAME,
			// 	SCHEMANAME: tabularInput[i].SCHEMANAME,
			// 	FILTER: tabularInput[i].FILTER,
			// 	CRON: tabularInput[i].CRON,
			// 	TFOLDER: tabularInput[i].TFOLDER,
			// 	TFILE: tabularInput[i].TFILE,		
			// 	FUNCTIONAL: tabularInput[i].FUNCTIONAL,		
			// 	// OUTCOL1: outcol,
			// 	PLHOLD: tabularInput[i].PLHOLD,	
			// 	SCHID: tabularInput[i].SCHID,	
			// 	ACCESS: tabularInput[i].ACCESS
		 //   });

	  sql = "CALL \"DA.PUBLISH::InsertView_H\"(?,?,?,?,?,?,?,?,?,?,?)";
	  
	  pstmt = conn.prepareCall(sql);
	  
	  pstmt.setString(1, tabularInput[i].VIEWNAME.replace(/;/g,','));
	  pstmt.setString(2, tabularInput[i].SCHEMANAME.replace(/;/g,','));
	  pstmt.setString(3, tabularInput[i].FILTER.replace(/;/g,','));
	  pstmt.setString(4, tabularInput[i].CRON.replace(/;/g,','));
	  pstmt.setString(5, tabularInput[i].TFOLDER.replace(/;/g,','));
	  pstmt.setString(6, tabularInput[i].TFILE.replace(/;/g,','));	  
	  pstmt.setString(7, tabularInput[i].FUNCTION.replace(/;/g,','));	  
	  pstmt.setString(8, tabularInput[i].OUTCOL.replace(/;/g,','));	  
	  pstmt.setString(9, tabularInput[i].PLHOLD.replace(/;/g,','));	  
	  pstmt.setString(10, tabularInput[i].SCHID.replace(/;/g,','));	  
	  pstmt.setString(11, tabularInput[i].ACCESS.replace(/;/g,','));	  
	  pstmt.execute();
	  
	  conn.commit();				
			// }
			}
		}
		
	}
	
// //	call procedure
// 	 oProcedure(tables,outcol);
	 
	// oConnetion.commit();
	
	 $.response.setBody(JSON.stringify(tabularInput[0].OUTCOL.replace(/;/g,',')));

    // $.response.setBody(JSON.stringify(tables));
    $.response.status = $.net.http.OK;
}

//map input parameter to input structure
 var input = getInput();
	
processRequest(input);
	

