const button = document.getElementById(`button`)

const Box = (x) => ({
  map: (f) => Box(f(x)),
  fold: (f) => f(x),
})

const res = Box([1, 2, 3])
  .map((arr) => arr.map((el) => el * 2))
  .fold((x) => x)

const Task = (x) => ({
  map: (f) => Task(f(x)),
  chain: (task) => Task(task.fold),
  fold: (f) => f(x),
})

// const Either = Right || Left

const Left = (x) => ({
  map: (f) => Left(x),
  inspect: () => `Left${x}`,
  fold: (f, g) => f(x),
  chain: (f) => Left(x),
})

const Right = (x) => ({
  map: (f) => Right(f(x)),
  inspect: () => `Right${f(x)}`,
  fold: (f, g) => g(x),
  chain: (f) => f(x),
})

const tryCatch = (f) => {
  try {
    return Right(f())
  } catch (err) {
    return Left(err)
  }
}

const fromNaN = (x) => {
  isNaN(x) ? Left(x) : x
}

const res2 = Right(3)
  .chain((n) => Left(n))
  .fold(
    (n) => null,
    (n) => n
  )

const double = (x) =>
  tryCatch(() => x * 2).fold(
    (err) => console.error(err),
    (x) => String(x)
  )

const upperCase = (str) =>
  tryCatch(() => str.toUpperCase())
    .map((uppercase) => uppercase + `!!!`)
    .fold(
      (err) => err,
      (str) => str
    )

const DeferredAction = (g) => (x) => ({
  map: (f) => DeferredAction(() => f(g(x)))(x),
  fold: (f) => f(g(x)),
})

const timesTen = (n) => n * 10

const deferredLog = DeferredAction(timesTen)(2).map(timesTen).map(timesTen)
button.addEventListener(`click`, () => deferredLog.fold((x) => console.log(x)))

// const compose = (...fns) => x => fns.reduce((curried, fn) => curried(fn))
// const compose = (f1, f2) => (x) => f2(f1(x))

const compose = (...fns) => (arg) => fns.reduce((acc, fn) => fn(acc), arg)

const exclaim = (str) => `${str}!`

const scream = compose(exclaim, exclaim, exclaim)

const prop = (key) => (obj) => obj[key]
const propId = prop(`id`)

const ecksdee = {
  id: `1`,
  name: `same`,
}

const memoize = (f) => {
  const cache = {}

  return async (...args) => {
    cacheKey = args.reduce((endStr, arg) => endStr + arg, ``)
    cache[cacheKey] = cache[cacheKey] || (await f(args))
    return await cache[cacheKey]
  }
}

const timeoutPromise = async (deferredVal) => {
  return new Promise((res, rej) => {
    setTimeout(() => res(deferredVal), 2000)
  })
}

const delayLog = memoize(timeoutPromise)

const asyncHelper = async () => {
  console.log(await delayLog(`yo`, `ecksdee`))
  console.log(await delayLog(`yo`))
  console.log(await delayLog(`hey`))
}

asyncHelper()
