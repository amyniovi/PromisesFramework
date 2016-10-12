//Implementation of Promises framework here //

/*
 * Operations Executed Asynchronously
 * */
const delayms = 1;

function getCurrentCity(callback) {
    setTimeout(function () {

        const city = "New York, NY";
        callback("error", city);

    }, delayms)
}

function fetchCurrentCity() {
    const promise = new Promise();

    getCurrentCity(promise.registerCallback);
    return promise;
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

function fetchWeather(city) {
    const promise = new Promise();

    getWeather(city, promise.registerCallback);

    return promise;

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

function fetchForecast(city) {
    const promise = new Promise();

    getForecast(city, promise.registerCallback)
    return promise;
}

/*
 * Promises Framework
 * */

function Promise() {

    const promise = {
        SuccessCallbacks: [],
        ErrorCallbacks: []
    };

    const noop = function () {
    };

    promise.registerCallback = function (error, result) {

        if (error) {
            promise.fail(error);
            return;
        }
        promise.success(result);

    };

    promise.fail = function (error) {
        promise.state = "fail";
        promise.error = error;
        promise.ErrorCallbacks.forEach(c => c(error));
    };

    promise.success = function (result) {
        promise.state = "success";
        promise.result = result;
        promise.SuccessCallbacks.forEach(c=>c(result));
    };

    promise.OnCompletion = function (onSuccess) {
        if (promise.state == "success")
            onSuccess(promise.result);
        else
            promise.SuccessCallbacks.push(onSuccess || noop);
    };

    promise.onFail = function (onError) {
        if (promise.state == "fail")
            onError(promise.error);
        else
            promise.ErrorCallbacks.push(onError || noop);
    };


    return promise;
}

/*
 * Helper functions
 * */
function doLater(func) {
    setTimeout(func, 1000);
}

/*
function CallTestDoneOnce(done) {

    var counter = 0;

    return {
        AfterNCalls: function (expectedCount) {
            return function () {
                counter++;
                if (counter >= expectedCount)
                    done();
            }
        }

    }

}
*/
/*
 * Tests
 */
/*
test.("separating error and success ", done => {
    const operation = new Promise();
    doLater(getCurrentCity(operation.registerCallback));
    var myDone = CallTestDoneOnce(done).AfterNCalls(2);
    operation.onFail(myDone);
    operation.onFail(myDone);
    // operation.OnCompletion(myDone());


});
*/
/*
test.("modified to pass callbacks later on",done => {

    const operation = fetchCurrentCity();
    operation.setCallbacks(result => done(), error => done(error));
});
*/
/*
 * using promises (our Promise function that simulates promises) to test
 * ensuring two separate operations are executed and their results are both obtained
 * before we are done. That was hard to do with plain callbacks.
 * */

test.only("lexical parallelism", done => {
    var city = "london";
    var weatherPromise = fetchWeather(city);
    var forecastPromise = fetchForecast(city);
    weatherPromise.OnCompletion(
        function (weather) {
            forecastPromise.OnCompletion(function (forecast) {
                console.log("its currently $(weather.temp) in $(city) with a five day forecast of : $(forecast.fiveDay)");
                done();
            });

        }
    );


});



