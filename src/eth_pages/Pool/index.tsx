import { ChainId, JSBI, Pair } from '@sushiswap/sdk'
import { transparentize } from 'polished'
import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { ButtonPrimaryNormal, ButtonSecondary } from '../../eth_components/ButtonLegacy'
import Question from '../../eth_components/QuestionHelper'
import CardNav from '../../eth_components/CardNav'
import Card from '../../eth_components/Card'
import { AutoColumn } from '../../eth_components/Column'
import { CardSection, DataCard } from '../../eth_components/earn/styled'
import { SwapPoolTabs } from '../../eth_components/NavigationTabs'
import FullPositionCard from '../../eth_components/PositionCard'
import { RowBetween, RowFixed } from '../../eth_components/Row'
import { Dots } from '../../eth_components/swap/styleds'
import { BIG_INT_ZERO } from '../../eth_constants'
import { usePairs } from '../../eth_data/Reserves'
import { useUserHasLiquidityInAllTokens } from '../../eth_data/V1'
import { useActiveWeb3React } from '../../eth_hooks'
import { useStakingInfo } from '../../eth_state/stake/hooks'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../eth_state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from '../../eth_state/wallet/hooks'
import { HideSmall, StyledInternalLink, TYPE } from '../../theme'
import MobileHeader from '../../eth_components/MobileHeader'
// import Alert from '../../eth_components/Alert'
import { Helmet } from 'react-helmet'
import { Flex } from '@pancakeswap-libs/uikit'

const PageWrapper = styled(AutoColumn)`
    max-width: 640px;
    width: 100%;
    // padding: 16px;
`

const VoteCard = styled(DataCard)`
  background: ${({ theme }) => transparentize(0.5, theme.bg1)};
  /* border: 1px solid ${({ theme }) => theme.text4}; */
  overflow: hidden;
`

const TitleRow = styled(RowBetween)`
    padding: 14px !important;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const ButtonRow = styled(RowFixed)`
    gap: 8px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`

const ResponsiveButtonPrimary = styled(ButtonPrimaryNormal)`
    width: fit-content;
    background: #ecf1f8;
    height: 48px;
    padding: 0px 24px;
    font-weight: bold;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
    width: fit-content;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const EmptyProposals = styled.div`
    border: 1px solid ${({ theme }) => theme.text4};
    padding: 16px 12px;
    border-radius: ${({ theme }) => theme.borderRadius};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export default function Pool() {
    const theme = useContext(ThemeContext)
    const { account, chainId } = useActiveWeb3React()

    // fetch the user's balances of all tracked V2 LP tokens
    const trackedTokenPairs = useTrackedTokenPairs()
    const tokenPairsWithLiquidityTokens = useMemo(
        () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
        [trackedTokenPairs]
    )

    const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
        tokenPairsWithLiquidityTokens
    ])
    const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
        account ?? undefined,
        liquidityTokens
    )

    // fetch the reserves for all V2 pools in which the user has a balance
    const liquidityTokensWithBalances = useMemo(
        () =>
            tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
                v2PairsBalances[liquidityToken.address]?.greaterThan('0')
            ),
        [tokenPairsWithLiquidityTokens, v2PairsBalances]
    )

    const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
    const v2IsLoading =
        fetchingV2PairBalances ||
        v2Pairs?.length < liquidityTokensWithBalances.length ||
        v2Pairs?.some(V2Pair => !V2Pair)

    const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

    const hasV1Liquidity = useUserHasLiquidityInAllTokens()

    // show liquidity even if its deposited in rewards contract
    const stakingInfo = useStakingInfo()
    const stakingInfosWithBalance = stakingInfo?.filter(pool => JSBI.greaterThan(pool.stakedAmount.raw, BIG_INT_ZERO))
    const stakingPairs = usePairs(stakingInfosWithBalance?.map(stakingInfo => stakingInfo.tokens))

    // remove any pairs that also are included in pairs with stake in mining pool
    const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter(v2Pair => {
        return (
            stakingPairs
                ?.map(stakingPair => stakingPair[1])
                .filter(stakingPair => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length ===
            0
        )
    })

    const isMobile = window.innerWidth <= 1200

    return (
        <>
            <Helmet>
                <title>SokuSwap | Pools</title>
            </Helmet>
            <PageWrapper
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <SwapPoolTabs active={'pool'} />
                {isMobile && <MobileHeader page={'Liquidity Pools'} />}
                <Flex className="emphasized_swap_layout_no_hover global-box" justifyContent="center">
                    <AutoColumn>
                        <TitleRow
                            style={{
                                marginTop: '1rem',
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                            padding={'0'}
                            className="liquidity_header"
                        >
                            <TYPE.mediumHeader
                                style={{
                                    marginTop: '0.5rem',
                                    justifySelf: 'flex-start',
                                    paddingLeft: '0.75rem',
                                    fontWeight: 'bolder'
                                }}
                            >
                                Liquidity
                            </TYPE.mediumHeader>
                            {/* <ResponsiveButtonSecondary
                                    className="pool_button"
                                    as={Link}
                                    padding="6px 8px"
                                    to="/create/"
                                >
                                    Create a pair
                                </ResponsiveButtonSecondary> */}
                            <ResponsiveButtonPrimary
                                // id="join-pool-button"
                                as={Link}
                                padding="6px 8px"
                                to="/add/"
                                className="hover_shadow emphasize_swap_button"
                            >
                                <Text fontWeight={500} color="#05195a" fontSize={16}>
                                    Add Liquidity
                                </Text>
                            </ResponsiveButtonPrimary>
                        </TitleRow>
                        <RowBetween style={{ justifyContent: 'space-between', padding: '0px 35px' }} padding="0 8px">
                            <Text color="#04bbfb">Your Liquidity</Text>
                            <Question text="When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below." />
                        </RowBetween>

                        {!account ? (
                            <Card padding="40px">
                                <TYPE.body color={'#BDC2C4'} style={{ padding: '14px' }} textAlign="center">
                                    Connect to a wallet to view your liquidity.
                                </TYPE.body>
                            </Card>
                        ) : v2IsLoading ? (
                            <EmptyProposals style={{ border: 'none', padding: '40px' }}>
                                <TYPE.body color={'#BDC2C4'} textAlign="center">
                                    <Dots>Loading</Dots>
                                </TYPE.body>
                            </EmptyProposals>
                        ) : allV2PairsWithLiquidity?.length > 0 || stakingPairs?.length > 0 ? (
                            <>
                                {/* <ButtonSecondary>
                  <RowBetween>
                    <ExternalLink href={'https://uniswap.info/account/' + account}>
                      Account analytics and accrued fees
                    </ExternalLink>
                    <span> ↗</span>
                  </RowBetween>
                </ButtonSecondary> */}
                                {v2PairsWithoutStakedAmount.map(v2Pair => (
                                    <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                                ))}
                                {stakingPairs.map(
                                    (stakingPair, i) =>
                                        stakingPair[1] && ( // skip pairs that arent loaded
                                            <FullPositionCard
                                                key={stakingInfosWithBalance[i].stakingRewardAddress}
                                                pair={stakingPair[1]}
                                                stakedBalance={stakingInfosWithBalance[i].stakedAmount}
                                            />
                                        )
                                )}
                            </>
                        ) : (
                            <EmptyProposals style={{ border: 'none', padding: '40px' }}>
                                <TYPE.body color="#BDC2C4" textAlign="center">
                                    No liquidity found.
                                </TYPE.body>
                            </EmptyProposals>
                        )}

                        <AutoColumn style={{ paddingLeft: '0.75rem' }} gap="xs">
                            <Text
                                textAlign="left"
                                fontSize={14}
                                style={{ padding: '.5rem 0 .5rem 0', fontWeight: 'normal' }}
                            >
                                {hasV1Liquidity ? 'Liquidity found!' : "Don't see a pool you joined?"}{' '}
                                <StyledInternalLink
                                    className="hover_shadow_icon"
                                    id="import-pool-link"
                                    to={hasV1Liquidity ? '/migrate/v1' : '/find'}
                                >
                                    {hasV1Liquidity ? 'Migrate now.' : 'Import it.'}
                                </StyledInternalLink>
                            </Text>
                            {chainId === ChainId.MAINNET && (
                                <Text
                                    textAlign="left"
                                    fontSize={14}
                                    style={{ padding: '.5rem 0 .5rem 0', fontWeight: 'normal' }}
                                >
                                    Or, if you staked your LP tokens in a farm, unstake them to see them here.
                                </Text>
                            )}
                        </AutoColumn>
                    </AutoColumn>
                </Flex>
            </PageWrapper>
        </>
    )
}
