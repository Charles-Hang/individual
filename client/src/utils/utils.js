const utils = {
  scrollTo(height) {
    const proportion = 5;
    const scrollTop = document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop;
    let speed = Math.abs(scrollTop - height);
    const timer = setInterval(() => {
      if (scrollTop > height) {
        window.scrollBy(0, -Math.ceil(speed / proportion));
        // document.documentElement.scrollTop -= Math.ceil(speed / proportion);
        // window.pageYOffset -= Math.ceil(speed / proportion);
        // document.body.scrollTop -= Math.ceil(speed / proportion);
      } else {
        window.scrollBy(0, Math.ceil(speed / proportion));
        // document.documentElement.scrollTop += Math.ceil(speed / proportion);
        // window.pageYOffset += Math.ceil(speed / proportion);
        // document.body.scrollTop += Math.ceil(speed / proportion);
      }
      speed -= Math.ceil(speed / proportion);
      if (scrollTop === height || speed === 0) {
        clearInterval(timer);
      }
    }, 30);
  },
  parseDate(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  },
  parseDetailDate(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  },
};
export default utils;
