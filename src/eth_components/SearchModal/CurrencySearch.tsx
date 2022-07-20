import { Currency, ETHER, Token } from '@sushiswap/sdk'
import useDebounce from 'eth_hooks/useDebounce'
import { useOnClickOutside } from 'eth_hooks/useOnClickOutside'
import useTheme from 'eth_hooks/useTheme'
import useToggle from 'eth_hooks/useToggle'
import React, { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Edit } from 'react-feather'
import ReactGA from 'react-ga'
import { useTranslation } from 'react-i18next'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../eth_hooks'
import { useAllTokens, useFoundOnInactiveList, useIsUserAddedToken, useToken } from '../../eth_hooks/Tokens'
import { ButtonText, CloseIcon, IconWrapper, TYPE } from '../../theme'
import { isAddress } from '../../utils'
import Column from '../Column'
import Row, { RowBetween, RowFixed } from '../Row'
import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import { filterTokens, useSortedTokensByQuery } from './filtering'
import ImportRow from './ImportRow'
import { useTokenComparator } from './sorting'
import { PaddedColumn, SearchInput, Separator } from './styleds'

const ContentWrapper = styled(Column)`
    width: 100%;
    flex: 1 1;
    position: relative;
    min-height: 80vh;
    max-width: 32rem;
    width: 32rem;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 20rem;
  `};
`

const Footer = styled.div`
    width: 100%;
    border-radius: 10px;
    padding: 20px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    background-color: ${({ theme }) => theme.bg1};
    border-top: 1px solid ${({ theme }) => theme.bg2};
`

interface CurrencySearchProps {
    isOpen: boolean
    onDismiss: () => void
    selectedCurrency?: Currency | null
    onCurrencySelect: (currency: Currency) => void
    otherSelectedCurrency?: Currency | null
    showCommonBases?: boolean
    showManageView: () => void
    showImportView: () => void
    setImportToken: (token: Token) => void
}

export function CurrencySearch({
    selectedCurrency,
    onCurrencySelect,
    otherSelectedCurrency,
    showCommonBases,
    onDismiss,
    isOpen,
    showManageView,
    showImportView,
    setImportToken
}: CurrencySearchProps) {
    const { t } = useTranslation()
    const { chainId } = useActiveWeb3React()
    const theme = useTheme()

    // refs for fixed size lists
    const fixedList = useRef<FixedSizeList>()

    const [searchQuery, setSearchQuery] = useState<string>('')
    const debouncedQuery = useDebounce(searchQuery, 200)
    const [invertSearchOrder] = useState<boolean>(false)

    const allTokens = useAllTokens()

    // if they input an address, use it
    const isAddressSearch = isAddress(debouncedQuery)
    const searchToken = useToken(debouncedQuery)
    const searchTokenIsAdded = useIsUserAddedToken(searchToken)

    useEffect(() => {
        if (isAddressSearch) {
            ReactGA.event({
                category: 'Currency Select',
                action: 'Search by address',
                label: isAddressSearch
            })
        }
    }, [isAddressSearch])

    const showETH: boolean = useMemo(() => {
        const s = debouncedQuery.toLowerCase().trim()
        return s === '' || s === 'e' || s === 'et' || s === 'eth'
    }, [debouncedQuery])

    const tokenComparator = useTokenComparator(invertSearchOrder)

    const filteredTokens: Token[] = useMemo(() => {
        return filterTokens(Object.values(allTokens), debouncedQuery)
    }, [allTokens, debouncedQuery])

    const sortedTokens: Token[] = useMemo(() => {
        return filteredTokens.sort(tokenComparator)
    }, [filteredTokens, tokenComparator])

    const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)

    const handleCurrencySelect = useCallback(
        (currency: Currency) => {
            onCurrencySelect(currency)
            onDismiss()
        },
        [onDismiss, onCurrencySelect]
    )

    // clear the input on open
    useEffect(() => {
        if (isOpen) setSearchQuery('')
    }, [isOpen])

    // manage focus on modal show
    const inputRef = useRef<HTMLInputElement>()
    const handleInput = useCallback(event => {
        const input = event.target.value
        const checksummedInput = isAddress(input)
        setSearchQuery(checksummedInput || input)
        fixedList.current?.scrollTo(0)
    }, [])

    const handleEnter = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                const s = debouncedQuery.toLowerCase().trim()
                if (s === 'eth') {
                    handleCurrencySelect(ETHER)
                } else if (filteredSortedTokens.length > 0) {
                    if (
                        filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
                        filteredSortedTokens.length === 1
                    ) {
                        handleCurrencySelect(filteredSortedTokens[0])
                    }
                }
            }
        },
        [filteredSortedTokens, handleCurrencySelect, debouncedQuery]
    )

    // menu ui
    const [open, toggle] = useToggle(false)
    const node = useRef<HTMLDivElement>()
    useOnClickOutside(node, open ? toggle : undefined)

    // if no results on main list, show option to expand into inactive
    const inactiveTokens = useFoundOnInactiveList(debouncedQuery)
    const filteredInactiveTokens: Token[] = useSortedTokensByQuery(inactiveTokens, debouncedQuery)

    return (
        <ContentWrapper>
            <PaddedColumn gap="16px">
                <RowBetween>
                    <Text fontWeight={700} fontSize={16}>
                        Select a Token
                    </Text>
                    <CloseIcon style={{ width: '20px', stroke: '#05195a' }} onClick={onDismiss} />
                </RowBetween>
                <Row>
                    <SearchInput
                        type="text"
                        id="token-search-input"
                        placeholder="Search name or paste address"
                        autoComplete="off"
                        value={searchQuery}
                        ref={inputRef as RefObject<HTMLInputElement>}
                        onChange={handleInput}
                        onKeyDown={handleEnter}
                        style={{ marginBottom: '16px', borderRadius: '7px', border: 'none' }}
                        className="hover_transparent"
                    />
                </Row>
                {/* {showCommonBases && (
                    <CommonBases
                        chainId={chainId}
                        onSelect={handleCurrencySelect}
                        selectedCurrency={selectedCurrency}
                    />
                )} */}

                {/* <RowBetween>
                    <Text className="modal_text token_name" fontSize="14px">
                        Token name
                    </Text>
                </RowBetween> */}
            </PaddedColumn>
            {searchToken && !searchTokenIsAdded ? (
                <Column style={{ padding: '20px 0', height: '100%' }}>
                    <ImportRow token={searchToken} showImportView={showImportView} setImportToken={setImportToken} />
                </Column>
            ) : filteredSortedTokens?.length > 0 || filteredInactiveTokens?.length > 0 ? (
                <AutoSizer disableWidth>
                    {({ height }) => (
                        <CurrencyList
                            height={height}
                            showETH={showETH}
                            currencies={
                                filteredInactiveTokens
                                    ? filteredSortedTokens.concat(filteredInactiveTokens)
                                    : filteredSortedTokens
                            }
                            breakIndex={
                                inactiveTokens && filteredSortedTokens ? filteredSortedTokens.length : undefined
                            }
                            onCurrencySelect={handleCurrencySelect}
                            otherCurrency={otherSelectedCurrency}
                            selectedCurrency={selectedCurrency}
                            fixedListRef={fixedList}
                            showImportView={showImportView}
                            setImportToken={setImportToken}
                        />
                    )}
                </AutoSizer>
            ) : (
                <Column style={{ padding: '20px', height: '100%' }}>
                    <TYPE.main color={theme.text3} textAlign="center" mb="20px">
                        No results found.
                    </TYPE.main>
                </Column>
            )}
            {/* <Footer>
                <Row justify="center">
                    <ButtonText onClick={showManageView} color={theme.blue1} className="list-token-manage-button">
                        <RowFixed>
                            <IconWrapper size="16px" marginRight="6px">
                                <Edit />
                            </IconWrapper>
                            <TYPE.main color={theme.blue1}>Manage</TYPE.main>
                        </RowFixed>
                    </ButtonText>
                </Row>
            </Footer> */}
        </ContentWrapper>
    )
}
