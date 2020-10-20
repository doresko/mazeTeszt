var grid = [];
var graph = {};
var width = 50;

function main(){
    n = document.getElementById("n").value;
    m = document.getElementById("m").value;
    document.getElementById('myCanvas').width = n*width;
    document.getElementById('myCanvas').height = m*width;

    if(n == "" || m == ""){
        console.log("Ne hagyj input mezőt üresen!")
    }
    else{
        drawGrid(n, m);
        buildMaze(0, 0);
        drawRectangle(2, 2, width -4, width -4, 1, "#deb887");
        drawRectangle((n-1)*width+2, (m-1)*width+2, width -4, width -4, 1, "#dc143c");
        solveMaze(0, 0, (n-1)*width, (m-1)*width);
    }
}

//Ezt a kódrészletet átvettem, arra szolgál, hogy ellerőrizze,
//hogy eleme-e egy tömb egy nagyobb tömbnek.
function searchForArray(haystack, needle){
    var i, j, current;
    for(i = 0; i < haystack.length; ++i){
      if(needle.length === haystack[i].length){
        current = haystack[i];
        for(j = 0; j < needle.length && needle[j] === current[j]; ++j);
        if(j === needle.length)
          return true;
      }
    }
    return false;
};

//Ezzel a függvénnyel fogom megrajzolni a labirintus rácsát (szélesség-hosszúság)
function drawGrid(n, m){
    var x = 0;
    var y = - width;
    for(var i = 0; i < m; i++){
        x = 0;
        y = y + width;
        for(var j = 0; j < n; j++){
            drawRectangle(x, y, width, width, 0);
            grid.push([x, y]);
            node = [x, y];
            graph[node] = [];
            x = x + width;
        }
    }
};

//Ezzel generálok random, változó labirintust
function buildMaze(x, y){
    var stack = [];
    var visited = [];
    stack.push([x, y]);
    visited.push([x, y]);
  
    while(stack.length > 0){
        var option = [];

        if((!searchForArray(visited, [x + width, y]) && searchForArray(grid, [x + width, y]))){
            option.push("right");
        }
          
        if((!searchForArray(visited, [x - width ,y]) && searchForArray(grid, [x - width, y]))){
            option.push("left");
        }
          
        if((!searchForArray(visited, [x, y + width]) && searchForArray(grid, [x, y + width]))){
            option.push("down");
        }
          
        if((!searchForArray(visited, [x, y - width]) && searchForArray(grid, [x, y - width]))){
            option.push("up");
        }
  
        if(option.length > 0){
            chosen = option[Math.floor(Math.random()*option.length)];
  
            if(chosen=="right"){
                drawRectangle(x + 2, y + 2, width + 4, width - 4, 1, "#d3d3d3");
                node = [x, y];
                neighbour=[x + width, y];
                graph[node].push(neighbour);
                //graph[neighbour].push(node);
                x = x + width;
                visited.push([x, y]);
                stack.push([x, y]);
            }
  
            if(chosen=="left"){
                drawRectangle(x - width + 2, y + 2, width + 4, width - 4, 1), "#d3d3d3";
                node = [x, y];
                neighbour=[x - width, y];
                graph[node].push(neighbour);
                //graph[neighbour].push(node);
                x = x - width;
                visited.push([x, y]);
                stack.push([x, y]);
            }
  
            if(chosen=="down"){
                drawRectangle(x + 2, y + 2, width - 4, width + 4, 1, "#d3d3d3");
                node = [x, y];
                neighbour=[x, y + width];
                graph[node].push(neighbour);
                //graph[neighbour].push(node);
                y = y + width;
                visited.push([x, y]);
                stack.push([x, y]);
            }
  
            if(chosen=="up"){
                drawRectangle(x + 2, y - width + 2, width - 4, width + 4, 1, "#d3d3d3");
                node = [x, y];
                neighbour=[x, y - width];
                graph[node].push(neighbour);
                //graph[neighbour].push(node);
                y = y - width;
                visited.push([x, y]);
                stack.push([x, y]);
            }
        }
          else{
            [x, y] = stack.pop();
          }
      }
}

//Megoldó algoritmus
function solveMaze(x, y, a, b){
    let track = [];
    let path = [];
    track.push([x, y]);
    goal = [a, b];

    while (track.length > 0) {
        let step = track[0];
        path.push(step);
        
        if(_.isEqual(step, goal)){
            path.forEach(function(element) {
                drawStar(element[0] + width/2, element[1] + width/2, 5, 2, 5);
            });
            //console.log(path);
            break;
        }
        else{
            graph[step].forEach(function(element){
                track.push(element);
            });
            track.shift();
        }
	}
};

//Ez a függvény téglalapok rajtolásához való.
//Type: 0 a keret rajzolásához, 1 ha kitöltött téglalap kell.
function drawRectangle(x, y, w, h, type, color){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = "4";
    if(type == 1){
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }
    else{
        ctx.strokeStyle = "black";
        ctx.rect(x, y, w, h);
    }
    ctx.stroke();
};

//Ez átvett függvény. Csillag rajzoláshoz kell, ami a kijáratot jelzi.
function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    ctx.strokeSyle = "#000";
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius)
    for (i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y)
        rot += step
    }
    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath();
    ctx.lineWidth=5;
    ctx.strokeStyle='blue';
    ctx.stroke();
    ctx.fillStyle='skyblue';
    ctx.fill();
};