import React, { Component, Fragment } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFont, faLanguage, faAsterisk, faPencilAlt } from '@fortawesome/free-solid-svg-icons'


import '../styles/App.css';

import AlignSec from './Align'
import TokenizeSec from './Tokenize'
import AstredSec from './Astred'
import PageFooter from './PageFooter'

import { scrollIntoView } from '../utils'


library.add(faFont, faLanguage, faAsterisk, faPencilAlt)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      srcStr: 'Sometimes she asks me why I used to call her father Harold',
      tgtStr: 'Soms vraagt ze waarom ik haar vader Harold noemde',
      srcLang: 'en',
      tgtLang: 'nl',
      srcTokStr: '',
      srcWords: [],
      tgtTokStr: '',
      tgtWords: [],
      wordAlignsStr: '',
      wordAligns: [],
      astred: {}
    };
    // Languages that we support and their abbreviations for the parsers
    this.langs = [['English', 'en'], ['Dutch', 'nl']]

    this.onAppStateChange = this.onAppStateChange.bind(this);
    this.onWordAlignFetch = this.onWordAlignFetch.bind(this);
    this.onTokenizeFetch = this.onTokenizeFetch.bind(this);
    this.onAstredFetch = this.onAstredFetch.bind(this);

    this.alignSec = React.createRef();
  }

  tokStrToWords(tok) {
    return tok.split(" ").filter(Boolean).map(text => {return {text: text}})
  }

  onTokenizeFetch(tokenizeInfo) {
    this.setState({
      ...tokenizeInfo,
      ...{
        srcWords: this.tokStrToWords(tokenizeInfo.srcTokStr),
        tgtWords: this.tokStrToWords(tokenizeInfo.tgtTokStr),

      }
    })
    // Need to validate here for cases where we tokenize, then remove everything in tok field, and then tokenize again
    // otherwise the field will not be revalidated and still considered invalid
    this.alignSec.current.validateAllFields(true)    
    scrollIntoView(document.querySelector("#align"))
  }

  onAppStateChange(prop, val) {
    if (prop === "srcTokStr") {
      // Filter false-y values (particularly empty strings)
      this.setState({ srcWords: this.tokStrToWords(val), srcTokStr: val })
      return
    } else if (prop === "tgtTokStr") {
      this.setState({ tgtWords: this.tokStrToWords(val), tgtTokStr: val })
      return
    }

    this.setState({ [prop]: val })
  }

  onAstredFetch(astredInfo) {
    this.setState({ astred: astredInfo })
    scrollIntoView(document.querySelector("#astred"))
  }

  onWordAlignFetch(alignInfo) {
    this.setState(alignInfo)
    scrollIntoView(document.querySelector("#align"))
  }

  render() {
    return (
      <Fragment>
        <main className="page-wrapper">
          <TokenizeSec
            onAppStateChange={this.onAppStateChange}
            onTokenizeFetch={this.onTokenizeFetch}
            srcStr={this.state.srcStr}
            srcLang={this.state.srcLang}
            tgtStr={this.state.tgtStr}
            tgtLang={this.state.tgtLang}
            langs={this.langs} />

          <AlignSec
            ref={this.alignSec}
            onAppStateChange={this.onAppStateChange}
            onWordAlignFetch={this.onWordAlignFetch}
            onAstredFetch={this.onAstredFetch}
            srcTokStr={this.state.srcTokStr}
            srcWords={this.state.srcWords}
            tgtTokStr={this.state.tgtTokStr}
            tgtWords={this.state.tgtWords}
            wordAlignsStr={this.state.wordAlignsStr}
            wordAligns={this.state.wordAligns}
            srcLang={this.state.srcLang}
            tgtLang={this.state.tgtLang}
          />

          <AstredSec
            astred={this.state.astred}
          />
        </main>
        <PageFooter />
      </Fragment>
    )
  }
}

export default App;
