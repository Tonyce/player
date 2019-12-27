<!-- https://codepen.io/blackjacques/pen/LLQKKJ -->
<script>
  import { onMount } from "svelte";
  function appendBuffer(buffer1, buffer2) {
    const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
  }
  function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i += 1) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  let loadDone = "";
  let percent = 0;
  
  let progress = 0;
  let coordinateLeft = 0;
  let couldMove = false;

  let audioContainer = '';

  onMount(async () => {
	initPlayer();
    coordinateLeft = document
      .getElementById("coordinate")
      .getBoundingClientRect().left;
    fetch("/api/music/1.mp3").then(response => {
      const allLength = response.headers.get("content-length");
      for (var value of response.headers.values()) {
        console.log(value);
      }
      const reader = response.body.getReader();
      let charsReceived = 0;
      // let base64String = 'data:image/jpg;base64,';
      let buffer = new ArrayBuffer(0);
      reader.read().then(function processText({ done, value }) {
        if (done) {
          console.log("Stream complete", charsReceived);
          // const secretCode = base64ToArrayBuffer(Base);
          const uarray = new Uint8Array(buffer);
		  const secret = new Uint8Array("secretCode");
		  const blob = new Blob([uarray.buffer], { type: 'audio/wav' });
		  const url = window.URL.createObjectURL(blob);
		  audioContainer.src = url;
		  setTimes();
          loadDone = "done";
          return;
        }
        // eslint-disable-next-line no-console
        // console.log(value);
        charsReceived += value.length;
        percent = Number((charsReceived / allLength).toFixed(2)) * 100;
        buffer = appendBuffer(buffer, value);
        // html += convert.toHtml(new TextDecoder("utf-8").decode(value), convertOption);
        //   html += new TextDecoder("utf-8").decode(value);
        reader.read().then(processText);
      });
    });
  });
  //   $: remaining = percent;
  let currTime = 0;
  let allTime = 0;
  function initPlayer() {
	  audioContainer = document.createElement('audio');
		audioContainer.addEventListener('timeupdate', updateProgressBar, false);
		
	// Add a listener for the play and pause events so the buttons state can be updated
	audioContainer.addEventListener('play', function() {
	// Change the button to be a pause button
	// changeButtonType(btnPlayPause, 'pause');
	}, false);
	
	audioContainer.addEventListener('pause', function() {
	// Change the button to be a play button
	// changeButtonType(btnPlayPause, 'play');
	}, false);
  }

  function setTimes() {
	  console.log(audioContainer)
	  currTime = audioContainer.currentTime;
	  allTime = audioContainer.duration;
  }

  function updateProgressBar() {
  // Work out how much of the media has played via the duration and currentTime parameters
  var percentage = audioContainer.currentTime / audioContainer.duration;
  // Update the progress bar's value
  updateY(percentage * 493);
  setTimes();
//   progressBar.value = percentage;
//   // Update the progress bar's text (for browsers that don't support the progress element)
//   progressBar.innerHTML = progressBar.title = percentage + '% played';
}
  
  function updateY(y) {
	  const tmp = (y / 493) * 100;
	progress = tmp >= 100 ? 100 : (tmp <= 0 ? 0 : tmp);
  }
  function handleClick(e) {
	const y = e.clientX - coordinateLeft;
	updateY(y)
  }
  function updateProcess(event) {
    // console.log(event)
    if (couldMove) {
      const y = event.clientX - coordinateLeft;
      const tmp = (y / 493) * 100;
		updateY(y)
      // console.log({ progress }, event.type, event.clientX);
    }
  }
  function handleMousemove(event) {
    updateProcess(event);
  }

  function handleMouseDown(e) {
    couldMove = true;
    // console.log("mousedown", couldMove);
  }

  function handleMouseUp(e) {
    updateProcess(e);
    couldMove = false;
    // console.log("mouseup", e.clientX, couldMove);
  }

  function handleMouseLeave(e) {
    // updateProcess(e)
    couldMove = false;
    // console.log("mouseleave", e.clientX, couldMove);
  }

  function play() {
	  audioContainer.play();
  }

//   setInterval(() => {
//     console.log({ progress }, "interval");
//   }, 2000);
</script>

<style>
  .player-container {
    width: 600px;
    margin: 0 auto;
    padding: 15px;
    background: lightgray;
  }
  .m-pbar {
    position: relative;
  }
  .barbg {
    position: relative;
    height: 9px;
    background-image: url("/statbar.png");
    background-attachment: scroll;
    background-clip: border-box;
    background-color: rgba(0, 0, 0, 0);
    background-origin: padding-box;
    background-position-x: 100%;
    background-position-y: 0px;
    background-size: auto;
    width: 493px;
    height: 9px;
    border-radius: 5px;
  }

  .rdy {
    height: 9px;
    background-position: right -30px;
  }

  .time {
    position: absolute;
    position: absolute;

    right: 0px;
    top: -8px;
  }
  .cur {
    height: 9px;
    position: absolute;
    top: 0;
    left: 0;
    background-position: left -66px;
    background-image: url("/statbar.png");
  }
  .cur .btn {
    position: absolute;
    top: -7px;
    right: -13px;
    width: 22px;
    height: 24px;
    margin-left: -11px;
    background-position: 0 -250px;
    background-image: url("/iconall.png");
  }
</style>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<p>{percent}%</p>
<div
  class="player-container"
  on:mouseleave={handleMouseLeave}
  on:mousemove={handleMousemove}
  on:mouseup={handleMouseUp}>
  <button on:click={play}>P/R</button>
  <div class="m-pbar">
    <div class="barbg" id="auto-id-ZANCLtRRMRhT6wNq">
      <div on:click={handleClick} id="coordinate" class="rdy" style="" />
      <div on:click={handleClick} class="cur" style="width: {progress}%;">
        <span
          on:mousedown={handleMouseDown}
          class="btn f-tdn f-alpha"
          id="auto-id-r0IynNJT0cqd5hBZ">
          <i />
        </span>
      </div>
    </div>
    <span class="time">
      <em>{currTime}</em>
      / {allTime}
    </span>
  </div>
</div>


<!-- 
var player = document.getElementById('music'); // id for audio element
var duration; // Duration of audio clip
btnPlayPause = document.getElementById('btnPlayPause');
btnMute      = document.getElementById('btnMute');
progressBar  = document.getElementById('progress-bar');
volumeBar    = document.getElementById('volume-bar');
source       = document.getElementById('audioSource');
  
// Update the video volume
volumeBar.addEventListener("change", function(evt) {function displayMessage(message, canPlay) {
    var element = document.querySelector('#message');
    element.innerHTML = message;
    element.className = canPlay ? 'info' : 'error';
}
  player.volume = parseInt(evt.target.value) / 10;
});

// Add a listener for the timeupdate event so we can update the progress bar
player.addEventListener('timeupdate', updateProgressBar, false);
	
// Add a listener for the play and pause events so the buttons state can be updated
player.addEventListener('play', function() {
  // Change the button to be a pause button
  changeButtonType(btnPlayPause, 'pause');
}, false);
  
player.addEventListener('pause', function() {
  // Change the button to be a play button
  changeButtonType(btnPlayPause, 'play');
}, false);

player.addEventListener('volumechange', function(e) { 
  // Update the button to be mute/unmute
  if (player.muted) changeButtonType(btnMute, 'unmute');
  else changeButtonType(btnMute, 'mute');
}, false);	

player.addEventListener('ended', function() { this.pause(); }, false);	

progressBar.addEventListener("click", seek);

function seek(e) {
  if (player.src) {
    var percent = e.offsetX / this.offsetWidth;
    player.currentTime = percent * player.duration;
    e.target.value = Math.floor(percent / 100);
    e.target.innerHTML = progressBar.value + '% played';
  }
}

function playPauseAudio() {
  if (player.src) {
    if (player.paused || player.ended) {
      // Change the button to a pause button
      changeButtonType(btnPlayPause, 'pause');
      player.play();
    }
    else {
      // Change the button to a play button
      changeButtonType(btnPlayPause, 'play');
      player.pause();
    }
  }
}

// Stop the current media from playing, and return it to the start position
function stopAudio() {
  if (player.src) {
    player.pause();
    if (player.currentTime) player.currentTime = 0;
  }
}

// Toggles the media player's mute and unmute status
function muteVolume() {
  if (player.src) {
    if (player.muted) {
      // Change the button to a mute button
      changeButtonType(btnMute, 'mute');
      player.muted = false;
    }
    else {
      // Change the button to an unmute button
      changeButtonType(btnMute, 'unmute');
      player.muted = true;
    }
  }
}

// Replays the media currently loaded in the player
function replayAudio() {
  if (player.src) {
    resetPlayer();
    player.play();
  }
}

// Update the progress bar


// Updates a button's title, innerHTML and CSS class
function changeButtonType(btn, value) {
  btn.title     = value;
  btn.innerHTML = value;
  btn.className = value;
}

function resetPlayer() {
  progressBar.value = 0;
  //clear the current song
  player.src = '';
  // Move the media back to the start
  player.currentTime = 0;
  // Set the play/pause button to 'play'
  changeButtonType(btnPlayPause, 'play');
}  

function displayMessage(message, canPlay) {
    var element = document.querySelector('#message');
    element.innerHTML = message;
    element.className = canPlay ? 'info' : 'error';
}

function playSelectedFile(event) {
    var file = this.files[0],
        type = file.type,
        canPlay = player.canPlayType(type),
        message = 'Can play type "' + type 
                + '": ' + (canPlay ? canPlay : 'no');
    displayMessage(message, canPlay);
    
    if (canPlay) player.src = URL.createObjectURL(file);
    else         resetPlayer();
  }

var inputNode = document.querySelector('input');
  inputNode.addEventListener('change', playSelectedFile, false); -->
