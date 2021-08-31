import { useFuse, useSortableData } from 'eth_hooks'
import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import styled from 'styled-components'
import useFarms from 'eth_hooks/useFarms'
import Question from '../../eth_components/QuestionHelper'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { RowBetween } from '../../eth_components/Row'
import { formattedNum, formattedPercent } from '../../utils'
import { Card, CardHeader, Paper, Search, DoubleLogo, TokenLogo } from './components'
import InputGroup from './InputGroup'
import { Dots } from 'kashi/components'
import { Helmet } from 'react-helmet'

import './index.css'

export const FixedHeightRow = styled(RowBetween)`
    height: 24px;
`
const spinnerIcon = <LoadingOutlined style={{ fontSize: 50, color: '#04bbfb' }} spin />

export default function Yield(): JSX.Element {
    const query = useFarms()
    const farms = query?.farms
    const userFarms = query?.userFarms
    const [loading, setLoading] = useState(true)

    // Search Setup
    const options = { keys: ['symbol', 'name', 'pairAddress'], threshold: 0.4 }
    const { result, search, term } = useFuse({
        data: farms && farms.length > 0 ? farms : [],
        options
    })
    const flattenSearchResults = result.map((a: { item: any }) => (a.item ? a.item : a))
    // Sorting Setup
    const { items, requestSort, sortConfig } = useSortableData(flattenSearchResults)

    // console.log('Query: ', query)
    // console.log('farms: ', farms)
    // console.log('userFarms: ', userFarms)

    useEffect(() => {
        if (items.length > 0) {
            setLoading(false)
        }
    }, [farms])

    return (
        <>
            <Helmet>
                <title>SokuSwap | ETH | Farms</title>
                <meta name="description" content="Farm SOKU by staking LP (Liquidity Provider) tokens" />
            </Helmet>

            {loading ? (
                <div
                    style={{
                        height: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '-5%'
                    }}
                >
                    <Spin indicator={spinnerIcon} />
                </div>
            ) : (
                <>
                    <div className="farm_header">
                        <h1 className="text-center" style={{ color: '#fff', fontWeight: 'bold' }}>
                            Farms
                        </h1>
                        <h3 style={{ color: '#fff', opacity: '0.65', fontWeight: 'bold' }}>
                            Stake Liquidity Pool (LP) tokens to earn SOKU!
                        </h3>
                    </div>

                    <div
                        className="farm_container container max-w-1xl w-auto mx-auto"
                        style={{ maxWidth: '75vw', paddingLeft: '24px', paddingRight: '24px' }}
                    >
                        <CardHeader className="flex justify-center w-full items-center bg-transparent">
                            <div className="flex w-full items-center justify-center farm_input_header">
                                <Search search={search} term={term} />
                            </div>
                        </CardHeader>
                        <Card className="h-full bg-white">
                            {/* UserFarms */}
                            {userFarms && userFarms.length > 0 && (
                                <>
                                    <div className="pb-4">
                                        <div className="grid grid-cols-3 pb-4 px-4 text-sm  text-secondary">
                                            <div className="flex items-center">
                                                <div>Your Farms</div>
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <div>Deposited</div>
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <div>Claim</div>
                                            </div>
                                        </div>
                                        <div className="flex-col w-full space-y-2 ">
                                            {userFarms.map((farm: any, i: number) => {
                                                return <UserBalance key={farm.address + '_' + i} farm={farm} />
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex-col bg-transparent">
                                {items && items.length > 0 ? (
                                    items.map((farm: any, i: number) => {
                                        return <TokenBalance key={farm.address + '_' + i} farm={farm} />
                                    })
                                ) : (
                                    <>
                                        {term ? (
                                            <div className="w-full text-center py-6">No Results.</div>
                                        ) : (
                                            <div className="w-full text-center py-6">
                                                <Spin indicator={spinnerIcon} />{' '}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </>
    )
}

const TokenBalance = ({ farm }: any) => {
    const [expand, setExpand] = useState<boolean>(false)
    // console.log(farm)
    return (
        <>
            {farm.type === 'SLP' && (
                <Paper className="bg-white w-full p-0 m-0 farm_row">
                    <div
                        className="grid grid-cols-4 py-5 px-5 cursor-pointer select-none rounded text-sm"
                        onClick={() => setExpand(!expand)}
                    >
                        <div className="flex items-center farm_token_container">
                            <div className="mr-4">
                                <DoubleLogo
                                    a0={farm.liquidityPair.token0.id}
                                    a1={farm.liquidityPair.token1.id}
                                    size={20}
                                    margin={true}
                                />
                            </div>
                            <div
                                className="farm_token hidden sm:block"
                                style={{
                                    color: '#05195a',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                    lineHeight: '1.5'
                                }}
                            >
                                {farm && farm.liquidityPair.token0.symbol + '-' + farm.liquidityPair.token1.symbol}
                            </div>
                        </div>
                        <div className="flex items-center justify-end px-7 farm_apr">
                            <div>
                                <h1 className="text-left">APR</h1>
                                <div></div>
                                <div
                                    className="text-left"
                                    style={{
                                        color: '#05195a',
                                        fontSize: '16px',
                                        minWidth: '85px'
                                    }}
                                >
                                    {formattedPercent(farm.roiPerYear * 100)}{' '}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center farm_liquidity">
                            <div>
                                <h1 className="text-left">Liquidity</h1>
                                <div className="farm_liquidity_value">
                                    <div
                                        className="text-left"
                                        style={{
                                            color: '#05195a',
                                            fontSize: '16px',
                                            width: '85px'
                                        }}
                                    >
                                        {formattedNum(farm.tvl, true)}{' '}
                                    </div>
                                    <Question text="The total value of the funds in this farm’s liquidity pool" />
                                </div>

                                {/* <div className="text-secondary text-left">
                                    {formattedNum(farm.slpBalance / 1e18, false)} SLP
                                </div> */}
                            </div>
                        </div>
                        <div className="flex items-center justify-center farm_actions">
                            <div className="flex items-center">
                                <h2 style={{ paddingRight: '2px', fontSize: '16px' }}>Actions</h2>
                                {expand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                        </div>
                    </div>
                    {expand && (
                        <InputGroup
                            pid={farm.pid}
                            pairAddress={farm.pairAddress}
                            pairSymbol={farm.symbol}
                            token0Address={farm.liquidityPair.token0.id}
                            token1Address={farm.liquidityPair.token1.id}
                            type={'LP'}
                        />
                    )}
                </Paper>
            )}
            {/* {farm.type === 'KMP' && (
                <Paper className="bg-white">
                    <div
                        className="grid grid-cols-4 py-4 px-4 cursor-pointer select-none rounded text-sm"
                        onClick={() => setExpand(!expand)}
                    >
                        <div className="flex items-center">
                            <div className="mr-4">
                                <DoubleLogo
                                    a0={'kashiLogo'}
                                    a1={farm.liquidityPair.asset.id}
                                    size={32}
                                    margin={true}
                                    higherRadius={'0px'}
                                />
                            </div>
                            <div className="hidden sm:block">{farm && farm.symbol}</div>
                        </div>
                        <div className="flex space-evenly items-center">
                            <div>
                                <h1 className="text-left">APR</h1>
                                <div></div>
                                <div className="text-left font-semibold text-xl">
                                    {formattedPercent(farm.roiPerYear * 100)}{' '}
                                </div>
                            </div>
                        </div>
                        <div className="flex space-evenly items-center">
                            <div>
                                <h1 className="text-left">KMP</h1>
                                <div className="text-left">{formattedNum(farm.tvl, true)} </div>
                                <div className="text-secondary text-left">
                                    {formattedNum(farm.totalAssetStaked, false)} KMP
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="flex items-center">
                                <h2>Actions</h2>
                                <ChevronDown />
                            </div>
                        </div>
                    </div>
                    {expand && (
                        <InputGroup
                            pid={farm.pid}
                            pairAddress={farm.pairAddress}
                            pairSymbol={farm.symbol}
                            token0Address={farm.liquidityPair.collateral.id}
                            token1Address={farm.liquidityPair.asset.id}
                            type={'KMP'}
                            assetSymbol={farm.liquidityPair.asset.symbol}
                            assetDecimals={farm.liquidityPair.asset.decimals}
                        />
                    )}
                </Paper>
            )} */}
        </>
    )
}

const UserBalance = ({ farm }: any) => {
    const [expand, setExpand] = useState<boolean>(false)

    return (
        <>
            {farm.type === 'SLP' && (
                <Paper className="bg-white">
                    <div
                        className="grid grid-cols-3 py-4 px-4 cursor-pointer select-none rounded text-sm"
                        onClick={() => setExpand(!expand)}
                    >
                        <div className="flex items-center">
                            <div className="mr-4">
                                <DoubleLogo
                                    a0={farm.liquidityPair.token0.id}
                                    a1={farm.liquidityPair.token1.id}
                                    size={26}
                                    margin={true}
                                />
                            </div>
                            <div className="hidden sm:block">
                                {farm && farm.liquidityPair.token0.symbol + '-' + farm.liquidityPair.token1.symbol}
                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            <div>
                                <div className="text-right">{formattedNum(farm.depositedUSD, true)} </div>
                                <div className="text-secondary text-right">
                                    {formattedNum(farm.depositedLP, false)} SLP
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            <div>
                                <div className="text-right">{formattedNum(farm.pendingSushi)} </div>
                                <div className="text-secondary text-right">SOKU</div>
                            </div>
                        </div>
                    </div>
                    {expand && (
                        <InputGroup
                            pid={farm.pid}
                            pairAddress={farm.pairAddress}
                            pairSymbol={farm.symbol}
                            token0Address={farm.liquidityPair.token0.id}
                            token1Address={farm.liquidityPair.token1.id}
                            type={'LP'}
                        />
                    )}
                </Paper>
            )}
            {farm.type === 'KMP' && (
                <Paper className="bg-dark-800">
                    <div
                        className="grid grid-cols-3 py-4 px-4 cursor-pointer select-none rounded text-sm"
                        onClick={() => setExpand(!expand)}
                    >
                        <div className="flex items-center">
                            <div className="mr-4">
                                <DoubleLogo
                                    a0={'kashiLogo'}
                                    a1={farm.liquidityPair.asset.id}
                                    size={32}
                                    margin={true}
                                    higherRadius={'0px'}
                                />
                            </div>
                            <div className="hidden sm:block">{farm && farm.symbol}</div>
                        </div>
                        <div className="flex justify-end items-center">
                            <div>
                                <div className="text-right">{formattedNum(farm.depositedUSD, true)} </div>
                                <div className="text-secondary text-right">
                                    {formattedNum(farm.depositedLP, false)} KMP
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            <div>
                                <div className="text-right">{formattedNum(farm.pendingSushi)} </div>
                                <div className="text-secondary text-right">SOKU</div>
                            </div>
                        </div>
                    </div>
                    {expand && (
                        <InputGroup
                            pid={farm.pid}
                            pairAddress={farm.pairAddress}
                            pairSymbol={farm.symbol}
                            token0Address={farm.liquidityPair.collateral.id}
                            token1Address={farm.liquidityPair.asset.id}
                            type={'KMP'}
                            assetSymbol={farm.liquidityPair.asset.symbol}
                            assetDecimals={farm.liquidityPair.asset.decimals}
                        />
                    )}
                </Paper>
            )}
        </>
    )
}
