import React from 'react'
import { Grid, Cell, Divider } from 'react-md'
import partners from '../../partners'
import FundingAcknowledgement from './funding-acknowledgement'
import { Button, Avatar } from 'react-md'
import { useHistory } from 'react-router-dom'
import SitesMap from './sites-map'
import Footer from '../../modules/layout/footer'

const avatarStyle = { fontSize: '11px', fontFamily: 'Open Sans' }

const Icon = ({ symbol, suffix }) => (
  <Avatar suffix={suffix} contentStyle={avatarStyle} iconSized>
    {symbol}
  </Avatar>
)

const Wrapper = ({ children }) => <div className="sf-wrapper">{children}</div>
const Content = ({ children, style, className = '' }) => (
  <div className={'sf-content ' + className} style={style ? style : {}}>
    {children}
  </div>
)

const euFunding = partners[0]
const sfFunding = partners[1]
const sasccalPartner = partners[17]

const mainPartnerStyle = {
  maxHeight: '60px',
  display: 'block',
  margin: 'auto'
}

export default () => {
  const history = useHistory()
  return (
    <>
      <Grid noSpacing>
        <Cell size={12} className="sf-container">
          <Wrapper>
            <Content>
              <h1 className="white">SEACRIFOG INVENTORY TOOL</h1>
              <Divider style={{ margin: '12px' }} />
              <h3 className="white link" onClick={() => history.push('/sites')} style={{ margin: 0 }}>
                Explore Africa&apos;s carbon observation platform network
              </h3>
            </Content>
          </Wrapper>
        </Cell>
        <Cell phoneHidden style={{ padding: 0 }} size={12} className="sf-container inverse">
          <Content className="homepage-map" style={{ margin: 0, padding: 0, textAlign: 'center' }}>
            <SitesMap />
          </Content>
        </Cell>
        <Cell size={12} className="sf-container primary">
          <Wrapper>
            <Content>
              <Button
                className="white link homepage-button"
                onClick={() => history.push('/sites')}
                flat
                swapTheming
                iconChildren={<Icon symbol="S" suffix="lime" />}
              >
                Explore Sites
              </Button>
              <Button
                className="white link homepage-button"
                onClick={() => history.push('/networks')}
                flat
                swapTheming
                iconChildren={<Icon symbol="N" suffix="teal" />}
              >
                Explore Networks
              </Button>
              <Button
                className="white link homepage-button"
                onClick={() => history.push('/variables')}
                flat
                swapTheming
                iconChildren={<Icon symbol="V" suffix="light-blue" />}
              >
                Explore Variables
              </Button>
              <Button
                className="white link homepage-button"
                onClick={() => history.push('/protocols')}
                flat
                swapTheming
                iconChildren={<Icon symbol="P" suffix="cyan" />}
              >
                Explore Protocols
              </Button>
            </Content>
          </Wrapper>
        </Cell>
        <Cell size={12} className="sf-container inverse">
          <Wrapper>
            <Content>
              <Grid>
                <Cell phoneSize={4} tabletSize={8} size={4}>
                  <img style={mainPartnerStyle} src={euFunding.logo} alt={euFunding.alt} />
                  <p style={{ paddingTop: '10px' }}>
                    This project has received funding from the European Union&apos;s Horizon 2020 research and
                    innovation programme under grant agreement No 730995
                  </p>
                </Cell>
                <Cell phoneSize={4} tabletSize={8} size={4}>
                  <img style={mainPartnerStyle} src={sasccalPartner.logo} alt={sasccalPartner.alt} />
                  <p style={{ paddingTop: '10px' }}>
                    The SEACRIFOG metadata search tool is based on previously existing work by{' '}
                    <a className="link" href={sasccalPartner.href} target="_blank" rel="noopener noreferrer"></a>
                    <a
                      className="link"
                      href="https://seacrifog-tool.sasscal.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      seacrifog-tool.sasscal.org/
                    </a>
                  </p>
                </Cell>
                <Cell phoneSize={4} tabletSize={8} size={4}>
                  <img style={mainPartnerStyle} src={sfFunding.logo} alt={sfFunding.alt} />
                  <p style={{ paddingTop: '10px' }}>
                    Supporting EU-African Cooperation on Research Infrastructures for Food Security and Greenhouse Gas
                    Observations
                  </p>
                </Cell>
              </Grid>
            </Content>
          </Wrapper>
        </Cell>
        <Cell size={12} className="sf-container secondary">
          <Wrapper>
            <Content>
              <Grid>
                <Cell phoneSize={4} tabletSize={8} size={6}>
                  <h2 style={{ marginBottom: '36px' }}>Carbon Observation Platform Explorer</h2>
                  <p className={'justify'}>
                    {
                      <a className="link" href="http://www.seacrifog.eu/" target="_blank" rel="noopener noreferrer">
                        SEACRIFOG
                      </a>
                    }{' '}
                    aims to design a continental network of research infrastructures for the observation of climate
                    change and other environmental changes linked to greenhouse gas emissions and food security across
                    the African continent and the surrounding oceans.
                  </p>
                  <p className={'justify'}>
                    The SEACRIFOG Collaborative Inventory Tool serves to systematically capture information on relevant
                    variables, observation infrastructures, existing data products and methodological protocols. The
                    tool further serves as a public resource, informing about the state of environmental observation
                    across the African continent and the surrounding oceans and supporting research infrastructure
                    development.
                  </p>
                  <p className={'justify'}>
                    For further reading on the SEACRIFOG project and its outcomes to date, please click{' '}
                    {
                      <a
                        className="link"
                        href="https://www.seacrifog.eu/publications/publications/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        here
                      </a>
                    }
                  </p>
                </Cell>
                <Cell phoneSize={4} tabletSize={8} size={6}>
                  <Grid noSpacing>
                    {partners.slice(2, partners.length).map((item, i) => (
                      <FundingAcknowledgement
                        key={i}
                        imgPath={item.logo}
                        alt={item.alt}
                        content={
                          <>
                            {item.content.split('\n').map((c, i) => (
                              <p key={i}>{c}</p>
                            ))}
                            <a className="link" target="_blank" rel="noopener noreferrer" href={item.href}>
                              more information
                            </a>
                          </>
                        }
                      />
                    ))}
                  </Grid>
                </Cell>
              </Grid>
            </Content>
          </Wrapper>
        </Cell>
      </Grid>
      <Footer />{' '}
    </>
  )
}
