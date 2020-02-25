/**
 * Only the last function call is executed within a given time period
 */
export default (cb, duration = 0) => {
  var timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => cb(...args), duration)
  }
}
