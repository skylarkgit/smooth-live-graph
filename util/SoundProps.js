class SoundProps {
  constructor(stream) {
    this.stream = stream;
  }

  init() {
    this.audioContext = new AudioContext();
    const mediaStreamSource = this.audioContext.createMediaStreamSource(this.stream);
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.smoothingTimeConstant = 0;
    mediaStreamSource.connect(this.analyzer); // script processor is used as an intermediary between analyzer
    this.analyzer.fftSize = 128;
    return this;
  }

  getVolume() {
    let bufferLength = this.analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyzer.getByteFrequencyData(dataArray);
    let amplitude = dataArray.map(x => x).reduce((a, b) => a + b, 0) / bufferLength;
    return amplitude;
  }
}
