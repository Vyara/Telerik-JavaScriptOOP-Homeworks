/*Task 2.

 Write a function that finds all the prime numbers in a range
 It should return the prime numbers in an array
 It must throw an Error if any of the range params is not convertible to Number
 It must throw an Error if any of the range params is missing
 */


function findPrimes() {
    return function (start, end) {
        var primeNumbers = [],
            numberToCheck,
            startingPoint,
            endPoint,
            maxDivisor,
            args = Array.prototype.slice.call(arguments),
            isNumberPrime,
            i;
        if (!args.every(function(argument) {
                return !isNaN(argument);
            })) {

            throw new Error('Range elements must be numbers!');
        } else if (arguments.length < 2) {
            throw new Error('Please enter both start and end points!');

        } else{
            startingPoint = +start;
            endPoint = +end;
            for(numberToCheck = startingPoint; numberToCheck <= endPoint; numberToCheck += 1){
                if (isPrime(numberToCheck)){
                    primeNumbers.push(numberToCheck);
                }
            }

            return primeNumbers;
        }

        function isPrime(number){
                maxDivisor = Math.sqrt(number),
                isNumberPrime = true,
                i;
            if(number < 2){
                isNumberPrime = false;
            }

            for(i = 2; i <= maxDivisor; i += 1){
                if(!(number % i)){
                    isNumberPrime = false;
                    break;
                }
            }

            return isNumberPrime;
        }
    }
}