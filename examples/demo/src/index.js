import './demo.css';
import relatify from '../../../src';

// Utility to create demo DOM elements.
function createBox(label = '') {
  const box = document.createElement('div');
  const item = document.createElement('span');
  const text = document.createTextNode(label);

  box.appendChild(item);
  box.appendChild(text);

  document.getElementById('root').appendChild(box);

  return { box, item };
}

//
// 3D effect
//
const { box, item } = createBox('Rotate 3D');

const relativeMouse = relatify.init();
const relatifyedBox = relativeMouse(box);

relatifyedBox(({ x, y }) => {
  item.style.transform = `rotateY(${x * 45}deg) rotateX(${y * -45}deg)`;
});

//
// Opacity + scale.
//
const { box: box2, item: item2 } = createBox('X: Opacity + Y: Scale; Origin:[0, 0]');

const relatifyTopOrigin = relatify.init({ origin: [0, 0] });
const relatifyedBox2 = relatifyTopOrigin(box2);

relatifyedBox2(({ x, y }) => {
  item2.style.transform = `scale(${y})`;
  item2.style.opacity = x + 0.4;
});

//
// Scroll.
//
const { box: box3, item: item3 } = createBox('Scroll –› Scale bounce');

const relatifyScroll = relatify.init({
  input: 'bodyScroll',
  friction: 1,
  origin: [0, 0],
});

const relatifyedBox3 = relatifyScroll(document);

relatifyedBox3(({ y }) => {
  item3.style.transform = `scale(${1 - y})`;
});

box3.style.position = 'fixed';
box3.style.top = 0;
box3.style.right = 0;

//
// 3D rotate effect
//
const { box: box4, item: item4 } = createBox('Mouse move X —› 180deg');

const relatifyedRotate = relatify.init()(box4);

relatifyedRotate(({ x }) => {
  item4.style.transform = `rotateY(${x * 180}deg) translateZ(50px)`;
});

//
// Click.
//
const { box: box5, item: item5 } = createBox('Click –› Move spring');

const relatifyedClick = relatify.init({
  tension: 600,
  friction: 2,
  input: 'click',
})(box5);

relatifyedClick(({ x, y }) => {
  item5.style.transform = `translate(${x * 50}px, ${y * 50}px)`;
});
