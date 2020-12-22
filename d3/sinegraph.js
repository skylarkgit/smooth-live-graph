(function () {
  var limit = 60 * 1,
    duration = 750,
    now = new Date(Date.now() - duration);

  var width = window.innerWidth - 100;
  var height = 250;

  var marker = {
    value: 0,
    color: "orange",
    data: d3.range(limit).map(function () {
      return 0;
    }),
  };

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

  var svg = d3
    .select("#sinegraph")
    .append("svg")
    .attr("class", "chart")
    .attr("width", width)
    .attr("height", height + 50);

  var axis = svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call((x.axis = d3.axisBottom(x)));

  var paths = svg.append("g");

  marker.path = paths
    .append("path")
    .data([marker.data])
    .attr("class", "output group")
    .style("stroke", marker.color);

  let phase = 0;
  function tick() {
    now = new Date();
    const freq = 0.001;
    const amp = 100;
    const speed = 0.01;
    phase += speed;

    marker.data.push(20 + amp * Math.sin(phase));
    marker.path.attr("d", line);

    // Shift domain
    x.domain([now - (limit - 2) * duration, now - duration]);

    // Slide x-axis left
    axis.transition().duration(duration).ease(d3.easeLinear).call(x.axis);

    // Slide paths left
    paths
      .attr("transform", null)
      .transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .attr("transform", "translate(" + x(now - (limit - 1) * duration) + ")")
      .on("end", tick);

    // Remove oldest data point from each group
    marker.data.shift();
  }

  tick();
})();
