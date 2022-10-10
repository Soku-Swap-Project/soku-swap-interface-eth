// import './AccountModal.css'

import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import LogoutIcon from '@mui/icons-material/Logout'
import React, { FC } from 'react'
import { useActiveWeb3React } from 'eth_hooks'
import { getExplorerLink } from 'utils'
import { ChainId } from '@sushiswap/sdk'

/* eslint-disable */

interface AccountModalProps {
    toggleWalletModal: () => void
    pendingTransactions?: string[]
    confirmedTransactions?: string[]
    ENSName?: string
    openOptions: () => void
}

const useStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[10],
        padding: theme.spacing(2, 4, 3)
    }
}))

const AccountInfo: FC<AccountModalProps> = ({ toggleWalletModal, openOptions, ENSName }) => {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)
    // const { login, logout } = useAuth()
    const { account, chainId, deactivate, connector } = useActiveWeb3React()
    const isMobile = window.innerWidth <= 1200

    const StaticModal = Modal as any

    const truncatedFirstHalf = account?.substring(0, 5)
    const truncatedLastHalf = account?.substring(account.length - 5, account.length)
    const truncatedAddress = `${truncatedFirstHalf}...${truncatedLastHalf}`

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const body = (
        <div style={{ padding: '0px' }}>
            <div className="modal_header" style={{ padding: '10px' }}>
                <h1 className="text-blue font-bold">Account Details</h1>
            </div>
            <hr style={{ border: '1px solid #cccccc', height: '1px' }} />
            <div className="account__modal_details">
                <div className="wallet_info">
                    <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Wallet: {truncatedAddress}</p>
                    <img
                        className="nav_logo"
                        alt="Logo"
                        src="https://bscscan.com/token/images/sokuv2_32.png"
                        style={{ height: '20px', marginLeft: '5px' }}
                    />
                </div>
                <a
                    target="_blank"
                    className="view_on_scan hover_shadow"
                    style={{
                        color: '#fff',
                        background: '#05195a',
                        padding: '12px 24px',
                        borderRadius: '7px',
                        fontSize: '14px'
                    }}
                    href={getExplorerLink(chainId as ChainId, account as string, 'address')}
                >
                    <h2 className="pr-2">View on Explorer</h2>
                    <OpenInNewIcon />
                </a>
                {((isMobile &&
                    connector?.constructor?.name !== 'InjectedConnector' &&
                    connector?.constructor?.name !== 't') ||
                    !isMobile) && (
                    <button
                        style={{
                            color: 'rgb(255, 255, 255)',
                            background: 'rgb(5, 25, 90)',
                            padding: ' 9px 18px',
                            borderRadius: '7px',
                            fontSize: '14px'
                        }}
                        className="account_logout view_on_scan hover_shadow"
                        onClick={openOptions}
                    >
                        <h2 className="pr-2">Sign Out</h2>
                        <LogoutIcon />
                    </button>
                )}
            </div>
        </div>
    )

    return (
        <>
            {body}
            {/* <li
        className={isMobile ? 'account_modal_mobile' : 'account_modal' + ' hover_transparent p-3'}
        onClick={handleOpen}
      >
        <span>Account:</span>
        {truncatedAddress}
      </li> */}
            {/* <>
        <StaticModal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          className="network_modal_container"
        >
          {body}
        </StaticModal>
      </> */}
        </>
    )
}

export default AccountInfo
