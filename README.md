Weather Checker App
===================
by Steve Kane

Technologies Used
-----------------

### Express
Serves up the main html page and scripts.

`npm install express --save` 

### Socket.io
Communication between the server and browser. Passing updated data to the browser in realtime.

`npm install socket.io --save`

### request
Used for making requests to Weather Underground for weather data.

`npm install request --save`

### Wunderground API
Weather information provided by https://www.wunderground.com/api.

Run it
------
$env:WUNDERGROUND="YOUR-KEY" ; npm start

See it
------
http://localhost:3000/
