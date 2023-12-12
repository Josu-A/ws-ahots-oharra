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

Sare aplikazioa hasieratu defektuzko 3100 portuan:

```bash
npm start
```

### Portu zehatzean hasieratu

Portu zehatz batean hasieratzeko, *x* portu zenbakia izanik:

<details><summary>Linux / MacOS</summary>

```bash
set PORT=x & npm start
```

</details>

<details><summary>Windows Command Prompt</summary>

```cmd
set PORT=x & npm start
```

</details>

<details><summary>Windows PowerShell</summary>

```ps
$env:PORT='x'; npm start
```

</details>

### Debugging moduan hasieratu

<details><summary>Linux / MacOS</summary>

```bash
DEBUG=ahots-oharra:* npm start
```

</details>

<details><summary>Windows Command Prompt</summary>

```cmd
set DEBUG=ahots-oharra:* & npm start
```

</details>

<details><summary>Windows PowerShell</summary>

```ps
$env:DEBUG='ahots-oharra:*'; npm start
```

</details>

## Egileak

**Josu Aguinaga**-k eginda eta [ws.aguijos.eus](ws.aguijos.eus)-en publikatua.
