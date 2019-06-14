  // Your web app's Firebase configuration
  var firebaseConfig = {
      apiKey: "AIzaSyCjAWn70J613gtrdw7qA1hXQNBEIrzt7ZQ",
      authDomain: "train-scheduler-8e607.firebaseapp.com",
      databaseURL: "https://train-scheduler-8e607.firebaseio.com",
      projectId: "train-scheduler-8e607",
      storageBucket: "",
      messagingSenderId: "87112072927",
      appId: "1:87112072927:web:0c2382f96b720c9d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

  // 2. Button for adding trains
  $("#submit").on("click", function(event) {
      event.preventDefault();

      // Grabs user input
      var name = $("#name").val().trim();
      var destination = $("#destination").val().trim();
      var firstTime = moment($("#firstTime").val().trim(), "HH:mm").format("X");
      console.log("firstTime:   ", firstTime);
      var frequency = $("#frequency").val().trim();

      // Creates local "temporary" object for holding train data
      var newTrain = {
          name: name,
          destination: destination,
          firstTime: firstTime,
          frequency: frequency
      };

      database.ref().push(newTrain);

      // Logs everything to console
      console.log(newTrain.name);
      console.log(newTrain.destination);
      console.log(newTrain.firstTime);
      console.log(newTrain.frequency);

      // Clears all of the text-boxes
      $("#name").val("");
      $("#destination").val("");
      $("#firstTime").val("");
      $("#frequency").val("");
  });

  // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val());

      // Store everything into a variable.
      var name = childSnapshot.val().name;
      var destination = childSnapshot.val().destination;
      var firstTime = childSnapshot.val().firstTime;
      var frequency = childSnapshot.val().frequency;

      // Employee Info
      console.log(name);
      console.log(destination);
      console.log(firstTime);
      console.log(frequency);

      // Prettify the firstTime
      var firstTimePretty = moment(firstTime, "HH:mm").subtract(1, "years");

      var currentTime = moment();
      var diffTime = moment().diff(moment(firstTimePretty), "minutes");
      var tRemainder = diffTime % frequency;
      var tMinutesTillTrain = frequency - tRemainder;
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      var nextTrainConverted = moment(nextTrain).format("hh:mm");

      // Create the new row
      var newRow = $("<tr>").append(
          $("<td>").text(name),
          $("<td>").text(destination),
          $("<td>").text(frequency),
          $("<td>").text(nextTrainConverted),
          $("<td>").text(tMinutesTillTrain)
      );

      // Append the new row to the table
      $("#trainTable > tbody").append(newRow);
  });