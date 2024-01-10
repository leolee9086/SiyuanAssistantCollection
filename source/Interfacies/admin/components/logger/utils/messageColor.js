const logLevelColorMap = {
  'debug': 'blue',
  'info': 'green',
  'warn': 'orange',
  'error': 'red',
  'fatal': 'purple',
  'log': "grey"
};

const randomColorCache = {};

export function getColorForLogLevel(level) {
  const lowerCaseLevel = level.toLowerCase();
  if (!logLevelColorMap[lowerCaseLevel]) {
    if (!randomColorCache[lowerCaseLevel]) {
      randomColorCache[lowerCaseLevel] = getRandomColor();
    }
    return randomColorCache[lowerCaseLevel];
  }
  return logLevelColorMap[lowerCaseLevel];
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}