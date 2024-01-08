# WS - Praktika: Ahots Oharrak

## Aurkibidea

- [Sarrera](#sarrera)
- [Build](#build)
    - [Betebeharrak](#betebeharrak)
    - [Nola eraiki](#nola-eraiki)
        - [MongoDB](#mongodb)
        - [Node](#node)
    - [Portu zehatzean hasieratu](#portu-zehatzean-hasieratu)
    - [Debugging moduan hasieratu](#debugging-moduan-hasieratu)
- [Egileak](#egileak)


## Sarrera

Nabigatzailea erabiliz ahots oharrak grabatu eta partekatzeko aplikazio bat garatu nahi dugu. Hasieran sei funtzionalitate izango ditugu: erabiltzaile bat kautotu (*login/logout*), audio bat grabatu, entzun, zerbitzarian gorde, audio baten esteka lortu (gero partekatu ahal izateko) eta ezabatu. Audio baten esteka irekitzen badugu, audioa entzuteko aukera izango dugu soilik.

## Build

### Betebeharrak

- *npm*
- *Node.js*
- *MongoDB*

### Nola eraiki

Biltegia klonatu:

```bash
git clone https://github.com/Josu-A/ws-ahots-oharra.git
cd ws-ahots-oharra
```

#### MongoDB

`mongodb` zerbitzaria hasieratu zure zerbitzu kudeatzailearekin.

`mongo` edo `mongosh` exekutatu datu-basea sortzeko:

```
use grabaketak
db.createCollection('userdata')
db.createCollection('users')
db.createCollection('storedSessions')
```

#### Node

npm dependenziak instalatu:

```bash
npm install
```

Proiektua eraiki:

```bash
npm build
```

Beharrezko sekretuak gorde `.env` fitxategian:

|Aldagaia|Balioa|
|---|---|
|SESSION\_SECRET|Sesioak zifratzeko string bat|
|GOOGLE\_CLIENT\_ID|Google-eko *OAuth 2.0 Client ID* egiaztagiriaren *Client ID*-a|
|GOOGLE\_CLIENT\_SECRET|Google-eko *OAuth 2.0 Client ID* egiaztagiriaren *Client secret*-a|
|GITHUB\_CLIENT\_ID|GitHub-eko *OAuth* aplikazioaren *Client ID*-a|
|GITHUB\_CLIENT\_SECRET|GitHub-eko *OAuth* aplikazioaren *Client Secrets*-a|
|TWITTER\_CONSUMER\_ID|Twitter-eko *OAuth 1.0* aplikazioaren *Consumer API Key*-a|
|TWITTER\_CONSUMER\_SECRET|Twitter-eko *OAuth 1.0* aplikazioaren *Consumer API Secret*-a|


`./utils/config.js` fitxategiko `myUrl` aldagaia aldatu zure webguneko domeinura.

Sare aplikazioa hasieratu defektuzko 3100 portuan:

```bash
npm start
```

### Portu zehatzean hasieratu

Portu zehatz batean hasieratzeko, *x* portu zenbakia izanik:

<details><summary>cross-env erabilz</summary>

```bash
cross-env PORT=x npm start
```

</details>

<details><summary>edo...</summary>

<details><summary>Linux / MacOS</summary>

```bash
PORT=x npm start
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

</details>

### Debugging moduan hasieratu

<details><summary>cross-env erabiliz</summary>

```bash
cross-env DEBUG=ahots-oharra:* npm start
```

</details>

<details><summary>edo...</summary>

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

</details>

## Egileak

**Josu Aguinaga**-k eginda eta [ws.aguijos.eus](https://ws.aguijos.eus)-en publikatua.
