import { Trade, TradeType } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'eth_hooks'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Field } from '../../eth_state/swap/actions'
import { useUserSlippageTolerance } from '../../eth_state/user/hooks'
import { TYPE } from '../../theme'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'
import { ExternalLink } from '../Link'

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
    const theme = useContext(ThemeContext)
    const { chainId } = useActiveWeb3React()
    const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
    const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
    const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

    return (
        <>
            <AutoColumn style={{ padding: '0 16px' }}>
                <RowBetween>
                    <RowFixed>
                        <div className="text-secondary text-sm swap_detail_primary">
                            {isExactIn ? 'Minimum received' : 'Maximum sold'}
                        </div>
                        <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
                    </RowFixed>
                    <RowFixed>
                        <div color="#04bbfb" className="text-sm text-high-emphesis swap_detail_primary">
                            {isExactIn
                                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(
                                      4
                                  )} ${trade.outputAmount.currency.getSymbol(chainId)}` ?? '-'
                                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(
                                      4
                                  )} ${trade.inputAmount.currency.getSymbol(chainId)}` ?? '-'}
                        </div>
                    </RowFixed>
                </RowBetween>
                <RowBetween>
                    <RowFixed>
                        <div className="text-secondary text-sm swap_detail_primary">Price Impact</div>
                        <QuestionHelper text="The difference between the market price and estimated price due to trade size." />
                    </RowFixed>
                    <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
                </RowBetween>

                <RowBetween>
                    <RowFixed>
                        <div className="text-secondary text-sm swap_detail_primary">Liquidity Provider Fee</div>
                        <QuestionHelper text="For each trade a 0.25% fee is paid. 0.17% goes to liquidity providers, 0.05% goes towards staking, 0.02% to the SokuSwap treasury, and 0.01% goes towards rewards." />
                    </RowFixed>
                    <div className="text-sm text-high-emphesis swap_detail_primary">
                        {realizedLPFee
                            ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.getSymbol(chainId)}`
                            : '-'}
                    </div>
                </RowBetween>
            </AutoColumn>
        </>
    )
}

export interface AdvancedSwapDetailsProps {
    trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
    const theme = useContext(ThemeContext)

    const [allowedSlippage] = useUserSlippageTolerance()

    const showRoute = Boolean(trade && trade.route.path.length > 2)

    return (
        <AutoColumn gap="0px">
            {trade && (
                <>
                    <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
                    {showRoute && (
                        <>
                            <RowBetween style={{ padding: '0 16px' }}>
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="text-secondary text-sm">Route</div>
                                    <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
                                </span>
                                <SwapRoute trade={trade} />
                            </RowBetween>
                        </>
                    )}
                    {/* {!showRoute && (
                        <div className="flex justify-center pt-3 px-4 ">
                            <ExternalLink
                                href={
                                    'https://analytics.sushi.com/pairs/' + trade.route.pairs[0].liquidityToken.address
                                }
                                className="swap_detail_secondary__link"
                            >
                                View pair analytics
                            </ExternalLink>
                        </div>
                    )} */}
                </>
            )}
        </AutoColumn>
    )
}
