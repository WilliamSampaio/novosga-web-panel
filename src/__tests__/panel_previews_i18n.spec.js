import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { cwd } from 'node:process'
import { describe, expect, it } from 'vitest'

const readSource = (path) => readFileSync(join(cwd(), path), 'utf8')

describe('panel previews i18n', () => {
  it('does not keep Default preview labels and samples hardcoded', () => {
    const source = readSource('src/components/panels/Default/Preview.vue')

    expect(source).not.toContain('label="Painel vazio"')
    expect(source).not.toContain('label="Ocultar nome do cliente"')
    expect(source).not.toContain('label="Senha atual prioridade"')
    expect(source).not.toContain('label="Histórico vazio"')
    expect(source).not.toContain("'minha unidade'")
    expect(source).not.toContain("'descrição do serviço'")
    expect(source).not.toContain("'guichê 1'")
    expect(source).toContain("$t('panel.preview.empty_panel')")
    expect(source).toContain("$t('panel.preview.hide_client_name')")
    expect(source).toContain("$t('panel.preview.current_ticket_priority')")
    expect(source).toContain("$t('panel.preview.empty_history')")
    expect(source).toContain("t('panel.preview.sample_unit')")
    expect(source).toContain("t('panel.preview.sample_service')")
    expect(source).toContain("t('panel.preview.sample_counter_1')")
  })

  it('does not keep Model001 preview labels and samples hardcoded', () => {
    const source = readSource('src/components/panels/Model001/Preview.vue')

    expect(source).not.toContain('label="Painel vazio"')
    expect(source).not.toContain('label="Nome do cliente não informado"')
    expect(source).not.toContain('label="Senha atual prioridade"')
    expect(source).not.toContain('label="Histórico vazio"')
    expect(source).not.toContain("'minha unidade'")
    expect(source).not.toContain("'maria bonita'")
    expect(source).not.toContain("'descrição do serviço'")
    expect(source).not.toContain("'guichê 1'")
    expect(source).toContain("$t('panel.preview.empty_panel')")
    expect(source).toContain("$t('panel.preview.client_name_missing')")
    expect(source).toContain("$t('panel.preview.current_ticket_priority')")
    expect(source).toContain("$t('panel.preview.empty_history')")
    expect(source).toContain("t('panel.preview.sample_unit')")
    expect(source).toContain("t('panel.preview.sample_client_2')")
    expect(source).toContain("t('panel.preview.sample_service')")
  })

  it('keeps real panel and history labels translated', () => {
    const files = [
      'src/components/panels/Default/Panel.vue',
      'src/components/panels/Default/History.vue',
      'src/components/panels/Model001/Panel.vue',
      'src/components/panels/Model001/History.vue',
    ].map(readSource)

    expect(files.join('\n')).toContain("$t('panel.empty')")
    expect(files.join('\n')).toContain("$t('panel.history.title')")
    expect(files.join('\n')).toContain("t('panel.ticket')")
  })

  it('keeps footer logos constrained in panels and previews', () => {
    const files = [
      'src/components/panels/Default/Panel.vue',
      'src/components/panels/Default/Preview.vue',
      'src/components/panels/Model001/Panel.vue',
      'src/components/panels/Model001/Preview.vue',
      'src/components/panels/Alert/Panel.vue',
      'src/components/panels/Alert/Preview.vue',
    ].map(readSource)

    expect(files.join('\n')).toContain('object-contain')
    expect(files.join('\n')).toContain('max-h-24')
    expect(files.join('\n')).toContain('max-h-12')
    expect(files.join('\n')).toContain('py-2')
    expect(files.join('\n')).toContain('py-1')
  })
})
