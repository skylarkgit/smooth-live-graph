// const RandomNumberStream = require("./randomstream");
navigator.mediaDevices.getUserMedia({ audio: true }).then(
  (stream) => {
    console.log("streamer");
    soundGraph(stream);
  },
  (error) => {}
);

function soundGraph(stream) {
  const soundProps = new SoundProps(stream).init();

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
    const amp = soundProps.getVolume();
    dataHandler.push((amp - 50)/ 150);
  }, 100);
}
