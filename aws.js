function addFBCredentialsToAWS(){	
	// Initialize the Amazon Cognito credentials provider
	AWS.config.region = 'us-east-1'; // Region
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	    IdentityPoolId: 'us-east-1:e0310905-5b55-4ba1-b8fb-34d66a65b8f9',    
		RoleSessionName: 'web',
		Logins:{
			'graph.facebook.com': externalAuthUser.accessToken
		}    
	});
	synchResources(AWS.config.credentials);
}


function addSelfCredentialsToAWS(token){
   AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	   IdentityPoolId: 'us-east-1:e0310905-5b55-4ba1-b8fb-34d66a65b8f9',
	   RoleSessionName: 'web',
	   Logins: {
	      'paidwrites.idprovider': token
	   }
	});
   synchResources(AWS.config.credentials);
}

function updatePersonalInfo(){
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	   IdentityPoolId: 'us-east-1:e0310905-5b55-4ba1-b8fb-34d66a65b8f9',
	   RoleSessionName: 'web',
	   Logins: {
	      'paidwrites.idprovider': externalAuthUser.userName
	   }
	});
   AWS.config.credentials.get(function(){
	   console.log("Access AWS resources");
	   var syncClient = new AWS.CognitoSyncManager();
	   syncClient.openOrCreateDataset('paidwritesDataset', function(err, dataset) { 	   	   
		   	checkAndAddToDataSet(dataset,'fullName', externalAuthUser.fullName);	
		  	checkAndAddToDataSet(dataset,'dateOfBirth', externalAuthUser.dateOfBirth);
		  	dataset.synchronize();	   
		});
	});

}


function synchResources(configCred){
	configCred.get(function(){
	   console.log("Access AWS resources");
	   var syncClient = new AWS.CognitoSyncManager();
	   syncClient.openOrCreateDataset('paidwritesDataset', function(err, dataset) { 
	   	   var savedUserName = getValueFromDataset(dataset,'userName');
	   	   var savedFullName = null;
		   if (savedUserName != null){
		   		externalAuthUser.userName = savedUserName;
		   		savedFullName = getValueFromDataset(dataset,'fullName');
		   }else{
			   	// new user
			   	addToDataSet(dataset,'userName',externalAuthUser.userName);
		   }
		   if (savedFullName == null){
		   		checkAndAddToDataSet(dataset,'fullName', externalAuthUser.fullName);	
		   }else{
		   		externalAuthUser.fullName = savedFullName;
		   }
		   dataset.synchronize();		   
		});
	});
}

function checkAndAddToDataSet(dataset,key,val){
	var savedValue = getValueFromDataset(dataset,key);
	if (savedValue == null || savedValue != val){
		addToDataSet(dataset,key,val);
	}
}

function getValueFromDataset(dataset,key){
	var savedValue = null;
	 try{
	 	dataset.get(key, function(err, value) {
         		savedValue = value;
			});	
	 }
	 catch(e){

	 }
	 return savedValue;
}

function addToDataSet(dataset,key,val){
	try{
		dataset.put(key, val, function(err, record){
	        dataset.synchronize({
	           onSuccess: function(data, newRecords) {
	               console.log(key+' added with val '+ val + ' to dataset' );
	           }
	        });   		
	   });
	}catch(e){

	}
}