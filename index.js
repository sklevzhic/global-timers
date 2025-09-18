'use strict';

// Подготовка окружения:
globalThis.tag = 'GLOBAL';

const obj = {
  tag: 'OBJ',
  getTag() { return this?.tag; },
  arrow: () => this && this.tag,           // стрелка берёт this из внешней области (модуля)
  arrow2: function() {
    return this && this.tag
  },           // стрелка берёт this из внешней области (модуля)
  nested() {
    const what = () => this.tag;
    function who() { return this && this.tag; }
    return { what, who };
  }
};

function standalone() { return this && this.tag; }

function makeCounter(label) {
  this.label = label;
  let count = 0;
  this.inc = function() { count++; return `${this.label}:${count}`; };
  this.peek = () => `${this.label}:${count}`;
}

class A {
  constructor(name) { this.name = name; }
  say() { return `A:${this.name}`; }
  static who() { return this.name || 'NoName'; }  // у статических this — это сам конструктор
}
class B extends A {
  constructor(name) { super(name); }
  static get name() { return 'BClass'; }          // переопределяем name как аксессор
}

// 1. Неявная привязка к объекту:
console.log('1: [OBJ]', obj.getTag());


const f2 = obj?.getTag;
console.log('2:', f2());

console.log('3:', obj.getTag.bind({ tag: '3CALL' }).bind({ tag: 'CAL2L' })());

console.log('4:', obj.arrow());

const { what, who } = obj.nested();
console.log('5a:', what());
console.log('5b:', who());

console.log('6:', standalone());

const bound = obj.getTag.bind({ tag: 'BOUND' });
console.log('7a:', bound());
console.log('7b:', ({ tag: 'X', getTag: bound }).getTag());

const re = bound.bind({ tag: 'REBOUND' });
console.log('8:', re());

function Weird(name) {
  this.name = `THIS:${name}`;
  return {
    name: `RETURN:${name}`,
    show() { return this.name; }
  };
}
const w = new Weird('W');
console.log('9a:', w.name);
console.log('9b:', w.show());

const c = new makeCounter('C');
console.log('10a:', c.inc());
const gInc = c.inc;
console.log('10b:', gInc());               // потеря this?
// console.log('10c:', c.peek());             // стрелка замкнула окружение конструктора
// const other = { label: 'OTHER', inc: c.inc };
// console.log('10d:', other.inc());
//
// const a = new A('alpha');
// console.log('11a:', a.say());
// console.log('11b:', A.who());
// console.log('11c:', B.who());
//
// const getTag = obj.getTag;
// try {
//   console.log('12a:', getTag.call('str')); // примитив будет «обёрнут» в объект String?
// } catch (e) { console.log('12a: Error'); }
//
// try {
//   console.log('12b:', getTag.call(null));
// } catch (e) { console.log('12b: Error'); }
