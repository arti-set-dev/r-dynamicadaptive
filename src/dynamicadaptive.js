export default class DynamicAdaptive {
  constructor(selector, options) {
    let defaultOptions = {
      typeMedia: 'max',
    };
    this.options = Object.assign(defaultOptions, options);
    this.dynamicElems = Array.from(document.querySelectorAll(selector));

    this.comma = ',';
    this.space = ' ';

    this.dataDynamicElems = [];

    this.breakpoints = null;
    this.mediaQueries = [];
    this.breakpoint = null;

    this.events();
  }

  events() {
    document.addEventListener('DOMContentLoaded', () => {
      this.dynamicElems.forEach((el) => {
        this.getDataElems(el);
      })

      this.breakpoints = this.dataDynamicElems.filter(item => item.breakpoint).forEach((el) => {
        this.mediaQueries.push(el.breakpoint);
      })

      this.breakpointSort(this.mediaQueries);
      this.mediaQueries.forEach((breakpointEl) => {
        this.breakpoint = window.matchMedia(`(${this.options.typeMedia}-width: ${breakpointEl}px)`);
        this.breakpoint.addEventListener('change', (e) => {
          this.checkBreakpoints(e, breakpointEl);
        })
        this.checkBreakpoints(this.breakpoint, breakpointEl);
      })
    })
  }

  getDataElems(dynamicElem) {
    let getData = dynamicElem.dataset.dynamicState;
    getData = this.dataSeparation(getData, this.comma + this.space);
    let dataObject = {};
    dataObject.dynamicElem = dynamicElem;
    dataObject.nextElem = dynamicElem.nextElementSibling;
    dataObject.prevElem = dynamicElem.previousElementSibling;
    dataObject.targetElem = document.getElementsByClassName(getData[0])[0];
    dataObject.targetArr = Array.from(dataObject.targetElem.children);
    dataObject.breakpoint = getData[1];
    dataObject.position = getData[2];

    dataObject.parentElem = dynamicElem.parentElement;
    dataObject.parentArr = Array.from(dataObject.parentElem.children);
    dataObject.originalPosition = dataObject.parentArr.findIndex(item => item === dynamicElem);
    this.dataDynamicElems.push(dataObject);
  }

  dataSeparation(data, separotor) {
    return data.split(separotor);
  }

  checkBreakpoints(breakpoint, breakpointEl) {
    if (breakpoint.matches) {
      this.dataDynamicElems.filter(item => item.breakpoint == breakpointEl).forEach((el) => {
        this.moveToTarget(el.dynamicElem, el.targetArr, el.targetElem, el.position);
      })
    } else {
      this.dataDynamicElems.filter(item => item.breakpoint == breakpointEl).forEach((el) => {
        this.moveToParent(el.dynamicElem, el.parentElem, el.originalPosition);
      })
    }
  }

  moveToTarget(dynamicElem, targetArr, targetElem, position) {
    if (position >= targetArr.length || position === 'last') {
      targetElem.append(dynamicElem);
    }
    if (position === 'first') {
      targetElem.prepend(dynamicElem);
    }
    if (position < targetArr.length) {
      targetArr[position].before(dynamicElem);
    }
  }

  moveToParent(dynamicElem, parentElem, originalPosition) {
    if (parentElem.children[originalPosition] !== undefined) {
      parentElem.children[originalPosition].before(dynamicElem);
    } else {
      parentElem.append(dynamicElem);
    }
  }

  breakpointSort(arr) {
    if (this.options.typeMedia === 'max') {
      return arr.sort((a, b) => b - a);
    } else {
      return arr.sort((a, b) => a - b);
    }
  }
}