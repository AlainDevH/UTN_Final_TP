import React from 'react'
import { FaCircleCheck, FaCircleExclamation, FaCircleInfo } from 'react-icons/fa6'
import './Alert.css'

export default function Alert({ type = 'info', children }) {
    if (!children) return null

    const icons = {
        success: <FaCircleCheck style={{ flexShrink: 0, fontSize: '16px' }} />,
        error: <FaCircleExclamation style={{ flexShrink: 0, fontSize: '16px' }} />,
        info: <FaCircleInfo style={{ flexShrink: 0, fontSize: '16px' }} />
    }

    return (
        <div className={`alert alert-${type}`} role="alert">
            {icons[type] || icons.info}
            <div>{children}</div>
        </div>
    )
}
