import React from 'react'
import './Form.css'

export default function TextField({ label, name, type = 'text', value, onChange, placeholder, required = false, autoComplete, disabled = false }) {
    return (
        <div className="form-group">
            {label && (
                <label className="form-label" htmlFor={name}>
                    {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                className="form-input"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                autoComplete={autoComplete}
                disabled={disabled}
            />
        </div>
    )
}
