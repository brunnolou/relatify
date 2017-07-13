# Relatify
**Get the relative position of user interaction**

## Install
```sh
npm install --save relatify
```

## How to use
```js
const container = document.getElementById('container');
const item = document.getElementById('item');

const relativeMouseMove = relatify.init();
const onMove = relativeMouseMove(container);

onMove(({ x, y }) => {
  // The x and y will be between -1 and 1 relative to the container center.
  item.style.transform = `rotateY(${x * 45}deg) rotateX(${y * -45}deg)`;
});
```

## Options
Options for `relatify.init({ ... });`.

All the following values can be overwritten, these are the defaults:

```js
defaultOptions {
  // Function to get the element relative size.
  getBox: element => element.getBoundingClientRect();,

  // Input will be relative to the element center.
  origin: [0.5, 0.5],

  // Spring parameters.
  tension: 30,
  friction: 7,

  // This is the function that watch the user input.
  // There is the following built in function that you can use that
  // are using RequestAnimationFrame to improve the performance:
  // [click, mouseMove, scroll]
  input: relatify.mouseMove,
}
```
