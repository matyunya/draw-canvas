let canvas, ctx, pos;

const button = (onClick) => {
  const b = document.createElement('button');
  b.onclick = onClick;
  b.innerText = 'Clear';
  
  return b;
}

class DrawingCanvas {
  constructor(props) {
  	this.init();
    
    ctx.canvas.height = 112;
    ctx.canvas.width = 112;
    this.button = button(() => this.reset());
    this.emit = null;
    this.value = false;
    
    ctx.beginPath();
    ctx.rect(0, 0, 112, 112);
    ctx.fillStyle = "black";
    ctx.fill();
  }
  
  async *output() {
    while (true) {
      yield this.value;
      this.value = await new Promise(resolve => this.emit = resolve);
    }
  }

  reset() {
    ctx.beginPath();
    ctx.rect(0, 0, 112, 112);
    ctx.fillStyle = "black";
    ctx.fill();
  }
  
  dispose() {
    canvas.parentNode.removeChild(canvas);
    this.button.parentNode.removeChild(this.button);
  }
  
  render(node) {
    node.appendChild(canvas);
    node.appendChild(this.button);
  }
  
  draw(e) {
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    ctx.beginPath(); // begin

    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'white';
    ctx.moveTo(pos.x, pos.y); // from
    this.setPosition(e);
    ctx.lineTo(pos.x, pos.y); // to

    ctx.stroke(); // draw it!
  }
  
  init() {
    canvas = document.createElement('canvas');
    canvas.style.border = '1px solid gray';
    canvas.style.width = '112px';
    canvas.style.height = '112px';
    ctx = canvas.getContext('2d');
    pos = { x: 0, y: 0 };

    document.addEventListener('mousemove', (e) => this.draw(e));
    document.addEventListener('mousedown', (e) => this.setPosition(e));
    document.addEventListener('mouseenter', (e) => this.setPosition(e)); 
    document.addEventListener('mouseup', () => {
      const data = ctx.getImageData(0, 0, 112, 112);
      this.emit && this.emit(data);
    }); 
  }
  
  setPosition(e) {
    if (e.pageX || e.pageY) { 
      pos.x = e.pageX;
      pos.y = e.pageY;
    } else { 
      pos.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
      pos.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    } 
    pos.x -= canvas.offsetLeft;
    pos.y -= canvas.offsetTop;
  }
}



export const paint = props => ({ ...props, __EllxMeta__: { component: DrawingCanvas } });

export default paint;