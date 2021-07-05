import { darken } from 'polished'
import React from 'react'
import { ArrowLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link as HistoryLink, NavLink } from 'react-router-dom'
import { AppDispatch } from 'eth_state'
import { resetMintState } from 'eth_state/mint/actions'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import Question from '../QuestionHelper'
import Settings from '../Settings'

const Tabs = styled.div`
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
    border-radius: 3rem;
    justify-content: space-evenly;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
    activeClassName
})`
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
    justify-content: center;
    height: 3rem;
    border-radius: 3rem;
    outline: none;
    cursor: pointer;
    text-decoration: none;
    color: ${({ theme }) => theme.text3};
    font-size: 20px;

    &.${activeClassName} {
        border-radius: ${({ theme }) => theme.borderRadius};
        font-weight: 500;
        color: ${({ theme }) => theme.text1};
    }

    :hover,
    :focus {
        color: ${({ theme }) => darken(0.1, theme.text1)};
    }
`

const ActiveText = styled.div`
    font-weight: 500;
    font-size: 20px;
`

const StyledArrowLeft = styled(ArrowLeft)`
    color: ${({ theme }) => theme.text1};
`

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' }) {
    const { t } = useTranslation()
    return (
        <Tabs style={{ marginBottom: '20px', display: 'none' }}>
            <StyledNavLink id={`swap-nav-link`} to={'/swap/eth'} isActive={() => active === 'swap'}>
                {t('swap')}
            </StyledNavLink>
            <StyledNavLink id={`pool-nav-link`} to={'/pool/eth'} isActive={() => active === 'pool'}>
                {t('pool')}
            </StyledNavLink>
        </Tabs>
    )
}

export function FindPoolTabs() {
    return (
        <Tabs>
            <RowBetween style={{ padding: '1rem 1rem 1rem 1rem' }}>
                <HistoryLink to="/pool">
                    <StyledArrowLeft style={{ stroke: '#05195a' }} />
                </HistoryLink>
                <ActiveText>Import Pool</ActiveText>
                <Question
                    text="Use this tool to find pairs that don't automatically appear in the
                                interface."
                />
            </RowBetween>
        </Tabs>
    )
}

export function AddRemoveTabs({ adding, creating }: { adding: boolean; creating: boolean }) {
    // reset states on back
    const dispatch = useDispatch<AppDispatch>()

    return (
        <Tabs style={{ width: '100%' }}>
            <RowBetween>
                <HistoryLink
                    to="/pool"
                    onClick={() => {
                        adding && dispatch(resetMintState())
                    }}
                >
                    <StyledArrowLeft />
                </HistoryLink>
                <ActiveText>{creating ? 'Create a pair' : adding ? 'Add Liquidity' : 'Remove Liquidity'}</ActiveText>
                <Question text="When you add liquidity, you will receive pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time." />
            </RowBetween>
        </Tabs>
    )
}
