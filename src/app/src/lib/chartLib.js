let scaleX = 1, scaleY = 1;
let isPanning = false, isScalingY = false;
let startX = 0, startY = 0;
let offsetX = 0, offsetY = 0;

let defaultValueHeight = 30;
let defaultBarWidth = 90;

const defaultWidth = 1250;
const defaultHeight = 650;
const axisOffset = 50;

export const drawAll = (context, candlesticks) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    drawAxisOnChart(context);
    drawCandlesticks(context, candlesticks);
};

const drawCandlesticks = (context, candlesticks) => {
    if(!candlesticks)
        return;

    candlesticks.forEach(candle => {
        drawCandlestick(context, candle.open, candle.high, candle.low, candle.close, candle.x);
    });
};

// Add function to draw the crosshair
const drawCrosshair = (context, x, y) => {
    context.strokeStyle = 'black';
    context.setLineDash([5, 5]);

    // Draw vertical line
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, defaultHeight - axisOffset);
    context.stroke();

    // Draw horizontal line
    context.beginPath();
    context.moveTo(axisOffset, y);
    context.lineTo(defaultWidth - axisOffset, y);
    context.stroke();

    context.setLineDash([]);

    context.font = "12px Arial";
    const xValue = Math.round((((x - offsetX) / scaleX) - axisOffset  ) / defaultBarWidth);
    const yValue = Math.round((defaultHeight - axisOffset - ((y - offsetY) / scaleY)) / defaultValueHeight);

    context.fillStyle = "blue";
    context.strokeStyle = context.fillStyle;
    context.fillText(`X': ${xValue}`, x + 5, y + 10);
    context.fillText(`Y': ${yValue}`, x + 5, y + 20);
    context.fillText(`OffsetX': ${offsetX}`, x + 5, y + 30);
    context.fillText(`OffsetY: ${offsetY}`, x + 5, y + 40);
    context.fillText(`ScaleX': ${scaleX}`, x + 5, y + 50);
    context.fillText(`Scaley: ${scaleY}`, x + 5, y + 60);
};


const getMinMaxValues = (candlesticks) => {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    if(!candlesticks)
        return;

    candlesticks.forEach(candle => {
        if (candle.x < minX) minX = candle.x;
        if (candle.x > maxX) maxX = candle.x;
        if (candle.low < minY) minY = candle.low;
        if (candle.high > maxY) maxY = candle.high;
    });

    const length = candlesticks.length;
    return { minX, maxX, minY, maxY, length };
};

const handleWheel = (event, chartRef, candlesticks) => {
    event.preventDefault();
    const oldScaleX = scaleX;
    if (event.deltaY < 0) {
        scaleX *= 1.1; // Zoom in X
    } else {
        scaleX /= 1.1; // Zoom out X
    }
    const mouseX = event.clientX - chartRef.value.getBoundingClientRect().left;
    offsetX = mouseX - ((mouseX - offsetX) * (scaleX / oldScaleX));
    const context = chartRef.value.getContext("2d");
    drawAll(context, candlesticks);
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

const pan = (event, chartRef, candlesticks) => {
    if (isPanning) {
        offsetX = event.clientX - startX;
        offsetY = event.clientY - startY;
    } else if (isScalingY) {
        const deltaY = event.clientY - startY;
        const normalizedDeltaY = deltaY > 0 ? 1 : -1;
        scaleY += normalizedDeltaY * 0.004; // Adjust the scaling factor as needed
        startY = event.clientY;
    }
    const context = chartRef.value.getContext("2d");
    drawAll(context, candlesticks);
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

    drawCrosshair(canvas.getContext("2d"), mouseX, mouseY);

    if (mouseX < 50) {
        canvas.style.cursor = 'ns-resize';
    } else {
        canvas.style.cursor = 'default';
    }
};

export const setupChart = (chartRef, candlesticks) => {
    const context = chartRef.value.getContext("2d");
    const { minX, maxX, minY, maxY, length } = getMinMaxValues(candlesticks);

    setViewportOffsetAndScale(minX, maxX, minY, maxY, length);

    drawAll(context, candlesticks);
    chartRef.value.addEventListener("wheel", (event) => handleWheel(event, chartRef, candlesticks));
    chartRef.value.addEventListener("mousedown", (event) => startPan(event, chartRef));
    chartRef.value.addEventListener("mousemove", (event) => pan(event, chartRef, candlesticks));
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

const setViewportOffsetAndScale = (minX, maxX, minY, maxY, length) => {
    defaultBarWidth = defaultWidth / 2 / length;
    defaultValueHeight = defaultHeight / 2 / (maxY - minY);

    //convert to Pixels
    const minXPixel = (axisOffset + minX * defaultBarWidth) * scaleX;
    const maxXPixel = (axisOffset + maxX * defaultBarWidth) * scaleX;
    const minYPixel = (defaultHeight - axisOffset - minY * defaultValueHeight) * scaleY;
    const maxYPixel = (defaultHeight - axisOffset - maxY * defaultValueHeight) * scaleY;

    console.log(minX, maxX, minY, maxY);
    console.log(minXPixel, maxXPixel, minYPixel, maxYPixel);

    offsetX = minXPixel * scaleX * -1 + 200;
    offsetY = defaultHeight - minYPixel * scaleY - 200;
}

const drawAxisOnChart = (context) => {
    context.fillStyle = "black";
    context.strokeStyle = context.fillStyle;
    context.beginPath();
    context.moveTo(axisOffset, 0);
    context.lineTo(axisOffset, defaultHeight - 50);
    context.lineTo(defaultWidth, defaultHeight - 50);
    context.stroke();

    drawXAxisTicks(context);
    drawXAxisLabels(context);
    drawYAxisTicks(context);
    drawYAxisLabels(context);
};

const drawXAxisTicks = (context) => {
    context.beginPath();
    for (let i = 0; i < 50; i++) {
        const xAxisValue = (axisOffset + i * defaultBarWidth) * scaleX + offsetX;
        if(xAxisValue < 50 || xAxisValue > defaultWidth) {
            continue;
        }

        context.moveTo(xAxisValue, defaultHeight - axisOffset);
        context.lineTo(xAxisValue, defaultHeight - axisOffset - 5);
    }
    context.stroke();
};

const drawXAxisLabels = (context) => {
    context.font = "20px Arial";
    for (let i = 0; i < 50; i++) {
        const xAxisValue = (axisOffset - 6 + i * defaultBarWidth) * scaleX + offsetX;
        if(xAxisValue < axisOffset || xAxisValue > (defaultWidth - axisOffset)) {
            continue;
        }
        context.fillText(i, xAxisValue, defaultHeight - axisOffset + 20);
    }
};

const drawYAxisTicks = (context) => {
    context.beginPath();
    const tickCount = Math.round(30 / scaleY);
    for (let i = 0; i < tickCount; i++) {
        const yAxisValue = (defaultHeight - axisOffset - i * 30) * scaleY + offsetY;


        context.moveTo(axisOffset, yAxisValue);
        context.lineTo(axisOffset + 5, (defaultHeight - axisOffset - i * 30) * scaleY + offsetY);
    }
    context.stroke();
};

const drawYAxisLabels = (context) => {
    context.font = "20px Arial";
    for (let i = 0; i < 30; i++) {
        const yAxisValue = (defaultHeight - axisOffset + 5 - i * 30) * scaleY + offsetY;
        if(yAxisValue < 0 || yAxisValue > defaultHeight - axisOffset) {
            continue;
        }
        context.fillText(i, 20, yAxisValue);
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
    context.fillRect((axisOffset + x * defaultBarWidth - (defaultBarWidth / 2 - 1)) * scaleX + offsetX, (defaultHeight - axisOffset - open * defaultValueHeight) * scaleY + offsetY, (defaultBarWidth - 2) * scaleX, (open * defaultValueHeight - close * defaultValueHeight) * scaleY);

    // Draw the wicks
    context.beginPath();
    context.moveTo((axisOffset + x * defaultBarWidth) * scaleX + offsetX, (defaultHeight - axisOffset - high * defaultValueHeight) * scaleY + offsetY);
    context.lineTo((axisOffset + x * defaultBarWidth) * scaleX + offsetX, (defaultHeight - axisOffset - top * defaultValueHeight) * scaleY + offsetY);
    context.stroke();

    context.beginPath();
    context.moveTo((axisOffset + x * defaultBarWidth) * scaleX + offsetX, (defaultHeight - axisOffset - low * defaultValueHeight) * scaleY + offsetY);
    context.lineTo((axisOffset + x * defaultBarWidth) * scaleX + offsetX, (defaultHeight - axisOffset - bottom * defaultValueHeight) * scaleY + offsetY);
    context.stroke();
};