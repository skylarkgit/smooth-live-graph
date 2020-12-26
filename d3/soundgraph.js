navigator.mediaDevices.getUserMedia({ audio: true }).then(
  (stream) => {
    console.log("streamer");
    soundGraph(stream);
  },
  (error) => {
    console.log("streamer fail");
  }
);

function soundGraph(stream) {
  var width = window.innerWidth - 100;
  var height = 300;
  var limit = 60 * 1,
    duration = 750,
    now = new Date(Date.now() - duration);

  const ampSpan = document.getElementById("amp");

  var x = d3
    .scaleTime()
    .domain([now - (limit - 2), now - duration])
    .range([0, width]);

  var y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

  var line = d3
    .line()
    .curve(d3.curveBasis)
    .x(function (d, i) {
      return x(now - (limit - 1 - i) * duration);
    })
    .y(function (d) {
      return y(d);
    });

  const graphSVG = d3
    .select("#soundgraph")
    .append("svg")
    .attr("width", width)
    .attr("height", "200px");
  const ampData = d3.range(200);
  const path = graphSVG
    .append("g")
    .append("path")
    .data([ampData])
    .attr("class", "output group")
    .style("stroke", "blue");

  path.attr("d", line);

  const soundProps = new SoundProps(stream).init();
  const intv = setInterval(() => {
    const amp = soundProps.getVolume();
    ampSpan.innerHTML = amp;
    ampData.push(amp);
  }, 1000);

  setTimeout(() => clearInterval(intv), 200000);
}
