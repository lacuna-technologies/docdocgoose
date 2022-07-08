const IS_DEV = process.env.NODE_ENV === `development`

const log = (...args: any[]) => {
  console.log(...args)
}

const debug = (...args: any[]) => {
  console.debug(...args)
}

const error = (...args: any[]) => {
  console.error(...args)
}

const Logger = new Proxy({
  debug,
  error,
  log,
}, {
  get(target, prop) {
    if(prop in target && target[prop] instanceof Function) {
      return (...args) => {
        if(IS_DEV) {
          // only log in development
          target[prop](...args)
        }
      }
    } else {
      return target[prop]
    }
  },
})

export default Logger