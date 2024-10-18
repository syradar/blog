---
title: Exciting JavaScript updates since 2020
description: A detailed overview of modern JavaScript features added from 2020 onwards, including dynamic imports, optional chaining, and more.
sidebar:
  label: Updates since 2020
---

JavaScript has been evolving faster than ever, with new features being added on a yearly release schedule instead of the larger combined updates like ES5 and ES6. Since 2020, many powerful and exciting features have been introduced that can significantly improve how we write and optimize our code.

## 2020

### Dynamic Imports

Dynamic imports allow you to load modules on demand, optimizing your app's performance. This is especially useful for code-splitting and lazy-loading features.

```js
const bookModule = await import(`.features/books/books.js`);
const books = bookModule.getBooks();
console.log(books); // Output: Array of books
```

[MDN Documentation on Dynamic Imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)

### Regex: string.matchAll

`matchAll()` returns all matching results of a regex in a string, allowing you to iterate through matches with more control than match.

```js
const regExp = /page (\d+)/g;
const text = 'Read page 1, skip to page 5';;
let matches = [...text.matchAll(regExp)];

for (const match of matches) {
  console.log(`Found page ${match[1]}`)
}
// Found page 1
// Found page 5
```

[MDN Documentation on `matchAll`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll)

### `Promise.allSettled()`

Promise.allSettled() allows you to handle multiple promises, even if some fail. It waits for all promises to settle, providing the result or error of each.

```js
const promises = [fetch("/users"), fetch("/roles")];
const allResults = await Promise.allSettled(promises);
const errors = allResults
  .filter(p => p.status === 'rejected')
  .map(p => p.reason);
  ```

[MDN Documentation on `Promise.allSettled()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

### Nullish coalescing operator

The `??` operator provides a way to assign a default value, only if the left operand is null or undefined, preventing unintended behavior with falsy values like `0` or `""`.

```js
// Only falls back to 42 if settings.size is null/undefined.
const size = settings.size ?? 42; 

// Falls back to 42 if size is null/undefined, or a falsy value like 0 or ""
const size = settings.size || 42; 
```

[MDN Documentation on Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)

### Optional chaining

Optional chaining `?.` helps safely access deeply nested object properties, avoiding errors when properties don’t exist.

```js
const user = { profile: { name: "Alice", address: { city: "Wonderland" } } };
const city = user.profile?.address?.city ?? 'Unknown';
console.log(city); // Output: Wonderland

const zipCode = user.profile?.address?.zip ?? 'No Zip Code';
console.log(zipCode); // Output: No Zip Code
```

[MDN Documentation on Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

## 2021

### `string.replaceAll()`

The `replaceAll()` method allows you to replace all instances of a substring in a string without using a regular expression.

```js
const string = "Javascript is the best web scripting language. Javascript can be used for both front end and backend";
const replaced = string.replaceAll("Javascript", "Typescript");

console.log(replaced); // Typescript is awesome. Typescript rules!
```

[MDN Documentation on `replaceAll()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll)

### Private Methods

Private methods are denoted with a `#` and are only accessible within the class, providing true encapsulation.

```js
class Person {
  showName() {
    console.log("My name is Foo")
  }
  #showAge() {
    console.log("Foo is 20")
  }
}

const foo = new Person()

foo.showName() // My name is Foo
foo.showAge() // Uncaught TypeError: foo.showAge is not a function
foo.#showAge() // Uncaught SyntaxError: reference to undeclared private field or method #showAge
```

[MDN Documentation on Private Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties)

### `Promise.any()`

`Promise.any()` resolves as soon as one of the promises in an array resolves, making it the opposite of `Promise.all()`.

```js
const fetchPromises = [fetch("/fast"), fetch("/slow")];
const firstResolved = await Promise.any(fetchPromises);

console.log(firstResolved); // Logs the fastest resolved promise
```

[MDN Documentation on `Promise.any()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)

### Numeric Separators

Numeric separators `_` make large numbers easier to read without affecting the actual value.

```js
const budget = 1_000_000_000;
console.log(budget === 1000000000); // true
```

[MDN Documentation on Numeric Separators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#numeric_separators)

### Logical Assignment Operator

Logical assignment operators combine logical operations with assignment, simplifying common expressions.

```js
let x = 1;
let y = 2;
x &&= y;
console.log(x); // 2 (x is reassigned if it’s truthy)
```

- [MDN Documentation on Logical AND assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND_assignment)
- [MDN Documentation on Logical OR assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment)
- [MDN Documentation on Nullish coalescing assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment)

## 2022

### Top-level await

You can now use await directly at the top level of your modules, making asynchronous operations even simpler.

```js
await Promise.resolve(console.log('Hello from top-level await!'));
```

[MDN Documentation on Top-level `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await)

### Private class fields

Private class fields allow you to define private variables in a class using the # syntax, ensuring they’re inaccessible outside the class.

```js
class Person {
  #firstName = Foo

  showName() {
    console.log(`My name is ${this.#firstName}`) // Access private field within class
  }

  #showAge() {
    console.log("Foo is 20")
  }
}

const foo = new Person();
console.log(foo.firstName); // undefined
```

[MDN Documentation on Private Fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties)

### Static class fields and methods

Static class fields and methods belong to the class itself rather than instances of the class. You can access them without creating an object of that class.

```js
class Robot {
  static type = "Autonomous Machine"; // Static field

  constructor(name) {
    this.name = name;
  }

  static info() {
    return `Robot type: ${Robot.type}`; // Static method
  }

  introduce() {
    return `I am ${this.name}`;
  }
}

console.log(Robot.info()); // Output: Robot type: Autonomous Machine

const robot1 = new Robot("Cyberdyne Systems T-101");
console.log(robot1.introduce()); // Output: I am Cyberdyne Systems T-101

```

[MDN Documentation on Static Fields and Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static)

### Error.cause

The `Error.cause` property allows you to include more context when throwing errors, especially when one error causes another. This helps with debugging by providing more detail.

```js
const getUsers = async(array)=> {
  try {
    const users =  await fetch('<https://myapi/myusersfake>');
    return users;
  } catch (error) {
    console.log('enter')
    throw new Error('Something when wrong, please try again later', { cause: error })
  }
}

try{
  const users = await getUsers();
} catch(error) {
  console.log(error.message); // Something went wrong, please try again later
  console.log(error.cause); // TypeError: Failed to fetch
}
```

[MDN Documentation on `Error.cause`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)

### `Array.at()`, `String.at()`

The `.at()` method allows you to access elements from arrays and strings using negative indexing, making it easier to retrieve values from the end of a collection.

```js
const fruitsArray = ['banana', 'apple', 'orange', 'kiwi'];
// Using positive and negative indexing
console.log(fruitsArray.at(1));  // Output: apple
console.log(fruitsArray.at(-1)); // Output: kiwi

const fruit = 'kiwi';
console.log(fruit.at(-1)); // Output: i
```

[MDN Documentation on `.at()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at)

### `Object.hasOwn()`

The `Object.hasOwn()` method provides a simpler way to check if an object has a specific property, replacing the more verbose hasOwnProperty.

```js
const object = { foo: 'bar' };

// Old way of checking property existence
if (Object.prototype.hasOwnProperty.call(object, 'foo')) {
  console.log("The object has the property 'foo'");
}

// Simplified with Object.hasOwn()
if (Object.hasOwn(object, 'foo')) {
  console.log("The object has the property 'foo'");
}
```

[MDN Documentation on `Object.hasOwn()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)

## 2023

### Array.findLast(), Array.findLastIndex()

These methods allow you to search for the last element in an array that matches a condition, rather than the first one, making it easier to work with data from the end of an array.

```js
const users = [
  { id: 1, age: 15 },
  { id: 2, age: 20 },
  { id: 3, age: 22 },
];

const lastUser = users.findLast(user => user.age > 18);
console.log(lastUser); // {id: 3, name: 'user3', age: 22}

const lastIndex = users.findLastIndex(user => user.age > 18);
console.log(lastIndex); // Output: 2
```

- [MDN Documentation on `findLast()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast)
- [MDN Documentation on `findLastIndex()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex)

### `Array.toReversed()`, `Array.toSorted()`, `Array.toSpliced(`)

These new methods allow you to reverse, sort, or splice arrays without modifying the original array, providing a functional approach to array manipulation.

```js
const prime = [13,7,17,2];
const sortPrime = prime.toSorted();

console.log(prime) // [13,7,17,2]; // Original array remains unchanged
console.log(sortPrime) // [2,7,13,17];
```

- [MDN Documentation on `toReversed()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toReversed)
- [MDN Documentation on `toSorted()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted)
- [MDN Documentation on `toSpliced()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSpliced)

### `Array.with(index, value)`

The `with()` method allows you to create a new array with one element updated, without changing the original array, making it a functional approach for immutability.

```js
const usernames = ['user1', 'user2', 'user3'];

const updatedUsernames = usernames.with(1, 'newUser');
console.log(usernames); // ['user1', 'user2', 'user3'] - Original array remains unchanged
console.log(updatedUsernames); // ['user1', 'newUser', 'user3']
```

[MDN Documentation on `with()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/with)

<!-- ## 2024
### Records and Tuples
<https://github.com/tc39/proposal-record-tuple>

### Decorators
 <https://github.com/tc39/proposal-decorator-metadata>

### Pattern Matching
 <https://github.com/tc39/proposal-pattern-matching>

### Temporal (new Date class)
 <https://github.com/tc39/proposal-temporal>

Custom Elements
class TimeFormatted extends HTMLElement { // (1)

  connectedCallback() {
    let date = new Date(this.getAttribute('datetime') || Date.now());

    this.innerHTML = new Intl.DateTimeFormat("default", {
      year: this.getAttribute('year') || undefined,
      month: this.getAttribute('month') || undefined,
      day: this.getAttribute('day') || undefined,
      hour: this.getAttribute('hour') || undefined,
      minute: this.getAttribute('minute') || undefined,
      second: this.getAttribute('second') || undefined,
      timeZoneName: this.getAttribute('time-zone-name') || undefined,
    }).format(date);
  }

}

customElements.define("time-formatted", TimeFormatted); // (2)
<time-formatted datetime="2019-12-01"
  year="numeric" month="long" day="numeric"
  hour="numeric" minute="numeric" second="numeric"
  time-zone-name="short"
></time-formatted>

<https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements>

<https://kinsta.com/blog/web-components/>

<https://web.dev/articles/custom-elements-best-practices> -->
