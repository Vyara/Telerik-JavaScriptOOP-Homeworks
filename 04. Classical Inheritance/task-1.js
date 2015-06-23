/* Task Description */
/*
 Create a function constructor for Person. Each Person must have:
 *	properties `firstname`, `lastname` and `age`
 *	firstname and lastname must always be strings between 3 and 20 characters, containing only Latin letters
 *	age must always be a number in the range 0 150
 *	the setter of age can receive a convertible-to-number value
 *	if any of the above is not met, throw Error
 *	property `fullname`
 *	the getter returns a string in the format 'FIRST_NAME LAST_NAME'
 *	the setter receives a string is the format 'FIRST_NAME LAST_NAME'
 *	it must parse it and set `firstname` and `lastname`
 *	method `introduce()` that returns a string in the format 'Hello! My name is FULL_NAME and I am AGE-years-old'
 *	all methods and properties must be attached to the prototype of the Person
 *	all methods and property setters must return this, if they are not supposed to return other value
 *	enables method-chaining
 */
function solve() {
    var start,
        name;
    var Person = (function () {
        function validateStringLength(string, name) {
            if (string.length < 3 || string.length > 20) {
                throw new Error(name + ' must be between 3 and 20 characters!');
            }
        }

        function validateIsStringIsOfLatinLetters(string, name) {
            if (!/^[a-zA-Z]*$/.test(string)) {
                throw new Error(name + ' must contain only Latin letters!');
            }

        }

        function validateNumberRange(number, start, end) {
            start = start || 0;
            if (number < start || number > end) {
                throw new Error(number + ' must be between ' + start + ' and ' + end + '!');
            }

        }

        function Person(firstname, lastname, age) {
            this.firstname = firstname;
            this.lastname = lastname;
            this.age = age;
        }

        Person.prototype.introduce = function () {
            return 'Hello! My name is ' + this.fullname + ' and I am ' + this.age + '-years-old';
        };

        Object.defineProperty(Person.prototype, 'firstname', {
            get: function () {
                return this._firstname;
            },
            set: function (firstname) {
                validateStringLength(firstname, 'firstname');
                validateIsStringIsOfLatinLetters(firstname, 'firstname');
                this._firstname = firstname;
            }
        });

        Object.defineProperty(Person.prototype, 'lastname', {
            get: function () {
                return this._lastname;
            },
            set: function (lastname) {
                validateStringLength(lastname, 'lastname');
                validateIsStringIsOfLatinLetters(lastname, 'lastname');
                this._lastname = lastname;
            }
        });

        Object.defineProperty(Person.prototype, 'age', {
            get: function () {
                return this._age;
            },

            set: function (age) {
                age = +age;
                validateNumberRange(age, 0, 150);
                this._age = age;
            }


        });

        Object.defineProperty(Person.prototype, 'fullname', {
            get: function () {
                return this.firstname + ' ' + this.lastname;
            },

            set: function (name) {
                name = name.split(' ');
                this.firstname = name[0];
                this.lastname = name[1];
            }


        });

        return Person;
    }());
    return Person;
}
module.exports = solve;