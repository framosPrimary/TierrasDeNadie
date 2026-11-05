# Entrega visual 01 — tablero y encadenamiento para revisión del Profe

**Fecha:** 05/11/2026. **Rama de código:** `feat/m0-m1-domain-core`. **Estado:** candidato visual técnico; sin despliegue automático.

## Qué cambió realmente

- `src/App.tsx` ya no es una colección de botones de depuración: presenta barras de héroes, tres terrenos diferenciados, cadenas del rival y del jugador, mano con selección y controles de encadenamiento, panel de Mercado y estado del combate.
- `src/components/BattleCard.tsx` representa cartas como **dos mitades** (elementos superior/inferior), con cantidad, icono y etiquetas **TAPADO / ACTIVADO / visible**. La muralla impresa va aparte, de acuerdo con el ejemplo confirmado del Profe.
- `src/components/ChainTutorial.tsx` muestra un ejemplo guiado de colocación: terreno vacío → primera espada 3 + muralla → segunda carta por debajo con arco 2. Calcula los estados usando `overlay`, no dibujando una secuencia inconexa.
- `src/styles.css` organiza jerarquías y contraste: escenario distante poco contrastado, terrenos medios y cartas legibles en primer plano, sin neones y sin glow omnipresente.
- `public/art/` incluye tres paisajes pixelados sencillos y dos retratos provisionales no heroizados. Se usan SVG de píxeles para conservar nitidez a diferentes resoluciones. **No equivalen al pixel art final ilustrado por artistas**.
- La selección de héroes, los turnos locales, el Mercado y el flujo de rondas existentes siguen utilizando el motor actual.

## Recorrido de evaluación del Profe

1. Entrar en la nueva interfaz y usar «Modo Profe · Ejemplo interactivo»; sin elegir héroes debe poder ver tres pasos.
2. Confirmar que la primera carta queda **debajo del terreno** con espada inferior 3 visible y muralla 1, mientras el elemento superior está tapado.
3. Confirmar que al encadenar el arco por debajo, la espada 3 permanece visible, la cara superior de la nueva carta queda tapada y el arco inferior 2 se activa. La arquería debe ser evento inmediato una sola vez.
4. Elegir héroes para cada jugador y empezar una partida local.
5. Seleccionar una carta en la mano, elegir uno de los tres terrenos, un extremo y qué carta tapa a cuál; comprobar que el estado de visibilidad cambia.
6. Activar oro y usar Mercado; verificar oro, curación, catapultas y final de turno antes de pasar el dispositivo.
7. Probar con un segundo jugador qué simboliza cada mitad y si pueden explicarse las cadenas sin mirar el historial.
8. Registrar diferencias con los ejemplos físicos del Profe.

## Qué falta — no anunciar como videojuego terminado

- Las cadenas del tablero son **representaciones simplificadas** con cartas compactas parcialmente superpuestas. El motor aún no conoce la geometría física completa para destapar al destruir cartas intermedias. No dibujar esa geometría como regla confirmada.
- El tutorial cubre **espada/muralla/arco**, no el catálogo de báculos; sus habilidades siguen pendientes de implementación específica.
- El mazo y la mayor parte de los héroes continúan siendo **contenido ficticio**. Los sprites son placeholders originales para probar jerarquía visual, no los diseños finales.
- La selección y devolución de cartas rivales en Mercado sigue siendo una interfaz local experimental.
- No hay animaciones finales, efectos de sonido, multijugador remoto ni IA rival.
- La representación fue verificada con TypeScript, tests y build en GitHub Actions; **una prueba humana en navegador sigue pendiente**.
- Las imágenes de mockup que se exploraron en la conversación no están integradas como imagen de fondo única; la interfaz está construida con componentes, iconos y recursos reutilizables.

## Integración y despliegue

No se cambió Nginx, DigitalOcean ni la carpeta web del servidor. La rama GitHub es la fuente para revisión. Cuando el usuario decida actualizar manualmente el sitio de pruebas, antes debe comprobar CI verde y conservar backup del sitio actual.

```bash
su - fede
cd ~/TierrasDeNadie
git status --short --branch
git fetch origin
git pull --ff-only origin feat/m0-m1-domain-core
npm install --no-package-lock
npm run typecheck
npm test
npm run build
```

**Solo después de confirmar todo verde**, copiar el contenido compilado (`dist/`) a `/var/www/tierras-de-nadie/` tras un respaldo de esa carpeta. La mera ejecución de `git pull` o `npm run build` no actualiza Nginx. No publicar la actualización sin la decisión del propietario.

## Criterio de éxito

El Profe distingue claramente dos mitades de cada carta, elementos visibles/tapados, muro impreso, espada y arco encadenados, y puede señalar exactamente dónde el motor coincide o no con el juego físico.
