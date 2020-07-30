var el = document.getElementById("main"),
    two = new Two({
        fullscreen: true
    });

two.appendTo(el);

var onsite_data = [4.65,4.29,4.43,4.53,4.75,5.21,5.04,4.77,4.66,4.48]
var reference_data = onsite_data.map(x => x+Math.random() * 2);

var styles = {family: 'proxima-nova, sans-serif', size: 12, leading: 0, weight: 900, align: 'left'};

//timeseries axes
var origin_x_1 = 200;
var origin_y_1 = 100;
var len_x_1 = 700;
var len_y_1 = 90;

var origin_x_2 = 200;
var origin_y_2 = 300;
var len_x_2 = 700;
var len_y_2 = 90;

//correlation axes
var origin_x_3 = 300;
var origin_y_3 = 900;
var len_x_3 = 500;
var len_y_3 = 500;

//animation timings in seconds
trace_start = 1
trace_end = 10


var x_axis_1 = two.makeLine(origin_x_1, origin_y_1, origin_x_1+len_x_1, origin_y_1);
var y_axis_1 = two.makeLine(origin_x_1, origin_y_1-len_y_1, origin_x_1, origin_y_1);
var graph_label_1 = two.makeText("On-site Anemometer", origin_x_1-100, origin_y_1-len_y_1/2, styles);

var x_axis_2 = two.makeLine(origin_x_2, origin_y_2, origin_x_2+len_x_2, origin_y_2);
var y_axis_2 = two.makeLine(origin_x_2, origin_y_2-len_y_2, origin_x_2, origin_y_2);
var graph_label_2 = two.makeText("Reference Anemometer", origin_x_2-100, origin_y_2-len_y_2/2, styles);

var x_axis_3 = two.makeLine(origin_x_3, origin_y_3, origin_x_3+len_x_3, origin_y_3);
var y_axis_3 = two.makeLine(origin_x_3, origin_y_3-len_y_3, origin_x_3, origin_y_3);
var x_axis_label_3 = two.makeText("Reference Anemometer", 550, 950, styles);
var y_axis_label_3 = two.makeText("On-site Anemometer", 250, 650, styles);
y_axis_label_3.rotation = Math.PI*-0.5;

var trace_line_1 = two.makeLine(origin_x_1, origin_y_1-len_y_1, origin_x_1, origin_y_2);
trace_line_1.stroke = 'green';

var i=0;
two.bind('update', function(frameCount) {
  if (i < onsite_data.length) {
    trace_line_1.translation.set(1*frameCount/6,0);
  }
  if (frameCount%60==0 && i<onsite_data.length){
    x1 = origin_x_1+i*10;
    y1 = origin_y_1+len_y_1*(-1*onsite_data[i]/25);
    var circle = two.makeCircle(x1,y1,2);
    circle.stroke = 'red';
    circle.fill = 'red';

    x2 = origin_x_2+i*10;
    y2 = origin_y_2+len_y_2*(-1*reference_data[i]/25);
    var circle = two.makeCircle(x2,y2,2);
    circle.stroke = 'blue';
    circle.fill = 'blue';
    i++;
  }

}).play();

//two.update();
