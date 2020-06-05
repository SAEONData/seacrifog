import { PureComponent } from 'react'

export default class extends PureComponent {
  state = {}
  constructor(props) {
    super(props)
    for (const prop in this.props) {
      if (Object.prototype.hasOwnProperty.call(this.props, prop)) {
        if (prop !== 'children') this.state[prop] = this.props[prop]
      }
    }
  }

  updateForm = (obj, cb = null) => this.setState(obj, cb)

  render() {
    return this.props.children({
      updateForm: this.updateForm,
      ...this.state,
    })
  }
}
