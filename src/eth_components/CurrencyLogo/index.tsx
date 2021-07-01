import { ChainId, Currency, ETHER, Token } from '@sushiswap/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import AvalancheLogo from '../../eth_assets/images/avalanche-logo.png'
import BinanceCoinLogo from '../../eth_assets/images/binance-coin-logo.png'
import EthereumLogo from '../../eth_assets/images/ethereum-logo.png'
import FantomLogo from '../../eth_assets/images/fantom-logo.png'
import HarmonyLogo from '../../eth_assets/images/harmony-logo.png'
import HecoLogo from '../../eth_assets/images/heco-logo.png'
import MaticLogo from '../../eth_assets/images/matic-logo.png'
import MoonbeamLogo from '../../eth_assets/images/moonbeam-logo.png'
import xDaiLogo from '../../eth_assets/images/xdai-logo.png'
import { useActiveWeb3React } from '../../eth_hooks'
import useHttpLocations from '../../eth_hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../eth_state/lists/hooks'
import Logo from '../Logo'

const getTokenLogoURL = (address: string) =>
    `https://raw.githubusercontent.com/trustwallet/eth_assets/master/blockchains/ethereum/eth_assets/${address}/logo.png`

const StyledNativeCurrencyLogo = styled.img<{ size: string }>`
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    // box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
    // border-radius: 10px;
    background: transparent !important;
    object-fit: contain;
`

const StyledLogo = styled(Logo)<{ size: string }>`
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    // border-radius: ${({ size }) => size};
    // box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);

    object-fit: contain;
`

const logo: { readonly [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: EthereumLogo,
    [ChainId.FANTOM]: FantomLogo,
    [ChainId.FANTOM_TESTNET]: FantomLogo,
    [ChainId.MATIC]: MaticLogo,
    [ChainId.MATIC_TESTNET]: MaticLogo,
    [ChainId.XDAI]: xDaiLogo,
    [ChainId.BSC]: BinanceCoinLogo,
    [ChainId.BSC_TESTNET]: BinanceCoinLogo,
    [ChainId.MOONBASE]: MoonbeamLogo,
    [ChainId.AVALANCHE]: AvalancheLogo,
    [ChainId.FUJI]: AvalancheLogo,
    [ChainId.HECO]: HecoLogo,
    [ChainId.HECO_TESTNET]: HecoLogo,
    [ChainId.HARMONY]: HarmonyLogo,
    [ChainId.HARMONY_TESTNET]: HarmonyLogo
}

export default function CurrencyLogo({
    currency,
    size = '24px',
    style
}: {
    currency?: Currency
    size?: string
    style?: React.CSSProperties
}) {
    const { chainId } = useActiveWeb3React()
    const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

    const srcs: string[] = useMemo(() => {
        if (currency === ETHER) return []

        if (currency instanceof Token) {
            if (currency instanceof WrappedTokenInfo) {
                return [...uriLocations, getTokenLogoURL(currency.address)]
            }

            return [getTokenLogoURL(currency.address)]
        }
        return []
    }, [currency, uriLocations])

    if (currency === ETHER && chainId) {
        return <StyledNativeCurrencyLogo src={logo[chainId]} size={size} style={style} />
    }

    return (
        <StyledLogo
            size={size}
            srcs={srcs}
            alt={`${currency?.getSymbol(chainId) ?? 'token'} logo`}
            style={style}
            className="currency"
        />
    )
}
