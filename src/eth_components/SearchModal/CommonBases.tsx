import { ChainId, Currency, currencyEquals, ETHER, Token } from '@sushiswap/sdk'
import React from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'
import { SUGGESTED_BASES } from '../../eth_constants'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import QuestionHelper from '../QuestionHelper'
import { AutoRow } from '../Row'

const BaseWrapper = styled.div<{ disable?: boolean }>`
    // border: 1px solid ${({ theme, disable }) => (disable ? 'transparent' : theme.bg3)};
    border-radius: 9999px;
    display: flex;
    padding: 6px;

    align-items: center;
    :hover {
        cursor: ${({ disable }) => !disable && 'pointer'};
        background-color: ${({ theme, disable }) => !disable && theme.bg2};
    }

    background-color: ${({ theme, disable }) => disable && theme.bg3};
    opacity: ${({ disable }) => disable && '0.4'};
`

export default function CommonBases({
    chainId,
    onSelect,
    selectedCurrency
}: {
    chainId?: ChainId
    selectedCurrency?: Currency | null
    onSelect: (currency: Currency) => void
}) {
    return (
        <AutoColumn gap="md">
            <AutoRow>
                <Text color="#7f7f7f" fontWeight={700} fontSize={14}>
                    Common bases
                </Text>
                {/* <QuestionHelper text="These tokens are commonly paired with other tokens." /> */}
            </AutoRow>
            <AutoRow gap="4px">
                <BaseWrapper
                    onClick={() => {
                        if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
                            onSelect(ETHER)
                        }
                    }}
                    disable={selectedCurrency === ETHER}
                    style={{ background: '#05195a', color: '#fff' }}
                    className="network_modal_button"
                >
                    <CurrencyLogo currency={ETHER} style={{ marginRight: 8 }} />
                    <Text color="white" fontWeight={700} fontSize={16}>
                        {Currency.getNativeCurrencySymbol(chainId)}
                    </Text>
                </BaseWrapper>
                {(chainId ? SUGGESTED_BASES[chainId] : []).map((token: Token) => {
                    const selected = selectedCurrency instanceof Token && selectedCurrency.address === token.address
                    return (
                        <BaseWrapper
                            onClick={() => !selected && onSelect(token)}
                            disable={selected}
                            key={token.address}
                            style={{ background: '#05195a', color: '#fff' }}
                            className="network_modal_button"
                        >
                            <CurrencyLogo currency={token} style={{ marginRight: 8 }} />
                            <Text color="white" fontWeight={700} fontSize={16}>
                                {token.getSymbol(chainId)}
                            </Text>
                        </BaseWrapper>
                    )
                })}
            </AutoRow>
        </AutoColumn>
    )
}
