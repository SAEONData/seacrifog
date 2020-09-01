const tourConfig = [
  {
    pathname: '/',
    steps: [() => alert('hi')],
  },
]

export default history => {
  tourConfig.forEach(page => {
    const pathname = window.location.pathname
    if (pathname !== page.pathname) {
      history.push(page.pathname)
    }
  })
}
