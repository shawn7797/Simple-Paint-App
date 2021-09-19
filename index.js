var canvas,
    context,
    dragging = false,
    position,
    dragStartLocation,
    snapshot,
    letters,
    color,
    rects = [];

/**
 * Clears the canvas
 * Resets all flags and coordinate variables
 * Clears saved rectangle data
 * Clears the console
 */
function clearCanvas() {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	context.clearRect(0, 0, 935, 450);
  dragStartLocation = {};
  position = {};
  rects = [];
  snapshot = {};
  console.clear();
}

/**
 * Returns the canvas coordinates
 * @param {Object} event
 * @return {Object} containing X and Y coordinates
 */
function getCanvasCoordinates(event) {
  var x = event.clientX - canvas.getBoundingClientRect().left;
  var y = event.clientY - canvas.getBoundingClientRect().top;
  return {x: x, y: y};
}

/**
 * Returns a random Hex color code
 * @return {String} Hex color code
 */
function getRandomColor() {
  letters = '0123456789ABCDEF';
  color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Copies the pixel data from the canvas inbo the snapshot variable
 */
function takeSnapshot() {
  snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Restores the pixel data onto the canvas
 */
function restoreSnapshot() {
  context.putImageData(snapshot, 0, 0);
}

/**
 * Draws a single rectangle
 * @param {Object} r containing x1, y1, width and height
 */
function rect(r) {
  context.fillStyle=r.fillStyle;
  context.fillRect(r.x,r.y,r.width,r.height);
}

/**
 * Handles redrawing of the rectangles from the rects array onto the canvas
 */
function reDrawCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for(let i=0;i<rects.length;i++){
    rect(rects[i]);
  }
}

/**
 * Used to determine if the mouse pointer is currently within an existing rectangle
 * @param {dragStartLocation, rectsArray}
 * @return {Boolean}
 */
function isMouseInsideAny(dragStartLocation, rectsArray) {
  return (
    rectsArray.length
      && rectsArray.some(rect =>
        dragStartLocation.x>rect.x && dragStartLocation.x<rect.x+rect.width && dragStartLocation.y>rect.y && dragStartLocation.y<rect.y+rect.height
    )
  );
}

/**
 * Handles mouse down event
 * @param {Object} event
 */
function dragStart(event) {
  dragging = true;
  dragStartLocation = getCanvasCoordinates(event);

  if (isMouseInsideAny(dragStartLocation, rects)) {
    for(var i=0;i<rects.length;i++){
      var rect=rects[i];

      // test if the mouse is inside this rect
      if(dragStartLocation.x>rect.x && dragStartLocation.x<rect.x+rect.width && dragStartLocation.y>rect.y && dragStartLocation.y<rect.y+rect.height && !(rects[i].isBeingDragged === true)) {
        // if yes, set that rects isDragging=true
        rects[i].isBeingDragged=true;
      }
    }
  }
  else {
    takeSnapshot();
    context.fillStyle = getRandomColor();
  }
}

/**
 * Handles mouse move event
 * @param {Object} event
 */
function drag(event) {
  // tell the browser we're handling this mouse event
  event.preventDefault();
  event.stopPropagation();

  position = getCanvasCoordinates(event);

  if (dragging) {
    //handle existing rectangle dragging
    if (rects.length && rects.some(rect => rect.isBeingDragged === true)) {
      for(var i=0;i<rects.length;i++) {
        var rect=rects[i];
        var isBeingDragged = rect.isBeingDragged;

        //verifying that this rectangle is being dragged
        if (isBeingDragged) {
          // calculate the distance the mouse has moved
          // since the last mousemove
          var dx=position.x-dragStartLocation.x;
          var dy=position.y-dragStartLocation.y;

          // move each rect that isDragging
          rect.x+=dx;
          rect.y+=dy;

          //reset starting dragStartLocation
          dragStartLocation = position;

          reDrawCanvas();
        }
      }
    }
    else {
      restoreSnapshot();
      context.fillRect(dragStartLocation.x, dragStartLocation.y, (position.x - dragStartLocation.x), (position.y - dragStartLocation.y));;
    }
  }
}

/**
 * Handles mouse up event
 * @param {Object} event
 */
function dragStop(event) {
  dragging = false;

  // tell the browser we're handling this mouse event
  event.preventDefault();
  event.stopPropagation();

  if (rects.length && rects.some(rect => rect.isBeingDragged === true)) {
    for(var i=0;i<rects.length;i++) {
      if (rects[i].isBeingDragged === true) {
        rects[i].isBeingDragged=false;
        reDrawCanvas();
        break;
      }
    }
  }
  else {
    restoreSnapshot();
    position = getCanvasCoordinates(event);
    context.fillRect(dragStartLocation.x, dragStartLocation.y, (position.x - dragStartLocation.x), (position.y - dragStartLocation.y));;
    const width = (position.x - dragStartLocation.x);
    const height = (position.y - dragStartLocation.y);
    if (width > 0 && height > 0) {
      rects.push({
        x: dragStartLocation.x,
        y: dragStartLocation.y,
        width: (position.x - dragStartLocation.x),
        height: (position.y - dragStartLocation.y),
        isBeingDragged: false,
        fillStyle: context.fillStyle
      });
    }
  }
}

/**
 * Handles dblclick event
 * @param {Object} event
 */
function doubleClicked(event) {
  // tell the browser we're handling this mouse event
  event.preventDefault();
  event.stopPropagation();

  position = getCanvasCoordinates(event);
  var elementToSplice;
  if (isMouseInsideAny(position, rects)) {
    for(let i=0; i<rects.length; i++) {
      var x1 = rects[i].x;
      var y1 = rects[i].y;
      var x2 = x1 + rects[i].width;
      var y2 = y1 + rects[i].height;

      if (position.x > x1 && position.y > y1 && position.x < x2 && position.y < y2) {
        elementToSplice = i;
        break;
      }
    }
    rects.splice(elementToSplice, 1);
    reDrawCanvas();
  }
}

/**
 * Used to initialize the canvas, variables and event listeners
 */
function init() {
  canvas = document.getElementById("canvas");
  if (!canvas.getContext) {
    return;
  }
  context = canvas.getContext('2d');
  context.fillStyle = getRandomColor();

  canvas.addEventListener('mousedown', dragStart, false);
  canvas.addEventListener('mousemove', drag, false);
  canvas.addEventListener('mouseup', dragStop, false);
  canvas.addEventListener('dblclick', doubleClicked, false);
}

window.addEventListener('load', init, false);
