let ctrlDown = false;
let ctrlKey = 17, cmdKey = 91, vKey = 86, cKey = 67;
let qNo = 0;

let languageIDs = JSON.parse(
  "[\n  {\n    \"id\": \"java\",\n    \"name\": \"Java JDK 17.0.1\",\n    \"version\": 4\n  },\n {\n    \"id\": \"nodejs\",\n    \"name\": \"JavaScript\",\n    \"version\": 4\n  },\n  {\n    \"id\": \"c\",\n    \"name\": \"C GCC 9.1.0\",\n    \"version\": 4\n  },\n  {\n    \"id\": \"cpp\",\n    \"name\": \"C++ GCC 9.1.0\",\n    \"version\": 4\n  },\n  {\n    \"id\": \"cpp14\",\n    \"name\": \"C++ 14 GCC 9.1.0\",\n    \"version\": 3\n  },\n  {\n    \"id\": \"cpp17\",\n    \"name\": \"C++ 17 GCC 9.1.0\",\n    \"version\": 0\n  },\n  {\n    \"id\": \"cpp\",\n    \"name\": \"C++ GCC 9.1.0\",\n    \"version\": 4\n  },\n  {\n    \"id\": \"python3\",\n    \"name\": \"Python 3.6.5\",\n    \"version\": 2\n  },\n  {\n    \"id\": \"ruby\",\n    \"name\": \"Ruby 3.0.2\",\n    \"version\": 4\n  },\n  {\n    \"id\": \"go\",\n    \"name\": \"GoLang 1.17.3\",\n    \"version\": 4\n  },\n  {\n    \"id\": \"scala\",\n    \"name\": \"Scala 2.13.6\",\n    \"version\": 4\n  },\n  {\n    \"id\": \"bash\",\n    \"name\": \"Bash Shell 5.1.12\",\n    \"version\": 4\n  },\n  {\n    \"id\": \"csharp\",\n    \"name\": \"C# mono-6.12.0\",\n    \"version\": 4\n  },\n  {\n    \"id\": \"rust\",\n    \"name\": \"Rust 1.56.1\",\n    \"version\": 4\n  },\n  {\n    \"id\": \"dart\",\n    \"name\": \"Dart 2.14.4\",\n    \"version\": 4\n  },\n  {\n    \"id\": \"nasm\",\n    \"name\": \"NASM 2.15.05\",\n    \"version\": 4\n  },\n  {\n    \"id\": \"kotlin\",\n    \"name\": \"Kotlin 1.6.0 (JRE 17.0.1+12)\",\n    \"version\": 3\n  }\n]"
);

let timerCont = document.getElementById('timer');
let s = 0, m = 0;
let timerId;
const _totalNumQues = 5;
let codeMap= new Map();

$(document).ready(function() {
  for(var i=0; i<_totalNumQues; i++){
    codeMap.set(i, null)
  }

  sendRequest('GET', '/getChancesUsed/', null).then(
    function(response){
      response = JSON.parse(response);
      var clicks = response['chancesUsed'];
      document.getElementById("view-chances").innerText = 5 - clicks;
    }
  ).catch()

  populateLangs();
  getQuestion(0);
  disableCopyPaste();
  leaderbInit();
  increaseTime();
  hideCode();
  addResizeEvent();
  tabOrWindowChange();
  showBtnInit();
  sideNavInit();
});

function showBtnInit(){
  document.getElementById('showCode').addEventListener('click', () => {
    showCode()
  });
}

function addResizeEvent(){
  window.onresize = function() {
    if ((window.outerHeight - window.innerHeight) > 100) {
      logout('screen-resize')
    }
  }
}

function tabOrWindowChange(){
  // setInterval( checkFocus, 200 );

  // function checkFocus(){
  //   if(document.hasFocus()==false){
  //     logout('Focus Lost')
  //   }
  // }

  document.addEventListener("visibilitychange", (event) => {
    if (document.visibilityState == "visible") {
    
    } else {
      logout("Focus Lost")
    }
  });
}

function leaderbInit(){
  let i = 0;  
  $('.leaderboard-icon').click(function() {
    $('.leaderboard').fadeToggle(650, "swing");
    if (i === 0) {
      $('.li').html('cancel');
      i = 1
      getLeaderboard();
      // insert_chart
    }
    else {
      $('.li').html('insert_chart')
      i = 0;
    }
  });
}
function disableCopyPaste(){
  var inp = document.getElementsByClassName('noselect')[0];
  inp.addEventListener('select', function() {
    this.selectionStart = this.selectionEnd;
  }, false);
  document.addEventListener('contextmenu', event => event.preventDefault());
    $(document).keydown(function(e) {
        // console.log('Key pressed: ', e.keyCode);
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
    }).keyup(function(e) {
        // console.log('Key released: ', e.keyCode);
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
    });

    $(".no-copy-paste").keydown(function(e) {
        // console.log('Key pressed inside editor: ', e.keyCode);
        if(ctrlDown && (e.keyCode == cKey))
        { 
          console.log("Document catch Ctrl+C");
        }
        if(ctrlDown && (e.keyCode == vKey)){
          console.log("Document catch Ctrl+V");
        }
        if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)){
          // console.log('copy-paste');
          return false;
       }
    });
}

function populateLangs()
{
  console.log('populating languages...');
  
  let selectField = document.getElementById('langSelect');
  for(element of languageIDs)
  {
     var opt = document.createElement("option");
     opt.value= element['id']+";"+element['version'];
     opt.innerHTML = element['name'];
     selectField.appendChild(opt);
  }
}

function logout(reason){
  if(reason == 'Finished'){
    Swal.fire(
      'Congratulations',
      'You have successfully attempted all the questions',
      'success'
    );
  }
  else if(reason == 'screen-resize'){
    Swal.fire(
      'Sorry',
      "You will be logged out since you didn't follow the instructions",
      'error'
    );
  } else if(reason == 'TimeUp'){
    Swal.fire(
      'Time Up!',
      "Sorry, time is up. You won't be able to answer questions any further.",
      'success'
    );
  }

  setTimeout(function goOut(){
    window.location.href = "/";
  }, 2000);
}

function resetTime(){
  s = 0;
  m = 0;
}

function setOutput(outp) {
  document.getElementById("compilerOutput").value = outp;
}

function setScore(score){
  document.getElementById('score').innerHTML = score;
}

function setRunAttempts(attempts){
  document.getElementById('run-attempts').innerHTML = attempts;
}

function getOutput(){
  return document.getElementById("compilerOutput").value;
}

function increaseQNum(){
  qNo = (getQNum() + 1) % _totalNumQues;
}

function getQNum() { 
  return qNo;
}

function getCode(){
  return document.getElementById("codeInput").value;
}

function getLanguage(){
  return document.getElementById("langSelect").value;
}

function disableRun(){
  document.getElementById('runBtn').disabled = true;
}

function enableRun(){
  document.getElementById('runBtn').disabled = false;
}

function runCode(){
  disableRun();
  pauseTime();
  console.log(`Time elapsed is: ${m} minutes and ${s} seconds`);

  let prog = getCode();

  let lang = getLanguage();
  let langInfo = lang.split(';');
  let langID = langInfo[0];
  let langVersion = langInfo[1];

  if (langVersion == undefined || langVersion == null){
    Swal.fire(
      'Stop!',
      'Please select a language to run your code in',
      'error'
    );
    return ;
  }

  let time = m * 60 + s;

  let loginEmail = document.getElementById("email").value;

  let program = {
    source_code : prog,
    language_id: langID,
    qNo: getQNum(),
    timeElapsed: time,
    version: langVersion,
    email: loginEmail,
  };
  console.log(prog)
  document.getElementById("compilerOutput").innerText = "Running..."

  sendRequest('POST', '/runCode/', program).then(
    function(response){
      console.log(program);

      response = JSON.parse(response);
      console.log('Compiler Call Response: ', response);
      setOutput(response['stdout']);
      setScore(response['score']);
      setRunAttempts(response['runAttempts'])
      if(getOutput() == 'Correct Answer'){
        if(response['completedGame'] == 'true'){
          Swal.fire(
            'Congrats!',
            'You have correctly answered all questions!',
            'success'
          );
          logout('Finished');
        }
        resetTime();
        increaseQNum();
        getQuestion(qNo);
      }
      increaseTime();
      enableRun();
    }
  ).catch(
    function(error){
      increaseTime();
      enableRun();
      console.error(error);
    }
  );
}

function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

function sendRequest(type, url, data){
  let request = new XMLHttpRequest();
  let csrftoken = getCookie("csrftoken");
  return new Promise(function(resolve, reject){
      request.onreadystatechange = () => {
          if (request.readyState !== 4) return;
          // Process the response
    if (request.status >= 200 && request.status < 300) {
              // If successful
      resolve(request.responseText);
    } else {
      // If failed
      reject({
        status: request.status,
        statusText: request.statusText
      });
    }
      };
      // Setup our HTTP request
  request.open(type || "GET", url, true);
      // Add csrf token
      request.setRequestHeader("X-CSRFToken", csrftoken);
      // Send the request
      request.send(JSON.stringify(data));
  });
  
}

function getQuestion(queNum){

  codeMap.set(qNo, getCode())
  sendRequest('POST', '/question/', { queNum }).then(
    function(response){
      response = JSON.parse(response);
        let inpt = response['sampIn'].split(' ');
        let inStr = '';
        for(let i = 0; i < inpt.length;i++)
        {
          inStr += inpt[i];
          inStr += '\n';
        }
        let que = response['question'] + '<br><br>'+'Sample Input'+'<br>'+response['sampTCNum']+'<br>'+inStr+'<br><br>'+'Sample Output'+'<br>'+response['sampleOut'];
        document.getElementsByClassName('qno')[0].innerHTML='Q. '+(queNum+1);
        document.getElementsByClassName('left')[0].innerHTML=que;
        qNo = response['qNo'];
        document.getElementById('score').innerHTML = response['userScore'];
        var s= document.getElementById("codeInput");
        s.value= codeMap.get(queNum)
    }
  ).catch(
    function(error){
      increaseTime();
      console.error(error);
    }
  );
}

function login() {
  sendRequest('POST', 'login/', '').then(
    function(resp){
      console.log(resp);
    }
  ).catch(
    function(error){
      console.error(error);
    }
  );
}

function showInstructions() {
    document.getElementsByClassName('instructions')[0].style.display = 'flex';
    document.getElementsByClassName('backdrop')[0].style.display = 'block';
}

function closeInstructions() {
    document.getElementsByClassName('instructions')[0].style.display = 'none';
    document.getElementsByClassName('backdrop')[0].style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
});
  
  $(document).delegate('#codeInput', 'keydown', function(e) {
    var keyCode = e.keyCode || e.which;
  
    if (keyCode == 9) {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
  
      // set textarea value to: text before caret + tab + text after caret
      $(this).val($(this).val().substring(0, start)
                  + "\t"
                  + $(this).val().substring(end));
  
      // put caret at right position again
      this.selectionStart =
      this.selectionEnd = start + 1;
    }
  });

function sideNavInit(){
  let hamburger = document.querySelector(".hamburger");
  const title = document.querySelector('.title')

  // Side-nav event handler
  hamburger.onclick = function(e) {
    e.preventDefault;
    if (hamburger.classList.contains("active")) {
      hamburger.classList.remove("active");
      hamburger.style.transform = 'translateX(0)';
      document.getElementById('sidenav').style.transform = 'translateX(-100%)';
      title.style.left = 'calc(3vh + 50px)'
    }
    else {
      hamburger.classList.add("active");
      hamburger.style.transform = 'translateX(21vw)';
      document.getElementById('sidenav').style.transform = 'translateX(0)';
      title.style.left = '3vh'
    }
  }
}

function increaseTime() {
    timerId = setInterval(function() {
    // if (s > 59){
    //   s -= 60;
    //   m += 1;
    // } 

    // if (m < 10) {
    //   if (s < 10) {
    //     timerCont.innerHTML = '0' + m + ':0' + s;
    //   }
    //   else {
    //     timerCont.innerHTML = '0' + m + ':' + s;
    //   }
    // }
    // else {
    //   if (s < 10) {
    //     timerCont.innerHTML = m + ':0' + s;
    //   }
    //   else {
    //     timerCont.innerHTML = + m + ':' + s;
    //   }
    // }

    // s++;
    
    var countDownDate = new Date("Apr 09, 2022 19:00:00").getTime();
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

    timerCont.innerHTML = hours + ':' + minutes + ':' + seconds;

    if (hours == "00" && minutes == "00" && seconds == "00"){
      logout("TimeUp");
    }
  }, 1000)
}

// Pause time function
function pauseTime() {
  // clearInterval(timerId);
}

// Won't allow user to cheat by changing text-color
let codeIntervalId;
let clicks = 0;
const hideCode = () => {
  document.getElementById('codeInput').style.color = 'black';
}

function increaseClicks(clicks){
  pauseTime();
  let data = {
    'clicks' : clicks+1
  };
  sendRequest('POST', '/increaseClicks/', data).then(
    function(response){
      increaseTime();
    }
  ).catch(
    function(error){
      increaseTime();
      console.error(error);
    }
  );
}

const showCode = () => {
  pauseTime();
  sendRequest('GET', '/getChancesUsed/', null).then(
    function(response){
      response = JSON.parse(response);
      var clicks = response['chancesUsed'];
      document.getElementById("view-chances").innerText = Math.max(0, 4 - clicks);
      console.log(clicks)
      const box = document.getElementById('codeInput');
      if (box.disabled === false) {
        // Functionality won't be achieved after two clicks
        if (clicks >= 5) {
          Swal.fire(
            'Sorry..',
            'You have used up all your view code chances!',
            'error'
          );
          return;
        }
        else {
          // Disable button and show code for 5 seconds
          document.getElementById("showCode").disabled = true;
          box.disabled = true;
          // clearInterval(codeIntervalId);
          box.style.color = 'white';
          setTimeout(() => {
            hideCode()
            box.disabled = false;
            document.getElementById("showCode").disabled = false;
          }, 5000);
        }
        increaseClicks(clicks);
      }
    }
  ).catch(
    function(error){
      console.log("Error of show code");
      increaseTime();
      console.error(error);
    }
  );
}
$(document).ready(function(){
  $('select').formSelect();
});