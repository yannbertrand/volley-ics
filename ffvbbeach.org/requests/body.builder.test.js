import { describe, expect, it } from 'vitest'
import getRequestBody from './body.builder.js'

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
      '"typ_edition=E&type=RES&cal_saison=2021%2F2022&cal_codent=PTPL44&cal_codpoule=CA1"',
    )
  })

  it('should remove empty saison', () => {
    const result = getRequestBody({
      typ_edition: 'E',
      type: 'RES',
      cal_saison: null,
      cal_codent: 'PTPL44',
      cal_codpoule: 'CA1',
    })

    expect(result).toMatchInlineSnapshot(
      '"typ_edition=E&type=RES&cal_codent=PTPL44&cal_codpoule=CA1"',
    )
  })

  it('should remove empty poule', () => {
    const result = getRequestBody({
      typ_edition: 'E',
      type: 'RES',
      cal_saison: '2021/2022',
      cal_codent: 'PTPL44',
      cal_codpoule: null,
    })

    expect(result).toMatchInlineSnapshot(
      '"typ_edition=E&type=RES&cal_saison=2021%2F2022&cal_codent=PTPL44"',
    )
  })
})
