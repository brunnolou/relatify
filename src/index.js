import rebound from 'rebound';
import mouseMovements from './mouseMovements';

const getBox = element => element.getBoundingClientRect();
const getDocumentBox = () => ({
  // eslint-disable-next-line
  height: document.documentElement.getBoundingClientRect().height - window.innerHeight,
});

const defaultOptions = {
  origin: [0.5, 0.5],
  throttle: 200,
  tension: 30,
  friction: 7,
  input: 'mouseMove',
};

// User interaction.
const inputs = {
  click: mouseMovements.watchMouseClick,
  mouseMove: mouseMovements.watchMouseMove,
  scroll: mouseMovements.watchScroll,
  bodyScroll: mouseMovements.watchScroll,
};

// Spring System.
const springSystem = new rebound.SpringSystem();

// eslint-disable-next-line
const init = (options = {}) => (element = document) => (callback) => {
  const opts = Object.assign({}, defaultOptions, options);

  const watchInput = typeof opts.input === 'string' ? inputs[opts.input](element) : opts.input(element);

  const springX = springSystem.createSpring(opts.tension, opts.friction);
  const springY = springSystem.createSpring(opts.tension, opts.friction);

  let x = 0;
  let y = 0;
  let box;

  if (opts.input === 'bodyScroll' && !opts.getBox) {
    box = getDocumentBox();
  } else {
    box = opts.getBox ? opts.getBox(element) : getBox(element);
  }

  springX.addListener({
    onSpringUpdate(spring) {
      x = spring.getCurrentValue();

      callback({ x, y });
    },
  });

  springY.addListener({
    onSpringUpdate(spring) {
      y = spring.getCurrentValue();

      callback({ x, y });
    },
  });

  const [oriX, oriY] = opts.origin;
  const onWatch = (position) => {
    // Set values to the spring.
    springX.setEndValue(((position.x / box.width) - oriX) / (oriX || 1));
    springY.setEndValue(((position.y / box.height) - oriY) / (oriY || 1));
  };

  watchInput(onWatch);

  return box;
};

export default Object.assign({}, {
  init,
  getBox,
}, inputs);
