//set up Two screen space
const el = document.getElementById("main"),
    two = new Two({
        fullscreen: true
    });

two.appendTo(el);

//wind timeseries
const onsite_data = [4.65,4.29,4.43,4.53,4.75,5.21,5.04,4.77,4.66,4.48,9.33,
  9.52,9.60,9.64,9.60,9.45,9.51,10.08,10.22,10.48,10.57,10.45,10.62,10.84,11.29,
  11.44,11.31,11.29,11.39,11.69,11.67,11.66,
  11.58,11.75,11.40,10.71,9.91,9.31,8.49,7.71,6.67,5.75,5.27,5.13,5.47,5.92,6.53]
let reference_data = onsite_data.map(x => x*0.9+(Math.random()-0.5)*2+0.3);

const styles = {family: 'arial, sans-serif', size: 18, leading: 0, weight: 900, align: 'left'};

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

const x3s = reference_data.map(x => origin_x_3+len_x_3*(x/max_wind))
const y3s = onsite_data.map(x => origin_y_3-len_y_3*x/max_wind)

//create series of OLS correlation values
let slopes = [1,1];
let intercepts = [0,0];
let r_squares = [0,0];
let newArr = reference_data.map((_, colIndex) => [Array(reference_data.length).fill(1),reference_data].map(row => row[colIndex]));
for (i=2; i<onsite_data.length; i++) {
  var model=jStat.models.ols(onsite_data.slice(0,i),newArr.slice(0,i));
  intercepts.push(model.coef[0]);
  slopes.push(model.coef[1]);
  r_squares.push(model.R2);
}

//convert slopes and intercepts to series of best-fit line coordinates
//within exact bounds of regression plot
let x4s = [origin_x_3, origin_x_3];
let y4s = [origin_y_3, origin_y_3];
let x5s = [origin_x_3+len_x_3, origin_x_3+len_x_3];
let y5s = [origin_y_3-len_y_3, origin_y_3-len_y_3];
for (i=2; i<onsite_data.length; i++) {
  if (intercepts[i]<0) {
    x4s.push(origin_x_3+len_x_3*(-1*intercepts[i]/slopes[i])/max_wind);
    y4s.push(origin_y_3);
  }
  else {
    x4s.push(origin_x_3);
    y4s.push(origin_y_3-len_y_3*intercepts[i]/max_wind);
  }
  if (slopes[i]*max_wind+intercepts[i]>max_wind) {
    x5s.push(origin_x_3+len_x_3*((max_wind-intercepts[i])/slopes[i])/max_wind);
    y5s.push(origin_y_3-len_y_3);
  }
  else {
    x5s.push(origin_x_3+len_x_3);
    y5s.push(origin_y_3-len_y_3*(slopes[i]*max_wind+intercepts[i])/max_wind);
  }
}


//animation timings in seconds
const trace_start = 1;
const trace_end = 10;
const pixel_ms_convert = len_x_3/max_wind; //pixels per m/s

//draw axes
var x_axis_1 = two.makeLine(origin_x_1, origin_y_1, origin_x_1+len_x_1, origin_y_1);
var y_axis_1 = two.makeLine(origin_x_1, origin_y_1-len_y_1, origin_x_1, origin_y_1);
var graph_label_1 = two.makeText("On-site", origin_x_1-100, origin_y_1-len_y_1/2, styles);

var x_axis_2 = two.makeLine(origin_x_2, origin_y_2, origin_x_2+len_x_2, origin_y_2);
var y_axis_2 = two.makeLine(origin_x_2, origin_y_2-len_y_2, origin_x_2, origin_y_2);
var graph_label_2 = two.makeText("Reference", origin_x_2-100, origin_y_2-len_y_2/2, styles);

var x_axis_3 = two.makeLine(origin_x_3, origin_y_3, origin_x_3+len_x_3, origin_y_3);
var y_axis_3 = two.makeLine(origin_x_3, origin_y_3-len_y_3, origin_x_3, origin_y_3);
var x_axis_label_3 = two.makeText("Reference", 550, 925, styles);
var y_axis_label_3 = two.makeText("On-site", 275, 650, styles);
y_axis_label_3.rotation = Math.PI*-0.5;

//draw trace lines (starting position on axes)
var trace_line_1 = two.makeLine(origin_x_1, origin_y_1-len_y_1, origin_x_1, origin_y_2);
trace_line_1.stroke = 'green';
var trace_line_2 = two.makeLine(origin_x_3, origin_y_3-len_y_3, origin_x_3, origin_y_3);
trace_line_2.stroke = 'blue';
var trace_line_3 = two.makeLine(origin_x_3, origin_y_3, origin_x_3+len_x_3, origin_y_3);
trace_line_3.stroke = 'red';

var i=0;
let bestfit_line = two.makeLine(x4s[i],y4s[i],x5s[i],y5s[i]);
let ols_text = two.makeText("y=", 550, 975, styles);
let r_square_text = two.makeText("R²=", 550, 1000, styles);
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

    bestfit_line.visible = false;
    ols_text.visible = false;
    r_square_text.visible = false;
    bestfit_line = two.makeLine(x4s[i],y4s[i],x5s[i],y5s[i]);
    ols_text = two.makeText("y="+slopes[i].toFixed(3)+"x+"+intercepts[i].toFixed(3), 550, 975, styles);
    r_square_text = two.makeText("R²="+r_squares[i].toFixed(3), 550, 1000, styles);

    i++;
  }
  if (i < onsite_data.length) {
    trace_line_1.translation.set(x1s[i-1]+((frameCount%60)/60)*(x1s[i]-x1s[i-1])-origin_x_1,0)
    trace_line_2.translation.set(x3s[i-1]+((frameCount%60)/60)*(x3s[i]-x3s[i-1])-origin_x_3,0)
    trace_line_3.translation.set(0,y3s[i-1]+((frameCount%60)/60)*(y3s[i]-y3s[i-1])-origin_y_3)
  }

}).play();
