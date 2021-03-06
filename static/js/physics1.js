var trajectorySelected = true;
var theta = undefined;
var ballX = 200;
var ballY = 400;
var radius = 25;
var canvasHeight = 500;
var canvasWidth = 800;
var ghostBallX = -1;
var ghostBallY = -1;

var inputedCells = {'angle': false, 't': false, 'ay': false, 'v0': false,
    'vx0': false, 'vy0': false, 'vf': false, 'vyf': false,
    'dxf': false, 'dyf': false};

var cellNames = ['angle', 't', 'ay', 'v0', 'vx0', 'vy0', 'vf', 'vyf',
    'dxf', 'dyf'];

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

        var a = -slope / (2 * (x - h)); 
        var b = -2 * a * h;
        var c = y - (a * x * x + b * x);

        iterations = 0;
        while (y < canvasHeight && iterations < 100) {
            iterations = iterations + 1;
            x = x + 10;
            y = a * x * x + b * x + c;

            ctx.fillStyle = "#FF0000";
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2*Math.PI);
            ctx.stroke();
        }
        if (trajectorySelected) {
            ghostBallX = mouseX;
            if (mouseX < ballX) {
                ghostBallX = ballX;
            }
            if (Math.abs(mouseX - h) < 20) {
                ghostBallX = h;
            }
            if (Math.abs(mouseX - (2 * h - startingX)) < 20) {
                ghostBallX = (2 * h - startingX);
            }
            ctx.beginPath();
            ghostBallY = a * ghostBallX * ghostBallX + b * ghostBallX + c;
            ctx.arc(ghostBallX, ghostBallY, radius, 0, 2*Math.PI);
            ctx.stroke();
        }
    };

    var drawParabola2 = function(x1, y1, x2, y2) {
        var h = canvasWidth / 2;

        var x3 = (x1 + x2)/2;
        var y3 = 0;

        var a = ((y2 - y1)/(x2 - x1) - (y3 - y2)/(x3 - x2))/(x1-x3);
        var b = (y3 - y2)/(x3-x2) - a * (x3 + x2)
        var c = y1 - a * x1 * x1 - b * x1;
        var x = x1;
        var y = 0;
        console.log("a, b, c: " + a + " " + b + " " + c);

        iterations = 0;
        while (y < canvasHeight && iterations < 100) {
            iterations = iterations + 1;
            x = x + 10;
            y = a * x * x + b * x + c;

            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2*Math.PI);
            ctx.stroke();
        }
        ghostBallX = x2;
        if (mouseX < ballX) {
            ghostBallX = ballX;
        }

        ghostBallY = y2;
        if (Math.abs(ghostBallY - (y1)) < 20) {
            ghostBallY = y1;
        }
        ctx.beginPath();
        ctx.arc(ghostBallX, ghostBallY, radius, 0, 2*Math.PI);
        ctx.stroke();
    };
    if (theta != undefined) {
        drawParabola(Math.tan(theta), ballX, ballY);
    } else {
        drawParabola2(ballX, ballY, mouseX, mouseY);
    }


    ctx.fillStyle = "#000000";
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
    theta = parseFloat($("#angle").val()); 
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
            $("#dyf").val("");
        }
        if (maxHeightProblem) {
            $("#vyf").val("");
        }
    } else {

        var h = canvasWidth / 2;
        var startingX = ballX;
        maxRangeProblem = false;
        maxHeightProblem = false;

        if (Math.abs(mouseX - h) < 20) {
            maxHeightProblem = true;
            $("#vyf").val("0");
        } else {
            var isANumber = isNumber($("#angle").val());
            if ((isANumber && Math.abs(mouseX - (2 * h - startingX)) < 20) || (!isANumber && Math.abs(mouseY - ballY) < 20)) {
                maxRangeProblem = true;
                $("#dyf").val("0");
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
    angle = $("#angle").val();
    t = $("#t").val();
    ay = $("#ay").val();

    v0 = $("#v0").val();
    vx0 = $("#vx0").val();
    vy0 = $("#vy0").val();

    vf = $("#vf").val();
    vyf = $("#vyf").val();

    dxf = $("#dxf").val();
    dyf = $("#dyf").val();
    if (isNumber(v0)) {
        $("#vx0").val(Math.cos(angle) * v0);
        $("#vy0").val(Math.sin(angle) * v0);
    }
    if (isNumber(dyf)) {
        t = (-vy0 - Math.sqrt(vy0*vy0 + 2 * ay * dyf)) / ay;
        dxf = t * vx0;
        console.log(vy0);
        console.log(Math.sqrt(vy0*vy0 + 2 * ay * dyf));
        console.log(t);
        vyf = parseFloat(vy0) + t *parseFloat(ay);
        vxf = vx0;
        vf = Math.sqrt(vyf * vyf + vxf * vxf);
        $("#t").val(t);
        $("#dxf").val(dxf);
        $("#vyf").val(vyf);
        $("#vf").val(vf);
    }
    }
});

function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
}

// Send off the data to the server
$(".form-control").change(function () {
    if (isNumber($(this).val())) {
        inputedCells[$(this).attr('id')] = true;
    } else {
        isNumber($(this).val(''));
        inputedCells[$(this).attr('id')] = false;
    }

    angle = $("#angle").val();
    t = $("#t").val();
    ay = $("#ay").val();

    v0 = $("#v0").val();
    vx0 = $("#vx0").val();
    vy0 = $("#vy0").val();

    vf = $("#vf").val();
    vyf = $("#vyf").val();

    dxf = $("#dxf").val();
    dyf = $("#dyf").val();

    values = {
        angle: angle,
        t: t,
        ay: ay,
        v0: v0,
        vx0: vx0,
        vy0: vy0,
        vf: vf,
        vyf: vyf,
        dxf: dxf,
        dyf: dyf,
        dx0: 0,
        dy0: 0
    };
    $.get("/physics.json", values, function(returned) {
        jsonReturned = JSON.parse(returned);
        /*$.each(cellNames, function(index, cell) {
            $('#'+cell).val(jsonReturned[cell]);
        });*/
        

    });

    if (isNumber(v0)) {
        $("#vx0").val(Math.cos(angle) * v0);
        $("#vy0").val(Math.sin(angle) * v0);
    }
    if (isNumber(dyf)) {
        t = (-vy0 - Math.sqrt(vy0*vy0 + 2 * ay * dyf)) / ay;
        dxf = t * vx0;
        console.log(vy0);
        console.log(Math.sqrt(vy0*vy0 + 2 * ay * dyf));
        console.log(t);
        vyf = parseFloat(vy0) + t *parseFloat(ay);
        vxf = vx0;
        vf = Math.sqrt(vyf * vyf + vxf * vxf);
        $("#t").val(t);
        $("#dxf").val(dxf);
        $("#vyf").val(vyf);
        $("#vf").val(vf);
    }

    $.each(cellNames, function(index, cell) {
        if (!inputedCells[cell]) {
            if (isNumber($('#'+cell).val())){
                //$('#'+cell).attr('disabled', 'disabled');
            } else {
                //$('#'+cell).attr('disabled', 'enabled');
            }
        }
    });
});


