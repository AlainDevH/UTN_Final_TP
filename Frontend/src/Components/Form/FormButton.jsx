import React from 'react'
import './Form.css'

export default function FormButton({ children, loading = false, loadingText = 'Procesando...', type = 'submit', disabled = false, onClick }) {
    return (
        <button
            type={type}
            className="form-button"
            disabled={disabled || loading}
            onClick={onClick}
        >
            {loading && <span className="btn-spinner" />}
            {loading ? loadingText : children}
        </button>
    )
}
