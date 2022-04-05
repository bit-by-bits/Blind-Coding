$(document).ready(function() {
    countDown();
})

function countDown(){
    setInterval(function() {
                
        var countDownDate = new Date("Apr 09, 2022 17:00:00").getTime();
        // console.log(countDownDate);
        var now = new Date().getTime();
        var timeleft = countDownDate - now;

        var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);  
        
        hours = Math.max(0, hours);
        minutes = Math.max(0, minutes);
        seconds = Math.max(0, seconds);
        
        if (hours < 10){
        hours = "0" + hours;
        }

        if (minutes < 10){
        minutes = "0" + minutes;
        }

        if (seconds < 10){
        seconds = "0" + seconds;
        }


        if (hours == "00" && minutes == "00" && seconds == "00"){
            document.getElementById("countdown-title").innerText = "Contest has started!";
            document.getElementById("countdown").innerHTML = "<a href='/login'><li>Enter</li></a>"
        }
    }, 1000);
}

function getLeaderboard() {
    $.ajax({
        url : "http://127.0.0.1:8000/leaderboard/",
        type : "GET",
        beforeSend : function() {
            document.getElementById('leaderboard-loader').style.display = 'block';
        },
        success : function(jsondata) {
            console.log("got leaderboard")
            var objRecieved = jQuery.parseJSON(JSON.stringify(jsondata));
            let template = document.getElementById("leaderboard-row");
            document.getElementById('leaderboard-loader').style.display = 'none';
            for (var i = 0; i < objRecieved.username.length; ++i) {
                let clone = template.content.cloneNode(true);
                document.getElementById('leaderboard-body').appendChild(clone);
                document.getElementsByClassName('rank')[i+2].innerHTML = i+1; //Get Array of Username's here
                document.getElementsByClassName('name')[i+2].innerHTML = objRecieved.username[i]; //Get Array of Username's here
                document.getElementsByClassName('score')[i+2].innerHTML = objRecieved.score[i]; //Get Array of Score's here
            }
            document.getElementById('userRank').innerHTML = 'Your Rank : ' + objRecieved.rank;
            document.getElementById('myrank').innerHTML = objRecieved.rank;
        },
        error : function() {
            console.log("Error");
        }
    })
}