var _ = require('lodash');

exports.parseActionRequest = function(json, mockupSentence){
    var response = [];
    _.each(json, function(j){
        var currSentence = mockupSentence;
        if(j.actionProcessed)
        {
            currSentence = currSentence
                .replace('_processed_ ', '')
                .replace('_id_', j.input)
                .replace(' _err_', '');
        }
        else {
            currSentence = currSentence
                .replace('_processed_', 'not')
                .replace('_id_', j.input)
                .replace('_err_', 'Err: ' + j.errMessage);
        }

        response.push(currSentence);
    });
    return response;
};


exports.handleError = function(err){
    //do logging in here
    console.log(err, err.stack);
};