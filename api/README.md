# Robot Chat Calculator

## Challange
Coding Challenge: Create a bot calculator using socket.io and mongoDB.
Requirements:
* I can open the app in a browser that contains a command input
* I can chat with the bot using only 2 possible command types 
** Operation command: 1 + 1 or 5 * 3, 1526 - 1452 + 5623 * 2, ...
** History command: history to display latest 10 calculations used
* The code can be accessed through your github/gitlab account, please send us a link when you're done.
* Please use multiple commits and descriptive commit description
* Implement unit testing
* Using typescript will be a bonus.

You can reply to this email with the link to your repository when you're done. If you have any questions, you can also reach out any time - happy coding!

The deadline is the end of next week (Friday 26th, March 2021).

## Run the app
### `npm install` _to install packages_

To run app
### `npm start` _to start the app_
Open [http://localhost:8000](http://localhost:3000) to view it in the browser.

### `npm test` _to run the tests_

## Comments about the code
* Haven't refactor anything.
* Haven't done any documenting either, but going forward, before it becomes an inmense task I should do it. Probably after OOP transformation.
* Test cover little and very cases, no division by zero, or any of the errors that come up in the chat box if you enter for example letters instead of numbers. That could be easily added in the robotResponse.spec.ts.
* This should have a user session that can be stored in localStorage so every user has its own operations. Prompt them to sign up if they want to save them.
* The front end is barren, put a at least a robot image in the front end. And then an animation robot.
* App and testing databases are in the cloud with Mongo Atlas. As tests are not in memory they can be a bit slow. I did it like this so its portable. To see database you can go to Atlas Cloud. Username is "drKreshel", password is "P4ssword".
* There should be several if not many performance optimizations to be done.
* The typing is very light. Didn't put much effort into it to speed up the coding.
* Didn't add a linting either, everytime I do that I spend days tuning the settings because I never seem to be satisfied with a format. Could have put the classic Airbnb preset I guess.

## Comments about the challange
* Unique, a change of airs and refreshing, considering most challanges are about layouting/bootstraping.
* Fun, enjoyable.
* Not time consuming.