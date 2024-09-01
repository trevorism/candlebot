let scaleX = 1, scaleY = 1;
let offsetX = 0, offsetY = 0;
let startX = 0, startY = 0;
let isPanning = false, isScalingY = false, isScalingX = false;

let valueHeight = 30;
let barWidth = 90;

const defaultWidth = 1200;
const defaultHeight = 600;
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
    yAxisRef.value.addEventListener("mouseleave", endPan);

    xAxisRef.value.addEventListener("mousedown", (event) => startScalingX(event));
    xAxisRef.value.addEventListener("mousemove", (event) => scaleXAxis(event, chartRef, yAxisContext, xAxisContext, candlesticks));
    xAxisRef.value.addEventListener("mouseup", endPan);
    xAxisRef.value.addEventListener("mouseleave", endPan);
};

export const teardownChart = (chartRef, yAxisRef, xAxisRef) => {
    chartRef.value.removeEventListener("wheel", (event) => handleWheel(event, chartRef));
    chartRef.value.removeEventListener("mousedown", (event) => startPan(event, chartRef));
    chartRef.value.removeEventListener("mousemove", (event) => pan(event, chartRef));
    chartRef.value.removeEventListener("mouseup", endPan);
    chartRef.value.removeEventListener("mouseleave", endPan);
    chartRef.value.removeEventListener("mousemove", (event) => handleMouseMove(event, chartRef));

    yAxisRef.value.removeEventListener("mousedown", (event) => startScalingY(event));
    yAxisRef.value.removeEventListener("mousemove", (event) => scaleYAxis(event, chartRef));
    yAxisRef.value.removeEventListener("mouseup", endPan);
    yAxisRef.value.removeEventListener("mouseleave", endPan);

    xAxisRef.value.removeEventListener("mousedown", (event) => startScalingX(event));
    xAxisRef.value.removeEventListener("mousemove", (event) => scaleXAxis(event, chartRef));
    xAxisRef.value.removeEventListener("mouseup", endPan);
    xAxisRef.value.removeEventListener("mouseleave", endPan);

};

export const setViewportOffsetAndScale = (candlesticks) => {
    const {minX, maxX, minY, maxY, length} = getMinMaxValues(candlesticks);

    scaleX = 1;
    scaleY = 1;

    barWidth = defaultWidth / length;
    valueHeight = defaultHeight / 1.5 / (maxY - minY);

    const minXPixel = (minX * barWidth) * scaleX;
    const minYPixel = (defaultHeight - minY * valueHeight) * scaleY;

    offsetX = -minXPixel;
    offsetY = defaultHeight - minYPixel * scaleY - 100;
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
    context.lineTo(axisOffset, defaultHeight - axisOffset);
    context.stroke();

    drawYAxisTicks(context);
    drawYAxisLabels(context);
};

const drawXAxisTicks = (context) => {
    context.beginPath();
    const tickCount = 30;
    const tickSpacing = Math.max(60, (barWidth) * scaleX + 5);

    let xAxisValue = offsetX;
    if (xAxisValue < 0) {
        xAxisValue = 0 - offsetX % tickSpacing
    }

    for (let i = 0; i < tickCount; i++) {
        context.moveTo(xAxisValue, 0);
        context.lineTo(xAxisValue, 5);
        xAxisValue += tickSpacing;
    }
    context.stroke();
};

const drawXAxisLabels = (context, candlesticks) => {
    context.font = "12px Arial";
    if (candlesticks) {
        xLabelLookup = createXLabelLookup(candlesticks);
    }

    const tickCount = 30;
    const tickSpacing = Math.max(60, (barWidth) * scaleX + 5);
    let xAxisValue = offsetX;
    if (xAxisValue < 0) {
        xAxisValue = 0 - offsetX % tickSpacing;
    }

    for (let i = 0; i < tickCount; i++) {
        const xValue = Math.round(((xAxisValue - offsetX) / scaleX) / barWidth);
        const xLabel = xLabelLookup[xValue];

        if (xLabel) {
            context.save();
            context.translate(xAxisValue - 25, 65);
            context.rotate(-Math.PI / 3);
            context.fillText(xLabel, 0, 0);
            context.restore();
        } else {
            //context.fillText(xValue, xAxisValue - 5, 20);
        }
        xAxisValue += tickSpacing;
    }
};

const drawYAxisTicks = (context) => {
    context.beginPath();
    const tickCount = 30;
    let yAxisValue = defaultHeight * scaleY + offsetY;
    if (yAxisValue > defaultHeight) {
        yAxisValue = defaultHeight - yAxisValue % tickCount
    }

    for (let i = 0; i < tickCount; i++) {
        context.moveTo(axisOffset, yAxisValue);
        context.lineTo(axisOffset - 5, yAxisValue);
        yAxisValue -= tickCount;
    }
    context.stroke();
};

const drawYAxisLabels = (context) => {
    context.font = "12px Arial";
    const tickCount = 30;
    let yAxisValue = defaultHeight * scaleY + offsetY;
    if (yAxisValue > defaultHeight) {
        yAxisValue = defaultHeight - yAxisValue % tickCount
    }

    for (let i = 0; i < tickCount; i++) {
        const yValue = Math.round((defaultHeight - ((yAxisValue - offsetY) / scaleY)) / valueHeight)
        context.fillText(yValue, 10, yAxisValue + 3);
        yAxisValue -= tickCount;
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

    context.fillRect((x * barWidth - (barWidth / 2)) * scaleX + offsetX, (defaultHeight - open * valueHeight) * scaleY + offsetY, (barWidth) * scaleX, (open * valueHeight - close * valueHeight) * scaleY);

    context.beginPath();
    context.moveTo((x * barWidth) * scaleX + offsetX, (defaultHeight - high * valueHeight) * scaleY + offsetY);
    context.lineTo((x * barWidth) * scaleX + offsetX, (defaultHeight - top * valueHeight) * scaleY + offsetY);
    context.stroke();

    context.beginPath();
    context.moveTo((x * barWidth) * scaleX + offsetX, (defaultHeight -  low * valueHeight) * scaleY + offsetY);
    context.lineTo((x * barWidth) * scaleX + offsetX, (defaultHeight -  bottom * valueHeight) * scaleY + offsetY);
    context.stroke();
};

const getMinMaxValues = (candlesticks) => {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    if (!candlesticks)
        return;

    const minVisibleX = Math.round(Math.max(0, -offsetX / scaleX / barWidth));
    const maxVisibleX = Math.round(-(offsetX - defaultWidth) / scaleX / barWidth) + minVisibleX;

    candlesticks.forEach(candle => {
        if(candle.x < minVisibleX || candle.x > maxVisibleX) {
            return;
        }
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

    drawCandlesticks(context, candlesticks);
    drawCrosshair(context, mouseX, mouseY);
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
    context.lineTo(defaultWidth, y);
    context.stroke();

    context.setLineDash([]);

    context.font = "12px Arial";
    const xValue = Math.round((((x - offsetX) / scaleX)) / barWidth);
    const yValue = Math.round((defaultHeight - ((y - offsetY) / scaleY)) / valueHeight);
    const xLabel = xLabelLookup[xValue] || xValue;

    context.fillStyle = "blue";
    context.strokeStyle = context.fillStyle;
    context.fillText(`${xLabel}`, x + 5, y + 10);
    context.fillText(`${yValue}`, x + 5, y + 20);

};