console.log('Loading function');

exports.handler = function(event, context) {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    // Check for the event type
    if (event.eventType === 'SyncTrigger') {
        var doc = require('dynamodb-doc');
        var dynamo = new doc.DynamoDB();
        var tableName = "Users";
        var datetime = new Date().getTime().toString();
        dynamo.putItem({
            "TableName": tableName,
            "Item" : {
                "username": {"S": event.user },
                "date": {"S": datetime },
                "msg": {"S": event.msg},
                "identity": event.identityId
            }
        }, function(err, data) {
            if (err) {
                context.done('error','putting item into dynamodb failed: '+err);
            }
            else {
                console.log('great success: '+JSON.stringify(data, null, '  '));
                context.done('K THX BY');
            }
        });
    }

    context.succeed(event);
};