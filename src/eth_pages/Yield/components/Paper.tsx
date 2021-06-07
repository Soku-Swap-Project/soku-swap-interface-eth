import React from 'react'

export default function Paper({ children, className, ...rest }: any): JSX.Element {
    return (
        <div
            className={` ${className}`}
            {...rest}
            style={{
                borderBottom: '2px solid #ebebeb'
            }}
        >
            {children}
        </div>
    )
}
