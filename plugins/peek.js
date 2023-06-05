/*
  Name: peek.js
  Author: Trent Brew (https://github.com/trentbrew)
  Last edited: 03/12/2023
  Description: This file contains a global directive for detecting when an element is visible in the viewport.
  Usage: `<div v-peek="handlePeek"></div>`
*/

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('peek', {
    mounted(el, binding) {
      const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          const peeking = entry.isIntersecting;
          binding.value({
            value: peeking,
            target: entry.target,
            id: entry.target.id,
          });
          if (peeking) observer.disconnect();
        });
      });
      io.observe(el);
    },
  });
});
