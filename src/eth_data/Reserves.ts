import { Interface } from '@ethersproject/abi'
// import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import IUniswapV2PairABI from '@sushiswap/core/abi/IUniswapV2Pair.json'
import { Currency, Pair, TokenAmount } from '@sushiswap/sdk'
import { Pair as UniswapPair } from '@uniswap/sdk'
import { useMemo } from 'react'
import { useActiveWeb3React } from '../eth_hooks'
import { useMultipleContractSingleData } from '../eth_state/multicall/hooks'
import { wrappedCurrency } from '../utils/wrappedCurrency'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

export enum PairState {
    LOADING,
    NOT_EXISTS,
    EXISTS,
    INVALID
}

export function usePairs(
    currencies: [Currency | undefined, Currency | undefined][]
): [PairState, Pair | UniswapPair | null][] {
    const { chainId } = useActiveWeb3React()

    const tokens = useMemo(
        () =>
            currencies.map(([currencyA, currencyB]) => [
                wrappedCurrency(currencyA, chainId),
                wrappedCurrency(currencyB, chainId)
            ]),
        [chainId, currencies]
    )

    const pairAddresses = useMemo(
        () =>
            tokens.map(([tokenA, tokenB]) => {
                if (tokenA?.symbol === 'HOBI' || tokenB?.symbol === 'HOBI') {
                    return tokenA && tokenB && !tokenA.equals(tokenB)
                        ? UniswapPair.getAddress(tokenA as any, tokenB as any)
                        : undefined
                } else {
                    return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
                }
            }),
        [tokens]
    )

    const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

    return useMemo(() => {
        return results.map((result, i) => {
            const { result: reserves, loading } = result
            const tokenA = tokens[i][0]
            const tokenB = tokens[i][1]

            if (loading) return [PairState.LOADING, null]
            if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
            if (!reserves) return [PairState.NOT_EXISTS, null]
            const { reserve0, reserve1 } = reserves
            const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
            const useUniLP = tokenA?.symbol === 'HOBI' || tokenB?.symbol === 'HOBI'
            return [
                PairState.EXISTS,
                useUniLP
                    ? new UniswapPair(
                          new TokenAmount(token0, reserve0.toString()) as any,
                          new TokenAmount(token1, reserve1.toString()) as any
                      )
                    : new Pair(
                          new TokenAmount(token0, reserve0.toString()),
                          new TokenAmount(token1, reserve1.toString())
                      )
            ]
        })
    }, [results, tokens])
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | UniswapPair | null] {
    return usePairs([[tokenA, tokenB]])[0]
}
