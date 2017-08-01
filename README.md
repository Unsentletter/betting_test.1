# betting_test.1

1. Clone repo
2. cd into folder
3. enter `npm start` into the terminal

To run tests enter `npm test` into terminal


I ran into trouble when trying to write tests due to a scoping issue. I couldnt `module.exports` from the index file.  I solved this by creating a file just for functions and importing the functions into the `index.js` file. This also meant that I could access the functions to run the tests.  I think it also makes the `index.js` file look a lot cleaner.