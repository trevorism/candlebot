let scaleX = 1, scaleY = 1;
let isPanning = false, isScalingY = false, isScalingX = false;
let startX = 0, startY = 0;
let offsetX = 0, offsetY = 0;

let defaultValueHeight = 30;
let defaultBarWidth = 90;

const defaultWidth = 1200;
const defaultHeight = 650;
const axisOffset = 50;

let xLabelLookup = {};

export const setupChart = (chartRef, yAxisRef, xAxisRef, candlesticks) => {
    const context = chartRef.value.getContext("2d");
    const yAxisContext = yAxisRef.value.getContext("2d");
    const xAxisContext = xAxisRef.value.getContext("2d");

    yAxisRef.value.style.cursor = "ns-resize";
    xAxisRef.value.style.cursor = "ew-resize";

    setViewportOffsetAndScale(candlesticks);
    drawAll(context, yAxisContext, xAxisContext, candlesticks);

    chartRef.value.addEventListener("wheel", (event) => handleWheel(event, chartRef, yAxisContext, xAxisContext, candlesticks));
    chartRef.value.addEventListener("mousedown", (event) => startPan(event));
    chartRef.value.addEventListener("mousemove", (event) => pan(event, chartRef, yAxisContext, xAxisContext, candlesticks));
    chartRef.value.addEventListener("mouseup", endPan);
    chartRef.value.addEventListener("mouseleave", endPan);
    chartRef.value.addEventListener("mousemove", (event) => handleMouseMove(event, chartRef, candlesticks));

    yAxisRef.value.addEventListener("mousedown", (event) => startScalingY(event));
    yAxisRef.value.addEventListener("mousemove", (event) => scaleYAxis(event, chartRef, yAxisContext, xAxisContext, candlesticks));
    yAxisRef.value.addEventListener("mouseup", endPan);

    xAxisRef.value.addEventListener("mousedown", (event) => startScalingX(event));
    xAxisRef.value.addEventListener("mousemove", (event) => scaleXAxis(event, chartRef, yAxisContext, xAxisContext, candlesticks));
    xAxisRef.value.addEventListener("mouseup", endPan);

};

export const teardownChart = (chartRef) => {
    chartRef.value.removeEventListener("wheel", (event) => handleWheel(event, chartRef));
    chartRef.value.removeEventListener("mousedown", (event) => startPan(event, chartRef));
    chartRef.value.removeEventListener("mousemove", (event) => pan(event, chartRef));
    chartRef.value.removeEventListener("mouseup", endPan);
    chartRef.value.removeEventListener("mouseleave", endPan);
    chartRef.value.removeEventListener("mousemove", (event) => handleMouseMove(event, chartRef));
};

export const setViewportOffsetAndScale = (candlesticks) => {
    const {minX, maxX, minY, maxY, length} = getMinMaxValues(candlesticks);
    defaultBarWidth = defaultWidth / 2 / length;
    defaultValueHeight = defaultHeight / 2 / (maxY - minY);

    const minXPixel = (minX * defaultBarWidth) * scaleX;
    const minYPixel = (defaultHeight - minY * defaultValueHeight) * scaleY;

    offsetX = -minXPixel + 300;
    offsetY = defaultHeight - minYPixel * scaleY - 200;
    scaleX = 1;
    scaleY = 1;
}

export const drawAll = (context, yAxisContext, xAxisContext, candlesticks) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    yAxisContext.clearRect(0, 0, yAxisContext.canvas.width, yAxisContext.canvas.height);
    xAxisContext.clearRect(0, 0, xAxisContext.canvas.width, xAxisContext.canvas.height);

    drawXAxisOnChart(xAxisContext, candlesticks);
    drawYAxisOnChart(yAxisContext, candlesticks);
    drawCandlesticks(context, candlesticks);
};

const drawCandlesticks = (context, candlesticks) => {
    if (!candlesticks)
        return;

    candlesticks.forEach(candle => {
        drawCandlestick(context, candle.open, candle.high, candle.low, candle.close, candle.x);
    });
};

const drawXAxisOnChart = (context, candlesticks) => {
    context.fillStyle = "black";
    context.strokeStyle = context.fillStyle;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(defaultWidth, 0);
    context.stroke();

    drawXAxisTicks(context);
    drawXAxisLabels(context, candlesticks);
}

const drawYAxisOnChart = (context, candlesticks) => {
    context.fillStyle = "black";
    context.strokeStyle = context.fillStyle;
    context.beginPath();
    context.moveTo(axisOffset, 0);
    context.lineTo(axisOffset, defaultHeight - 50);
    context.stroke();

    drawYAxisTicks(context);
    drawYAxisLabels(context);
};

const drawXAxisTicks = (context) => {
    context.beginPath();
    const tickCount = 30;
    let xAxisValue = offsetX;
    if (xAxisValue < 0) {
        xAxisValue = 0 - offsetX % 60
    }

    for (let i = 0; i < tickCount; i++) {
        context.moveTo(xAxisValue, 0);
        context.lineTo(xAxisValue, 5);
        xAxisValue += 60;
    }
    context.stroke();
};

const drawXAxisLabels = (context, candlesticks) => {
    context.font = "12px Arial";
    if (candlesticks) {
        xLabelLookup = createXLabelLookup(candlesticks);
    }

    const tickCount = 30;
    let xAxisValue = offsetX;
    if (xAxisValue < 0) {
        xAxisValue = 0 - offsetX % 60;
    }

    for (let i = 0; i < tickCount; i++) {
        const xValue = Math.round(((xAxisValue - offsetX) / scaleX) / defaultBarWidth);
        const xLabel = xLabelLookup[xValue];

        if (xLabel) {
            context.save();
            context.translate(xAxisValue - 25, 60);
            context.rotate(-Math.PI / 3);
            context.fillText(xLabel, 0, 0);
            context.restore();
        } else {
            //context.fillText(xValue, xAxisValue - 5, 20);
        }
        xAxisValue += 60;
    }
};

const drawYAxisTicks = (context) => {
    context.beginPath();
    const tickCount = 30;
    let yAxisValue = defaultHeight * scaleY + offsetY;
    if (yAxisValue > 600) {
        yAxisValue = 600 - yAxisValue % 30
    }

    for (let i = 0; i < tickCount; i++) {
        context.moveTo(axisOffset, yAxisValue);
        context.lineTo(axisOffset - 5, yAxisValue);
        yAxisValue -= 30;
    }
    context.stroke();
};

const drawYAxisLabels = (context) => {
    context.font = "12px Arial";
    const tickCount = 30;
    let yAxisValue = defaultHeight * scaleY + offsetY;
    if (yAxisValue > 600) {
        yAxisValue = 600 - yAxisValue % 30
    }

    for (let i = 0; i < tickCount; i++) {
        const yValue = Math.round((defaultHeight - ((yAxisValue - offsetY) / scaleY)) / defaultValueHeight)
        context.fillText(yValue, 10, yAxisValue + 3);
        yAxisValue -= 30;
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

    context.fillRect((x * defaultBarWidth - (defaultBarWidth / 2)) * scaleX + offsetX, (defaultHeight - open * defaultValueHeight) * scaleY + offsetY, (defaultBarWidth) * scaleX, (open * defaultValueHeight - close * defaultValueHeight) * scaleY);

    context.beginPath();
    context.moveTo((x * defaultBarWidth) * scaleX + offsetX, (defaultHeight - high * defaultValueHeight) * scaleY + offsetY);
    context.lineTo((x * defaultBarWidth) * scaleX + offsetX, (defaultHeight - top * defaultValueHeight) * scaleY + offsetY);
    context.stroke();

    context.beginPath();
    context.moveTo((x * defaultBarWidth) * scaleX + offsetX, (defaultHeight -  low * defaultValueHeight) * scaleY + offsetY);
    context.lineTo((x * defaultBarWidth) * scaleX + offsetX, (defaultHeight -  bottom * defaultValueHeight) * scaleY + offsetY);
    context.stroke();
};

const getMinMaxValues = (candlesticks) => {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    if (!candlesticks)
        return;

    candlesticks.forEach(candle => {
        if (candle.x < minX) minX = candle.x;
        if (candle.x > maxX) maxX = candle.x;
        if (candle.low < minY) minY = candle.low;
        if (candle.high > maxY) maxY = candle.high;
    });

    const length = maxX - minX;
    return {minX, maxX, minY, maxY, length};
};

export const createXLabelLookup = (candlesticks) => {
    const lookup = {};
    candlesticks.forEach(candle => {
        if (candle.label) {
            let xLabel = candle.label;
            if (!isNaN(xLabel) && !isNaN(parseInt(xLabel))) {
                const date = new Date(parseInt(xLabel));
                xLabel = date.toISOString().split('T')[0]; // Format to yyyy-mm-dd
            }
            lookup[candle.x] = xLabel;
        }
    });
    return lookup;
};

const handleWheel = (event, chartRef, yAxisContext, xAxisContext, candlesticks) => {
    event.preventDefault();
    const minScaleX = 0.1;
    const oldScaleX = scaleX;
    if (event.deltaY < 0) {
        scaleX *= 1.1;
    } else {
        scaleX /= 1.1;
    }
    scaleX = Math.max(minScaleX, scaleX);
    const mouseX = event.clientX - chartRef.value.getBoundingClientRect().left;
    offsetX = mouseX - ((mouseX - offsetX) * (scaleX / oldScaleX));
    const context = chartRef.value.getContext("2d");
    drawAll(context, yAxisContext, xAxisContext, candlesticks);
};

const startPan = (event) => {
    isPanning = true;
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;
};

const startScalingY = (event) => {
    isScalingY = true;
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;
};

const startScalingX = (event) => {
    isScalingX = true;
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;
};

const pan = (event, chartRef, yAxisContext, xAxisContext, candlesticks) => {
    if (!isPanning) {
        return;
    }

    offsetX = event.clientX - startX;
    offsetY = event.clientY - startY;
    const context = chartRef.value.getContext("2d");
    drawAll(context, yAxisContext, xAxisContext, candlesticks);
};

const scaleYAxis = (event, chartRef, yAxisContext, xAxisContext, candlesticks) => {
    if(!isScalingY) {
        return;
    }
    const minScaleY = 0.1;
    const deltaY = event.clientY - startY;
    const normalizedDeltaY = deltaY > 0 ? -1 : 1;
    const oldScaleY = scaleY;
    scaleY += normalizedDeltaY * 0.04;
    scaleY = Math.max(minScaleY, scaleY);
    const mouseY = event.clientY - chartRef.value.getBoundingClientRect().top;
    offsetY = mouseY - ((mouseY - offsetY) * (scaleY / oldScaleY));
    startY = event.clientY;

    const context = chartRef.value.getContext("2d");
    drawAll(context, yAxisContext, xAxisContext, candlesticks);
}

const scaleXAxis = (event, chartRef, yAxisContext, xAxisContext, candlesticks) => {
    if(!isScalingX) {
        return;
    }
    const minScaleX = 0.1;
    const deltaX = event.clientX - startX;
    const normalizedDeltaX = deltaX > 0 ? -1 : 1;
    const oldScaleX = scaleX;
    scaleX += normalizedDeltaX * 0.04;
    scaleX = Math.max(minScaleX, scaleX);
    const mouseX = event.clientX - chartRef.value.getBoundingClientRect().left;
    offsetX = mouseX - ((mouseX - offsetX) * (scaleX / oldScaleX));
    startX = event.clientX;

    const context = chartRef.value.getContext("2d");
    drawAll(context, yAxisContext, xAxisContext, candlesticks);
}

const endPan = () => {
    isPanning = false;
    isScalingY = false;
    isScalingX = false;
};

const handleMouseMove = (event, chartRef, candlesticks) => {
    const canvas = chartRef.value;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawCrosshair(context, mouseX, mouseY);
    drawCandlesticks(context, candlesticks);
};

const drawCrosshair = (context, x, y) => {
    context.strokeStyle = 'black';
    context.setLineDash([5, 5]);

    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, defaultHeight);
    context.stroke();

    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(1200, y);
    context.stroke();

    context.setLineDash([]);

    context.font = "12px Arial";
    const xValue = Math.round((((x - offsetX) / scaleX)) / defaultBarWidth);
    const yValue = Math.round((defaultHeight - ((y - offsetY) / scaleY)) / defaultValueHeight);
    const xLabel = xLabelLookup[xValue] || xValue;

    context.fillStyle = "blue";
    context.strokeStyle = context.fillStyle;
    context.fillText(`X': ${xLabel}`, x + 5, y + 10);
    context.fillText(`Y': ${yValue}`, x + 5, y + 20);
};