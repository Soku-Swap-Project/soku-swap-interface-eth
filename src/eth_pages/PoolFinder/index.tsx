import { Currency, ETHER, JSBI, Token, TokenAmount } from '@sushiswap/sdk'
import React, { useCallback, useEffect, useState } from 'react'
import { Plus } from 'react-feather'
import { Text } from 'rebass'
import { ButtonDropdownLight } from '../../eth_components/ButtonLegacy'
import { BlueCard, LightCard } from '../../eth_components/Card'
import { AutoColumn, ColumnCenter } from '../../eth_components/Column'
import CurrencyLogo from '../../eth_components/CurrencyLogo'
import { FindPoolTabs } from '../../eth_components/NavigationTabs'
import { MinimalPositionCard } from '../../eth_components/PositionCard'
import Row from '../../eth_components/Row'
import CardNav from '../../eth_components/CardNav'

import CurrencySearchModal from '../../eth_components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from '../../eth_data/Reserves'
import { useActiveWeb3React } from '../../eth_hooks'
import { usePairAdder } from '../../eth_state/user/hooks'
import { useTokenBalance } from '../../eth_state/wallet/hooks'
import { StyledInternalLink, TYPE } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import AppBody from '../AppBody'
import { Dots } from '../Pool/styleds'
import { Helmet } from 'react-helmet'
import MobileHeader from 'eth_components/MobileHeader'

enum Fields {
    TOKEN0 = 0,
    TOKEN1 = 1
}

export default function PoolFinder() {
    const { account, chainId } = useActiveWeb3React()

    const [showSearch, setShowSearch] = useState<boolean>(false)
    const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

    const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
    const [currency1, setCurrency1] = useState<Currency | null>(null)

    const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
    const addPair = usePairAdder()
    useEffect(() => {
        if (pair) {
            addPair(pair)
        }
    }, [pair, addPair])

    const validPairNoLiquidity: boolean =
        pairState === PairState.NOT_EXISTS ||
        Boolean(
            pairState === PairState.EXISTS &&
                pair &&
                JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
                JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
        )

    const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken as Token)
    const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

    const handleCurrencySelect = useCallback(
        (currency: Currency) => {
            if (activeField === Fields.TOKEN0) {
                setCurrency0(currency)
            } else {
                setCurrency1(currency)
            }
        },
        [activeField]
    )

    const handleSearchDismiss = useCallback(() => {
        setShowSearch(false)
    }, [setShowSearch])

    const prerequisiteMessage = (
        <LightCard padding="45px 10px">
            <Text textAlign="center" color="#04bbfb">
                {!account ? 'Connect to a wallet to find pools' : 'Select a token to find your liquidity.'}
            </Text>
        </LightCard>
    )

    const isMobile = window.innerWidth <= 1200

    return (
        <>
            {isMobile && <MobileHeader page={'Liquidity Pools'} />}
            <Helmet>
                <title>SokuSwap | Find Pool</title>
            </Helmet>
            <AppBody className="emphasized_swap_layout global-box">
                <FindPoolTabs />
                <AutoColumn style={{ padding: '1rem' }} gap="md">
                    {/* <BlueCard>
                        <AutoColumn gap="10px">
                            <TYPE.link fontWeight={400} color={'primaryText1'}>
                                <b>Tip:</b> Use this tool to find pairs that don&apos;t automatically appear in the
                                interface.
                            </TYPE.link>
                        </AutoColumn>
                    </BlueCard> */}
                    <ButtonDropdownLight
                        className="emphasize_swap_button hover_shadow"
                        onClick={() => {
                            setShowSearch(true)
                            setActiveField(Fields.TOKEN0)
                        }}
                    >
                        {currency0 ? (
                            <Row>
                                <CurrencyLogo currency={currency0} />
                                <Text fontWeight={600} fontSize={16} marginLeft={'12px'} paddingRight={'8px'}>
                                    {currency0.getSymbol(chainId)}
                                </Text>
                            </Row>
                        ) : (
                            <Text fontWeight={700} fontSize={16} marginLeft={'12px'} paddingRight={'8px'}>
                                Select a Token
                            </Text>
                        )}
                    </ButtonDropdownLight>

                    <ColumnCenter>
                        <Plus size="16" color="#7f7f7f" />
                    </ColumnCenter>

                    <ButtonDropdownLight
                        className="emphasize_swap_button hover_shadow"
                        onClick={() => {
                            setShowSearch(true)
                            setActiveField(Fields.TOKEN1)
                        }}
                    >
                        {currency1 ? (
                            <Row>
                                <CurrencyLogo currency={currency1} />
                                <Text fontWeight={600} fontSize={16} marginLeft={'12px'} paddingRight={'8px'}>
                                    {currency1.getSymbol(chainId)}
                                </Text>
                            </Row>
                        ) : (
                            <Text fontWeight={700} fontSize={16} marginLeft={'12px'} paddingRight={'8px'}>
                                Select a Token
                            </Text>
                        )}
                    </ButtonDropdownLight>

                    {hasPosition && (
                        <ColumnCenter
                            style={{
                                justifyItems: 'center',
                                backgroundColor: '',
                                padding: '12px 0px',
                                borderRadius: '12px'
                            }}
                        >
                            <Text textAlign="center" fontWeight={500}>
                                Pool Found!
                            </Text>
                            {/* <StyledInternalLink to={`/pool/ethereum`}>
                                <Text textAlign="center">Manage this pool.</Text>
                            </StyledInternalLink> */}
                        </ColumnCenter>
                    )}

                    {currency0 && currency1 ? (
                        pairState === PairState.EXISTS ? (
                            hasPosition && pair ? (
                                <MinimalPositionCard pair={pair} border="1px solid #CED0D9" />
                            ) : (
                                <LightCard padding="45px 10px">
                                    <AutoColumn gap="sm" justify="center">
                                        <Text textAlign="center">You don’t have liquidity in this pool yet.</Text>
                                        <StyledInternalLink
                                            to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                                        >
                                            <Text textAlign="center">Add liquidity.</Text>
                                        </StyledInternalLink>
                                    </AutoColumn>
                                </LightCard>
                            )
                        ) : validPairNoLiquidity ? (
                            <LightCard padding="45px 10px">
                                <AutoColumn gap="sm" justify="center">
                                    <Text textAlign="center">No pool found.</Text>
                                    <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                                        Create pool.
                                    </StyledInternalLink>
                                </AutoColumn>
                            </LightCard>
                        ) : pairState === PairState.INVALID ? (
                            <LightCard padding="45px 10px">
                                <AutoColumn gap="sm" justify="center">
                                    <Text textAlign="center" fontWeight={500}>
                                        Invalid pair.
                                    </Text>
                                </AutoColumn>
                            </LightCard>
                        ) : pairState === PairState.LOADING ? (
                            <LightCard padding="45px 10px">
                                <AutoColumn gap="sm" justify="center">
                                    <Text textAlign="center">
                                        Loading
                                        <Dots />
                                    </Text>
                                </AutoColumn>
                            </LightCard>
                        ) : null
                    ) : (
                        prerequisiteMessage
                    )}
                </AutoColumn>

                <CurrencySearchModal
                    isOpen={showSearch}
                    onCurrencySelect={handleCurrencySelect}
                    onDismiss={handleSearchDismiss}
                    showCommonBases
                    selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
                />
            </AppBody>
        </>
    )
}
