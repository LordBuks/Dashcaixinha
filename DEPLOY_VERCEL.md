# Guia de Deploy no Vercel - Dashboard Disciplinar

## 📋 Pré-requisitos
- Node.js instalado (versão 18 ou superior)
- Conta no Vercel (https://vercel.com)
- Vercel CLI instalado

## 🚀 Passo a Passo para Deploy

### 1. Instalar o Vercel CLI (se não tiver)
```bash
npm install -g vercel
```

### 2. Fazer login no Vercel
```bash
vercel login
```
- Escolha seu método de login (GitHub, GitLab, Bitbucket ou Email)
- Siga as instruções no navegador

### 3. Navegar para a pasta do projeto
```bash
cd caminho/para/dashboard-disciplinar-atletas
```

### 4. Instalar dependências
```bash
npm install
```

### 5. Testar o build local (opcional)
```bash
npm run build
```

### 6. Fazer o deploy
```bash
vercel
```

**Durante o primeiro deploy, o Vercel fará algumas perguntas:**

1. **"Set up and deploy?"** → Digite `Y` (Yes)
2. **"Which scope?"** → Escolha sua conta/organização
3. **"Link to existing project?"** → Digite `N` (No, criar novo projeto)
4. **"What's your project's name?"** → `dashboard-disciplinar-atletas` (ou pressione Enter para usar o padrão)
5. **"In which directory is your code located?"** → Pressione Enter (pasta atual)
6. **"Want to modify these settings?"** → Digite `N` (No)

### 7. Deploy em produção (após o primeiro deploy)
```bash
vercel --prod
```

## 📁 Estrutura de Arquivos Necessários

O projeto já está configurado com:
- ✅ `vercel.json` - Configuração do Vercel
- ✅ `package.json` - Com script `vercel-build`
- ✅ Dependências limpas (sem lovable-tagger)
- ✅ Build otimizado para produção

## 🔧 Comandos Úteis do Vercel

```bash
# Ver projetos
vercel list

# Ver deployments de um projeto
vercel ls

# Remover um deployment
vercel rm [deployment-url]

# Ver logs
vercel logs [deployment-url]

# Configurar domínio customizado
vercel domains add [seu-dominio.com]

# Ver informações do projeto
vercel inspect [deployment-url]
```

## 🌐 Após o Deploy

1. O Vercel fornecerá uma URL como: `https://dashboard-disciplinar-atletas.vercel.app`
2. A aplicação estará disponível imediatamente
3. Cada novo deploy criará uma preview URL
4. Use `vercel --prod` para deploy em produção

## 🔄 Atualizações Futuras

Para atualizar a aplicação:
```bash
# Fazer mudanças no código
# Depois executar:
vercel --prod
```

## ⚠️ Troubleshooting

Se houver problemas:
```bash
# Limpar cache do Vercel
vercel dev --debug

# Verificar configuração
vercel inspect

# Recriar projeto
vercel link
```

## 📊 Monitoramento

- Acesse https://vercel.com/dashboard para ver analytics
- Monitore performance e logs
- Configure alertas se necessário

---

**🎉 Pronto! Sua aplicação estará rodando no Vercel com todos os dados dos atletas funcionando perfeitamente!**

