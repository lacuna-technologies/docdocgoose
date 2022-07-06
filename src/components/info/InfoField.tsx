import React, { useCallback } from 'react'

type Props = {
  label: string,
  infoKey?: string,
  value: string,
  onChangeField?: (key: string, value: string) => void,
}

const InfoField: React.FC<Props> = ({ label, value, infoKey, onChangeField }) => {
  const editable = typeof onChangeField === `function` && infoKey
  const inputClass = editable ? `bg-white` : `bg-slate-100 cursor-not-allowed`
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeField(infoKey, event.target.value)
  }, [infoKey, onChangeField])

  return (
    <div className="flex md:flex-row flex-col">
      <label className="w-32 py-2">{label}</label>
      <input
        className={`px-4 py-2 grow outline-none ${inputClass}`}
        type="text"
        value={value}
        readOnly={!editable}
        onChange={onChange}
      />
    </div>
  )
}

export default InfoField