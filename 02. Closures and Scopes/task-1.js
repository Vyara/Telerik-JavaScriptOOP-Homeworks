/*Task 1.

 Create a module for working with books
 The module must provide the following functionalities:
 Add a new book to category
 Each book has unique title, author and ISBN
 It must return the newly created book with assigned ID
 If the category is missing, it must be automatically created
 List all books
 Return an array of books
 Books are sorted by ID
 This can be done by author, by category or all
 They are provided by an options object {category: ...} or {author: ...}
 List all categories
 Return an array of categories
 Categories are sorted by ID
 Each book/category has a unique identifier (ID) that is a number greater than 1
 When adding a book/category, the ID is generated automatically
 Add validation everywhere, where possible
 Book title and category name must be between 2 and 100 characters, including letters, digits and special characters ('!', ',', '.', etc)
 Author is any non-empty string
 Unique params are Book title and Book ISBN
 Book ISBN is an unique code that contains either 10 or 13 digits
 If something is not valid - throw Error
 */
function solve() {
    var library = (function () {
        var books = [],
            categories = [],
            categoryNames,
            sortedBooks,
            len,
            i;

        function listBooks(sortBy) {
            sortedBooks = [];
            if(!sortBy || !Object.keys(sortBy).length){
                sortedBooks = books;
            } else if(sortBy.hasOwnProperty('category')||sortBy.hasOwnProperty('author')){
                sortedBooks = books.filter(function(book){
                    return book.category == sortBy.category || book.author == sortBy.author;
                });
            }
            return sortedBooks;
        }

        function validateStringLength(string, name) {
            if (string.length < 2 || string.length > 100) {
                throw new Error(name + ' must be between 2 and 100 characters!');
            }
        }

        function validateAuthorProp(author) {
            if (!author) {
                throw new Error('Author must be a valid string!');
            }
        }

        function validateISBNProp(isbn) {
            if (isbn.length !== 10 && isbn.length !== 13) {
                throw new Error('ISBN must contain either 10 or 13 digits!')
            }
        }

        function isParamUnique(name, type) {
            len = books.length;
            for (i = 0; i < len; i += 1) {
                if (books[i][type] === name) {
                    return false;
                }
            }

            return true;
        }

        function parameterMatchError(param) {
            throw new Error('A book with this ' + param + ' already exist!');
        }

        function addCategory(category) {
            categories[category] = {
                books: [],
                id: categories.length + 1
            };
        }

        function addBook(book) {
            book.ID = books.length + 1;

            validateStringLength(book.title, 'title');
            validateStringLength(book.category, 'category');
            validateAuthorProp(book.author);
            validateISBNProp(book.isbn);

            if(!isParamUnique(book.title, 'title')){
                parameterMatchError('title');
            }

            if(!isParamUnique(book.isbn, 'isbn')){
                parameterMatchError('isbn');
            }

            if(categories.indexOf(book.category) < 0){
                addCategory(book.category);
            }

            categories[book.category].books.push(book);

            books.push(book);
            return book;
        }

        function listCategories() {
            categoryNames = [];
            Array.prototype.push.apply(categoryNames, Object.keys(categories));

            return categoryNames;
        }

        return {
            books: {
                list: listBooks,
                add: addBook
            },
            categories: {
                list: listCategories
            }
        };
    }());
    return library;
}
module.exports = solve;
