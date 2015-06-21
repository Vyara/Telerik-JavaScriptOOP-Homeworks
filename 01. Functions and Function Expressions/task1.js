/*Task 1.

 Write a function that sums an array of numbers:
 Numbers must be always of type Number
 Returns null if the array is empty
 Throws Error if the parameter is not passed (undefined)
 Throws if any of the elements is not convertible to Number
 */

function sumArray(){
    return function(array){
        if(!array.length){
            return null;
        } else if(array === undefined){
            throw  new Error('Please provide a valid array!');
        } else if(!array.every(function(element){
                return !isNaN(element);
            })){
            throw new Error('Please enter an array, where each element is a number!');
        }

        return array.reduce(function(result, element){
            return result += +element;
        }, 0);
    }
}