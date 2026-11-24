import React from 'react'
import './Form.css'

export default function SelectField({ label, name, value, onChange, options = [], required = false, disabled = false }) {
    return (
        <div className="form-group">
            {label && (
                <label className="form-label" htmlFor={name}>
                    {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
                </label>
            )}
            <select
                id={name}
                name={name}
                className="form-select"
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
