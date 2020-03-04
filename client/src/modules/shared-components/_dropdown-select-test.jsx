import React, { PureComponent } from 'react'
import debounce from '../../lib/debounce'
import { TextField, FontIcon, ListItemControl, SelectionControl, ListItem, Card, CardText, List } from 'react-md'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import sift from 'sift'

/**
 * Interface:
 *
 * selectedItems (Array of Int values)
 * items [{id, value}]
 * id
 * label
 * truncateLength?
 * className? Optional classname
 *
 * TODO
 * (1) Convert menuItems to use virtual list instead of splicing and 'clicking more'
 * (2) Convert the list of selected items to also be a virtualized list
 */
export default class extends PureComponent {
  state = { searchTerm: '', filteredItems: [], visible: false, listSize: 20 }

  updateSearchTerm = searchTerm => this.setState({ searchTerm, visible: true })

  toggleItemSelect = item => this.props.onItemToggle(item.id)

  render() {
    const { updateSearchTerm, toggleItemSelect, state, props } = this
    const { selectedItems, items, id, label, truncateLength, className } = props
    const { searchTerm, visible, listSize } = state
    const searchTermUpper = searchTerm.toUpperCase()

    const filteredItems = (searchTerm
      ? [...items].filter(item =>
          item.value.toUpperCase().indexOf(searchTermUpper) >= 0 || selectedItems.includes(item.id) ? true : false
        )
      : [...items]
    )
      .sort((a, b) => {
        const aVal = a.value.toUpperCase()
        const bVal = b.value.toUpperCase()
        return aVal >= bVal ? 1 : -1
      })
      .splice(0, listSize)

    const listElements = items
      .filter(sift({ id: { $in: selectedItems } }))
      .sort((a, b) => {
        const aVal = a.value.toUpperCase()
        const bVal = b.value.toUpperCase()
        return aVal >= bVal ? 1 : -1
      })
      .map(item => (
        <Card
          key={item.id}
          style={{ boxShadow: 'none' }}
          className={'filter-menu-selected-item add-on-hover'}
          onClick={() => toggleItemSelect(item)}
        >
          <CardText style={{ padding: '16px' }}>
            {(item.value || '(UNKNOWN)').truncate(truncateLength || 25).toUpperCase()}

            <FontIcon style={{ float: 'right', fontSize: 'x-large' }}>close</FontIcon>
          </CardText>
        </Card>
      ))
    return (
      <div className={className}>
        <TextField
          id={`atlas-filter-${id}`}
          key={id}
          autoComplete="off"
          style={{ width: '100%' }}
          leftIcon={<FontIcon>search</FontIcon>}
          label={label}
          onChange={debounce(val => updateSearchTerm(val))}
          fullWidth={true}
          value={searchTerm}
          onFocus={() => this.setState({ visible: !visible })}
          // onBlur={()=>{this.setState({ visible: !visible })}}
          // onItemToggle={() => this.setState({ visible: !visible })}
        />

        <Card style={{ visibility: this.state.visible ? 'visible' : 'hidden', position: 'absolute', zIndex: 99 }}>
          <List>
            {filteredItems.length > 0
              ? filteredItems.map(item => (
                  <ListItem key={item.id}>
                    <ListItemControl
                      key={item.id}
                      className="add-on-hover"
                      primaryAction={
                        <SelectionControl
                          id={`filter-select-option-${item.id}-${item.label}`}
                          name={'filter-select-option'}
                          onChange={() => toggleItemSelect(item)}
                          type={'checkbox'}
                          label={(item.value || '(UNKNOWN)').truncate(truncateLength || 25).toUpperCase()}
                          checked={selectedItems.includes(item.id) ? true : false}
                          labelBefore
                        />
                      }
                    />
                  </ListItem>
                ))
              : 'No search result'}
          </List>
        </Card>

        <AutoSizer id={'autosizer'} disableHeight>
          {({ width }) => {
            return (
              <FixedSizeList
                id="fixedSizeList"
                height={selectedItems.length * 50 > 300 ? 300 : selectedItems.length * 50}
                width={width}
                itemCount={selectedItems.length}
                itemSize={50}
              >
                {({ index, style }) => {
                  return (
                    <div id={index} style={style}>
                      {listElements[index]}
                    </div>
                  )
                }}
              </FixedSizeList>
            )
          }}
        </AutoSizer>
      </div>
    )
  }
}
