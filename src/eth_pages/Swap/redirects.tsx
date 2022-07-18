import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { AppDispatch } from '../../eth_state'
import { ApplicationModal, setOpenModal } from '../../eth_state/application/actions'

// Redirects Legacy Hash Routes to Browser Routes
export function RedirectHashRoutes({ location }: RouteComponentProps) {
    // console.log('location:', location.hash)
    // if (!location.hash) {
    //     return <Redirect to={{ ...location, pathname: '/swap/' }} />
    // }
    // return <Redirect to={location.hash.replace('#', '')} />
    return null
}

// Redirects to swap but only replace the pathname
export function RedirectPathToSwapOnly({ location }: RouteComponentProps) {
    console.log(location)
    return null
    // return <Redirect to={{ ...location, pathname: '/swap/' }} />
}

// Redirects from the /swap/:outputCurrency path to the /swap?outputCurrency=:outputCurrency format
export function RedirectToSwap(props: RouteComponentProps<{ outputCurrency: string }>) {
    const {
        location: { search },
        match: {
            params: { outputCurrency }
        }
    } = props

    return (
        <Redirect
            to={{
                ...props.location,
                pathname: '/pool/',
                search:
                    search && search.length > 1
                        ? `${search}&outputCurrency=${outputCurrency}`
                        : `?outputCurrency=${outputCurrency}`
            }}
        />
    )
}

export function OpenClaimAddressModalAndRedirectToSwap(props: RouteComponentProps) {
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(setOpenModal(ApplicationModal.ADDRESS_CLAIM))
    }, [dispatch])
    return <RedirectPathToSwapOnly {...props} />
}
