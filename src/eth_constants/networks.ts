import { ChainId } from '@sushiswap/sdk'

import Arbitrum from '../eth_assets/networks/arbitrum-network.jpg'
import Avalanche from '../eth_assets/networks/avalanche-network.jpg'
import Bsc from '../eth_assets/networks/bsc-network.jpg'
import Fantom from '../eth_assets/networks/fantom-network.jpg'
import Goerli from '../eth_assets/networks/goerli-network.jpg'
import Harmony from '../eth_assets/networks/harmonyone-network.jpg'
import Heco from '../eth_assets/networks/heco-network.jpg'
import Kovan from '../eth_assets/networks/kovan-network.jpg'
import Matic from '../eth_assets/networks/matic-network.jpg'
import Moonbeam from '../eth_assets/networks/moonbeam-network.jpg'
import Polygon from '../eth_assets/networks/polygon-network.jpg'
import Rinkeby from '../eth_assets/networks/rinkeby-network.jpg'
import Ropsten from '../eth_assets/networks/ropsten-network.jpg'
import Xdai from '../eth_assets/networks/xdai-network.jpg'
import Mainnet from '../eth_assets/networks/mainnet-network.jpg'

export const NETWORK_ICON = {
    [ChainId.MAINNET]: Mainnet,
    [ChainId.ROPSTEN]: Ropsten,
    [ChainId.RINKEBY]: Rinkeby,
    [ChainId.GÖRLI]: Goerli,
    [ChainId.KOVAN]: Kovan,
    [ChainId.FANTOM]: Fantom,
    [ChainId.FANTOM_TESTNET]: Fantom,
    [ChainId.BSC]: Bsc,
    [ChainId.BSC_TESTNET]: Bsc,
    [ChainId.MATIC]: Matic,
    [ChainId.MATIC_TESTNET]: Matic,
    [ChainId.XDAI]: Xdai,
    [ChainId.ARBITRUM]: Arbitrum,
    [ChainId.MOONBASE]: Moonbeam,
    [ChainId.AVALANCHE]: Avalanche,
    [ChainId.FUJI]: Avalanche,
    [ChainId.HECO]: Heco,
    [ChainId.HECO_TESTNET]: Heco,
    [ChainId.HARMONY]: Harmony,
    [ChainId.HARMONY_TESTNET]: Harmony
}

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: 'Ethereum',
    [ChainId.RINKEBY]: 'Rinkeby',
    [ChainId.ROPSTEN]: 'Ropsten',
    [ChainId.GÖRLI]: 'Görli',
    [ChainId.KOVAN]: 'Kovan',
    [ChainId.FANTOM]: 'Fantom',
    [ChainId.FANTOM_TESTNET]: 'Fantom Testnet',
    [ChainId.MATIC]: 'Matic',
    [ChainId.MATIC_TESTNET]: 'Matic Testnet',
    [ChainId.XDAI]: 'xDai',
    [ChainId.BSC]: 'BSC',
    [ChainId.BSC_TESTNET]: 'BSC Testnet',
    [ChainId.MOONBASE]: 'Moonbase',
    [ChainId.AVALANCHE]: 'Avalanche',
    [ChainId.FUJI]: 'Fuji',
    [ChainId.HECO]: 'HECO',
    [ChainId.HECO_TESTNET]: 'HECO Testnet',
    [ChainId.HARMONY]: 'Harmony',
    [ChainId.HARMONY_TESTNET]: 'Harmony Testnet'
}
