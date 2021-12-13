import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
// import { Button, Heading, Text, LogoIcon } from '@pancakeswap-libs/uikit'

const StyledNotFound = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    height: calc(90vh - 64px);
    justify-content: center;
`

const NotFound = () => {
    return (
        <StyledNotFound>
            <img
                src="https://i.ibb.co/Qfm7690/Soku-Swap-Web-Logo-White.png"
                className="sokuswap__logo"
                alt="Soku Swap Logo"
                style={{ height: '100px' }}
            />{' '}
            <h1 style={{ fontSize: '20px', marginBottom: '24px', color: 'white' }}>Coming Soon!</h1>
            <NavLink to="/">
                <button
                    style={{
                        background: '#04bbfb',
                        color: 'white',
                        fontWeight: 'bolder',
                        padding: '0 16px',
                        height: '32px',
                        fontSize: '16px',
                        boxShadow: '0px -1px 0px 0px rgb(14 14 44 / 40%) inset',
                        borderRadius: '16px'
                    }}
                >
                    Back Home
                </button>
            </NavLink>
        </StyledNotFound>
    )
}

export default NotFound
