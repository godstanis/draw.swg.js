/*
    Simple SVG drawing library. The main concept is to create an object (path, ellipse e.t.c) and then
    change it's properties regarding to the created object ('d' for paths; cx,cy,rx,ty for ellipses e.t.c)

    Short instruction: 
    - create <svg id="test"></svg> tag.
    - use drawSVG.element="test"; drawSVG.init() to initialize.
    - now you are ready to go, more info on https://github.com/Stasgar/draw.swg
*/

var drawSVG = {
    element: "", //<svg> id property
    strokeWidth: '4px',
    strokeColor: 'green',
    init: function(element){ //This method will render marker for arrow tip inside <svg>
        this.element = element;
        this.returnElement().innerHTML += HTMLhelper.renderMarker();
    },
    returnElement: function(){ //This method returns the element, provided by drawSVG.element (id) field
        return document.getElementById(this.element);
    },
    deleteObject: function(id){ //deletes an object from DOM
        var deletable = ['path', 'ellipse'];//deletable tags
        var element = document.getElementById(id);

        if(deletable.indexOf(element.tagName) != -1 && confirm('Are you sure?'))
        {
            element.parentNode.removeChild(element);
        }
    },
    /*
        Next 'create' methods used to insert pre-made structures in <svg> element
    */
    createPath: function(id){ //Creates <path> element inside initialized <svg> with provided id
        var element = this.returnElement();
        element.innerHTML += HTMLhelper.renderPath(id, this.strokeWidth, this.strokeColor);
    },
    createEllipse: function(id){ //Creates <ellipse> element inside initialized <svg> with provided id
        var element = this.returnElement();
        element.innerHTML += HTMLhelper.renderEllipse(id, this.strokeWidth, this.strokeColor);
    },
    getOffset: function(element){ //Service method, providing current information about <svg> relative position
        var box = element.getBoundingClientRect();
        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    },
    getCurPos: function(e){ //Returns current mouse position in relative <svg> coordinates
        var svg = this.returnElement();
        x = e.pageX - drawSVG.getOffset(svg).left;
        y = e.pageY - drawSVG.getOffset(svg).top;
        return {
            x: x,
            y: y
        }
    },
    /*
        Next 'draw' methods use existing element, created by 'create' method and change it properties.
        id - id of existing element, that is going to be changed
        fX, fY - first (X;Y) coordinates to start from
        lX, lY - last (X;Y) coordinates to end the figure
    */
    drawArrow: function(id,fX, fY, lX, lY){
        var path = document.getElementById(id);

        PathHelper.moveTo(path, fX, fY);
        PathHelper.lineTo(path, lX, lY);
        
        path.setAttribute('marker-end', 'url(#arrow_marker)');
    },
    drawSquare: function(id, fX, fY, lX, lY){
        var path = document.getElementById(id);

        PathHelper.moveTo(path, fX, fY);
        PathHelper.lineTo(path, fX, lY);
        PathHelper.lineTo(path, lX, lY);
        PathHelper.lineTo(path, lX, fY);
        PathHelper.lineTo(path, fX, fY);
        PathHelper.closePath(path);

    },
    drawLine: drawLineFactory(), //read more about this mehod below
    drawEllipse: function (id, fX, fY, lX, lY){
        var path = document.getElementById(id);
        path.setAttribute('cx', fX - (fX-lX)/2);
        path.setAttribute('cy', fY - (fY-lY)/2);
        path.setAttribute('rx', Math.abs(fX-lX)/2);
        path.setAttribute('ry', Math.abs(fY-lY)/2);
    },
    /*
        Next xxxByString methods provide simple interface for 
        string based switching (for example Radio buttons input)
    */
    drawByString(string, itemId, fX, fY, lX, lY){ 

        switch(string)
            {
                case "square": this.drawSquare(itemId,fX, fY, lX, lY)
                    break;
                case "arrow": this.drawArrow(itemId,fX, fY, lX, lY)
                    break;
                case "line": this.drawLine(itemId, lX, lY)
                    break;
                case "ellipse": this.drawEllipse(itemId, fX, fY, lX, lY)
            }
    },
    createByString(string, itemId){
        switch(string)
            {
                case "square": this.createPath(itemId);
                    break;
                case "arrow": this.createPath(itemId);
                    break;
                case "line": this.createPath(itemId);
                    break;
                case "ellipse": this.createEllipse(itemId);
                    break;
                case "eraser": this.deleteObject(element.target.id);
            }
    }
};

/*
    PathHelper implements methods of editing existing paths
*/
var PathHelper = {
    //Moves 'virtual brush' to the provided coordinates. If not used - 'virtual brush' will start from (0;0)
    moveTo: function(path, X, Y){ 
        path.setAttribute('d', "M"+X.toString()+","+Y.toString());
    },
    //Draws the line from 'virtual brush' position to the provided coordinates
    lineTo: function(path, X, Y){ 
        path.setAttribute('d', path.getAttribute('d') + "L"+X.toString()+","+Y.toString());
    },
    //Closes the path connectig the first point with the last
    closePath: function(path){
        path.setAttribute('d', path.getAttribute('d') + "z");
    }
};


/*
    HTMLhelper represents simple and usefull HTML tags constructor.
*/
var HTMLhelper = {
    renderMarker: function(){ //marker for arrow tip
        return '<marker id="arrow_marker" markerHeight="8" markerWidth="8" markerUnits="strokeWidth" orient="auto" refX="0" refY="5" viewBox="0 0 10 10">\
                <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="grey" id="arrow_marker_path"></path>\
            </marker>'
    },
    renderPath: function(id, strokeWidth, strokeColor){
        return '<path class="annote arrow svg-element" id="'+id+'"style="stroke-width: '+strokeWidth+';" fill="none" stroke="'+strokeColor+'"></path>';
    },
    renderEllipse: function(id, strokeWidth, strokeColor){
        return '<ellipse class="svg-element" id="'+id+'" stroke="'+strokeColor+'" stroke-width="'+strokeWidth+'" fill="none" />';
    }
};

/* 
    This method is used in drawSVG.drawLine().
    You can read more about closures on https://www.w3schools.com/js/js_function_closures.asp
*/
function drawLineFactory() {

    var counter = 0;

    //Decrease to draw lines more often; increase to draw lines less often.
    //Greater numbers will produce 'low poly' line effect.
    var TIME_BETWEEN_LINES_TICKS = 10;

    function drawLine(id, X, Y) {
        counter++;
        //If a line was recently ended, we won't do anything for 10 ticks
        if (counter>=TIME_BETWEEN_LINES_TICKS) {
            counter = 0;
            var path = document.getElementById(id);
            if (path.getAttribute('d')) {
                PathHelper.lineTo(path, X, Y); //if path for
            } else {
                PathHelper.moveTo(path, X, Y);
            }
        }
    }
    return drawLine;
}
