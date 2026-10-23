# Roadmap — v0.7 Alpha: partida local completa verificable

Fecha: 22/10/2026. Responsable de diseño: el Profe. Base: RULES.md §21–23.
**Alcance:** una partida 1v1 local, de principio a fin, con mazo de prueba explícitamente provisional, sin afirmar que reproduce las 50 cartas finales. Modo online por invitación es hito posterior; diseño de motor siempre independiente de UI y apto para servidor autoritativo.

## Forma de iterar acordada
1. Trabajar hasta el hito de la versión definido aquí; no prometer trabajo asíncrono.
2. Registrar cada hallazgo en `DECISIONS_AND_BLOCKERS.md` con origen, impacto, gravedad, propuesta y estado.
3. **Bloqueante:** si la decisión impide implementar fielmente o verificar los criterios del hito, detener únicamente la función afectada y elevar la duda al usuario/el Profe antes de fijar comportamiento. No introducir reglas silenciosas.
4. **No bloqueante:** continuar otras funciones, marcar suposiciones solo como simulación de prueba y no como reglamento.
5. Al final del hito: unificar todas las dudas en documento de revisión, resolver con el Profe, actualizar RULES y tests.
6. Después de revisión y CI verde, preparar PR/revisión e integración a Git. **Solo tras aprobación explícita** guiar el deploy manual en DigitalOcean; no desplegar por cuenta propia.

## Hitos / criterios de aceptación

### H0 — Baseline CI y trazabilidad
- [ ] Auditar rama y ejecutar typecheck, tests y build; corregir fallos existentes y registrar los resultados reales.
- [ ] Mantener fuente única de reglas y ejemplos trazados a preguntas numeradas del cuestionario.
- [ ] No sustituir los catálogos definitivos faltantes por contenido inventado presentado como real.

### H1 — Estado del tablero y efectos
- [ ] Primera carta debajo del terreno con elemento inferior habilitado; excepción de muralla según carta.
- [ ] Superposición por arriba/abajo, sin igualdad obligatoria de símbolos; visibilidad por elemento.
- [ ] Destrucción de última carta rival sin desplazar otras, reactivación únicamente de aportes persistentes.
- [ ] Orden de resolución superior → inferior en dos activaciones simultáneas.
- [ ] Arquería y murallas acumuladas por línea; daño ya aplicado no se revierte por tapado posterior.
- [ ] Tests de encadenamiento, primer turno, destapado y catapultas.

### H2 — Economía y acciones del Mercado
- [ ] Oro acumulado dentro de la ronda, cero al reiniciar; ventana habilitada por activación y cierre explícito.
- [ ] Compras múltiples y repetidas, con comprobación de saldo; curación a daño cero se pierde.
- [ ] Intercambio: tomar 2 del rival y devolver 2 al rival desde mano del comprador; sin revelar información privada a otros.
- [ ] Carta extra de 3 oro: robo y jugada inmediata, sin contar como normal; combo recursivo con oro.
- [ ] Sin mazo suficiente: acción de robo cancelada sin remezclar descarte.
- [ ] Catapulta sin objetivo puede activar sinergias, aunque no destruya cartas.
- [ ] Tests de costes, integridad del mazo, ventanas y jugadas extra.

### H3 — Rondas, héroes y resultado
- [ ] 10 cartas normales cada jugador, al menos una por terreno; jugador sin cartas espera al rival.
- [ ] Rondas 1–3 y desempate de 5; reinicio total de estado de ronda menos terrenos y daño recibido.
- [ ] Sorteo inicial, elección de inicio por perdedor en rondas 2/3, desempate iniciado por perdedor del sorteo.
- [ ] 10 héroes sin repetición por ronda, reparto de 4 por jugador tras conocer mano; selección de 2, titular oculto hasta revelación conjunta; suplente privado; un enroque y suspensión irreversible al llegar a 3 cartas.
- [ ] Habilidades finales y báculos dependen de catálogo del Profe; no dar gameplay «reglamentario completo» hasta cargarlo.
- [ ] Tests de privacidad, rondas, primer jugador, empate y segundo desempate según especificación confirmada.

### H4 — Prueba de punta a punta y corte de versión
- [ ] UI local permite completar una partida sin editar estado a mano.
- [ ] Tests críticos de regresión + typecheck + build + CI verde en commit final.
- [ ] Simulaciones reproducibles (seed fijo) y log de jugadas para validar con el Profe.
- [ ] Documento de revisión de todas las dudas y diferencias entre demo y juego físico.
- [ ] Congelar la v0.7 Alpha solo cuando se apruebe explícitamente la revisión.
- [ ] Preparar instrucciones de despliegue manual; deploy únicamente tras autorización y con operador humano.

## Fuera de alcance de esta versión
- Online 1v1 por enlace, cuentas opcionales, IA estratégica, publicación Steam/Android, arte final.
- Implementación definitiva de héroes/báculos hasta recibir imágenes y textos. Si se requieren para cierre reglamentario, se detendrá esa parte como bloqueante.
