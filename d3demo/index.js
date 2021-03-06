(function () {
  const height = 300;
  const width = window.innerWidth - 100;
  const data = [];
  const range = width / 30;
  const duration = 100;

  const svg = d3
    .select("#d3-c")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  let i = 0;

  const d3data = d3.range(range).map(function () {
    return 0;
  });
  const pathGroup = svg.append("g");
  const path = pathGroup
    .append("path")
    .style("stroke", "blue")
    .data([d3data]);

  const xScale = d3.scaleLinear().domain([0, range]).range([0, width]);
  const yScale = d3.scaleLinear().domain([0, height]).range([height, 0]);
  // Adding data to path
  const line = d3
    .line()
    .curve(d3.curveBasis)
    .x(function (d, i) {
      return xScale(i);
    })
    .y(function (d) {
      return yScale(d);
    });
  path.attr("d", line);

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  let prevLine = line(d3data);

  function reticker() {
    
    // Updating the data
    d3data.push(randomIntFromInterval(0, height));
    const newLine = line(d3data);

    // Redrawing the line
    path.attr("d", line);

    // Moving the graph
    path
      .attr("transform", null)
      .transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .attr("transform", "translate(" + xScale(-1) + ")")
      .on("end", reticker);
    prevLine = newLine;
    d3data.shift();
  }

  reticker();
})();
