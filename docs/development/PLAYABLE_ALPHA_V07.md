# Tierras de Nadie — v0.7 Alpha local jugable (candidata de prueba)

Fecha: 04/11/2026. Rama: `feat/m0-m1-domain-core`.

**Estado:** demo experimental compilable y **partida completa automatizada verificada** en CI. Pendiente de prueba humana con dos jugadores y aprobación del usuario/Profe. **No es una versión reglamentaria final y no está desplegada.**

## Qué se puede hacer en esta demo

1. Iniciar una partida local para dos personas que comparten dispositivo (hotseat).
2. Repartir diez cartas por persona desde un mazo ficticio de 50 cartas.
3. Sortear quién comienza la primera ronda.
4. Ofrecer cuatro héroes sin duplicados entre ambos jugadores; cada persona elige dos y su titular. La otra persona espera tras pantalla de relevo.
5. Revelar titulares al completar ambas selecciones, y usar el único enroque antes de bloqueo del suplente.
6. Encadenar cartas en los tres terrenos, en extremos y decidiendo cuál cubre a cuál. La primera carta activa solo el elemento inferior.
7. Resolver espadas, escudos, arquería, murallas, catapultas, curación, oro y compras de Mercado.
8. Comprar varias opciones, intercambiar dos cartas por dos y jugar inmediatamente las cartas extra compradas.
9. Completar las jugadas normales incluso cuando el rival ya terminó; evitar agotar las jugadas sin haber visitado los tres terrenos.
10. Resolver el combate al final de ronda, acumular daño y reiniciar manos, terrenos, recursos y héroes conservando el marcador.
11. Rondas 2/3: quien va perdiendo elige quién comienza; si el marcador está empatado se usa **provisionalmente** el perdedor del sorteo inicial.
12. Tras tercera ronda empatada, jugar un desempate con cinco cartas por jugador. Si persiste el empate, la demo muestra un empate sin aplicar el desempate secundario aún indefinido.
13. Terminar con ganador o empate provisional, y volver a empezar.

## Qué NO está terminado / qué NO debe presentarse como reglamento

- **Mazo:** 50 cartas ficticias de DEMO, no el set físico definitivo; llegaron 45 imágenes de cartas de batalla y quedan por confirmar otras cinco.
- **Héroes:** solo Cleptan tiene habilidad mecánica implementada, 2 puntos de daño una vez por turno si se activa oro y Mercado. Los otros nueve son héroes «demo» sin habilidades activas.
- **Báculos:** efectos específicos aún no integrados; existen ejemplos documentados, pero no catálogo completo convertido a motor.
- **Tapado y destrucción:** el motor usa un modelo de caras cubiertas simplificado. La geometría de destapado y qué ocurre con murallas impresas tapadas sigue necesitando validación.
- **Iniciativa en marcador empatado** al comienzo de rondas 2 y 3: regla provisional declarada arriba.
- **Desempate secundario** luego de la ronda de cinco cartas: no se fuerza ganador ficticio.
- **Mercado — selección de dos cartas rivales:** la UI local de prueba usa las dos primeras cartas de la mano rival y, por lo tanto, **no es apta para juego online con información secreta**. Debe rediseñarse el protocolo antes de 1v1 remoto.
- **Privacidad:** hotseat no es equivalente a dos dispositivos independientes; compartir dispositivo requiere respetar la pantalla «Pasá el dispositivo».
- **Gráficos:** se usan símbolos y mazo de prueba, todavía no los assets del Profe integrados al runtime.
- No hay sincronización de red, autenticación ni IA de oponente.

## Cómo ejecutar sin desplegar

Necesitás un entorno con Node.js 24 y npm (PC o equipo de desarrollo):

```bash
git clone https://github.com/framosPrimary/TierrasDeNadie.git
cd TierrasDeNadie
git switch feat/m0-m1-domain-core
npm install
npm run typecheck
npm test
npm run dev
```

Abrir en el navegador local la dirección que muestra Vite. Para probar el artefacto estático compilado, descargar **tierras-de-nadie-alpha-local** de la ejecución de GitHub Actions de la rama, extraer el ZIP y servir sus archivos con un servidor HTTP local (por ejemplo `npx serve`). No abrir el `index.html` por `file://`, porque los módulos del navegador pueden quedar bloqueados.

**El artefacto se publica como archivo de CI, NO como sitio web ni servidor desplegado.** La ejecución CI corre `npm run typecheck`, `npm test`, `npm run build` y genera el archivo `dist` descargable. El archivo expira tras 30 días, por lo que para obtener una compilación actualizada se usa la última ejecución verde.

## Guion de prueba manual por dos personas

1. Iniciar nueva prueba. P1 elige héroes y pasa dispositivo en pantalla de relevo; P2 hace lo mismo.
2. Verificar que aparece el titular público y que la mano mostrada pertenece a quien juega. El jugador puede realizar su enroque cuando está habilitado.
3. Jugar una carta en cada terreno antes de que se agoten las diez jugadas normales. Intentar colocar la última carta en terreno ya visitado sin haber visitado otro; verificar rechazo.
4. Al generar oro, comprobar la ventana Mercado, realizar dos compras si alcanza saldo y cerrar explícitamente. Comprobar paso de dispositivo.
5. Activar oro con Cleptan: confirmar 2 puntos de daño una única vez en ese turno.
6. Terminar diez jugadas cada uno y pulsar «Resolver ronda». Continuar con la siguiente ronda y nueva selección de héroes.
7. Completar hasta fin de partida; si hay empate al final de la tercera ronda, jugar desempate de cinco cartas.
8. Registrar capturas y discrepancias con Profe; no publicar ni desplegar hasta aprobar.

## Validación automatizada

- `src/domain/game/fullMatch.test.ts`: partida simulada de principio a fin, rondas 1–3 y desempate si es necesario.
- `src/domain/game/initiative.test.ts`: sorteo de inicio, elector de rondas posteriores y desempate.
- `src/domain/game/playCard.test.ts`: reserva de jugadas para los tres terrenos y alternancia.
- `src/domain/game/cleptan.test.ts`: una activación por turno, carta extra y cambio de turno.
- `src/App.test.tsx`: validación inicial de pantalla de selección sin manos visibles.
- Suites previas: superposición, combate, Mercado, héroes, ciclos de partida.

**Criterio de cierre:** esta edición se considera *candidata de alpha jugable local* al obtener CI verde y artefacto; solo se convierte en versión **aprobada** después de una prueba humana y revisión de los puntos abiertos.

## Política de despliegue

**Prohibido desplegar automáticamente.** No modificar DigitalOcean ni ningún otro proveedor. La elección futura de servidor es independiente de la validación local. Cualquier despliegue exige autorización expresa del usuario.
