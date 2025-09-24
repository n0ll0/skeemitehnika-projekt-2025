# Arduino digital input extension

Create a circuit that takes in 2 digital signals:
1. mechanical contact that is Active Low (pulled to ground when closed)
2. any digital signal that is Active High

The output should be equivalent to OR

**General solution**

![general solution with black box](./digi_1.png)

## Possible solutions

**Using diodes**

![OR gate with diodes](./digi_2.png)

**Transistors - OR and NOR**

![NOR and OR using pnp transistors](./digi_3.png)

**Using only IC logic gates**

the NOR can be replaced with NAND, there is no difference

also the pull down resistor can be configured in the Arduino Nano so that can be removed aswell

![OR gate using NAND ICs](./digi_4.png)
