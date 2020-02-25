export default (obj, mappings = {}, filter = () => true) =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([key, val]) => filter([key, val]))
      .map(([key, value]) => [(mappings[key] || key).titleize(), value])
  )
