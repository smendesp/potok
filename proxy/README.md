# Proxy reverso PotoK

Proxy Nginx à frente do frontend com HTTPS, rate limiting e headers de segurança.

## Desenvolvimento / local

- O build gera um **certificado autoassinado**; HTTPS funciona na porta 443 com aviso no browser.
- HTTP na porta 80 redireciona para HTTPS.
- Acesso: `https://localhost` (aceitar o aviso de segurança) ou `http://localhost` (redirect).

## Produção: HTTPS com certificados reais

### 1. Obter certificados (Let's Encrypt com Certbot)

No **host** (não dentro do container), com o domínio já apontando para o servidor:

```bash
# Instalar certbot (exemplo: Debian/Ubuntu)
sudo apt install certbot

# Obter certificado (standalone ou webroot conforme o teu setup)
sudo certbot certonly --standalone -d teudominio.com
# Ou, se outro serviço usa a porta 80:
# sudo certbot certonly --webroot -w /var/www/html -d teudominio.com
```

Os ficheiros ficam em algo como:
- `/etc/letsencrypt/live/teudominio.com/fullchain.pem`
- `/etc/letsencrypt/live/teudominio.com/privkey.pem`

### 2. Montar os certificados no proxy

No `docker-compose.yml`, no serviço `proxy`, descomenta e ajusta o volume para os certificados reais:

```yaml
proxy:
  build: ./proxy
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - /etc/letsencrypt/live/teudominio.com/fullchain.pem:/etc/nginx/ssl/cert.pem:ro
    - /etc/letsencrypt/live/teudominio.com/privkey.pem:/etc/nginx/ssl/key.pem:ro
  depends_on:
    - frontend
  restart: unless-stopped
```

Ou, se preferires uma pasta (ex. `certs/gateway` com `cert.pem` e `key.pem`):

```yaml
volumes:
  - ./certs/gateway:/etc/nginx/ssl:ro
```

Reinicia o proxy:

```bash
docker compose up -d proxy --force-recreate
```

### 3. Renovação automática (Let's Encrypt)

Os certificados Let's Encrypt duram ~90 dias. Para renovar:

```bash
sudo certbot renew
docker compose restart proxy
```

Podes automatizar com cron:

```cron
0 3 * * * certbot renew --quiet && cd /caminho/potok && docker compose restart proxy
```

### 4. Mesma coisa em produção (resumo)

| Passo | Ação |
|-------|------|
| DNS | Apontar o domínio (A/AAAA) para o IP do servidor. |
| Certificados | `certbot certonly` no host (standalone ou webroot). |
| Compose | Montar `fullchain.pem` e `privkey.pem` em `/etc/nginx/ssl/` no serviço `proxy`. |
| Portas | Garantir 80 e 443 abertas no firewall. |
| Renovação | `certbot renew` + restart do proxy (cron recomendado). |

O `nginx.conf` já está preparado: usa `cert.pem` e `key.pem` em `/etc/nginx/ssl/`. Ao montares os ficheiros do Let's Encrypt com esses nomes (ou o caminho que puseste no volume), o proxy passa a servir HTTPS em produção da mesma forma que em local.
