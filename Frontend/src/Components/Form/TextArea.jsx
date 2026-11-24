import React from 'react'
import './Form.css'

export default function TextArea({ label, name, value, onChange, placeholder, rows = 3, maxLength, required = false }) {
    return (
        <div className="form-group">
            {label && (
                <label className="form-label" htmlFor={name}>
                    {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
                </label>
            )}
            <textarea
                id={name}
                name={name}
                className="form-textarea"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                maxLength={maxLength}
                required={required}
            />
            {maxLength && (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>
                    {(value || '').length}/{maxLength}
                </span>
            )}
        </div>
    )
}
