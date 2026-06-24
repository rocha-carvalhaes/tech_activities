# Contexto de Habilidades dos Alunos

> **Registro vivo.** Este documento abstrai as habilidades de pensamento
> computacional dos alunos a partir das atividades do projeto e as classifica
> qualitativamente. Ele **não** descreve o código — descreve o que os alunos
> conseguem (ou não) fazer com os conceitos que as atividades expõem.

## Como usar

- **Propósito:** ter um retrato evolutivo das habilidades da turma, para calibrar a
  dificuldade das próximas atividades e manter o estilo de ensino em que **o aluno
  descobre o conceito sozinho** (em vez de decorar definições).
- **Quem mantém:** o professor relata observações de cada rodada; as classificações,
  evidências e datas são atualizadas a partir desse relato.
- **Como atualizar:** a cada nova aplicação, reavalie os níveis da seção
  [Habilidades classificadas](#habilidades-classificadas), ajuste as evidências e
  acrescente uma entrada datada no [Histórico de observações](#histórico-de-observações).
  Habilidades ainda não observadas ficam ⚪ **Sem dados** até haver evidência real.

## Escala de classificação

| Nível | Significado |
|---|---|
| 🟢 **Domina** | Descobre e aplica sozinho; consegue transferir para outros contextos |
| 🟡 **Em desenvolvimento** | Entende após exploração ou dica; ainda não é automático |
| 🟠 **Em dificuldade** | Entendimento parcial; precisa de muito apoio |
| 🔴 **Não compreendido** | Não conseguiu, mesmo com explicação |
| ⚪ **Sem dados** | Ainda não observado nesta turma |

## Mapa conceito × atividade

Onde cada habilidade aparece nas atividades (`character-jump` = Personagem Saltador,
`slime-platformer` = Slime Aventureiro, `fabrica-de-fases` = Fábrica de Fases).

| Habilidade (conceito) | Atributo / sintaxe | Atividades |
|---|---|---|
| Reconhecer atributos manipuláveis | painel à esquerda (`atributo = valor`) | saltador, slime, fábrica |
| Magnitude numérica (inteiro) | `jump`, e altura como efeito | saltador, slime |
| Escala / proporção | `size` | saltador, slime |
| Tipo texto + aspas (string) | `color = "teal"` | saltador, slime |
| Decimais / ponto flutuante | `speed = 3.5` | saltador, slime |
| Coordenadas 2D / tuplas | `box = (col, row)`, `goal = (col, row)` | slime, fábrica |
| Composição / múltiplas instâncias | vários `box = ...` formando estruturas | slime (fases 7+), fábrica |
| Edição destrutiva | apagar linhas `box = ...` | slime (fases 7+), fábrica |
| Transferência entre contextos (meta) | reaplicar um conceito de uma atividade em outra | entre atividades |
| Tentativa-e-erro / debugging (meta) | ler mensagens de erro do editor e ajustar | todas |

## Habilidades classificadas

_Última atualização: 2026-06-23 (primeira rodada: Saltador + Slime, fases 1-6)._

| # | Habilidade | Nível | Evidência observada |
|---|---|---|---|
| 1 | Reconhecer que existem variáveis/atributos manipuláveis | 🟡 Em desenvolvimento | Só notaram o painel de atributos após instrução explícita do professor |
| 2 | Magnitude numérica — `jump`/altura do pulo | 🟢 Domina | Descobriram rápido; **transferiram o conceito entre as duas atividades** |
| 3 | Escala / proporção — `size` | 🟡 Em desenvolvimento | Demoraram um pouco, mas entenderam |
| 4 | Tipo texto + sintaxe de aspas — `color` | 🟡 Em desenvolvimento | Demoraram, mas entenderam |
| 5 | Decimais / ponto flutuante — `speed` | 🟢 Domina | Exploraram com facilidade, incluindo a ideia de número decimal |
| 6 | Coordenadas 2D / pares ordenados — `box`, `goal`/estrela | 🔴 Não compreendido | Não entenderam objetos posicionados por coordenada |
| 7 | Composição espacial / múltiplas instâncias (vários `box`) | ⚪ Sem dados | Pararam nas fases 4-6; conceito ainda não exercitado |
| 8 | Edição destrutiva (apagar `box` para mudar o mundo) | ⚪ Sem dados | Não alcançaram as fases 7+ |
| 9 | **Meta:** transferência de conhecimento entre contextos | 🟢 Domina | `jump` aprendido no Saltador foi reaplicado no Slime |
| 10 | **Meta:** tentativa-e-erro / debugging (ler mensagens de erro) | 🟡 Em desenvolvimento | Engajaram, mas "todos tiveram um pouco de dificuldade"; sem dado específico sobre uso das mensagens de erro |

## Implicações para o ensino

- **Coordenadas (🔴) são o gargalo principal.** Precisam de andaime visual: mostrar a
  grade `col`/`row` sobreposta, começar com **um único** `box` e movê-lo passo a passo
  antes de pedir estruturas. Vale uma atividade de descoberta dedicada a pares
  `(col, row)` antes das fases com muitas caixas.
- **Ancorar no que já é forte.** O loop "mudar número → ver efeito" (`jump`, `speed`)
  está sólido — usar como ponte para introduzir coordenadas:
  _"`row` é só mais um número que você muda, mas agora vêm dois juntos."_
- **Próxima rodada natural: Fábrica de Fases.** Ela exige justamente compor coordenadas
  — o conceito mais fraco hoje. Avaliar com cuidado e, se necessário, adiar até as
  coordenadas amadurecerem.

## Itens em aberto (preencher nas próximas rodadas)

- Composição com múltiplas coordenadas e edição destrutiva (fases 7+ do Slime).
- Atividade **Fábrica de Fases** — ainda não aplicada/observada.
- Uso efetivo das mensagens de erro do editor como ferramenta de debugging.

## Histórico de observações

### 2026-06-23 — Saltador + Slime (fases 1-6)
- A maioria da turma engajou; todos tiveram **um pouco** de dificuldade no geral.
- Professor instruiu a observar os atributos à esquerda no Saltador e, no Slime, a
  alterar algum atributo a cada fase para avançar.
- **Descobriram rápido** como aumentar a altura do pulo (`jump`) — o atributo mais
  importante da atividade; o aprendizado de uma atividade ajudou na outra.
- `color` e `size`: demoraram um pouco, mas **entenderam**.
- `speed`: **exploraram com facilidade** (entenderam decimais).
- **Não entenderam** os objetos por coordenadas (`box`/estrela).
- Avançaram até as fases 4-6 do Slime; não chegaram às fases 7+ (apagar caixas/compor).
