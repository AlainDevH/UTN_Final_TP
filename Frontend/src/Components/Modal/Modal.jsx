import React, { useEffect } from 'react'
import { FaXmark } from 'react-icons/fa6'
import './Modal.css'

export default function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            window.addEventListener('keydown', handleKeyDown)
        }
        return () => {
            document.body.style.overflow = 'unset'
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
                        <FaXmark />
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    )
}
