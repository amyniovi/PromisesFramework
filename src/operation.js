const delayms = 1;

function getCurrentCity(callback) {
    setTimeout(function () {

        const city = "New York, NY";
        callback("error", city);

    }, delayms)
}

function getWeather(city, callback) {
    setTimeout(function () {

        if (!city) {
            callback(new Error("City required to get weather"));
            return;
        }

        const weather = {
            temp: 50
        };

        callback(null, weather)

    }, delayms)
}

function getForecast(city, callback) {
    setTimeout(function () {

        if (!city) {
            callback(new Error("City required to get forecast"));
            return;
        }

        const fiveDay = {
            fiveDay: [60, 70, 80, 45, 50]
        };

        callback(null, fiveDay)

    }, delayms)
}


//Init Operation creates the operation object by subscribing the error or result from the operation in question
function InitOperation() {

    const operation = {
        SuccessCallbacks: [],
        ErrorCallbacks: []
    };

    let noop = function () {
    };

    operation.fail = function (error) {
        operation.state = "fail";
        operation.error = error;
        operation.ErrorCallbacks.forEach(c => c(error));
    };
    operation.success = function (result) {
        operation.state = "success";
        operation.result = result;
        operation.SuccessCallbacks.forEach(c=>c(result));
    };
    operation.register = function (error, result) {

        if (error) {
            operation.fail(error);
            return;
        }
        operation.success(result);

    };

    operation.OnCompletion = function(onSuccess) {
        if (operation.state =="success")
            onSuccess(operation.result);
        else
        operation.SuccessCallbacks.push(onSuccess || noop);
    };

    operation.onFail = function (onError){
        if (operation.state=="fail")
            onError(operation.error);
        else
        operation.ErrorCallbacks.push(onError || noop);
    };


    return operation;

}


test.("separating error and success ", done => {
        const operation = new InitOperation();
        doLater(getCurrentCity(operation.register));
        var myDone = multiDone(done).AfterNCalls(2);
        operation.onFail(myDone);
        operation.onFail(myDone);
       // operation.OnCompletion(myDone());



    }
);
/*
test.only("lexical parallelism", done => {
    const operation = new InitOperation();

    getCurrentCity(operation.register);
    getForecast(operation.register);

    operation.OnCompletion(CombineResults())

});

function CombineResults(result1, result2, done){

   return function() {
       if (result1 && result2) {
           Display();
           done();
       }
   }

}

function Display(){


}
*/
function doLater (func)
{
    setTimeout(func, 1000);
}
function multiDone(done) {

    var counter = 0;

    return {
        AfterNCalls: function (expectedCount) {
            return function CallDoneOnce() {
                counter++;
                if (counter >= expectedCount)
                    done();
            }
        }

    }

}

/*
 test.("pass multiple callbacks -expect all are called", done => {

 //The const declaration creates a read-only reference to a value.
 // It does not mean the value it holds is immutable, just that
 // the variable identifier cannot be reassigned. For instance,
 // in case the content is an object,
 // this means the object itself can still be altered.

 const operation = fetchCurrentCity();
 const multiDone = callDone(done).afterTwoCalls();
 operation.setCallbacks(result => multiDone());
 operation.setCallbacks(result => multiDone());

 });
 /*
 test.("modified to pass callbacks later on",done => {



 const operation = fetchCurrentCity();
 operation.setCallbacks(result => done(), error => done(error));
 });
 */



