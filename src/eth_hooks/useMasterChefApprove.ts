import { Contract, ethers } from 'ethers'
import { useCallback } from 'react'
import ERC20_ABI from '../eth_constants/abis/erc20.json'
import { useContract, useMasterChefContract } from '.'
import { useTransactionAdder } from '../eth_state/transactions/hooks'
import { isAddress } from '../utils'

const useApprove = (lpAddress: string) => {
    //const { account } = useActiveWeb3React()
    const addTransaction = useTransactionAdder()
    const masterChefContract = useMasterChefContract()
    const lpAddressChecksum = isAddress(lpAddress)
    const lpContract = useContract(lpAddressChecksum ? lpAddressChecksum : undefined, ERC20_ABI, true) // withSigner = true

    console.log(lpContract)

    const approve = async (lpContract: Contract | null, masterChefContract: Contract | null) => {
        return lpContract?.approve(masterChefContract?.address, ethers.constants.MaxUint256.toString())
    }

    const handleApprove = useCallback(async () => {
        try {
            const tx = await approve(lpContract, masterChefContract)
            return addTransaction(tx, { summary: 'Approve' })
        } catch (e) {
            return e
        }
    }, [addTransaction, lpContract, masterChefContract])

    return { onApprove: handleApprove }
}

export default useApprove
