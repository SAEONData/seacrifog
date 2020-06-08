import React from 'react'
import { Switch, FontIcon } from 'react-md'
import { DropdownSelect, GlobalStateContext } from '.'

const sideMenuContentStyle = { paddingLeft: '24px', paddingRight: '24px', color: 'black' }

export default ({ sites, networks, variables, protocols }) => (
  <GlobalStateContext.Consumer>
    {({
      updateGlobalState,
      selectedSites,
      selectedVariables,
      selectedNetworks,
      selectedProtocols,
      africaOnly,
    }) => (
      <div style={sideMenuContentStyle}>
        {/* Africa / Global toggle */}
        <div
          style={{
            marginTop: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex' }}>
            <FontIcon style={{ marginRight: 18 }}>my_location</FontIcon>
            <p>Africa sites only</p>
          </div>

          <Switch
            onChange={val => updateGlobalState({ africaOnly: val })}
            aria-label="Africa only toggle"
            id="global-africa-sites-toggle"
            name="africa-only"
            checked={africaOnly}
          />
        </div>

        {/* Sites filter */}
        <DropdownSelect
          id={'dropdown-select-sites'}
          label={'Filter sites'}
          selectedItems={selectedSites}
          items={sites.map(({ id, name: value }) => ({ id, value }))}
          onItemToggle={id =>
            updateGlobalState({
              selectedSites: selectedSites.includes(id)
                ? [...selectedSites].filter(sId => sId !== id)
                : [...selectedSites, id],
            })
          }
        />
        {/* Networks filter */}
        <DropdownSelect
          id={'dropdown-select-networks'}
          label={'Filter networks'}
          selectedItems={selectedNetworks}
          items={networks.map(({ id, acronym: value }) => ({ id, value }))}
          onItemToggle={id =>
            updateGlobalState(
              {
                selectedNetworks: selectedNetworks.includes(id)
                  ? [...selectedNetworks].filter(nId => nId !== id)
                  : [...selectedNetworks, id],
              },
              { currentIndex: 'currentNetwork', selectedIds: 'selectedNetworks' }
            )
          }
        />
        {/* Variables filter */}
        <DropdownSelect
          id={'dropdown-select-variables'}
          label={'Filter variables'}
          selectedItems={selectedVariables}
          items={variables.map(({ id, name: value }) => ({ id, value }))}
          onItemToggle={id =>
            updateGlobalState(
              {
                selectedVariables: selectedVariables.includes(id)
                  ? [...selectedVariables].filter(vId => vId !== id)
                  : [...selectedVariables, id],
              },
              { currentIndex: 'currentVariable', selectedIds: 'selectedVariables' }
            )
          }
        />
        {/* Protocols filter */}
        <DropdownSelect
          id={'dropdown-select-protocols'}
          label={'Filter protocols'}
          selectedItems={selectedProtocols}
          items={protocols.map(({ id, title: value }) => ({ id, value }))}
          onItemToggle={id =>
            updateGlobalState(
              {
                selectedProtocols: selectedProtocols.includes(id)
                  ? [...selectedProtocols].filter(pId => pId !== id)
                  : [...selectedProtocols, id],
              },
              { currentIndex: 'currentProtocol', selectedIds: 'selectedProtocols' }
            )
          }
        />
      </div>
    )}
  </GlobalStateContext.Consumer>
)
