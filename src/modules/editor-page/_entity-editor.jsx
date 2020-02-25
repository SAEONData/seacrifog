import React from 'react'
import { TextField, DatePicker } from 'react-md'
import debounce from '../../lib/debounce'

const updateFormHelper = debounce(({ fieldDefinitions, fieldName, val, updateForm }) =>
  updateForm({ [fieldName]: val }, () => (fieldDefinitions[fieldName].pristine = false))
)

export default ({ className = null, fieldDefinitions, updateForm, ...fields }) => (
  <>
    {Object.entries(fieldDefinitions)
      .filter(([, { display }]) => display)
      .map(([fieldName, { type, label, editable }], i) =>
        type === 'String' ? (
          <TextField
            id={'update-form-entity' + i}
            key={i}
            rows={1}
            maxRows={15}
            floating
            className={className || 'sf-editor-field'}
            label={label}
            disabled={!editable}
            value={fields[fieldName] || ''}
            onChange={val => updateFormHelper({ fieldDefinitions, fieldName, val, updateForm })}
          />
        ) : type === 'Date' ? (
          <DatePicker
            id={'update-form-entity' + i}
            key={i}
            className={className || 'sf-editor-field'}
            label={label}
            value={fields[fieldName] == null ? '' : fields[fieldName].substring(0, 10).replace(/-/g, '/')}
            disabled={!editable}
            onChange={val => updateFormHelper({ fieldDefinitions, fieldName, val, updateForm })}
          />
        ) : type === 'Integer' ? (
          <TextField
            id={'update-form-entity' + i}
            key={i}
            floating
            type={'number'}
            className={className || 'sf-editor-field'}
            label={label}
            disabled={!editable}
            value={fields[fieldName] || 0}
            onChange={val => updateFormHelper({ fieldDefinitions, fieldName, val: parseInt(val), updateForm })}
          />
        ) : type === 'Float' ? (
          <TextField
            id={'update-form-entity' + i}
            key={i}
            floating
            type={'number'}
            className={className || 'sf-editor-field'}
            label={label}
            disabled={!editable}
            value={fields[fieldName] || 0}
            onChange={val => updateFormHelper({ fieldDefinitions, fieldName, val: parseFloat(val), updateForm })}
          />
        ) : type === 'Relation mutation' ? (
          ''
        ) : (
          <p key={'update-form-entity' + i} style={{ marginTop: '15px', color: 'red' }}>
            {fieldName} data type not supported!
          </p>
        )
      )}
  </>
)
