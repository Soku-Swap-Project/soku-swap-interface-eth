import React from 'react'
import CardNav from 'eth_components/CardNav'
import { Button } from 'react-bootstrap'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import './Maintenance.css'

function Maintenance() {
    const origin = window.location.origin

    return (
        <div style={{ padding: '20px' }}>
            <CardNav />
            <h1 style={{ color: '#fff', opacity: '0.95', fontSize: '20px', fontWeight: '900', paddingBottom: '35px' }}>
                Undergoing maintenance to deliver the best experience to our users.
            </h1>

            <Button className="maintenance-button" href={`${origin}/bsc/#/swap`}>
                Trade on Binance Smart Chain
            </Button>
        </div>
    )
}

export default Maintenance
