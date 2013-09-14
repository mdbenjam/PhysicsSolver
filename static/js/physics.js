var trajectorySelected = true;
var theta = undefined;
var ballX = 200;
var ballY = 400;
var radius = 25;
var canvasHeight = 500;
var canvasWidth = 800;
var ghostBallX = -1;
var ghostBallY = -1;

function drawScene() {

    var canvas = document.getElementById("drawing");

    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);



    var drawParabola = function(slope, x, y) {
        var startingX = x;
        var startingY = y;
        var h = canvasWidth / 2;
        if (slope < 0) {
            h = 0;
        }

        if (slope === 0) {
            h = x;
            x = x + 1;
            y = y + 1;
            slope = -.0002;
        }

        var k = 0;

        var a = -slope / ( 2 * (x - h) ) 
            var b = -2 * a * h
            var c = y - (a * x * x + b * x)

            iterations = 0;
        while (y < canvasHeight && iterations < 100) {
            iterations = iterations + 1;
            x = x + 10;
            y = a * x * x + b * x + c;

            ctx.fillStyle = "#FF0000"
                ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2*Math.PI);
            ctx.stroke();
        }
        if (trajectorySelected) {
            ghostBallX = mouseX;
            if (mouseX < ballX) {
                ghostBallX = ballX;
            }
            if (Math.abs(mouseX - h) < 10) {
                ghostBallX = h;
            }
            if (Math.abs(mouseX - (2 * h - startingX)) < 10) {
                ghostBallX = (2 * h - startingX);
            }
            ctx.beginPath();
            ghostBallY = a * ghostBallX * ghostBallX + b * ghostBallX + c;
            ctx.arc(ghostBallX, ghostBallY, radius, 0, 2*Math.PI);
            ctx.stroke();
        }
    };
    if (theta != undefined) {
        drawParabola(Math.tan(theta), ballX, ballY);
    }


    ctx.fillStyle = "#000000"
        ctx.beginPath();
    ctx.arc(ballX, ballY, radius, 0, 2*Math.PI);
    ctx.stroke();

    // Angle

    if (theta != undefined) {
        ctx.font="12px Arial";
        ctx.fillText("Angle",ballX + 30, ballY - 10);

        ctx.moveTo(ballX, ballY);
        ctx.lineTo(ballX + 50, ballY);
        ctx.stroke();

        ctx.moveTo(ballX, ballY);
        ctx.lineTo(ballX + Math.cos(theta)*50, ballY - Math.sin(theta)*50);
        ctx.stroke();
    }

}

drawScene();

var mouseX = -1;
var mouseY = -1;
var freeze = false;
$("#myPopover").popover(); 

$("#angle").change(function() {
    console.log("event");
    theta = parseFloat($("#angle").val()) * Math.PI / 180; 
    console.log("theta" + theta);
    drawScene();
});

$("#drawing").mousemove(function(e) {
    if (!freeze) {
        $drawing = $(this);
        mouseX = e.pageX - $drawing.offset().left;
        mouseY = e.pageY - $drawing.offset().top;
        drawScene();
    }
});

$("#drawing").mouseout(function() {
    mouseX = -1;
    mouseY = -1;
});

// Clear highlighted region
$(".possibleHighlight").focus(function() {
    $("#highlightedRegion").css('background-color', 'white');
    $("#myPopover").popover('hide');
});

var maxRangeProblem = false;
var maxHeightProblem = false;

// Select a place in the trajectory
$("#drawing").click(function(e) {
    if (freeze) {
        freeze = false;
        $("#myPopover").popover('hide'); 
        $("#highlightedRegion").css('background-color', 'white');
        if (maxRangeProblem) {
            $("#finalYPosition").val("");
        }
        if (maxHeightProblem) {
            $("#finalYVelocity").val("");
        }
    } else {

        var h = canvasWidth / 2;
        var startingX = ballX;
        maxRangeProblem = false;
        maxHeightProblem = false;

        if (Math.abs(mouseX - h) < 10) {
            maxHeightProblem = true;
            $("#finalYVelocity").val("0");
        } else {
            if (Math.abs(mouseX - (2 * h - startingX)) < 10) {
                maxRangeProblem = true;
                $("#finalYPosition").val(0);
            } else {
                var oneSet = false
                $(".possibleHighlight").each(function (index) {
                    if ($(this).val() != "") {
                        oneSet = true;
                    }
                });
                if (!oneSet) {
                    $("#myPopover").offset({top: ghostBallY + $drawing.offset().top, left: ghostBallX + $drawing.offset().left + 20});
                    $("#highlightedRegion").css('background-color', 'yellow');
                    $("#myPopover").popover('show'); 
                }
            }
        } 
        freeze = true;
    }
});

// Send off the data to the server
$(".form-control").change(function () {
    angle = $("#angle").val();
    t = $("#time").val();
    ay = $("#gravity").val();

    v0 = $("#initialVelocity").val();
    vx0 = $("#initialXVelocity").val();
    vy0 = $("#initialYVelocity").val();

    vf = $("#finalVelocity").val();
    vyf = $("#finalYVelocity").val();

    dxf = $("#finalXPosition").val();
    dyf = $("#finalYPosition").val();

    values = {angle: angle, t: t, ay: ay, v0: v0,
        vx0: vx0, vy0: vy0, vf: vf, vyf: vyf,
    dxf: dxf, dyf: dyf, dx0: 0, dy0: 0}

    $.get("", function(values) {
    });
});
