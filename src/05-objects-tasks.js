/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const jsonObject = JSON.parse(json);
  const properties = {};
  Object.entries(jsonObject).forEach((element) => {
    properties[element[0]] = { value: element[1], enumerable: true };
  });
  return Object.create(proto, properties);
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  thisElement: '',
  thisId: '',
  thisClass: '',
  thisAttr: '',
  thisPseudoClass: '',
  thisPseudoElement: '',
  errorMessage:
    'Element, id and pseudo-element should not occur more then one time inside the selector',
  errorMessage1:
    'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',

  stringify() {
    return (
      this.thisElement
      + this.thisId
      + this.thisClass
      + this.thisAttr
      + this.thisPseudoClass
      + this.thisPseudoElement
    );
  },

  element(value) {
    if (this.thisElement) {
      throw new Error(this.errorMessage);
    }
    if (
      [
        'thisId',
        'thisClass',
        'thisAttr',
        'thisPseudoClass',
        'thisPseudoElement',
      ].some((e) => this[e])
    ) {
      throw new Error(this.errorMessage1);
    }
    const obj = Object.create(this);
    obj.thisElement = value;
    return obj;
  },

  id(value) {
    if (this.thisId) {
      throw new Error(this.errorMessage);
    }
    if (
      ['thisClass', 'thisAttr', 'thisPseudoClass', 'thisPseudoElement'].some(
        (e) => this[e],
      )
    ) {
      throw new Error(this.errorMessage1);
    }
    const obj = Object.create(this);
    obj.thisId = `#${value}`;
    return obj;
  },

  class(value) {
    if (
      ['thisAttr', 'thisPseudoClass', 'thisPseudoElement'].some((e) => this[e])
    ) {
      throw new Error(this.errorMessage1);
    }
    const obj = Object.create(this);
    obj.thisClass += `.${value}`;
    return obj;
  },

  attr(value) {
    if (['thisPseudoClass', 'thisPseudoElement'].some((e) => this[e])) {
      throw new Error(this.errorMessage1);
    }
    const obj = Object.create(this);
    obj.thisAttr = `[${value}]`;
    return obj;
  },

  pseudoClass(value) {
    if (['thisPseudoElement'].some((e) => this[e])) {
      throw new Error(this.errorMessage1);
    }
    const obj = Object.create(this);
    obj.thisPseudoClass += `:${value}`;
    return obj;
  },

  pseudoElement(value) {
    if (this.thisPseudoElement) {
      throw new Error(this.errorMessage);
    }
    const obj = Object.create(this);
    obj.thisPseudoElement = `::${value}`;
    return obj;
  },

  combine(selector1, combinator, selector2) {
    const obj = Object.create(cssSelectorBuilder);
    obj.stringify = () => `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return obj;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
