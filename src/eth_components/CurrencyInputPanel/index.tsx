import { Currency, Pair } from '@sushiswap/sdk'
import { darken } from 'polished'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ReactComponent as DropDown } from '../../eth_assets/images/dropdown.svg'

import { useActiveWeb3React } from '../../eth_hooks'
import useTheme from '../../eth_hooks/useTheme'
import { useCurrencyBalance } from '../../eth_state/wallet/hooks'
import { TYPE } from '../../theme'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { Input as NumericalInput } from '../NumericalInput'
import { RowBetween } from '../Row'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import Button from '../Button'
import selectCoinAnimation from '../../eth_assets/animation/select-coin.json'
import Lottie from 'lottie-react'

import './CurrencyInputPanel.css'

const InputRow = styled.div<{ selected: boolean }>`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`
const CurrencySelect = styled.button<{ selected: boolean }>`
    align-items: center;
    object-fit: contain;
    height: 34px;
    font-size: 16px;
    font-weight: 500;
    background-color: #fff;
    color: #000;
    border-radius: 12px;
    outline: none;
    cursor: pointer;
    user-select: none;
    border: none;
    padding: 0 0.5rem;
    :focus ;
`

const LabelRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    color: red;
    font-size: 0.75rem;
    line-height: 1rem;
    padding: 0.75rem 1rem 0 1rem;
    span:hover {
        cursor: pointer;
        color: red;
    }
`

const Aligner = styled.span`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
    margin: 0 0.25rem 0 0.5rem;
    height: 35%;

    path {
        stroke: #000;
        stroke-width: 1.5px;
    }
`

const StyledTokenName = styled.span<{ active?: boolean }>`
//   ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
//   font-size:  ${({ active }) => (active ? '24px' : '12px')};
`

const StyledBalanceMax = styled.button`
    height: 28px;
    padding-right: 8px;
    padding-left: 8px;
    background-color: ${({ theme }) => theme.primary5};
    border: 1px solid ${({ theme }) => theme.primary5};
    border-radius: ${({ theme }) => theme.borderRadius};
    font-size: 0.875rem;

    font-weight: 500;
    cursor: pointer;
    margin-right: 0.5rem;
    color: ${({ theme }) => theme.primaryText1};
    :hover {
        border: 1px solid ${({ theme }) => theme.primary1};
    }
    :focus {
        border: 1px solid ${({ theme }) => theme.primary1};
        outline: none;
    }

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

interface CurrencyInputPanelProps {
    value: string
    onUserInput: (value: string) => void
    onMax?: () => void
    showMaxButton: boolean
    label?: string
    onCurrencySelect?: (currency: Currency) => void
    currency?: Currency | null
    disableCurrencySelect?: boolean
    hideBalance?: boolean
    pair?: Pair | null
    hideInput?: boolean
    otherCurrency?: Currency | null
    id: string
    showCommonBases?: boolean
    customBalanceText?: string
    cornerRadiusBottomNone?: boolean
    cornerRadiusTopNone?: boolean
    containerBackground?: string
}

export default function CurrencyInputPanel({
    value,
    onUserInput,
    onMax,
    showMaxButton,
    label = 'Input',
    onCurrencySelect,
    currency,
    disableCurrencySelect = false,
    hideBalance = false,
    pair = null, // used for double token logo
    hideInput = false,
    otherCurrency,
    id,
    showCommonBases,
    customBalanceText,
    cornerRadiusBottomNone,
    cornerRadiusTopNone,
    containerBackground
}: CurrencyInputPanelProps) {
    const { t } = useTranslation()

    const [modalOpen, setModalOpen] = useState(false)
    const { account, chainId } = useActiveWeb3React()
    const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
    const theme = useTheme()

    const handleDismissSearch = useCallback(() => {
        setModalOpen(false)
    }, [setModalOpen])

    return (
        <div id={id} className="rounded flex flex-col bg-white currency_input_panel ">
            <div
                className="space-y-0 sm:flex-row justify-between currency_input_container"
                // hideInput={hideInput}
                // cornerRadiusBottomNone={cornerRadiusBottomNone}
                // cornerRadiusTopNone={cornerRadiusTopNone}
                // containerBackground={containerBackground}
            >
                <div className="sokuswap__fromAmount">
                    {label && (
                        <div className="fromLabel text-xs text-secondary font-medium whitespace-nowrap">{label}</div>
                    )}
                    {account && (
                        <div
                            onClick={onMax}
                            className="balanceLabel font-medium cursor-pointer text-xs text-low-emphesis"
                        >
                            {!hideBalance && !!currency && selectedCurrencyBalance
                                ? (customBalanceText ?? 'Balance: ') + selectedCurrencyBalance?.toSignificant(4)
                                : ' -'}
                        </div>
                    )}
                </div>
                {/* {!hideInput && (
                    <LabelRow>
                        <RowBetween>
                            <TYPE.body color={theme.text3} fontWeight={500} fontSize={14}>
                                {label}
                            </TYPE.body>
                            {account && (
                                <TYPE.body
                                    onClick={onMax}
                                    color={theme.text3}
                                    fontWeight={500}
                                    fontSize={14}
                                    style={{ display: 'inline', cursor: 'pointer' }}
                                >
                                    {!hideBalance && !!currency && selectedCurrencyBalance
                                        ? (customBalanceText ?? 'Balance: ') + selectedCurrencyBalance?.toSignificant(6)
                                        : ' -'}
                                </TYPE.body>
                            )}
                        </RowBetween>
                    </LabelRow>
                )} */}
                <div
                    className="flex items-center currencyContainer"
                    // style={hideInput ? { padding: '0', borderRadius: '8px' } : {}}
                    // selected={disableCurrencySelect}
                >
                    <div className="flex flex-row items-center w-full sm:w-3/5">
                        {!hideInput && (
                            <>
                                {/* {account && currency && showMaxButton && label !== 'To' && (
                                    <Button
                                        onClick={onMax}
                                        className="bg-transparent hover:bg-primary border border-low-emphesis rounded-full py-1 px-2 text-red text-xs font-medium whitespace-nowrap"
                                    >
                                        MAX
                                    </Button>
                                )} */}
                                <NumericalInput
                                    className="token-amount-input text-black"
                                    value={value}
                                    onUserInput={val => {
                                        onUserInput(val)
                                    }}
                                />
                            </>
                        )}
                    </div>
                    <CurrencySelect
                        selected={!!currency}
                        className="open-currency-select-button"
                        onClick={() => {
                            if (!disableCurrencySelect) {
                                setModalOpen(true)
                            }
                        }}
                    >
                        <div className="flex-1 flex-col currencyLogoContainer">
                            {pair ? (
                                <DoubleCurrencyLogo
                                    currency0={pair.token0}
                                    currency1={pair.token1}
                                    size={18}
                                    margin={true}
                                />
                            ) : currency ? (
                                <div className="flex-1 flex-row  currencyLogo">
                                    <CurrencyLogo currency={currency} size={'24px'} />
                                </div>
                            ) : (
                                <> </>
                            )}
                            {pair ? (
                                <StyledTokenName className="pair-name-container">
                                    {pair?.token0.symbol}:{pair?.token1.symbol}
                                </StyledTokenName>
                            ) : (
                                <div className="flex items-center justify-center mx-3.5">
                                    <div className="flex items-center">
                                        {/* <StyledTokenName
                                            className="token-symbol-container"
                                            active={Boolean(currency && currency.symbol)}
                                        > */}
                                        <div className="currencyLogoText">
                                            {(currency && currency.symbol && currency.symbol.length > 20
                                                ? currency.symbol.slice(0, 4) +
                                                  '...' +
                                                  currency.symbol.slice(
                                                      currency.symbol.length - 5,
                                                      currency.symbol.length
                                                  )
                                                : currency?.getSymbol(chainId)) || (
                                                <div className="bg-transparent flex items-center text-black text-xs font-bold">
                                                    {t('selectToken') == 'Select a currency'
                                                        ? t('selectToken')
                                                        : t('Select a currency')}
                                                </div>
                                            )}
                                        </div>
                                        {/* </StyledTokenName> */}
                                        <span className="material-icons">keyboard_arrow_down</span>
                                        {/* {!disableCurrencySelect && currency && <StyledDropDown selected={!!currency} />} */}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CurrencySelect>
                    {/* {!hideInput && (
                        <>
                            <NumericalInput
                                className="token-amount-input"
                                value={value}
                                onUserInput={val => {
                                    onUserInput(val)
                                }}
                            />
                            {account && currency && showMaxButton && label !== 'To' && (
                                <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
                            )}
                        </>
                    )} */}
                </div>
            </div>
            {!disableCurrencySelect && onCurrencySelect && (
                <CurrencySearchModal
                    isOpen={modalOpen}
                    onDismiss={handleDismissSearch}
                    onCurrencySelect={onCurrencySelect}
                    selectedCurrency={currency}
                    otherSelectedCurrency={otherCurrency}
                    showCommonBases={showCommonBases}
                />
            )}
        </div>
    )
}
