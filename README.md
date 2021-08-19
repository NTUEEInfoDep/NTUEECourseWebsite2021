# NTUEECourse2021

2021 年新版臺大電機系預選網站 (https://course.ntuee.org/)

## Usage

<div align="center">
<img src="assets/instruction_take3.gif" width=800>
</div>

## Contributors

前端：[朱哲廣](https://github.com/Kenchu123),
email: `b07901016@ntu.edu.tw`

後端：[劉奇聖](https://github.com/MortalHappiness), email: `b07901069@ntu.edu.tw`

## Quick Start (Development mode)

After cloning this repo, put `students.json` into `./server/database/private-data/`, and then execute the following commands.

For the format and generation of `students.json`, see [password generation](#gen_password).

```shell
$ npm install
$ docker-compose up -d         # This will watch backend code changes
$ npm run dev-server           # This will run a develop server
$ npm start
```

Goto `http://localhost:3000` to see the website.

## Frontend Develop (With Docker)

```bash
# start frontend, backend, database
$ docker-compose up -d
```

To see frontend logs

```
$ docker logs -f ntueecoursewebsite2021_frontend_1
```

To reset database

```bash
$ docker exec -it ntueecoursewebsite2021_backend_1 npm run database reset
```

## Frontend Develop (Without Docker)

```bash
$ npm install
$ npm start
# in another terminal
cd server
docker-compose up -d
cd ..
npm run database reset
npm run dev-server
