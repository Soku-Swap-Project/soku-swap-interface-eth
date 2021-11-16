import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { useActiveWeb3React } from '../../eth_hooks'
// import { useWeb3React } from '@web3-react/core'
import ClaimSokuModal from 'eth_components/ClaimSokuModal'

import AccountModal from 'eth_components/AccountModal'

import { useWalletModalToggle } from 'eth_state/application/hooks'
import Web3Status from '../Web3Status'

import './Menu.css'

const SokuMenu: React.FC = props => {
    const { account } = useActiveWeb3React()
    // const { login, logout } = useAuth()
    // const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
    // const { isDark, toggleTheme } = useTheme()
    // const priceData = useGetPriceData()
    // const cakePriceUsd = priceData ? Number(priceData.prices.Cake) : undefined
    // const profile = useGetLocalProfile()
    // const { onPresentConnectModal } = useWalletModal(login, logout)
    // const truncatedAddress = `${truncatedFirstHalf}...${truncatedLastHalf}`
    const toggleWalletModal = useWalletModalToggle()

    // const origin = window.location.origin

    const openHiddenLinks = () => {
        const hiddenLinks = document.getElementsByClassName('hidden_navLinks')
        // console.log(hiddenLinks)
        if (hiddenLinks[0]?.id === 'hidden_navLinks') {
            hiddenLinks[0].id = 'open'
        } else if (hiddenLinks[0]?.id === 'open') {
            hiddenLinks[0].id = 'hidden_navLinks'
        }
    }

    return (
        <div className="sokuswap__navbar">
            <nav>
                <ul className="navbar__items">
                    <NavLink to="/swap">
                        <img className="nav_logo" alt="Logo" src="images/Web-Corner-Logo.png" />
                    </NavLink>
                    <div className="navbar__options">
                        <NavLink className="nav_link" activeClassName="active" to="/swap">
                            <li>Swap</li>
                        </NavLink>
                        <NavLink className="nav_link" to="/pool" activeClassName="active">
                            <li>Pool</li>
                        </NavLink>
                        <a className="nav_link" href="https://www.binance.org/en/bridge" rel="noreferrer"  target={'_blank'}>
                            <li>Bridge</li>
                        </a>
                        {/* <NavLink className="nav_link disabled_link" to="/farms" activeClassName="active">
                            <li>Farms</li>
                        </NavLink> */}
                    </div>
                </ul>
                <ul className="connectWallet__options__DESKTOP">
                    {account ? (
                        <AccountModal />
                    ) : (
                        <li className="connectWallet__nav">
                            <button type="button" onClick={toggleWalletModal}>
                                Connect Wallet
                            </button>
                        </li>
                    )}
                    <div style={{ display: 'none' }}>
                        <Web3Status />
                    </div>

                    <li className="claimSoku__nav">
                        <ClaimSokuModal />
                    </li>
                    <li>
                        <button type="button" className="material-icons" onClick={openHiddenLinks}>
                            more_horiz
                        </button>
                    </li>
                </ul>
                <ul className="hidden_navLinks" id="hidden_navLinks">
                    <li className="hidden_navLink">
                        <a href="https://www.sokuswap.finance/" rel="noreferrer noopener" target="_blank">
                            <span className="material-icons">info</span>
                            <p>About</p>
                        </a>
                    </li>
                    <li className="hidden_navLink">
                        <a href="https://github.com/Soku-Swap-Project" rel="noreferrer noopener" target="_blank">
                            <span className="material-icons">code</span>
                            <p>Code</p>
                        </a>
                    </li>
                    <li className="hidden_navLink">
                        <a
                            href="https://sokuswap-1.gitbook.io/sokuswap-whitepaper/"
                            rel="noreferrer noopener"
                            target="_blank"
                            className="disabled_link"
                        >
                            <span className="material-icons">school</span>
                            <p>Docs</p>
                        </a>
                    </li>
                    <li className="hidden_navLink">
                        <a href="/" rel="noreferrer noopener" className="disabled_link" target="_blank">
                            <span className="material-icons">analytics</span>
                            <p>Analytics</p>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

// <UikitMenu
//   links={links}
//   account={account as string}
//   login={login}
//   logout={logout}
//   isDark={isDark}
//   toggleTheme={toggleTheme}
//   currentLang={selectedLanguage?.code || ''}
//   langs={allLanguages}
//   setLang={setSelectedLanguage}
//   cakePriceUsd={cakePriceUsd}
//   profile={profile}
//   {...props}
// />

export default SokuMenu
