import React, { PureComponent } from 'react'
import {
  DataTable,
  TableHeader,
  TableBody,
  TableRow,
  TablePagination,
  TableColumn,
  Toolbar,
  TextField,
  FontIcon
} from 'react-md'
import debounce from '../../lib/debounce'
import { mergeLeft } from 'ramda'

const sortResult = (a, b, reverse = false) => (reverse ? (a > b ? -1 : a < b ? 1 : 0) : a > b ? 1 : a < b ? -1 : 0)

export default class extends PureComponent {
  constructor(props) {
    super(props)
    const { dataDefinitions, defaultPaginationRows } = props

    // Defaults
    this.defaultPaginationRows = defaultPaginationRows || 5
    this.state = {
      search: '',
      paginationSlice: [0, this.defaultPaginationRows],
      headers: {},
      filteredData: null
    }

    // Set stateful headers
    Object.entries(dataDefinitions)
      .filter(([, { show }]) => show)
      .forEach(([header, opts]) => {
        this.state.headers[header] = mergeLeft({ sorted: false, sortAscending: false }, opts)
      })
  }

  /**
   * There can only be one sorted field
   * First mark all fields as not sorted,
   * and then indicate the sorted field.
   *
   * NTOE the 'sortAscending' field is used
   * to indicate sort state in the table
   */
  applySorting = field => {
    const headers = { ...this.state.headers }
    Object.keys(headers).forEach(key => (headers[key].sorted = false))
    headers[field].sorted = true
    headers[field].sortAscending = !headers[field].sortAscending
    this.setState({ headers })
  }

  render() {
    const { props, state, applySorting, defaultPaginationRows } = this
    const { headers, search, paginationSlice } = state
    const { data, dataDefinitions, toggleSelect, selectedIds, baseId, className } = props

    /**
     * Filter data
     *  => Remove selected rows (and splice them at the end)
     *  => If the search is is blank don't filter
     *  => Otherwise filter on the search term
     */
    const selectedRows = []
    const searchTerm = search.toUpperCase()
    let filteredData = data.filter(row => {
      if (selectedIds.includes(row.id)) {
        selectedRows.push(row)
        return false
      }
      if (searchTerm === '') return true
      let include = false
      Object.entries(row).forEach(([field, value]) => {
        if ((dataDefinitions[field] || {}).show) {
          if (value && value.toUpperCase && value.toUpperCase().indexOf(searchTerm) >= 0) {
            include = true
          }
        }
      })
      return include
    })
    filteredData.splice(0, 0, ...selectedRows)

    // Apply sort if necessary
    // sort() updates the underlying array
    const sortField = Object.entries(headers).find(([, { sorted }]) => sorted) || null
    if (sortField) {
      const [sFieldName, { sortAscending }] = sortField
      filteredData.sort((a, b) => {
        const valA = a[sFieldName]
        const valB = b[sFieldName]
        return sortResult(valA, valB, sortAscending)
      })
    }

    return (
      <>
        {this.props.searchbar ? (
          <Toolbar style={{ display: 'flex', alignItems: 'center' }} zDepth={0}>
            <TextField
              id={`Table-search-${baseId}`}
              style={{ marginLeft: '20px', display: 'flex' }}
              block={true}
              autoComplete={'off'}
              value={search}
              onChange={search => this.setState({ search })}
              placeholder="Search by table fields..."
              leftIcon={<FontIcon>search</FontIcon>}
            />
            {this.props.actions}
          </Toolbar>
        ) : (
          ''
        )}
        <DataTable className={className} baseId={baseId} style={{ fontSize: '12px' }} responsive={true} fullWidth>
          <TableHeader>
            <TableRow>
              {Object.entries(headers)
                .sort(([, a], [, b]) => sortResult(a.order || -9, b.order || -8))
                .map(([field, { grow, label, sortAscending }], i) => (
                  <TableColumn
                    key={i}
                    grow={grow}
                    role="button"
                    style={{ textAlign: 'center' }}
                    onClick={() => applySorting(field)}
                    sortIcon={<FontIcon>keyboard_arrow_up</FontIcon>}
                    sorted={sortAscending}
                  >
                    {label || field}
                  </TableColumn>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.slice(paginationSlice[0], paginationSlice[1]).map((row, i) => {
              // Return a <TableRow />
              return (
                <TableRow
                  className={'cursor-pointer'}
                  onClick={debounce(() => toggleSelect({ id: row.id }))}
                  onCheckboxClick={debounce(() => toggleSelect({ id: row.id }))}
                  key={i}
                  selected={selectedIds.includes(row.id) ? true : false}
                >
                  {Object.entries(row)
                    .filter(([field]) => dataDefinitions[field] && dataDefinitions[field].show)
                    .sort(([fieldNameA], [fieldNameB]) =>
                      sortResult(dataDefinitions[fieldNameA].order || -9, dataDefinitions[fieldNameB].order || -8)
                    )
                    .map(([, value], i) => (
                      <TableColumn key={i} plain={true}>
                        {value && value.truncate ? value.truncate(140) : value}
                      </TableColumn>
                    ))}
                </TableRow>
              )
            })}
          </TableBody>
          <TablePagination
            defaultRowsPerPage={defaultPaginationRows}
            rowsPerPageItems={[5, 10, 25, 50]}
            rows={filteredData.length}
            rowsPerPageLabel={'Rows'}
            onPagination={(start, rowsPerPage) => this.setState({ paginationSlice: [start, start + rowsPerPage] })}
          />
        </DataTable>
      </>
    )
  }
}
