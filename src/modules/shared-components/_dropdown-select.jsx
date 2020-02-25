import React, { PureComponent } from 'react'
import debounce from '../../lib/debounce'
import { TextField, FontIcon, DropdownMenu, ListItemControl, SelectionControl, List, ListItem } from 'react-md'
import sift from 'sift'

const listItemStyle = {
  margin: '2px 0'
}

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

    return (
      <div className={className}>
        <DropdownMenu
          id={`filter-component-${label}-${id}`}
          style={{ width: '100%' }}
          listStyle={{ width: '100%' }}
          defaultVisible={false}
          visible={visible}
          onVisibilityChange={() => this.setState({ visible: !visible })}
          anchor={{
            x: DropdownMenu.HorizontalAnchors.INNER_LEFT,
            y: DropdownMenu.VerticalAnchors.BOTTOM
          }}
          position={DropdownMenu.Positions.BELOW}
          menuItems={(() => {
            const result =
              filteredItems.length > 0
                ? filteredItems.map(item => (
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
                  ))
                : 'No search result'

            if (result.length >= 20)
              result.push(
                <ListItem
                  key={'more-items'}
                  onClick={() => this.setState({ listSize: listSize + 20, visible: false })}
                  primaryText={'LOAD MORE...'}
                />
              )
            return result
          })()}
        >
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
          />
        </DropdownMenu>
        <List>
          {items
            .filter(sift({ id: { $in: selectedItems } }))
            .sort((a, b) => {
              const aVal = a.value.toUpperCase()
              const bVal = b.value.toUpperCase()
              return aVal >= bVal ? 1 : -1
            })
            .map(item => (
              <ListItem
                className={'filter-menu-selected-item add-on-hover'}
                style={listItemStyle}
                key={item.id}
                onClick={() => toggleItemSelect(item)}
                rightIcon={<FontIcon>close</FontIcon>}
                primaryText={(item.value || '(UNKNOWN)').truncate(truncateLength || 25).toUpperCase()}
              />
            ))}
        </List>
      </div>
    )
  }
}
