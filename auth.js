var auth={
	"checkUser" : function(){
		var token = $('#username').val();
		externalAuthUser.reset();
		externalAuthUser.userName = token; 
		addSelfCredentialsToAWS(token);
		$('#fullName').prop( "disabled", false );
		$('#birthDate').prop( "disabled", false );
	},
	"updateUser" : function(){
		externalAuthUser.dateOfBirth = $('#birthDate').val();
		externalAuthUser.fullName = $('#fullName').val();
		updatePersonalInfo();
	}
};

$( document ).ready(function() {
    $('#username').val(externalAuthUser.userName);
    $('#fullName').val(externalAuthUser.fullName);
});