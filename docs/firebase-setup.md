# Firebase (Firestore) — Captação de leads da Neuropsicologia

> Banco de dados das capturas do formulário da página **neuropsicologia.html**.
> A parte da **clínica/psicoterapia** fica para depois (instruções no fim).

O site **já está todo pré-configurado**. Você só precisa:
1. Criar o projeto no Firebase e pegar o *config*.
2. Colar o *config* em **um único arquivo**: `src/assets/js/firebase-config.js`.
3. Ativar o Firestore e colar as **regras de segurança**.
4. `git push` (o deploy é automático).

Enquanto o config não estiver preenchido, o formulário **funciona normalmente
pelo WhatsApp** — nada quebra. Depois de configurado, cada envio também é
**gravado no banco**.

---

## Passo 1 — Criar o projeto
1. Acesse <https://console.firebase.google.com> e clique em **Adicionar projeto**.
2. Nome sugerido: `jessica-neuropsicologia`. Pode desativar o Google Analytics.

## Passo 2 — Registrar o app Web e copiar o config
1. No projeto, clique no ícone **`</>`** (Web) para registrar um app.
2. Apelido: `site-jessica`. **Não** marque Firebase Hosting.
3. Copie o objeto `firebaseConfig` que aparece (apiKey, projectId, etc.).

## Passo 3 — Colar o config no site
Abra `src/assets/js/firebase-config.js` e substitua os `"COLE_AQUI"` pelos
valores reais. Exemplo de como fica:

```js
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyD...sua-chave",
  authDomain: "jessica-neuropsicologia.firebaseapp.com",
  projectId: "jessica-neuropsicologia",
  storageBucket: "jessica-neuropsicologia.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123"
};
```

> ℹ️ Esses valores **não são segredo** — o config web do Firebase é público
> por natureza. A segurança vem das **Regras** (Passo 5).

## Passo 4 — Ativar o Cloud Firestore
1. Menu lateral → **Criar banco de dados** (Firestore Database).
2. Modo: **produção**. Local: `southamerica-east1` (São Paulo).

## Passo 5 — Regras de segurança (cole exatamente)
Aba **Regras** do Firestore → cole e publique:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Leads da Neuropsicologia: qualquer um pode CRIAR (formulário público),
    // ninguém pode ler/editar/apagar pelo navegador (só você, pelo Console).
    match /leads_neuropsicologia/{doc} {
      allow create: if request.resource.data.nome is string
                    && request.resource.data.nome.size() > 1
                    && request.resource.data.nome.size() < 200
                    && request.resource.data.size() < 15;
      allow read, update, delete: if false;
    }
  }
}
```

## Passo 6 — Publicar
```
git add -A && git commit -m "Configura Firebase da neuropsicologia" && git push
```
O deploy (GitHub Actions) atualiza o site sozinho em ~1 min.

## Passo 7 — Ver os leads
Firebase Console → **Firestore Database** → coleção `leads_neuropsicologia`.
Cada envio do formulário vira um documento.

---

## O que é gravado (modelo de dados)
Coleção: **`leads_neuropsicologia`**

| Campo | Origem |
|-------|--------|
| `nome` | campo "Seu nome" |
| `whatsapp` | campo "WhatsApp" |
| `idade_da_crianca` | campo "Idade da criança" |
| `preocupacao` | campo "Principal preocupação" |
| `origem` | fixo: `leads_neuropsicologia` |
| `criadoEm` | data/hora do servidor |
| `userAgent` | navegador de quem enviou |

## Como funciona por baixo
- `src/assets/js/firebase-config.js` → o config (você edita).
- `src/assets/js/lead.js` → grava no Firestore **e** abre o WhatsApp.
  Só atua em formulários com `data-collection` (hoje, só o da neuropsicologia).
- Se o Firebase estiver fora do ar ou sem config, cai automaticamente só no
  WhatsApp (o lead não se perde para o atendimento imediato).

## Custos
Plano gratuito (Spark) cobre folgado um consultório: 20 mil gravações/dia.
Sem cartão de crédito necessário.

## Observação sobre spam
O formulário é público (precisa ser). Para um consultório o volume é baixo.
Se um dia receber spam, dá para adicionar Firebase App Check / reCAPTCHA.

---

## Clínica / Psicoterapia (ATIVA)
A página `relacionamentos.html` também grava leads — na coleção
**`leads_clinica`** (mesmo projeto Firebase).

Regras das DUAS coleções (cole na aba Regras e publique):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /leads_neuropsicologia/{doc} {
      allow create: if request.resource.data.nome is string
                    && request.resource.data.nome.size() > 1
                    && request.resource.data.nome.size() < 200
                    && request.resource.data.size() < 15;
      allow read, update, delete: if false;
    }

    match /leads_clinica/{doc} {
      allow create: if request.resource.data.nome is string
                    && request.resource.data.nome.size() > 1
                    && request.resource.data.nome.size() < 200
                    && request.resource.data.size() < 15;
      allow read, update, delete: if false;
    }
  }
}
```

Campos de `leads_clinica`: `nome`, `whatsapp`, `atendimento`, `origem`,
`criadoEm`, `userAgent`.
