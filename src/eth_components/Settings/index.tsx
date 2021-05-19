import { MenuFlyout, StyledMenu, StyledMenuButton } from 'eth_components/StyledMenu'
import React, { useContext, useRef, useState } from 'react'
import { Settings, X } from 'react-feather'
import Modal from '@material-ui/core/Modal'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { useOnClickOutside } from '../../eth_hooks/useOnClickOutside'
import { ApplicationModal } from '../../eth_state/application/actions'
import { useModalOpen, useToggleSettingsMenu } from '../../eth_state/application/hooks'
import {
    useExpertModeManager,
    useUserSingleHopOnly,
    useUserSlippageTolerance,
    useUserTransactionTTL
} from '../../eth_state/user/hooks'
import { TYPE } from '../../theme'
import { ButtonError } from '../ButtonLegacy'
import { AutoColumn } from '../Column'
// import Modal from '../Modal'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import Toggle from '../Toggle'
import TransactionSettings from '../TransactionSettings'

import './settingsmodal.css'

const StyledMenuIcon = styled(Settings)`
    height: 20px;
    width: 20px;

    > * {
        stroke: ${({ theme }) => theme.text2};
    }

    :hover {
        opacity: 0.7;
    }
`

const StyledCloseIcon = styled(X)`
    height: 20px;
    width: 20px;
    :hover {
        cursor: pointer;
    }

    > * {
        stroke: ${({ theme }) => theme.text1};
    }
`

const EmojiWrapper = styled.div`
    position: absolute;
    bottom: -6px;
    right: 0px;
    font-size: 14px;
`

const Break = styled.div`
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.bg3};
`

const ModalContentWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 0;
    background-color: ${({ theme }) => theme.bg2};
    border-radius: 10px;
`

const ExtendedMenuFlyout = styled(MenuFlyout)`
    min-width: 22rem;
    margin-right: -20px;

    ${({ theme }) => theme.mediaWidth.upToMedium`
        min-width: 20rem;
        margin-right: -10px;
  `};
`

export default function SettingsTab() {
    const node = useRef<HTMLDivElement>(null)
    const open = useModalOpen(ApplicationModal.SETTINGS)
    const toggle = useToggleSettingsMenu()

    const [m_open, setM_Open] = React.useState(false)
    // const { login, logout } = useAuth()

    const handleOpen = () => {
        setM_Open(true)
    }

    const handleClose = () => {
        setM_Open(false)
    }

    const theme = useContext(ThemeContext)
    const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()

    const [ttl, setTtl] = useUserTransactionTTL()

    const [expertMode, toggleExpertMode] = useExpertModeManager()

    const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()

    // show confirmation view before turning on
    const [showConfirmation, setShowConfirmation] = useState(false)

    // useOnClickOutside(node, open ? toggle : undefined)

    const body = (
        <div className={`claimSoku__modal`}>
            <div className="claimSoku__modal_header">
                <h1>Claim Soku</h1>
            </div>
            <hr />

            <div>
                <h2 id="simple-modal-title">Your Rewards:</h2>
                <br />
                <p id="simple-modal-description">
                    Congratulations! You earned <strong className="soku_rewarded"> SOKU</strong> tokens this week.
                </p>
            </div>
        </div>
    )

    return (
        <StyledMenu ref={node}>
            {/* <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)} maxHeight={100}>
                <ModalContentWrapper>
                    <AutoColumn gap="lg">
                        <RowBetween style={{ padding: '0 2rem' }}>
                            <div />
                            <Text fontWeight={500} fontSize={20}>
                                Are you sure?
                            </Text>
                            <StyledCloseIcon onClick={() => setShowConfirmation(false)} />
                        </RowBetween>
                        <Break />
                        <AutoColumn gap="lg" style={{ padding: '0 2rem' }}>
                            <Text fontWeight={500} fontSize={20}>
                                Expert mode turns off the confirm transaction prompt and allows high slippage trades
                                that often result in bad rates and lost funds.
                            </Text>
                            <Text fontWeight={600} fontSize={20}>
                                ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.
                            </Text>
                            <ButtonError
                                error={true}
                                padding={'12px'}
                                onClick={() => {
                                    if (
                                        window.prompt(`Please type the word "confirm" to enable expert mode.`) ===
                                        'confirm'
                                    ) {
                                        toggleExpertMode()
                                        setShowConfirmation(false)
                                    }
                                }}
                            >
                                <Text fontSize={20} fontWeight={500} id="confirm-expert-mode">
                                    Turn On Expert Mode
                                </Text>
                            </ButtonError>
                        </AutoColumn>
                    </AutoColumn>
                </ModalContentWrapper>
            </Modal> */}
            <StyledMenuButton onClick={toggle} id="open-settings-dialog-button">
                <span className="material-icons settings">settings</span>
                {/* {expertMode ? (
                    <EmojiWrapper>
                        <span role="img" aria-label="wizard-icon">
                            🧙
                        </span>
                    </EmojiWrapper>
                ) : null} */}
            </StyledMenuButton>
            {open && (
                <Modal open={open} onClose={toggle} className="settings_modal_container">
                    <AutoColumn gap="md" className="settings_modal">
                        <div className="settings_modal__header">
                            <div className="font-semibold settings_modal_transactionSettings">Settings</div>
                            <button style={{ cursor: 'pointer' }} onClick={toggle}>
                                <span style={{ color: '#04bbfb', width: '20px' }} className="material-icons">
                                    close
                                </span>
                            </button>
                        </div>

                        <TransactionSettings
                            rawSlippage={userSlippageTolerance}
                            setRawSlippage={setUserslippageTolerance}
                            deadline={ttl}
                            setDeadline={setTtl}
                        />
                        {/* <div className="font-semibold">Interface Settings</div>
                        <RowBetween>
                            <RowFixed>
                                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                                    Toggle Expert Mode
                                </TYPE.black>
                                <QuestionHelper text="Bypasses confirmation modals and allows high slippage trades. Use at your own risk." />
                            </RowFixed>
                            <Toggle
                                id="toggle-expert-mode-button"
                                isActive={expertMode}
                                toggle={
                                    expertMode
                                        ? () => {
                                              toggleExpertMode()
                                              setShowConfirmation(false)
                                          }
                                        : () => {
                                              toggle()
                                              setShowConfirmation(true)
                                          }
                                }
                            />
                        </RowBetween>
                        <RowBetween>
                            <RowFixed>
                                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                                    Disable Multihops
                                </TYPE.black>
                                <QuestionHelper text="Restricts swaps to direct pairs only." />
                            </RowFixed>
                            <Toggle
                                id="toggle-disable-multihop-button"
                                isActive={singleHopOnly}
                                toggle={() => (singleHopOnly ? setSingleHopOnly(false) : setSingleHopOnly(true))}
                            />
                        </RowBetween> */}
                    </AutoColumn>
                </Modal>
            )}
        </StyledMenu>
    )
}
