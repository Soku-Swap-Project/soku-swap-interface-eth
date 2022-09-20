import { Currency, JSBI, Pair, Percent, Token, TokenAmount } from '@sushiswap/sdk'
import { Pair as UniswapPair } from '@uniswap/sdk'
import { darken, transparentize } from 'polished'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import { BIG_INT_ZERO } from '../../eth_constants'
import { useTotalSupply } from '../../eth_data/TotalSupply'
import { useActiveWeb3React } from '../../eth_hooks'
import { useColor } from '../../eth_hooks/useColor'
import { useTokenBalance } from '../../eth_state/wallet/hooks'
import { TYPE } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { ButtonEmpty, ButtonPrimary, ButtonPrimaryNormal } from '../ButtonLegacy'
import Card, { GreyCard, LightCard, WhiteCard } from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import { Dots } from '../swap/styleds'

export const FixedHeightRow = styled(RowBetween)`
    height: 24px;
`

export const HoverCard = styled(Card)`
    border: 1px solid ${({ theme }) => darken(0.06, theme.colors.invertedContrast)};
    padding: 20px;
`
const StyledPositionCard = styled(LightCard)<{ bgColor: any }>`
  border: 1px solid #f0f0f0;
//   border: none
  background: #ECF1F8;
  /* background: ${({ theme, bgColor }) =>
      `radial-gradient(91.85% 100% at 1.84% 0%, ${transparentize(0.8, bgColor)} 0%, ${theme.bg3} 100%) `}; */
  position: relative;
//   overflow: hidden;
  padding: 20px;
  border-radius: 7px;
  cursor: pointer;
`

interface PositionCardProps {
    pair: Pair | UniswapPair
    showUnwrapped?: boolean
    border?: string
    stakedBalance?: TokenAmount // optional balance to indicate that liquidity is deposited in mining pool
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
    const { account, chainId } = useActiveWeb3React()

    const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0 as Token)
    const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1 as Token)

    const [showMore, setShowMore] = useState(false)

    const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken as Token)
    const totalPoolTokens = useTotalSupply(pair.liquidityToken as Token)

    // const poolTokenPercentage =
    //     !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
    //         ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
    //         : undefined

    const [token0Deposited, token1Deposited] =
        !!pair &&
        !!totalPoolTokens &&
        !!userPoolBalance &&
        // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
        JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
            ? [
                  pair.getLiquidityValue(pair.token0 as any, totalPoolTokens as any, userPoolBalance as any, false),
                  pair.getLiquidityValue(pair.token1 as any, totalPoolTokens as any, userPoolBalance as any, false)
              ]
            : [undefined, undefined]

    return (
        <>
            {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
                <WhiteCard className="emphasized_swap_layout">
                    <AutoColumn gap="12px">
                        <FixedHeightRow>
                            <RowFixed>
                                <Text
                                    fontWeight={600}
                                    fontSize={14}
                                    color={'#7f7f7f'}
                                    style={{ textTransform: 'uppercase' }}
                                >
                                    LP Tokens in your Wallet
                                </Text>
                            </RowFixed>
                        </FixedHeightRow>
                        <FixedHeightRow onClick={() => setShowMore(!showMore)}>
                            <RowFixed>
                                <DoubleCurrencyLogo
                                    currency0={currency0 as any}
                                    currency1={currency1 as any}
                                    margin={true}
                                    size={20}
                                />
                                <Text fontWeight={500} fontSize={14} color={'#05195a'}>
                                    {currency0.symbol}/{currency1?.symbol}
                                </Text>
                            </RowFixed>
                            <RowFixed>
                                <Text fontWeight={500} fontSize={14} color={'#05195a'}>
                                    &nbsp; {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                                </Text>
                            </RowFixed>
                        </FixedHeightRow>
                        <AutoColumn gap="4px">
                            {/* <FixedHeightRow>
                                <Text fontSize={16} fontWeight={500}>
                                    Your pool share:
                                </Text>
                                <Text fontSize={16} fontWeight={500}>
                                    {poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}
                                </Text>
                            </FixedHeightRow> */}
                            <FixedHeightRow>
                                <Text fontSize={14} color={'#05195a'} fontWeight={500}>
                                    {currency0.symbol}:
                                </Text>
                                {token0Deposited ? (
                                    <RowFixed>
                                        <Text fontSize={14} color={'#05195a'} fontWeight={500} marginLeft={'6px'}>
                                            {token0Deposited?.toSignificant(6)}
                                        </Text>
                                    </RowFixed>
                                ) : (
                                    '-'
                                )}
                            </FixedHeightRow>
                            <FixedHeightRow>
                                <Text fontSize={14} color={'#05195a'} fontWeight={500}>
                                    {currency1.symbol}:
                                </Text>
                                {token1Deposited ? (
                                    <RowFixed>
                                        <Text fontSize={14} color={'#05195a'} fontWeight={500} marginLeft={'6px'}>
                                            {token1Deposited?.toSignificant(6)}
                                        </Text>
                                    </RowFixed>
                                ) : (
                                    '-'
                                )}
                            </FixedHeightRow>
                        </AutoColumn>
                    </AutoColumn>
                </WhiteCard>
            ) : null
            // <LightCard>
            //     <TYPE.subHeader style={{ textAlign: 'center' }}>
            //         <span role="img" aria-label="wizard-icon">
            //             ⭐️
            //         </span>{' '}
            //         By adding liquidity you&apos;ll earn 0.25% of all trades on this pair proportional to your share
            //         of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing
            //         your liquidity.
            //     </TYPE.subHeader>
            // </LightCard>
            }
        </>
    )
}

export default function FullPositionCard({ pair, border, stakedBalance }: PositionCardProps) {
    const { account, chainId } = useActiveWeb3React()

    const currency0 = unwrappedToken(pair.token0 as Token)
    const currency1 = unwrappedToken(pair.token1 as Token)

    const [showMore, setShowMore] = useState(false)

    // console.log(pair, 'pair')

    const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken as Token)
    const totalPoolTokens = useTotalSupply(pair.liquidityToken as Token)

    // if staked balance balance provided, add to standard liquidity amount
    const userPoolBalance = stakedBalance ? userDefaultPoolBalance?.add(stakedBalance) : userDefaultPoolBalance

    const poolTokenPercentage =
        !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
            ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
            : undefined

    const [token0Deposited, token1Deposited] =
        !!pair &&
        !!totalPoolTokens &&
        !!userPoolBalance &&
        // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
        JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
            ? [
                  pair.getLiquidityValue(pair.token0 as any, totalPoolTokens as any, userPoolBalance as any, false),
                  pair.getLiquidityValue(pair.token1 as any, totalPoolTokens as any, userPoolBalance as any, false)
              ]
            : [undefined, undefined]

    const backgroundColor = useColor(pair?.token0 as Token)

    return (
        <StyledPositionCard
            style={{ marginTop: '10px', marginBottom: '10px' }}
            className="hover_transparent"
            bgColor={backgroundColor}
        >
            <AutoColumn gap="12px">
                <FixedHeightRow onClick={() => setShowMore(!showMore)}>
                    <AutoRow gap="8px">
                        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
                        <Text fontWeight={500} fontSize={16}>
                            {!currency0 || !currency1 ? (
                                <Dots>Loading</Dots>
                            ) : (
                                `${currency0.getSymbol(chainId)}/${currency1.getSymbol(chainId)}`
                            )}
                        </Text>
                    </AutoRow>
                    <RowFixed gap="8px">
                        <ButtonEmpty padding="6px 8px" borderRadius="20px" width="fit-content">
                            {showMore ? (
                                <>
                                    <ChevronUp size="20" style={{ marginLeft: '10px' }} />
                                </>
                            ) : (
                                <>
                                    <ChevronDown size="20" style={{ marginLeft: '10px' }} />
                                </>
                            )}
                        </ButtonEmpty>
                    </RowFixed>
                </FixedHeightRow>

                {showMore && (
                    <AutoColumn gap="30px">
                        <FixedHeightRow>
                            <Text fontSize={16} fontWeight={500}>
                                Your total pool tokens:
                            </Text>
                            <Text fontSize={16} fontWeight={500}>
                                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                            </Text>
                        </FixedHeightRow>
                        {stakedBalance && (
                            <FixedHeightRow>
                                <Text fontSize={16} fontWeight={500}>
                                    Pool tokens in rewards pool:
                                </Text>
                                <Text fontSize={16} fontWeight={500}>
                                    {stakedBalance.toSignificant(4)}
                                </Text>
                            </FixedHeightRow>
                        )}
                        <FixedHeightRow>
                            <RowFixed>
                                <Text fontSize={16} fontWeight={500}>
                                    Pooled {currency0?.getSymbol(chainId)}:
                                </Text>
                            </RowFixed>
                            {token0Deposited ? (
                                <RowFixed>
                                    <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                                        {token0Deposited?.toSignificant(6)}
                                    </Text>
                                    <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency0} />
                                </RowFixed>
                            ) : (
                                '-'
                            )}
                        </FixedHeightRow>

                        <FixedHeightRow>
                            <RowFixed>
                                <Text fontSize={16} fontWeight={500}>
                                    Pooled {currency1?.getSymbol(chainId)}:
                                </Text>
                            </RowFixed>
                            {token1Deposited ? (
                                <RowFixed>
                                    <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                                        {token1Deposited?.toSignificant(6)}
                                    </Text>
                                    <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency1} />
                                </RowFixed>
                            ) : (
                                '-'
                            )}
                        </FixedHeightRow>

                        <FixedHeightRow>
                            <Text fontSize={16} fontWeight={500}>
                                Your pool share:
                            </Text>
                            <Text fontSize={16} fontWeight={500}>
                                {poolTokenPercentage
                                    ? (poolTokenPercentage.toFixed(2) === '0.00'
                                          ? '<0.01'
                                          : poolTokenPercentage.toFixed(2)) + '%'
                                    : '-'}
                            </Text>
                        </FixedHeightRow>

                        {/* <ButtonSecondary padding="8px" borderRadius="8px">
              <ExternalLink
                style={{ width: '100%', textAlign: 'center' }}
                href={`https://uniswap.info/account/${account}`}
              >
                View accrued fees and analytics<span style={{ fontSize: '11px' }}>↗</span>
              </ExternalLink>
            </ButtonSecondary> */}
                        {userDefaultPoolBalance && JSBI.greaterThan(userDefaultPoolBalance.raw, BIG_INT_ZERO) && (
                            <RowBetween marginTop="10px">
                                <ButtonPrimaryNormal
                                    className="emphasize_swap_button hover_shadow"
                                    padding="14px"
                                    borderRadius="16px"
                                    as={Link}
                                    to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                                    width="48%"
                                    style={{ fontWeight: 'bold', background: '#04bbfb' }}
                                >
                                    Add
                                </ButtonPrimaryNormal>
                                <ButtonPrimaryNormal
                                    className="emphasize_swap_button hover_shadow"
                                    padding="14px"
                                    borderRadius="16px"
                                    as={Link}
                                    width="48%"
                                    to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                                    style={{ fontWeight: 'bold', background: '#04bbfb' }}
                                >
                                    Remove
                                </ButtonPrimaryNormal>
                            </RowBetween>
                        )}
                        {stakedBalance && JSBI.greaterThan(stakedBalance.raw, BIG_INT_ZERO) && (
                            <ButtonPrimary
                                className="emphasize_swap_button hover_shadow"
                                padding="14px"
                                borderRadius="16px"
                                as={Link}
                                to={`/uni/${currencyId(currency0)}/${currencyId(currency1)}`}
                                width="100%"
                                style={{ fontWeight: 'bold' }}
                            >
                                Manage Liquidity in Rewards Pool
                            </ButtonPrimary>
                        )}
                    </AutoColumn>
                )}
            </AutoColumn>
        </StyledPositionCard>
    )
}
