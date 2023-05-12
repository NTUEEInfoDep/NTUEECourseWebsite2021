# NTUEECourse2021

2021 年新版臺大電機系預選網站 (https://course.ntuee.org/)

## Usage

<div align="center">
<img src="assets/instruction_take3.gif" width=800>
</div>

## Contributors

前端：[朱哲廣](https://github.com/Kenchu123),
email: `b07901016@ntu.edu.tw`

後端：
- [劉奇聖](https://github.com/MortalHappiness), email: `b07901069@ntu.edu.tw`
- [賴群貿](https://github.com/Mecoli1219), email: `b09901186@ntu.edu.tw`

## Quick Start (Development mode)

### Start dataset
```shell
$ docker-compose -f docker-compose_dev.yml up -d
```
Check whether ```mongodb``` and ```redisdb``` are running
```shell
$ docker ps
```

### Base setup
```shell
$ cp .env.defaults .env                                  # Run one time
$ pnpm database reset                                    # Database reset, run whenever you want
$ pnpm install
```

### Start distribute server (OPTIONAL: If you want to test distribute)
Checkout ```distribute-server/README.md```

### Start backend first
```shell
$ pnpm dev-server           # This will run a develop server
```
Goto `http://localhost:8000` to see the swagger.

### Start frontend first
```bash
$ pnpm start
```
Goto `http://localhost:3000` to see the website.
