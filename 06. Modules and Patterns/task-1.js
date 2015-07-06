/* Task Description */
/*
 * Create a module for a Telerik Academy course
 * The course has a title and presentations
 * Each presentation also has a title
 * There is a homework for each presentation
 * There is a set of students listed for the course
 * Each student has firstname, lastname and an ID
 * IDs must be unique integer numbers which are at least 1
 * Each student can submit a homework for each presentation in the course
 * Create method init
 * Accepts a string - course title
 * Accepts an array of strings - presentation titles
 * Throws if there is an invalid title
 * Titles do not start or end with spaces
 * Titles do not have consecutive spaces
 * Titles have at least one character
 * Throws if there are no presentations
 * Create method addStudent which lists a student for the course
 * Accepts a string in the format 'Firstname Lastname'
 * Throws if any of the names are not valid
 * Names start with an upper case letter
 * All other symbols in the name (if any) are lowercase letters
 * Generates a unique student ID and returns it
 * Create method getAllStudents that returns an array of students in the format:
 * {firstname: 'string', lastname: 'string', id: StudentID}
 * Create method submitHomework
 * Accepts studentID and homeworkID
 * homeworkID 1 is for the first presentation
 * homeworkID 2 is for the second one
 * ...
 * Throws if any of the IDs are invalid
 * Create method pushExamResults
 * Accepts an array of items in the format {StudentID: ..., Score: ...}
 * StudentIDs which are not listed get 0 points
 * Throw if there is an invalid StudentID
 * Throw if same StudentID is given more than once ( he tried to cheat (: )
 * Throw if Score is not a number
 * Create method getTopStudents which returns an array of the top 10 performing students
 * Array must be sorted from best to worst
 * If there are less than 10, return them all
 * The final score that is used to calculate the top performing students is done as follows:
 * 75% of the exam result
 * 25% the submitted homework (count of submitted homeworks / count of all homeworks) for the course
 */

function solve() {
    var i,
        j,
        k,
        l,
        m,
        n;


    function checkIfStringIsEmpty(string, name) {
        if (string === '') {
            throw new Error(name + ' must not be an empty string!');
        }
    }

    function checkIfStringStartsAndEndsWithSpaces(string, name) {
        if (/^\s+/.test(string) || /\s+$/.test(string)) {
            throw new Error(name + ' must not start or end with spaces!');
        }

    }

    function checkIfStringHasConsecutiveSpaces(string, name) {
        if (/\s{2,}/.test(string)) {
            throw new Error(name + ' must not have consecutive spaces!');
        }

    }

    function checkIfArrayIsEmpty(array, name) {
        if (array.length === 0) {
            throw new Error(name + ' array must not be empty!');
        }
    }

    function checkIfStringStartsWithAnUpperCase(string, name) {
        if (!/[A-Z][a-zA-Z]*\s*/.test(string)) {
            throw new Error(name + ' must start with an upper case letter!');
        }
    }

    function checkIfStringHasLowerSymbolsBesidesTheFirstOne(string, name) {
        if (!/[a-z]*$/.test(string)) {
            throw new Error(name + '\'s other symbols must be lowercase letters !');
        }
    }

    function checkIfNumberIsInRange(number, start, end) {
        if (number < start || number > end) {

            throw new Error(number + ' must be between ' + start + ' and ' + end);

        }
    }

    function sortResults(results) {
        var result = results.sort(function (firstResult, secondResult) {
            if (firstResult.StudentID < secondResult.StudentID) {
                return -1;
            } else if (firstResult.StudentID > secondResult.StudentID) {
                return 1;
            }
            return 0;
        })
    }

    function validaTeStudentID(id, students) {
        var isIdValid = students.some(function (student) {
            return student.id === id;
        });

        if (!isIdValid) {
            throw new Error('No student with that id exists');
        }
    }

    function validateScore(score) {
        if (score != Number(score)) {
            throw new Error('Score must be a number!')
        }
    }

    function validateResults(results, students) {
        var resultsLength = results.length,
            currentResult,
            nextResult;

        sortResults(results);
        for (j = 0; j < resultsLength; j += 1) {
            currentResult = results[j];
            nextResult = results[j + 1];

            if (j < resultsLength - 1 && currentResult.StudentID === nextResult.StudentID) {
                throw new Error('Same student!');
            }

            validaTeStudentID(currentResult.StudentID, students);
            validateScore(currentResult.score);
        }
    }

    function sortScores(scoreArray) {
        var result = scoreArray.sort(function (first, second) {
            if (first[1] < second[1]) {
                return -1;
            } else if (first[1] > second[1]) {
                return 1;
            }

            return 0;
        });

        return result;

    }

    var Course = {
        init: function (title, presentations) {
            this.title = title;
            this.presentations = presentations;
            this.studentsList = [];
            this.studentData = {};
            this.topStudents = [];

            return this;
        },

        get title() {
            return this._title;
        },

        set title(value) {
            checkIfStringStartsAndEndsWithSpaces(value, 'Title');
            checkIfStringHasConsecutiveSpaces(value, 'Title');
            checkIfStringIsEmpty(value, 'Title');

            this._title = value;
        },

        get presentations() {
            return this._presentations;
        },

        set presentations(value) {
            var len = value.length;
            checkIfArrayIsEmpty(value, 'Presentations');
            for (i = 0; i < len; i += 1) {
                checkIfStringStartsAndEndsWithSpaces(value[i], 'Presentation title');
                checkIfStringHasConsecutiveSpaces(value[i], 'Presentation title');
                checkIfStringIsEmpty(value[i], 'Presentation title');
            }

            this._presentations = value;
        },

        addStudent: function (name) {

            var names = name.split(' '),
                id = this.studentsList.length + 1;

            if (names.length !== 2) {
                throw new Error('Student names must be exactly 2!');
            }

            checkIfStringStartsWithAnUpperCase(names[0], 'First name');
            checkIfStringStartsWithAnUpperCase(names[1], 'Last name');
            checkIfStringHasLowerSymbolsBesidesTheFirstOne(names[0], 'First name');
            checkIfStringHasLowerSymbolsBesidesTheFirstOne(names[1], 'Last name');

            var student = {
                firstname: names[0],
                lastname: names[1]
            };

            student.id = id;

            if (!this.studentData[student.id]) {
                this.studentData[student.id] = {
                    homework: []
                }
            }

            this.studentsList.push(student);

            return id;
        },
        getAllStudents: function () {
            return this.studentsList.slice();
        },

        submitHomework: function (studentID, homeworkID) {
            if (studentID !== Number(studentID) || homeworkID !== Number(homeworkID)) {
                throw new Error("ID must be a number!")
            }

            checkIfNumberIsInRange(studentID, 1, this.studentsList.length);
            checkIfNumberIsInRange(homeworkID, 1, this.presentations.length);
            this.studentData[studentID].homework.push(homeworkID);
            return this;

        },

        pushExamResults: function (results) {
            var resultsLength = results.length,
                currentResult;

            validateResults(results, this.studentsList);

            for (k = 0; k < resultsLength; k += 1) {
                currentResult = results[k];
                this.studentData[currentResult.StudentID].examResults = currentResult.score;
            }

            return this;
        },

        getTopStudents: function () {
            var finalResults = [],
                studentsLength = this.studentsList.length,
                examScore,
                homeworkScore,
                currentStudent,
                topScores,
                topScoresLength,
                finalScore;

            for (l = 0; l < studentsLength; l += 1) {
                currentStudent = this.studentData[this.studentsList[l].id];
                examScore = currentStudent.examResults;
                homeworkScore = currentStudent.homework.length / this._presentations.length;
                finalScore = examScore / 100 * 75 + homeworkScore / 100 * 25;

                finalResults.push([currentStudent, finalScore]);

            }

            topScores = sortResults(finalResults).reverse().slice(0, 10);
            topScoresLength = topScores.length;

            for (m = 0; m < topScoresLength; m += 1) {
                for (n = 0; n < studentsLength; n += 1) {
                    if (topScores[m][0] === this.studentsList[n].id) {
                        this.topStudents.push(this.studentsList[n]);
                    }
                }
            }
            return this.topStudents;
        }
    };

    return Course;
}


module.exports = solve;
