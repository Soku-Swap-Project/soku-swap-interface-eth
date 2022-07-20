import React, { useCallback, useState } from 'react'
import { HelpCircle as Question } from 'react-feather'
import styled from 'styled-components'
import Tooltip from '../Tooltip'

const QuestionWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    border: none;
    background: none;
    outline: none;
    cursor: default;
    border-radius: 16px;
    color: #04bbfb !important;

    :hover,
    :focus {
        opacity: 0.7;
        color: lighten(#04bbfb) !important;
    }
`

const LightQuestionWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    border: none;
    background: none;
    outline: none;
    cursor: default;
    border-radius: 16px;
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.white};

    :hover,
    :focus {
        opacity: 0.7;
    }
`

const QuestionMark = styled.span`
    font-size: 1rem;
`

export default function QuestionHelper({ text }: { text: any }) {
    const [show, setShow] = useState<boolean>(false)

    const open = useCallback(() => setShow(true), [setShow])
    const close = useCallback(() => setShow(false), [setShow])

    return (
        <span className="hover_shadow_icon" style={{ marginLeft: 4 }}>
            <Tooltip text={text} show={show}>
                <QuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
                    <Question size={16} />
                </QuestionWrapper>
            </Tooltip>
        </span>
    )
}

export function LightQuestionHelper({ text }: { text: string }) {
    const [show, setShow] = useState<boolean>(false)

    const open = useCallback(() => setShow(true), [setShow])
    const close = useCallback(() => setShow(false), [setShow])

    return (
        <span className="hover_shadow_icon" style={{ marginLeft: 4 }}>
            <Tooltip text={text} show={show}>
                <LightQuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
                    <QuestionMark>?</QuestionMark>
                </LightQuestionWrapper>
            </Tooltip>
        </span>
    )
}
