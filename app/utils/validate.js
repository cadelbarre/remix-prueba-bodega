import { z } from 'zod'

export const validate = {
  getInicialValues: () => {
    return {
      success: true,
      errorMessage: '',
      data: null
    }
  },
  isPositiveNumber: (value) => {
    const response = validate.getInicialValues()
    const isNumber = z.number().nonnegative().int()
    const sanitizeValue = typeof value === 'string' ? Number(value) : value
    const result = isNumber.safeParse(sanitizeValue)

    if (!result.success) {
      // handle error then return
      response.success = false
      response.errorMessage = result.error.issues[0].message
    } else {
      // do something
      response.data = result.data
    }

    return response
  },
  isEmpty: (value) => {
    const response = validate.getInicialValues()
    const isEmptyCheck = z.undefined()
    const result = isEmptyCheck.safeParse(value)

    if (!result.success) {
      // handle error then return
      response.success = false
      response.errorMessage = result.error.issues[0].message
    } else {
      // do something
      response.data = result.data
    }

    return response
  }
}
