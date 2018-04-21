require("dotenv").config();

// Require keys data & modules
const   keys    = require("./keys.js"),
        request = require("request"),
        Twitter = require("twitter"),
        Spotify = require("node-spotify-api"),
        client  = new Twitter(keys.twitter),
        spotify = new Spotify(keys.spotify),
        fs      = require("fs");

// Store arguments in array
var nodeArgv = process.argv;
var command = process.argv[2];

// Song or movie input
var input = "";

for (var i = 3; i < nodeArgv.length; i++) {
  if (i > 3 && i < nodeArgv.length) {
    input = input + "+" + nodeArgv[i];
  } else {
    input = input + nodeArgv[i];
  }
};

// Switch case
switch (command) {
  case "my-tweets":
    showTweets();
    break;

  case "spotify-this-song":
    if (input) {
      spotifySong(input);
    } else {
      spotifySong("The Sign Ace of Base");
    }
    break;

  case "movie-this":
    if (input) {
      omdbData(input);
    } else {
      omdbData("Mr. Nobody");
    }
    break;

  case "do-what-it-says":
    doThing();
    break;

  default:
    console.log(
      "Please enter a command: my-tweets, spotify-this-song (+ a song), movie-this (+ a movie), do-what-it-says"
    );
    break;
};

function showTweets() {
  // Displays last 20 Tweets
  var params = { screen_name: "MotCootbamp", count: 20 };

  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        var date = tweets[i].created_at;
        console.log(
          "@MotCootbamp: " +
            tweets[i].text +
            " Created At: " +
            date.substring(0, 19) + "\n-----------------------");

        //adds text to log.txt file
        fs.appendFile(
          "log.txt",
          "\n@MotCootbamp: " +
            tweets[i].text +
            " Created At: " +
            date.substring(0, 19) + "\n-----------------------", () => {});
      }
    } 
    else {
      console.log("Error occurred");
    }
  });
};

function spotifySong(song) {
  spotify.search({ type: "track", query: song, limit: 1 }, function(
    error,
    data
  ) {
    if (!error) {
      for (var i = 0; i < data.tracks.items.length; i++) {
        var songData = data.tracks.items[i];
        
        console.log("Artist: " + songData.artists[0].name + 
                    "\nSong: " + songData.name + 
                    "\nPreview URL: " + songData.preview_url + 
                    "\nAlbum: " + songData.album.name + 
                    "\n-----------------------");

        //adds text to log.txt
        fs.appendFile("log.txt", "\n " + songData.artists[0].name + "\n " + songData.name + "\n " + songData.preview_url + "\n " + songData.album.name + "\n-----------------------", () => {});
      }
    } else {
      console.log("Error occurred.");
    };
  });
};

function omdbData(movie) {
  var omdbURL =
    "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

  request(omdbURL, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var body = JSON.parse(body);

      console.log(
        "Title: " +
          body.Title +
          "\nRelease Year: " +
          body.Year +
          "\nIMdB Rating: " +
          body.imdbRating +
          "\nRotten Tomatoes Rating: " +
          body.Ratings[1].Value +
          "\nCountry: " +
          body.Country +
          "\nLanguage: " +
          body.Language +
          "\nPlot: " +
          body.Plot +
          "\nActors: " +
          body.Actors
      );

      //adds text to log.txt
      fs.appendFile("log.txt",  "\nTitle: " + body.Title + 
                                "\nRelease Year: " + body.Year + 
                                "\nIMdB Rating: " + body.imdbRating + 
                                "\nRotten Tomatoes Rating: " + body.Ratings[1].Value + 
                                "\nCountry: " + body.Country + 
                                "\nLanguage: " + body.Language + 
                                "\nPlot: " + body.Plot + 
                                "\nActors: " + body.Actors, () => {});
    } else {
      console.log("Error occurred.");
    }
    if (movie === "Mr. Nobody") {
      console.log("\n-----------------------" + 
                  "\nIf you haven't watched 'Mr. Nobody,' then you should: " + 
                  "\nhttp://www.imdb.com/title/tt0485947/" + 
                  "\nIt's on Netflix!");

      //adds text to log.txt
      fs.appendFile("log.txt", "\n-----------------------" + 
                              "\nIf you haven't watched 'Mr. Nobody,' then you should: " + "\nhttp://www.imdb.com/title/tt0485947/" + 
                              "\nIt's on Netflix!", () => {});
    }
  });
};

function doThing() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    var txt = data.split(",");
    spotifySong(txt[1]);
  });
};
