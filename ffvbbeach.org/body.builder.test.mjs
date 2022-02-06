import { describe, expect, it } from 'vitest'
import getRequestBody from './body.builder.mjs'

describe('form.builder', () => {
  it('should return a string form', () => {
    const result = getRequestBody({
      typ_edition: 'E',
      type: 'RES',
      cal_saison: '2021/2022',
      cal_codent: 'PTPL44',
      cal_codpoule: 'CA1',
    })

    expect(result).toMatchInlineSnapshot(
      '"typ_edition=E&type=RES&cal_saison=2021%2F2022&cal_codent=PTPL44&cal_codpoule=CA1"'
    )
  })
})
