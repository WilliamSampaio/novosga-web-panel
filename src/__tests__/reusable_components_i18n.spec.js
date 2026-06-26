import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { cwd } from 'node:process'
import { describe, expect, it } from 'vitest'

const readSource = (path) => readFileSync(join(cwd(), path), 'utf8')

describe('reusable components i18n', () => {
  it('does not keep custom image dialog texts hardcoded', () => {
    const source = readSource('src/components/DialogGetImageUrlFromCustom.vue')

    expect(source).not.toContain('text="Carregar da pasta custom"')
    expect(source).not.toContain('title="Carregar imagem da pasta custom"')
    expect(source).not.toContain('subtitle="Selecione uma imagem da pasta custom para usar no painel."')
    expect(source).not.toContain('Duplo-clique para pegar a URL da imagem.')
    expect(source).not.toContain('text="Fechar"')
    expect(source).toContain("$t('custom_image.button.load')")
    expect(source).toContain("$t('custom_image.dialog.title')")
    expect(source).toContain("$t('custom_image.dialog.subtitle')")
    expect(source).toContain("$t('custom_image.dialog.hint')")
    expect(source).toContain("$t('common.close')")
  })

  it('does not keep reset dialog texts hardcoded', () => {
    const source = readSource('src/components/ResetConfiguration.vue')

    expect(source).not.toContain('Redefinir Painel')
    expect(source).not.toContain('Atenção! Ação Crítica')
    expect(source).not.toContain('Você está prestes a')
    expect(source).not.toContain('Esta ação irá:')
    expect(source).not.toContain('Manter Configurações')
    expect(source).not.toContain('Sim, Redefinir Tudo')
    expect(source).toContain("$t('reset.button.open')")
    expect(source).toContain("$t('reset.dialog.title')")
    expect(source).toContain("$t('reset.dialog.description')")
    expect(source).toContain("$t('reset.button.keep')")
    expect(source).toContain("$t('reset.button.confirm')")
  })

  it('does not keep speech editor texts hardcoded', () => {
    const source = readSource('src/components/SpeechTextEditor.vue')

    expect(source).not.toContain('label="Template da chamada"')
    expect(source).not.toContain('>\\n        Ouvir\\n      </v-btn>')
    expect(source).not.toContain("local: 'Guichê'")
    expect(source).toContain("$t('speech_editor.label.template')")
    expect(source).toContain("$t('common.listen')")
    expect(source).toContain("t('speech_editor.preview.local')")
  })
})
