# tech_activities

Atividades **adhoc** da [Dataduca](../dataduca) — protótipos rápidos de atividades
de aprendizado para testar com os alunos antes (ou independentemente) de virarem
parte da plataforma principal.

A stack é a mesma do frontend da Dataduca (**React 19 + Vite + Tailwind 4**) e a
paleta é espelhada em [`src/config/palette.js`](src/config/palette.js), de modo que
uma atividade validada aqui possa ser portada para o repositório principal com
pouco atrito.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra o endereço que o Vite imprimir (por padrão `http://localhost:5173`).

## Como funciona

- A **home** ([`src/App.jsx`](src/App.jsx)) lista as atividades em cards e abre a
  selecionada. A navegação é por estado simples — sem router externo.
- O **registro** ([`src/activities/registry.js`](src/activities/registry.js)) é a
  única fonte de verdade das atividades disponíveis.
- Cada atividade vive em `src/activities/<slug>/` e recebe a prop `onBack`.
- [`ActivityShell`](src/components/ActivityShell.jsx) dá o cabeçalho padrão
  (voltar + título); a UI compartilhada fica em [`src/components/ui/`](src/components/ui/).

## Adicionar uma atividade

1. Crie `src/activities/<minha-atividade>/index.jsx` exportando por padrão um
   componente que recebe `{ onBack }`.
2. Importe-o e registre uma entrada em
   [`src/activities/registry.js`](src/activities/registry.js).
3. Pronto — ela aparece na home automaticamente.

## Atividades

| Atividade | Status | Descrição |
| --- | --- | --- |
| 🦘 Personagem Saltador | Em construção | Editar atributos do personagem por código (`size`, `color`, `jump`, `speed`) e jogar um salto entre plataformas verticais. |
