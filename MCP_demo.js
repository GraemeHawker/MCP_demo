const el = document.getElementById("main"),
    two = new Two({
        fullscreen: true
    });

two.appendTo(el);

//wind timeseries
const onsite_data = [4.65,4.29,4.43,4.53,4.75,5.21,5.04,4.77,4.66,4.48,9.33,
  9.52,9.60,9.64,9.60,9.45,9.51,10.08,10.22,10.48,10.57,10.45,10.62,10.84,11.29,11.44,11.31,11.29,11.39,11.69,11.67,11.66,
  11.58,11.75,11.40,10.71,9.91,9.31,8.49,7.71,6.67,5.75,5.27,5.13,5.47,5.92,6.53]
const reference_data = onsite_data.map(x => x+Math.random() * 2);

const styles = {family: 'arial, sans-serif', size: 12, leading: 0, weight: 900, align: 'left'};

//math constants
const max_wind = 25;

//axis positions
//1 = on_site anemometer timeseries
//2 = reference anemometer timeseries
//3 = correlation plot
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

//convert wind timeseries to series of pixel positions for each plot
let x1s = [];
const step_1 = len_x_1  / (onsite_data.length - 1);
for (var i = 0; i < onsite_data.length; i++) {
  x1s.push(origin_x_1 + (step_1 * i));
}
const y1s = onsite_data.map(x => origin_y_1-len_y_1*x/max_wind)

let x2s = [];
const step_2 = len_x_2  / (reference_data.length - 1);
for (var i = 0; i < reference_data.length; i++) {
  x2s.push(origin_x_2 + (step_2 * i));
}
const y2s = onsite_data.map(x => origin_y_2-len_y_2*x/max_wind)

const x3s = reference_data.map(x => origin_x_3+len_x_3*x/max_wind)
const y3s = onsite_data.map(x => origin_y_3-len_y_3*x/max_wind)

//animation timings in seconds
const trace_start = 1;
const trace_end = 10;
const pixel_ms_convert = len_x_3/max_wind; //pixels per m/s


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
var trace_line_2 = two.makeLine(x3s[0], origin_y_3-len_y_3, x3s[0], origin_y_3);
trace_line_2.stroke = 'blue';
var trace_line_3 = two.makeLine(origin_x_3, y3s[0], origin_x_3+len_x_3, y3s[0]);
trace_line_3.stroke = 'red';

var i=0;
two.bind('update', function(frameCount) {
  if (frameCount%60==0 && i<onsite_data.length){
    var circle = two.makeCircle(x1s[i],y1s[i],2);
    circle.stroke = 'red';
    circle.fill = 'red';
    if (i<onsite_data.length-1) {
      var line = two.makeLine(x1s[i], y1s[i], x1s[i+1], y1s[i+1]);
    }

    var circle = two.makeCircle(x2s[i],y2s[i],2);
    circle.stroke = 'blue';
    circle.fill = 'blue';
    if (i<onsite_data.length-1) {
      var line = two.makeLine(x2s[i], y2s[i], x2s[i+1], y2s[i+1]);
    }

    trace_line_2_target = reference_data[i];

    var circle = two.makeCircle(x3s[i],y3s[i],2)
    circle.stroke = 'black';
    circle.fill = 'black';



    i++;
  }
  if (i < onsite_data.length) {
    trace_line_1.translation.set(x1s[i-1]+((frameCount%60)/60)*(x1s[i]-x1s[i-1])-origin_x_1,0)
    trace_line_2.translation.set(x3s[i-1]+((frameCount%60)/60)*(x3s[i]-x3s[i-1])-origin_x_3,0)
    trace_line_3.translation.set(0,y3s[i-1]+((frameCount%60)/60)*(y3s[i]-y3s[i-1])-origin_y_3)
  }

}).play();

//two.update();
