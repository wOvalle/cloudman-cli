var _ = require('lodash');
var ask = require('asking').ask;

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

exports.askForConfirmation = function(question, cb){
    ask(question, function (err, answer) {
        if(err || ['y', 'n'].indexOf(answer.toString()) === -1) {
            console.log('Invalid answer. Exiting program.');
            process.exit(1);
        };

        if(answer === 'n') process.exit(1);

        cb();
    });
};
