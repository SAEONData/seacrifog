import React, { Component } from 'react'

//A simple class that holds some basic state in place of its children.
export default class extends Component {
  state = { collapsed: true }

  toggleCharts = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }
  render() {
    return <this.props.children collapsed={this.state.collapsed} toggleCharts={this.toggleCharts} />
  }
}
