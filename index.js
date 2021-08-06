var canvas,
    context,
    dragging = false,
    dragStartLocation,
    snapshot,
    letters,
    color;

function clearCanvas() {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	context.clearRect(0, 0, 935, 450);
}


function getCanvasCoordinates(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

function getRandomColor() {
  letters = '0123456789ABCDEF';
  color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function takeSnapshot() {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapshot() {
    context.putImageData(snapshot, 0, 0);
}

function drawRect(position) {
  context.beginPath();
  context.rect(dragStartLocation.x, dragStartLocation.y, (position.x - dragStartLocation.x), (position.y - dragStartLocation.y));
  context.fill();
}

function dragStart(event) {
    dragging = true;
    dragStartLocation = getCanvasCoordinates(event);
    takeSnapshot();
    context.fillStyle = getRandomColor();
}

function drag(event) {
    var position;
    if (dragging === true) {
        restoreSnapshot();
        position = getCanvasCoordinates(event);
        drawRect(position);
    }
}

function dragStop(event) {
    dragging = false;
    restoreSnapshot();
    var position = getCanvasCoordinates(event);
    drawRect(position);
}

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
    context.strokeStyle = 'yellow';
    context.fillStyle = getRandomColor();
    context.lineWidth = 4;
    context.lineCap = 'round';

    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);
}

window.addEventListener('load', init, false);
