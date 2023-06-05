/*
  Name: scroll.js
  Author: Trent Brew (https://github.com/trentbrew)
  Last edited: 03/12/2023
  Description: This file contains a global directive for detecting when the user scrolls.
  Usage: `<div v-scroll="handleScroll"></div>`
*/

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('scroll', {
    mounted(el, binding) {
      window.addEventListener('scroll', e => {
        const target = e.target.scrollingElement;
        const height = target.scrollHeight;
        const value = Math.floor(target.scrollTop);
        const viewport = {
          height: target.clientHeight,
          width: target.clientWidth,
        };
        binding.value({
          target, // HTML Element
          height, // Integer (height of the page)
          value, // Integer (# of pixels scrolled from top of page)
          viewport, // Object (viewport width & height)
        });
      });
    },
    destroyed() {
      window.removeEventListener('scroll');
    },
  });
});
