import { Spinner } from 'phosphor-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormContainer, ZipCodeContainer } from './style'

export function AddressForm() {
  const { register, setValue } = useFormContext()
  const [zipCode, setZipCode] = useState('')
  const [isZipCodeLoading, setIsZipCodeLoading] = useState(false)

  function handleZipCodeBlur() {
    const getAddressFromZipCode = async () => {
      setIsZipCodeLoading(true)
      const addressResponse = await fetch(
        `https://ws.apicep.com/cep/${zipCode}.json`,
      )
      const address = await addressResponse.json()
      setValue('customerAddress.streetName', address.address)
      setValue('customerAddress.district', address.district)
      setValue('customerAddress.city', address.city)
      setValue('customerAddress.state', address.state)
    }

    zipCode.length >= 9 &&
      getAddressFromZipCode().then(() => setIsZipCodeLoading(false))
  }

  function zipCodeFomat(event) {
    let zipCodeFormated = event.target.value.replace(/\D/g, '')
    zipCodeFormated = zipCodeFormated.replace(/^(\d{5})(\d)/, '$1-$2')

    setZipCode(() => zipCodeFormated)
    event.target.value = zipCodeFormated
  }

  console.log(zipCode)

  return (
    <FormContainer>
      <ZipCodeContainer>
        <input
          type="text"
          placeholder="CEP"
          {...register('customerAddress.zipCode', {
            onBlur: () => handleZipCodeBlur(),
            onChange: (event) => zipCodeFomat(event),
            value: zipCode,
            disabled: isZipCodeLoading,
            maxLength: 9,
          })}
        />
        {isZipCodeLoading && (
          <Spinner weight="bold" className="zipCodeLoader" />
        )}
      </ZipCodeContainer>
      <input
        type="text"
        placeholder="Rua"
        {...register('customerAddress.streetName', {
          disabled: isZipCodeLoading,
        })}
      />
      <div>
        <input
          type="number"
          placeholder="Número"
          {...register('customerAddress.number', { valueAsNumber: true })}
        />
        <div className="complement-input">
          <input
            type="text"
            placeholder="Complemento"
            {...register('customerAddress.complement')}
          />
          <span>Opcional</span>
        </div>
      </div>
      <div>
        <input
          type="text"
          placeholder="Bairro"
          {...register('customerAddress.district', {
            disabled: isZipCodeLoading,
          })}
        />
        <input
          type="text"
          placeholder="Cidade"
          {...register('customerAddress.city', {
            disabled: isZipCodeLoading,
          })}
        />
        <input
          type="text"
          placeholder="UF"
          className="state-input"
          {...register('customerAddress.state', {
            disabled: isZipCodeLoading,
          })}
        />
      </div>
    </FormContainer>
  )
}
