import React from 'react'
import styled from 'styled-components'
import { useLastTruthy } from '../../eth_hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
    padding-top: calc(16px + 2rem);
    padding: 18px 0px;
    // padding-top: 22px;
    margin-top: 2rem;
    width: 100%;
    max-width: 420px;
    border-radius: 20px;
    color: red;
    background-color: #fff;
    border: 1px solid #fff;
    // background-color: ${({ theme }) => theme.advancedBG};
    z-index: -1;

    transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-200%)')};
    transition: transform 300ms ease-in-out;

    @media (max-width: 650px) {
        width: 18rem;
    }
`

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
    const lastTrade = useLastTruthy(trade)

    return (
        <AdvancedDetailsFooter show={Boolean(trade)}>
            <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
        </AdvancedDetailsFooter>
    )
}
