let scaleX = 1, scaleY = 1;
let isPanning = false, isScalingY = false;
let startX = 0, startY = 0;
let offsetX = 0, offsetY = 0;

export const drawAll = (context) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    drawAxisOnChart(context);
    drawCandlesticks(context);
};

const drawCandlesticks = (context) => {
    drawCandlestick(context, 1, 4, 0, 2, 8);
    drawCandlestick(context, 2, 5, 1, 4, 9);
    drawCandlestick(context, 4, 6, 0, 1, 10);
    drawCandlestick(context, 1, 6, 1, 3, 11);
};

const handleWheel = (event, chartRef) => {
    event.preventDefault();
    if (event.deltaY < 0) {
        scaleX *= 1.1; // Zoom in X
    } else {
        scaleX /= 1.1; // Zoom out X
    }
    const context = chartRef.value.getContext("2d");
    drawAll(context);
};

const startPan = (event, chartRef) => {
    const canvas = chartRef.value;
    if (canvas.style.cursor === 'ns-resize') {
        isScalingY = true;
    } else {
        isPanning = true;
    }
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;
};

const pan = (event, chartRef) => {
    if (isPanning) {
        offsetX = event.clientX - startX;
        offsetY = event.clientY - startY;
    } else if (isScalingY) {
        const deltaY = event.clientY - startY;
        scaleY += deltaY * 0.002; // Adjust the scaling factor as needed
        startY = event.clientY;
    }
    const context = chartRef.value.getContext("2d");
    drawAll(context);
};

const endPan = () => {
    isPanning = false;
    isScalingY = false;
};

const handleMouseMove = (event, chartRef) => {
    const canvas = chartRef.value;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (mouseX < 50) {
        canvas.style.cursor = 'ns-resize';
    } else {
        canvas.style.cursor = 'default';
    }
};

export const setupChart = (chartRef) => {
    const context = chartRef.value.getContext("2d");
    drawAll(context);
    chartRef.value.addEventListener("wheel", (event) => handleWheel(event, chartRef));
    chartRef.value.addEventListener("mousedown", (event) => startPan(event, chartRef));
    chartRef.value.addEventListener("mousemove", (event) => pan(event, chartRef));
    chartRef.value.addEventListener("mouseup", endPan);
    chartRef.value.addEventListener("mouseleave", endPan);
    chartRef.value.addEventListener("mousemove", (event) => handleMouseMove(event, chartRef));
};

export const teardownChart = (chartRef) => {
    chartRef.value.removeEventListener("wheel", (event) => handleWheel(event, chartRef));
    chartRef.value.removeEventListener("mousedown", (event) => startPan(event, chartRef));
    chartRef.value.removeEventListener("mousemove", (event) => pan(event, chartRef));
    chartRef.value.removeEventListener("mouseup", endPan);
    chartRef.value.removeEventListener("mouseleave", endPan);
    chartRef.value.removeEventListener("mousemove", (event) => handleMouseMove(event, chartRef));
};

const drawAxisOnChart = (context) => {
    context.fillStyle = "black";
    context.strokeStyle = context.fillStyle;
    context.beginPath();
    context.moveTo(50, 50);
    context.lineTo(50, 650);
    context.lineTo(1150, 650);
    context.stroke();

    drawXAxisTicks(context);
    drawXAxisLabels(context);
    drawYAxisTicks(context);
    drawYAxisLabels(context);
};

const drawXAxisTicks = (context) => {
    context.beginPath();
    for (let i = 0; i < 30; i++) {
        context.moveTo((50 + i * 30) * scaleX + offsetX, 650);
        context.lineTo((50 + i * 30) * scaleX + offsetX, 645);
    }
    context.stroke();
};

const drawXAxisLabels = (context) => {
    context.font = "20px Arial";
    for (let i = 0; i < 30; i++) {
        context.fillText(i, (45 + i * 30) * scaleX + offsetX, 670);
    }
};

const drawYAxisTicks = (context) => {
    context.beginPath();
    for (let i = 0; i < 6; i++) {
        context.moveTo(50, (650 - i * 100) * scaleY + offsetY);
        context.lineTo(55, (650 - i * 100) * scaleY + offsetY);
    }
    context.stroke();
};

const drawYAxisLabels = (context) => {
    context.font = "20px Arial";
    for (let i = 0; i < 6; i++) {
        context.fillText(i, 20, (655 - i * 100) * scaleY + offsetY);
    }
};

const drawCandlestick = (context, open, high, low, close, x) => {
    let top = open;
    let bottom = close;

    if (open > close) {
        context.fillStyle = "red";
        context.strokeStyle = context.fillStyle;
    } else {
        context.fillStyle = "green";
        context.strokeStyle = context.fillStyle;
        top = close;
        bottom = open;
    }
    // Compute the position and draw a rectangle for the open and close
    context.fillRect((50 + x * 30 - 14) * scaleX + offsetX, (650 - open * 100) * scaleY + offsetY, 28 * scaleX, (open * 100 - close * 100) * scaleY);

    // Draw the wicks
    context.beginPath();
    context.moveTo((50 + x * 30) * scaleX + offsetX, (650 - high * 100) * scaleY + offsetY);
    context.lineTo((50 + x * 30) * scaleX + offsetX, (650 - top * 100) * scaleY + offsetY);
    context.stroke();

    context.beginPath();
    context.moveTo((50 + x * 30) * scaleX + offsetX, (650 - low * 100) * scaleY + offsetY);
    context.lineTo((50 + x * 30) * scaleX + offsetX, (650 - bottom * 100) * scaleY + offsetY);
    context.stroke();
};