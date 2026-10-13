# Tierras de Nadie — Rules

> Estado: v0.3 de trabajo  
> Fuente: video de reglas + validaciones del Director Creativo del 13/10/2026.  
> Este archivo es la fuente de verdad del comportamiento jugable. Si una regla no está definida aquí, no debe inventarse en código.

## 1. Objetivo de la partida

Tierras de Nadie es un juego de cartas de enfrentamiento directo para dos jugadores.

No existe una cantidad de vida inicial. Cada jugador acumula daño recibido.

La partida normal dura 3 rondas. Al finalizar la tercera ronda gana el jugador que haya infligido más daño total al oponente.

Si ambos jugadores terminan empatados, se juega una ronda adicional de desempate con 5 cartas por jugador.

## 2. Componentes

- 3 cartas de Terreno.
- 1 mazo compartido de 50 cartas de doble componente.
- Héroes y componentes adicionales hasta aproximadamente 65 cartas físicas.
- Cada jugador utiliza 2 héroes por ronda, seleccionados entre 4.

## 3. Preparación de ronda

1. Se mezclan las 50 cartas del mazo.
2. Cada jugador recibe 10 cartas.
3. Cada jugador recibe 4 héroes.
4. Cada jugador elige 2 héroes para utilizar durante esa ronda.
5. Comienza el primer turno.

La mano puede contener hasta 10 cartas, salvo efectos pendientes de definición que alteren temporalmente esta regla.

Al finalizar la ronda:
- todas las cartas vuelven al mazo;
- se mezcla nuevamente;
- cada jugador vuelve a recibir 10 cartas;
- cada jugador vuelve a recibir 4 héroes y elige 2.

## 4. Terrenos y líneas

Existen exactamente 3 líneas de terreno.

Cada línea contiene una cadena independiente de cartas de cada jugador.

Los siguientes valores se calculan por línea:
- espadas;
- escudos;
- murallas;
- objetivos de catapulta.

## 5. Encadenamiento

Cada carta posee:
- un elemento superior;
- un elemento inferior.

Una carta puede encadenarse cuando el elemento superior de una carta coincide con el elemento inferior de otra.

La nueva carta puede colocarse:
- por encima de una carta ya jugada;
- por debajo de una carta ya jugada;

siempre que el enlace entre elemento superior e inferior sea válido.

## 6. Turno

Los jugadores alternan turnos.

En un turno normal:
1. el jugador activo juega exactamente 1 carta;
2. elige una de las 3 líneas;
3. elige una posición legal en la cadena;
4. valida el encadenamiento;
5. coloca la carta;
6. resuelve los efectos inmediatos de esa carta;
7. termina el turno;
8. juega el rival.

## 7. Elementos

### 7.1 Espadas
Las espadas representan ataque convencional. Se acumulan por línea y se resuelven al final de la ronda.

### 7.2 Escudos
Los escudos defienden contra espadas. Se acumulan por línea y se restan del ataque de espadas del rival en esa misma línea.

### 7.3 Arquería
La arquería se activa inmediatamente cuando la carta se encadena.

Solo puede ser defendida mediante:
- murallas acumuladas en esa misma línea;
- habilidades de héroe que explícitamente permitan defenderla.

Los escudos no defienden contra arquería.

### 7.4 Murallas
Las murallas son una defensa pasiva acumulativa por línea contra arquería.

### 7.5 Oro
El oro se activa inmediatamente al encadenarse la carta.

Puede gastarse en acciones de Mercado y puede interactuar con habilidades de héroe.

### 7.6 Curación
La curación se activa inmediatamente al encadenarse la carta.

Curarse reduce el daño acumulado recibido.

El daño recibido no puede quedar por debajo de 0.

### 7.7 Catapulta
La catapulta se activa inmediatamente al encadenarse.

Elimina la última carta del oponente de la misma línea de terreno en la que fue encadenada.

## 8. Mercado

### Coste 1 — Cambiar carta
- pagar 1 oro;
- descartar 1 carta de la mano;
- robar 1 carta del mazo.

### Coste 2 — Tomar carta del rival
- pagar 2 de oro;
- tomar 2 cartas de la mano rival;
- elegir 1 para conservar;
- devolver la otra al rival.

### Coste 2 — Curación
- pagar 2 de oro;
- reducir el daño recibido en 2.

### Coste 3 — Contratar catapulta
- pagar 3 de oro;
- contratar una catapulta.

**OPEN-RULE-01:** falta definir la representación exacta de esta contratación y su momento de resolución.

### Coste 3 — Carta extra
- pagar 3 de oro;
- obtener una carta extra para jugar al final de la ronda.

**OPEN-RULE-02:** falta definir si esta compra puede repetirse y cómo se ordenan las cartas extra de ambos jugadores.

**OPEN-RULE-03:** falta definir exactamente cuándo pueden ejecutarse acciones de Mercado dentro del turno.

## 9. Resolución de fin de ronda

Después de que ambos jugadores hayan jugado sus cartas normales y las cartas extra que correspondan, se resuelven las espadas línea por línea.

Para cada línea y para cada jugador:

```text
dañoDeEspada = max(0, espadasPropias - escudosRivales)
```

El daño resultante se suma al daño recibido por el rival.

Cada línea se resuelve de manera independiente.

## 10. Daño

Cada jugador mantiene:

```text
damageReceived >= 0
```

Fuentes conocidas:
- arquería;
- espadas;
- habilidades de héroe;
- otros efectos explícitos.

La curación reduce `damageReceived`, nunca por debajo de 0.

## 11. Héroes

Cada héroe posee una habilidad propia y define su propio timing.

El motor no debe asumir un único momento universal para las habilidades de héroe.

Pendiente incorporar:
- lista de héroes;
- habilidades;
- condiciones;
- prioridades;
- targets.

## 12. Desempate

Si existe empate después de las 3 rondas:
- se juega una ronda adicional;
- cada jugador recibe 5 cartas.

**OPEN-RULE-04:** confirmar si el desempate usa el mismo mulligan de héroes, Mercado y reglas de cartas extra.

## 13. Regla pendiente sobre destrucción

**OPEN-RULE-05:** falta definir qué sucede al destruir una carta cuyo efecto inmediato ya se resolvió o que aporta un efecto pasivo persistente.

## 14. Principio de implementación

El código debe distinguir entre:

- **estado**: daño, oro, mano, cadenas;
- **acción**: jugar carta, usar Mercado, seleccionar héroes;
- **validación**: si una acción está permitida;
- **efecto**: cambios generados por una acción;
- **evento**: algo que ocurrió y puede disparar otros efectos.

No debe codificarse comportamiento no documentado en este archivo.
