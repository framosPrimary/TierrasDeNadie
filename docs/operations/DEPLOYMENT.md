# Despliegue manual — Tierras de Nadie (laboratorio DevOps)

> **Estado:** prototipo web publicado y probado desde el navegador el 15/10/2026.  
> **Alcance:** entorno de pruebas; no es el destino final de producción (previstos Steam y Android).  
> **Modalidad:** operación manual por el propietario, sin pipeline de CD en esta etapa.

## 1. Infraestructura verificada

- Proveedor: DigitalOcean, Droplet Ubuntu **24.04.4 LTS**.
- Recursos: 1 vCPU, aproximadamente 1 GiB RAM, 24 GiB de filesystem principal (21 GiB disponibles durante la inspección).
- RAM observada: 961 MiB total; ~611 MiB disponibles.
- Swap: sin configurar.
- Usuario operativo: `fede` con `sudo`; evitar tareas cotidianas como `root`.
- Acceso: SSH desde Termux (Android) mediante clave ED25519, autorizada también para el usuario operativo.
- Web server: Nginx, sirviendo HTTP en puerto 80.
- UFW: activo, política entrante DENY; puertos 22, 8080 (de ejercicios anteriores) y 80 permitidos.
- Puerto 8080 pertenece a otros ejercicios: **no modificarlo** sin revisar su uso.
- Dirección pública del prototipo en la sesión: `http://159.89.91.131`.
- Sitio validado visualmente desde navegador tras activar la configuración Nginx.

**Seguridad:** nunca registrar la clave privada de SSH, tokens, contraseñas ni contenidos de `authorized_keys` en el repositorio. Verificar identidad del host SSH por huella antes de aceptarla. La IP es infraestructura pública, no un secreto.

## 2. Instalación y acceso realizados

En Android (Termux):
- Se corrigió una instalación anterior de Termux con error por biblioteca `libssl.so.1.1` ausente.
- Se instaló OpenSSH y se generó una clave `ed25519`.
- Se añadió **solamente la clave pública** a `~/.ssh/authorized_keys` del usuario autorizado en el Droplet, manteniendo otras claves.
- Se verificó la identidad del servidor al conectar por SSH y se aceptó la huella (respuesta explícita `yes`).
- Se comprobó acceso con `ssh fede@SERVIDOR` y privilegios mediante `sudo -v`.
- Se conservó el acceso original durante la migración para evitar bloquear la administración.

No copiar claves privadas ni reutilizar por defecto todas las claves de `root` en otros usuarios en futuros entornos: preferir añadir únicamente la pública prevista.

## 3. Diagnóstico inicial del servidor

Comandos usados:

```bash
cat /etc/os-release
free -h
df -h
sudo ufw status verbose
sudo ss -ltnp | grep ':80'
```

Hallazgo: Nginx escuchaba en `0.0.0.0:80` / `[::]:80`, pero UFW permitía 22 y 8080, no 80. Solución:

```bash
sudo ufw allow 80/tcp
sudo ufw status numbered
```

Tras ello se pudo acceder a `Welcome to nginx!`. No se deshabilitó UFW.

## 4. Herramientas de build

- Git instalado: **2.43.0**.
- Node.js no estaba instalado inicialmente.
- NVM instalado para el usuario `fede`: **0.40.3**.
- Node.js mediante NVM: **v24.22.0**.
- npm: **11.19.1**.
- Binario Node dentro de `/home/fede/.nvm/versions/node/...`, no instalación global `/usr/bin/node`.

Instalación de Node con NVM:

```bash
nvm install 24
nvm alias default 24
nvm use 24
node --version
npm --version
which node
```

En nuevas sesiones SSH, si `nvm` no estuviera cargado, revisar su inicialización en el perfil del usuario.

## 5. Directorios

```text
/home/fede/TierrasDeNadie   # repositorio fuente + build
/var/www/tierras-de-nadie   # solo artefactos estáticos publicados
```

Preparación:

```bash
sudo mkdir -p /var/www/tierras-de-nadie
sudo chown fede:fede /var/www/tierras-de-nadie
```

Se mantuvieron fuente y sitio publicado separados.

## 6. Clonar, verificar y compilar

La rama desplegada en este primer corte fue `feat/m0-m1-domain-core`.

```bash
cd ~
git clone --branch feat/m0-m1-domain-core --single-branch https://github.com/framosPrimary/TierrasDeNadie.git
cd ~/TierrasDeNadie
git branch --show-current
npm install
npm run typecheck
npm test
npm run build
ls -lh dist/
```

Resultado observado:
- Dependencias: 44 paquetes; auditoría npm informó 0 vulnerabilidades en ese momento.
- Typecheck correcto.
- Vitest: **11 tests aprobados / 3 archivos**.
- Vite v8.3.4 compiló correctamente, generando `dist/index.html` y `dist/assets/`.

**Deuda de reproducibilidad:** no había `package-lock.json` en el clone inicial. `npm install` lo generó localmente; debe versionarse en el repo tras revisión y migrar a `npm ci` en CI y procedimientos repetibles. Evitar copiar `node_modules` al directorio web.

## 7. Publicación manual inicial

```bash
cd ~/TierrasDeNadie
cp -a dist/. /var/www/tierras-de-nadie/
ls -lah /var/www/tierras-de-nadie/
```

Configuración creada en `/etc/nginx/sites-available/tierras-de-nadie`:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name 159.89.91.131;

    root /var/www/tierras-de-nadie;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Se habilitó mediante enlace a `/etc/nginx/sites-enabled/tierras-de-nadie` y se deshabilitó el enlace `sites-enabled/default`, sin borrar el archivo original de configuración por defecto.

Validación y recarga:

```bash
sudo nginx -t
sudo systemctl reload nginx
systemctl status nginx --no-pager
```

`nginx -t` confirmó configuración válida. Después de la recarga, el propietario confirmó que la web del prototipo **funcionaba desde el navegador**.

## 8. Actualización manual futura (propuesta; aún NO ejecutada)

**Atención:** estos pasos están documentados como guía, no como despliegue verificado de un commit posterior. La rama puede cambiar tras el trabajo de reglas.

```bash
cd ~/TierrasDeNadie
git status --short
git pull --ff-only
# Requiere package-lock.json versionado para usar npm ci:
npm install
npm run typecheck
npm test
npm run build
```

La copia directa con `cp` sirve para el laboratorio, pero no es atómica y puede dejar assets anteriores; no constituye un rollback seguro. Antes del próximo despliegue es preferible implementar un directorio de **releases versionadas** y un enlace simbólico `current` con rollback probado.

No ejecutar cambios de la configuración Nginx sin validación previa con `sudo nginx -t`.

## 9. Estado y tareas pendientes — DevOps en pausa

- [x] SSH desde Android / Termux y usuario no-root.
- [x] Diagnóstico de Ubuntu, recursos, UFW y puertos.
- [x] Instalar Nginx; permitir HTTP en UFW.
- [x] Clonar rama, instalar Node con NVM, correr tests y compilar.
- [x] Publicar `dist/` y comprobar sitio públicamente.
- [ ] Commit de `package-lock.json` revisado y usar `npm ci`.
- [ ] Proceso de deploy repetible con releases y rollback.
- [ ] Dominio y HTTPS (actualmente HTTP sin cifrado).
- [ ] Hardening y repaso de reglas firewall / SSH cuando se retome.
- [ ] Automatización de CD, **postergada por decisión del propietario**.
- [ ] Backend para duelo 1v1 online como invitados, con estado autoritativo y cuentas opcionales en una fase posterior.

**Prioridad actual:** gameplay; conseguir una partida completa antes de continuar los laboratorios de despliegue.

## 10. Relación con el arnés

- `docs/game-design/RULES.md`: fuente de verdad de reglas del juego.
- `docs/STATE.md`: situación actual del proyecto.
- `tasks/BACKLOG.md`: prioridades de implementación.
- **Este archivo:** procedimiento operativo e historial del primer despliegue.

No mezclar procedimientos de infraestructura con reglas de combate o héroes.
