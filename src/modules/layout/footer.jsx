import React from 'react'
import { Grid, Cell } from 'react-md'
import partners from '../../partners'

// TODO - the is also on the home page
const Wrapper = ({ children }) => <div className="sf-wrapper">{children}</div>
const Content = ({ children, style }) => (
  <div style={style ? style : {}} className="sf-content">
    {children}
  </div>
)

const footerHeaderStyle = {
  margin: '48px'
}

const Partner = ({ href, name }) => (
  <a style={{ padding: '4px' }} rel="noopener noreferrer" target="_blank" className="white link" href={href}>
    {name || '??'}
  </a>
)

export default () => (
  <>
    <Grid noSpacing>
      {/* Copyright */}
      <Cell size={12} className="sf-container primary">
        <Wrapper>
          <Content>
            <span className="white">© SEACRIOG 2019</span>
          </Content>
        </Wrapper>
      </Cell>
    </Grid>
    <Grid noSpacing>
      <Cell size={12} className="sf-container">
        <Wrapper>
          <Content>
            <Grid>
              {/* Partner list */}
              <Cell phoneSize={4} tabletSize={4} size={4}>
                <h3 style={footerHeaderStyle} className="white">
                  PARTNERS
                </h3>
                <Grid noSpacing style={{ textAlign: 'left' }}>
                  <Cell phoneSize={4} tabletSize={4} size={6}>
                    {[...partners]
                      .splice(0, Math.ceil(partners.length / 2))
                      .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
                      .map((p, i) => (
                        <Partner key={i} href={p.href} name={p.name} />
                      ))}
                  </Cell>
                  <Cell phoneSize={4} tabletSize={4} size={6}>
                    {[...partners]
                      .splice(Math.ceil(partners.length / 2), partners.length)
                      .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
                      .map((p, i) => (
                        <Partner key={i} href={p.href} name={p.name} />
                      ))}
                  </Cell>
                </Grid>
              </Cell>

              {/* Site navigation */}
              <Cell phoneSize={4} tabletSize={4} size={4}>
                <h3 style={footerHeaderStyle} className="white">
                  SITE NAVIGATION
                </h3>
                <a className="white link" href="/home">
                  Home
                </a>
                <br />
                <a className="white link" href="/sites">
                  Sites
                </a>
                <br />
                <a className="white link" href="/networks">
                  Networks
                </a>
                <br />
                <a className="white link" href="/variables">
                  Variables
                </a>
                <br />
                <a className="white link" href="/protocols">
                  Protocols
                </a>
                <br />
              </Cell>

              {/* Contact us */}
              <Cell phoneSize={4} tabletSize={4} size={4}>
                <h3 style={footerHeaderStyle} className="white">
                  CONTACT US
                </h3>
                <address style={{ fontStyle: 'normal' }}>
                  <a className="white link" href="mailto:zach@saeon.ac.za" target="_blank" rel="noopener noreferrer">
                    SAEON Ulwazi
                  </a>
                  <p className="white">CURRENT MAINTAINER</p>

                  <p className="white">
                    SAEON uLwazi Node, Hertzog Blvd
                    <br />
                    Foreshore, Cape Town
                    <br />
                    South Africa
                    <br />
                    8001
                  </p>
                  <p className="white">
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      className="white link"
                      href="https://www.google.com/maps/dir/-33.919964,18.4276409/SAEON+uLwazi+Node,+Hertzog+Blvd,+Foreshore,+Cape+Town,+8001/@-33.9200695,18.4256864,17z/data=!3m1!4b1!4m17!1m6!3m5!1s0x1dcc5df2bfdcb0a9:0x8086aad31da973bf!2sSAEON+uLwazi+Node!8m2!3d-33.9200261!4d18.42803!4m9!1m1!4e1!1m5!1m1!1s0x1dcc5df2bfdcb0a9:0x8086aad31da973bf!2m2!1d18.42803!2d-33.9200261!3e2"
                    >
                      DIRECTIONS
                    </a>
                  </p>
                </address>
              </Cell>
            </Grid>
          </Content>
        </Wrapper>
      </Cell>
    </Grid>
  </>
)
