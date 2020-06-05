import React from 'react'
import { DropdownSelect } from '../../modules/shared-components'

export default ({ label, items, updateForm, selectedItems, removeArray, addFieldName, removeFieldName }) => (
  <DropdownSelect
    id={label}
    className="sf-editor-field"
    label={label}
    truncateLength={60}
    items={items}
    selectedItems={selectedItems}
    onItemToggle={(id) =>
      selectedItems.includes(id)
        ? updateForm({
            [addFieldName]: selectedItems.filter((i) => i !== id),
            [removeFieldName]: [...new Set([...removeArray, id])],
          })
        : updateForm({
            [addFieldName]: [...new Set([...selectedItems, id])],
            [removeFieldName]: removeArray.filter((i) => i !== id),
          })
    }
  />
)
