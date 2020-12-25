// const RandomNumberStream = require("./randomstream");
navigator.mediaDevices.getUserMedia({ audio: true }).then(
  (stream) => {
    console.log("streamer");
    soundGraph(stream);
  },
  (error) => {}
);

function soundGraph(stream) {
  audioContext = new AudioContext();
  const mediaStreamSource = audioContext.createMediaStreamSource(stream);
  analyzer = audioContext.createAnalyser();
  analyzer.smoothingTimeConstant = 0;
  mediaStreamSource.connect(analyzer); // script processor is used as an intermediary between analyzer
  analyzer.fftSize = 32;

  const canvas = document.getElementById("liveamp");
  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;

  const numX = canvas.width;
  const color = new WebGLPlotBundle.ColorRGBA(0, 0, 0, 1);
  const line = new WebGLPlotBundle.WebglLine(color, numX);
  const wglp = new WebGLPlotBundle.default(canvas);

  const dataHandler = new CircularList(numX);

  line.lineSpaceX(-1, 2 / numX);
  wglp.addLine(line);

  function newFrame() {
    update();
    wglp.update();
    requestAnimationFrame(newFrame);
  }

  requestAnimationFrame(newFrame);

  let phase = 0;

  function update() {
    const freq = 0.001;
    const amp = 1;
    const noise = 0;
    const speed = 0.01;
    phase += speed;

    for (let i = 0; i < line.numPoints; i++) {
      const ySin = dataHandler.fetch(i);
      line.setY(i, ySin * amp);
    }
  }

  setInterval(() => {
    const dataArray = new Uint8Array(analyzer.frequencyBinCount);
    analyzer.getByteFrequencyData(dataArray);
    const amp = getVolume(dataArray, analyzer.frequencyBinCount);
    dataHandler.push(amp / 500);
    console.log(amp)
  }, 20);

  // https://stackoverflow.com/questions/62083981/analysernode-getfloatfrequencydata-returns-negative-values
  function getVolume(dataArray, binCount) {
    let bufferLength = binCount;
    let totalAntilogAmplitude = 0;
    for (let i = 0; i < bufferLength; i++) {
      let thisAmp = dataArray[i]; // amplitude of current bin
      let thisAmpAntilog = Math.pow(10, thisAmp / 10); // antilog amplitude for adding
      totalAntilogAmplitude = totalAntilogAmplitude + thisAmpAntilog;
    }
    console.log(totalAntilogAmplitude, binCount)
    let amplitude = 10 * Math.log10(totalAntilogAmplitude);
    return amplitude;
  }
}
