# Arduino Nano digisisendi laiendus

Luua skeem, mille sisendiks on 2 digitaalset signaali:
1. mehaaniline kontakt, mis on aktiivne kui loogiline 0 (Active Low)
2. suvaline digitaalne signaal, mis on aktiivne kui loogiline 1 (Active High)

Arvestades ühe inverteeritud sisendiga, käitub skeem kui OR värav

**Üldine lahendus**

![general solution with black box](./digi_1.png)

## Võimalikud lahendused

**Kasutades dioode**

NOR võib asendada ka NAND'ga kuna inverteri jaoks vahet pole, samuti võib kasutada PNP transistori

**+**
  * kerge kokku panna
  * nõuab vähe komponente

**-**
  * väljund langeb dioodi pingelangu võrra
    

![OR gate with diodes](./digi_2.png)

**Transistoritega - OR ja NOR**

Üldiselt kasutatakse NOR kuna väljund on otse toitega ühendatud, OR väljund on baas emitter siirde tõttu madalam kui totepinge.

**+**
  * vähe komponente

**-**
  * ?

![NOR and OR using pnp transistors](./digi_3.png)

**Kasutades ainult antud loogiliste väravate integraalskeeme**

NOR võib asendada ka NAND'ga kuna inverteri jaoks vahet pole, samuti võib kasutada PNP transistori

Pull-down takistit võib välja jätta kui konfigureerida seda Arduino Nano's

**+**
  * ei tea
    
**-**
  * ...

![OR gate using NAND ICs](./digi_4.png)

