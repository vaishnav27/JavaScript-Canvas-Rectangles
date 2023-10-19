const image = document.getElementById("image");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const rectangles = [];
let isDrawing = false;
let startX, startY;
let selectedRectangle = null;

// Function to create a new rectangle
const createRectangle = (x, y, width, height) => {
  rectangles.push({ x, y, width, height });
  updateJSONRepresentation();
  drawRectangles();
};

// Function to delete the selected rectangle
const deleteSelectedRectangle = () => {
  if (selectedRectangle !== null) {
    const index = rectangles.indexOf(selectedRectangle);
    if (index !== -1) {
      rectangles.splice(index, 1);
      selectedRectangle = null;
      updateJSONRepresentation();
      drawRectangles();
    }
  }
};

canvas.addEventListener("mousedown", (e) => {
  const x = e.clientX - canvas.getBoundingClientRect().left;
  const y = e.clientY - canvas.getBoundingClientRect().top;

  selectedRectangle = getSelectedRectangle(x, y);

  if (selectedRectangle !== null) {
    isDrawing = true;
    startX = x - selectedRectangle.x;
    startY = y - selectedRectangle.y;
  } else {
    isDrawing = true;
    startX = x;
    startY = y;
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  const x = e.clientX - canvas.getBoundingClientRect().left;
  const y = e.clientY - canvas.getBoundingClientRect().top;

  if (selectedRectangle !== null) {
    selectedRectangle.width = x - startX;
    selectedRectangle.height = y - startY;
    drawRectangles();
  }
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  if (selectedRectangle === null) {
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;

    if (Math.abs(x - startX) > 2 && Math.abs(y - startY) > 2) {
      rectangles.push({
        x: startX,
        y: startY,
        width: x - startX,
        height: y - startY,
      });
    }
  }
  drawRectangles();
});

const deleteButton = document.getElementById("deleteButton");
deleteButton.addEventListener("click", () => {
  if (selectedRectangle !== null) {
    const index = rectangles.indexOf(selectedRectangle);
    if (index !== -1) {
      rectangles.splice(index, 1);
      updateJSONRepresentation();
    }
    selectedRectangle = null;
    drawRectangles();
  }
});

const jsonFileInput = document.getElementById("jsonFileInput");
jsonFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const jsonContent = e.target.result;
    const parsedData = JSON.parse(jsonContent);

    // Clear existing rectangles
    rectangles.length = 0;

    // Add rectangles from the parsed JSON
    for (let key in parsedData.coordinates) {
      if (parsedData.coordinates.hasOwnProperty(key)) {
        const rectData = parsedData.coordinates[key];
        rectangles.push({
          x: rectData.x,
          y: rectData.y,
          width: rectData.w,
          height: rectData.h,
        });
      }
    }

    drawRectangles();
  };

  reader.readAsText(file);
});

const drawRectangles = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const rect of rectangles) {
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  }
};

const getSelectedRectangle = (x, y) => {
  for (const rect of rectangles) {
    if (
      x >= rect.x &&
      x <= rect.x + rect.width &&
      y >= rect.y &&
      y <= rect.y + rect.height
    ) {
      return rect;
    }
  }
  return null;
};
document.addEventListener("keydown", (e) => {
  if (e.key === "s") {
    // Save the current rectangle
    createRectangle(0, 0, 100, 100);
  } else if (e.key === "r" || e.key === "Delete" || e.key === "Backspace") {
    // Delete the selected rectangle
    deleteSelectedRectangle();
  }
});

const updateJSONRepresentation = () => {
  const jsonRepresentation = {
    coordinates: {},
  };

  for (let i = 0; i < rectangles.length; i++) {
    const rect = rectangles[i];
    jsonRepresentation.coordinates[i] = {
      x: rect.x,
      y: rect.y,
      w: rect.width,
      h: rect.height,
    };
  }
  // Update JSON representation
  const jsonOutput = JSON.stringify(jsonRepresentation);
  console.log(jsonOutput);
};
updateJSONRepresentation();
