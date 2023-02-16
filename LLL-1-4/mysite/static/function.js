var connecting = false;
var left, right;

document.addEventListener("DOMContentLoaded", function(e) {
    var nodes = document.getElementsByClassName('node');
    var connections = document.getElementsByClassName('connection')
    for (node of nodes) {
        dragElement(node, connections);
     }
     lineUpConnections(nodes, connections)
});

function dragElement(elmnt, connections) {
    var disx = 0, disy = 0;
    let rect;
    let watch_left = [];
    let watch_right = [];
    let split;
    for (c of connections) {
        if (c.id.includes(elmnt.id)) {
            split = c.id.split("-");
            if (split[0] == elmnt.id) {
                watch_left.push(c);
            }
            else if (split[1] == elmnt.id) {
                watch_right.push(c);
            }
        }
    }
    
    if(elmnt != null) {
        elmnt.onmousedown = dragMouseDown;
    }
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        rect = elmnt.getBoundingClientRect()
        disx = e.clientX-rect.left;
        disy = e.clientY-rect.top;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {[]
        e = e || window.event;
        e.preventDefault();
        // set the element's new position:
        elmnt.style.top = (e.clientY-disy) + "px";
        elmnt.style.left = (e.clientX-disx) + "px";
        // Move connection lines
        for (c of watch_left) {
            c.x1.baseVal.value = (e.clientX-disx) - 50
            c.y1.baseVal.value = (e.clientY-disy) + 50
        }
        for (c of watch_right) {
            c.x2.baseVal.value = (e.clientX-disx) - 50
            c.y2.baseVal.value = (e.clientY-disy) + 50
        }
    }
    
    function closeDragElement() {
        uploadPositions();
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function lineUpConnections(nodes, connections) {
    let watch_left, watch_right, split;
    for (elmnt of nodes) {
        watch_left = [];
        watch_right = [];
        for (c of connections) {
            if (c.id.includes(elmnt.id)) {
                split = c.id.split("-");
                if (split[0] == elmnt.id) {
                    watch_left.push(c);
                }
                else if (split[1] == elmnt.id) {
                    watch_right.push(c);
                }
            }
        }
        for (c of watch_left) {
            c.y1.baseVal.value = Math.floor(elmnt.offsetTop + 50);
            c.x1.baseVal.value = Math.floor(elmnt.offsetLeft - 50);
        }
        for (c of watch_right) {
            c.y2.baseVal.value = Math.floor(elmnt.offsetTop + 50);
            c.x2.baseVal.value = Math.floor(elmnt.offsetLeft - 50);
        }
    }
}

function uploadPositions() {
    var n_pos = findPositions()
    $.ajax({
        type: "POST",
        url: SAVE_URL,   
        data: {csrfmiddlewaretoken: CSRF_TOKEN,
            new_pos: JSON.stringify(n_pos)},
    });
    // window.location.href = CONNECT_URL
}

function findPositions() {
    var nodes = document.getElementsByClassName('node');
    var new_pos = {}
    var rect
    for (node of nodes) {
        rect = node.getBoundingClientRect()
        new_pos[node.id] ={"x": rect.left, "y": rect.top}
    }
    return new_pos
}

function newConnection(left, right) {
    uploadPositions();
    $.ajax({
        type: "POST",
        url: CONNECT_URL,   
        data: {csrfmiddlewaretoken: CSRF_TOKEN,
            new_connection: left + "-" + right} 
        });
    window.location.href = CONNECT_URL
    }

function clickConnect(e) {
    if (!connecting) {
        left = startConnect(e);
        console.log(left)
    }
    else {
        right = stopConnect(e);
        if (left != right) {
            newConnection(left, right);
            document.getElementById(left).style.borderRadius = "25px";
            console.log("Connected")
            window.location.href = CONNECT_URL
        }
    }
}

function startConnect(elmnt) {
    var num = elmnt.id.replace('c', '');
    document.getElementById(num).style.backgroundColor = "green";
    connecting = true;
    return num
}

function stopConnect(elmnt) {
    var num = elmnt.id.replace('c', '');
    document.getElementById(num).style.backgroundColor = "aliceblue";
    document.getElementById(left).style.backgroundColor = "aliceblue";
    connecting = false;
    return num
}

function clickDelete(elmnt) {
    $.ajax({
        type: "POST",
        url: DELETE_URL,   
        data: {csrfmiddlewaretoken: CSRF_TOKEN,
            node: elmnt.id.replace('d','')},
        success: function() {
            reloadPage()
        },
        });
    elmnt.style.backgroundColor = "red"
    // window.location.href = DELETE_URL
}

function reloadPage() {
    window.location.href = DELETE_URL
}
