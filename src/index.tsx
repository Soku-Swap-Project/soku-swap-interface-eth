import './tailwind.css'
import '@fontsource/dm-sans/index.css'
import 'react-tabs/style/react-tabs.css'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { KashiProvider } from 'kashi'
import React, { StrictMode } from 'react'
import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, HashRouter } from 'react-router-dom'
import Blocklist from './eth_components/Blocklist'
import { NetworkContextName } from './eth_constants'
import App from './eth_pages/App'
import store from './eth_state'
import ApplicationUpdater from './eth_state/application/updater'
import ListsUpdater from './eth_state/lists/updater'
import MulticallUpdater from './eth_state/multicall/updater'
import TransactionUpdater from './eth_state/transactions/updater'
import UserUpdater from './eth_state/user/updater'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import getLibrary from './utils/getLibrary'

import './i18n'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (!!window.ethereum) {
    window.ethereum.autoRefreshOnNetworkChange = false
}

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
    ReactGA.initialize(GOOGLE_ANALYTICS_ID)
    ReactGA.set({
        customBrowserType: !isMobile
            ? 'desktop'
            : 'web3' in window || 'ethereum' in window
            ? 'mobileWeb3'
            : 'mobileRegular'
    })
} else {
    ReactGA.initialize('test', { testMode: true, debug: true })
}

window.addEventListener('error', error => {
    ReactGA.exception({
        description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
        fatal: true
    })
})

function Updaters() {
    return (
        <>
            <ListsUpdater />
            <UserUpdater />
            <ApplicationUpdater />
            <TransactionUpdater />
            <MulticallUpdater />
        </>
    )
}

ReactDOM.render(
    <StrictMode>
        <FixedGlobalStyle />
        <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ProviderNetwork getLibrary={getLibrary}>
                <Blocklist>
                    <Provider store={store}>
                        <Updaters />
                        <ThemeProvider>
                            <ThemedGlobalStyle />
                            {/* <KashiProvider> */}
                            <HashRouter>
                                <App />
                            </HashRouter>
                            {/* </KashiProvider> */}
                        </ThemeProvider>
                    </Provider>
                </Blocklist>
            </Web3ProviderNetwork>
        </Web3ReactProvider>
    </StrictMode>,
    document.getElementById('root')
)
