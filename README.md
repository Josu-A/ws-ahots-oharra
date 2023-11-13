# WS - Praktika: Ahots Oharrak (Frontend)

## Sarrera

Nabigatzailea erabiliz ahots oharrak grabatu eta partekatzeko aplikazio bat garatu nahi dugu. Hasieran sei funtzionalitate izango ditugu: erabiltzaile bat kautotu (*login/logout*), audio bat grabatu, entzun, zerbitzarian gorde, audio baten esteka lortu (gero partekatu ahal izateko) eta ezabatu. Audio baten esteka irekitzen badugu, audioa entzuteko aukera izango dugu soilik.

## Build

### Betebeharrak

- *npm*
- *Node.js*

### Nola eraiki

Biltegia klonatu:

```bash
git clone https://github.com/Josu-A/ws-ahots-oharra.git
cd ws-ahots-oharra
```

npm dependenziak instalatu:

```bash
npm install
```

Sare aplikazioa hasieratu defektuzko 3000 portuan:

```bash
npm start
```

Portu zehatz batean hasieratzeko, *x* portu zenbakia izanik:

```bash
set PORT=x & npm start
```

Debuging moduan hasieratzeko:

```bash
set DEBUG=ws-ahots-oharra:* & npm start
```
