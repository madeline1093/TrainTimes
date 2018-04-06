var config = {
    apiKey: "AIzaSyBHfcCcHKn4YOEknIyhJ6gP0KBpMXOR71w",
    authDomain: "traintracker-4cffa.firebaseapp.com",
    databaseURL: "https://traintracker-4cffa.firebaseio.com",
    projectId: "traintracker-4cffa",
    storageBucket: "",
    messagingSenderId: "814002363087"
  };
  firebase.initializeApp(config);

  var trainData = firebase.database();


  $("#add-train-btn").on("click", function(){
  //grab user input
    let trainName = $("#train-name-input").val().trim();
    let destination = $("#destination-input").val().trim();
    let firstTrain = $("#first-train-input").val().trim();
    let frequency = $("#frequency-input").val().trim();
  //add user input to train object
    let newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
    }
  //uploads employee data to database
    trainData.ref().push(newTrain);
  // logs everything to console
    //console.log(trainData);

  //clears all of the textboxes
  $("#train-name-input").val('');
  $("#destination-input").val('');
  $("#first-train-input").val('');
  $("#frequency-input").val('');
    
    return false; 
  })
;

  //add data event

  trainData.ref().on('child_added', function(childSnapshot, prevChildKey){
      //store everything into variable
        console.log(childSnapshot.val());
        let tName = childSnapshot.val().name;
        let tDestination = childSnapshot.val().destination;
        let tFrequency = childSnapshot.val().frequency;
        let tFirstTrain = childSnapshot.val().firstTrain;

        let trainArray = tFirstTrain.split(":"); //HHMM
        let traintracker = moment().hours(trainArray[0]).minutes(trainArray[1]);
        console.log(traintracker);

        let maxMoment = moment.max(moment(), traintracker);

    let tMinutes;
    let tArrival;
      // if first train is later tahn current time, set arrival to the first train time
        if(maxMoment === traintracker) {
            tArrival = traintracker.format("hh:mm A");
            tMinutes = traintracker.diff(moment(), "minutes");
        } else {
            let differenceTimes = moment().diff(traintracker, 'minutes');
            let tRemainder = differenceTimes % tFrequency;
            console.log(tRemainder);
            tMinutes = tFrequency - tRemainder;
            console.log(tMinutes);
            tArrival = moment().add(tMinutes, "m").format("hh:mm A");
        }
      // calculate minutes until arrival using math

      // add each train's data into table
        $("#train-table >tbody").append("<tr><td>"+ tName + "</td><td>" + tDestination + "</td><td>" + tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>")
  })