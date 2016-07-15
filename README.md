# HTML5-Canvas
Canvas experiments

<html>
<head>

</head>
<div id="canvasdiv" style="width: 100%; height: 100%; overflow: hidden;">
    <canvas id="canvas" width="10000" height="900" style="border:1px solid red"></canvas>
</div>
<script>
var width  = 10000;
var height = 900;

var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

for (var i = 0; i < 100; i++) {
    
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    
    context.moveTo(x,y);
    context.beginPath();
    context.arc(Math.random() * width, Math.random() * height, 20.0, 0, 2 * Math.PI, false);
    context.stroke();
} 

var t0 = window.performance.now();
setInterval(function(){
    canvas.style.marginLeft = -(window.performance.now() - t0)/15 + "px";
}, 15);

</script>
</html>
