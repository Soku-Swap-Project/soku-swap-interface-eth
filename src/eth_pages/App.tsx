import { ChainId } from '@sushiswap/sdk'
import React, { Suspense, useEffect, useRef } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
// import Header from '../eth_components/Header'
import Polling from '../eth_components/Header/Polling'
import Popups from '../eth_components/Popups'
import Web3ReactManager from '../eth_components/Web3ReactManager'
import ClaimSokuModal from '../eth_components/ClaimSokuModal'
import PublicRoute from '../hocs/PublicRoute'
import SokuMenu from '../eth_components/SokuMenu'
import SlideOutMenu from '../eth_components/SlideOutMenu/SlideOutMenu'
import { useActiveWeb3React } from '../eth_hooks/index'
import { useWalletModalToggle } from '../eth_state/application/hooks'
import Connect from '../kashi/pages/Connect'

import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import {
    RedirectDuplicateTokenIds,
    RedirectOldAddLiquidityPathStructure,
    RedirectToAddLiquidity
} from './AddLiquidity/redirects'

import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
import MigrateV2 from './MigrateV2'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import ComingSoon from './ComingSoon'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'

import Swap from './Swap'
import {
    RedirectHashRoutes,
    // OpenClaimAddressModalAndRedirectToSwap,
    RedirectPathToSwapOnly,
    RedirectToSwap
} from './Swap/redirects'
// Additional Tools
// import Tools from './Tools'
// import Vesting from './Vesting'
// import Yield from './Yield'
import ReactGA from 'react-ga'
import Maintenance from './Maintenance'

import './MobileFooter.css'

function App(): JSX.Element {
    const { account, chainId } = useActiveWeb3React()
    const bodyRef = useRef<any>(null)
    const toggleWalletModal = useWalletModalToggle()

    const { pathname, search } = useLocation()

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTo(0, 0)
        }
    }, [pathname])

    useEffect(() => {
        ReactGA.pageview(`${pathname}${search}`)
    }, [pathname, search])

    const truncatedFirstHalf = account?.substring(0, 5)
    const truncatedLastHalf = account?.substring(account.length - 5, account.length)
    const truncatedAddress = `${truncatedFirstHalf}...${truncatedLastHalf}`

    const isMobile = window.innerWidth <= 500

    return (
        <Suspense fallback={null}>
            <Route component={DarkModeQueryParamReader} />
            <div className="flex flex-col items-start ">
                <div className="flex flex-row flex-nowrap justify-between w-screen ">
                    {isMobile ? <SlideOutMenu /> : <SokuMenu />}
                </div>
                <div
                    ref={bodyRef}
                    className="flex flex-col flex-1 items-center justify-start w-screen h-full overflow-y-auto overflow-x-hidden z-0 pt-8 sm:pt-10 md:pt-8 pb-10"
                >
                    <Popups />
                    <Polling />
                    <Web3ReactManager>
                        <Switch>
                            <PublicRoute exact path="/connect" component={Connect} />
                            {/* BentoApps */}
                            {/* <Route exact strict path="/bento" component={Bento} />
                                <WalletRoute exact strict path="/bento/balances" component={BentoBalances} /> */}

                            {/* Kashi */}
                            {/* <Route
                                    exact
                                    strict
                                    path="/bento/kashi"
                                    render={props => <Redirect to="/bento/kashi/borrow" {.  ..props} />}
                                />
                                <WalletRoute exact strict path="/bento/kashi/lend" component={LendMarkets} />
                                <WalletRoute exact strict path="/bento/kashi/borrow" component={BorrowMarkets} />
                                <WalletRoute exact strict path="/bento/kashi/create" component={CreateMarkets} />
                                <WalletRoute exact strict path="/bento/kashi/lend/:pairAddress" component={LendPair} />
                                <WalletRoute exact strict path="/bento/kashi/borrow/:pairAddress" component={BorrowPair} /> */}

                            {/* <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
                                <Route exact strict path="/farms" component={Yield} />
                                <Route exact strict path="/vesting" component={Vesting} /> */}
                            {/* {chainId === ChainId.MAINNET && (
                                    <Route exact strict path="/migrate/v2" component={MigrateV2} />
                                )} */}

                            {/* Tools */}
                            {/* <Route exact strict path="/tools" component={Tools} />
                                <Route exact strict path="/saave" component={Saave} /> */}

                            {/* Pages */}
                            {/* {chainId === ChainId.MAINNET && <Route exact strict path="/stake" component={SushiBar} />} */}
                            <Route exact strict path="/" render={() => <Redirect to="/swap" />} />
                            {/* <Route exact path="/sushibar" render={() => <Redirect to="/stake" />} /> */}
                            <Route exact strict path="/swap" component={Swap} />
                            <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                            <Route exact strict path="/bridge" component={ComingSoon} />
                            <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
                            <Route exact strict path="/find" component={PoolFinder} />
                            <Route exact strict path="/pool" component={Pool} />
                            <Route exact strict path="/create" component={RedirectToAddLiquidity} />
                            <Route exact path="/add" component={AddLiquidity} />
                            <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                            <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                            <Route exact path="/create" component={AddLiquidity} />
                            <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                            <Route
                                exact
                                path="/create/:currencyIdA/:currencyIdB"
                                component={RedirectDuplicateTokenIds}
                            />
                            <Route exact strict path="/remove/v1/:address" component={RemoveV1Exchange} />
                            <Route
                                exact
                                strict
                                path="/remove/:tokens"
                                component={RedirectOldRemoveLiquidityPathStructure}
                            />
                            <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

                            {/* Redirects for app routes */}
                            <Route
                                exact
                                strict
                                path="/token/:address"
                                render={({
                                    match: {
                                        params: { address }
                                    }
                                }) => <Redirect to={`/swap/${address}`} />}
                            />
                            <Route
                                exact
                                strict
                                path="/pair/:address"
                                render={({
                                    match: {
                                        params: { address }
                                    }
                                }) => <Redirect to={`/pool`} />}
                            />

                            {/* Redirects for Legacy Hash Router paths */}
                            <Route exact strict path="/" component={RedirectHashRoutes} />
                            {/* Catch all */}
                            <Route component={RedirectPathToSwapOnly} />
                        </Switch>
                    </Web3ReactManager>
                </div>
                <div className="connectWallet__options__MOBILE">
                    <ul>
                        {account ? (
                            <li className="account__footer">Account: {truncatedAddress}</li>
                        ) : (
                            <li className="connectWallet" onClick={toggleWalletModal}>
                                <button type="button">Connect Wallet</button>
                            </li>
                        )}
                        <li className="claimSoku">
                            <ClaimSokuModal />
                        </li>
                        <li>
                            <button
                                type="submit"
                                className="material-icons"
                                style={{ backgroundColor: '#ebebeb', color: '#05195a', padding: '2px 5px' }}
                            >
                                more_horiz
                            </button>
                        </li>
                    </ul>
                    <ul className="hidden_navLinksMobile" id="hidden_navLinks">
                        <li>
                            <a href="https://www.sokuswap.finance/" rel="noreferrer noopener" target="_blank">
                                <span className="material-icons">info</span>
                                <p>About</p>
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/Soku-Swap-Project" rel="noreferrer noopener" target="_blank">
                                <span className="material-icons">code</span>
                                <p>Code</p>
                            </a>
                        </li>
                        <li>
                            <a href="/" rel="noreferrer noopener" target="_blank">
                                <span className="material-icons">analytics</span>
                                <p>Analytics</p>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </Suspense>
    )
}

export default App
