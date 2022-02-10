import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import TelegramIcon from '@mui/icons-material/Telegram'
import TwitterIcon from '@mui/icons-material/Twitter'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useActiveWeb3React } from '../../eth_hooks'
// import { useWeb3React } from '@web3-react/core'
import ClaimSokuModal from 'eth_components/ClaimSokuModal'
import useTransak from 'eth_hooks/useTransak'

import AccountModal from 'eth_components/AccountModal'

import { useWalletModalToggle } from 'eth_state/application/hooks'
import Web3Status from '../Web3Status'

import './Menu.css'

const SokuMenu: React.FC = props => {
    const { account } = useActiveWeb3React()
    const { launchTransak } = useTransak()
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
                        <NavLink className="nav_link" to="/bridge" activeClassName="active">
                            <li>Bridge</li>
                        </NavLink>
                        {/* <a className="nav_link" href={`${origin}/bsc/#/deposit`}>
                            <li>Deposit</li>
                        </a> */}
                        <a className="nav_link" onClick={() => launchTransak()}>
                            <li>Deposit</li>
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
                    <li>
                        <a href="/" rel="noreferrer noopener" className="disabled_link" target="_blank">
                            <span className="material-icons">analytics</span>
                            <p>Analytics</p>
                        </a>
                    </li>

                    <li className="hidden_navLink">
                        <a
                            href="https://sokuswap-2.gitbook.io/sokuswap-gitbook/"
                            rel="noreferrer noopener"
                            target="_blank"
                        >
                            <span className="material-icons">school</span>
                            <p>Docs</p>
                        </a>
                    </li>
                    <li className="hidden_navLink">
                        <a href="https://github.com/Soku-Swap-Project" rel="noreferrer noopener" target="_blank">
                            <GitHubIcon />
                            <p>GitHub</p>
                        </a>
                    </li>
                    <div
                        className="social_icon_header"
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '12px' }}
                    >
                        <p style={{ fontSize: '14px', marginLeft: '-5px' }} className="hidden_navLink">
                            Social Links
                        </p>
                    </div>
                    <div className="social_icon_row" style={{ display: 'flex', justifyContent: 'center' }}>
                        <hr
                            style={{ width: '65%', marginTop: '10px', paddingTop: '0', borderWidth: '1px' }}
                            className="disabled_link"
                        />
                    </div>

                    <li className="hidden_navLink" style={{ paddingTop: '16px' }}>
                        <a href="https://t.me/SokuSwap" rel="noreferrer noopener" target="_blank">
                            <TelegramIcon />
                            <p>Telegram</p>
                        </a>
                    </li>
                    <li className="hidden_navLink">
                        <a href="https://twitter.com/sokuswap" rel="noreferrer noopener" target="_blank">
                            <TwitterIcon />
                            <p>Twitter</p>
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
