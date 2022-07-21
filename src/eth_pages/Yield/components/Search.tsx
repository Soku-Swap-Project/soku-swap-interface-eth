import React from 'react'
import { Search as SearchIcon } from 'react-feather'

export default function Search({ term, search }: any) {
    return (
        <div className="relative w-full sm:max-w-xl md:max-w-sm flex-end">
            <input
                className="py-3 pl-4 pr-14 rounded w-full focus:outline-none focus:ring border-0"
                onChange={e => search(e.target.value)}
                style={{ background: '#fff', color: '#05195a' }}
                value={term}
                placeholder="Search by name, symbol, address"
            />
            {/* <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                <span
                    style={{
                        right: '0',
                        paddingRight: '1.5rem',
                        position: 'absolute',
                        fontSize: '20px',
                        color: '#04bbfb',
                        pointerEvents: 'none'
                    }}
                    className="material-icons"
                >
                    search
                </span>
            </div> */}
        </div>
    )
}
