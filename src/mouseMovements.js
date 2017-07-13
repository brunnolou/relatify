/**
 * Watch MouseClick.
 */
const watchMouseClick = element => (callback) => {
  const lastMousePosition = { x: 0, y: 0 };

  const onClick = (event) => {
    lastMousePosition.x = event.offsetX;
    lastMousePosition.y = event.offsetY;

    callback(lastMousePosition);
  };

  element.addEventListener('click', onClick, false);
};

/**
 * Watch MouseMove.
 */
const watchMouseMove = element => (callback) => {
  const lastMousePosition = { x: 0, y: 0 };
  let ticking = false;

  const update = () => {
    // Reset the tick so we can capture the next onMouseMove.
    ticking = false;

    // Safe to perform heavy calculations.
    callback(lastMousePosition);
  };

  const requestTick = () => {
    if (!ticking) {
      // eslint-disable-next-line
      requestAnimationFrame(update);
    }

    ticking = true;
  };

  const onMouseMove = (event) => {
    lastMousePosition.x = event.offsetX;
    lastMousePosition.y = event.offsetY;

    requestTick();
  };

  element.addEventListener('mousemove', onMouseMove, false);
};

/**
 * Watch Scroll.
 */
const watchScroll = element => (callback) => {
  let latestKnownScrollY = 0;
  let ticking = false;

  const update = () => {
    // Reset the tick so we can capture the next onScroll.
    ticking = false;

    // Safe to perform heavy calculations.
    callback({ y: latestKnownScrollY });
  };

  const requestTick = () => {
    if (!ticking) {
      // eslint-disable-next-line
      requestAnimationFrame(update);
    }

    ticking = true;
  };

  const onScroll = () => {
    // eslint-disable-next-line
    latestKnownScrollY = window.scrollY;
    requestTick();
  };

  element.addEventListener('scroll', onScroll, false);
};

export default {
  watchMouseClick,
  watchMouseMove,
  watchScroll,
};
