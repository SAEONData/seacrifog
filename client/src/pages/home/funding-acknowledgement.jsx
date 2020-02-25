import React, { PureComponent } from 'react'
import { DialogContainer, Cell } from 'react-md'

export default class extends PureComponent {
  state = { visible: false }

  toggleVisible = () => this.setState({ visible: !this.state.visible })

  render() {
    const { visible } = this.state

    return (
      <Cell
        className="add-on-hover-white"
        style={{ display: 'flex', padding: '8px' }}
        phoneSize={2}
        tabletSize={2}
        size={2}
      >
        <img
          onClick={this.toggleVisible}
          style={{
            alignSelf: 'center',
            display: 'flex',
            margin: 'auto',
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            padding: '0',
            cursor: 'pointer'
          }}
          src={this.props.imgPath}
          alt={this.props.alt}
        />
        <DialogContainer
          id="funding-acknowledgement"
          title={'Acknowledgement'}
          visible={visible}
          titleStyle={{ textAlign: 'center' }}
          focusOnMount={false}
          onHide={this.toggleVisible}
          contentStyle={{ maxHeight: 'inherit' }}
        >
          <img
            style={{
              width: '100%',
              display: 'block',
              margin: '20px auto'
            }}
            src={this.props.imgPath}
            alt={this.props.alt}
          />
          {this.props.content}
        </DialogContainer>
      </Cell>
    )
  }
}
